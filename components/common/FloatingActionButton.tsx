
import React from 'react';

interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  tooltip?: string;
  colorClass?: string; 
  size?: 'sm' | 'md' | 'lg';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  tooltip,
  colorClass = 'bg-blue-600 hover:bg-blue-500', // Default to primary accent blue
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'p-2.5 w-12 h-12 text-sm', // Slightly larger for better touch
    md: 'p-3.5 w-14 h-14 text-base', 
    lg: 'p-4 w-16 h-16 text-lg', 
  };

  return (
    <button
      title={tooltip}
      className={`fixed rounded-full text-white shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#073B4C] ring-opacity-70 transition-all duration-200 ease-in-out group ${colorClass} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon}
      {tooltip && (
        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-700 text-slate-100 text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {tooltip}
        </span>
      )}
    </button>
  );
};