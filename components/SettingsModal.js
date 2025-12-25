import React, { useState, useEffect } from 'react';
import { AI_MODELS } from '../constants.js';

const SettingsModal = ({ currentSettings, onSave, onClose }) => {
  const [provider, setProvider] = useState(currentSettings?.provider || 'gemini');
  const [modelId, setModelId] = useState(currentSettings?.modelId || 'gemini-3-flash-preview');
  const [openRouterKey, setOpenRouterKey] = useState(currentSettings?.openRouterApiKey || '');

  return React.createElement('div', { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" },
    React.createElement('div', { className: "bg-stone-900 p-8 rounded-2xl w-full max-w-md space-y-6" },
      React.createElement('h2', { className: "text-2xl font-bold text-white" }, "Ajustes de IA"),
      React.createElement('div', { className: "space-y-2" },
        React.createElement('label', { className: "text-xs text-stone-500 uppercase" }, "Proveedor"),
        React.createElement('select', { value: provider, onChange: e => setProvider(e.target.value), className: "w-full bg-stone-800 text-white p-2 rounded" },
          React.createElement('option', { value: 'gemini' }, "Gemini"),
          React.createElement('option', { value: 'openrouter' }, "OpenRouter")
        )
      ),
      provider === 'openrouter' && React.createElement('input', { value: openRouterKey, onChange: e => setOpenRouterKey(e.target.value), placeholder: "sk-or-...", className: "w-full bg-stone-800 text-white p-2 rounded" }),
      React.createElement('div', { className: "flex justify-end space-x-3" },
        React.createElement('button', { onClick: onClose, className: "text-stone-400" }, "Cancelar"),
        React.createElement('button', { onClick: () => onSave({ provider, modelId, openRouterApiKey: openRouterKey }), className: "bg-orange-600 text-white px-4 py-2 rounded" }, "Guardar")
      )
    )
  );
};

export default SettingsModal;