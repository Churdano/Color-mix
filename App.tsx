
import React, { useState, useEffect } from 'react';
import ColorPicker from './components/ColorPicker';
import InventoryManager from './components/InventoryManager';
import RecipeDisplay from './components/RecipeDisplay';
import UserSelector from './components/UserSelector';
import SettingsModal from './components/SettingsModal';
import { generatePaintRecipe } from './services/geminiService';
import { Paint, PixelColor, MixingRecipe, UserProfile, UserSettings } from './types';
import { COMMON_PAINTS, AI_MODELS } from './constants';

const LOCAL_STORAGE_KEY = 'colormix_users_v1';

const generateRandomColor = () => {
    const colors = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];
    return colors[Math.floor(Math.random() * colors.length)];
};

const App: React.FC = () => {
  // Global App State
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // Session State
  const [targetColor, setTargetColor] = useState<PixelColor | null>(null);
  const [recipe, setRecipe] = useState<MixingRecipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [showSettings, setShowSettings] = useState(false);

  // Load users on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
        try {
            setUsers(JSON.parse(stored));
        } catch (e) {
            console.error("Failed to parse users", e);
        }
    }
  }, []);

  // Save users whenever they change
  useEffect(() => {
    if (users.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
    }
  }, [users]);

  // Wrapper to update inventory for the CURRENT user
  const setUserInventory = (newInventoryAction: React.SetStateAction<Paint[]>) => {
      if (!currentUser) return;

      let newInventory: Paint[];
      if (typeof newInventoryAction === 'function') {
          newInventory = newInventoryAction(currentUser.inventory);
      } else {
          newInventory = newInventoryAction;
      }

      const updatedUser = { ...currentUser, inventory: newInventory };
      setCurrentUser(updatedUser);
      
      // Update global list
      setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
      if (!currentUser) return;
      
      const updatedUser = { ...currentUser, settings: newSettings };
      setCurrentUser(updatedUser);
      setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const handleCreateUser = (name: string) => {
      const newUser: UserProfile = {
          id: Date.now().toString(),
          name,
          inventory: COMMON_PAINTS.slice(0, 5), // Default starter kit
          avatarColor: generateRandomColor(),
          createdAt: Date.now(),
          settings: {
              provider: 'gemini',
              modelId: 'gemini-2.5-flash'
          }
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      // Auto login
      setCurrentUser(newUser);
  };

  const handleDeleteUser = (userId: string) => {
      const updated = users.filter(u => u.id !== userId);
      setUsers(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated)); // Force save immediately for deletes
  };

  const handleLogin = (user: UserProfile) => {
      setCurrentUser(user);
      setTargetColor(null);
      setRecipe(null);
      setError(null);
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setTargetColor(null);
      setRecipe(null);
      setShowSettings(false);
  };

  const handleColorSelect = (color: PixelColor) => {
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
      // Pass the user preferences to the service
      const result = await generatePaintRecipe(
          targetColor.hex, 
          currentUser.inventory, 
          currentUser.settings
      );
      setRecipe(result);
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servicio de IA.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to get current model name
  const getCurrentModelName = () => {
      if (!currentUser?.settings?.modelId) return "Gemini 2.5 Flash";
      const model = AI_MODELS.find(m => m.id === currentUser.settings?.modelId);
      return model ? model.name : currentUser.settings.modelId;
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden pb-20">
      
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] animate-float"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[100px] animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[80px] animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Conditional Rendering: User Selector vs Main App */}
      {!currentUser ? (
          <div className="relative z-10 pt-20">
              <UserSelector 
                users={users} 
                onSelectUser={handleLogin} 
                onCreateUser={handleCreateUser}
                onDeleteUser={handleDeleteUser}
              />
          </div>
      ) : (
        <>
            {/* Header */}
            <header className="glass-panel sticky top-0 z-50 shadow-lg border-b-0 border-white/5 animate-fade-in-up">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3 group cursor-default">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur rounded-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 p-2.5 rounded-xl shadow-inner border border-white/10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-sans">ColorMix</h1>
                            <p className="text-[10px] text-indigo-300 font-medium tracking-wide uppercase">AI Paint Lab</p>
                        </div>
                    </div>
                    
                    {/* User Profile & Actions */}
                    <div className="flex items-center space-x-4">
                         <div className="hidden md:flex items-center text-right">
                             <div className="mr-3">
                                 <p className="text-sm font-bold text-white">{currentUser.name}</p>
                                 <p className="text-[10px] text-gray-400">{currentUser.inventory.length} Pinturas</p>
                             </div>
                             <div 
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold shadow-inner border border-white/10"
                                style={{ backgroundColor: currentUser.avatarColor }}
                             >
                                 {currentUser.name.charAt(0).toUpperCase()}
                             </div>
                         </div>
                         
                         <div className="h-8 w-px bg-white/10 mx-2 hidden md:block"></div>
                        
                        {/* Settings Button */}
                        <button 
                            onClick={() => setShowSettings(true)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 hover:text-white transition-colors"
                            title="Configuración"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>

                        <button 
                            onClick={handleLogout}
                            className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg border border-white/5 transition-colors text-xs text-gray-300 hover:text-white"
                            title="Cambiar Usuario"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="hidden sm:inline">Salir</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-4xl mx-auto px-4 py-10 space-y-12">
                
                {/* Intro Text */}
                <div className="text-center space-y-4 mb-12 animate-fade-in-up">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm">
                        Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">{currentUser.name}</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Gestiona tu inventario y crea nuevas mezclas.
                    </p>
                </div>

                {/* Step 1: Inventory */}
                <section className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                    <InventoryManager inventory={currentUser.inventory} setInventory={setUserInventory} />
                </section>

                {/* Step 2: Image & Color */}
                <section className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                    <ColorPicker onColorSelect={handleColorSelect} />
                </section>

                {/* Action Button */}
                <section className="flex justify-center sticky bottom-8 z-40 pointer-events-none animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                    <button
                        onClick={handleGenerateRecipe}
                        disabled={!targetColor || loading}
                        className={`
                            pointer-events-auto
                            px-8 py-4 rounded-full font-bold text-lg shadow-2xl transform transition-all duration-300
                            flex items-center space-x-3 border
                            ${!targetColor 
                                ? 'bg-gray-800/80 backdrop-blur border-gray-600 text-gray-500 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-400/30 text-white hover:scale-105 active:scale-95 animate-pulse-glow'
                            }
                        `}
                    >
                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Calculando...</span>
                            </div>
                        ) : (
                            <>
                                <div className="p-1 bg-white/20 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span>Generar Receta</span>
                            </>
                        )}
                    </button>
                </section>

                {/* Error Message */}
                {error && (
                    <div className="animate-fade-in-up glass-panel border-l-4 border-l-red-500 text-red-100 p-4 rounded-r shadow-lg relative" role="alert">
                        <div className="flex items-center">
                            <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{error}</span>
                        </div>
                    </div>
                )}

                {/* Step 3: Result */}
                <section ref={(el) => {
                    if (recipe && el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }}>
                    <RecipeDisplay 
                        recipe={recipe} 
                        loading={loading} 
                        modelName={getCurrentModelName()} 
                    />
                </section>

            </main>
            
            <footer className="relative z-10 max-w-4xl mx-auto px-4 py-8 text-center text-gray-500 text-sm border-t border-white/5 mt-12">
                <p className="font-medium text-gray-400">© 2024 ColorMix.</p>
                <p className="mt-2 text-xs">Compatible con Vallejo, Ink Color Argentina, Citadel, Army Painter y más.</p>
            </footer>

            {/* Settings Modal */}
            {showSettings && (
                <SettingsModal 
                    currentSettings={currentUser.settings}
                    onSave={handleUpdateSettings}
                    onClose={() => setShowSettings(false)}
                />
            )}
        </>
      )}
    </div>
  );
};

export default App;
