import React, { useState } from 'react';
import { COMMON_PAINTS, BRANDS } from '../constants.js';

const InventoryManager = ({ inventory, setInventory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [brand, setBrand] = useState(BRANDS[0]);

  const togglePaint = (paint) => {
    const exists = inventory.find(p => p.id === paint.id);
    if (exists) setInventory(inventory.filter(p => p.id !== paint.id));
    else setInventory([...inventory, paint]);
  };

  return React.createElement('div', { className: "glass-panel rounded-2xl overflow-hidden" },
    React.createElement('button', { onClick: () => setIsOpen(!isOpen), className: "w-full p-6 flex justify-between items-center bg-stone-800/40" },
      React.createElement('h2', { className: "text-xl font-bold text-stone-100" }, "Mis Pigmentos"),
      React.createElement('span', { className: "text-orange-400 font-bold" }, `${inventory.length} seleccionados`)
    ),
    isOpen && React.createElement('div', { className: "p-6" },
      React.createElement('div', { className: "flex overflow-x-auto pb-4 space-x-4" },
        BRANDS.map(b => React.createElement('button', { key: b, onClick: () => setBrand(b), className: `px-4 py-2 rounded-lg whitespace-nowrap ${brand === b ? 'bg-orange-600 text-white' : 'bg-stone-800 text-stone-400'}` }, b))
      ),
      React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto" },
        COMMON_PAINTS.filter(p => p.brand === brand).map(paint => {
          const isSelected = inventory.some(i => i.id === paint.id);
          return React.createElement('button', { key: paint.id, onClick: () => togglePaint(paint), className: `p-2 rounded-xl flex items-center border ${isSelected ? 'border-orange-500 bg-orange-900/20' : 'border-stone-700 bg-stone-900/40'}` },
            React.createElement('div', { className: "w-6 h-6 rounded-full mr-2", style: { backgroundColor: paint.hex } }),
            React.createElement('span', { className: "text-xs text-stone-200 truncate" }, paint.name)
          );
        })
      )
    )
  );
};

export default InventoryManager;