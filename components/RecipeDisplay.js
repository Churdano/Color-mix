import React, { useState, useEffect } from 'react';

const RecipeDisplay = ({ recipe, loading, modelName }) => {
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    if (recipe) setScaleFactor(1);
  }, [recipe]);

  const handleDropsChange = (index, newAmountStr) => {
    if (!recipe) return;
    const newAmount = parseFloat(newAmountStr);
    if (isNaN(newAmount) || newAmount < 0) return;
    const baseDrops = recipe.items[index].drops;
    if (baseDrops === 0) return;
    setScaleFactor(newAmount / baseDrops);
  };

  if (loading) {
    return React.createElement('div', { className: "w-full p-12 text-center animate-pulse glass-panel rounded-2xl border-orange-500/20" },
      React.createElement('div', { className: "flex justify-center mb-8" },
        React.createElement('div', { className: "relative" },
          React.createElement('div', { className: "absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-20 animate-ping" }),
          React.createElement('div', { className: "relative bg-stone-900 rounded-full p-4 border border-orange-500/50 shadow-lg" },
            React.createElement('svg', { className: "animate-spin h-10 w-10 text-orange-400", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" },
              React.createElement('circle', { className: "opacity-25", cx: 12, cy: 12, r: 10, stroke: "currentColor", strokeWidth: 4 }),
              React.createElement('path', { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
            )
          )
        )
      ),
      React.createElement('p', { className: "text-orange-200 text-xl font-medium tracking-wide" }, `Analizando pigmentos con ${modelName}...`),
      React.createElement('p', { className: "text-stone-500 text-sm mt-3" }, "El alquimista está formulando la mezcla exacta.")
    );
  }

  if (!recipe) return null;

  return React.createElement('div', { className: "glass-panel rounded-2xl overflow-hidden shadow-2xl mt-8 animate-fade-in-up ring-1 ring-orange-500/10" },
    React.createElement('div', { className: "bg-gradient-to-r from-stone-900 to-stone-800 p-6 border-b border-white/5 flex justify-between items-center" },
      React.createElement('h2', { className: "text-2xl font-bold text-stone-100 flex items-center" },
          React.createElement('span', { className: "p-2.5 bg-orange-500/10 rounded-xl mr-4 border border-orange-500/20" },
            React.createElement('svg', { className: "h-6 w-6 text-orange-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
              React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" })
            )
          ),
          "Receta Maestra"
      ),
      React.createElement('span', { className: "text-[10px] bg-stone-950/50 border border-stone-700/50 px-3 py-1.5 rounded-full text-stone-400 uppercase tracking-wider font-semibold" }, `By ${modelName}`)
    ),
    React.createElement('div', { className: "p-8 grid grid-cols-1 md:grid-cols-2 gap-12" },
      React.createElement('div', { className: "flex flex-col items-center justify-center bg-stone-950/30 rounded-2xl p-8 border border-white/5 shadow-inner" },
        React.createElement('div', { className: "flex items-center space-x-12 mb-8" },
          React.createElement('div', { className: "text-center" }, React.createElement('div', { className: "w-24 h-24 rounded-full border-4 border-stone-800 mb-4", style: { backgroundColor: recipe.targetColorHex } }), React.createElement('span', { className: "text-xs font-bold text-stone-500 uppercase tracking-widest" }, "Objetivo")),
          React.createElement('div', { className: "text-stone-600" }, React.createElement('svg', { className: "h-10 w-10", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M17 8l4 4m0 0l-4 4m4-4H3" }))),
          React.createElement('div', { className: "text-center" }, React.createElement('div', { className: "w-24 h-24 rounded-full border-4 border-stone-700 mb-4", style: { backgroundColor: recipe.resultColorHex } }), React.createElement('span', { className: "text-xs font-bold text-stone-500 uppercase tracking-widest" }, "Mezcla"))
        ),
        React.createElement('div', { className: "w-full bg-stone-800 rounded-full h-6 overflow-hidden border border-stone-700" },
          React.createElement('div', { 
            className: `h-full transition-all duration-1000 ease-out ${recipe.matchAccuracy > 90 ? 'bg-gradient-to-r from-green-600 to-emerald-400' : recipe.matchAccuracy > 75 ? 'bg-gradient-to-r from-yellow-600 to-amber-400' : 'bg-gradient-to-r from-red-600 to-orange-500'}`, 
            style: { width: `${recipe.matchAccuracy}%` } 
          })
        ),
        React.createElement('div', { className: "flex justify-between w-full mt-3 px-1" },
          React.createElement('span', { className: "text-xs text-stone-500 font-medium" }, "Precisión de color"),
          React.createElement('span', { className: `text-lg font-bold font-mono ${recipe.matchAccuracy > 90 ? 'text-emerald-400' : 'text-stone-300'}` }, `${recipe.matchAccuracy}%`)
        )
      ),
      React.createElement('div', null,
        React.createElement('div', { className: "flex justify-between items-end mb-6 border-b border-stone-700/50 pb-4" },
          React.createElement('h3', { className: "text-stone-300 text-sm uppercase tracking-widest font-bold" }, "Composición"),
          React.createElement('button', { onClick: () => setScaleFactor(1), className: "text-[10px] bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded-lg text-orange-300 transition-colors border border-stone-700" }, "⟲ Restaurar Base")
        ),
        React.createElement('ul', { className: "space-y-4" },
          recipe.items.map((item, idx) => React.createElement('li', { key: idx, className: "flex items-center justify-between bg-stone-900/40 border border-stone-700/50 p-4 rounded-xl" },
            React.createElement('div', { className: "flex items-center mr-4" },
              React.createElement('div', { className: "w-1.5 h-8 bg-orange-500 rounded-full mr-4 opacity-50" }),
              React.createElement('div', { className: "flex flex-col" },
                React.createElement('span', { className: "text-stone-200 font-bold" }, item.paintName),
                React.createElement('span', { className: "text-xs text-stone-500" }, item.brand)
              )
            ),
            React.createElement('div', { className: "flex items-center bg-stone-950 rounded-lg p-2 border border-stone-800" },
              React.createElement('input', { type: "number", min: "0", step: "0.1", value: parseFloat((item.drops * scaleFactor).toFixed(1)), onChange: (e) => handleDropsChange(idx, e.target.value), className: "bg-transparent text-white font-bold text-center w-16 outline-none appearance-none font-mono text-lg" }),
              React.createElement('span', { className: "text-[10px] text-stone-600 px-1 font-bold uppercase tracking-wider" }, "gotas")
            )
          ))
        )
      )
    ),
    React.createElement('div', { className: "p-8 bg-stone-900/60 border-t border-white/5" },
      React.createElement('div', { className: "flex items-start" },
        React.createElement('div', { className: "bg-orange-500/10 p-3 rounded-xl mr-5 flex-shrink-0 border border-orange-500/20" },
          React.createElement('svg', { className: "h-6 w-6 text-orange-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
            React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
          )
        ),
        React.createElement('div', null,
          React.createElement('h4', { className: "text-sm font-bold text-stone-400 uppercase tracking-wider mb-2" }, "Instrucciones de la IA"),
          React.createElement('p', { className: "text-stone-300 text-lg leading-relaxed font-light italic" }, `"${recipe.instructions}"`)
        )
      )
    )
  );
};

export default RecipeDisplay;