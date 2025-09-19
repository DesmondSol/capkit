import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Language, TranslationKey } from '../../types';

interface AiPersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (inputs: { idea: string; q1: string; q2: string; q3: string }) => void;
  isLoading: boolean;
  error: string | null;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
}

export const AiPersonaModal: React.FC<AiPersonaModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isLoading,
  error,
  language,
  t,
}) => {
  const [idea, setIdea] = useState('');
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || !q1.trim() || !q2.trim() || !q3.trim()) {
      alert(language === 'am' ? 'እባክዎ ሁሉንም መስኮች ይሙሉ!' : 'Please fill in all fields!');
      return;
    }
    onGenerate({ idea, q1, q2, q3 });
  };
  
  const inputBaseClasses = "w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm";
  const labelBaseClasses = "block text-sm font-medium text-slate-300 mb-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('ai_persona_modal_title')} size="xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-lg text-sm">{error}</p>}
        
        <div>
          <label htmlFor="idea" className={labelBaseClasses}>{t('ai_persona_idea_label')}</label>
          <textarea id="idea" rows={2} value={idea} onChange={(e) => setIdea(e.target.value)} required className={inputBaseClasses} placeholder={t('ai_persona_idea_placeholder')}/>
        </div>
        
        <div>
          <label htmlFor="q1" className={labelBaseClasses}>{t('ai_persona_q1_label')}</label>
          <input type="text" id="q1" value={q1} onChange={(e) => setQ1(e.target.value)} required className={inputBaseClasses} placeholder={t('ai_persona_q1_placeholder')}/>
        </div>
        
        <div>
          <label htmlFor="q2" className={labelBaseClasses}>{t('ai_persona_q2_label')}</label>
          <input type="text" id="q2" value={q2} onChange={(e) => setQ2(e.target.value)} required className={inputBaseClasses} placeholder={t('ai_persona_q2_placeholder')}/>
        </div>

        <div>
          <label htmlFor="q3" className={labelBaseClasses}>{t('ai_persona_q3_label')}</label>
          <input type="text" id="q3" value={q3} onChange={(e) => setQ3(e.target.value)} required className={inputBaseClasses} placeholder={t('ai_persona_q3_placeholder')}/>
        </div>
        
        <div className="flex justify-end pt-3 space-x-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>{t('cancel_button')}</Button>
          <Button type="submit" variant="primary" disabled={isLoading} leftIcon={isLoading ? <SpinnerIcon className="h-5 w-5"/> : <SparklesIcon className="h-5 w-5"/>}>
            {isLoading ? t('ai_persona_generating_button') : t('ai_persona_generate_button')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// --- SVG Icons ---
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
