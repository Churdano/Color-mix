import React, { useState, useEffect } from 'react';
import ColorPicker from './components/ColorPicker.js';
import InventoryManager from './components/InventoryManager.js';
import RecipeDisplay from './components/RecipeDisplay.js';
import UserSelector from './components/UserSelector.js';
import SettingsModal from './components/SettingsModal.js';
import HistorySidebar from './components/HistorySidebar.js';
import { generatePaintRecipe } from './services/geminiService.js';
import { COMMON_PAINTS, AI_MODELS } from './constants.js';

const LOCAL_STORAGE_KEY = 'colormix_users_v1';
const BACKGROUND_IMAGE_URL = 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071&auto=format&fit=crop';

const generateRandomColor = () => {
    const colors = ['#f59e0b', '#ef4444', '#d97706', '#b45309', '#78350f', '#0ea5e9', '#6366f1'];
    return colors[Math.floor(Math.random() * colors.length)];
};

const MainContent = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [targetColor, setTargetColor] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
        try {
            const parsedUsers = JSON.parse(stored);
            const migratedUsers = parsedUsers.map(u => ({
                ...u,
                history: u.history || [] 
            }));
            setUsers(migratedUsers);
        } catch (e) {
            console.error("Failed to parse users", e);
        }
    }
  }, []);

  useEffect(() => {
    if (users.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
    }
  }, [users]);

  const setUserInventory = (newInventoryAction) => {
      if (!currentUser) return;
      let newInventory;
      if (typeof newInventoryAction === 'function') {
          newInventory = newInventoryAction(currentUser.inventory);
      } else {
          newInventory = newInventoryAction;
      }
      const updatedUser = { ...currentUser, inventory: newInventory };
      setCurrentUser(updatedUser);
      setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const handleUpdateSettings = (newSettings) => {
      if (!currentUser) return;
      const updatedUser = { ...currentUser, settings: newSettings };
      setCurrentUser(updatedUser);
      setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const handleCreateUser = (name) => {
      const newUser = {
          id: Date.now().toString(),
          name,
          inventory: COMMON_PAINTS.slice(0, 5),
          avatarColor: generateRandomColor(),
          createdAt: Date.now(),
          settings: {
              provider: 'gemini',
              modelId: 'gemini-2.5-flash'
          },
          history: []
      };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
  };

  const handleDeleteUser = (userId) => {
      const updated = users.filter(u => u.id !== userId);
      setUsers(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleLogin = (user) => {
      const safeUser = { ...user, history: user.history || [] };
      setCurrentUser(safeUser);
      setTargetColor(null);
      setRecipe(null);
      setError(null);
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setTargetColor(null);
      setRecipe(null);
      setShowSettings(false);
      setShowHistory(false);
  };

  const handleColorSelect = (color) => {
    setTargetColor(color);
    setRecipe(null);
    setError(null);
  };

  const handleGenerateRecipe = async () => {
    if (!targetColor) return;
    if (!currentUser || currentUser.inventory.length === 0) {
      setError("¡Necesitas agregar pinturas a tu inventario para poder mezclar!");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await generatePaintRecipe(
          targetColor.hex, 
          currentUser.inventory, 
          currentUser.settings
      );
      setRecipe(result);
      const newHistoryItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          recipe: result
      };
      const updatedUser = {
          ...currentUser,
          history: [newHistoryItem, ...(currentUser.history || [])]
      };
      setCurrentUser(updatedUser);
      setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
    } catch (err) {
      setError(err.message || "Error al conectar con el servicio de IA.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistoryItem = (id) => {
      if (!currentUser) return;
      const updatedHistory = currentUser.history.filter(item => item.id !== id);
      const updatedUser = { ...currentUser, history: updatedHistory };
      setCurrentUser(updatedUser);
      setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const handleLoadHistoryItem = (recipeToLoad) => {
      setRecipe(recipeToLoad);
      setTargetColor({
          hex: recipeToLoad.targetColorHex,
          r: 0, g: 0, b: 0, x: 0, y: 0
      });
  };

  const getCurrentModelName = () => {
      if (!currentUser?.settings?.modelId) return "Gemini 2.5 Flash";
      const model = AI_MODELS.find(m => m.id === currentUser.settings?.modelId);
      return model ? model.name : currentUser.settings.modelId;
  };

  return React.createElement('div', { className: "min-h-screen relative overflow-x-hidden pb-20 font-sans selection:bg-orange-500/30" },
    React.createElement('div', { className: "fixed inset-0 z-0" },
      React.createElement('div', { 
        className: "absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105",
        style: { backgroundImage: `url(${BACKGROUND_IMAGE_URL})` } 
      }),
      React.createElement('div', { className: "absolute inset-0 bg-stone-950/80 backdrop-blur-sm" }),
      React.createElement('div', { className: "absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" })
    ),
    React.createElement('div', { className: "fixed inset-0 z-0 pointer-events-none opacity-40" },
      React.createElement('div', { className: "absolute top-0 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[100px] animate-pulse-slow" }),
      React.createElement('div', { className: "absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-[100px] animate-pulse-slow", style: { animationDelay: '1s' } })
    ),
    !currentUser ? React.createElement('div', { className: "relative z-10 pt-20" },
      React.createElement(UserSelector, { users: users, onSelectUser: handleLogin, onCreateUser: handleCreateUser, onDeleteUser: handleDeleteUser })
    ) : React.createElement(React.Fragment, null,
      React.createElement('header', { className: "glass-panel sticky top-4 mx-4 md:mx-auto max-w-5xl z-50 rounded-2xl animate-fade-in-up mt-4" },
        React.createElement('div', { className: "px-6 py-3 flex items-center justify-between" },
          React.createElement('div', { className: "flex items-center space-x-3 group cursor-default" },
            React.createElement('div', { className: "relative" },
              React.createElement('div', { className: "absolute inset-0 bg-orange-500 blur rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-500" }),
              React.createElement('div', { className: "relative bg-gradient-to-br from-stone-800 to-stone-900 p-2 rounded-xl border border-white/10 shadow-lg" },
                React.createElement('svg', { className: "h-6 w-6 text-orange-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                  React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" })
                )
              )
            ),
            React.createElement('div', null,
              React.createElement('h1', { className: "text-xl font-bold tracking-tight text-stone-100 font-sans" }, "ColorMix"),
              React.createElement('p', { className: "text-[10px] text-orange-400/80 font-medium tracking-widest uppercase" }, "Atelier")
            )
          ),
          React.createElement('div', { className: "flex items-center space-x-3" },
            React.createElement('div', { className: "hidden md:flex items-center text-right" },
              React.createElement('div', { className: "mr-3" },
                React.createElement('p', { className: "text-sm font-semibold text-stone-200" }, currentUser.name),
                React.createElement('p', { className: "text-[10px] text-stone-500 uppercase tracking-wider" }, `${currentUser.inventory.length} Tubos`)
              ),
              React.createElement('div', { 
                className: "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-inner border border-white/10 ring-2 ring-black/20",
                style: { backgroundColor: currentUser.avatarColor }
              }, currentUser.name.charAt(0).toUpperCase())
            ),
            React.createElement('button', { onClick: () => setShowHistory(true), className: "p-2 rounded-lg bg-white/5 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/30 text-stone-400 hover:text-indigo-300 transition-all duration-300 relative" },
              React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" })
              ),
              currentUser.history?.length > 0 && React.createElement('span', { className: "absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full" })
            ),
            React.createElement('button', { onClick: () => setShowSettings(true), className: "p-2 rounded-lg bg-white/5 hover:bg-orange-500/10 border border-transparent hover:border-orange-500/30 text-stone-400 hover:text-orange-400 transition-all duration-300" },
              React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }),
                React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })
              )
            ),
            React.createElement('button', { onClick: handleLogout, className: "p-2 rounded-lg bg-white/5 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 text-stone-400 hover:text-red-400 transition-all duration-300" },
              React.createElement('svg', { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" })
              )
            )
          )
        )
      ),
      React.createElement('main', { className: "relative z-10 max-w-4xl mx-auto px-4 py-10 space-y-8" },
        React.createElement('div', { className: "text-center space-y-2 mb-8 animate-fade-in-up" },
          React.createElement('h2', { className: "text-3xl md:text-5xl font-bold text-stone-100 tracking-tight drop-shadow-xl" }, "Mesa de Trabajo"),
          React.createElement('p', { className: "text-orange-200/60 text-base max-w-xl mx-auto font-light" }, "Prepara tu paleta, selecciona tu referencia y deja que la IA mezcle los óleos por ti.")
        ),
        React.createElement('section', { className: "animate-fade-in-up transition-transform hover:scale-[1.01] duration-500", style: { animationDelay: '0.1s' } },
          React.createElement(InventoryManager, { inventory: currentUser.inventory, setInventory: setUserInventory })
        ),
        React.createElement('section', { className: "animate-fade-in-up transition-transform hover:scale-[1.01] duration-500", style: { animationDelay: '0.2s' } },
          React.createElement(ColorPicker, { onColorSelect: handleColorSelect })
        ),
        React.createElement('section', { className: "flex justify-center sticky bottom-6 z-40 pointer-events-none animate-fade-in-up", style: { animationDelay: '0.3s' } },
          React.createElement('button', {
            onClick: handleGenerateRecipe,
            disabled: !targetColor || loading,
            className: `pointer-events-auto px-8 py-4 rounded-xl font-bold text-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transform transition-all duration-300 flex items-center space-x-3 border backdrop-blur-md ${!targetColor ? 'bg-stone-800/90 border-stone-600 text-stone-500 cursor-not-allowed' : 'bg-gradient-to-r from-orange-600 to-red-700 border-orange-500/50 text-white hover:scale-105 active:scale-95 animate-pulse-glow hover:shadow-[0_0_30px_rgba(234,88,12,0.4)]'}`
          }, loading ? React.createElement('div', { className: "flex items-center space-x-3" },
              React.createElement('svg', { className: "animate-spin h-5 w-5 text-orange-200", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" },
                React.createElement('circle', { className: "opacity-25", cx: 12, cy: 12, r: 10, stroke: "currentColor", strokeWidth: 4 }),
                React.createElement('path', { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
              ),
              React.createElement('span', { className: "text-orange-100" }, "Mezclando pigmentos...")
            ) : React.createElement(React.Fragment, null,
              React.createElement('div', { className: "p-1.5 bg-white/20 rounded-full border border-white/10" },
                React.createElement('svg', { className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" },
                  React.createElement('path', { fillRule: "evenodd", d: "M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z", clipRule: "evenodd" })
                )
              ),
              React.createElement('span', null, "Crear Receta")
            )
          )
        ),
        error && React.createElement('div', { className: "animate-fade-in-up glass-panel border-l-4 border-l-red-500 text-red-100 p-4 rounded-r-xl shadow-lg relative", role: "alert" },
          React.createElement('div', { className: "flex items-center" },
            React.createElement('svg', { className: "h-6 w-6 text-red-500 mr-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
              React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
            ),
            React.createElement('span', { className: "font-medium" }, error)
          )
        ),
        React.createElement('section', { ref: (el) => { if (recipe && el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } },
          React.createElement(RecipeDisplay, { recipe: recipe, loading: loading, modelName: getCurrentModelName() })
        )
      ),
      React.createElement('footer', { className: "relative z-10 max-w-4xl mx-auto px-4 py-8 text-center text-stone-500 text-sm border-t border-white/5 mt-12 mb-4" },
        React.createElement('p', { className: "font-medium text-stone-400" }, "© 2026 ColorMix Atelier."),
        React.createElement('p', { className: "mt-2 text-xs opacity-60" }, "Compatible con Vallejo, Citadel, Army Painter y óleos digitales.")
      ),
      showSettings && React.createElement(SettingsModal, { currentSettings: currentUser.settings, onSave: handleUpdateSettings, onClose: () => setShowSettings(false) }),
      showHistory && React.createElement(HistorySidebar, { isOpen: showHistory, onClose: () => setShowHistory(false), history: currentUser.history || [], onSelectRecipe: handleLoadHistoryItem, onDeleteRecipe: handleDeleteHistoryItem })
    )
  );
};

export default MainContent;