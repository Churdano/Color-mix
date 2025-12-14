
import React, { useState, useEffect } from 'react';
import { UserSettings } from '../types';
import { AI_MODELS } from '../constants';

interface SettingsModalProps {
  currentSettings?: UserSettings;
  onSave: (settings: UserSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ currentSettings, onSave, onClose }) => {
  const [provider, setProvider] = useState<'gemini' | 'openrouter'>('gemini');
  const [openRouterApiKey, setOpenRouterApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [modelId, setModelId] = useState('gemini-2.5-flash');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (currentSettings) {
      setProvider(currentSettings.provider);
      setOpenRouterApiKey(currentSettings.openRouterApiKey || '');
      setGeminiApiKey(currentSettings.geminiApiKey || '');
      setModelId(currentSettings.modelId);
    }
  }, [currentSettings]);

  const handleSave = () => {
    onSave({
      provider,
      openRouterApiKey: provider === 'openrouter' ? openRouterApiKey : undefined,
      geminiApiKey: provider === 'gemini' ? geminiApiKey : undefined,
      modelId
    });
    onClose();
  };

  const filteredModels = AI_MODELS.filter(m => m.provider === provider);

  // If the currently selected model doesn't match the new provider, pick the first one
  useEffect(() => {
    const isModelValid = AI_MODELS.find(m => m.id === modelId && m.provider === provider);
    if (!isModelValid) {
       const defaultModel = AI_MODELS.find(m => m.provider === provider);
       if (defaultModel) setModelId(defaultModel.id);
    }
  }, [provider]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-800 border border-gray-600 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
             </svg>
             Configuración de IA
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Provider Selection */}
          <div className="space-y-3">
             <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Proveedor de IA</label>
             <div className="grid grid-cols-2 gap-4">
                <button
                   onClick={() => setProvider('gemini')}
                   className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${provider === 'gemini' ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-gray-700/30 border-gray-600 text-gray-400 hover:bg-gray-700/50'}`}
                >
                   <span className="font-bold text-lg mb-1">Gemini</span>
                   <span className="text-xs opacity-70">Nativo de Google</span>
                </button>
                <button
                   onClick={() => setProvider('openrouter')}
                   className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${provider === 'openrouter' ? 'bg-purple-600/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-gray-700/30 border-gray-600 text-gray-400 hover:bg-gray-700/50'}`}
                >
                   <span className="font-bold text-lg mb-1">OpenRouter</span>
                   <span className="text-xs opacity-70">Modelos Gratuitos (Llama, Mistral...)</span>
                </button>
             </div>
          </div>

          {/* Settings for Gemini */}
          {provider === 'gemini' && (
             <div className="space-y-4 animate-fade-in-up">
                {/* API Key Input */}
                <div className="space-y-2">
                   <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-gray-300">Google AI Studio API Key (Opcional)</label>
                      <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 underline">
                         Obtener Key
                      </a>
                   </div>
                   <div className="relative">
                      <input 
                         type={showKey ? "text" : "password"}
                         value={geminiApiKey}
                         onChange={(e) => setGeminiApiKey(e.target.value)}
                         placeholder="Dejar vacío para usar la predeterminada"
                         className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none pr-10"
                      />
                      <button 
                         type="button"
                         onClick={() => setShowKey(!showKey)}
                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                         {showKey ? (
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                           </svg>
                         ) : (
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                           </svg>
                         )}
                      </button>
                   </div>
                   <p className="text-xs text-gray-500">Si dejas esto vacío, usaremos nuestra API Key compartida (sujeta a límites).</p>
                </div>
             </div>
          )}

          {/* Settings for OpenRouter */}
          {provider === 'openrouter' && (
             <div className="space-y-4 animate-fade-in-up">
                
                {/* API Key Input */}
                <div className="space-y-2">
                   <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-gray-300">OpenRouter API Key</label>
                      <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 underline">
                         Obtener Key
                      </a>
                   </div>
                   <div className="relative">
                      <input 
                         type={showKey ? "text" : "password"}
                         value={openRouterApiKey}
                         onChange={(e) => setOpenRouterApiKey(e.target.value)}
                         placeholder="sk-or-v1-..."
                         className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none pr-10"
                      />
                      <button 
                         type="button"
                         onClick={() => setShowKey(!showKey)}
                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                         {showKey ? (
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                           </svg>
                         ) : (
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                           </svg>
                         )}
                      </button>
                   </div>
                   
                   {/* Guide */}
                   <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-3 text-xs text-gray-400">
                      <p className="font-bold text-purple-300 mb-1">¿Cómo configurar?</p>
                      <ol className="list-decimal pl-4 space-y-1">
                         <li>Ve a <a href="https://openrouter.ai/" target="_blank" className="text-indigo-400 underline">OpenRouter.ai</a> y crea una cuenta.</li>
                         <li>Ve a la sección "Keys" y crea una nueva key.</li>
                         <li>Copia la key (empieza por sk-or-...) y pégala arriba.</li>
                         <li>¡Listo! Podrás usar modelos potentes gratis.</li>
                      </ol>
                   </div>
                </div>
             </div>
          )}

          {/* Model Selection */}
          <div className="space-y-3">
             <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Modelo de Lenguaje</label>
             <div className="relative">
                <select
                   value={modelId}
                   onChange={(e) => setModelId(e.target.value)}
                   className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                >
                   {filteredModels.map(model => (
                      <option key={model.id} value={model.id}>
                         {model.name}
                      </option>
                   ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                </div>
             </div>
             <p className="text-xs text-gray-500">
                {provider === 'openrouter' 
                   ? 'Nota: Los modelos gratuitos pueden tener colas de espera o límites de velocidad.' 
                   : 'El modelo nativo ofrece la mejor integración sin configuración extra.'}
             </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 bg-gray-800/50 flex justify-end gap-3">
          <button
             onClick={onClose}
             className="px-5 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
          >
             Cancelar
          </button>
          <button
             onClick={handleSave}
             disabled={provider === 'openrouter' && !openRouterApiKey}
             className="px-6 py-2 rounded-lg text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
             Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
