import React, { useState, useEffect } from 'react';
import { EconomicsData, EconomicsSubSection, Language, UserProfile, TranslationKey, EconomicsSectionHelp } from '../../types';
import { ECONOMICS_SECTIONS_HELP } from '../../constants';
import { CostRevenuePlanner } from './CostRevenuePlanner';
import { UnitEconomicsCalculator } from './UnitEconomicsCalculator';
import { BurnRateForecaster } from './BurnRateForecaster';
import { FinancialProjectionGenerator } from './FinancialProjectionGenerator';
import { ComingSoon } from '../ComingSoon';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { FloatingActionButton } from '../common/FloatingActionButton';
import { addUserProfileHeader, addPageFooter, addTextWithPageBreaks, MARGIN_MM, LINE_HEIGHT_NORMAL, TITLE_FONT_SIZE, LINE_HEIGHT_TITLE, SECTION_TITLE_FONT_SIZE, LINE_HEIGHT_SECTION_TITLE, TEXT_FONT_SIZE } from '../../utils/pdfUtils';

interface EconomicsPageProps {
  initialData: EconomicsData;
  onUpdateData: (data: EconomicsData) => void;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
  userProfile: UserProfile | null;
}

const EconomicsPage: React.FC<EconomicsPageProps> = ({
  initialData,
  onUpdateData,
  language,
  t,
  userProfile,
}) => {
  const [activeSubSection, setActiveSubSection] = useState<EconomicsSubSection>(EconomicsSubSection.COST_REVENUE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const pageTitleObject = ECONOMICS_SECTIONS_HELP.find(s => s.title === activeSubSection);
  const pageTitle = pageTitleObject ? t(pageTitleObject.sidebarTitle[language] as TranslationKey, pageTitleObject.title) : t(activeSubSection as TranslationKey, activeSubSection);

  const handleExportAll = async () => {
    const { default: jsPDF } = await import('jspdf');
    // @ts-ignore
    const { autoTable } = await import('jspdf-autotable');
    
    const doc = new jsPDF();
    // FIX: 'doc' must be declared before use. Moved this line after doc initialization.
    (doc as any).autoTable = autoTable;

    const yRef = { value: MARGIN_MM };
    let totalPagesRef = { current: doc.getNumberOfPages() };
    
    const formatCurrency = (amount: number) => {
        if (isNaN(amount) || !isFinite(amount)) return 'ETB 0.00';
        return new Intl.NumberFormat(language === 'am' ? 'am-ET' : 'en-US', {
            style: 'currency', currency: 'ETB', currencyDisplay: 'symbol',
        }).format(amount);
    };

    addUserProfileHeader(doc, userProfile, yRef, totalPagesRef, t);
    doc.setFontSize(TITLE_FONT_SIZE);
    doc.setFont("helvetica", "bold");
    addTextWithPageBreaks(doc, t('economics_page_title'), MARGIN_MM, yRef, {}, LINE_HEIGHT_TITLE, totalPagesRef, t);
    yRef.value += LINE_HEIGHT_NORMAL;

    // 1. Cost & Revenue
    doc.setFontSize(SECTION_TITLE_FONT_SIZE);
    addTextWithPageBreaks(doc, t(EconomicsSubSection.COST_REVENUE), MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
    doc.setFontSize(TEXT_FONT_SIZE);
    const totalCosts = initialData.costs.reduce((sum, item) => sum + item.amount, 0);
    const totalRevenues = initialData.revenues.reduce((sum, item) => sum + item.amount, 0);
    const netValue = totalRevenues - totalCosts;
    addTextWithPageBreaks(doc, `${t('total_costs')}: ${formatCurrency(totalCosts)}`, MARGIN_MM+2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    addTextWithPageBreaks(doc, `${t('total_revenues')}: ${formatCurrency(totalRevenues)}`, MARGIN_MM+2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    addTextWithPageBreaks(doc, `${netValue >= 0 ? t('net_profit') : t('net_loss')}: ${formatCurrency(netValue)}`, MARGIN_MM+2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    yRef.value += LINE_HEIGHT_NORMAL;
    
    // 2. Unit Economics
    doc.setFontSize(SECTION_TITLE_FONT_SIZE);
    addTextWithPageBreaks(doc, t(EconomicsSubSection.UNIT_ECONOMICS), MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
    doc.setFontSize(TEXT_FONT_SIZE);
    const ue = initialData.unitEconomics;
    const avgRevenue = Number(ue.avgRevenue);
    const cogs = Number(ue.cogs);
    const cac = Number(ue.cac);
    const lifetime = Number(ue.customerLifetime);
    const grossMargin = avgRevenue - cogs;
    const ltv = grossMargin * lifetime;
    addTextWithPageBreaks(doc, `Inputs: ${t('ue_avg_revenue_label')} = ${formatCurrency(avgRevenue)}, ${t('ue_cogs_label')} = ${formatCurrency(cogs)}, ${t('ue_cac_label')} = ${formatCurrency(cac)}, ${t('ue_customer_lifetime_label')} = ${lifetime} mo.`, MARGIN_MM+2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    addTextWithPageBreaks(doc, `Calculated: ${t('ue_gross_margin_label')} = ${formatCurrency(grossMargin)}, ${t('ue_ltv_label')} = ${formatCurrency(ltv)}`, MARGIN_MM+2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    yRef.value += LINE_HEIGHT_NORMAL;

    // 3. Burn Rate Forecaster
    doc.setFontSize(SECTION_TITLE_FONT_SIZE);
    addTextWithPageBreaks(doc, t(EconomicsSubSection.BURN_RATE), MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
    doc.setFontSize(TEXT_FONT_SIZE);
    const br = initialData.burnRate;
    const recurringCosts = initialData.costs?.filter(c => c.type === 'recurring').reduce((sum, item) => sum + item.amount, 0) || 0;
    const recurringRevenues = initialData.revenues?.filter(r => r.type === 'recurring').reduce((sum, item) => sum + item.amount, 0) || 0;
    const totalBurn = recurringCosts + Number(br.additionalHiringSpend || 0) + Number(br.additionalMarketingSpend || 0);
    const netBurn = totalBurn - recurringRevenues;
    const runway = netBurn > 0 && Number(br.startingCapital || 0) > 0 ? Number(br.startingCapital || 0) / netBurn : Infinity;
    addTextWithPageBreaks(doc, `Inputs: ${t('br_starting_capital_label')} = ${formatCurrency(Number(br.startingCapital || 0))}`, MARGIN_MM+2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    addTextWithPageBreaks(doc, `Calculated: ${t('br_net_burn_label')} = ${formatCurrency(netBurn)} / month, ${t('br_runway_label')} = ${isFinite(runway) ? runway.toFixed(1) + ' months' : t('br_runway_infinite')}`, MARGIN_MM+2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    yRef.value += LINE_HEIGHT_NORMAL;

    // 4. Financial Projection
    doc.setFontSize(SECTION_TITLE_FONT_SIZE);
    addTextWithPageBreaks(doc, t(EconomicsSubSection.FINANCIAL_PROJECTION), MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
    doc.setFontSize(TEXT_FONT_SIZE);
    if (initialData.financialProjection.result) {
        const tableData = initialData.financialProjection.result.map(monthData => [
            t(`fp_table_month${monthData.month}_header` as TranslationKey),
            formatCurrency(monthData.revenue),
            formatCurrency(monthData.cogs),
            formatCurrency(monthData.netProfit),
            formatCurrency(monthData.endingBalance),
        ]);
        (doc as any).autoTable({
            startY: yRef.value,
            head: [['Period', t('fp_table_revenue'), t('fp_table_cogs'), t('fp_table_net_profit'), t('fp_table_ending_balance')]],
            body: tableData,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [22, 163, 74] },
        });
        yRef.value = (doc as any).lastAutoTable.finalY + 10;
    } else {
        addTextWithPageBreaks(doc, t('no_content_yet_placeholder_pdf'), MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    }

    // Finalize
    for (let i = 1; i <= totalPagesRef.current; i++) {
        doc.setPage(i);
        addPageFooter(doc, i, totalPagesRef.current, t);
    }
    doc.save(`${t('economics_page_title', 'economics').toLowerCase().replace(/\s/g, '_')}_export.pdf`);
  };

  const currentHelpContent = ECONOMICS_SECTIONS_HELP.find(h => h.title === activeSubSection) || ECONOMICS_SECTIONS_HELP[0];

  const handleSubSectionSelect = (subSection: EconomicsSubSection) => {
    setActiveSubSection(subSection);
    if (window.innerWidth < 768 && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const renderContent = () => {
    switch (activeSubSection) {
      case EconomicsSubSection.COST_REVENUE:
        return <CostRevenuePlanner economicsData={initialData} onUpdateData={onUpdateData} t={t} language={language} />;
      case EconomicsSubSection.UNIT_ECONOMICS:
        return <UnitEconomicsCalculator economicsData={initialData} onUpdateData={onUpdateData} t={t} language={language} />;
      case EconomicsSubSection.BURN_RATE:
        return <BurnRateForecaster economicsData={initialData} onUpdateData={onUpdateData} t={t} language={language} />;
      case EconomicsSubSection.FINANCIAL_PROJECTION:
        return <FinancialProjectionGenerator economicsData={initialData} onUpdateData={onUpdateData} t={t} language={language} />;
      default:
        return <ComingSoon featureName={t(activeSubSection as TranslationKey, activeSubSection)} language={language} t={t} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full md:h-[calc(100vh-8rem-2rem)] relative bg-transparent">
      <aside
        className={`
          fixed top-20 right-0 w-full h-[calc(100vh-5rem)] bg-slate-800 z-40 p-6 overflow-y-auto shadow-xl transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          md:static md:w-[320px] md:h-full md:translate-x-0 md:z-auto md:border-r md:border-slate-700 md:shadow-none md:transition-none md:left-auto md:right-auto md:top-auto
        `}
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-semibold text-slate-100">{t('economics_sidebar_title')}</h3>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            {ECONOMICS_SECTIONS_HELP.map(sectionHelp => (
              <li key={sectionHelp.title}>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleSubSectionSelect(sectionHelp.title); }}
                  className={`block px-4 py-3 rounded-lg transition-colors duration-200
                    ${activeSubSection === sectionHelp.title
                      ? 'bg-blue-600 text-white font-semibold shadow-md'
                      : 'hover:bg-slate-700 hover:text-slate-100'
                    }`}
                >
                  {t(sectionHelp.sidebarTitle[language] as TranslationKey, sectionHelp.title)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-grow p-4 md:p-8 bg-transparent shadow-inner overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-100">{pageTitle}</h2>
          <div className="flex items-center gap-4">
            <Button onClick={handleExportAll} variant="secondary">{t('export_all_button')}</Button>
            <Button variant="outline" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
              {isSidebarOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {renderContent()}
      </main>

      <FloatingActionButton
        icon={<HelpIcon className="h-6 w-6" />}
        tooltip={t('economics_help_button_tooltip')}
        onClick={() => setIsHelpModalOpen(true)}
        className="bottom-6 right-6 z-30"
        colorClass="bg-slate-600 hover:bg-slate-500"
        size="md"
      />

      <Modal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        title={`${t('mra_help_modal_title_prefix')}: ${t(currentHelpContent.sidebarTitle[language] as TranslationKey, currentHelpContent.title)}`}
        size="xl"
      >
        <div className="prose prose-sm prose-invert max-w-none text-slate-300 whitespace-pre-line max-h-[70vh] overflow-y-auto pr-2">
          {t(currentHelpContent.explanationKey)}
        </div>
      </Modal>
    </div>
  );
};

// --- SVG Icons ---
const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const HelpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export default EconomicsPage;