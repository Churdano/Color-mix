import React, { useState } from 'react';
import { UserProfile } from '../types';

interface UserSelectorProps {
  users: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onCreateUser: (name: string) => void;
  onDeleteUser: (userId: string) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({ users, onSelectUser, onCreateUser, onDeleteUser }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName.trim()) {
      onCreateUser(newUserName.trim());
      setNewUserName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4">
          ¿Quién está pintando?
        </h1>
        <p className="text-gray-400 text-lg">Selecciona tu perfil para cargar tu inventario personalizado.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-4xl px-4">
        {users.map((user) => (
          <div key={user.id} className="group relative flex flex-col items-center">
             {/* Delete Button (Visible on Hover) */}
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    if(confirm(`¿Estás seguro de que quieres borrar el perfil de ${user.name}? Se perderá su inventario.`)) {
                        onDeleteUser(user.id);
                    }
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-red-600 shadow-lg"
                title="Borrar perfil"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <button
              onClick={() => onSelectUser(user)}
              className="flex flex-col items-center group focus:outline-none"
            >
              <div 
                className="w-32 h-32 rounded-2xl mb-4 flex items-center justify-center text-4xl font-bold text-white shadow-2xl transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-indigo-500/30 border-2 border-transparent group-hover:border-white/20"
                style={{ 
                    background: `linear-gradient(135deg, ${user.avatarColor}, #1e293b)` 
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-300 text-xl font-medium group-hover:text-white transition-colors">
                {user.name}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {user.inventory.length} pinturas
              </span>
            </button>
          </div>
        ))}

        {/* Add Profile Button */}
        <div className="flex flex-col items-center">
            {isCreating ? (
                <form onSubmit={handleSubmit} className="w-32 flex flex-col items-center animate-fade-in">
                    <div className="w-32 h-32 rounded-2xl mb-4 bg-gray-800/50 border-2 border-dashed border-gray-500 flex items-center justify-center">
                         <input
                            autoFocus
                            type="text"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            placeholder="Nombre"
                            className="w-24 bg-transparent text-center text-white text-sm outline-none border-b border-gray-600 focus:border-indigo-500 pb-1"
                            maxLength={10}
                         />
                    </div>
                    <div className="flex gap-2">
                        <button 
                            type="submit"
                            disabled={!newUserName.trim()}
                            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                            Crear
                        </button>
                        <button 
                            type="button"
                            onClick={() => setIsCreating(false)}
                            className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
                        >
                            X
                        </button>
                    </div>
                </form>
            ) : (
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex flex-col items-center group focus:outline-none"
                >
                    <div className="w-32 h-32 rounded-2xl mb-4 bg-transparent border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-500 shadow-xl transition-all duration-300 transform group-hover:scale-105 group-hover:border-gray-400 group-hover:text-gray-300 hover:bg-white/5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <span className="text-gray-500 text-xl font-medium group-hover:text-gray-300 transition-colors">
                        Agregar
                    </span>
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default UserSelector;