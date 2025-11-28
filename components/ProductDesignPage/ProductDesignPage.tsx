


import React, { useState, useEffect } from 'react';
import { ProductDesignData, ProductDesignSubSection, Language, UserProfile, TranslationKey, ProductDesignSectionHelp, CanvasData, ProductFeature } from '../../types';
import { PRODUCT_DESIGN_SECTIONS_HELP } from '../../constants';
import { BrainstormBoard } from './BrainstormBoard';
import { ProductPlanning } from './ProductPlanning';
import { ActionBoard } from './ActionBoard';
import { FeedbackAggregator } from './FeedbackAggregator';
import { ComingSoon } from '../ComingSoon';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { FloatingActionButton } from '../common/FloatingActionButton';
import { generateProductFeatures } from '../../services/geminiService';
import { addUserProfileHeader, addPageFooter, addTextWithPageBreaks, MARGIN_MM, LINE_HEIGHT_NORMAL, TITLE_FONT_SIZE, LINE_HEIGHT_TITLE, SECTION_TITLE_FONT_SIZE, LINE_HEIGHT_SECTION_TITLE, TEXT_FONT_SIZE } from '../../utils/pdfUtils';

interface ProductDesignPageProps {
  initialData: ProductDesignData;
  onUpdateData: (data: ProductDesignData) => void;
  canvasData: Partial<CanvasData>;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
  userProfile: UserProfile | null;
}

