import React from 'react';

const HistorySidebar = ({ isOpen, onClose, history, onSelectRecipe, onDeleteRecipe }) => {
  if (!isOpen) return null;
  return React.createElement('div', { className: "fixed inset-0 z-50 flex justify-end" },
    React.createElement('div', { className: "absolute inset-0 bg-black/40", onClick: onClose }),
    React.createElement('div', { className: "relative w-full max-w-xs bg-stone-900 h-full p-6 overflow-y-auto" },
      React.createElement('h2', { className: "text-xl font-bold text-white mb-6" }, "Historial"),
      history.length === 0 ? React.createElement('p', { className: "text-stone-500" }, "Sin registros") :
      history.map(item => React.createElement('div', { key: item.id, className: "bg-stone-800 p-4 rounded-xl mb-4 cursor-pointer", onClick: () => onSelectRecipe(item.recipe) },
        React.createElement('div', { className: "flex space-x-2 mb-2" },
          React.createElement('div', { className: "w-6 h-6 rounded-full", style: { backgroundColor: item.recipe.targetColorHex } }),
          React.createElement('span', { className: "text-white text-xs" }, "→"),
          React.createElement('div', { className: "w-6 h-6 rounded-full", style: { backgroundColor: item.recipe.resultColorHex } })
        ),
        React.createElement('p', { className: "text-[10px] text-stone-400" }, new Date(item.timestamp).toLocaleString())
      ))
    )
  );
};

export default HistorySidebar;