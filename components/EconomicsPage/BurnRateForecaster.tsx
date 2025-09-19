import React, { useMemo, useEffect, useRef, useState } from 'react';
import { EconomicsData, TranslationKey, Language, BurnRateData } from '../../types';

declare var Chart: any;

interface BurnRateForecasterProps {
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

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <span className="relative group cursor-help">
    {children}
    <span className="absolute bottom-full mb-2 w-64 p-2 bg-slate-700 text-slate-200 text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
      {text}
    </span>
  </span>
);

export const BurnRateForecaster: React.FC<BurnRateForecasterProps> = ({ economicsData, onUpdateData, t, language }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  const handleChange = (field: keyof BurnRateData, value: string) => {
    onUpdateData({
        ...economicsData,
        burnRate: {
            ...economicsData.burnRate,
            [field]: value,
        },
    });
  };

  const handleBlur = (field: keyof BurnRateData) => {
    const value = economicsData.burnRate[field];
    const numericValue = value === '' ? '' : (parseFloat(String(value)) || '');

    if (numericValue !== value) {
        onUpdateData({
            ...economicsData,
            burnRate: {
                ...economicsData.burnRate,
                [field]: numericValue,
            },
        });
    }
  };

  const { baseBurn, totalBurn, netBurn, runwayMonths } = useMemo(() => {
    const recurringCosts = economicsData.costs?.filter(c => c.type === 'recurring').reduce((sum, item) => sum + item.amount, 0) || 0;
    const recurringRevenues = economicsData.revenues?.filter(r => r.type === 'recurring').reduce((sum, item) => sum + item.amount, 0) || 0;
    
    const hiring = Number(economicsData.burnRate.additionalHiringSpend) || 0;
    const marketing = Number(economicsData.burnRate.additionalMarketingSpend) || 0;
    const capital = Number(economicsData.burnRate.startingCapital) || 0;

    const baseBurn = recurringCosts;
    const totalBurn = baseBurn + hiring + marketing;
    const netBurn = totalBurn - recurringRevenues;
    const runwayMonths = (netBurn > 0 && capital > 0) ? capital / netBurn : Infinity;

    return { baseBurn, totalBurn, netBurn, runwayMonths };
  }, [economicsData.costs, economicsData.revenues, economicsData.burnRate]);

  const projectionData = useMemo(() => {
    const capital = Number(economicsData.burnRate.startingCapital) || 0;
    if (capital === 0 || netBurn <= 0) return { labels: [], data: [] };

    const labels = [];
    const data = [];
    let currentCapital = capital;
    const maxMonths = 36;
    labels.push(t('now_label', 'Now'));
    data.push(currentCapital);

    for (let i = 1; i <= maxMonths; i++) {
        currentCapital -= netBurn;
        if (currentCapital < 0) {
           data.push(0); 
           labels.push(`${t('br_chart_month_label')} ${i}`);
           break;
        }
        labels.push(`${t('br_chart_month_label')} ${i}`);
        data.push(currentCapital);
    }
    return { labels, data };
  }, [economicsData.burnRate.startingCapital, netBurn, t, language]);


  useEffect(() => {
    if (chartRef.current && typeof Chart !== 'undefined') {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstanceRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: projectionData.labels,
            datasets: [{
              label: t('br_chart_capital_label'),
              data: projectionData.data,
              fill: true,
              backgroundColor: 'rgba(6, 134, 214, 0.2)',
              borderColor: '#0686d6',
              pointBackgroundColor: '#0686d6',
              pointBorderColor: '#fff',
              tension: 0.1,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: '#94a3b8',
                  callback: (value) => typeof value === 'number' ? formatCurrency(value, language) : value
                },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
              },
              x: {
                ticks: { color: '#94a3b8' },
                grid: { color: 'rgba(255, 255, 255, 0.05)' }
              }
            },
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: t('br_chart_title'),
                color: '#e2e8f0',
                font: { size: 16 }
              },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.dataset.label}: ${formatCurrency(context.parsed.y, language)}`
                }
              }
            }
          }
        });
      }
    }
     return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [projectionData, language, t]);

  const InputField: React.FC<{ labelKey: TranslationKey; value: number | string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onBlur: () => void; }> = ({ labelKey, value, onChange, onBlur }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{t(labelKey)}</label>
        <input type="text" pattern="[0-9]*\.?[0-9]*" value={value} onChange={onChange} onBlur={onBlur} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-base font-mono" placeholder="0.00" />
    </div>
  );
  
  const ResultCard: React.FC<{ labelKey: TranslationKey; value: string; tooltipKey?: TranslationKey; colorClass?: string }> = ({ labelKey, value, tooltipKey, colorClass = 'text-blue-300' }) => (
    <div className="bg-slate-700/50 p-4 rounded-lg text-center shadow-md">
        <h4 className="text-sm font-semibold text-slate-300">
            {tooltipKey ? (
                 <Tooltip text={t(tooltipKey)}>
                    {t(labelKey)} <span className="text-slate-500">(?)</span>
                </Tooltip>
            ) : t(labelKey)}
        </h4>
        <p className={`text-2xl font-bold mt-1 ${colorClass}`}>{value}</p>
    </div>
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-100">{t('br_title')}</h2>
        <p className="text-slate-400 mt-2">{t('br_subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Inputs */}
        <div className="lg:col-span-2 p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700 space-y-6">
          <h3 className="text-xl font-semibold text-slate-100 text-center">{t('br_inputs_title')}</h3>
          <InputField labelKey="br_starting_capital_label" value={economicsData.burnRate.startingCapital} onChange={e => handleChange('startingCapital', e.target.value)} onBlur={() => handleBlur('startingCapital')} />
          <InputField labelKey="br_hiring_spend_label" value={economicsData.burnRate.additionalHiringSpend} onChange={e => handleChange('additionalHiringSpend', e.target.value)} onBlur={() => handleBlur('additionalHiringSpend')} />
          <InputField labelKey="br_marketing_spend_label" value={economicsData.burnRate.additionalMarketingSpend} onChange={e => handleChange('additionalMarketingSpend', e.target.value)} onBlur={() => handleBlur('additionalMarketingSpend')} />
        </div>
        {/* Results & Chart */}
        <div className="lg:col-span-3 p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700 space-y-6">
          <h3 className="text-xl font-semibold text-slate-100 text-center">{t('br_results_title')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <ResultCard labelKey="br_base_burn_label" value={formatCurrency(baseBurn, language)} tooltipKey="br_base_burn_tooltip" colorClass="text-orange-400" />
            <ResultCard labelKey="br_total_burn_label" value={formatCurrency(totalBurn, language)} tooltipKey="br_total_burn_tooltip" colorClass="text-red-400" />
            <ResultCard labelKey="br_net_burn_label" value={formatCurrency(netBurn, language)} tooltipKey="br_net_burn_tooltip" colorClass={netBurn >= 0 ? 'text-red-400' : 'text-green-400'} />
            <ResultCard labelKey="br_runway_label" value={isFinite(runwayMonths) ? `${runwayMonths.toFixed(1)} months` : t('br_runway_infinite')} tooltipKey="br_runway_tooltip" colorClass="text-green-400" />
          </div>
          <div className="h-80 w-full pt-4">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};
