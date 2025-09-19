

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GrowData, InvestmentTool, Language, UserProfile, TranslationKey, CapTableEntry, InvestorCrmEntry, ShareType, InvestorStage, GrowSection } from '../../types';
import { GROW_SECTIONS_HELP } from '../../constants';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { FloatingActionButton } from '../common/FloatingActionButton';
import { addUserProfileHeader, addPageFooter, addTextWithPageBreaks, MARGIN_MM, LINE_HEIGHT_NORMAL, TITLE_FONT_SIZE, LINE_HEIGHT_TITLE, SECTION_TITLE_FONT_SIZE, LINE_HEIGHT_SECTION_TITLE, TEXT_FONT_SIZE } from '../../utils/pdfUtils';

declare var Chart: any;

interface InvestmentPageProps {
  initialData: GrowData['investment'];
  onUpdateData: (data: GrowData['investment']) => void;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
  userProfile: UserProfile | null;
}

const inputBaseClasses = "w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm";
const labelBaseClasses = "block text-sm font-medium text-slate-300 mb-1";

// #region Cap Table Components
const CapTableModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (entry: CapTableEntry) => void;
    entryData: CapTableEntry | null;
    t: (key: TranslationKey) => string;
}> = ({ isOpen, onClose, onSave, entryData, t }) => {
    const [stakeholder, setStakeholder] = useState('');
    const [shareCount, setShareCount] = useState<number | ''>('');
    const [shareType, setShareType] = useState<ShareType>('Common');

    useEffect(() => {
        if (entryData) {
            setStakeholder(entryData.stakeholder);
            setShareCount(entryData.shareCount);
            setShareType(entryData.shareType);
        } else {
            setStakeholder('');
            setShareCount('');
            setShareType('Common');
        }
    }, [entryData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!stakeholder.trim() || shareCount === '' || shareCount <= 0) {
            alert(t('mra_error_fill_all_fields'));
            return;
        }
        onSave({
            id: entryData?.id || `cap-${Date.now()}`,
            stakeholder,
            shareCount: Number(shareCount),
            shareType,
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={entryData ? t('cap_table_modal_edit_title') : t('cap_table_modal_add_title')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className={labelBaseClasses}>{t('cap_table_stakeholder')}</label>
                    <input type="text" value={stakeholder} onChange={e => setStakeholder(e.target.value)} required className={inputBaseClasses} />
                </div>
                <div>
                    <label className={labelBaseClasses}>{t('cap_table_share_count')}</label>
                    <input type="number" value={shareCount} onChange={e => setShareCount(e.target.value === '' ? '' : parseInt(e.target.value))} required min="1" className={inputBaseClasses} />
                </div>
                <div>
                    <label className={labelBaseClasses}>{t('cap_table_share_type')}</label>
                    <select value={shareType} onChange={e => setShareType(e.target.value as ShareType)} className={inputBaseClasses}>
                        <option value="Common">{t('cap_table_share_type_common')}</option>
                        <option value="Preferred">{t('cap_table_share_type_preferred')}</option>
                        <option value="Options">{t('cap_table_share_type_options')}</option>
                    </select>
                </div>
                <div className="flex justify-end pt-4 space-x-2">
                    <Button type="button" variant="outline" onClick={onClose}>{t('cancel_button')}</Button>
                    <Button type="submit" variant="primary">{t('save_button')}</Button>
                </div>
            </form>
        </Modal>
    );
};

const CapTableTool: React.FC<Omit<InvestmentPageProps, 'userProfile'>> = ({ initialData, onUpdateData, t }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<CapTableEntry | null>(null);
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<any>(null);

    const totalShares = useMemo(() => initialData.capTable.reduce((sum, entry) => sum + entry.shareCount, 0), [initialData.capTable]);

    useEffect(() => {
        if (chartRef.current && typeof Chart !== 'undefined') {
            if (chartInstanceRef.current) chartInstanceRef.current.destroy();
            
            const chartData = {
                labels: initialData.capTable.map(e => e.stakeholder),
                datasets: [{
                    data: initialData.capTable.map(e => e.shareCount),
                    backgroundColor: ['#118AB2', '#06D6A0', '#FFD166', '#EF476F', '#6B4E71', '#F78C6B', '#073B4C'],
                    borderColor: '#0f172a',
                    borderWidth: 2,
                }]
            };

            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstanceRef.current = new Chart(ctx, {
                    type: 'pie',
                    data: chartData,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'bottom', labels: { color: '#cbd5e1' } },
                            tooltip: { callbacks: { label: (c: any) => `${c.label}: ${((c.raw as number / totalShares) * 100).toFixed(2)}%` } }
                        }
                    }
                });
            }
        }
        return () => { if (chartInstanceRef.current) chartInstanceRef.current.destroy(); };
    }, [initialData.capTable, totalShares, t]);

    const handleSaveEntry = (entry: CapTableEntry) => {
        const existing = initialData.capTable.find(e => e.id === entry.id);
        const updatedTable = existing
            ? initialData.capTable.map(e => e.id === entry.id ? entry : e)
            : [...initialData.capTable, entry];
        onUpdateData({ ...initialData, capTable: updatedTable });
    };

    const handleDeleteEntry = (id: string) => {
        onUpdateData({ ...initialData, capTable: initialData.capTable.filter(e => e.id !== id) });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-100">{t('cap_table_title')}</h3>
                <Button onClick={() => { setEditingEntry(null); setIsModalOpen(true); }} leftIcon={<PlusIcon />}>{t('cap_table_add_stakeholder')}</Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-300">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
                                <tr>
                                    <th className="px-4 py-3">{t('cap_table_stakeholder')}</th>
                                    <th className="px-4 py-3">{t('cap_table_share_count')}</th>
                                    <th className="px-4 py-3">{t('cap_table_share_type')}</th>
                                    <th className="px-4 py-3">{t('cap_table_ownership')}</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {initialData.capTable.map(entry => (
                                    <tr key={entry.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                                        <td className="px-4 py-3 font-medium text-slate-100">{entry.stakeholder}</td>
                                        <td className="px-4 py-3">{entry.shareCount.toLocaleString()}</td>
                                        <td className="px-4 py-3">{t(`cap_table_share_type_${entry.shareType.toLowerCase()}` as TranslationKey, entry.shareType)}</td>
                                        <td className="px-4 py-3 font-mono">{totalShares > 0 ? ((entry.shareCount / totalShares) * 100).toFixed(2) + '%' : '0.00%'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => { setEditingEntry(entry); setIsModalOpen(true); }} className="p-1 text-slate-400 hover:text-blue-400"><PencilIcon /></button>
                                            <button onClick={() => handleDeleteEntry(entry.id)} className="p-1 text-slate-400 hover:text-red-400"><TrashIcon /></button>
                                        </td>
                                    </tr>
                                ))}
                                {initialData.capTable.length === 0 && (
                                    <tr><td colSpan={5} className="text-center py-6 text-slate-500 italic">{t('cap_table_no_entries')}</td></tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr className="font-bold text-slate-100 bg-slate-700/50">
                                    <td className="px-4 py-3">{t('cap_table_total_shares')}</td>
                                    <td className="px-4 py-3">{totalShares.toLocaleString()}</td>
                                    <td colSpan={3}></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
                     <h4 className="text-lg font-semibold text-center text-slate-100 mb-4">{t('cap_table_chart_title')}</h4>
                     <div className="h-80 relative">
                        <canvas ref={chartRef} id="capTablePieChart"></canvas>
                     </div>
                </div>
            </div>
            <CapTableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveEntry} entryData={editingEntry} t={t} />
        </div>
    );
};
// #endregion

// #region Investor CRM Components
const InvestorCrmModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (entry: InvestorCrmEntry) => void;
    entryData: InvestorCrmEntry | null;
    t: (key: TranslationKey) => string;
}> = ({ isOpen, onClose, onSave, entryData, t }) => {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [stage, setStage] = useState<InvestorStage>('initial');
    const [lastContacted, setLastContacted] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if(entryData) {
            setName(entryData.name);
            setContact(entryData.contact);
            setStage(entryData.stage);
            setLastContacted(entryData.lastContacted.split('T')[0]);
            setNotes(entryData.notes);
        } else {
            setName('');
            setContact('');
            setStage('initial');
            setLastContacted(new Date().toISOString().split('T')[0]);
            setNotes('');
        }
    }, [entryData, isOpen]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) { alert(t('ir_crm_name_label') + ' is required.'); return; }
        onSave({
            id: entryData?.id || `inv-${Date.now()}`,
            name, contact, stage, lastContacted, notes
        });
        onClose();
    };

    const stageOptions: { value: InvestorStage; labelKey: TranslationKey}[] = [
        {value: 'initial', labelKey: 'ir_crm_stage_initial'}, {value: 'contacted', labelKey: 'ir_crm_stage_contacted'},
        {value: 'meeting', labelKey: 'ir_crm_stage_meeting'}, {value: 'due_diligence', labelKey: 'ir_crm_stage_due_diligence'},
        {value: 'closed', labelKey: 'ir_crm_stage_closed'}, {value: 'passed', labelKey: 'ir_crm_stage_passed'},
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={entryData ? t('ir_crm_modal_edit_title') : t('ir_crm_modal_add_title')} size="lg">
             <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelBaseClasses}>{t('ir_crm_name_label')}</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className={inputBaseClasses} /></div>
                    <div><label className={labelBaseClasses}>{t('ir_crm_contact_label')}</label><input type="text" value={contact} onChange={e => setContact(e.target.value)} className={inputBaseClasses} /></div>
                    <div><label className={labelBaseClasses}>{t('ir_crm_stage_label')}</label><select value={stage} onChange={e => setStage(e.target.value as InvestorStage)} className={inputBaseClasses}>{stageOptions.map(opt => <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>)}</select></div>
                    <div><label className={labelBaseClasses}>{t('ir_crm_last_contacted_label')}</label><input type="date" value={lastContacted} onChange={e => setLastContacted(e.target.value)} required className={`${inputBaseClasses} dark-datetime-local`} /></div>
                </div>
                <div><label className={labelBaseClasses}>{t('ir_crm_notes_label')}</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} className={inputBaseClasses} /></div>
                <div className="flex justify-end pt-4 space-x-2"><Button type="button" variant="outline" onClick={onClose}>{t('cancel_button')}</Button><Button type="submit" variant="primary">{t('save_button')}</Button></div>
             </form>
             <style>{`.dark-datetime-local::-webkit-calendar-picker-indicator { filter: invert(0.8); }`}</style>
        </Modal>
    );
};

