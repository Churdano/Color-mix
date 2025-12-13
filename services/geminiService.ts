import { GoogleGenAI, Type } from "@google/genai";
import { MixingRecipe, Paint } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePaintRecipe = async (
  targetHex: string,
  userInventory: Paint[]
): Promise<MixingRecipe> => {
  const inventoryList = userInventory.map(p => `${p.brand} - ${p.name}`).join(', ');

  const prompt = `
    Actúa como un pintor de miniaturas profesional experto en teoría del color.
    
    Objetivo: Crear una receta de mezcla para igualar el color HEX: ${targetHex}.
    
    Restricción estricta: Solo puedes usar las siguientes pinturas que tengo en mi inventario:
    [${inventoryList}]
    
    Salida requerida:
    1. Una receta precisa medida en "gotas" (proporciones relativas).
    2. Estima el código HEX del color resultante de esta mezcla.
    3. Un breve consejo de mezcla o matiz.
    4. Indica un porcentaje de precisión (0-100) de qué tan cerca quedará el color.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resultColorHex: { type: Type.STRING, description: "Hex code of the resulting mix" },
            matchAccuracy: { type: Type.NUMBER, description: "Percentage of accuracy 0-100" },
            instructions: { type: Type.STRING, description: "Short mixing advice in Spanish" },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  paintName: { type: Type.STRING },
                  brand: { type: Type.STRING },
                  drops: { type: Type.NUMBER, description: "Number of drops" },
                },
                required: ["paintName", "brand", "drops"]
              }
            }
          },
          required: ["resultColorHex", "matchAccuracy", "instructions", "items"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response text from Gemini");

    const data = JSON.parse(jsonText);
    
    return {
      targetColorHex: targetHex,
      ...data
    } as MixingRecipe;

  } catch (error) {
    console.error("Error generating recipe:", error);
    throw new Error("No se pudo generar la receta. Verifica tu inventario o intenta nuevamente.");
  }
};
