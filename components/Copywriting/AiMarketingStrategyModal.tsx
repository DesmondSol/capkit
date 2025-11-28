import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Language, TranslationKey } from '../../types';

interface AiMarketingStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (inputs: { primaryGoal: string; totalBudget: string; duration: string; }) => void;
  isLoading: boolean;
  t: (key: TranslationKey, defaultText?: string) => string;
}

export const AiMarketingStrategyModal: React.FC<AiMarketingStrategyModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isLoading,
  t,
}) => {
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryGoal.trim() || !duration.trim()) {
      alert(t('mra_error_fill_all_fields'));
      return;
    }
    onGenerate({ primaryGoal, totalBudget, duration });
  };
  
  const inputBaseClasses = "w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm";
  const labelBaseClasses = "block text-sm font-medium text-slate-300 mb-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('ai_strategy_modal_title')} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="text-sm text-slate-400">{t('ai_strategy_modal_description')}</p>
        
        <div>
          <label htmlFor="primaryGoal" className={labelBaseClasses}>{t('ai_strategy_primary_goal_label')}</label>
          <input type="text" id="primaryGoal" value={primaryGoal} onChange={(e) => setPrimaryGoal(e.target.value)} required
                 className={inputBaseClasses} placeholder={t('ai_strategy_primary_goal_placeholder')} />
        </div>

        <div>
          <label htmlFor="totalBudget" className={labelBaseClasses}>{t('ai_strategy_total_budget_label')}</label>
          <input type="text" id="totalBudget" value={totalBudget} onChange={(e) => setTotalBudget(e.target.value)}
                 className={inputBaseClasses} placeholder={t('ai_strategy_total_budget_placeholder')} />
        </div>

        <div>
          <label htmlFor="duration" className={labelBaseClasses}>{t('ai_strategy_duration_label')}</label>
          <input type="text" id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} required
                 className={inputBaseClasses} placeholder={t('ai_strategy_duration_placeholder')} />
        </div>
        
        <div className="flex justify-end pt-3 space-x-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>{t('cancel_button')}</Button>
          <Button type="submit" variant="primary" disabled={isLoading} leftIcon={isLoading ? <SpinnerIcon className="h-5 w-5"/> : <SparklesIcon className="h-5 w-5"/>}>
            {isLoading ? t('ai_strategy_generating_button') : t('ai_strategy_generate_button')}
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
// FIX: Added missing SpinnerIcon component definition
const SpinnerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" {...props} className={`animate-spin ${props.className || ''}`}>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);