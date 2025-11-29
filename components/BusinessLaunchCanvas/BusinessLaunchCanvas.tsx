import React, { useState, useEffect, useCallback } from 'react';
import { CanvasSection, CanvasData, ALL_CANVAS_SECTIONS, CanvasSectionHelp, Language, UserProfile, TranslationKey } from '../../types';
import { CANVAS_SECTIONS_HELP, GENERIC_ERROR_MESSAGE } from '../../constants';
import { generateBusinessCanvasContent } from '../../services/geminiService';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { FloatingActionButton } from '../common/FloatingActionButton';
import { addUserProfileHeader, addPageFooter, addTextWithPageBreaks, MARGIN_MM, LINE_HEIGHT_NORMAL, TITLE_FONT_SIZE, LINE_HEIGHT_TITLE, SECTION_TITLE_FONT_SIZE, LINE_HEIGHT_SECTION_TITLE } from '../../utils/pdfUtils';


interface SectionContentEditorProps {
  section: CanvasSection;
  content: string;
  onSave: (section: CanvasSection, newContent: string) => void;
  t: (key: TranslationKey, defaultText?: string) => string;
  language: Language;
}

const SectionContentEditor: React.FC<SectionContentEditorProps> = ({ section, content, onSave, t, language }) => {
  const [editing, setEditing] = useState(false);
  const [currentContent, setCurrentContent] = useState(content);

  useEffect(() => {
    setCurrentContent(content);
  }, [content]);

  const handleSave = () => {
    onSave(section, currentContent);
    setEditing(false);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-blue-400">{t(section as TranslationKey, section)}</h3>
        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            {t('edit_button', 'Edit')}
            <PencilIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {editing ? (
        <div>
          <textarea
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)}
            className="w-full h-48 p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            placeholder={`${t('no_content_yet_placeholder', 'Enter details for')} ${t(section as TranslationKey, section)}...`}
          />
          <div className="mt-4 flex space-x-3">
            <Button onClick={handleSave} size="sm" variant="primary">{t('save_button', 'Save')}</Button>
            <Button variant="outline" size="sm" onClick={() => { setEditing(false); setCurrentContent(content); }}>{t('cancel_button', 'Cancel')}</Button>
          </div>
        </div>
      ) : (
        <p className="text-slate-300 whitespace-pre-wrap min-h-[60px] prose prose-sm prose-invert max-w-none"> {/* prose-invert for dark mode text styling */}
          {content || <span className="text-slate-500 italic">{t('no_content_yet_placeholder')}</span>}
        </p>
      )}
    </div>
  );
};

interface BusinessLaunchCanvasProps {
  canvasData: CanvasData;
  onSaveSection: (section: CanvasSection, content: string) => void;
  onMassUpdate: (newData: Partial<CanvasData>) => void;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
  userProfile: UserProfile | null;
}

