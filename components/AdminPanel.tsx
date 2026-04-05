import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Paint } from '../types';
import { BRANDS } from '../constants';

interface AdminPanelProps {
  onClose: () => void;
  onColorAdded: () => void;
}

const CATEGORIES: Paint['category'][] = ['base', 'layer', 'ink', 'contrast', 'metallic', 'wash', 'special'];

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onColorAdded }) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState(BRANDS[0]);
  const [hex, setHex] = useState('#FF0000');
  const [category, setCategory] = useState<Paint['category']>('base');
  const [refId, setRefId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAdd = async () => {
    if (!name.trim() || !hex.trim() || !refId.trim()) {
      setError('Completa todos los campos.');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await addDoc(collection(db, 'admin_colors'), {
        name: name.trim(),
        brand: brand.trim(),
        hex: hex.trim(),
        category,
        refId: refId.trim(),
        createdAt: Date.now(),
      });
      setSuccess(true);
      setName('');
      setHex('#FF0000');
      setRefId('');
      onColorAdded();
    } catch (err: any) {
      setError(err.message || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-stone-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-stone-100">Panel de Administrador</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-900/30 border border-red-500/30 text-red-300 text-sm">{error}</div>
          )}
          {success && (
            <div className="p-3 rounded-xl bg-green-900/30 border border-green-500/30 text-green-300 text-sm">Color agregado correctamente a la paleta global.</div>
          )}

          <div>
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1 block">Referencia (ID)</label>
            <input
              type="text"
              value={refId}
              onChange={(e) => setRefId(e.target.value)}
              placeholder="ej: 71.301"
              className="w-full bg-stone-800/50 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-600 outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1 block">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej: Dark Blue RLM24"
              className="w-full bg-stone-800/50 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-600 outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1 block">Marca</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-stone-800/50 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-100 outline-none focus:border-purple-500 transition-colors"
              >
                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1 block">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Paint['category'])}
                className="w-full bg-stone-800/50 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-100 outline-none focus:border-purple-500 transition-colors"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1 block">Color Hex</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="w-12 h-12 rounded-lg border-2 border-stone-600 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="flex-1 bg-stone-800/50 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-100 outline-none focus:border-purple-500 transition-colors font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={saving}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-900/30 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Agregar a la Paleta Global'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
