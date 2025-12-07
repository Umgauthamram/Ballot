import React from 'react';

const button = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "uppercase tracking-widest text-sm font-bold py-3 px-6 transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-none";

  const variants = {
    primary: "bg-white text-black border-white hover:bg-transparent hover:text-white",
    secondary: "bg-black text-white border-white hover:bg-white hover:text-black",
    danger: "bg-black text-white border-white hover:bg-gray-800",
    ghost: "bg-transparent text-gray-400 border-transparent hover:text-white"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="animate-pulse">PROCESSING</span>
      ) : (
        children
      )}
    </button>
  );
};

export default button;