export const BusinessLaunchCanvas: React.FC<BusinessLaunchCanvasProps> = ({ canvasData, onSaveSection, onMassUpdate, language, t, userProfile }) => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const [aiForm, setAiForm] = useState({ idea: '', q1: '', q2: '', q3: '' });
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    const { default: jsPDF } = await import('jspdf'); // Dynamic import
    const doc = new jsPDF();
    doc.setTextColor(50, 50, 50); // Dark gray for text
    const yRef = { value: MARGIN_MM };
    const totalPagesRef = { current: doc.getNumberOfPages() };

    addUserProfileHeader(doc, userProfile, yRef, totalPagesRef, t);

    doc.setFontSize(TITLE_FONT_SIZE);
    doc.setFont("helvetica", "bold");
    const mainTitleText = `CapKit - ${t('businessLaunchCanvas_title')}`;
    addTextWithPageBreaks(doc, mainTitleText, MARGIN_MM, yRef, {}, LINE_HEIGHT_TITLE, totalPagesRef, t);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const exportDateText = `${t('exported_on_label')}: ${new Date().toLocaleString(language === 'am' ? 'am-ET' : 'en-US')}`;
    addTextWithPageBreaks(doc, exportDateText, MARGIN_MM, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    yRef.value += LINE_HEIGHT_NORMAL;

    ALL_CANVAS_SECTIONS.forEach(section => {
      doc.setFontSize(SECTION_TITLE_FONT_SIZE);
      doc.setFont("helvetica", "bold");
      const sectionTitleText = t(section as TranslationKey, section);
      addTextWithPageBreaks(doc, sectionTitleText, MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const contentText = canvasData[section] || t('no_content_yet_placeholder_pdf');
      addTextWithPageBreaks(doc, contentText, MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
      yRef.value += LINE_HEIGHT_NORMAL * 0.75;
    });

    // Ensure last page has a footer
    addPageFooter(doc, totalPagesRef.current, totalPagesRef.current, t);

    doc.save(`${t('businessLaunchCanvas_title', 'business_launch_canvas').toLowerCase().replace(/\s/g, '_')}.pdf`);
  };

  const handleAiGenerate = async () => {
    if (!aiForm.idea.trim()) {
      setError(t('error_ai_no_idea'));
      return;
    }
    setIsLoadingAi(true);
    setError(null);
    try {
      const result = await generateBusinessCanvasContent(
        aiForm.idea,
        aiForm.q1,
        aiForm.q2,
        aiForm.q3,
        ALL_CANVAS_SECTIONS,
        language
      );
      if (result) {
        onMassUpdate(result);
        setIsAiModalOpen(false);
        setAiForm({ idea: '', q1: '', q2: '', q3: '' });
      } else {
        setError(t('error_ai_failed_generic'));
      }
    } catch (e) {
      console.error(e);
      setError(t('error_ai_failed_generic'));
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleAiInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAiForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem-2rem)] relative bg-transparent">
      <div className="flex-grow p-1 sm:p-4 md:p-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-slate-100">{t('businessLaunchCanvas_title')}</h2>
          <Button onClick={handleExport} variant="primary" leftIcon={<DownloadIcon className="h-5 w-5" />}>{t('export_all_button')}</Button>
        </div>

        <div className="space-y-8">
          {ALL_CANVAS_SECTIONS.map(section => (
            <div key={section} id={`section-${section.replace(/\s+/g, '-')}`}>
              <SectionContentEditor
                section={section}
                content={canvasData[section]}
                onSave={onSaveSection}
                t={t}
                language={language}
              />
            </div>
          ))}
        </div>
      </div>

      <FloatingActionButton
        icon={<HelpIcon className="h-6 w-6" />}
        tooltip={t('help_canvas_button_tooltip')}
        onClick={() => setIsHelpModalOpen(true)}
        className="bottom-28 right-6 z-30"
        colorClass="bg-slate-600 hover:bg-slate-500"
        size="md"
      />
      <FloatingActionButton
        icon={<SparklesIcon className="h-7 w-7" />}
        tooltip={t('ai_assistant_canvas_button_tooltip')}
        onClick={() => setIsAiModalOpen(true)}
        className="bottom-6 right-6 z-30"
        colorClass="bg-blue-600 hover:bg-blue-500"
        size="lg"
      />

      <Modal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} title={t('ai_assistant_modal_title_canvas')} size="xl">
        {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        <div className="space-y-5">
          <div>
            <label htmlFor="idea" className="block text-sm font-medium text-slate-300 mb-1">{t('ai_modal_idea_label')}</label>
            <textarea id="idea" name="idea" rows={3} value={aiForm.idea} onChange={handleAiInputChange} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400" placeholder={t('ai_modal_idea_placeholder')} />
          </div>
          <div>
            <label htmlFor="q1" className="block text-sm font-medium text-slate-300 mb-1">{t('ai_modal_q1_label')}</label>
            <input type="text" id="q1" name="q1" value={aiForm.q1} onChange={handleAiInputChange} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400" placeholder={t('ai_modal_q1_placeholder')} />
          </div>
          <div>
            <label htmlFor="q2" className="block text-sm font-medium text-slate-300 mb-1">{t('ai_modal_q2_label')}</label>
            <input type="text" id="q2" name="q2" value={aiForm.q2} onChange={handleAiInputChange} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400" placeholder={t('ai_modal_q2_placeholder')} />
          </div>
          <div>
            <label htmlFor="q3" className="block text-sm font-medium text-slate-300 mb-1">{t('ai_modal_q3_label')}</label>
            <input type="text" id="q3" name="q3" value={aiForm.q3} onChange={handleAiInputChange} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400" placeholder={t('ai_modal_q3_placeholder')} />
          </div>
          <Button onClick={handleAiGenerate} disabled={isLoadingAi} className="w-full mt-2" variant="primary" size="lg">
            {isLoadingAi ? (
              <SpinnerIcon className="h-5 w-5" />
            ) : (
              <SparklesIcon className="h-5 w-5" />
            )}
            {isLoadingAi ? t('ai_modal_generating_button_canvas') : t('ai_modal_generate_button_canvas')}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} title={t('help_modal_title_canvas')} size="xl">
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {CANVAS_SECTIONS_HELP.map(helpItem => (
            <div key={helpItem.title} className="p-4 bg-slate-700/50 rounded-lg shadow-inner">
              <h4 className="text-xl font-semibold text-blue-400 mb-2">{t(helpItem.title as TranslationKey, helpItem.title)}</h4>
              <p className="text-slate-300 mb-2 whitespace-pre-line prose prose-sm prose-invert max-w-none">{helpItem.explanation[language] || helpItem.explanation.en}</p>
              {helpItem.example && (helpItem.example[language] || helpItem.example.en) && (
                <div>
                  <h5 className="text-sm font-semibold text-slate-400 mb-1">{language === 'am' ? 'ምሳሌ:' : 'Example:'}</h5>
                  <p className="text-sm text-slate-400 bg-slate-600/50 p-3 rounded whitespace-pre-line border border-slate-500 prose prose-sm prose-invert max-w-none">
                    {helpItem.example[language] || helpItem.example.en}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

// --- SVG Icons ---
const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
  </svg>
);

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const HelpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
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