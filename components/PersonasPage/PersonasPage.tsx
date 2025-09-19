import React, { useState } from 'react';
import { PersonasData, Persona, Language, UserProfile, TranslationKey, CanvasData, JobToBeDone } from '../../types';
import { Button } from '../common/Button';
import { PersonaDetail } from './PersonaDetail';
import { FloatingActionButton } from '../common/FloatingActionButton';
import { Modal } from '../common/Modal';
import { AiPersonaModal } from './AiPersonaModal';
import { generateAiPersona } from '../../services/geminiService';
import { addUserProfileHeader, addPageFooter, addTextWithPageBreaks, MARGIN_MM, LINE_HEIGHT_NORMAL, TITLE_FONT_SIZE, LINE_HEIGHT_TITLE, SECTION_TITLE_FONT_SIZE, LINE_HEIGHT_SECTION_TITLE, TEXT_FONT_SIZE } from '../../utils/pdfUtils';

interface PersonasPageProps {
  initialData: PersonasData;
  onUpdateData: (data: PersonasData) => void;
  canvasData: Partial<CanvasData>; // For AI context
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
  userProfile: UserProfile | null;
}

const personaIcons = [
  '👤', '👩‍💼', '👨‍💻', '👩‍🎨', '👨‍🌾', '👩‍🔬', '👨‍🚀', '👩‍🏫', '👨‍⚖️', '👩‍🍳',
  '👨‍🔧', '👩‍🏭', '👨‍🏢', '👩‍⚕️', '👨‍🎓', '👩‍🎤', '👨‍✈️', '👩‍🚀', '🕵️‍♀️', '💂‍♂️'
];

const getNewPersonaIcon = (existingCount: number) => {
    return personaIcons[existingCount % personaIcons.length];
}

const createNewPersona = (existingCount: number, t: (key: TranslationKey, defaultText?: string) => string): Persona => {
    return {
        id: `persona-${Date.now()}`,
        icon: getNewPersonaIcon(existingCount),
        name: `${t('persona_name_placeholder') || 'New Persona'} ${existingCount + 1}`,
        profession: '',
        gender: '',
        age: '',
        location: '',
        maritalStatus: '',
        education: '',
        bio: '',
        personality: {
            analyticalCreative: 50,
            busyTimeRich: 50,
            messyOrganized: 50,
            independentTeamPlayer: 50
        },
        traits: {
            buyingAuthority: 50,
            technical: 50,
            socialMedia: 50,
            selfHelping: 50
        },
        goals: '',
        likes: '',
        dislikes: '',
        frustrations: '',
        skills: '',
        jobsToBeDone: []
    };
};

