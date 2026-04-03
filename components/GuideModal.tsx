import React from 'react';

interface GuideModalProps {
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-stone-900/50">
          <h2 className="text-2xl font-bold text-stone-100 flex items-center">
            <span className="text-emerald-500 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Guía Rápida de Uso
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-stone-800 text-emerald-400 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-500/30">1</div>
              <div>
                <h4 className="text-stone-200 font-bold mb-1">Configura tu Paleta</h4>
                <p className="text-stone-400 text-sm leading-relaxed">Añade las pinturas que tienes en tu colección desde la sección "Mis Pigmentos". La IA solo usará estos colores.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-stone-800 text-emerald-400 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-500/30">2</div>
              <div>
                <h4 className="text-stone-200 font-bold mb-1">Elige un Color</h4>
                <p className="text-stone-400 text-sm leading-relaxed">Usa el selector para encontrar el tono exacto que necesitas para tu miniatura o proyecto.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-stone-800 text-emerald-400 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-500/30">3</div>
              <div>
                <h4 className="text-stone-200 font-bold mb-1">Genera la Receta</h4>
                <p className="text-stone-400 text-sm leading-relaxed">Haz clic en "Crear Receta" y la IA calculará la mezcla perfecta utilizando únicamente los colores que tienes disponibles.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-stone-800 text-emerald-400 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-500/30">4</div>
              <div>
                <h4 className="text-stone-200 font-bold mb-1">Mezcla y Pinta</h4>
                <p className="text-stone-400 text-sm leading-relaxed">Sigue las proporciones indicadas en "gotas" para obtener el color deseado y disfruta pintando.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
