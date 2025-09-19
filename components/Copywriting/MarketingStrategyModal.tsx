
import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { MarketingStrategy, Language, TranslationKey } from '../../types';

interface MarketingStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (strategy: MarketingStrategy) => void;
  strategyData: MarketingStrategy | null;
  t: (key: TranslationKey, defaultText?: string) => string;
}

export const MarketingStrategyModal: React.FC<MarketingStrategyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  strategyData,
  t,
}) => {
  const [title, setTitle] = useState('');
  const [objectives, setObjectives] = useState('');
  const [tacticsAndChannels, setTacticsAndChannels] = useState('');
  const [contentStrategy, setContentStrategy] = useState('');
  const [timeline, setTimeline] = useState('');
  const [estimatedRoi, setEstimatedRoi] = useState('');
  const [budgetAllocation, setBudgetAllocation] = useState('');
  const [trackingMethods, setTrackingMethods] = useState('');

  useEffect(() => {
    if (strategyData) {
      setTitle(strategyData.title || '');
      setObjectives(strategyData.objectives || '');
      setTacticsAndChannels(strategyData.tacticsAndChannels || '');
      setContentStrategy(strategyData.contentStrategy || '');
      setTimeline(strategyData.timeline || '');
      setEstimatedRoi(strategyData.estimatedRoi || '');
      setBudgetAllocation(strategyData.budgetAllocation || '');
      setTrackingMethods(strategyData.trackingMethods || '');
    } else {
      // Reset for new entry
      setTitle('');
      setObjectives('');
      setTacticsAndChannels('');
      setContentStrategy('');
      setTimeline('');
      setEstimatedRoi('');
      setBudgetAllocation('');
      setTrackingMethods('');
    }
  }, [strategyData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !objectives.trim()) {
      alert(t('mra_error_fill_all_fields'));
      return;
    }
    onSave({
      id: strategyData?.id || '',
      title,
      objectives,
      tacticsAndChannels,
      contentStrategy,
      timeline,
      estimatedRoi,
      budgetAllocation,
      trackingMethods,
      isAiGenerated: strategyData?.isAiGenerated || false,
      createdAt: strategyData?.createdAt || new Date().toISOString(),
    });
    onClose();
  };

  const inputBaseClasses = "w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm";
  const labelBaseClasses = "block text-sm font-medium text-slate-300 mb-1";

  const Field: React.FC<{ labelKey: TranslationKey; value: string; onChange: (val: string) => void; rows?: number, placeholderKey?: TranslationKey }> = 
    ({ labelKey, value, onChange, rows = 3, placeholderKey }) => (
    <div>
        <label className={labelBaseClasses}>{t(labelKey)}</label>
        <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={rows}
            className={inputBaseClasses}
            placeholder={placeholderKey ? t(placeholderKey) : ''}
        />
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={strategyData ? t('strategy_modal_edit_title') : t('strategy_modal_create_title')}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelBaseClasses}>{t('strategy_modal_title_label')}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputBaseClasses}
            placeholder={t('strategy_modal_title_placeholder')}
            required
          />
        </div>
        
        <Field labelKey="strategy_modal_objectives_label" value={objectives} onChange={setObjectives} rows={4} />
        <Field labelKey="strategy_modal_tactics_label" value={tacticsAndChannels} onChange={setTacticsAndChannels} />
        <Field labelKey="strategy_modal_content_label" value={contentStrategy} onChange={setContentStrategy} />
        <Field labelKey="strategy_modal_timeline_label" value={timeline} onChange={setTimeline} />
        <Field labelKey="strategy_modal_roi_label" value={estimatedRoi} onChange={setEstimatedRoi} />
        <Field labelKey="strategy_modal_budget_label" value={budgetAllocation} onChange={setBudgetAllocation} />
        <Field labelKey="strategy_modal_tracking_label" value={trackingMethods} onChange={setTrackingMethods} />

        <div className="flex justify-end pt-3 space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>{t('cancel_button')}</Button>
          <Button type="submit" variant="primary">{t('save_button')}</Button>
        </div>
      </form>
    </Modal>
  );
};
