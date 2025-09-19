import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FeedbackItem, ProductFeature, TranslationKey, FeedbackSource, FeedbackUrgency } from '../../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: FeedbackItem) => void;
  itemData: FeedbackItem | null;
  features: ProductFeature[];
  t: (key: TranslationKey, defaultText?: string) => string;
}

const createNewItem = (): Omit<FeedbackItem, 'id'> => {
  return {
    content: '',
    source: 'manual',
    urgency: 'medium',
    featureId: null,
    createdAt: new Date().toISOString(),
  };
};

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemData,
  features,
  t,
}) => {
  const [content, setContent] = useState('');
  const [source, setSource] = useState<FeedbackSource>('manual');
  const [urgency, setUrgency] = useState<FeedbackUrgency>('medium');
  const [featureId, setFeatureId] = useState<string | null>(null);

  useEffect(() => {
    if (itemData) {
      setContent(itemData.content);
      setSource(itemData.source);
      setUrgency(itemData.urgency);
      setFeatureId(itemData.featureId);
    } else {
      const newItem = createNewItem();
      setContent(newItem.content);
      setSource(newItem.source);
      setUrgency(newItem.urgency);
      setFeatureId(newItem.featureId);
    }
  }, [itemData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert(t('feedback_content_label') + ' is required.');
      return;
    }
    const savedItem: FeedbackItem = {
      ...(itemData || { ...createNewItem(), id: `fb-${Date.now()}` }),
      content: content.trim(),
      source,
      urgency,
      featureId: featureId || null,
    };
    onSave(savedItem);
  };
  
  const sourceOptions: { value: FeedbackSource, labelKey: TranslationKey }[] = [
    { value: 'manual', labelKey: 'feedback_source_manual' },
    { value: 'app_store', labelKey: 'feedback_source_app_store' },
    { value: 'survey', labelKey: 'feedback_source_survey' },
    { value: 'social_media', labelKey: 'feedback_source_social_media' },
  ];
  
  const urgencyOptions: { value: FeedbackUrgency, labelKey: TranslationKey }[] = [
    { value: 'low', labelKey: 'feedback_urgency_low' },
    { value: 'medium', labelKey: 'feedback_urgency_medium' },
    { value: 'high', labelKey: 'feedback_urgency_high' },
  ];
  
  const inputBaseClasses = "w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={itemData ? t('feedback_modal_title_edit') : t('feedback_modal_title_add')} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">{t('feedback_content_label')}</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={5} required className={inputBaseClasses} placeholder="Paste or write user feedback here..."/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t('feedback_source_label')}</label>
                <select value={source} onChange={e => setSource(e.target.value as FeedbackSource)} className={inputBaseClasses}>
                    {sourceOptions.map(opt => <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t('feedback_urgency_label')}</label>
                <select value={urgency} onChange={e => setUrgency(e.target.value as FeedbackUrgency)} className={inputBaseClasses}>
                    {urgencyOptions.map(opt => <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t('feedback_feature_link_label')}</label>
                <select value={featureId || ''} onChange={(e) => setFeatureId(e.target.value || null)} className={inputBaseClasses}>
                    <option value="">{t('action_item_no_feature_link_option')}</option>
                    {features.map(feature => (
                    <option key={feature.id} value={feature.id}>
                        {feature.name}
                    </option>
                    ))}
                </select>
            </div>
        </div>

        <div className="flex justify-end pt-5 border-t border-slate-700 space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>{t('cancel_button')}</Button>
            <Button type="submit" variant="primary">{t('save_button')}</Button>
        </div>
      </form>
    </Modal>
  );
};