const ProductDesignPage: React.FC<ProductDesignPageProps> = ({
  initialData,
  onUpdateData,
  canvasData,
  language,
  t,
  userProfile,
}) => {
  const [activeSubSection, setActiveSubSection] = useState<ProductDesignSubSection>(ProductDesignSubSection.BRAINSTORM_BOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isFeatureAiModalOpen, setIsFeatureAiModalOpen] = useState(false);
  const [isFeedbackAiModalOpen, setIsFeedbackAiModalOpen] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const pageTitleObject = PRODUCT_DESIGN_SECTIONS_HELP.find(s => s.title === activeSubSection);
  const pageTitle = pageTitleObject ? t(pageTitleObject.sidebarTitle[language] as TranslationKey, pageTitleObject.title) : t(activeSubSection as TranslationKey, activeSubSection);

  const handleExportAll = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const yRef = { value: MARGIN_MM };
    let totalPagesRef = { current: doc.getNumberOfPages() };
    
    addUserProfileHeader(doc, userProfile, yRef, totalPagesRef, t);

    doc.setFontSize(TITLE_FONT_SIZE);
    doc.setFont("helvetica", "bold");
    addTextWithPageBreaks(doc, t('product_design_page_title'), MARGIN_MM, yRef, {}, LINE_HEIGHT_TITLE, totalPagesRef, t);
    yRef.value += LINE_HEIGHT_NORMAL;

    // 1. Brainstorm Board
    doc.setFontSize(SECTION_TITLE_FONT_SIZE);
    doc.setFont("helvetica", "bold");
    addTextWithPageBreaks(doc, t(ProductDesignSubSection.BRAINSTORM_BOARD), MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
    doc.setFontSize(TEXT_FONT_SIZE);
    doc.setFont("helvetica", "normal");
    if (initialData.brainstormIdeas.length > 0) {
        const ideasText = initialData.brainstormIdeas.map(idea => `- ${idea.content}`);
        addTextWithPageBreaks(doc, ideasText, MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    } else {
        addTextWithPageBreaks(doc, t('no_content_yet_placeholder_pdf'), MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    }
    yRef.value += LINE_HEIGHT_NORMAL;

    // 2. Product Planning
    doc.setFontSize(SECTION_TITLE_FONT_SIZE);
    addTextWithPageBreaks(doc, t(ProductDesignSubSection.PRODUCT_PLANNING), MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
    if (initialData.features.length > 0) {
        initialData.features.forEach(feature => {
            doc.setFontSize(TEXT_FONT_SIZE + 2);
            doc.setFont("helvetica", "bold");
            const priorityText = t(`planning_priority_${feature.priority}` as TranslationKey, feature.priority);
            addTextWithPageBreaks(doc, `${feature.name} [${priorityText}]`, MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
            doc.setFontSize(TEXT_FONT_SIZE);
            doc.setFont("helvetica", "normal");
            feature.versions.forEach(version => {
                const versionDetails = [
                    `  v${version.versionNumber} (${new Date(version.createdAt).toLocaleDateString()}):`,
                    `    - Desc: ${version.description || '-'}`,
                    `    - Problem Solved: ${version.problemSolved || '-'}`,
                    `    - Feedback: ${version.feedbackNotes || '-'}`
                ];
                addTextWithPageBreaks(doc, versionDetails, MARGIN_MM + 4, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
            });
            yRef.value += LINE_HEIGHT_NORMAL / 2;
        });
    } else {
        doc.setFontSize(TEXT_FONT_SIZE);
        doc.setFont("helvetica", "normal");
        addTextWithPageBreaks(doc, t('no_content_yet_placeholder_pdf'), MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    }
    yRef.value += LINE_HEIGHT_NORMAL;

    // 3. Action Board
    doc.setFontSize(SECTION_TITLE_FONT_SIZE);
    addTextWithPageBreaks(doc, t(ProductDesignSubSection.ACTION_BOARD), MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
    const KANBAN_COLUMNS = ['idea', 'design', 'build', 'deploy'];
    KANBAN_COLUMNS.forEach(status => {
      const itemsInStatus = initialData.actionItems.filter(item => item.status === status);
      if(itemsInStatus.length > 0) {
        doc.setFontSize(TEXT_FONT_SIZE + 2);
        doc.setFont("helvetica", "bold");
        addTextWithPageBreaks(doc, t(`action_board_status_${status}` as TranslationKey, status), MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
        doc.setFontSize(TEXT_FONT_SIZE);
        doc.setFont("helvetica", "normal");
        itemsInStatus.forEach(item => {
          addTextWithPageBreaks(doc, ` - ${item.title}: ${item.description || ''}`, MARGIN_MM + 4, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
        });
      }
    });
    if (initialData.actionItems.length === 0) {
        addTextWithPageBreaks(doc, t('no_content_yet_placeholder_pdf'), MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    }
    yRef.value += LINE_HEIGHT_NORMAL;

    // 4. Feedback Aggregator
    doc.setFontSize(SECTION_TITLE_FONT_SIZE);
    addTextWithPageBreaks(doc, t(ProductDesignSubSection.FEEDBACK_AGGREGATOR), MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
    doc.setFontSize(TEXT_FONT_SIZE);
    doc.setFont("helvetica", "normal");
    if (initialData.feedbackItems.length > 0) {
        initialData.feedbackItems.forEach(item => {
            const sourceText = t(`feedback_source_${item.source}` as TranslationKey, item.source);
            const urgencyText = t(`feedback_urgency_${item.urgency}` as TranslationKey, item.urgency);
            addTextWithPageBreaks(doc, `[${sourceText} | ${urgencyText}] ${item.content}`, MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
        });
    } else {
        addTextWithPageBreaks(doc, t('no_content_yet_placeholder_pdf'), MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    }
    yRef.value += LINE_HEIGHT_NORMAL;

    for (let i = 1; i <= totalPagesRef.current; i++) {
        doc.setPage(i);
        addPageFooter(doc, i, totalPagesRef.current, t);
    }
    doc.save(`${t('product_design_page_title', 'product_design').toLowerCase().replace(/\s/g, '_')}_export.pdf`);
  };

  const handleGenerateFeatures = async () => {
    setIsLoadingAi(true);
    setError(null);
    try {
        const generatedFeatures = await generateProductFeatures(canvasData, language);

        if (generatedFeatures && generatedFeatures.length > 0) {
            const newProductFeatures: ProductFeature[] = generatedFeatures.map(f => {
                const now = new Date().toISOString();
                return {
                    id: `feat-${Date.now()}-${Math.random()}`,
                    name: f.name,
                    priority: f.priority,
                    createdAt: now,
                    versions: [{
                        id: `ver-${Date.now()}-${Math.random()}`,
                        versionNumber: 1,
                        description: f.description,
                        problemSolved: f.problemSolved,
                        feedbackNotes: '',
                        createdAt: now,
                    }]
                };
            });

            onUpdateData({
                ...initialData,
                features: [...initialData.features, ...newProductFeatures],
            });
            setIsFeatureAiModalOpen(false);
        } else {
            setError(t('error_ai_failed_generic'));
        }
    } catch(e) {
        console.error("Failed to generate features:", e);
        setError(t('error_ai_failed_generic'));
    } finally {
        setIsLoadingAi(false);
    }
  };


  const currentHelpContent = PRODUCT_DESIGN_SECTIONS_HELP.find(h => h.title === activeSubSection) || PRODUCT_DESIGN_SECTIONS_HELP[0];

  const handleSubSectionSelect = (subSection: ProductDesignSubSection) => {
    setActiveSubSection(subSection);
    if (window.innerWidth < 768 && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const renderContent = () => {
    switch(activeSubSection) {
      case ProductDesignSubSection.BRAINSTORM_BOARD:
        return <BrainstormBoard productDesignData={initialData} onUpdateData={onUpdateData} t={t} />;
      case ProductDesignSubSection.PRODUCT_PLANNING:
        return <ProductPlanning productDesignData={initialData} onUpdateData={onUpdateData} t={t} language={language} />;
      case ProductDesignSubSection.ACTION_BOARD:
        return <ActionBoard productDesignData={initialData} onUpdateData={onUpdateData} t={t} language={language} />;
      case ProductDesignSubSection.FEEDBACK_AGGREGATOR:
        return <FeedbackAggregator
          productDesignData={initialData}
          onUpdateData={onUpdateData}
          t={t}
          language={language}
          isAiModalOpen={isFeedbackAiModalOpen}
          setIsAiModalOpen={setIsFeedbackAiModalOpen}
        />;
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
          <h3 className="text-xl font-semibold text-slate-100">{t('product_design_sidebar_title')}</h3>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            {PRODUCT_DESIGN_SECTIONS_HELP.map(sectionHelp => (
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
        tooltip={t('product_design_help_button_tooltip')}
        onClick={() => setIsHelpModalOpen(true)}
        className="bottom-28 right-6 z-30"
        colorClass="bg-slate-600 hover:bg-slate-500"
        size="md"
      />
      {activeSubSection === ProductDesignSubSection.PRODUCT_PLANNING && (
        <FloatingActionButton
          icon={<SparklesIcon className="h-7 w-7" />}
          tooltip={t('product_design_ai_button_tooltip')}
          onClick={() => setIsFeatureAiModalOpen(true)}
          className="bottom-6 right-6 z-30"
          colorClass="bg-blue-600 hover:bg-blue-500"
          size="lg"
        />
      )}
       {activeSubSection === ProductDesignSubSection.FEEDBACK_AGGREGATOR && (
        <FloatingActionButton
          icon={<SparklesIcon className="h-7 w-7" />}
          tooltip={t('ai_feedback_modal_title')}
          onClick={() => setIsFeedbackAiModalOpen(true)}
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
        isOpen={isFeatureAiModalOpen}
        onClose={() => setIsFeatureAiModalOpen(false)}
        title={t('ai_feature_modal_title')}
        size="lg"
      >
        <div className="text-center">
            <p className="text-slate-300 mb-6">{t('ai_feature_modal_description')}</p>
            {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-lg mb-4 text-sm">{error}</p>}
            <Button
                variant="primary"
                size="lg"
                onClick={handleGenerateFeatures}
                disabled={isLoadingAi}
                leftIcon={isLoadingAi ? <SpinnerIcon className="h-5 w-5" /> : <SparklesIcon className="h-5 w-5" />}
            >
                {isLoadingAi ? t('ai_feature_generating_button') : t('ai_feature_generate_button')}
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

export default ProductDesignPage;
