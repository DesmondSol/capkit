import React, { useMemo, useState, useEffect } from 'react';
import { EconomicsData, TranslationKey, Language, UnitEconomicsData } from '../../types';

interface UnitEconomicsCalculatorProps {
  economicsData: EconomicsData;
  onUpdateData: (data: EconomicsData) => void;
  t: (key: TranslationKey, defaultText?: string) => string;
  language: Language;
}

const formatCurrency = (amount: number, language: Language) => {
  if (isNaN(amount) || !isFinite(amount)) return 'ETB 0.00';
  return new Intl.NumberFormat(language === 'am' ? 'am-ET' : 'en-US', {
    style: 'currency',
    currency: 'ETB',
    currencyDisplay: 'symbol',
  }).format(amount);
};

const formatRatio = (ratio: number) => {
  if (isNaN(ratio) || !isFinite(ratio)) return 'N/A';
  return `${ratio.toFixed(2)} : 1`;
};

const formatMonths = (months: number, t: (key: TranslationKey) => string) => {
  if (isNaN(months) || !isFinite(months)) return 'N/A';
  return `${months.toFixed(1)} ${t('ue_customer_lifetime_label').split('(')[1].replace(')','')}`;
};

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  return (
    <span className="relative group cursor-help">
      {children}
      <span className="absolute bottom-full mb-2 w-64 p-2 bg-slate-700 text-slate-200 text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
        {text}
      </span>
    </span>
  );
};

export const UnitEconomicsCalculator: React.FC<UnitEconomicsCalculatorProps> = ({ economicsData, onUpdateData, t, language }) => {

  const handleChange = (field: keyof UnitEconomicsData, value: string) => {
    // Keep value as a string to allow for free editing (e.g., typing '.')
    onUpdateData({
      ...economicsData,
      unitEconomics: {
        ...economicsData.unitEconomics,
        [field]: value,
      },
    });
  };

  const handleBlur = (field: keyof UnitEconomicsData) => {
    // On blur, sanitize the value to a number or an empty string
    const value = economicsData.unitEconomics[field];
    const numericValue = value === '' ? '' : (parseFloat(String(value)) || '');
    
    // Only update if the sanitized value is different from the current one
    if (numericValue !== value) {
        onUpdateData({
            ...economicsData,
            unitEconomics: {
                ...economicsData.unitEconomics,
                [field]: numericValue,
            },
        });
    }
  };

  const { grossMargin, ltv, ltvToCacRatio, breakevenMonths } = useMemo(() => {
    const avgRevenue = Number(economicsData.unitEconomics.avgRevenue);
    const cogs = Number(economicsData.unitEconomics.cogs);
    const cac = Number(economicsData.unitEconomics.cac);
    const lifetime = Number(economicsData.unitEconomics.customerLifetime);

    if (isNaN(avgRevenue) || isNaN(cogs) || isNaN(cac) || isNaN(lifetime)) {
      return { grossMargin: NaN, ltv: NaN, ltvToCacRatio: NaN, breakevenMonths: NaN };
    }

    const grossMargin = avgRevenue - cogs;
    const ltv = grossMargin * lifetime;
    const ltvToCacRatio = cac > 0 ? ltv / cac : Infinity;
    const breakevenMonths = grossMargin > 0 ? cac / grossMargin : Infinity;

    return { grossMargin, ltv, ltvToCacRatio, breakevenMonths };
  }, [economicsData.unitEconomics]);

  const inputBaseClasses = "w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-base font-mono";

  const InputField: React.FC<{ labelKey: TranslationKey; tooltipKey: TranslationKey; value: number | string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onBlur: () => void; }> = ({ labelKey, tooltipKey, value, onChange, onBlur }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
            <Tooltip text={t(tooltipKey)}>
                {t(labelKey)} <span className="text-slate-500">(?)</span>
            </Tooltip>
        </label>
        <input type="text" pattern="[0-9]*\.?[0-9]*" value={value} onChange={onChange} onBlur={onBlur} className={inputBaseClasses} placeholder="0.00" />
    </div>
  );

  const ResultCard: React.FC<{ labelKey: TranslationKey; value: string; subtextKey?: TranslationKey }> = ({ labelKey, value, subtextKey }) => (
    <div className="bg-slate-700/50 p-4 rounded-lg text-center shadow-md">
        <h4 className="text-sm font-semibold text-slate-300">{t(labelKey)}</h4>
        <p className="text-2xl font-bold text-blue-300 mt-1">{value}</p>
        {subtextKey && <p className="text-xs text-slate-400 mt-1">{t(subtextKey)}</p>}
    </div>
  );


  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-100">{t('ue_title')}</h2>
        <p className="text-slate-400 mt-2">{t('ue_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Inputs Column */}
        <div className="p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700 space-y-6">
          <h3 className="text-xl font-semibold text-slate-100 text-center">{t('ue_inputs_title')}</h3>
          <InputField labelKey="ue_avg_revenue_label" tooltipKey="ue_avg_revenue_tooltip" value={economicsData.unitEconomics.avgRevenue} onChange={(e) => handleChange('avgRevenue', e.target.value)} onBlur={() => handleBlur('avgRevenue')} />
          <InputField labelKey="ue_cogs_label" tooltipKey="ue_cogs_tooltip" value={economicsData.unitEconomics.cogs} onChange={(e) => handleChange('cogs', e.target.value)} onBlur={() => handleBlur('cogs')} />
          <InputField labelKey="ue_cac_label" tooltipKey="ue_cac_tooltip" value={economicsData.unitEconomics.cac} onChange={(e) => handleChange('cac', e.target.value)} onBlur={() => handleBlur('cac')} />
          <InputField labelKey="ue_customer_lifetime_label" tooltipKey="ue_customer_lifetime_tooltip" value={economicsData.unitEconomics.customerLifetime} onChange={(e) => handleChange('customerLifetime', e.target.value)} onBlur={() => handleBlur('customerLifetime')} />
        </div>

        {/* Results Column */}
        <div className="p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700 space-y-6">
            <h3 className="text-xl font-semibold text-slate-100 text-center">{t('ue_results_title')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ResultCard labelKey="ue_gross_margin_label" value={formatCurrency(grossMargin, language)} subtextKey="ue_gross_margin_result" />
                <ResultCard labelKey="ue_ltv_label" value={formatCurrency(ltv, language)} subtextKey="ue_ltv_result" />
                <ResultCard labelKey="ue_ltv_cac_ratio_label" value={formatRatio(ltvToCacRatio)} subtextKey="ue_ltv_cac_ratio_result" />
                <ResultCard labelKey="ue_breakeven_label" value={formatMonths(breakevenMonths, t)} subtextKey="ue_breakeven_result" />
            </div>
        </div>
      </div>
    </div>
  );
};
