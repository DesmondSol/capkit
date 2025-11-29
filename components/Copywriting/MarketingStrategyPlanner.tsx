import React, { useState, useEffect } from 'react';
import {
  CopywritingData,
  MarketingStrategy,
  Language,
  UserProfile,
  CanvasData,
  MarketResearchData,
  PersonasData,
  TranslationKey
} from '../../types';
import { Button } from '../common/Button';
import { MarketingStrategyModal } from './MarketingStrategyModal';
import { AiMarketingStrategyModal } from './AiMarketingStrategyModal';
import { generateMarketingStrategy } from '../../services/geminiService';
import { GENERIC_ERROR_MESSAGE } from '../../constants';
import { addUserProfileHeader, addPageFooter, addTextWithPageBreaks, MARGIN_MM, LINE_HEIGHT_NORMAL, TITLE_FONT_SIZE, LINE_HEIGHT_TITLE, SECTION_TITLE_FONT_SIZE, LINE_HEIGHT_SECTION_TITLE, TEXT_FONT_SIZE } from '../../utils/pdfUtils';


interface MarketingStrategyPlannerProps {
  copywritingData: CopywritingData;
  onUpdateData: (data: CopywritingData) => void;
  strategyData: Partial<CanvasData>;
  researchData: MarketResearchData;
  personasData: PersonasData;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
  userProfile: UserProfile | null;
  openAiModalFlag: boolean;
  setOpenAiModalFlag: (isOpen: boolean) => void;
}

