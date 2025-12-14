
import React, { useState, useEffect } from 'react';
import { MixingRecipe } from '../types';

interface RecipeDisplayProps {
  recipe: MixingRecipe | null;
  loading: boolean;
  modelName: string;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, loading, modelName }) => {
  // Factor de escala para las proporciones (1 = receta original)
  const [scaleFactor, setScaleFactor] = useState(1);

  // Reiniciar la escala cuando cambia la receta (nueva generación)
  useEffect(() => {
    if (recipe) {
      setScaleFactor(1);
    }
  }, [recipe]);

  const handleDropsChange = (index: number, newAmountStr: string) => {
    if (!recipe) return;

    const newAmount = parseFloat(newAmountStr);
    if (isNaN(newAmount) || newAmount < 0) return;

    // Obtenemos la cantidad base original de este item
    const baseDrops = recipe.items[index].drops;
    
    // Si la base es 0, no podemos escalar (evitar división por cero)
    if (baseDrops === 0) return;

    // Calculamos el nuevo factor de escala basado en el cambio
    const newScaleFactor = newAmount / baseDrops;
    setScaleFactor(newScaleFactor);
  };

  if (loading) {
    return (
      <div className="w-full p-10 text-center animate-pulse glass-panel rounded-2xl">
        <div className="flex justify-center mb-6">
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur opacity-30 animate-ping"></div>
                <svg className="animate-spin h-10 w-10 text-indigo-400 relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        </div>
        <p className="text-indigo-200 text-lg font-medium">Generando con {modelName}...</p>
        <p className="text-gray-500 text-xs mt-2">El alquimista está preparando la fórmula.</p>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl mt-8 animate-fade-in-up">
      <div className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 p-5 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center">
            <span className="p-2 bg-white/10 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            </span>
            Receta Maestra
        </h2>
        <span className="text-[10px] bg-black/30 border border-white/10 px-2 py-1 rounded-full text-gray-400">
            🤖 {modelName}
        </span>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Colors Comparison */}
        <div className="flex flex-col items-center justify-center bg-black/20 rounded-xl p-6 border border-white/5">
            <div className="flex items-center space-x-8 mb-6">
                <div className="text-center group">
                    <div className="w-20 h-20 rounded-full shadow-lg border-4 border-gray-700 mb-3 transform group-hover:scale-105 transition-transform" style={{ backgroundColor: recipe.targetColorHex }}></div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Objetivo</span>
                </div>
                <div className="text-gray-600">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                     </svg>
                </div>
                <div className="text-center group">
                    <div className="w-20 h-20 rounded-full shadow-lg border-4 border-white/20 mb-3 transform group-hover:scale-105 transition-transform" style={{ backgroundColor: recipe.resultColorHex }}></div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Resultado</span>
                </div>
            </div>
            
            <div className="w-full bg-gray-700/50 rounded-full h-5 mt-2 overflow-hidden relative shadow-inner">
                <div 
                    className={`h-full relative ${recipe.matchAccuracy > 90 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : recipe.matchAccuracy > 75 ? 'bg-gradient-to-r from-yellow-500 to-amber-400' : 'bg-gradient-to-r from-red-500 to-orange-400'}`} 
                    style={{ width: `${recipe.matchAccuracy}%` }}
                >
                    <div className="absolute inset-0 bg-white/20" style={{backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem'}}></div>
                </div>
            </div>
            <div className="flex justify-between w-full mt-2 px-1">
                <span className="text-xs text-gray-500">Coincidencia</span>
                <span className={`text-sm font-bold font-mono ${recipe.matchAccuracy > 90 ? 'text-green-400' : 'text-gray-300'}`}>{recipe.matchAccuracy}%</span>
            </div>
        </div>

        {/* Drops List */}
        <div>
            <div className="flex justify-between items-end mb-5 border-b border-gray-700/50 pb-3">
              <h3 className="text-gray-200 text-sm uppercase tracking-widest font-bold">Mezcla</h3>
              <button 
                onClick={() => setScaleFactor(1)} 
                className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-indigo-300 transition-colors"
                title="Volver a las gotas originales"
              >
                ⟲ Restaurar original
              </button>
            </div>
            
            <ul className="space-y-3">
                {recipe.items.map((item, idx) => {
                    // Calculamos las gotas actuales basadas en la escala
                    const currentDrops = item.drops * scaleFactor;
                    // Redondeamos para visualización (1 decimal max)
                    const displayDrops = parseFloat(currentDrops.toFixed(1));

                    return (
                      <li key={idx} className="flex items-center justify-between bg-black/20 border border-white/5 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                          <div className="flex flex-col flex-grow mr-4">
                              <span className="text-white font-medium group-hover:text-indigo-300 transition-colors">{item.paintName}</span>
                              <span className="text-xs text-gray-500">{item.brand}</span>
                          </div>
                          <div className="flex items-center bg-gray-900 rounded-lg p-1.5 border border-gray-700 shadow-inner">
                               <input 
                                  type="number"
                                  min="0"
                                  step="0.1"
                                  value={displayDrops}
                                  onChange={(e) => handleDropsChange(idx, e.target.value)}
                                  className="bg-transparent text-white font-bold text-center w-14 outline-none appearance-none font-mono"
                               />
                               <span className="text-[10px] text-gray-500 px-1 select-none font-medium uppercase">gotas</span>
                          </div>
                      </li>
                    );
                })}
            </ul>
            <p className="text-[10px] text-gray-500 mt-3 text-right">
               💡 Ajusta cualquier valor para escalar la receta.
            </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-5 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-t border-white/5">
          <div className="flex items-start">
            <div className="bg-indigo-500/20 p-2 rounded-lg mr-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pt-1 font-medium">"{recipe.instructions}"</p>
          </div>
      </div>
    </div>
  );
};

export default RecipeDisplay;
