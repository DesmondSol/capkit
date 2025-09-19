
import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Language } from '../../types';
import { TranslationKey } from '../../types';

interface AiMarketingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (inputs: { campaignGoal: string; targetPlatforms: string[]; contentTone: string; duration: string }) => void;
  isLoading: boolean;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
}

export const AiMarketingModal: React.FC<AiMarketingModalProps> = ({ isOpen, onClose, onGenerate, isLoading, language, t }) => {
  const [campaignGoal, setCampaignGoal] = useState('');
  const [targetPlatforms, setTargetPlatforms] = useState(''); 
  const [contentTone, setContentTone] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignGoal.trim() || !targetPlatforms.trim() || !contentTone.trim() || !duration.trim()) {
        alert(language === 'am' ? 'እባክዎ ሁሉንም መስኮች ይሙሉ!' : 'Please fill in all fields!');
        return;
    }
    onGenerate({
      campaignGoal,
      targetPlatforms: targetPlatforms.split(',').map(p => p.trim()).filter(p => p),
      contentTone,
      duration,
    });
  };
  
  const inputBaseClasses = "w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('ai_marketing_modal_title')} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="campaignGoal" className="block text-sm font-medium text-slate-300 mb-1">{t('ai_marketing_campaign_goal_label')}</label>
          <input type="text" id="campaignGoal" value={campaignGoal} onChange={(e) => setCampaignGoal(e.target.value)} required
                 className={inputBaseClasses}
                 placeholder={t('ai_marketing_campaign_goal_placeholder')} />
        </div>
        <div>
          <label htmlFor="targetPlatforms" className="block text-sm font-medium text-slate-300 mb-1">{t('ai_marketing_target_platforms_label')}</label>
          <input type="text" id="targetPlatforms" value={targetPlatforms} onChange={(e) => setTargetPlatforms(e.target.value)} required
                 className={inputBaseClasses}
                 placeholder={t('ai_marketing_target_platforms_placeholder')} />
        </div>
        <div>
          <label htmlFor="contentTone" className="block text-sm font-medium text-slate-300 mb-1">{t('ai_marketing_content_tone_label')}</label>
          <input type="text" id="contentTone" value={contentTone} onChange={(e) => setContentTone(e.target.value)} required
                 className={inputBaseClasses}
                 placeholder={t('ai_marketing_content_tone_placeholder')} />
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-slate-300 mb-1">{t('ai_marketing_duration_label')}</label>
          <input type="text" id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} required
                 className={inputBaseClasses}
                 placeholder={t('ai_marketing_duration_placeholder')} />
        </div>
        <div className="flex justify-end pt-3 space-x-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>{t('cancel_button')}</Button>
          <Button type="submit" variant="primary" disabled={isLoading} leftIcon={isLoading ? <SpinnerIcon className="h-5 w-5"/> : <SparklesIcon className="h-5 w-5"/>}>
            {isLoading ? t('marketing_ai_generating_plan_button') : t('ai_marketing_generate_button')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 7.5l.813 2.846a4.5 4.5 0 01-3.09 3.09L12.187 15l-2.846.813a4.5 4.5 0 01-3.09-3.09L5.437 10.5l2.846-.813a4.5 4.5 0 013.09-3.09L12 3.75l.813 2.846a4.5 4.5 0 013.09 3.09L18.75 9l-2.846.813a4.5 4.5 0 01-3.09-3.09L12.187 6 12 5.25l.187.75z" />
  </svg>
);
const SpinnerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" {...props} className={`animate-spin ${props.className || ''}`}>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
