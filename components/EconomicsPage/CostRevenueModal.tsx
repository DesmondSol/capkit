import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CostItem, RevenueItem, CostCategory, RevenueCategory, TranslationKey } from '../../types';

interface CostRevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: CostItem | RevenueItem) => void;
  onDelete: (type: 'cost' | 'revenue', itemId: string) => void;
  itemType: 'cost' | 'revenue';
  itemData: CostItem | RevenueItem | null;
  t: (key: TranslationKey, defaultText?: string) => string;
}

export const CostRevenueModal: React.FC<CostRevenueModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  itemType,
  itemData,
  t,
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [category, setCategory] = useState<CostCategory | RevenueCategory>(
    itemType === 'cost' ? CostCategory.OPERATIONAL : RevenueCategory.PRODUCT_SALES
  );
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'one_time' | 'recurring'>('one_time');
  const [details, setDetails] = useState('');

  useEffect(() => {
    if (itemData) {
      setName(itemData.name);
      setAmount(itemData.amount);
      setCategory(itemData.category);
      setDate(itemData.date ? itemData.date.split('T')[0] : new Date().toISOString().split('T')[0]);
      setType(itemData.type || 'one_time');
      setDetails(itemData.details || '');
    } else {
      setName('');
      setAmount('');
      setCategory(itemType === 'cost' ? CostCategory.OPERATIONAL : RevenueCategory.PRODUCT_SALES);
      setDate(new Date().toISOString().split('T')[0]);
      setType('one_time');
      setDetails('');
    }
  }, [itemData, itemType, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || amount === '' || amount <= 0) {
      alert(t('mra_error_fill_all_fields'));
      return;
    }
    const newItem: CostItem | RevenueItem = {
      id: itemData?.id || `${itemType}-${Date.now()}`,
      name: name.trim(),
      amount: Number(amount),
      category: category as any, // TS cannot infer this correctly, but logic is sound
      date: date,
      type: type,
      details: details.trim(),
    };
    onSave(newItem);
  };

  const handleDelete = () => {
    if (itemData) {
        onDelete(itemType, itemData.id);
    }
  };

  const categoryOptions = itemType === 'cost'
    ? Object.values(CostCategory).map(c => ({ value: c, label: t(c as TranslationKey) }))
    : Object.values(RevenueCategory).map(r => ({ value: r, label: t(r as TranslationKey) }));

  const modalTitle = itemData
    ? t(itemType === 'cost' ? 'cost_revenue_modal_title_edit_cost' : 'cost_revenue_modal_title_edit_revenue')
    : t(itemType === 'cost' ? 'cost_revenue_modal_title_add_cost' : 'cost_revenue_modal_title_add_revenue');

  const inputBaseClasses = "w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm";
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">{t('financial_item_name_label')}</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required className={inputBaseClasses} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t('financial_item_amount_label')}</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))} required min="0.01" step="0.01" className={inputBaseClasses} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t('financial_item_date_label')}</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required className={`${inputBaseClasses} dark-datetime-local`} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('financial_item_category_label')}</label>
              <select value={category} onChange={e => setCategory(e.target.value as any)} className={inputBaseClasses}>
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-slate-800">{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('financial_item_type_label')}</label>
              <select value={type} onChange={e => setType(e.target.value as any)} className={inputBaseClasses}>
                  <option value="one_time">{t('financial_item_type_one_time')}</option>
                  <option value="recurring">{t('financial_item_type_recurring')}</option>
              </select>
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t('financial_item_details_label')}</label>
            <textarea value={details} onChange={e => setDetails(e.target.value)} rows={2} className={inputBaseClasses} placeholder={t('financial_item_details_placeholder') as string} />
        </div>

        <div className="flex justify-between items-center pt-5 border-t border-slate-700">
          <div>
            {itemData && (
              <Button type="button" variant="danger" onClick={handleDelete}>{t('delete_button')}</Button>
            )}
          </div>
          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>{t('cancel_button')}</Button>
            <Button type="submit" variant="primary">{t('save_button')}</Button>
          </div>
        </div>
      </form>
       <style>{`
        .dark-datetime-local::-webkit-calendar-picker-indicator {
            filter: invert(0.8); /* Invert icon color for dark mode */
        }
      `}</style>
    </Modal>
  );
};