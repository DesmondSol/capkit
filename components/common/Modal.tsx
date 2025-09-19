
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-3xl' // Adjusted full for better screen use
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[100] transition-opacity duration-300 ease-in-out">
      <div 
        className={`bg-slate-800 rounded-xl shadow-2xl ${sizeClasses[size]} w-full flex flex-col max-h-[90vh] border border-slate-700 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalFadeIn`}
        style={{ animationName: 'modalFadeIn', animationDuration: '0.3s', animationFillMode: 'forwards' }} // Inline style for animation due to Tailwind JIT
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-full hover:bg-slate-700"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto text-slate-300">
          {children}
        </div>
      </div>
      {/* Basic keyframes for modal animation (Tailwind doesn't have this out of the box) */}
      <style>{`
        @keyframes modalFadeIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};