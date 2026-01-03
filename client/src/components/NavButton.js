import React from 'react';

export const NavButton = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md transition-colors ${
      active
        ? 'bg-white text-black shadow-sm border border-gray-200'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon size={18} />
    {label}
  </button>
);

