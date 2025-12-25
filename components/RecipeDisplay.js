import React from 'react';

const RecipeDisplay = ({ recipe, loading, modelName }) => {
  if (loading) return React.createElement('div', { className: "p-10 text-center glass-panel" }, "Procesando pigmentos...");
  if (!recipe) return null;

  return React.createElement('div', { className: "glass-panel rounded-2xl p-8 space-y-6" },
    React.createElement('h2', { className: "text-2xl font-bold text-white" }, "Receta Maestra"),
    React.createElement('div', { className: "flex items-center space-x-8" },
      React.createElement('div', { className: "w-20 h-20 rounded-full", style: { backgroundColor: recipe.targetColorHex } }),
      React.createElement('span', { className: "text-white" }, "→"),
      React.createElement('div', { className: "w-20 h-20 rounded-full", style: { backgroundColor: recipe.resultColorHex } })
    ),
    React.createElement('ul', { className: "space-y-2" },
      recipe.items.map((item, idx) => React.createElement('li', { key: idx, className: "flex justify-between p-3 bg-stone-900 rounded-lg" },
        React.createElement('span', { className: "text-stone-100" }, `${item.paintName} (${item.brand})`),
        React.createElement('span', { className: "font-bold text-orange-400" }, `${item.drops} gotas`)
      ))
    ),
    React.createElement('p', { className: "italic text-stone-400" }, recipe.instructions)
  );
};

export default RecipeDisplay;