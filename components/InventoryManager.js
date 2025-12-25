import React, { useState, useMemo } from 'react';
import { COMMON_PAINTS, BRANDS } from '../constants.js';
import ColorChartCalibrator from './ColorChartCalibrator.js';

const InventoryManager = ({ inventory, setInventory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeBrandTab, setActiveBrandTab] = useState(BRANDS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customName, setCustomName] = useState('');
  const [customHex, setCustomHex] = useState('#ffffff');
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [availablePaints, setAvailablePaints] = useState(COMMON_PAINTS);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const togglePaint = (paint) => {
    const exists = inventory.find(p => p.id === paint.id);
    if (exists) {
      setInventory(inventory.filter(p => p.id !== paint.id));
    } else {
      setInventory([...inventory, paint]);
    }
  };

  const addCustomPaint = () => {
    if (!customName.trim()) return;
    const newPaint = {
      id: `custom-${Date.now()}`,
      brand: activeBrandTab,
      name: customName,
      category: 'base',
      hex: customHex
    };
    setAvailablePaints([...availablePaints, newPaint]);
    setInventory([...inventory, newPaint]);
    setCustomName('');
  };

  const confirmClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setInventory([]);
    setConfirmingClear(false);
  };

  const handleUpdatePaintColor = (paintId, newHex) => {
    setAvailablePaints(prev => prev.map(p => p.id === paintId ? { ...p, hex: newHex } : p));
    setInventory(prev => prev.map(p => p.id === paintId ? { ...p, hex: newHex } : p));
  };

  const filteredPaints = useMemo(() => {
    return availablePaints.filter(p => {
        let isBrandMatch = p.brand === activeBrandTab;
        if (!isBrandMatch) return false;
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query);
    });
  }, [activeBrandTab, searchQuery, availablePaints]);

  return React.createElement('div', { className: "glass-panel rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ring-1 ring-white/5" },
    React.createElement('button', { 
      onClick: () => setIsOpen(!isOpen),
      className: "w-full p-6 flex justify-between items-center bg-gradient-to-r from-stone-800/40 to-stone-900/40 hover:bg-stone-800/60 transition-colors focus:outline-none group"
    },
      React.createElement('div', { className: "flex items-center space-x-5" },
        React.createElement('div', { className: `p-3 rounded-xl transition-all duration-300 ${inventory.length > 0 ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-900/40' : 'bg-stone-700 text-stone-400'}` },
          React.createElement('svg', { className: "h-6 w-6", fill: "currentColor", viewBox: "0 0 20 20" },
            React.createElement('path', { fillRule: "evenodd", d: "M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z", clipRule: "evenodd" })
          )
        ),
        React.createElement('div', { className: "text-left" },
          React.createElement('h2', { className: "text-xl font-bold text-stone-100 group-hover:text-orange-200 transition-colors" }, "Mis Pigmentos"),
          React.createElement('p', { className: "text-sm text-stone-400" }, 
            inventory.length > 0 ? React.createElement('span', { className: "text-orange-400 font-medium" }, `${inventory.length} colores en la paleta`) : 'Define tu inventario disponible'
          )
        )
      ),
      React.createElement('div', { className: "flex items-center" },
        React.createElement('div', { className: "flex -space-x-2 mr-6 overflow-hidden" },
          inventory.slice(0, 5).map(p => React.createElement('div', { key: p.id, className: "w-9 h-9 rounded-full border-2 border-stone-800 shadow-md", style: { backgroundColor: p.hex || '#ccc' } })),
          inventory.length > 5 && React.createElement('div', { className: "w-9 h-9 rounded-full bg-stone-700 border-2 border-stone-800 flex items-center justify-center text-[10px] font-bold text-stone-300" }, `+${inventory.length - 5}`)
        ),
        React.createElement('div', { className: `bg-stone-700/50 p-2 rounded-full transition-transform duration-300 border border-white/5 ${isOpen ? 'rotate-180 bg-stone-600' : ''}` },
          React.createElement('svg', { className: "h-5 w-5 text-stone-300", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
            React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" })
          )
        )
      )
    ),
    isOpen && React.createElement('div', { className: "border-t border-white/5 bg-stone-950/30 flex flex-col animate-fade-in-up" },
      React.createElement('div', { className: "flex overflow-x-auto border-b border-white/5 bg-stone-900/40" },
        BRANDS.map(brand => React.createElement('button', {
            key: brand,
            onClick: () => { setActiveBrandTab(brand); setIsCalibrating(false); },
            className: `px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all relative focus:outline-none ${activeBrandTab === brand ? 'text-orange-100 bg-white/5' : 'text-stone-500 hover:text-stone-300 hover:bg-white/5'}`
        }, brand, activeBrandTab === brand && React.createElement('span', { className: "absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-red-500" })))
      ),
      React.createElement('div', { className: "p-6" },
        activeBrandTab !== 'Other' && !isCalibrating && React.createElement('div', { className: "mb-6 flex justify-end" },
          React.createElement('button', { onClick: () => setIsCalibrating(true), className: "text-xs flex items-center space-x-2 text-orange-300 hover:text-white bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 px-4 py-2 rounded-lg transition-all" },
            React.createElement('svg', { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
              React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" })
            ),
            React.createElement('span', null, "Calibrar Carta de Colores")
          )
        ),
        isCalibrating ? React.createElement(ColorChartCalibrator, { paints: filteredPaints, onUpdatePaintColor: handleUpdatePaintColor, onClose: () => setIsCalibrating(false), brandName: activeBrandTab }) :
        React.createElement(React.Fragment, null,
          React.createElement('div', { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5" },
            activeBrandTab !== 'Other' ? React.createElement('div', { className: "relative flex-grow group" },
              React.createElement('div', { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" },
                React.createElement('svg', { className: "h-5 w-5 text-stone-500", fill: "currentColor", viewBox: "0 0 20 20" },
                  React.createElement('path', { fillRule: "evenodd", d: "M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z", clipRule: "evenodd" })
                )
              ),
              React.createElement('input', { type: "text", placeholder: `Buscar en ${activeBrandTab}...`, value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-10 py-3 bg-stone-900/50 border border-stone-700 rounded-xl focus:ring-1 focus:ring-orange-500 text-sm text-stone-100" })
            ) : React.createElement('div', { className: "flex-grow text-sm text-stone-500 italic" }, "Pinturas personalizadas"),
            inventory.length > 0 && React.createElement('div', { className: "flex-shrink-0" },
              confirmingClear ? React.createElement('div', { className: "flex items-center space-x-2 p-1 bg-red-900/20 rounded-lg" },
                React.createElement('span', { className: "text-xs text-red-300 font-medium pl-2" }, "¿Borrar?"),
                React.createElement('button', { onClick: confirmClear, className: "px-3 py-1.5 rounded-md bg-red-600 text-white text-xs font-bold uppercase" }, "Sí"),
                React.createElement('button', { onClick: () => setConfirmingClear(false), className: "px-3 py-1.5 rounded-md bg-stone-700 text-stone-300 text-xs font-medium uppercase" }, "No")
              ) : React.createElement('button', { onClick: () => setConfirmingClear(true), className: "flex items-center justify-center space-x-1 px-4 py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-bold uppercase" },
                React.createElement('svg', { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                  React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" })
                ),
                React.createElement('span', null, "Vaciar")
              )
            )
          ),
          React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2" },
            filteredPaints.map(paint => {
                const isSelected = inventory.some(p => p.id === paint.id);
                return React.createElement('button', { key: paint.id, onClick: () => togglePaint(paint), className: `flex items-center p-2.5 rounded-xl border transition-all ${isSelected ? 'bg-orange-900/20 border-orange-600/50 shadow-inner' : 'bg-white/5 border-transparent hover:border-stone-600'}` },
                    React.createElement('div', { className: "w-9 h-9 rounded-full border border-stone-600 mr-3 flex-shrink-0", style: { backgroundColor: paint.hex } },
                        isSelected && React.createElement('div', { className: "w-full h-full flex items-center justify-center bg-black/20 rounded-full" },
                            React.createElement('svg', { className: "w-5 h-5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }))
                        )
                    ),
                    React.createElement('div', { className: "text-left overflow-hidden" },
                        React.createElement('p', { className: `text-sm truncate ${isSelected ? 'text-white font-semibold' : 'text-stone-300'}` }, paint.name),
                        React.createElement('p', { className: "text-[10px] truncate text-stone-500" }, paint.id)
                    )
                );
            })
          ),
          React.createElement('div', { className: "mt-6 pt-5 border-t border-white/5" },
            React.createElement('h4', { className: "text-xs font-bold text-stone-400 uppercase tracking-wider mb-3" }, `Mezcla Personalizada para "${activeBrandTab}"`),
            React.createElement('div', { className: "flex items-center gap-3" },
              React.createElement('input', { type: "color", value: customHex, onChange: (e) => setCustomHex(e.target.value), className: "w-11 h-11 rounded-lg border-2 border-stone-600 cursor-pointer bg-transparent" }),
              React.createElement('input', { type: "text", value: customName, onChange: (e) => setCustomName(e.target.value), placeholder: "Nombre del pigmento...", className: "bg-stone-900/50 text-white rounded-lg px-4 py-2.5 text-sm flex-grow border border-stone-600" }),
              React.createElement('button', { onClick: addCustomPaint, disabled: !customName.trim(), className: "bg-orange-700 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold disabled:opacity-50" }, "Añadir")
            )
          )
        )
      )
    )
  );
};

export default InventoryManager;