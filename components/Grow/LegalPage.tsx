

import React, { useState, useEffect } from 'react';
import { GrowData, LegalTool, Language, UserProfile, TranslationKey, LegalDocument, LegalDocumentType, ComplianceItem, ComplianceStatus, GrowSection } from '../../types';
import { GROW_SECTIONS_HELP } from '../../constants';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { FloatingActionButton } from '../common/FloatingActionButton';
import { generateLegalDocument } from '../../services/geminiService';

interface LegalPageProps {
  initialData: GrowData['legal'];
  onUpdateData: (data: GrowData['legal']) => void;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
  userProfile: UserProfile | null;
}

const inputBaseClasses = "w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm";
const labelBaseClasses = "block text-sm font-medium text-slate-300 mb-1";


const DocumentAutomationTool: React.FC<{
    legalData: GrowData['legal'];
    onUpdateData: (data: GrowData['legal']) => void;
    t: (key: TranslationKey, defaultText?: string) => string;
    language: Language;
}> = ({ legalData, onUpdateData, t, language }) => {
    const [docType, setDocType] = useState<LegalDocumentType | ''>('');
    const [formState, setFormState] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewDoc, setPreviewDoc] = useState<LegalDocument | null>(null);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleGenerate = async () => {
        if (!docType) return;
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateLegalDocument(docType, formState, language);
            if (result) {
                const newDoc: LegalDocument = {
                    id: `doc-${Date.now()}`,
                    type: docType,
                    name: result.name,
                    content: result.content,
                    createdAt: new Date().toISOString(),
                };
                onUpdateData({ ...legalData, documents: [...legalData.documents, newDoc] });
                setPreviewDoc(newDoc);
            } else {
                setError(t('error_ai_failed_generic'));
            }
        } catch (e) {
            console.error(e);
            setError(t('error_ai_failed_generic'));
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownloadDoc = (doc: LegalDocument) => {
        const blob = new Blob([doc.content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.name}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const docTypes: { value: LegalDocumentType; labelKey: TranslationKey }[] = [
        { value: 'nda', labelKey: 'legal_doc_type_nda' },
        { value: 'service-agreement', labelKey: 'legal_doc_type_sa' },
        { value: 'employment-contract', labelKey: 'legal_doc_type_emp' },
    ];
    
    const getFieldsForDocType = (type: LegalDocumentType | '') => {
      switch(type) {
          case 'nda': return [
              { name: 'disclosingPartyName', labelKey: 'legal_doc_form_disclosing_party_name' },
              { name: 'disclosingPartyAddress', labelKey: 'legal_doc_form_disclosing_party_address' },
              { name: 'receivingPartyName', labelKey: 'legal_doc_form_receiving_party_name' },
              { name: 'receivingPartyAddress', labelKey: 'legal_doc_form_receiving_party_address' },
              { name: 'confidentialInfo', labelKey: 'legal_doc_form_confidential_info', type: 'textarea' },
              { name: 'purpose', labelKey: 'legal_doc_form_purpose' },
              { name: 'term', labelKey: 'legal_doc_form_term', type: 'number' },
          ];
          case 'service-agreement': return [
              { name: 'serviceProviderName', labelKey: 'legal_doc_form_service_provider_name' },
              { name: 'clientName', labelKey: 'legal_doc_form_client_name' },
              { name: 'serviceDesc', labelKey: 'legal_doc_form_service_desc', type: 'textarea' },
              { name: 'paymentAmount', labelKey: 'legal_doc_form_payment_amount', type: 'number' },
              { name: 'paymentTerms', labelKey: 'legal_doc_form_payment_terms' },
              { name: 'startDate', labelKey: 'legal_doc_form_start_date', type: 'date' },
              { name: 'endDate', labelKey: 'legal_doc_form_end_date', type: 'date' },
          ];
          case 'employment-contract': return [
              { name: 'employerName', labelKey: 'legal_doc_form_employer_name' },
              { name: 'employeeName', labelKey: 'legal_doc_form_employee_name' },
              { name: 'jobTitle', labelKey: 'legal_doc_form_job_title' },
              { name: 'salary', labelKey: 'legal_doc_form_salary', type: 'number' },
              { name: 'startDate', labelKey: 'legal_doc_form_start_date', type: 'date' },
              { name: 'duties', labelKey: 'legal_doc_form_duties', type: 'textarea' },
          ];
          default: return [];
      }
    };

    const fields = getFieldsForDocType(docType);

    return (
        <div className="space-y-8">
            <div className="p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
                <h4 className="text-xl font-semibold text-slate-100 mb-4">{t('legal_doc_automation_title')}</h4>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="docType" className={labelBaseClasses}>{t('legal_select_doc_type')}</label>
                        <select id="docType" value={docType} onChange={e => setDocType(e.target.value as LegalDocumentType)} className={inputBaseClasses}>
                            <option value="">-- Select a document --</option>
                            {docTypes.map(opt => <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>)}
                        </select>
                    </div>

                    {docType && (
                        <div className="p-4 border border-slate-600 rounded-lg space-y-4">
                            {fields.map(field => (
                                <div key={field.name}>
                                    <label htmlFor={field.name} className={labelBaseClasses}>{t(field.labelKey)}</label>
                                    {field.type === 'textarea' ? (
                                        <textarea id={field.name} name={field.name} value={formState[field.name] || ''} onChange={handleFormChange} rows={3} className={inputBaseClasses} />
                                    ) : (
                                        <input id={field.name} name={field.name} type={field.type || 'text'} value={formState[field.name] || ''} onChange={handleFormChange} className={inputBaseClasses} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <Button onClick={handleGenerate} disabled={!docType || isLoading} leftIcon={isLoading ? <SpinnerIcon className="h-5 w-5"/> : <SparklesIcon className="h-5 w-5"/>}>
                        {isLoading ? t('legal_generating_doc_button') : t('legal_generate_doc_button')}
                    </Button>
                </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
                <h4 className="text-xl font-semibold text-slate-100 mb-4">{t('legal_generated_docs_title')}</h4>
                <div className="space-y-3">
                    {legalData.documents.length === 0 ? (
                        <p className="text-slate-500 italic text-center py-4">{t('legal_no_docs_placeholder')}</p>
                    ) : (
                        legalData.documents.map(doc => (
                            <div key={doc.id} className="p-3 bg-slate-700/50 rounded-md flex justify-between items-center">
                                <span className="text-slate-200 font-medium">{doc.name}</span>
                                <Button size="sm" variant="outline" onClick={() => setPreviewDoc(doc)}>{t('view_details_button')}</Button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {previewDoc && (
                <Modal isOpen={!!previewDoc} onClose={() => setPreviewDoc(null)} title={t('legal_doc_preview_title')} size="xl">
                    <div className="space-y-4">
                        <pre className="whitespace-pre-wrap font-sans text-sm bg-slate-900 p-4 rounded-md max-h-[60vh] overflow-y-auto">{previewDoc.content}</pre>
                        <Button onClick={() => handleDownloadDoc(previewDoc)} leftIcon={<DownloadIcon className="h-4 w-4"/>}>{t('legal_doc_download_button')}</Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

const ComplianceManagementTool: React.FC<{
    legalData: GrowData['legal'];
    onUpdateData: (data: GrowData['legal']) => void;
    t: (key: TranslationKey, defaultText?: string) => string;
}> = ({ legalData, onUpdateData, t }) => {
    
    const handleStatusChange = (itemId: string, newStatus: ComplianceStatus) => {
        const updatedItems = legalData.complianceItems.map(item =>
            item.id === itemId ? { ...item, status: newStatus } : item
        );
        onUpdateData({ ...legalData, complianceItems: updatedItems });
    };

    return (
        <div className="p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
            <h4 className="text-xl font-semibold text-slate-100 mb-4">{t('legal_compliance_title')}</h4>
            <div className="space-y-4">
                {legalData.complianceItems.map(item => (
                    <div key={item.id} className="p-4 bg-slate-700/50 rounded-md border-l-4 border-slate-600">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <h5 className="font-semibold text-slate-100">{item.name}</h5>
                                <p className="text-xs text-slate-400 mt-1">{item.notes}</p>
                            </div>
                            <select
                                value={item.status}
                                onChange={(e) => handleStatusChange(item.id, e.target.value as ComplianceStatus)}
                                className="bg-slate-600 text-xs text-slate-300 rounded p-1 border border-slate-500 focus:ring-blue-500"
                            >
                                <option value="pending">{t('legal_compliance_status_pending')}</option>
                                <option value="in_progress">{t('legal_compliance_status_in_progress')}</option>
                                <option value="completed">{t('legal_compliance_status_completed')}</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const LegalPage: React.FC<LegalPageProps> = ({ initialData, onUpdateData, language, t, userProfile }) => {
    const [activeTool, setActiveTool] = useState<LegalTool>(LegalTool.DOCUMENT_AUTOMATION);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    useEffect(() => {
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    }, []);

    const legalGrowHelp = GROW_SECTIONS_HELP.find(s => s.title === GrowSection.LEGAL);
    const currentToolHelp = legalGrowHelp?.tools.find(tool => tool.tool === activeTool);

    return (
        <div className="flex flex-col md:flex-row h-full md:h-[calc(100vh-8rem-2rem)] relative bg-transparent">
            <aside className={`fixed top-20 right-0 w-full h-[calc(100vh-5rem)] bg-slate-800 z-40 p-6 overflow-y-auto shadow-xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:static md:w-[320px] md:h-full md:translate-x-0 md:z-auto md:border-r md:border-slate-700`}>
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-semibold text-slate-100">{t('legal_sidebar_title')}</h3>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white"><CloseIcon className="h-6 w-6" /></button>
                </div>
                <nav>
                    <ul className="space-y-2">
                        {legalGrowHelp?.tools.map(({ tool }) => (
                            <li key={tool}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveTool(tool as LegalTool); if(window.innerWidth < 768) setIsSidebarOpen(false); }} className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${activeTool === tool ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-slate-700'}`}>
                                    {t(tool as TranslationKey, tool)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <main className="flex-grow p-4 md:p-8 bg-transparent shadow-inner overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-100">{t('legal_page_title')}</h2>
                    <Button variant="outline" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
                        {isSidebarOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
                    </Button>
                </div>
                {activeTool === LegalTool.DOCUMENT_AUTOMATION && <DocumentAutomationTool legalData={initialData} onUpdateData={onUpdateData} t={t} language={language} />}
                {activeTool === LegalTool.COMPLIANCE_MANAGEMENT && <ComplianceManagementTool legalData={initialData} onUpdateData={onUpdateData} t={t} />}
            </main>
             <FloatingActionButton icon={<HelpIcon className="h-6 w-6" />} tooltip={t('legal_help_button_tooltip')} onClick={() => setIsHelpModalOpen(true)} className="bottom-6 right-6 z-30" colorClass="bg-slate-600 hover:bg-slate-500" />
             {/* FIX: Cast activeTool to TranslationKey to resolve TypeScript error */}
             <Modal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} title={`${t('mra_help_modal_title_prefix')}: ${t(activeTool as TranslationKey)}`} size="xl">
                <div className="prose prose-sm prose-invert max-w-none text-slate-300 whitespace-pre-line max-h-[70vh] overflow-y-auto pr-2">
                    {currentToolHelp ? t(currentToolHelp.explanationKey) : "Help not found."}
                </div>
            </Modal>
        </div>
    );
};

// --- SVG Icons ---
const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>);
const HelpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>);
const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 7.5l.813 2.846a4.5 4.5 0 01-3.09 3.09L12.187 15l-2.846.813a4.5 4.5 0 01-3.09-3.09L5.437 10.5l2.846-.813a4.5 4.5 0 013.09-3.09L12 3.75l.813 2.846a4.5 4.5 0 013.09 3.09L18.75 9l-2.846.813a4.5 4.5 0 01-3.09-3.09L12.187 6 12 5.25l.187.75z" /></svg>);
const SpinnerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" {...props} className={`animate-spin ${props.className || ''}`}><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);
const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>);
