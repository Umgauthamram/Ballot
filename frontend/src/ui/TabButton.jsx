import React from 'react';

const TabButton = ({ isActive, onClick, icon: Icon, children }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
        isActive
          ? 'bg-white text-black'
          : 'text-gray-500 hover:text-white'
      }`}
    >
      <Icon size={16} />
      {children}
    </button>
  );
};

export default TabButton;