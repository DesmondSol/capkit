import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { TranslationKey } from '../../types';

interface AiFeedbackAggregatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcess: (bulkText: string) => void;
  isLoading: boolean;
  error: string | null;
  t: (key: TranslationKey, defaultText?: string) => string;
}

export const AiFeedbackAggregatorModal: React.FC<AiFeedbackAggregatorModalProps> = ({
  isOpen,
  onClose,
  onProcess,
  isLoading,
  error,
  t,
}) => {
  const [bulkText, setBulkText] = useState('');

  const handleSubmit = () => {
    if (bulkText.trim()) {
      onProcess(bulkText);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('ai_feedback_modal_title')} size="xl">
      <div className="space-y-4">
        <p className="text-slate-300 text-sm">{t('ai_feedback_modal_description')}</p>
        
        {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-lg text-sm">{error}</p>}
        
        <textarea
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          rows={15}
          className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          placeholder={t('ai_feedback_modal_placeholder') as string}
          disabled={isLoading}
        />
        
        <div className="flex justify-end pt-3 space-x-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            {t('cancel_button')}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            disabled={isLoading || !bulkText.trim()}
            leftIcon={isLoading ? <SpinnerIcon className="h-5 w-5" /> : <SparklesIcon className="h-5 w-5" />}
          >
            {isLoading ? t('ai_feedback_modal_processing_button') : t('ai_feedback_modal_process_button')}
          </Button>
        </div>
      </div>
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
