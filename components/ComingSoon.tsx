
import React from 'react';
import { TranslationKey } from '../types';
import { Language } from '../types';

interface ComingSoonProps {
  featureName: string; 
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ featureName, t }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-10 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
      <img 
        src="https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29taW5nJTIwc29vbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60" 
        alt="Coming Soon Abstract" 
        className="rounded-lg shadow-xl mb-10 w-full max-w-md h-auto aspect-video object-cover opacity-80" 
      />
      <h1 className="text-4xl sm:text-5xl font-bold text-blue-400 mb-6">{t('coming_soon_title')}</h1>
      <p className="text-xl sm:text-2xl text-slate-300 mb-3">
        {t('coming_soon_feature_text_prefix')} <strong className="text-blue-300">{featureName}</strong> {t('coming_soon_feature_text_suffix')}
      </p>
      <p className="text-lg text-slate-400">{t('coming_soon_message')}</p>
    </div>
  );
};
