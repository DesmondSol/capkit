
import React, { useState, useEffect } from 'react';
import { 
    CopywritingData, 
    Language, 
    UserProfile, 
    CanvasData, 
    TranslationKey,
    OnePagerData
} from '../../types';
import { Button } from '../common/Button';
import { generateOnePagerBlurb } from '../../services/geminiService';
import { GENERIC_ERROR_MESSAGE } from '../../constants';

interface InvestorOnePagerProps {
  copywritingData: CopywritingData;
  onUpdateData: (data: CopywritingData) => void;
  strategyData: Partial<CanvasData>;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
  userProfile: UserProfile | null;
  triggerAiGeneration: boolean;
  resetAiTrigger: () => void;
}

export const InvestorOnePager: React.FC<InvestorOnePagerProps> = ({
  copywritingData,
  onUpdateData,
  strategyData,
  language,
  t,
  triggerAiGeneration,
  resetAiTrigger,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { onePager } = copywritingData;

  const handleInputChange = (field: keyof OnePagerData, value: string) => {
    const updatedOnePager = { ...onePager, [field]: value };
    onUpdateData({ ...copywritingData, onePager: updatedOnePager });
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateOnePagerBlurb(onePager, strategyData, language);
      if (result) {
        handleInputChange('generatedBlurb', result);
      } else {
        setError(t('error_ai_failed_generic', GENERIC_ERROR_MESSAGE));
      }
    } catch (e) {
      console.error(e);
      setError(t('error_ai_failed_generic', GENERIC_ERROR_MESSAGE));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (triggerAiGeneration) {
      handleGenerate();
      resetAiTrigger();
    }
  }, [triggerAiGeneration, resetAiTrigger]);

  const inputBaseClasses = "w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm";

  return (
    <div className="space-y-6 p-6 bg-slate-800 rounded-xl shadow-xl border border-slate-700">
      <div>
        <h3 className="text-xl font-semibold text-blue-400">{t('one_pager_title')}</h3>
        <p className="text-sm text-slate-400 mt-1">{t('one_pager_subtitle')}</p>
      </div>
      
      {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-lg mb-4 text-sm">{error}</p>}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">{t('one_pager_traction_label')}</label>
          <textarea
            value={onePager.traction}
            onChange={(e) => handleInputChange('traction', e.target.value)}
            rows={3}
            className={inputBaseClasses}
            placeholder={t('one_pager_traction_placeholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">{t('one_pager_team_label')}</label>
          <textarea
            value={onePager.team}
            onChange={(e) => handleInputChange('team', e.target.value)}
            rows={2}
            className={inputBaseClasses}
            placeholder={t('one_pager_team_placeholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">{t('one_pager_ask_label')}</label>
          <textarea
            value={onePager.ask}
            onChange={(e) => handleInputChange('ask', e.target.value)}
            rows={2}
            className={inputBaseClasses}
            placeholder={t('one_pager_ask_placeholder')}
          />
        </div>
      </div>
      
      <div className="text-center pt-4">
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          variant="primary"
          size="lg"
          leftIcon={isLoading ? <SpinnerIcon className="h-5 w-5" /> : <SparklesIcon className="h-5 w-5" />}
        >
          {isLoading ? t('one_pager_generating_button') : t('one_pager_generate_button')}
        </Button>
      </div>

      {onePager.generatedBlurb && (
        <div className="pt-6 border-t border-slate-700">
          <h4 className="text-lg font-semibold text-slate-100 mb-2">{t('one_pager_output_title')}</h4>
          <div className="p-4 bg-slate-700/50 rounded-lg text-slate-200 whitespace-pre-wrap border border-slate-600">
            {onePager.generatedBlurb}
          </div>
        </div>
      )}
    </div>
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
