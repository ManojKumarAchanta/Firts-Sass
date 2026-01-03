import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  className = '',
  loading,
  ...props
}) => {
  const base = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed h-10";
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 border border-transparent shadow-sm",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
    outline: "border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 bg-transparent",
    ai: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border-transparent shadow-md hover:shadow-lg"
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={loading} {...props}>
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

