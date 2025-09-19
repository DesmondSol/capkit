import React from 'react';
import { EconomicsData, FinancialProjection, FinancialProjectionInputs, FinancialProjectionResultMonth, Language, ProjectionProduct, TranslationKey } from '../../types';
import { Button } from '../common/Button';

interface FinancialProjectionGeneratorProps {
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

export const FinancialProjectionGenerator: React.FC<FinancialProjectionGeneratorProps> = ({ economicsData, onUpdateData, t, language }) => {
    const projectionData = economicsData.financialProjection || {
        inputs: {
            startingCapital: '',
            products: [],
            salesGrowthRate: '',
            monthlyRevenue: '',
            monthlyExpenses: ''
        },
        result: null,
    };

    const handleInputChange = <K extends keyof FinancialProjectionInputs>(field: K, value: FinancialProjectionInputs[K]) => {
        const newInputs = { ...projectionData.inputs, [field]: value };
        onUpdateData({
            ...economicsData,
            financialProjection: { ...projectionData, inputs: newInputs },
        });
    };
    
    const handleProductChange = (id: string, field: keyof Omit<ProjectionProduct, 'id'>, value: string | number) => {
        const updatedProducts = projectionData.inputs.products.map(p => 
            p.id === id ? { ...p, [field]: value } : p
        );
        handleInputChange('products', updatedProducts);
    };

    const handleAddProduct = () => {
        const newProduct: ProjectionProduct = {
            id: `prod-${Date.now()}`,
            name: '',
            price: '',
            cost: '',
            initialSales: '',
        };
        handleInputChange('products', [...projectionData.inputs.products, newProduct]);
    };

    const handleRemoveProduct = (id: string) => {
        const updatedProducts = projectionData.inputs.products.filter(p => p.id !== id);
        handleInputChange('products', updatedProducts);
    };

    const handleGenerateProjection = () => {
        const { startingCapital, products, salesGrowthRate, monthlyRevenue, monthlyExpenses } = projectionData.inputs;
        
        let cash = Number(startingCapital) || 0;
        const growthRate = (Number(salesGrowthRate) || 0) / 100;
        
        const monthlyProjections: FinancialProjectionResultMonth[] = [];

        for(let i = 1; i <= 3; i++) {
            let monthRevenue = 0;
            let monthCogs = 0;
            
            products.forEach(p => {
                const sales = (Number(p.initialSales) || 0) * Math.pow(1 + growthRate, i - 1);
                monthRevenue += (Number(p.price) || 0) * sales;
                monthCogs += (Number(p.cost) || 0) * sales;
            });

            monthRevenue += Number(monthlyRevenue) || 0;

            const grossProfit = monthRevenue - monthCogs;
            const expenses = Number(monthlyExpenses) || 0;
            const netProfit = grossProfit - expenses;
            cash += netProfit;

            monthlyProjections.push({
                month: i,
                revenue: monthRevenue,
                cogs: monthCogs,
                grossProfit: grossProfit,
                otherExpenses: expenses,
                netProfit: netProfit,
                endingBalance: cash,
            });
        }
        
        onUpdateData({
            ...economicsData,
            financialProjection: { ...projectionData, result: monthlyProjections }
        });
    };

    const inputBaseClasses = "w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm font-mono";
    const labelBaseClasses = "block text-sm font-medium text-slate-300 mb-1";

    const renderProjectionTable = () => {
        if (!projectionData.result) return null;
        const totals = {
            revenue: projectionData.result.reduce((sum, m) => sum + m.revenue, 0),
            cogs: projectionData.result.reduce((sum, m) => sum + m.cogs, 0),
            grossProfit: projectionData.result.reduce((sum, m) => sum + m.grossProfit, 0),
            otherExpenses: projectionData.result.reduce((sum, m) => sum + m.otherExpenses, 0),
            netProfit: projectionData.result.reduce((sum, m) => sum + m.netProfit, 0),
        };

        const rows: { labelKey: TranslationKey; values: number[]; total: number, isBalance?: boolean }[] = [
            { labelKey: 'fp_table_revenue', values: projectionData.result.map(m => m.revenue), total: totals.revenue },
            { labelKey: 'fp_table_cogs', values: projectionData.result.map(m => m.cogs), total: totals.cogs },
            { labelKey: 'fp_table_gross_profit', values: projectionData.result.map(m => m.grossProfit), total: totals.grossProfit },
            { labelKey: 'fp_table_other_expenses', values: projectionData.result.map(m => m.otherExpenses), total: totals.otherExpenses },
            { labelKey: 'fp_table_net_profit', values: projectionData.result.map(m => m.netProfit), total: totals.netProfit },
            { labelKey: 'fp_table_ending_balance', values: projectionData.result.map(m => m.endingBalance), total: projectionData.result[2].endingBalance, isBalance: true },
        ];

        return (
            <div className="mt-8 p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
                <h3 className="text-xl font-semibold text-slate-100 text-center mb-4">{t('fp_results_title')}</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs text-blue-300 uppercase bg-slate-700/50">
                            <tr>
                                <th className="px-4 py-3">{t('fp_table_metric_header')}</th>
                                <th className="px-4 py-3 text-right">{t('fp_table_month1_header')}</th>
                                <th className="px-4 py-3 text-right">{t('fp_table_month2_header')}</th>
                                <th className="px-4 py-3 text-right">{t('fp_table_month3_header')}</th>
                                <th className="px-4 py-3 text-right">{t('fp_table_total_header')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(row => (
                                <tr key={row.labelKey} className={`border-b border-slate-700 hover:bg-slate-700/30 ${row.labelKey === 'fp_table_gross_profit' || row.labelKey === 'fp_table_net_profit' ? 'font-bold bg-slate-700/20' : ''}`}>
                                    <td className="px-4 py-3 text-slate-100">{t(row.labelKey)}</td>
                                    {row.values.map((val, i) => <td key={i} className="px-4 py-3 text-right font-mono">{formatCurrency(val, language)}</td>)}
                                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-100">{row.isBalance ? '-' : formatCurrency(row.total, language)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
    
    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-100">{t('fp_title')}</h2>
                <p className="text-slate-400 mt-2">{t('fp_subtitle')}</p>
            </div>

            {/* Inputs Section */}
            <div className="p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700 space-y-6">
                <h3 className="text-xl font-semibold text-slate-100 text-center">{t('fp_inputs_title')}</h3>
                
                {/* Starting Capital */}
                <div>
                    <label className={labelBaseClasses}>{t('fp_starting_capital_label')}</label>
                    <input type="number" value={projectionData.inputs.startingCapital} onChange={e => handleInputChange('startingCapital', e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputBaseClasses} placeholder="0.00" />
                </div>
                
                {/* Products */}
                <div className="space-y-4 pt-4 border-t border-slate-700">
                    <h4 className="text-lg font-semibold text-blue-300">{t('fp_products_services_title')}</h4>
                    {projectionData.inputs.products.map(p => (
                        <div key={p.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end p-3 bg-slate-700/50 rounded-lg">
                            <div className="md:col-span-2"><label className="text-xs text-slate-400">{t('fp_product_name_label')}</label><input type="text" value={p.name} onChange={e => handleProductChange(p.id, 'name', e.target.value)} className={inputBaseClasses} /></div>
                            <div><label className="text-xs text-slate-400">{t('fp_product_price_label')}</label><input type="number" value={p.price} onChange={e => handleProductChange(p.id, 'price', e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputBaseClasses} placeholder="0.00" /></div>
                            <div><label className="text-xs text-slate-400">{t('fp_product_cost_label')}</label><input type="number" value={p.cost} onChange={e => handleProductChange(p.id, 'cost', e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputBaseClasses} placeholder="0.00" /></div>
                            <div className="relative"><label className="text-xs text-slate-400">{t('fp_product_initial_sales_label')}</label><input type="number" value={p.initialSales} onChange={e => handleProductChange(p.id, 'initialSales', e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputBaseClasses} placeholder="0" /></div>
                             <Button type="button" onClick={() => handleRemoveProduct(p.id)} variant="danger" size="sm" className="!p-2 w-full md:w-auto" title={t('fp_remove_product_button_tooltip') as string}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 015 10z" clipRule="evenodd" /></svg>
                            </Button>
                        </div>
                    ))}
                    <Button type="button" onClick={handleAddProduct} variant="secondary" size="sm" leftIcon={<PlusIcon className="h-4 w-4"/>}>{t('fp_add_product_button')}</Button>
                </div>

                {/* Assumptions */}
                <div className="space-y-4 pt-4 border-t border-slate-700">
                     <h4 className="text-lg font-semibold text-blue-300">{t('fp_growth_assumptions_title')}</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div><label className={labelBaseClasses}>{t('fp_sales_growth_rate_label')}</label><input type="number" value={projectionData.inputs.salesGrowthRate} onChange={e => handleInputChange('salesGrowthRate', e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputBaseClasses} placeholder="e.g. 10 for 10%" /></div>
                        <div><label className={labelBaseClasses}>{t('fp_other_monthly_revenue_label')}</label><input type="number" value={projectionData.inputs.monthlyRevenue} onChange={e => handleInputChange('monthlyRevenue', e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputBaseClasses} placeholder="0.00" /></div>
                        <div><label className={labelBaseClasses}>{t('fp_other_monthly_expenses_label')}</label><input type="number" value={projectionData.inputs.monthlyExpenses} onChange={e => handleInputChange('monthlyExpenses', e.target.value === '' ? '' : parseFloat(e.target.value))} className={inputBaseClasses} placeholder="0.00" /></div>
                     </div>
                </div>

                <div className="text-center pt-4">
                    <Button type="button" onClick={handleGenerateProjection} variant="primary" size="lg">{t('fp_generate_button')}</Button>
                </div>
            </div>

            {/* Results Section */}
            {renderProjectionTable()}
        </div>
    );
};

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);