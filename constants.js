export const AI_MODELS = [
  { id: 'gemini-3-flash-preview', name: 'Google Gemini 3 Flash (Recomendado)', provider: 'gemini' },
  { id: 'gemini-3-pro-preview', name: 'Google Gemini 3 Pro (Alta Calidad)', provider: 'gemini' },
  { id: 'mistralai/devstral-2512:free', name: 'Mistral Devstral 2512 (Free)', provider: 'openrouter' },
  { id: 'nex-agi/deepseek-v3.1-nex-n1:free', name: 'DeepSeek v3.1 Nex (Free)', provider: 'openrouter' },
  { id: 'amazon/nova-2-lite-v1:free', name: 'Amazon Nova 2 Lite (Free)', provider: 'openrouter' },
  { id: 'qwen/qwen3-coder:free', name: 'Qwen 3 Coder (Free)', provider: 'openrouter' },
];

const p = (id, brand, name, hex, category = 'base') => ({
  id, brand, name, hex, category
});

export const COMMON_PAINTS = [
  p('70.951', 'Vallejo Model Color', 'White (Blanco)', '#FFFFFF'),
  p('70.919', 'Vallejo Model Color', 'Cold White (Blanco Frío)', '#EFF4F5'),
  p('70.918', 'Vallejo Model Color', 'Ivory (Hueso)', '#F4E8CE'),
  p('70.820', 'Vallejo Model Color', 'Off White (Blanco Pergamino)', '#E6DFC6'),
  p('70.952', 'Vallejo Model Color', 'Lemon Yellow (Amarillo Limón)', '#FFF200'),
  p('70.953', 'Vallejo Model Color', 'Flat Yellow (Amarillo Mate)', '#F7C325'),
  p('70.909', 'Vallejo Model Color', 'Vermilion (Bermellón)', '#E64539'),
  p('70.957', 'Vallejo Model Color', 'Flat Red (Rojo Mate)', '#B52F34'),
  p('70.926', 'Vallejo Model Color', 'Red (Rojo)', '#D12A2F'),
  p('70.959', 'Vallejo Model Color', 'Purple (Púrpura)', '#643467'),
  p('70.925', 'Vallejo Model Color', 'Blue (Azul Intenso)', '#20468E'),
  p('70.963', 'Vallejo Model Color', 'Medium Blue (Azul Medio)', '#426896'),
  p('70.961', 'Vallejo Model Color', 'Sky Blue (Azul Cielo)', '#6CB2D6'),
  p('70.969', 'Vallejo Model Color', 'Park Green (Verde Parque)', '#3C6642'),
  p('70.942', 'Vallejo Model Color', 'Light Green (Verde Claro)', '#8EC662'),
  p('70.928', 'Vallejo Model Color', 'Light Flesh (Carne Clara)', '#EBC3A4'),
  p('70.815', 'Vallejo Model Color', 'Basic Skintone (Carne Base)', '#EBB99F'),
  p('70.984', 'Vallejo Model Color', 'Flat Brown (Marrón Mate)', '#5C3A2E'),
  p('70.950', 'Vallejo Model Color', 'Black (Negro)', '#1A1A1A'),
  p('70.997', 'Vallejo Model Color', 'Silver (Plata)', '#E3E4E5', 'metallic'),
  p('70.996', 'Vallejo Model Color', 'Gold (Oro)', '#D4AF37', 'metallic'),
  p('1501', 'Ink Color', 'Incoloro Extensor', '#F0F0F0', 'layer'),
  p('1508', 'Ink Color', 'Blanco Mate', '#FFFFFF'),
  p('1531', 'Ink Color', 'Rojo Templario', '#E03E26'),
  p('1545', 'Ink Color', 'Azul de Medianoche', '#1D3F82'),
  p('1599', 'Ink Color', 'Negro Mate', '#1C1C1B'),
  p('gw-abaddon', 'Citadel', 'Abaddon Black', '#0B0B0B'),
  p('gw-mephiston', 'Citadel', 'Mephiston Red', '#961115'),
  p('gw-macragge', 'Citadel', 'Macragge Blue', '#0D407F'),
];

export const BRANDS = [
  'Vallejo Model Color',
  'Vallejo Model Air',
  'Vallejo Game Color',
  'Vallejo Xpress Color',
  'Vallejo Surface Primer',
  'Vallejo Liquid Metal',
  'Vallejo Metal Color',
  'Vallejo Game Color FX',
  'Ink Color',
  'Acuarel',
  'Citadel',
  'Army Painter',
  'Other'
];