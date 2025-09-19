
import React, { useState, useCallback, ChangeEvent, useEffect } from 'react';
import { 
    MarketResearchData, 
    ResearchSection, 
    ResearchQuestionItem, 
    ResearchSectionHelp,
    CompetitorProfile,
    TrendEntry,
    CanvasData,
    CanvasSection, 
    ResearchQuestionnaireSet,
    Language,
    UserProfile,
    TranslationKey
} from '../../types';
import { RESEARCH_SECTIONS_HELP, GENERIC_ERROR_MESSAGE } from '../../constants';
import { generateMarketResearchQuestions, generateMarketResearchSummary } from '../../services/geminiService';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { FloatingActionButton } from '../common/FloatingActionButton';
import { addUserProfileHeader, addPageFooter, addTextWithPageBreaks, MARGIN_MM, LINE_HEIGHT_NORMAL, TITLE_FONT_SIZE, LINE_HEIGHT_TITLE, SECTION_TITLE_FONT_SIZE, LINE_HEIGHT_SECTION_TITLE, TEXT_FONT_SIZE } from '../../utils/pdfUtils';

interface ResearchQuestionCardProps {
  item: ResearchQuestionItem;
  questionSetId: string;
  onUpdateQuestionText: (questionSetId: string, questionId: string, text: string) => void;
  onRemoveQuestion: (questionSetId: string, questionId: string) => void;
  onAddResponse: (questionSetId: string, questionId: string, responseText: string) => void;
  onRemoveResponse: (questionSetId: string, questionId: string, responseId: string) => void;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
}

