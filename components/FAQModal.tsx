import React from 'react';

interface FAQModalProps {
  onClose: () => void;
}

const FAQModal: React.FC<FAQModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-stone-900/50">
          <h2 className="text-2xl font-bold text-stone-100 flex items-center">
            <span className="text-blue-500 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Preguntas Frecuentes
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
          
          <div className="bg-stone-900/50 p-5 rounded-xl border border-white/5">
            <h4 className="text-stone-200 font-bold mb-2">¿Cómo configuro la API de Google Gemini?</h4>
            <div className="text-stone-400 text-sm leading-relaxed space-y-2">
              <p>Para usar los modelos de Gemini, necesitas una clave API gratuita de Google:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Ve a <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google AI Studio</a> e inicia sesión con tu cuenta de Google.</li>
                <li>Haz clic en el botón <strong>"Create API key"</strong>.</li>
                <li>Copia la clave generada.</li>
                <li>En ColorMix Atelier, haz clic en el icono de <strong>Configuración</strong> (engranaje) en la barra superior.</li>
                <li>Selecciona "Google Gemini" como proveedor y pega tu clave en el campo correspondiente. Haz clic en Guardar.</li>
              </ol>
            </div>
          </div>

          <div className="bg-stone-900/50 p-5 rounded-xl border border-white/5">
            <h4 className="text-stone-200 font-bold mb-2">¿Cómo configuro la API de OpenRouter?</h4>
            <div className="text-stone-400 text-sm leading-relaxed space-y-2">
              <p>OpenRouter te permite usar modelos avanzados como Claude 3, GPT-4o, entre otros:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Ve a <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">OpenRouter</a> y crea una cuenta.</li>
                <li>Navega a la sección de <strong>Keys</strong> y haz clic en "Create Key".</li>
                <li>Copia la clave generada (usualmente empieza con <code>sk-or-v1-</code>).</li>
                <li>Asegúrate de tener créditos en tu cuenta de OpenRouter si vas a usar modelos de pago.</li>
                <li>En ColorMix Atelier, abre la <strong>Configuración</strong>, selecciona "OpenRouter" como proveedor y pega tu clave.</li>
              </ol>
            </div>
          </div>

          <div className="bg-stone-900/50 p-5 rounded-xl border border-white/5">
            <h4 className="text-stone-200 font-bold mb-2">¿Cómo mido las "gotas"?</h4>
            <p className="text-stone-400 text-sm leading-relaxed">No necesitas un cuentagotas exacto. Puedes usar la punta de tu pincel o cualquier herramienta de trasvase. Lo importante es mantener la proporción (ej. 2 gotas de rojo por 1 de blanco es la misma proporción que 4 de rojo por 2 de blanco).</p>
          </div>

          <div className="bg-stone-900/50 p-5 rounded-xl border border-white/5">
            <h4 className="text-stone-200 font-bold mb-2">¿Qué pasa si la precisión de la mezcla es baja?</h4>
            <p className="text-stone-400 text-sm leading-relaxed">Si la precisión es menor al 80%, significa que con tus colores actuales es difícil lograr el tono exacto. En estos casos, la IA te sugerirá qué pinturas del mercado (Citadel, Vallejo, etc.) podrías adquirir para mejorar la mezcla.</p>
          </div>

          <div className="bg-stone-900/50 p-5 rounded-xl border border-white/5">
            <h4 className="text-stone-200 font-bold mb-2">¿Se guardan mis recetas?</h4>
            <p className="text-stone-400 text-sm leading-relaxed">Sí, siempre y cuando hayas iniciado sesión con tu cuenta de Google, todas tus recetas se guardarán automáticamente en tu Bitácora (icono de libro en la parte superior derecha). Si estás en modo Invitado, no se guardarán.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQModal;
