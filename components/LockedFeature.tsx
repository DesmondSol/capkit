

import React from 'react';
import { Button } from './common/Button';
import { TranslationKey } from '../types';

interface LockedFeatureProps {
  onUnlockClick: () => void;
  t: (key: TranslationKey, defaultText?: string) => string;
}

export const LockedFeature: React.FC<LockedFeatureProps> = ({ onUnlockClick, t }) => {
  const contactText = t('unlock_contact_info');
  const contactParts = contactText.split(':');
  const contactInfo = contactParts.length > 1 
    ? { intro: contactParts[0] + ':', email: contactParts[1].trim() }
    : { intro: contactText, email: null };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-10 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
      <svg className="w-24 h-24 text-yellow-400 mb-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
      </svg>
      <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 mb-4">{t('locked_feature_title')}</h1>
      <p className="text-lg text-slate-300 mb-8 max-w-md mx-auto">{t('locked_feature_description')}</p>
      <Button onClick={onUnlockClick} variant="primary" size="lg">{t('locked_feature_button')}</Button>
      <p className="text-xs text-slate-400 mt-6">
        {contactInfo.intro}
        {contactInfo.email && (
            <a href={`mailto:${contactInfo.email}`} className="font-semibold text-blue-400 hover:underline ml-1">
                {contactInfo.email}
            </a>
        )}
      </p>
    </div>
  );
};