export const PersonasPage: React.FC<PersonasPageProps> = ({
  initialData,
  onUpdateData,
  canvasData,
  language,
  t,
  userProfile,
}) => {
  const [editingPersonaId, setEditingPersonaId] = useState<string | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreatePersona = () => {
    const newPersona = createNewPersona(initialData.length, t);
    onUpdateData([...initialData, newPersona]);
    setEditingPersonaId(newPersona.id);
  };

  const handleSavePersona = (updatedPersona: Persona) => {
    const updatedData = initialData.map(p => p.id === updatedPersona.id ? updatedPersona : p);
    onUpdateData(updatedData);
    setEditingPersonaId(null); // Return to list view
  };
  
  const handleDeletePersona = (id: string) => {
    if (window.confirm(t('delete_button') + `?`)) {
        onUpdateData(initialData.filter(p => p.id !== id));
    }
  };
  
  const handleGenerateAiPersona = async (inputs: { idea: string, q1: string, q2: string, q3: string }) => {
    setIsLoadingAi(true);
    setError(null);
    try {
        const generatedPersonaData = await generateAiPersona(inputs.idea, inputs.q1, inputs.q2, inputs.q3, canvasData, language);
        if (generatedPersonaData) {
            const newPersona: Persona = {
                ...createNewPersona(initialData.length, t), // Get defaults like ID and icon
                ...generatedPersonaData, // Overwrite with AI data
            };
            onUpdateData([...initialData, newPersona]);
            setIsAiModalOpen(false);
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

  const handleExport = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const yRef = { value: MARGIN_MM };
    let totalPagesRef = { current: doc.getNumberOfPages() };

    addUserProfileHeader(doc, userProfile, yRef, totalPagesRef, t);
    
    doc.setFontSize(TITLE_FONT_SIZE);
    doc.setFont("helvetica", "bold");
    addTextWithPageBreaks(doc, t('pdf_persona_report_title'), MARGIN_MM, yRef, {}, LINE_HEIGHT_TITLE, totalPagesRef, t);
    yRef.value += LINE_HEIGHT_NORMAL;

    initialData.forEach((persona, index) => {
        if (index > 0) {
            doc.addPage();
            totalPagesRef.current = doc.getNumberOfPages();
            yRef.value = MARGIN_MM;
        }

        // Persona Header
        doc.setFontSize(SECTION_TITLE_FONT_SIZE + 2);
        doc.setFont("helvetica", "bold");
        addTextWithPageBreaks(doc, `${persona.icon} ${persona.name}`, MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
        doc.setFontSize(TEXT_FONT_SIZE);
        doc.setFont("helvetica", "italic");
        addTextWithPageBreaks(doc, persona.profession, MARGIN_MM, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
        yRef.value += LINE_HEIGHT_NORMAL / 2;

        // Demographics
        const demographics = [
            `${t('persona_age_label')}: ${persona.age || '-'}`,
            `${t('persona_gender_label')}: ${persona.gender || '-'}`,
            `${t('persona_location_label')}: ${persona.location || '-'}`,
            `${t('persona_marital_status_label')}: ${persona.maritalStatus || '-'}`,
            `${t('persona_education_label')}: ${persona.education || '-'}`,
        ];
        addTextWithPageBreaks(doc, demographics, MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
        yRef.value += LINE_HEIGHT_NORMAL;
        
        // Bio
        doc.setFontSize(SECTION_TITLE_FONT_SIZE);
        doc.setFont("helvetica", "bold");
        addTextWithPageBreaks(doc, t('pdf_persona_bio_title'), MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
        doc.setFontSize(TEXT_FONT_SIZE);
        doc.setFont("helvetica", "normal");
        addTextWithPageBreaks(doc, persona.bio || t('no_content_yet_placeholder_pdf'), MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
        yRef.value += LINE_HEIGHT_NORMAL;

        // Goals, Frustrations, etc.
        const textSections: { titleKey: TranslationKey; content: string }[] = [
            { titleKey: 'pdf_persona_goals_title', content: persona.goals },
            { titleKey: 'pdf_persona_frustrations_title', content: persona.frustrations },
        ];
        textSections.forEach(sec => {
            doc.setFontSize(SECTION_TITLE_FONT_SIZE);
            doc.setFont("helvetica", "bold");
            addTextWithPageBreaks(doc, t(sec.titleKey), MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
            doc.setFontSize(TEXT_FONT_SIZE);
            doc.setFont("helvetica", "normal");
            addTextWithPageBreaks(doc, sec.content || t('no_content_yet_placeholder_pdf'), MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
            yRef.value += LINE_HEIGHT_NORMAL;
        });

        // Jobs To Be Done
        doc.setFontSize(SECTION_TITLE_FONT_SIZE);
        doc.setFont("helvetica", "bold");
        addTextWithPageBreaks(doc, t('pdf_persona_jtbd_title'), MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
        doc.setFontSize(TEXT_FONT_SIZE);
        doc.setFont("helvetica", "normal");
        if (persona.jobsToBeDone.length > 0) {
            persona.jobsToBeDone.forEach(job => {
                doc.setFont("helvetica", "bold");
                addTextWithPageBreaks(doc, job.title, MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
                doc.setFont("helvetica", "normal");
                addTextWithPageBreaks(doc, `${t('jtbd_situation_prompt')} ${job.situation}`, MARGIN_MM + 4, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
                addTextWithPageBreaks(doc, `${t('jtbd_motivation_prompt')} ${job.motivation}`, MARGIN_MM + 4, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
                addTextWithPageBreaks(doc, `${t('jtbd_outcome_prompt')} ${job.outcome}`, MARGIN_MM + 4, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
                yRef.value += LINE_HEIGHT_NORMAL / 2;
            });
        } else {
             addTextWithPageBreaks(doc, t('no_content_yet_placeholder_pdf'), MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
        }
    });

    for (let i = 1; i <= totalPagesRef.current; i++) {
        doc.setPage(i);
        addPageFooter(doc, i, totalPagesRef.current, t);
    }
    
    doc.save(`${t('pdf_persona_report_title', 'personas_report').toLowerCase().replace(/\s/g, '_')}.pdf`);
  };

  const editingPersona = initialData.find(p => p.id === editingPersonaId);

  const helpItems: { titleKey: TranslationKey; descKey: TranslationKey }[] = [
      { titleKey: 'personas_help_name_title', descKey: 'personas_help_name_desc' },
      { titleKey: 'personas_help_demographics_title', descKey: 'personas_help_demographics_desc' },
      { titleKey: 'personas_help_bio_title', descKey: 'personas_help_bio_desc' },
      { titleKey: 'personas_help_personality_title', descKey: 'personas_help_personality_desc' },
      { titleKey: 'personas_help_traits_title', descKey: 'personas_help_traits_desc' },
      { titleKey: 'personas_help_goals_title', descKey: 'personas_help_goals_desc' },
      { titleKey: 'personas_help_frustrations_title', descKey: 'personas_help_frustrations_desc' },
      { titleKey: 'personas_help_jtbd_title', descKey: 'personas_help_jtbd_desc' },
  ];

  // Detail View
  if (editingPersona) {
    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-slate-100 mb-6">{t('personas_edit_persona_title')}</h2>
            <PersonaDetail
                persona={editingPersona}
                onSave={handleSavePersona}
                onClose={() => setEditingPersonaId(null)}
                language={language}
                t={t}
            />
        </div>
    )
  }

  // List View
  return (
    <div className="relative p-4 md:p-8 min-h-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-slate-100">{t('personas_page_title')}</h2>
            <div className="flex items-center space-x-3">
                <Button onClick={handleExport} variant="outline" disabled={initialData.length === 0}>{t('export_all_personas_button')}</Button>
                <Button onClick={handleCreatePersona} variant="primary">{t('personas_create_new_button')}</Button>
            </div>
        </div>
        
        {initialData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-slate-800 rounded-xl shadow-inner border border-slate-700 min-h-[400px]">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-2xl font-bold text-slate-100 mb-2">{t('personas_welcome_title')}</h3>
                <p className="text-slate-400 max-w-md mb-6">{t('personas_welcome_message')}</p>
                <Button onClick={handleCreatePersona} variant="primary" size="lg">{t('personas_create_new_button')}</Button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {initialData.map(p => (
                    <div key={p.id} className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-5 flex flex-col justify-between hover:border-blue-500 transition-colors">
                       <div>
                            <div className="flex items-start mb-4">
                                <span className="text-4xl mr-4">{p.icon}</span>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-100 truncate">{p.name}</h4>
                                    <p className="text-sm text-slate-400 truncate">{p.profession}</p>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-3 min-h-[45px]">
                                {p.bio || (t('persona_bio_placeholder') + '...')}
                            </p>
                       </div>
                        <div className="mt-5 pt-4 border-t border-slate-700 flex justify-end space-x-3">
                            <Button variant="danger" size="sm" onClick={() => handleDeletePersona(p.id)}>{t('delete_button')}</Button>
                            <Button variant="outline" size="sm" onClick={() => setEditingPersonaId(p.id)}>{t('edit_button')}</Button>
                        </div>
                    </div>
                ))}
            </div>
        )}

      {/* FABs */}
      <FloatingActionButton
        icon={<HelpIcon className="h-6 w-6" />}
        tooltip={t('personas_help_button_tooltip')}
        onClick={() => setIsHelpModalOpen(true)}
        className="bottom-28 right-6 z-30"
        colorClass="bg-slate-600 hover:bg-slate-500"
        size="md"
      />
      <FloatingActionButton
        icon={<SparklesIcon className="h-7 w-7"/>}
        tooltip={t('personas_ai_generate_button_tooltip')}
        onClick={() => setIsAiModalOpen(true)}
        className="bottom-6 right-6 z-30"
        colorClass="bg-blue-600 hover:bg-blue-500"
        size="lg"
      />

      {/* Help Modal */}
       <Modal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} title={t('personas_help_modal_title')} size="xl">
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 text-slate-300">
                <p className="italic">{t('personas_help_intro')}</p>
                {helpItems.map(item => (
                    <div key={item.titleKey}>
                        <h4 className="font-semibold text-blue-400">{t(item.titleKey)}</h4>
                        <p className="text-sm">{t(item.descKey)}</p>
                    </div>
                ))}
            </div>
        </Modal>

      {/* AI Modal */}
      {isAiModalOpen && (
        <AiPersonaModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          onGenerate={handleGenerateAiPersona}
          isLoading={isLoadingAi}
          error={error}
          language={language}
          t={t}
        />
      )}
    </div>
  );
};


// --- SVG Icons ---
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