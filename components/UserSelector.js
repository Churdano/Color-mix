import React, { useState } from 'react';

const UserSelector = ({ users, onSelectUser, onCreateUser, onDeleteUser }) => {
  const [name, setName] = useState('');
  return React.createElement('div', { className: "flex flex-col items-center space-y-8" },
    React.createElement('h1', { className: "text-4xl font-black text-white" }, "¿Quién está pintando?"),
    React.createElement('div', { className: "flex gap-6" },
      users.map(u => React.createElement('button', { key: u.id, onClick: () => onSelectUser(u), className: "flex flex-col items-center group" },
        React.createElement('div', { className: "w-24 h-24 rounded-3xl mb-2 flex items-center justify-center text-3xl font-bold text-white", style: { backgroundColor: u.avatarColor } }, u.name[0]),
        React.createElement('span', { className: "text-stone-300" }, u.name)
      )),
      React.createElement('div', { className: "flex flex-col items-center" },
        React.createElement('input', { value: name, onChange: e => setName(e.target.value), className: "w-24 bg-stone-800 text-white rounded p-1 mb-2 text-center", placeholder: "Nombre" }),
        React.createElement('button', { onClick: () => { if(name) onCreateUser(name); setName(''); }, className: "bg-orange-600 text-white px-3 py-1 rounded" }, "Nuevo")
      )
    )
  );
};

export default UserSelector;