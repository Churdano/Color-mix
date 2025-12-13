export interface Paint {
  id: string;
  brand: string;
  name: string;
  category: 'base' | 'layer' | 'ink' | 'contrast' | 'metallic' | 'wash' | 'special';
  hex?: string; // Visual representation of the paint
}

export interface RecipeItem {
  paintName: string;
  brand: string;
  drops: number;
  hexCode?: string; // Approximated hex for visualization
}

export interface MixingRecipe {
  targetColorHex: string;
  resultColorHex: string; // The color the mix achieves
  items: RecipeItem[];
  instructions: string;
  matchAccuracy: number; // 0-100%
}

export interface PixelColor {
  r: number;
  g: number;
  b: number;
  hex: string;
  x: number;
  y: number;
}