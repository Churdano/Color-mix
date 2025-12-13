import React from 'react';
import { MixingRecipe } from '../types';

interface RecipeDisplayProps {
  recipe: MixingRecipe | null;
  loading: boolean;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, loading }) => {
  if (loading) {
    return (
      <div className="w-full p-8 text-center animate-pulse">
        <div className="flex justify-center mb-4">
            <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
        <p className="text-gray-400 text-sm">El alquimista está calculando tu mezcla...</p>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="w-full bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden mt-6">
      <div className="bg-gradient-to-r from-indigo-900 to-gray-900 p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          Receta de Mezcla
        </h2>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Colors Comparison */}
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-6">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full shadow-lg border-2 border-gray-600 mb-2" style={{ backgroundColor: recipe.targetColorHex }}></div>
                    <span className="text-xs text-gray-400 uppercase">Objetivo</span>
                </div>
                <div className="text-gray-500">→</div>
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full shadow-lg border-2 border-gray-600 mb-2" style={{ backgroundColor: recipe.resultColorHex }}></div>
                    <span className="text-xs text-gray-400 uppercase">Resultado</span>
                </div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-4 mt-2 overflow-hidden relative">
                <div 
                    className={`h-full ${recipe.matchAccuracy > 90 ? 'bg-green-500' : recipe.matchAccuracy > 75 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                    style={{ width: `${recipe.matchAccuracy}%` }}
                ></div>
            </div>
            <span className="text-sm font-mono text-gray-300">Precisión: {recipe.matchAccuracy}%</span>
        </div>

        {/* Drops List */}
        <div>
            <h3 className="text-gray-300 text-sm uppercase tracking-wider font-semibold mb-4 border-b border-gray-700 pb-2">Proporciones (Gotas)</h3>
            <ul className="space-y-3">
                {recipe.items.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
                        <div className="flex flex-col">
                            <span className="text-white font-medium">{item.paintName}</span>
                            <span className="text-xs text-indigo-300">{item.brand}</span>
                        </div>
                        <div className="flex items-center">
                             <div className="bg-indigo-600 text-white font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center shadow">
                                {item.drops}
                             </div>
                             <span className="ml-2 text-xs text-gray-400">gotas</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-indigo-900/20 border-t border-gray-700">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mt-1 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-300 text-sm italic leading-relaxed">"{recipe.instructions}"</p>
          </div>
      </div>
    </div>
  );
};

export default RecipeDisplay;
