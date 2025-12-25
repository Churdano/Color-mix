import { GoogleGenAI, Type } from "@google/genai";

const defaultGeminiAi = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_PROMPT = `
Actúa como un pintor de miniaturas profesional experto en teoría del color.
Tu objetivo es crear una receta de mezcla para igualar un color HEX específico.
Solo puedes usar las pinturas proporcionadas en el inventario.

IMPORTANTE: DEBES RESPONDER ÚNICAMENTE EN FORMATO JSON VÁLIDO.
No incluyas texto antes ni después del JSON (nada de markdown, nada de '''json).
`;

const buildUserPrompt = (targetHex, userInventory) => {
    const inventoryList = userInventory.map(p => `${p.brand} - ${p.name}`).join(', ');
    return `
    Color Objetivo HEX: ${targetHex}.
    
    Inventario disponible:
    [${inventoryList}]
    
    Genera un JSON con esta estructura exacta:
    {
      "resultColorHex": "código hex aproximado del resultado",
      "matchAccuracy": número 0-100,
      "instructions": "breve consejo de mezcla en español",
      "items": [
        { "paintName": "Nombre", "brand": "Marca", "drops": número }
      ]
    }
    `;
};

const callOpenRouter = async (apiKey, model, prompt) => {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" } 
            })
        });
        if (!response.ok) {
            const err = await response.json();
            const errorMessage = err.error?.message || `OpenRouter Error: ${response.statusText}`;
            if (errorMessage.includes("data policy") || errorMessage.includes("matching your data policy")) {
                throw new Error("ERROR DE PRIVACIDAD: Los modelos gratuitos requieren habilitar el registro de datos en OpenRouter. Revisa la Configuración.");
            }
            throw new Error(errorMessage);
        }
        const data = await response.json();
        return data.choices[0]?.message?.content || "";
    } catch (error) {
        if (error.message.includes("ERROR DE PRIVACIDAD")) throw error;
        throw new Error(error.message || "Error conectando con OpenRouter");
    }
};

const callGemini = async (model, userPrompt, customApiKey) => {
    try {
        const client = customApiKey ? new GoogleGenAI({ apiKey: customApiKey }) : defaultGeminiAi;
        const response = await client.models.generateContent({
            model: model, 
            contents: userPrompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    resultColorHex: { type: Type.STRING },
                    matchAccuracy: { type: Type.NUMBER },
                    instructions: { type: Type.STRING },
                    items: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          paintName: { type: Type.STRING },
                          brand: { type: Type.STRING },
                          drops: { type: Type.NUMBER }
                        },
                        required: ["paintName", "brand", "drops"]
                      }
                    }
                  },
                  required: ["resultColorHex", "matchAccuracy", "instructions", "items"]
                }
            }
        });
        return response.text || "";
    } catch (error) {
        throw new Error(error.message || "Error conectando con Gemini");
    }
};

export const generatePaintRecipe = async (targetHex, userInventory, settings) => {
  const provider = settings?.provider || 'gemini';
  const modelId = settings?.modelId || 'gemini-2.5-flash';
  const userPrompt = buildUserPrompt(targetHex, userInventory);
  let jsonText = "";
  if (provider === 'openrouter') {
      if (!settings?.openRouterApiKey) throw new Error("Falta la API Key de OpenRouter. Configúrala en Ajustes.");
      jsonText = await callOpenRouter(settings.openRouterApiKey, modelId, userPrompt);
  } else {
      jsonText = await callGemini(modelId, userPrompt, settings?.geminiApiKey);
  }
  try {
      const cleanJson = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanJson);
      return { targetColorHex: targetHex, ...data };
  } catch (parseError) {
      throw new Error("La IA generó una respuesta inválida. Intenta de nuevo o cambia de modelo.");
  }
};