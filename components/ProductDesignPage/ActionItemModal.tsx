import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ActionItem, ProductFeature, TranslationKey, ActionBoardStatus } from '../../types';

interface ActionItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ActionItem) => void;
  onDelete: (itemId: string) => void;
  itemData: ActionItem | null;
  features: ProductFeature[];
  t: (key: TranslationKey, defaultText?: string) => string;
}

const createNewItem = (): Omit<ActionItem, 'id'> => {
  return {
    title: '',
    description: '',
    status: ActionBoardStatus.IDEA,
    featureId: null,
    createdAt: new Date().toISOString(),
    dueDate: null,
    completedAt: null,
  };
};

export const ActionItemModal: React.FC<ActionItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  itemData,
  features,
  t,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [featureId, setFeatureId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string | null>(null);

  useEffect(() => {
    if (itemData) {
      setTitle(itemData.title);
      setDescription(itemData.description);
      setFeatureId(itemData.featureId);
      setDueDate(itemData.dueDate);
    } else {
      const newItem = createNewItem();
      setTitle(newItem.title);
      setDescription(newItem.description);
      setFeatureId(newItem.featureId);
      setDueDate(newItem.dueDate);
    }
  }, [itemData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert(t('action_item_title_label') + ' is required.');
      return;
    }
    const savedItem: ActionItem = {
      ...(itemData || { ...createNewItem(), id: `action-${Date.now()}` }),
      title: title.trim(),
      description: description.trim(),
      featureId: featureId || null,
      dueDate: dueDate || null,
    };
    onSave(savedItem);
  };
  
  const inputBaseClasses = "w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm";
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={itemData ? t('action_item_modal_title_edit') : t('action_item_modal_title_add')} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">{t('action_item_title_label')}</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputBaseClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">{t('action_item_description_label')}</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className={inputBaseClasses}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('action_item_feature_link_label')}</label>
              <select value={featureId || ''} onChange={(e) => setFeatureId(e.target.value || null)} className={inputBaseClasses}>
                <option value="">{t('action_item_no_feature_link_option')}</option>
                {features.map(feature => (
                  <option key={feature.id} value={feature.id}>
                    {feature.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t('action_item_due_date_label')}</label>
                <input
                    type="date"
                    value={dueDate ? dueDate.split('T')[0] : ''}
                    onChange={e => setDueDate(e.target.value)}
                    className={`${inputBaseClasses} dark-datetime-local`}
                />
            </div>
        </div>

        <div className="flex justify-between items-center pt-5 border-t border-slate-700">
          <div>
            {itemData && (
              <Button type="button" variant="danger" onClick={() => onDelete(itemData.id)}>{t('delete_button')}</Button>
            )}
          </div>
          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>{t('cancel_button')}</Button>
            <Button type="submit" variant="primary">{t('save_button')}</Button>
          </div>
        </div>
         <style>{`
            .dark-datetime-local::-webkit-calendar-picker-indicator {
                filter: invert(0.8);
            }
        `}</style>
      </form>
    </Modal>
  );
};
