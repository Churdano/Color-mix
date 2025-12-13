import React, { useState, useMemo } from 'react';
import { Paint } from '../types';
import { COMMON_PAINTS, BRANDS } from '../constants';
import ColorChartCalibrator from './ColorChartCalibrator';

interface InventoryManagerProps {
  inventory: Paint[];
  setInventory: React.Dispatch<React.SetStateAction<Paint[]>>;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ inventory, setInventory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeBrandTab, setActiveBrandTab] = useState(BRANDS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customName, setCustomName] = useState('');
  const [customHex, setCustomHex] = useState('#ffffff');
  const [confirmingClear, setConfirmingClear] = useState(false);
  
  // Local state for available paints (initialized from Constants, but mutable)
  const [availablePaints, setAvailablePaints] = useState<Paint[]>(COMMON_PAINTS);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const togglePaint = (paint: Paint) => {
    // Check by ID
    const exists = inventory.find(p => p.id === paint.id);
    if (exists) {
      setInventory(inventory.filter(p => p.id !== paint.id));
    } else {
      setInventory([...inventory, paint]);
    }
  };

  const addCustomPaint = () => {
    if (!customName.trim()) return;
    const newPaint: Paint = {
      id: `custom-${Date.now()}`,
      brand: activeBrandTab,
      name: customName,
      category: 'base',
      hex: customHex
    };
    // Add to local available paints as well so it persists in the list view
    setAvailablePaints([...availablePaints, newPaint]);
    setInventory([...inventory, newPaint]);
    setCustomName('');
  };

  const handleClearClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmingClear(true);
  };

  const confirmClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInventory([]);
    setConfirmingClear(false);
  };

  const cancelClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmingClear(false);
  };

  const handleUpdatePaintColor = (paintId: string, newHex: string) => {
    // 1. Update in available list
    const updatedAvailable = availablePaints.map(p => 
        p.id === paintId ? { ...p, hex: newHex } : p
    );
    setAvailablePaints(updatedAvailable);

    // 2. Update in user inventory if it exists there
    const updatedInventory = inventory.map(p => 
        p.id === paintId ? { ...p, hex: newHex } : p
    );
    setInventory(updatedInventory);
  };

  // Group paints by brand and apply search filter
  const filteredPaints = useMemo(() => {
    return availablePaints.filter(p => {
        let isBrandMatch = false;
        if (activeBrandTab === 'Citadel') {
            isBrandMatch = p.brand === 'Citadel';
        } else {
            isBrandMatch = p.brand === activeBrandTab;
        }

        if (!isBrandMatch) return false;

        if (!searchQuery.trim()) return true;

        const query = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(query) || 
               p.id.toLowerCase().includes(query);
    });
  }, [activeBrandTab, searchQuery, availablePaints]);

  const handleTabChange = (brand: string) => {
      setActiveBrandTab(brand);
      setSearchQuery('');
      setIsCalibrating(false); // Reset mode when changing tabs
  };

  return (
    <div className="w-full bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
        <button 
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full p-4 flex justify-between items-center bg-gray-800 hover:bg-gray-750 transition-colors focus:outline-none"
        >
            <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="text-left">
                    <h2 className="text-lg font-bold text-white">Mis Pinturas</h2>
                    <p className="text-xs text-gray-400">
                        {inventory.length > 0 
                            ? `${inventory.length} colores seleccionados` 
                            : 'Selecciona las pinturas que tienes'}
                    </p>
                </div>
            </div>
            <div className="flex items-center">
                <div className="flex -space-x-2 mr-4 overflow-hidden">
                    {inventory.slice(0, 5).map(p => (
                        <div key={p.id} className="w-6 h-6 rounded-full border border-gray-600" style={{backgroundColor: p.hex || '#ccc'}}></div>
                    ))}
                    {inventory.length > 5 && (
                        <div className="w-6 h-6 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-[10px] text-white">
                            +{inventory.length - 5}
                        </div>
                    )}
                </div>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </button>

      {isOpen && (
        <div className="border-t border-gray-700 bg-gray-900/50 flex flex-col">
          
          {/* Brand Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-700 scrollbar-hide">
            {BRANDS.map(brand => (
                <button
                    key={brand}
                    type="button"
                    onClick={() => handleTabChange(brand)}
                    className={`
                        px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative focus:outline-none
                        ${activeBrandTab === brand ? 'text-white' : 'text-gray-400 hover:text-gray-200'}
                    `}
                >
                    {brand}
                    {activeBrandTab === brand && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500"></span>
                    )}
                </button>
            ))}
          </div>

          <div className="p-4">
             {/* Calibration Mode Toggle */}
             {activeBrandTab !== 'Other' && !isCalibrating && (
                <div className="mb-4 flex justify-end">
                    <button 
                        onClick={() => setIsCalibrating(true)}
                        className="text-xs flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-full hover:bg-indigo-500/10 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        <span>Calibrar Carta de Colores</span>
                    </button>
                </div>
             )}

             {isCalibrating ? (
                 <ColorChartCalibrator 
                    paints={filteredPaints} 
                    onUpdatePaintColor={handleUpdatePaintColor}
                    onClose={() => setIsCalibrating(false)}
                    brandName={activeBrandTab}
                 />
             ) : (
                <>
                    {/* Toolbar: Search & Clear Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        {/* Search Input */}
                        {activeBrandTab !== 'Other' ? (
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder={`Buscar en ${activeBrandTab}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-white placeholder-gray-400 outline-none"
                                />
                                {searchQuery && (
                                    <button 
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ) : <div className="flex-grow text-sm text-gray-400">Pinturas personalizadas</div>}

                        {/* Delete All Button (Changed to Inline Confirmation) */}
                        {inventory.length > 0 && (
                            <div className="flex-shrink-0">
                                {confirmingClear ? (
                                    <div className="flex items-center space-x-2 animate-fade-in">
                                        <span className="text-xs text-red-300 font-medium">¿Borrar todo?</span>
                                        <button
                                            type="button"
                                            onClick={confirmClear}
                                            className="px-2 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 text-xs font-bold uppercase transition-colors shadow-sm"
                                        >
                                            Sí
                                        </button>
                                        <button
                                            type="button"
                                            onClick={cancelClear}
                                            className="px-2 py-1.5 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 text-xs font-medium uppercase transition-colors"
                                        >
                                            No
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleClearClick}
                                        className="flex items-center justify-center space-x-1 px-3 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-xs font-semibold uppercase tracking-wide"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span>Borrar Todo</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Paint Grid */}
                    {activeBrandTab !== 'Other' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {filteredPaints.map(paint => {
                                const isSelected = inventory.some(p => p.id === paint.id);
                                return (
                                    <button
                                        key={paint.id}
                                        type="button"
                                        onClick={() => togglePaint(paint)}
                                        className={`
                                            flex items-center p-2 rounded-lg border transition-all group focus:outline-none
                                            ${isSelected 
                                                ? 'bg-indigo-900/40 border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
                                                : 'bg-gray-800 border-gray-700 hover:border-gray-500'
                                            }
                                        `}
                                    >
                                        <div 
                                            className="w-8 h-8 rounded-full border border-gray-600 shadow-sm flex-shrink-0 mr-3" 
                                            style={{backgroundColor: paint.hex}}
                                        >
                                            {isSelected && (
                                                <div className="w-full h-full flex items-center justify-center bg-black/20 rounded-full">
                                                    <svg className="w-4 h-4 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-left overflow-hidden">
                                            <p className={`text-sm truncate ${isSelected ? 'text-white font-medium' : 'text-gray-300'}`}>
                                                {paint.name}
                                            </p>
                                            <p className="text-[10px] text-gray-500 truncate">{paint.id}</p>
                                        </div>
                                    </button>
                                );
                            })}
                            {filteredPaints.length === 0 && (
                                <p className="col-span-full text-center text-gray-500 py-4 text-sm">
                                    {searchQuery ? 'No se encontraron pinturas con ese código/nombre.' : 'No hay colores predefinidos para esta marca.'}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 text-sm py-4">
                            Usa la sección de abajo para agregar pinturas de otras marcas manualmente.
                        </div>
                    )}

                    {/* Manual Add Section */}
                    <div className="mt-6 pt-4 border-t border-gray-700">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Añadir Manualmente a "{activeBrandTab}"
                        </h4>
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                value={customHex}
                                onChange={(e) => setCustomHex(e.target.value)}
                                className="w-10 h-10 rounded border-none bg-transparent cursor-pointer"
                                title="Selecciona el color aproximado"
                            />
                            <input
                                type="text"
                                value={customName}
                                onChange={(e) => setCustomName(e.target.value)}
                                placeholder="Nombre de la pintura..."
                                className="bg-gray-700 text-white rounded px-3 py-2 text-sm flex-grow outline-none border border-gray-600 focus:border-indigo-500 placeholder-gray-500"
                                onKeyDown={(e) => e.key === 'Enter' && addCustomPaint()}
                            />
                            <button
                                type="button"
                                onClick={addCustomPaint}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!customName.trim()}
                            >
                                Añadir
                            </button>
                        </div>
                    </div>
                </>
             )}

          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;