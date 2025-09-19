
import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PitchType, Language } from '../../types';
import { TranslationKey } from '../../types';

interface AiPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (inputs: { pitchType: PitchType; targetAudience: string; keyMessage: string; numEmails?: number }) => void;
  isLoading: boolean;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
}

export const AiPitchModal: React.FC<AiPitchModalProps> = ({ isOpen, onClose, onGenerate, isLoading, language, t }) => {
  const [pitchType, setPitchType] = useState<PitchType>('investor_pitch');
  const [targetAudience, setTargetAudience] = useState('');
  const [keyMessage, setKeyMessage] = useState('');
  const [numEmails, setNumEmails] = useState<number | undefined>(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (!targetAudience.trim() || !keyMessage.trim()) {
        alert(language === 'am' ? 'እባክዎ ኢላማ ታዳሚ እና ቁልፍ መልዕክት ይሙሉ!' : 'Please fill in target audience and key message!');
        return;
    }
    onGenerate({
      pitchType,
      targetAudience,
      keyMessage,
      numEmails: pitchType === 'email_campaign' ? (numEmails && numEmails > 0 ? numEmails : 3) : undefined,
    });
  };

  const pitchTypeOptions: { value: PitchType; labelKey: TranslationKey }[] = [
    { value: 'investor_pitch', labelKey: 'pitch_type_investor' },
    { value: 'sales_pitch', labelKey: 'pitch_type_sales' },
    { value: 'email_campaign', labelKey: 'pitch_type_email_campaign' },
  ];
  
  const inputBaseClasses = "w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('ai_pitch_modal_title')} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="aiPitchType" className="block text-sm font-medium text-slate-300 mb-1">{t('ai_pitch_type_label')}</label>
          <select id="aiPitchType" value={pitchType} onChange={(e) => setPitchType(e.target.value as PitchType)}
                  className={`${inputBaseClasses} appearance-none`}>
            {pitchTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-slate-700 text-slate-200">{t(opt.labelKey)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="aiPitchTargetAudience" className="block text-sm font-medium text-slate-300 mb-1">{t('ai_pitch_target_audience_label')}</label>
          <input type="text" id="aiPitchTargetAudience" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} required
                 className={inputBaseClasses}
                 placeholder={t('pitch_target_audience_placeholder')} />
        </div>
        <div>
          <label htmlFor="aiPitchKeyMessage" className="block text-sm font-medium text-slate-300 mb-1">{t('ai_pitch_key_message_label')}</label>
          <input type="text" id="aiPitchKeyMessage" value={keyMessage} onChange={(e) => setKeyMessage(e.target.value)} required
                 className={inputBaseClasses}
                 placeholder={t('pitch_key_message_placeholder')} />
        </div>
        {pitchType === 'email_campaign' && (
          <div>
            <label htmlFor="aiPitchNumEmails" className="block text-sm font-medium text-slate-300 mb-1">{t('ai_pitch_num_emails_label')}</label>
            <input type="number" id="aiPitchNumEmails" value={numEmails || ''} onChange={(e) => setNumEmails(parseInt(e.target.value, 10))} min="1" max="10"
                   className={inputBaseClasses}
                   placeholder="e.g., 3" />
          </div>
        )}
        <div className="flex justify-end pt-3 space-x-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>{t('cancel_button')}</Button>
          <Button type="submit" variant="primary" disabled={isLoading} leftIcon={isLoading ? <SpinnerIcon className="h-5 w-5"/> : <SparklesIcon className="h-5 w-5"/>}>
            {isLoading ? t('pitch_ai_generating_button') : t('ai_pitch_generate_button')}
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