const ResearchQuestionCard: React.FC<ResearchQuestionCardProps> = ({ 
    item, questionSetId, onUpdateQuestionText, onRemoveQuestion, onAddResponse, onRemoveResponse, language, t 
}) => {
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const [newResponse, setNewResponse] = useState('');

  useEffect(() => {
    setEditText(item.text);
  }, [item.text]);

  const handleSaveQuestion = () => {
    onUpdateQuestionText(questionSetId, item.id, editText);
    setIsEditingQuestion(false);
  };

  const handleAddResponse = () => {
    if (newResponse.trim()) {
      onAddResponse(questionSetId, item.id, newResponse.trim());
      setNewResponse('');
    }
  };

  return (
    <div className="p-4 bg-slate-700/50 rounded-lg shadow-md mb-4 border border-slate-600">
      <div className="flex justify-between items-start mb-3">
        {isEditingQuestion ? (
          <div className="flex-grow mr-2">
            <textarea 
              value={editText} 
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-2 bg-slate-600 border border-slate-500 rounded-md text-slate-200 text-sm focus:ring-blue-500 focus:border-blue-500"
              rows={2}
            />
            <Button size="sm" onClick={handleSaveQuestion} className="mt-2 mr-2">{t('save_button', 'Save Q')}</Button>
            <Button size="sm" variant="outline" onClick={() => {setIsEditingQuestion(false); setEditText(item.text);}} className="mt-2">{t('cancel_button')}</Button>
          </div>
        ) : (
          <p className="text-slate-200 font-medium flex-grow mr-2 text-sm whitespace-pre-wrap">{item.text}</p>
        )}
        <div className="flex-shrink-0 flex items-center space-x-2">
          {!isEditingQuestion && <Button variant="outline" size="sm" onClick={() => setIsEditingQuestion(true)} className="p-1.5"><PencilIcon className="h-4 w-4"/></Button>}
          <Button variant="danger" size="sm" onClick={() => onRemoveQuestion(questionSetId, item.id)} className="p-1.5"><TrashIcon className="h-4 w-4"/></Button>
        </div>
      </div>
      
      <div className="ml-4 mt-3 border-t border-slate-600 pt-3">
        <h4 className="text-xs font-semibold text-slate-400 mb-2">{language === 'am' ? 'የግል ምላሾች፡' : 'Individual Responses:'}</h4>
        {item.responses.length > 0 ? (
          item.responses.map((resp) => ( 
            <div key={resp.id} className="text-xs text-slate-300 bg-slate-600/70 p-2 rounded shadow-sm mb-1.5 flex justify-between items-center">
              <span className="whitespace-pre-wrap flex-grow">{resp.text}</span>
              <Button size="sm" variant="danger" onClick={() => onRemoveResponse(questionSetId, item.id, resp.id)} className="p-1 ml-2 opacity-70 hover:opacity-100"><TrashIcon className="h-3 w-3"/></Button>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500 italic">{language === 'am' ? 'እስካሁን ምንም የግል ምላሾች አልተመዘገቡም።' : 'No individual responses recorded yet.'}</p>
        )}
        <div className="flex items-center mt-3">
          <input 
            type="text" 
            value={newResponse} 
            onChange={(e) => setNewResponse(e.target.value)} 
            placeholder={language === 'am' ? 'የግል ምላሽ አክል...' : "Add individual response..."}
            className="flex-grow p-2 bg-slate-600 border border-slate-500 rounded-l-md text-slate-200 text-xs focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400"
          />
          <Button size="sm" onClick={handleAddResponse} className="rounded-l-none text-xs px-3 py-2" disabled={!newResponse.trim()} variant="secondary">
            {language === 'am' ? 'ምላሽ ጨምር' : 'Add Resp.'}
          </Button>
        </div>
      </div>
    </div>
  );
};


interface CompetitorProfileEditorProps {
    profile: CompetitorProfile;
    onSave: (updatedProfile: CompetitorProfile) => void;
    onDelete: (id: string) => void;
    language: Language;
    t: (key: TranslationKey, defaultText?: string) => string;
}
const CompetitorProfileEditor: React.FC<CompetitorProfileEditorProps> = ({ profile, onSave, onDelete, language, t }) => {
    const [localProfile, setLocalProfile] = useState(profile);
    useEffect(() => setLocalProfile(profile), [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLocalProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const fieldLabels: { key: keyof CompetitorProfile; label: string; type?: string }[] = [
        { key: 'name', label: t('mra_competitor_analysis_title')},
        { key: 'pricingStrategy', label: t('mra_report_pricing_label'), type: 'textarea' },
        { key: 'keyFeatures', label: t('mra_report_features_label'), type: 'textarea' },
        { key: 'strengths', label: t('mra_report_strengths_label'), type: 'textarea' },
        { key: 'weaknesses', label: t('mra_report_weaknesses_label'), type: 'textarea' },
        { key: 'marketGapsAddressed', label: t('mra_report_gaps_label'), type: 'textarea' },
        { key: 'notes', label: t('mra_report_notes_label'), type: 'textarea' },
    ];

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 mb-6">
            {fieldLabels.map(field => field.key !== 'id' && (
                <div key={field.key} className="mb-4">
                    <label htmlFor={`${profile.id}-${field.key}`} className="block text-sm font-medium text-slate-300 mb-1">{field.label}:</label>
                    {field.type === 'textarea' ? (
                        <textarea
                            id={`${profile.id}-${field.key}`}
                            name={field.key}
                            value={localProfile[field.key]}
                            onChange={handleChange}
                            rows={3}
                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-slate-400"
                        />
                    ) : (
                        <input
                            type="text"
                            id={`${profile.id}-${field.key}`}
                            name={field.key}
                            value={String(localProfile[field.key])}
                            onChange={handleChange}
                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-slate-400"
                        />
                    )}
                </div>
            ))}
            <div className="flex justify-end space-x-3 mt-4">
                <Button variant="danger" size="md" onClick={() => onDelete(profile.id)}>{language === 'am' ? 'መገለጫ ሰርዝ' : 'Delete Profile'}</Button>
                <Button variant="primary" size="md" onClick={() => onSave(localProfile)}>{language === 'am' ? 'መገለጫ አስቀምጥ' : 'Save Profile'}</Button>
            </div>
        </div>
    );
};

interface TrendEntryEditorProps {
 entry: TrendEntry;
  onSave: (updatedEntry: TrendEntry) => void;
  onDelete: (id: string) => void;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
}
const TrendEntryEditor: React.FC<TrendEntryEditorProps> = ({ entry, onSave, onDelete, language, t }) => {
    const [localEntry, setLocalEntry] = useState(entry);
    useEffect(() => setLocalEntry(entry), [entry]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLocalEntry(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const fieldLabels: { key: keyof TrendEntry; label: string; type?: string }[] = [
        { key: 'title', label: t('mra_trends_title') },
        { key: 'description', label: t('mra_report_description_label'), type: 'textarea' },
        { key: 'sourceEvidence', label: t('mra_report_source_label'), type: 'textarea' },
        { key: 'timeframe', label: t('mra_report_timeframe_label') },
        { key: 'locationMarket', label: t('mra_report_location_label') },
        { key: 'potentialImpact', label: t('mra_report_impact_label'), type: 'textarea' },
        { key: 'notes', label: t('mra_report_notes_label'), type: 'textarea' },
    ];

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 mb-6">
             {fieldLabels.map(field => field.key !== 'id' && (
                <div key={field.key} className="mb-4">
                    <label htmlFor={`${entry.id}-${field.key}`} className="block text-sm font-medium text-slate-300 mb-1">{field.label}:</label>
                    {field.type === 'textarea' ? (
                        <textarea
                            id={`${entry.id}-${field.key}`}
                            name={field.key}
                            value={localEntry[field.key]}
                            onChange={handleChange}
                            rows={3}
                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-slate-400"
                        />
                    ) : (
                        <input
                            type="text"
                            id={`${entry.id}-${field.key}`}
                            name={field.key}
                            value={String(localEntry[field.key])}
                            onChange={handleChange}
                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-slate-400"
                        />
                    )}
                </div>
            ))}
            <div className="flex justify-end space-x-3 mt-4">
                <Button variant="danger" size="md" onClick={() => onDelete(entry.id)}>{language === 'am' ? 'አዝማሚያ ሰርዝ' : 'Delete Trend'}</Button>
                <Button variant="primary" size="md" onClick={() => onSave(localEntry)}>{language === 'am' ? 'አዝማሚያ አስቀምጥ' : 'Save Trend'}</Button>
            </div>
        </div>
    );
};

interface MarketResearchAcceleratorProps {
  initialData: MarketResearchData;
  onUpdateData: (data: MarketResearchData) => void;
  strategyData: Partial<CanvasData>; 
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
  userProfile: UserProfile | null;
}

export const MarketResearchAccelerator: React.FC<MarketResearchAcceleratorProps> = ({ initialData, onUpdateData, strategyData, language, t, userProfile }) => {
  const [activeResearchSection, setActiveResearchSection] = useState<ResearchSection>(ResearchSection.QUESTIONS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [currentHelpContent, setCurrentHelpContent] = useState<ResearchSectionHelp | null>(
    RESEARCH_SECTIONS_HELP.find(h => h.title === activeResearchSection) || RESEARCH_SECTIONS_HELP[0]
  );
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeQuestionnaireSetId, setActiveQuestionnaireSetId] = useState<string | null>(null);
  const [isCreateSetModalOpen, setIsCreateSetModalOpen] = useState(false);
  const [newSetForm, setNewSetForm] = useState({ name: '', researchGoal: '', targetAudience: '' });
  
  const [manualQuestion, setManualQuestion] = useState('');
  const [editingCompetitorId, setEditingCompetitorId] = useState<string | null>(null);
  const [editingTrendId, setEditingTrendId] = useState<string | null>(null);

   useEffect(() => {
    if (window.innerWidth < 768) { 
        setIsSidebarOpen(false);
    }
    if (!activeQuestionnaireSetId && initialData[ResearchSection.QUESTIONS].length > 0) {
      setActiveQuestionnaireSetId(initialData[ResearchSection.QUESTIONS][0].id);
    }
  }, []);

   useEffect(() => {
    if (activeQuestionnaireSetId && !initialData[ResearchSection.QUESTIONS].find(s => s.id === activeQuestionnaireSetId)) {
      setActiveQuestionnaireSetId(initialData[ResearchSection.QUESTIONS].length > 0 ? initialData[ResearchSection.QUESTIONS][0].id : null);
    } else if (!activeQuestionnaireSetId && initialData[ResearchSection.QUESTIONS].length > 0) {
      setActiveQuestionnaireSetId(initialData[ResearchSection.QUESTIONS][0].id);
    }
  }, [initialData[ResearchSection.QUESTIONS], activeQuestionnaireSetId]);


  const handleCreateNewQuestionnaireSet = () => {
    if (!newSetForm.name.trim() || !newSetForm.researchGoal.trim() || !newSetForm.targetAudience.trim()) {
      setError(t('mra_error_fill_all_fields'));
      return;
    }
    setError(null);
    const newSet: ResearchQuestionnaireSet = {
      id: `set-${Date.now()}`,
      name: newSetForm.name.trim(),
      researchGoal: newSetForm.researchGoal.trim(),
      targetAudience: newSetForm.targetAudience.trim(),
      questions: []
    };
    onUpdateData({
      ...initialData,
      [ResearchSection.QUESTIONS]: [...initialData[ResearchSection.QUESTIONS], newSet]
    });
    setActiveQuestionnaireSetId(newSet.id);
    setIsCreateSetModalOpen(false);
    setNewSetForm({ name: '', researchGoal: '', targetAudience: '' });
  };

  const handleDeleteQuestionnaireSet = (setId: string) => {
    const confirmMessage = language === 'am' 
      ? "ይህን ሙሉ የምርምር ስብስብ እና ሁሉንም ጥያቄዎቹን መሰረዝ እንደሚፈልጉ እርግጠኛ ነዎት?"
      : "Are you sure you want to delete this entire research set and all its questions?";
    if (window.confirm(confirmMessage)) {
        const updatedSets = initialData[ResearchSection.QUESTIONS].filter(set => set.id !== setId);
        onUpdateData({
            ...initialData,
            [ResearchSection.QUESTIONS]: updatedSets
        });
        if (activeQuestionnaireSetId === setId) {
            setActiveQuestionnaireSetId(updatedSets.length > 0 ? updatedSets[0].id : null);
        }
    }
  };

  const handleGeneralNotesChange = useCallback((value: string) => {
    onUpdateData({ ...initialData, [ResearchSection.GENERAL_NOTES_IMPORT]: value });
  }, [initialData, onUpdateData]);

  const handleAddManualQuestion = () => {
    if (manualQuestion.trim() && activeQuestionnaireSetId) {
      const newQuestion: ResearchQuestionItem = { 
        id: `manual-${Date.now()}`, 
        text: manualQuestion.trim(),
        responses: [] 
      };
      const updatedSets = initialData[ResearchSection.QUESTIONS].map(set => 
        set.id === activeQuestionnaireSetId 
          ? { ...set, questions: [...set.questions, newQuestion] }
          : set
      );
      onUpdateData({ 
        ...initialData, 
        [ResearchSection.QUESTIONS]: updatedSets
      });
      setManualQuestion('');
    } else if (!activeQuestionnaireSetId) {
        setError(t('mra_error_select_or_create_set'));
    }
  };

  const handleUpdateQuestionText = (questionSetId: string, questionId: string, text: string) => {
    const updatedSets = initialData[ResearchSection.QUESTIONS].map(set => 
      set.id === questionSetId 
        ? { ...set, questions: set.questions.map(q => q.id === questionId ? { ...q, text } : q) }
        : set
    );
    onUpdateData({
      ...initialData,
      [ResearchSection.QUESTIONS]: updatedSets
    });
  };

  const handleRemoveQuestion = (questionSetId: string, questionId: string) => {
    const updatedSets = initialData[ResearchSection.QUESTIONS].map(set => 
      set.id === questionSetId 
        ? { ...set, questions: set.questions.filter(q => q.id !== questionId) }
        : set
    );
    onUpdateData({
      ...initialData,
      [ResearchSection.QUESTIONS]: updatedSets
    });
  };
  
  const handleAddResponseToQuestion = (questionSetId: string, questionId: string, responseText: string) => {
    const updatedSets = initialData[ResearchSection.QUESTIONS].map(set => {
      if (set.id === questionSetId) {
        return { 
          ...set, 
          questions: set.questions.map(q => {
            if (q.id === questionId) {
              return { ...q, responses: [...q.responses, {id: `resp-${Date.now()}`, text: responseText}] };
            }
            return q;
          }) 
        };
      }
      return set;
    });
    onUpdateData({
      ...initialData,
      [ResearchSection.QUESTIONS]: updatedSets
    });
  };

  const handleRemoveResponseFromQuestion = (questionSetId: string, questionId: string, responseId: string) => {
     const updatedSets = initialData[ResearchSection.QUESTIONS].map(set => {
      if (set.id === questionSetId) {
        return { 
          ...set, 
          questions: set.questions.map(q => {
            if (q.id === questionId) {
              return { ...q, responses: q.responses.filter(r => r.id !== responseId) };
            }
            return q;
          }) 
        };
      }
      return set;
    });
    onUpdateData({
      ...initialData,
      [ResearchSection.QUESTIONS]: updatedSets
    });
  };

  const handleAiGenerateQuestions = async () => {
    const currentSet = initialData[ResearchSection.QUESTIONS].find(s => s.id === activeQuestionnaireSetId);
    if (!currentSet) {
      setError(t('mra_error_select_or_create_set'));
      return;
    }
    if (!strategyData || Object.keys(strategyData).filter(k=>strategyData[k as CanvasSection]?.trim()).length === 0) {
        setError(t('mra_questions_ai_requires_canvas_note'));
        return;
    }

    setIsLoadingAi(true);
    setError(null);
    try {
      const questions = await generateMarketResearchQuestions(strategyData, currentSet.researchGoal, currentSet.targetAudience, language);
      if (questions.length > 0) {
        const updatedSets = initialData[ResearchSection.QUESTIONS].map(set => 
          set.id === activeQuestionnaireSetId 
            ? { ...set, questions: [...set.questions, ...questions] } 
            : set
        );
        onUpdateData({ 
          ...initialData, 
          [ResearchSection.QUESTIONS]: updatedSets 
        });
      } else {
         setError(t('error_ai_failed_generic', "AI could not generate questions. Try rephrasing research goal/audience or check API key and Strategy Canvas content."));
      }
    } catch (e) { console.error(e); setError(t('error_ai_failed_generic')); } 
    finally { setIsLoadingAi(false); }
  };

  const handleAddCompetitor = () => {
    const newCompetitor: CompetitorProfile = {
      id: `comp-${Date.now()}`, name: language === 'am' ? "አዲስ ተፎካካሪ" : "New Competitor", pricingStrategy: "", keyFeatures: "",
      strengths: "", weaknesses: "", marketGapsAddressed: "", notes: ""
    };
    onUpdateData({ ...initialData, [ResearchSection.COMPETITOR_ANALYSIS]: [...initialData[ResearchSection.COMPETITOR_ANALYSIS], newCompetitor] });
    setEditingCompetitorId(newCompetitor.id); 
    setEditingTrendId(null); // Ensure only one editor is active
  };

  const handleSaveCompetitor = (updatedProfile: CompetitorProfile) => {
    const updatedCompetitors = initialData[ResearchSection.COMPETITOR_ANALYSIS].map(c => c.id === updatedProfile.id ? updatedProfile : c);
    onUpdateData({
      ...initialData,
      [ResearchSection.COMPETITOR_ANALYSIS]: updatedCompetitors
    });
    setEditingCompetitorId(null);
  };

  const handleDeleteCompetitor = (id: string) => {
    const updatedCompetitors = initialData[ResearchSection.COMPETITOR_ANALYSIS].filter(c => c.id !== id);
    onUpdateData({
      ...initialData,
      [ResearchSection.COMPETITOR_ANALYSIS]: updatedCompetitors
    });
    if (editingCompetitorId === id) setEditingCompetitorId(null);
  };

  const handleAddTrend = () => {
    const newTrend: TrendEntry = {
      id: `trend-${Date.now()}`, title: language === 'am' ? "አዲስ አዝማሚያ" : "New Trend", description: "", sourceEvidence: "", 
      timeframe: "", locationMarket: "", potentialImpact: "", notes: ""
    };
    onUpdateData({ ...initialData, [ResearchSection.TRENDS]: [...initialData[ResearchSection.TRENDS], newTrend] });
    setEditingTrendId(newTrend.id); 
    setEditingCompetitorId(null); // Ensure only one editor is active
  };

  const handleSaveTrend = (updatedEntry: TrendEntry) => {
    const updatedTrends = initialData[ResearchSection.TRENDS].map(t => t.id === updatedEntry.id ? updatedEntry : t);
    onUpdateData({
      ...initialData,
      [ResearchSection.TRENDS]: updatedTrends
    });
    setEditingTrendId(null);
  };

  const handleDeleteTrend = (id: string) => {
    const updatedTrends = initialData[ResearchSection.TRENDS].filter(t => t.id !== id);
    onUpdateData({
      ...initialData,
      [ResearchSection.TRENDS]: updatedTrends
    });
     if (editingTrendId === id) setEditingTrendId(null);
  };

  const handleGenerateSummary = async () => {
    setIsLoadingAi(true);
    setError(null);
    try {
      const summary = await generateMarketResearchSummary(
        { 
          [ResearchSection.QUESTIONS]: initialData[ResearchSection.QUESTIONS],
          [ResearchSection.GENERAL_NOTES_IMPORT]: initialData[ResearchSection.GENERAL_NOTES_IMPORT],
          [ResearchSection.COMPETITOR_ANALYSIS]: initialData[ResearchSection.COMPETITOR_ANALYSIS],
          [ResearchSection.TRENDS]: initialData[ResearchSection.TRENDS],
        },
        strategyData,
        language
      );
      onUpdateData({ ...initialData, [ResearchSection.AI_SUMMARY]: summary || (language === 'am' ? "AI ማጠቃለያ ማመንጨት አልቻለም።" : "AI could not generate a summary.") });
       if (!summary) setError(t('error_ai_failed_generic', "AI could not generate a summary. Ensure relevant sections and strategy canvas have data or check API key."));
    } catch (e) { console.error(e); setError(t('error_ai_failed_generic')); } 
    finally { setIsLoadingAi(false); }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const simplifiedCsvContent = text.split('\n').map(line => line.split(',').join(' | ')).join('\n'); 
        const importHeader = language === 'am' ? "--- ከ CSV የገባ ውሂብ ---" : "--- Imported CSV Data ---";
        onUpdateData({ 
            ...initialData, 
            [ResearchSection.GENERAL_NOTES_IMPORT]: 
                (initialData[ResearchSection.GENERAL_NOTES_IMPORT] ? initialData[ResearchSection.GENERAL_NOTES_IMPORT] + "\n\n" : "") + 
                importHeader + "\n" + 
                simplifiedCsvContent 
        });
      };
      reader.readAsText(file);
      event.target.value = ''; 
    }
  };
  
  const handleExport = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const yRef = { value: MARGIN_MM };
    const totalPagesRef = { current: doc.getNumberOfPages() };

    addUserProfileHeader(doc, userProfile, yRef, totalPagesRef, t);

    const activeSectionHelp = RESEARCH_SECTIONS_HELP.find(h => h.title === activeResearchSection);
    const translatedSectionTitleForFileName = activeSectionHelp ? t(activeSectionHelp.sidebarTitle[language] as TranslationKey, activeResearchSection) : activeResearchSection;
    const translatedSectionTitleForDisplay = activeSectionHelp ? t(activeSectionHelp.sidebarTitle[language] as TranslationKey, activeResearchSection) : t(activeResearchSection as TranslationKey, activeResearchSection);

    doc.setFontSize(TITLE_FONT_SIZE);
    doc.setFont("helvetica", "bold");
    const mainTitleText = `7set Spark - ${t('market_research_accelerator_page_title')} - ${translatedSectionTitleForDisplay}`;
    addTextWithPageBreaks(doc, mainTitleText, MARGIN_MM, yRef, {}, LINE_HEIGHT_TITLE, totalPagesRef, t);
    
    doc.setFontSize(TEXT_FONT_SIZE - 2);
    doc.setFont("helvetica", "normal");
    const exportDateText = `${t('exported_on_label')}: ${new Date().toLocaleString(language === 'am' ? 'am-ET' : 'en-US')}`;
    addTextWithPageBreaks(doc, exportDateText, MARGIN_MM, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    yRef.value += LINE_HEIGHT_NORMAL;

    switch (activeResearchSection) {
      case ResearchSection.QUESTIONS:
        initialData[ResearchSection.QUESTIONS].forEach(set => {
          doc.setFontSize(SECTION_TITLE_FONT_SIZE - 2);
          doc.setFont("helvetica", "bold");
          const setTitleText = `${t('mra_report_set_title')}: ${set.name} (${t('mra_report_goal_label')}: ${set.researchGoal}, ${t('mra_report_audience_label')}: ${set.targetAudience})`;
          addTextWithPageBreaks(doc, setTitleText, MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE * 0.9, totalPagesRef, t);
          doc.setFontSize(TEXT_FONT_SIZE);
          doc.setFont("helvetica", "normal");

          set.questions.forEach(q => {
            const qText = `${t('mra_report_question_label')}: ${q.text}`;
            addTextWithPageBreaks(doc, qText, MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
            if (q.responses.length > 0) {
              const rTitle = `  ${t('mra_report_responses_label')}:`;
              addTextWithPageBreaks(doc, rTitle, MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
              q.responses.forEach(r => {
                addTextWithPageBreaks(doc, `    - ${r.text}`, MARGIN_MM + 4, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
              });
            }
            yRef.value += LINE_HEIGHT_NORMAL * 0.5; 
          });
          yRef.value += LINE_HEIGHT_NORMAL; 
        });
        break;
      case ResearchSection.GENERAL_NOTES_IMPORT:
        const notes = initialData[ResearchSection.GENERAL_NOTES_IMPORT] || t('no_content_yet_placeholder_pdf');
        addTextWithPageBreaks(doc, notes, MARGIN_MM, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
        break;
      case ResearchSection.COMPETITOR_ANALYSIS:
        initialData[ResearchSection.COMPETITOR_ANALYSIS].forEach(comp => {
          doc.setFontSize(SECTION_TITLE_FONT_SIZE - 2);
          doc.setFont("helvetica", "bold");
          addTextWithPageBreaks(doc, comp.name, MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE * 0.9, totalPagesRef, t);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(TEXT_FONT_SIZE);
          
          const fields = [
            { labelKey: 'mra_report_pricing_label', value: comp.pricingStrategy },
            { labelKey: 'mra_report_features_label', value: comp.keyFeatures },
            { labelKey: 'mra_report_strengths_label', value: comp.strengths },
            { labelKey: 'mra_report_weaknesses_label', value: comp.weaknesses },
            { labelKey: 'mra_report_gaps_label', value: comp.marketGapsAddressed },
            { labelKey: 'mra_report_notes_label', value: comp.notes },
          ];
          fields.forEach(field => {
            if (field.value) {
              addTextWithPageBreaks(doc, `${t(field.labelKey as TranslationKey)}: ${field.value}`, MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
            }
          });
          yRef.value += LINE_HEIGHT_NORMAL;
        });
        break;
      case ResearchSection.TRENDS:
        initialData[ResearchSection.TRENDS].forEach(trend => {
          doc.setFontSize(SECTION_TITLE_FONT_SIZE - 2);
          doc.setFont("helvetica", "bold");
          addTextWithPageBreaks(doc, trend.title, MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE * 0.9, totalPagesRef, t);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(TEXT_FONT_SIZE);
          const fields = [
            { labelKey: 'mra_report_description_label', value: trend.description },
            { labelKey: 'mra_report_source_label', value: trend.sourceEvidence },
            { labelKey: 'mra_report_timeframe_label', value: trend.timeframe },
            { labelKey: 'mra_report_location_label', value: trend.locationMarket },
            { labelKey: 'mra_report_impact_label', value: trend.potentialImpact },
            { labelKey: 'mra_report_notes_label', value: trend.notes },
          ];
          fields.forEach(field => {
            if (field.value) {
              addTextWithPageBreaks(doc, `${t(field.labelKey as TranslationKey)}: ${field.value}`, MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
            }
          });
          yRef.value += LINE_HEIGHT_NORMAL;
        });
        break;
      case ResearchSection.AI_SUMMARY:
        const summary = initialData[ResearchSection.AI_SUMMARY] || t('no_content_yet_placeholder_pdf');
        addTextWithPageBreaks(doc, summary, MARGIN_MM, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
        break;
    }

    addPageFooter(doc, totalPagesRef.current, totalPagesRef.current, t);

    const fileNameBase = language === 'am' ? 'የገበያ_ጥናት' : 'market_research';
    doc.save(`${fileNameBase}_${translatedSectionTitleForFileName.toLowerCase().replace(/\s+|&|\//g, '_')}.pdf`);
  };

  const openHelpModalForSection = (sectionKey: ResearchSection) => {
    const help = RESEARCH_SECTIONS_HELP.find(h => h.title === sectionKey);
    setCurrentHelpContent(help || { 
        title: sectionKey, 
        sidebarTitle: {en: sectionKey, am: sectionKey}, 
        explanation: {en: "No help text available.", am: "ምንም የእገዛ ጽሑፍ የለም።"} 
    });
    setIsHelpModalOpen(true);
  };
  
  const currentActiveSet = initialData[ResearchSection.QUESTIONS].find(s => s.id === activeQuestionnaireSetId);

  const renderSectionContent = () => {
    if (error && activeResearchSection !== ResearchSection.AI_SUMMARY) { 
      if(activeResearchSection !== ResearchSection.QUESTIONS) setError(null);
    }
    const currentSectionHelp = RESEARCH_SECTIONS_HELP.find(h => h.title === activeResearchSection);
    const translatedSectionTitle = currentSectionHelp ? t(currentSectionHelp.sidebarTitle[language] as TranslationKey, activeResearchSection) : t(activeResearchSection as TranslationKey, activeResearchSection);


    switch (activeResearchSection) {
      case ResearchSection.QUESTIONS:
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 p-5 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
                <div>
                    <h3 className="text-xl font-semibold text-blue-400">{translatedSectionTitle}</h3>
                    <p className="text-sm text-slate-400 mt-1">{language === 'am' ? 'የተለያዩ ግቦች ወይም ታዳሚዎች ላሏቸው የተለያዩ የምርምር ጥያቄ ስብስቦችን ያስተዳድሩ።' : 'Manage different sets of research questions for various goals or audiences.'}</p>
                </div>
                <Button onClick={() => { setIsCreateSetModalOpen(true); setError(null); }} leftIcon={<PlusIcon className="h-5 w-5"/>} variant="secondary">
                    {t('mra_questions_create_set_button')}
                </Button>
            </div>

            {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-lg mb-4 text-sm">{error}</p>}

            {initialData[ResearchSection.QUESTIONS].length > 0 && (
                <div className="mb-6 p-4 bg-slate-800 rounded-xl shadow-md border border-slate-700">
                    <label htmlFor="activeQuestionnaireSet" className="block text-sm font-medium text-slate-300 mb-1">{t('mra_questions_active_set_label')}</label>
                    <div className="flex items-center space-x-2">
                        <select 
                            id="activeQuestionnaireSet"
                            value={activeQuestionnaireSetId || ""}
                            onChange={(e) => setActiveQuestionnaireSetId(e.target.value)}
                            className="flex-grow p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="" disabled className="text-slate-500">{t('mra_questions_select_set_placeholder')}</option>
                            {initialData[ResearchSection.QUESTIONS].map(set => (
                                <option key={set.id} value={set.id} className="text-slate-200">{set.name} ({set.researchGoal})</option>
                            ))}
                        </select>
                        {activeQuestionnaireSetId && (
                             <Button variant="danger" size="md" onClick={() => handleDeleteQuestionnaireSet(activeQuestionnaireSetId)} title={t('mra_questions_delete_set_button_title')} className="p-3">
                                <TrashIcon className="h-5 w-5"/>
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {currentActiveSet ? (
              <div className="p-5 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
                <h4 className="text-lg font-semibold text-blue-400 mb-1">{t('mra_questions_working_on_prefix')}: "{currentActiveSet.name}"</h4>
                <p className="text-xs text-slate-400 mb-1">{t('mra_questions_goal_prefix')}: {currentActiveSet.researchGoal}</p>
                <p className="text-xs text-slate-400 mb-4">{t('mra_questions_audience_prefix')}: {currentActiveSet.targetAudience}</p>
                
                <div className="bg-slate-700/50 p-4 rounded-lg shadow-inner mb-6 border border-slate-600">
                  <label htmlFor="manualQuestion" className="block text-sm font-medium text-slate-300 mb-1">{t('mra_questions_add_manual_label')}</label>
                  <div className="flex space-x-3">
                    <input
                      type="text" id="manualQuestion" value={manualQuestion} onChange={(e) => setManualQuestion(e.target.value)}
                      className="flex-grow p-3 bg-slate-600 border border-slate-500 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400"
                      placeholder={language === 'am' ? 'የምርምር ጥያቄዎን ያስገቡ' : "Enter your research question"}
                    />
                    <Button onClick={handleAddManualQuestion} disabled={!manualQuestion.trim()} variant="secondary">{t('mra_questions_add_manual_button')}</Button>
                  </div>
                </div>
                <Button variant="primary" onClick={() => {handleAiGenerateQuestions(); setError(null);}} leftIcon={<SparklesIcon className="h-5 w-5"/>} disabled={isLoadingAi || !strategyData || Object.keys(strategyData).filter(k=>strategyData[k as CanvasSection]?.trim()).length === 0}>
                  {isLoadingAi ? t('mra_questions_ai_generating_button') : t('mra_questions_ai_generate_button')}
                </Button>
                {(!strategyData || Object.keys(strategyData).filter(k=>strategyData[k as CanvasSection]?.trim()).length === 0) && <p className="text-xs text-amber-400 mt-2">{t('mra_questions_ai_requires_canvas_note')}</p>}

                <div className="mt-6 space-y-4">
                  {currentActiveSet.questions.length > 0 ? (
                    currentActiveSet.questions.map(q => (
                      <ResearchQuestionCard 
                        key={q.id} item={q} 
                        questionSetId={currentActiveSet.id}
                        onUpdateQuestionText={handleUpdateQuestionText} 
                        onRemoveQuestion={handleRemoveQuestion}
                        onAddResponse={handleAddResponseToQuestion}
                        onRemoveResponse={handleRemoveResponseFromQuestion}
                        language={language}
                        t={t}
                      />
                    ))
                  ) : (
                    <p className="text-slate-500 italic mt-4 text-center py-4">{t('mra_questions_no_questions_placeholder')}</p>
                  )}
                </div>
              </div>
            ) : (
                <p className="text-slate-500 italic p-6 text-center bg-slate-800 rounded-xl shadow-md border border-slate-700">
                    {initialData[ResearchSection.QUESTIONS].length > 0 
                        ? t('mra_questions_select_set_prompt')
                        : t('mra_questions_no_sets_prompt')
                    }
                </p>
            )}
          </div>
        );
      case ResearchSection.GENERAL_NOTES_IMPORT:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-400">{translatedSectionTitle}</h3>
             <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                <label htmlFor="csvUpload" className="block text-sm font-medium text-slate-300 mb-2">{t('mra_general_notes_import_csv_label')}</label>
                <input type="file" id="csvUpload" accept=".csv" onChange={handleFileUpload} 
                    className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-blue-300 hover:file:bg-slate-600 cursor-pointer"/>
                <p className="text-xs text-slate-500 mt-1">{t('mra_general_notes_csv_note')}</p>
             </div>
            <textarea
              value={initialData[ResearchSection.GENERAL_NOTES_IMPORT]}
              onChange={(e) => handleGeneralNotesChange(e.target.value)}
              rows={15}
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-lg placeholder-slate-500"
              placeholder={t('mra_general_notes_placeholder')}
            />
          </div>
        );
      case ResearchSection.COMPETITOR_ANALYSIS:
        const currentCompetitor = initialData[ResearchSection.COMPETITOR_ANALYSIS].find(c => c.id === editingCompetitorId);
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-blue-400">{translatedSectionTitle}</h3>
              <Button onClick={handleAddCompetitor} leftIcon={<PlusIcon className="h-5 w-5"/>} variant="secondary">{t('mra_competitor_add_button')}</Button>
            </div>
            {editingCompetitorId && currentCompetitor ? (
              <CompetitorProfileEditor profile={currentCompetitor} onSave={handleSaveCompetitor} onDelete={handleDeleteCompetitor} language={language} t={t} />
            ) : (
              <div className="space-y-3">
                {initialData[ResearchSection.COMPETITOR_ANALYSIS].length === 0 && <p className="text-slate-500 italic p-4 text-center bg-slate-800 rounded-xl border border-slate-700">{t('mra_competitor_no_competitors_placeholder')}</p>}
                {initialData[ResearchSection.COMPETITOR_ANALYSIS].map(comp => (
                  <div key={comp.id} className="bg-slate-800 p-4 rounded-xl shadow-md flex justify-between items-center border border-slate-700 hover:border-slate-600 transition-colors">
                    <span className="text-slate-200 font-medium">{comp.name}</span>
                    <Button variant="outline" size="sm" onClick={() => {setEditingCompetitorId(comp.id); setEditingTrendId(null);}}>{t('edit_button')}</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case ResearchSection.TRENDS:
        const currentTrend = initialData[ResearchSection.TRENDS].find(t => t.id === editingTrendId);
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-blue-400">{translatedSectionTitle}</h3>
                <Button onClick={handleAddTrend} leftIcon={<PlusIcon className="h-5 w-5"/>} variant="secondary">{t('mra_trends_add_button')}</Button>
            </div>
            {editingTrendId && currentTrend ? (
                <TrendEntryEditor entry={currentTrend} onSave={handleSaveTrend} onDelete={handleDeleteTrend} language={language} t={t} />
            ) : (
                <div className="space-y-3">
                    {initialData[ResearchSection.TRENDS].length === 0 && <p className="text-slate-500 italic p-4 text-center bg-slate-800 rounded-xl border border-slate-700">{t('mra_trends_no_trends_placeholder')}</p>}
                    {initialData[ResearchSection.TRENDS].map(trend => (
                        <div key={trend.id} className="bg-slate-800 p-4 rounded-xl shadow-md flex justify-between items-center border border-slate-700 hover:border-slate-600 transition-colors">
                            <span className="text-slate-200 font-medium">{trend.title}</span>
                             <Button variant="outline" size="sm" onClick={() => {setEditingTrendId(trend.id); setEditingCompetitorId(null);}}>{t('edit_button')}</Button>
                        </div>
                    ))}
                </div>
            )}
          </div>
        );
      case ResearchSection.AI_SUMMARY:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-400">{translatedSectionTitle}</h3>
            {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-lg mb-4 text-sm">{error}</p>}
            <Button onClick={() => {handleGenerateSummary(); setError(null);}} disabled={isLoadingAi} variant="primary" size="lg" leftIcon={<SparklesIcon className="h-5 w-5"/>}>
              {isLoadingAi ? (<><SpinnerIcon className="h-5 w-5 mr-2" /> {t('mra_ai_summary_generating_button')}</>) : t('mra_ai_summary_generate_button')}
            </Button>
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg min-h-[250px] whitespace-pre-wrap text-slate-300 border border-slate-700 prose prose-sm prose-invert max-w-none">
              {isLoadingAi && !initialData[ResearchSection.AI_SUMMARY] ? <div className="flex justify-center items-center h-full"><SpinnerIcon className="h-10 w-10 text-blue-500" /></div> : (initialData[ResearchSection.AI_SUMMARY] || <span className="italic text-slate-500">{t('mra_ai_summary_placeholder')}</span>)}
            </div>
          </div>
        );
      default: return <p className="text-slate-400">Select a section from the sidebar.</p>;
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
          <h3 className="text-xl font-semibold text-slate-100">{t('mra_sidebar_title')}</h3>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            {Object.values(ResearchSection).map(section => {
              const helpInfo = RESEARCH_SECTIONS_HELP.find(h => h.title === section);
              const sidebarTitle = helpInfo ? t(helpInfo.sidebarTitle[language] as TranslationKey, section) : t(section as TranslationKey, section);
              return (
                <li key={section}>
                  <a
                    href="#"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      setActiveResearchSection(section);
                      setCurrentHelpContent(helpInfo || {title: section, sidebarTitle: {[language]:t(section as TranslationKey, section)} as any, explanation: {en: "Error", am: "ስህተት"}});
                      setEditingCompetitorId(null); 
                      setEditingTrendId(null);    
                      if(window.innerWidth < 768 && isSidebarOpen) setIsSidebarOpen(false);
                    }}
                    className={`block px-4 py-3 rounded-lg transition-colors duration-200
                      ${activeResearchSection === section 
                        ? 'bg-blue-600 text-white font-semibold shadow-md' 
                        : 'hover:bg-slate-700 hover:text-slate-100'
                      }`}
                  >
                    {sidebarTitle}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <main className={`flex-grow p-4 md:p-8 bg-transparent shadow-inner overflow-y-auto ${isSidebarOpen && 'md:ml-0'}`}>
         <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-100">{t('market_research_accelerator_page_title')}</h2>
            <div className="flex items-center space-x-3">
                <Button onClick={handleExport} variant="primary" leftIcon={<DownloadIcon className="h-5 w-5"/>}>{t('export_current_view_button')}</Button>
                <Button variant="outline" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
                    {isSidebarOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
                </Button>
            </div>
         </div>
         {renderSectionContent()}
      </main>

       <FloatingActionButton
        icon={<HelpIcon className="h-6 w-6" />}
        tooltip={t('help_mra_button_tooltip')}
        onClick={() => openHelpModalForSection(activeResearchSection)}
        className="bottom-6 right-6 z-30" 
        colorClass="bg-slate-600 hover:bg-slate-500"
        size="md" 
      />

      <Modal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} title={`${t('mra_help_modal_title_prefix')}: ${currentHelpContent?.sidebarTitle[language] || currentHelpContent?.title || ''}`} size="xl">
        <div className="prose prose-sm prose-invert max-w-none text-slate-300 whitespace-pre-line max-h-[70vh] overflow-y-auto pr-2">
            {currentHelpContent?.explanation[language] || currentHelpContent?.explanation.en}
        </div>
      </Modal>

      <Modal isOpen={isCreateSetModalOpen} onClose={() => {setIsCreateSetModalOpen(false); setError(null); setNewSetForm({name: '', researchGoal: '', targetAudience: ''})}} title={t('mra_create_set_modal_title')} size="lg">
        {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        <div className="space-y-5">
          <div>
            <label htmlFor="setName" className="block text-sm font-medium text-slate-300 mb-1">{t('mra_create_set_name_label')}</label>
            <input type="text" id="setName" value={newSetForm.name} onChange={(e) => setNewSetForm(prev => ({...prev, name: e.target.value}))} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400" placeholder={language==='am'? 'ለምሳሌ፣ የቅድመ ተጠቃሚ አስተያየት':'e.g., Early Adopter Feedback'}/>
          </div>
          <div>
            <label htmlFor="setGoal" className="block text-sm font-medium text-slate-300 mb-1">{t('mra_create_set_goal_label')}</label>
            <textarea id="setGoal" rows={2} value={newSetForm.researchGoal} onChange={(e) => setNewSetForm(prev => ({...prev, researchGoal: e.target.value}))} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400" placeholder={language==='am' ? 'ለምሳሌ፣ ለዋና ባህሪ X ያለውን ፍላጎት ማረጋገጥ' : "e.g., Validate demand for core feature X"}/>
          </div>
           <div>
            <label htmlFor="setAudience" className="block text-sm font-medium text-slate-300 mb-1">{t('mra_create_set_audience_label')}</label>
            <input type="text" id="setAudience" value={newSetForm.targetAudience} onChange={(e) => setNewSetForm(prev => ({...prev, targetAudience: e.target.value}))} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400" placeholder={language === 'am' ? 'ለምሳሌ፣ በቴክኖሎጂ የተካኑ አነስተኛ የንግድ ባለቤቶች' : "e.g., Tech-savvy small business owners"}/>
          </div>
          <Button onClick={handleCreateNewQuestionnaireSet} className="w-full mt-2" variant="primary" size="lg">
            {t('mra_create_set_button')}
          </Button>
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

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25-.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
  </svg>
);

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
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

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

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