const InvestorCrmTool: React.FC<Omit<InvestmentPageProps, 'userProfile'>> = ({ initialData, onUpdateData, t }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<InvestorCrmEntry | null>(null);
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

    const handleSaveEntry = (entry: InvestorCrmEntry) => {
        const existing = initialData.investorCrm.find(e => e.id === entry.id);
        const updatedCrm = existing
            ? initialData.investorCrm.map(e => e.id === entry.id ? entry : e)
            : [...initialData.investorCrm, entry];
        onUpdateData({ ...initialData, investorCrm: updatedCrm });
    };

    const handleDeleteEntry = (id: string) => onUpdateData({ ...initialData, investorCrm: initialData.investorCrm.filter(e => e.id !== id) });

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemId: string) => setDraggedItemId(itemId);
    const handleDragEnd = () => setDraggedItemId(null);
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStage: InvestorStage) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-slate-800/50');
        if (!draggedItemId) return;
        const updatedCrm = initialData.investorCrm.map(item => item.id === draggedItemId ? { ...item, stage: newStage } : item);
        onUpdateData({ ...initialData, investorCrm: updatedCrm });
        setDraggedItemId(null);
    };

    const STAGES: InvestorStage[] = ['initial', 'contacted', 'meeting', 'due_diligence', 'closed', 'passed'];

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-100">{t('ir_crm_title')}</h3>
                <Button onClick={() => { setEditingEntry(null); setIsModalOpen(true); }} leftIcon={<PlusIcon />}>{t('ir_crm_add_investor')}</Button>
            </div>
            <div className="w-full overflow-x-auto pb-4">
                <div className="flex space-x-4 min-w-max">
                    {STAGES.map(stage => (
                        <div key={stage} onDragOver={handleDragOver} onDrop={e => handleDrop(e, stage)}
                            onDragEnter={e => e.currentTarget.classList.add('bg-slate-800/50')} onDragLeave={e => e.currentTarget.classList.remove('bg-slate-800/50')}
                            className="w-72 bg-slate-800 p-3 rounded-lg border-t-4 border-slate-600 flex-shrink-0 transition-colors">
                            <h4 className="font-semibold text-slate-300 mb-4">{t(`ir_crm_stage_${stage}`)} ({initialData.investorCrm.filter(i => i.stage === stage).length})</h4>
                            <div className="space-y-3 min-h-[100px]">
                                {initialData.investorCrm.filter(i => i.stage === stage).map(item => (
                                    <div key={item.id} draggable onDragStart={e => handleDragStart(e, item.id)} onDragEnd={handleDragEnd}
                                        className="bg-slate-700 p-3 rounded-md shadow-md cursor-grab border border-slate-600 hover:border-blue-500">
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold text-slate-100">{item.name}</p>
                                            <button onClick={() => { setEditingEntry(item); setIsModalOpen(true); }} className="p-1 text-slate-400 hover:text-blue-400"><PencilIcon /></button>
                                        </div>
                                        <p className="text-xs text-slate-400">{item.contact}</p>
                                        <p className="text-xs text-slate-500 mt-2">{t('ir_crm_last_contacted_label')}: {new Date(item.lastContacted).toLocaleDateString()}</p>
                                    </div>
                                ))}
                                {initialData.investorCrm.filter(i => i.stage === stage).length === 0 && <p className="text-sm text-slate-500 italic text-center py-4">{t('ir_crm_no_investors')}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <InvestorCrmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveEntry} entryData={editingEntry} t={t}/>
        </div>
    );
};
// #endregion

export const InvestmentPage: React.FC<InvestmentPageProps> = ({ initialData, onUpdateData, language, t, userProfile }) => {
    const [activeTool, setActiveTool] = useState<InvestmentTool>(InvestmentTool.CAP_TABLE_MANAGEMENT);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    useEffect(() => { if (window.innerWidth < 768) setIsSidebarOpen(false); }, []);

    const handleExport = async () => {
        const { default: jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        const yRef = { value: MARGIN_MM };
        const totalPagesRef = { current: doc.getNumberOfPages() };
        
        addUserProfileHeader(doc, userProfile, yRef, totalPagesRef, t);
    
        doc.setFontSize(TITLE_FONT_SIZE);
        doc.setFont("helvetica", "bold");
        addTextWithPageBreaks(doc, t('investment_page_title'), MARGIN_MM, yRef, {}, LINE_HEIGHT_TITLE, totalPagesRef, t);
        yRef.value += LINE_HEIGHT_NORMAL;
    
        // --- Cap Table Section ---
        doc.setFontSize(SECTION_TITLE_FONT_SIZE);
        addTextWithPageBreaks(doc, t(InvestmentTool.CAP_TABLE_MANAGEMENT), MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
        
        const canvas = document.getElementById('capTablePieChart') as HTMLCanvasElement;
        if (canvas) {
            try {
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 80;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                if (yRef.value + imgHeight > 280) { doc.addPage(); yRef.value = MARGIN_MM; }
                doc.addImage(imgData, 'PNG', MARGIN_MM, yRef.value, imgWidth, imgHeight);
                yRef.value += imgHeight + 10;
            } catch(e) { console.error("Could not add chart to PDF", e); }
        }
        
        const capTableData = initialData.capTable;
        const totalShares = capTableData.reduce((sum, entry) => sum + entry.shareCount, 0);
        const head = [[t('cap_table_stakeholder'), t('cap_table_share_count'), t('cap_table_share_type'), t('cap_table_ownership')]];
        const body = capTableData.map(entry => [
            entry.stakeholder,
            entry.shareCount.toLocaleString(),
            t(`cap_table_share_type_${entry.shareType.toLowerCase()}` as TranslationKey, entry.shareType),
            totalShares > 0 ? ((entry.shareCount / totalShares) * 100).toFixed(2) + '%' : '0.00%'
        ]);
    
        if (yRef.value > 240) { doc.addPage(); yRef.value = MARGIN_MM; }
    
        (doc as any).autoTable({
            startY: yRef.value, head: head, body: body, theme: 'grid',
            headStyles: { fillColor: [6, 214, 160] },
        });
        yRef.value = (doc as any).lastAutoTable.finalY + 10;
        
        // --- Investor CRM Section ---
        doc.addPage();
        yRef.value = MARGIN_MM;
        doc.setFontSize(SECTION_TITLE_FONT_SIZE);
        addTextWithPageBreaks(doc, t(InvestmentTool.INVESTOR_RELATIONS_CRM), MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
        
        const crmData = initialData.investorCrm;
        const stages: InvestorStage[] = ['initial', 'contacted', 'meeting', 'due_diligence', 'closed', 'passed'];
        
        stages.forEach(stage => {
            const investorsInStage = crmData.filter(inv => inv.stage === stage);
            if (investorsInStage.length > 0) {
                doc.setFontSize(TEXT_FONT_SIZE + 2);
                doc.setFont("helvetica", "bold");
                addTextWithPageBreaks(doc, t(`ir_crm_stage_${stage}` as TranslationKey, stage), MARGIN_MM, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
                
                doc.setFontSize(TEXT_FONT_SIZE);
                doc.setFont("helvetica", "normal");
                const stageBody = investorsInStage.map(inv => [
                    inv.name, inv.contact, new Date(inv.lastContacted).toLocaleDateString(), inv.notes
                ]);
                
                (doc as any).autoTable({
                    startY: yRef.value,
                    head: [[t('ir_crm_name_label'), t('ir_crm_contact_label'), t('ir_crm_last_contacted_label'), t('ir_crm_notes_label')]],
                    body: stageBody, theme: 'striped', headStyles: { fillColor: [17, 138, 178] }
                });
                yRef.value = (doc as any).lastAutoTable.finalY + 10;
            }
        });
    
        for (let i = 1; i <= doc.getNumberOfPages(); i++) {
            doc.setPage(i);
            addPageFooter(doc, i, doc.getNumberOfPages(), t);
        }
        
        doc.save(`${t('investment_page_title', 'investment').toLowerCase().replace(/\s/g, '_')}_export.pdf`);
    };

    const investmentGrowHelp = GROW_SECTIONS_HELP.find(s => s.title === GrowSection.INVESTMENT);
    const currentToolHelp = investmentGrowHelp?.tools.find(tool => tool.tool === activeTool);

    return (
        <div className="flex flex-col md:flex-row h-full md:h-[calc(100vh-8rem-2rem)] relative bg-transparent">
            <aside className={`fixed top-20 right-0 w-full h-[calc(100vh-5rem)] bg-slate-800 z-40 p-6 overflow-y-auto shadow-xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:static md:w-[320px] md:h-full md:translate-x-0 md:z-auto md:border-r md:border-slate-700`}>
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-semibold text-slate-100">{t('investment_sidebar_title')}</h3>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white"><CloseIcon className="h-6 w-6" /></button>
                </div>
                <nav>
                    <ul className="space-y-2">
                        {investmentGrowHelp?.tools.map(({ tool }) => (
                            <li key={tool}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveTool(tool as InvestmentTool); if(window.innerWidth < 768) setIsSidebarOpen(false); }} className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${activeTool === tool ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-slate-700'}`}>
                                    {t(tool as TranslationKey, tool)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <main className="flex-grow p-4 md:p-8 bg-transparent shadow-inner overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-100">{t('investment_page_title')}</h2>
                    <div className="flex items-center gap-4">
                        <Button onClick={handleExport} variant="secondary">{t('export_all_button')}</Button>
                        <Button variant="outline" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
                            {isSidebarOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
                {activeTool === InvestmentTool.CAP_TABLE_MANAGEMENT && <CapTableTool initialData={initialData} onUpdateData={onUpdateData} language={language} t={t} />}
                {activeTool === InvestmentTool.INVESTOR_RELATIONS_CRM && <InvestorCrmTool initialData={initialData} onUpdateData={onUpdateData} language={language} t={t} />}
            </main>
            <FloatingActionButton icon={<HelpIcon />} tooltip={t('investment_help_button_tooltip')} onClick={() => setIsHelpModalOpen(true)} className="bottom-6 right-6 z-30" colorClass="bg-slate-600 hover:bg-slate-500" />
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
const HelpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>);
const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>);
const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>);
const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25-.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>);