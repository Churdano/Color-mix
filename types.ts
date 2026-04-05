
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
  suggestions?: string[]; // Suggested paints to buy if match accuracy is low
}

export interface RecipeHistoryItem {
  id: string;
  timestamp: number;
  recipe: MixingRecipe;
}

export interface PixelColor {
  r: number;
  g: number;
  b: number;
  hex: string;
  x: number;
  y: number;
}

export interface UserSettings {
  provider: 'gemini' | 'openrouter';
  openRouterApiKey?: string;
  geminiApiKey?: string;
  modelId: string;
}

export interface UserProfile {
  id: string;
  uid: string;
  name: string;
  inventory: Paint[];
  avatarColor: string; // Hex string for the avatar background
  createdAt: number;
  settings?: UserSettings;
  history: RecipeHistoryItem[];
}
