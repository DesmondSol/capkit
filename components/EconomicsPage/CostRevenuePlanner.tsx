import React, { useState, useMemo } from 'react';
import { EconomicsData, CostItem, RevenueItem, CostCategory, RevenueCategory, TranslationKey, Language } from '../../types';
import { Button } from '../common/Button';
import { CostRevenueModal } from './CostRevenueModal';

interface CostRevenuePlannerProps {
  economicsData: EconomicsData;
  onUpdateData: (data: EconomicsData) => void;
  t: (key: TranslationKey, defaultText?: string) => string;
  language: Language;
}

const formatCurrency = (amount: number, language: Language) => {
  return new Intl.NumberFormat(language === 'am' ? 'am-ET' : 'en-US', {
    style: 'currency',
    currency: 'ETB',
    currencyDisplay: 'symbol',
  }).format(amount);
};

export const CostRevenuePlanner: React.FC<CostRevenuePlannerProps> = ({ economicsData, onUpdateData, t, language }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'cost' | 'revenue'>('cost');
  const [editingItem, setEditingItem] = useState<CostItem | RevenueItem | null>(null);

  const { costs, revenues } = economicsData;

  const handleOpenModal = (type: 'cost' | 'revenue', item: CostItem | RevenueItem | null) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = (item: CostItem | RevenueItem) => {
    if (modalType === 'cost') {
      const costItem = item as CostItem;
      const existing = costs.find(c => c.id === costItem.id);
      const updatedCosts = existing
        ? costs.map(c => c.id === costItem.id ? costItem : c)
        : [...costs, costItem];
      onUpdateData({ ...economicsData, costs: updatedCosts });
    } else {
      const revenueItem = item as RevenueItem;
      const existing = revenues.find(r => r.id === revenueItem.id);
      const updatedRevenues = existing
        ? revenues.map(r => r.id === revenueItem.id ? revenueItem : r)
        : [...revenues, revenueItem];
      onUpdateData({ ...economicsData, revenues: updatedRevenues });
    }
    setIsModalOpen(false);
  };

  const handleDeleteItem = (type: 'cost' | 'revenue', itemId: string) => {
    if (type === 'cost') {
      onUpdateData({ ...economicsData, costs: costs.filter(c => c.id !== itemId) });
    } else {
      onUpdateData({ ...economicsData, revenues: revenues.filter(r => r.id !== itemId) });
    }
    setIsModalOpen(false);
  };

  const totalCosts = useMemo(() => costs.reduce((sum, item) => sum + item.amount, 0), [costs]);
  const totalRevenues = useMemo(() => revenues.reduce((sum, item) => sum + item.amount, 0), [revenues]);
  const netValue = totalRevenues - totalCosts;

  const groupItems = (items: (CostItem | RevenueItem)[], categories: typeof CostCategory | typeof RevenueCategory) => {
    const categoryOrder = Object.values(categories);
    const grouped = items.reduce((acc, item) => {
        const category = item.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {} as Record<string, (CostItem | RevenueItem)[]>);

    return categoryOrder
        .map(categoryKey => ({
            categoryKey,
            items: (grouped[categoryKey] || []).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        }))
        .filter(group => group.items.length > 0);
  };

  const costGroups = groupItems(costs, CostCategory);
  const revenueGroups = groupItems(revenues, RevenueCategory);

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-4 bg-red-900/20 rounded-lg border border-red-700/50">
          <h4 className="text-sm font-medium text-red-300 uppercase tracking-wider">{t('total_costs')}</h4>
          <p className="text-3xl font-bold text-red-200 mt-1">{formatCurrency(totalCosts, language)}</p>
        </div>
        <div className="p-4 bg-green-900/20 rounded-lg border border-green-700/50">
          <h4 className="text-sm font-medium text-green-300 uppercase tracking-wider">{t('total_revenues')}</h4>
          <p className="text-3xl font-bold text-green-200 mt-1">{formatCurrency(totalRevenues, language)}</p>
        </div>
        <div className={`p-4 rounded-lg border ${netValue >= 0 ? 'bg-green-900/20 border-green-700/50' : 'bg-red-900/20 border-red-700/50'}`}>
          <h4 className={`text-sm font-medium uppercase tracking-wider ${netValue >= 0 ? 'text-green-300' : 'text-red-300'}`}>{netValue >= 0 ? t('net_profit') : t('net_loss')}</h4>
          <p className={`text-3xl font-bold mt-1 ${netValue >= 0 ? 'text-green-200' : 'text-red-200'}`}>{formatCurrency(netValue, language)}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Costs Column */}
        <div className="space-y-6 p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-slate-100">{t('costs_title')}</h3>
            <Button onClick={() => handleOpenModal('cost', null)} size="sm" variant="secondary">{t('add_cost_button')}</Button>
          </div>
          {costGroups.map(group => {
            const groupTotal = group.items.reduce((sum, item) => sum + item.amount, 0);
            return (
              <div key={group.categoryKey}>
                <h4 className="text-lg font-semibold text-blue-300 mb-3">{t(group.categoryKey as TranslationKey)}</h4>
                <ul className="space-y-2">
                  {group.items.map(item => (
                    <li key={item.id} onClick={() => handleOpenModal('cost', item)}
                        className="p-3 bg-slate-700/50 rounded-md cursor-pointer hover:bg-slate-700 transition-colors">
                        <div className="flex justify-between items-start">
                            <span className="text-slate-200 font-medium">{item.name}</span>
                            <span className="font-mono text-slate-100 text-right">{formatCurrency(item.amount, language)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                            <span>{new Date(item.date).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-CA')}</span>
                            {item.type === 'recurring' && <span className="px-2 py-0.5 bg-sky-800/50 text-sky-300 rounded-full">{t('financial_item_type_recurring')}</span>}
                        </div>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end mt-2 pt-2 border-t border-slate-700">
                  <span className="text-sm font-semibold text-slate-400">{formatCurrency(groupTotal, language)}</span>
                </div>
              </div>
            );
          })}
          {costs.length === 0 && <p className="text-slate-500 italic text-center py-4">{t('no_content_yet_placeholder')}</p>}
        </div>

        {/* Revenues Column */}
        <div className="space-y-6 p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-slate-100">{t('revenues_title')}</h3>
            <Button onClick={() => handleOpenModal('revenue', null)} size="sm" variant="secondary">{t('add_revenue_button')}</Button>
          </div>
          {revenueGroups.map(group => {
            const groupTotal = group.items.reduce((sum, item) => sum + item.amount, 0);
            return (
              <div key={group.categoryKey}>
                <h4 className="text-lg font-semibold text-blue-300 mb-3">{t(group.categoryKey as TranslationKey)}</h4>
                <ul className="space-y-2">
                  {group.items.map(item => (
                    <li key={item.id} onClick={() => handleOpenModal('revenue', item)}
                        className="p-3 bg-slate-700/50 rounded-md cursor-pointer hover:bg-slate-700 transition-colors">
                      <div className="flex justify-between items-start">
                            <span className="text-slate-200 font-medium">{item.name}</span>
                            <span className="font-mono text-slate-100 text-right">{formatCurrency(item.amount, language)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                            <span>{new Date(item.date).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-CA')}</span>
                            {item.type === 'recurring' && <span className="px-2 py-0.5 bg-sky-800/50 text-sky-300 rounded-full">{t('financial_item_type_recurring')}</span>}
                        </div>
                    </li>
                  ))}
                </ul>
                 <div className="flex justify-end mt-2 pt-2 border-t border-slate-700">
                  <span className="text-sm font-semibold text-slate-400">{formatCurrency(groupTotal, language)}</span>
                </div>
              </div>
            );
          })}
          {revenues.length === 0 && <p className="text-slate-500 italic text-center py-4">{t('no_content_yet_placeholder')}</p>}
        </div>
      </div>

      {isModalOpen && (
        <CostRevenueModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveItem}
          onDelete={handleDeleteItem}
          itemType={modalType}
          itemData={editingItem}
          t={t}
        />
      )}
    </div>
  );
};