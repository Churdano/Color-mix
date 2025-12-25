import React, { useState, useEffect } from 'react';
import { AI_MODELS } from '../constants.js';

const SettingsModal = ({ currentSettings, onSave, onClose }) => {
  const [provider, setProvider] = useState('gemini');
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

  useEffect(() => {
    const isModelValid = AI_MODELS.find(m => m.id === modelId && m.provider === provider);
    if (!isModelValid) {
       const defaultModel = AI_MODELS.find(m => m.provider === provider);
       if (defaultModel) setModelId(defaultModel.id);
    }
  }, [provider]);

  return React.createElement('div', { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md animate-fade-in" },
    React.createElement('div', { className: "bg-stone-900 border border-stone-700 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden ring-1 ring-white/10" },
      React.createElement('div', { className: "p-6 border-b border-stone-800 flex justify-between items-center bg-stone-900/50" },
        React.createElement('h2', { className: "text-xl font-bold text-stone-100 flex items-center gap-3" }, 
          React.createElement('div', { className: "p-2 bg-stone-800 rounded-lg border border-stone-700" },
            React.createElement('svg', { className: "h-5 w-5 text-orange-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
              React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }),
              React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })
            )
          ),
          "Configuración de IA"
        ),
        React.createElement('button', { onClick: onClose, className: "text-stone-500 hover:text-white transition-colors" },
          React.createElement('svg', { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }))
        )
      ),
      React.createElement('div', { className: "p-6 overflow-y-auto space-y-8 bg-stone-900/80" },
        React.createElement('div', { className: "space-y-4" },
          React.createElement('label', { className: "text-xs font-bold text-stone-400 uppercase tracking-widest" }, "Proveedor de IA"),
          React.createElement('div', { className: "grid grid-cols-2 gap-4" },
            [['gemini', 'Nativo de Google'], ['openrouter', 'Modelos Gratuitos']].map(([id, desc]) => React.createElement('button', {
              key: id, onClick: () => setProvider(id),
              className: `p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${provider === id ? 'bg-orange-900/20 border-orange-500 text-white' : 'bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-700'}`
            }, React.createElement('span', { className: "font-bold text-lg mb-1" }, id.toUpperCase()), React.createElement('span', { className: "text-xs opacity-70" }, desc)))
          )
        ),
        React.createElement('div', { className: "space-y-4" },
          React.createElement('div', { className: "space-y-2" },
            React.createElement('div', { className: "flex justify-between items-center" }, 
              React.createElement('label', { className: "text-sm font-semibold text-stone-300" }, `${provider.toUpperCase()} API Key`),
              React.createElement('a', { href: provider === 'gemini' ? 'https://aistudio.google.com/app/apikey' : 'https://openrouter.ai/keys', target: "_blank", className: "text-xs text-orange-400 underline" }, "Obtener Key")
            ),
            React.createElement('div', { className: "relative" },
              React.createElement('input', { 
                type: showKey ? "text" : "password", value: provider === 'gemini' ? geminiApiKey : openRouterApiKey, 
                onChange: (e) => provider === 'gemini' ? setGeminiApiKey(e.target.value) : setOpenRouterApiKey(e.target.value), 
                className: "w-full bg-stone-950 border border-stone-700 rounded-lg px-4 py-3 text-sm text-stone-200"
              }),
              React.createElement('button', { onClick: () => setShowKey(!showKey), className: "absolute right-3 top-1/2 -translate-y-1/2 text-stone-500" }, showKey ? "Ocultar" : "Mostrar")
            )
          )
        ),
        React.createElement('div', { className: "space-y-3" },
          React.createElement('label', { className: "text-xs font-bold text-stone-400 uppercase tracking-widest" }, "Modelo de Lenguaje"),
          React.createElement('select', { value: modelId, onChange: (e) => setModelId(e.target.value), className: "w-full bg-stone-950 border border-stone-700 rounded-lg px-4 py-3 text-sm text-stone-200" },
            filteredModels.map(model => React.createElement('option', { key: model.id, value: model.id }, model.name))
          )
        )
      ),
      React.createElement('div', { className: "p-6 border-t border-stone-800 bg-stone-900/50 flex justify-end gap-3" },
        React.createElement('button', { onClick: onClose, className: "px-5 py-2.5 rounded-lg text-sm font-medium text-stone-400" }, "Cancelar"),
        React.createElement('button', { onClick: handleSave, className: "px-6 py-2.5 rounded-lg text-sm font-bold bg-orange-600 text-white" }, "Guardar Configuración")
      )
    )
  );
};

export default SettingsModal;