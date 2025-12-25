import React, { useState } from 'react';

const UserSelector = ({ users, onSelectUser, onCreateUser, onDeleteUser }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newUserName.trim()) {
      onCreateUser(newUserName.trim());
      setNewUserName('');
      setIsCreating(false);
    }
  };

  return React.createElement('div', { className: "flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up" },
    React.createElement('div', { className: "text-center mb-12 relative" },
      React.createElement('div', { className: "absolute -inset-10 bg-orange-500/10 blur-[50px] rounded-full pointer-events-none" }),
      React.createElement('h1', { className: "relative text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-stone-100 to-stone-400 mb-4 tracking-tight font-sans" }, "¿Quién está pintando?"),
      React.createElement('p', { className: "text-orange-200/60 text-lg font-light" }, "Selecciona tu perfil para acceder a tu mesa de trabajo.")
    ),
    React.createElement('div', { className: "flex flex-wrap justify-center gap-10 max-w-4xl px-4" },
      users.map((user) => React.createElement('div', { key: user.id, className: "group relative flex flex-col items-center" },
        React.createElement('button', { 
            onClick: (e) => { e.stopPropagation(); if(confirm(`¿Borrar perfil de ${user.name}?`)) onDeleteUser(user.id); },
            className: "absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-red-500 shadow-lg"
        },
          React.createElement('svg', { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }))
        ),
        React.createElement('button', { onClick: () => onSelectUser(user), className: "flex flex-col items-center group focus:outline-none" },
          React.createElement('div', { 
            className: "w-32 h-32 rounded-3xl mb-5 flex items-center justify-center text-4xl font-bold text-white shadow-2xl transition-all transform group-hover:scale-105 border-4 border-stone-800 group-hover:border-orange-500/50",
            style: { background: `linear-gradient(135deg, ${user.avatarColor}, #1c1917)` } 
          }, user.name.charAt(0).toUpperCase()),
          React.createElement('span', { className: "text-stone-300 text-xl font-bold group-hover:text-white tracking-wide" }, user.name),
          React.createElement('span', { className: "text-xs text-stone-500 mt-1 uppercase tracking-widest font-semibold" }, `${user.inventory.length} pigmentos`)
        )
      )),
      React.createElement('div', { className: "flex flex-col items-center" },
          isCreating ? React.createElement('form', { onSubmit: handleSubmit, className: "w-32 flex flex-col items-center animate-fade-in" },
            React.createElement('div', { className: "w-32 h-32 rounded-3xl mb-5 bg-stone-900/80 border-2 border-dashed border-stone-600 flex items-center justify-center shadow-lg" },
              React.createElement('input', { 
                  autoFocus: true, type: "text", value: newUserName, onChange: (e) => setNewUserName(e.target.value), 
                  placeholder: "Nombre", className: "w-24 bg-transparent text-center text-white text-lg font-bold outline-none border-b-2 border-stone-600", maxLength: 10 
              })
            ),
            React.createElement('div', { className: "flex gap-2" },
              React.createElement('button', { type: "submit", disabled: !newUserName.trim(), className: "text-xs bg-orange-600 hover:bg-orange-500 text-white px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider" }, "Crear"),
              React.createElement('button', { type: "button", onClick: () => setIsCreating(false), className: "text-xs bg-stone-700 hover:bg-stone-600 text-white px-3 py-1.5 rounded-lg font-bold" }, "✕")
            )
          ) : React.createElement('button', { onClick: () => setIsCreating(true), className: "flex flex-col items-center group focus:outline-none" },
            React.createElement('div', { className: "w-32 h-32 rounded-3xl mb-5 bg-stone-900/40 border-2 border-dashed border-stone-700 flex items-center justify-center text-stone-600 shadow-xl transition-all transform group-hover:scale-105 group-hover:border-orange-500/50 group-hover:text-orange-400 backdrop-blur-sm" },
              React.createElement('svg', { className: "h-12 w-12 opacity-50 group-hover:opacity-100", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M12 4v16m8-8H4" }))
            ),
            React.createElement('span', { className: "text-stone-500 text-xl font-medium group-hover:text-stone-300" }, "Nuevo Artista")
          )
      )
    )
  );
};

export default UserSelector;