import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { JobToBeDone, Language, TranslationKey } from '../../types';

interface JobToBeDoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: JobToBeDone) => void;
  jobData: JobToBeDone | null;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
}

export const JobToBeDoneModal: React.FC<JobToBeDoneModalProps> = ({
  isOpen,
  onClose,
  onSave,
  jobData,
  language,
  t
}) => {
  const [title, setTitle] = useState('');
  const [situation, setSituation] = useState('');
  const [motivation, setMotivation] = useState('');
  const [outcome, setOutcome] = useState('');
  const [emotionalJob, setEmotionalJob] = useState('');
  const [socialJob, setSocialJob] = useState('');

  useEffect(() => {
    if (jobData) {
      setTitle(jobData.title || '');
      setSituation(jobData.situation || '');
      setMotivation(jobData.motivation || '');
      setOutcome(jobData.outcome || '');
      setEmotionalJob(jobData.emotionalJob || '');
      setSocialJob(jobData.socialJob || '');
    } else {
      // Reset for new entry
      setTitle('');
      setSituation('');
      setMotivation('');
      setOutcome('');
      setEmotionalJob('');
      setSocialJob('');
    }
  }, [jobData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !situation.trim() || !motivation.trim() || !outcome.trim()) {
        alert(language === 'am' ? 'እባክዎ ርዕስ፣ ሁኔታ፣ ተነሳሽነት እና ውጤት ይሙሉ!' : 'Please fill in Title, Situation, Motivation, and Outcome!');
        return;
    }
    onSave({
      id: jobData?.id || `jtbd-${Date.now()}`,
      title,
      situation,
      motivation,
      outcome,
      emotionalJob,
      socialJob
    });
    onClose();
  };

  const InputField = ({ labelKey, promptKey, value, onChange, placeholderKey }: {
    labelKey: TranslationKey,
    promptKey: TranslationKey,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
    placeholderKey: TranslationKey
  }) => (
    <div>
      <label className="block text-sm font-semibold text-slate-300">
        {t(labelKey)} <span className="text-xs font-normal text-slate-400">({t(promptKey)})</span>
      </label>
      <textarea
        value={value}
        onChange={onChange}
        rows={2}
        className="mt-1 w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm"
        placeholder={t(placeholderKey)}
      />
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={jobData ? t('jtbd_modal_title_edit') : t('jtbd_modal_title_add')}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="jtbdTitle" className="block text-sm font-semibold text-slate-300">{t('jtbd_title_label')}</label>
          <input
            id="jtbdTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm"
            placeholder={t('jtbd_title_placeholder')}
            required
          />
        </div>
        
        <div className="p-4 border border-slate-700 rounded-lg space-y-4 bg-slate-800/50">
          <InputField labelKey="jtbd_situation_label" promptKey="jtbd_situation_prompt" value={situation} onChange={e => setSituation(e.target.value)} placeholderKey="jtbd_situation_placeholder" />
          <InputField labelKey="jtbd_motivation_label" promptKey="jtbd_motivation_prompt" value={motivation} onChange={e => setMotivation(e.target.value)} placeholderKey="jtbd_motivation_placeholder" />
          <InputField labelKey="jtbd_outcome_label" promptKey="jtbd_outcome_prompt" value={outcome} onChange={e => setOutcome(e.target.value)} placeholderKey="jtbd_outcome_placeholder" />
        </div>

        <div className="p-4 border border-slate-700 rounded-lg space-y-4 bg-slate-800/50">
          <InputField labelKey="jtbd_emotional_job_label" promptKey="jtbd_emotional_job_prompt" value={emotionalJob} onChange={e => setEmotionalJob(e.target.value)} placeholderKey="jtbd_emotional_job_placeholder" />
          <InputField labelKey="jtbd_social_job_label" promptKey="jtbd_social_job_prompt" value={socialJob} onChange={e => setSocialJob(e.target.value)} placeholderKey="jtbd_social_job_placeholder" />
        </div>

        <div className="flex justify-end pt-3 space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>{t('cancel_button')}</Button>
          <Button type="submit" variant="primary">{t('save_button')}</Button>
        </div>
      </form>
    </Modal>
  );
};
