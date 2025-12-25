import React from 'react';

const HistorySidebar = ({ isOpen, onClose, history, onSelectRecipe, onDeleteRecipe }) => {
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return React.createElement(React.Fragment, null,
    React.createElement('div', { 
      className: `fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`,
      onClick: onClose
    }),
    React.createElement('div', { 
      className: `fixed top-0 right-0 h-full w-full max-w-sm bg-stone-900 border-l border-stone-700 shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`
    },
      React.createElement('div', { className: "h-full flex flex-col" },
        React.createElement('div', { className: "p-6 border-b border-stone-800 bg-stone-950/50 flex justify-between items-center" },
          React.createElement('h2', { className: "text-xl font-bold text-stone-100 flex items-center gap-2" },
            React.createElement('svg', { className: "h-5 w-5 text-orange-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
              React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" })
            ),
            "Bitácora de Mezclas"
          ),
          React.createElement('button', { onClick: onClose, className: "p-2 text-stone-400 hover:text-white" },
            React.createElement('svg', { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }))
          )
        ),
        React.createElement('div', { className: "flex-1 overflow-y-auto p-4 space-y-3" },
          history.length === 0 ? React.createElement('div', { className: "h-full flex flex-col items-center justify-center text-stone-500 opacity-60" }, React.createElement('p', null, "No hay recetas guardadas aún.")) :
          history.map((item) => React.createElement('div', { key: item.id, className: "bg-stone-800/40 border border-stone-700 rounded-xl p-4 group relative" },
            React.createElement('div', { className: "cursor-pointer", onClick: () => { onSelectRecipe(item.recipe); onClose(); } },
              React.createElement('div', { className: "flex justify-between items-start mb-3" },
                React.createElement('span', { className: "text-xs text-stone-500 font-mono" }, formatDate(item.timestamp)),
                React.createElement('div', { className: `px-2 py-0.5 rounded text-[10px] font-bold ${item.recipe.matchAccuracy > 90 ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-500'}` }, `${item.recipe.matchAccuracy}% Match`)
              ),
              React.createElement('div', { className: "flex items-center gap-4 mb-3" },
                React.createElement('div', { className: "w-8 h-8 rounded-full border border-stone-600", style: { backgroundColor: item.recipe.targetColorHex } }),
                React.createElement('div', { className: "text-stone-600" }, "→"),
                React.createElement('div', { className: "w-8 h-8 rounded-full border border-stone-600", style: { backgroundColor: item.recipe.resultColorHex } })
              ),
              React.createElement('p', { className: "text-xs text-stone-400 italic" }, `"${item.recipe.instructions}"`)
            ),
            React.createElement('button', { onClick: () => onDeleteRecipe(item.id), className: "absolute top-3 right-3 text-stone-600 hover:text-red-400 opacity-0 group-hover:opacity-100" },
              React.createElement('svg', { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }))
            )
          ))
        )
      )
    )
  );
};

export default HistorySidebar;