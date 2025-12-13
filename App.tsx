import React, { useState } from 'react';
import ColorPicker from './components/ColorPicker';
import InventoryManager from './components/InventoryManager';
import RecipeDisplay from './components/RecipeDisplay';
import { generatePaintRecipe } from './services/geminiService';
import { Paint, PixelColor, MixingRecipe } from './types';
import { COMMON_PAINTS } from './constants';

const App: React.FC = () => {
  // Initialize with a few basics so the user isn't completely empty
  const [inventory, setInventory] = useState<Paint[]>(COMMON_PAINTS.slice(0, 5));
  const [targetColor, setTargetColor] = useState<PixelColor | null>(null);
  const [recipe, setRecipe] = useState<MixingRecipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleColorSelect = (color: PixelColor) => {
    setTargetColor(color);
    // Reset recipe when new color is picked
    setRecipe(null);
    setError(null);
  };

  const handleGenerateRecipe = async () => {
    if (!targetColor) return;
    if (inventory.length === 0) {
      setError("¡Necesitas agregar pinturas a tu inventario para poder mezclar!");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await generatePaintRecipe(targetColor.hex, inventory);
      setRecipe(result);
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servicio de IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">ChromaMix</h1>
                    <p className="text-xs text-gray-400">Asistente para Figuras</p>
                </div>
            </div>
            {/* Simple API Status Indicator */}
            <div className="flex items-center space-x-1">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                 <span className="text-xs text-gray-500">Online</span>
            </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Intro Text */}
        <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Mezcla el Color Perfecto
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
                Sube una imagen, selecciona un pixel y deja que la IA calcule la fórmula exacta usando tus pinturas de Vallejo, Ink Color, Citadel y más.
            </p>
        </div>

        {/* Step 1: Inventory */}
        <section>
             <InventoryManager inventory={inventory} setInventory={setInventory} />
        </section>

        {/* Step 2: Image & Color */}
        <section>
            <ColorPicker onColorSelect={handleColorSelect} />
        </section>

        {/* Action Button */}
        <section className="flex justify-center sticky bottom-6 z-40 pointer-events-none">
            <button
                onClick={handleGenerateRecipe}
                disabled={!targetColor || loading}
                className={`
                    pointer-events-auto
                    px-8 py-3 rounded-full font-bold text-lg shadow-2xl transform transition-all 
                    flex items-center space-x-2 border border-indigo-400/30
                    ${!targetColor 
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-105 active:scale-95 hover:shadow-indigo-500/50'
                    }
                `}
            >
                {loading ? (
                    <span>Calculando...</span>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>Crear Receta</span>
                    </>
                )}
            </button>
        </section>

        {/* Error Message */}
        {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        {/* Step 3: Result */}
        <section ref={(el) => {
            // Auto scroll to recipe when it appears
            if (recipe && el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }}>
            <RecipeDisplay recipe={recipe} loading={loading} />
        </section>

      </main>
      
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-600 text-xs border-t border-gray-800 mt-12">
        <p>© 2024 ChromaMix. Powered by Gemini 2.5.</p>
        <p className="mt-1">Compatible con Vallejo, Ink Color Argentina, Citadel, Army Painter y más.</p>
      </footer>
    </div>
  );
};

export default App;