export const MarketingStrategyPlanner: React.FC<MarketingStrategyPlannerProps> = ({
  copywritingData,
  onUpdateData,
  strategyData,
  researchData,
  personasData,
  language,
  t,
  userProfile,
  openAiModalFlag,
  setOpenAiModalFlag,
}) => {
  // ... (Keep existing state and handlers: handleOpenManualModal, handleSaveStrategy, handleDeleteStrategy, handleGenerateAiStrategy)
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<MarketingStrategy | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (openAiModalFlag) {
      setIsAiModalOpen(true);
      setOpenAiModalFlag(false); // Reset flag
    }
  }, [openAiModalFlag, setOpenAiModalFlag]);

  const handleOpenManualModal = (strategy: MarketingStrategy | null) => {
    setEditingStrategy(strategy);
    setIsManualModalOpen(true);
  };

  const handleSaveStrategy = (strategyToSave: MarketingStrategy) => {
    let updatedStrategies: MarketingStrategy[];
    if (editingStrategy) { // Editing existing
      updatedStrategies = copywritingData.marketingStrategies.map(s => s.id === strategyToSave.id ? strategyToSave : s);
    } else { // Adding new
      updatedStrategies = [...copywritingData.marketingStrategies, { ...strategyToSave, id: `ms-${Date.now()}` }];
    }
    onUpdateData({ ...copywritingData, marketingStrategies: updatedStrategies });
    setIsManualModalOpen(false);
    setEditingStrategy(null);
  };

  const handleDeleteStrategy = (id: string) => {
    if (window.confirm(t('delete_button') + `?`)) {
      const updatedStrategies = copywritingData.marketingStrategies.filter(s => s.id !== id);
      onUpdateData({ ...copywritingData, marketingStrategies: updatedStrategies });
    }
  };

  const handleGenerateAiStrategy = async (inputs: { primaryGoal: string, totalBudget: string, duration: string }) => {
    setIsLoadingAi(true);
    setError(null);
    try {
      const result = await generateMarketingStrategy(inputs, strategyData, researchData, personasData, language);
      if (result) {
        onUpdateData({ ...copywritingData, marketingStrategies: [...copywritingData.marketingStrategies, result] });
        setIsAiModalOpen(false);
      } else {
        setError(t('error_ai_failed_generic'));
      }
    } catch (e) {
      console.error("AI Marketing Strategy generation failed:", e);
      setError(t('error_ai_failed_generic'));
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleExportStrategies = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const yRef = { value: MARGIN_MM };
    let totalPagesRef = { current: doc.getNumberOfPages() };

    addUserProfileHeader(doc, userProfile, yRef, totalPagesRef, t);

    doc.setFontSize(TITLE_FONT_SIZE);
    doc.setFont("helvetica", "bold");
    addTextWithPageBreaks(doc, t('copywriting_strategy_title'), MARGIN_MM, yRef, {}, LINE_HEIGHT_TITLE, totalPagesRef, t);
    yRef.value += LINE_HEIGHT_NORMAL;

    doc.setFontSize(TEXT_FONT_SIZE);
    doc.setFont("helvetica", "normal");

    if (copywritingData.marketingStrategies.length > 0) {
      copywritingData.marketingStrategies.forEach(strategy => {
        if (yRef.value > 270) { doc.addPage(); totalPagesRef.current = doc.getNumberOfPages(); yRef.value = MARGIN_MM; }

        doc.setFont("helvetica", "bold");
        addTextWithPageBreaks(doc, strategy.title, MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
        doc.setFont("helvetica", "normal");

        const details = [
          strategy.objectives ? `${t('strategy_modal_objectives_label')}: ${strategy.objectives}` : null,
          strategy.tacticsAndChannels ? `${t('strategy_modal_tactics_label')}: ${strategy.tacticsAndChannels}` : null,
          strategy.timeline ? `${t('strategy_modal_timeline_label')}: ${strategy.timeline}` : null,
          strategy.budgetAllocation ? `${t('strategy_modal_budget_label')}: ${strategy.budgetAllocation}` : null
        ].filter(Boolean) as string[];

        details.forEach(detail => {
          addTextWithPageBreaks(doc, detail, MARGIN_MM + 4, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
        });
        yRef.value += LINE_HEIGHT_NORMAL / 2;
      });
    } else {
      addTextWithPageBreaks(doc, t('no_content_yet_placeholder_pdf'), MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    }

    addPageFooter(doc, doc.getNumberOfPages(), totalPagesRef.current, t);
    doc.save(`${t('copywriting_strategy_title', 'marketing_strategies').toLowerCase().replace(/\s/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-800 rounded-xl shadow-xl border border-slate-700">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-xl font-semibold text-blue-400">{t('copywriting_strategy_title')}</h3>
          <div className="flex space-x-3">
            <Button onClick={handleExportStrategies} variant="outline" size="sm" leftIcon={<DownloadIcon className="h-4 w-4" />}>
              {t('export_all_button')} {/* Reusing export all text or add specific key */}
            </Button>
            <Button onClick={() => handleOpenManualModal(null)} leftIcon={<PlusIcon className="h-5 w-5" />} variant="secondary">
              {t('marketing_strategy_add_button')}
            </Button>
          </div>
        </div>

        {/* ... (Rest of the render logic remains same) ... */}
        {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-lg mb-4 text-sm">{error}</p>}

        {copywritingData.marketingStrategies.length === 0 ? (
          <p className="text-slate-500 italic text-center py-6">{t('marketing_strategy_no_strategies_placeholder')}</p>
        ) : (
          <div className="space-y-4">
            {copywritingData.marketingStrategies.map(strategy => (
              <div key={strategy.id} className="p-4 bg-slate-700/50 rounded-lg shadow-md border border-slate-600 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                      {strategy.title}
                      {strategy.isAiGenerated && <SparklesIcon className="h-4 w-4 text-blue-400 flex-shrink-0" title="AI Generated" />}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 mb-1">
                      Created: {new Date(strategy.createdAt).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US')}
                    </p>
                    <p className="text-sm text-slate-300 line-clamp-2">{strategy.objectives}</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2 pt-2 sm:pt-0">
                    <Button variant="danger" size="sm" onClick={() => handleDeleteStrategy(strategy.id)}>
                      {t('delete_button')}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleOpenManualModal(strategy)}>
                      {t('view_strategy_button')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isManualModalOpen && (
        <MarketingStrategyModal
          isOpen={isManualModalOpen}
          onClose={() => setIsManualModalOpen(false)}
          onSave={handleSaveStrategy}
          strategyData={editingStrategy}
          t={t}
        />
      )}
      {isAiModalOpen && (
        <AiMarketingStrategyModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          onGenerate={handleGenerateAiStrategy}
          isLoading={isLoadingAi}
          t={t}
        />
      )}
    </div>
  );
};

// --- SVG Icons ---
const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);
const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }> = ({ title, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 7.5l.813 2.846a4.5 4.5 0 01-3.09 3.09L12.187 15l-2.846.813a4.5 4.5 0 01-3.09-3.09L5.437 10.5l2.846-.813a4.5 4.5 0 013.09-3.09L12 3.75l.813 2.846a4.5 4.5 0 013.09 3.09L18.75 9l-2.846.813a4.5 4.5 0 01-3.09-3.09L12.187 6 12 5.25l.187.75z" />
  </svg>
);
const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);