
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const baseStyles = "font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#073B4C] transition-all duration-200 ease-in-out inline-flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: 'bg-[#118AB2] hover:bg-[#0f7ea1] text-white focus:ring-[#118AB2]', // Infographic Blue
    secondary: 'bg-slate-600 hover:bg-slate-500 text-slate-100 focus:ring-slate-500',
    danger: 'bg-[#FF6B6B] hover:bg-[#fa5252] text-white focus:ring-[#FF6B6B]', // Infographic Coral
    outline: 'bg-transparent hover:bg-slate-700 text-slate-300 border border-slate-600 hover:border-slate-500 focus:ring-blue-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs sm:text-sm',
    md: 'px-5 py-2.5 text-sm sm:text-base',
    lg: 'px-7 py-3 text-base sm:text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {leftIcon && <span className="mr-2 -ml-1">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2 -mr-1">{rightIcon}</span>}
    </button>
  );
};