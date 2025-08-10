import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled = false }) => (
  <button
    onClick={onChange}
    disabled={disabled}
    className={`relative w-12 h-6 rounded-full transition-colors ${
      disabled 
        ? 'bg-main/10 cursor-not-allowed'
        : checked 
        ? 'bg-gold' 
        : 'bg-main/20'
    }`}
  >
    <div
      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
        checked ? 'translate-x-7' : 'translate-x-1'
      } ${disabled ? 'opacity-50' : ''}`}
    />
  </button>
);
