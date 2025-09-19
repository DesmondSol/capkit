

import React, { useState, useEffect } from 'react';
import { SalesData, SalesSubSection, Language, UserProfile, TranslationKey, SalesSectionHelp, CanvasData, PersonasData, MarketResearchData, LaunchPhase } from '../../types';
import { SALES_SECTIONS_HELP } from '../../constants';
import { GoToMarketArchitect } from './GoToMarketArchitect';
import { CrmPipelinePage } from './CrmPipelinePage';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { FloatingActionButton } from '../common/FloatingActionButton';
import { addUserProfileHeader, addPageFooter, addTextWithPageBreaks, MARGIN_MM, LINE_HEIGHT_NORMAL, TITLE_FONT_SIZE, LINE_HEIGHT_TITLE, SECTION_TITLE_FONT_SIZE, LINE_HEIGHT_SECTION_TITLE, TEXT_FONT_SIZE } from '../../utils/pdfUtils';
import { generateLaunchSequence } from '../../services/geminiService';

interface SalesPageProps {
  initialData: SalesData;
  onUpdateData: (data: SalesData) => void;
  canvasData: Partial<CanvasData>;
  personasData: PersonasData;
  researchData: MarketResearchData;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
  userProfile: UserProfile | null;
}

const SalesPage: React.FC<SalesPageProps> = ({
  initialData,
  onUpdateData,
  canvasData,
  personasData,
  researchData,
  language,
  t,
  userProfile,
}) => {
  const [activeSubSection, setActiveSubSection] = useState<SalesSubSection>(SalesSubSection.GO_TO_MARKET);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const pageTitleObject = SALES_SECTIONS_HELP.find(s => s.title === activeSubSection);
  // FIX: Cast sidebarTitle to TranslationKey to resolve TypeScript error
  const pageTitle = pageTitleObject ? t(pageTitleObject.sidebarTitle[language] as TranslationKey, pageTitleObject.title) : t(activeSubSection, activeSubSection);

  const handleExportAll = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const yRef = { value: MARGIN_MM };
    let totalPagesRef = { current: doc.getNumberOfPages() };

    addUserProfileHeader(doc, userProfile, yRef, totalPagesRef, t);

    doc.setFontSize(TITLE_FONT_SIZE);
    doc.setFont("helvetica", "bold");
    addTextWithPageBreaks(doc, t('sales_page_title'), MARGIN_MM, yRef, {}, LINE_HEIGHT_TITLE, totalPagesRef, t);
    yRef.value += LINE_HEIGHT_NORMAL;

    // Go-to-Market Architect
    doc.setFontSize(SECTION_TITLE_FONT_SIZE);
    addTextWithPageBreaks(doc, t(SalesSubSection.GO_TO_MARKET), MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
    if (initialData.launchSequence.length > 0) {
        initialData.launchSequence.forEach(phase => {
            doc.setFontSize(TEXT_FONT_SIZE + 2);
            doc.setFont("helvetica", "bold");
            addTextWithPageBreaks(doc, phase.name, MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
            doc.setFontSize(TEXT_FONT_SIZE);
            doc.setFont("helvetica", "normal");
            if (phase.activities.length > 0) {
                phase.activities.forEach(activity => {
                    const statusText = t(`activity_status_${activity.status}` as TranslationKey, activity.status);
                    addTextWithPageBreaks(doc, ` - [${statusText}] ${activity.name}`, MARGIN_MM + 4, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
                });
            } else {
                 addTextWithPageBreaks(doc, t('no_content_yet_placeholder_pdf'), MARGIN_MM + 4, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
            }
            yRef.value += LINE_HEIGHT_NORMAL / 2;
        });
    } else {
        doc.setFontSize(TEXT_FONT_SIZE);
        doc.setFont("helvetica", "normal");
        addTextWithPageBreaks(doc, t('no_content_yet_placeholder_pdf'), MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    }
    yRef.value += LINE_HEIGHT_NORMAL;

    // CRM Pipeline
    doc.addPage();
    totalPagesRef.current = doc.getNumberOfPages();
    yRef.value = MARGIN_MM;
    
    doc.setFontSize(SECTION_TITLE_FONT_SIZE);
    addTextWithPageBreaks(doc, t(SalesSubSection.CRM_PIPELINE), MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
    doc.setFontSize(TEXT_FONT_SIZE);
    
    const stages: ['prospects', 'negotiation', 'closed', 'lost'] = ['prospects', 'negotiation', 'closed', 'lost'];
    stages.forEach(stage => {
        const leadsInStage = initialData.crmLeads.filter(lead => lead.stage === stage);
        if (leadsInStage.length > 0) {
            doc.setFont("helvetica", "bold");
            addTextWithPageBreaks(doc, t(`crm_stage_${stage}` as TranslationKey), MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
            doc.setFont("helvetica", "normal");
            leadsInStage.forEach(lead => {
                let leadDetails = `- ${lead.name}`;
                if (lead.email) leadDetails += ` (${lead.email})`;
                addTextWithPageBreaks(doc, leadDetails, MARGIN_MM + 4, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
            });
            yRef.value += LINE_HEIGHT_NORMAL / 2;
        }
    });

    if (initialData.crmLeads.length === 0) {
      addTextWithPageBreaks(doc, t('no_content_yet_placeholder_pdf'), MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    }

    for (let i = 1; i <= totalPagesRef.current; i++) {
        doc.setPage(i);
        addPageFooter(doc, i, totalPagesRef.current, t);
    }
    doc.save(`${t('sales_page_title', 'sales_plan').toLowerCase().replace(/\s/g, '_')}_export.pdf`);
  };
  
  const handleGenerateG2M = async () => {
    setIsLoadingAi(true);
    setError(null);
    try {
        const generatedPhases = await generateLaunchSequence(canvasData, personasData, researchData, language);
        if (generatedPhases && generatedPhases.length > 0) {
            const newLaunchSequence: LaunchPhase[] = generatedPhases.map(phase => ({
                id: `phase-ai-${Date.now()}-${Math.random()}`,
                name: phase.name,
                activities: phase.activities.map(activity => ({
                    id: `act-ai-${Date.now()}-${Math.random()}`,
                    name: activity.name,
                    status: 'todo',
                })),
            }));
            onUpdateData({ ...initialData, launchSequence: newLaunchSequence });
            setIsAiModalOpen(false);
        } else {
            setError(t('error_ai_failed_generic'));
        }
    } catch(e) {
        console.error("Failed to generate Go-to-Market sequence:", e);
        setError(t('error_ai_failed_generic'));
    } finally {
        setIsLoadingAi(false);
    }
  };

  const currentHelpContent = SALES_SECTIONS_HELP.find(h => h.title === activeSubSection) || SALES_SECTIONS_HELP[0];

  const handleSubSectionSelect = (subSection: SalesSubSection) => {
    setActiveSubSection(subSection);
    if (window.innerWidth < 768 && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const renderContent = () => {
    switch(activeSubSection) {
      case SalesSubSection.GO_TO_MARKET:
        return <GoToMarketArchitect 
            salesData={initialData}
            onUpdateData={onUpdateData}
            t={t}
            language={language}
        />;
      case SalesSubSection.CRM_PIPELINE:
        return <CrmPipelinePage 
            salesData={initialData}
            onUpdateData={onUpdateData}
            t={t}
            language={language}
        />;
      default:
        return <p>Select a section</p>;
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
          <h3 className="text-xl font-semibold text-slate-100">{t('sales_sidebar_title')}</h3>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            {SALES_SECTIONS_HELP.map(sectionHelp => (
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
                  {/* FIX: Cast sidebarTitle to TranslationKey to resolve TypeScript error */}
                  {t(sectionHelp.sidebarTitle[language] as TranslationKey, sectionHelp.title)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 pt-6 border-t border-slate-700">
             <Button onClick={handleExportAll} variant="secondary" className="w-full">{t('export_all_button')}</Button>
        </div>
      </aside>

      <main className="flex-grow p-4 md:p-8 bg-transparent shadow-inner overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-100">{pageTitle}</h2>
          <Button variant="outline" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
            {isSidebarOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
        </div>
        {renderContent()}
      </main>
      
      <FloatingActionButton
        icon={<HelpIcon className="h-6 w-6" />}
        tooltip={t('sales_help_button_tooltip')}
        onClick={() => setIsHelpModalOpen(true)}
        className="bottom-28 right-6 z-30"
        colorClass="bg-slate-600 hover:bg-slate-500"
        size="md"
      />
      {activeSubSection === SalesSubSection.GO_TO_MARKET && (
        <FloatingActionButton
            icon={<SparklesIcon className="h-7 w-7" />}
            tooltip={t('sales_ai_button_tooltip')}
            onClick={() => setIsAiModalOpen(true)}
            className="bottom-6 right-6 z-30"
            colorClass="bg-blue-600 hover:bg-blue-500"
            size="lg"
        />
      )}
      
      <Modal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        // FIX: Cast sidebarTitle to TranslationKey to resolve TypeScript error
        title={`${t('mra_help_modal_title_prefix')}: ${t(currentHelpContent.sidebarTitle[language] as TranslationKey, currentHelpContent.title)}`}
        size="xl"
      >
        <div className="prose prose-sm prose-invert max-w-none text-slate-300 whitespace-pre-line max-h-[70vh] overflow-y-auto pr-2">
          {t(currentHelpContent.explanationKey)}
        </div>
      </Modal>

       <Modal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        title={t('ai_g2m_modal_title')}
        size="lg"
      >
        <div className="text-center">
            <p className="text-slate-300 mb-6">{t('ai_g2m_modal_description')}</p>
            {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-lg mb-4 text-sm">{error}</p>}
            <Button
                variant="primary"
                size="lg"
                onClick={handleGenerateG2M}
                disabled={isLoadingAi}
                leftIcon={isLoadingAi ? <SpinnerIcon className="h-5 w-5" /> : <SparklesIcon className="h-5 w-5" />}
            >
                {isLoadingAi ? t('ai_g2m_modal_generating_button') : t('ai_g2m_modal_generate_button')}
            </Button>
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

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 7.5l.813 2.846a4.5 4.5 0 01-3.09 3.09L12.187 15l-2.846.813a4.5 4.5 0 01-3.09-3.09L5.437 10.5l2.846-.813a4.5 4.5 0 013.09-3.09L12 3.75l.813 2.846a4.5 4.5 0 013.09 3.09L18.75 9l-2.846.813a4.5 4.5 0 01-3.09-3.09L12.187 6 12 5.25l.187.75z" />
    </svg>
);

const SpinnerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" {...props} className={`animate-spin ${props.className || ''}`}>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default SalesPage;