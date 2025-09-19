

import React, { useState, useEffect, useMemo } from 'react';
import { GrowData, ManagementTool, Language, UserProfile, TranslationKey, InventoryItem, QmsItem, SupportTicket, GrowSection } from '../../types';
import { GROW_SECTIONS_HELP } from '../../constants';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { FloatingActionButton } from '../common/FloatingActionButton';
import { addUserProfileHeader, addPageFooter, addTextWithPageBreaks, MARGIN_MM, LINE_HEIGHT_NORMAL, TITLE_FONT_SIZE, LINE_HEIGHT_TITLE, SECTION_TITLE_FONT_SIZE, LINE_HEIGHT_SECTION_TITLE, TEXT_FONT_SIZE } from '../../utils/pdfUtils';


interface ManagementPageProps {
  initialData: GrowData['management'];
  onUpdateData: (data: GrowData['management']) => void;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
  userProfile: UserProfile | null;
}

const inputBaseClasses = "w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm";
const labelBaseClasses = "block text-sm font-medium text-slate-300 mb-1";

// #region Supply Chain Tool
const SupplyChainTool: React.FC<{
    managementData: GrowData['management'];
    onUpdateData: (data: GrowData['management']) => void;
    t: (key: TranslationKey, defaultText?: string) => string;
}> = ({ managementData, onUpdateData, t }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

    const handleSaveItem = (itemToSave: InventoryItem) => {
        const existing = managementData.inventory.find(i => i.id === itemToSave.id);
        const updatedInventory = existing
            ? managementData.inventory.map(i => (i.id === itemToSave.id ? itemToSave : i))
            : [...managementData.inventory, { ...itemToSave, id: `inv-${Date.now()}` }];
        onUpdateData({ ...managementData, inventory: updatedInventory });
        setIsModalOpen(false);
    };
    
    const handleDeleteItem = (id: string) => {
        onUpdateData({ ...managementData, inventory: managementData.inventory.filter(i => i.id !== id) });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-100">{t('scm_title')}</h3>
                <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} leftIcon={<PlusIcon />}>{t('scm_add_item')}</Button>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
                            <tr>
                                <th className="px-4 py-3">{t('scm_name_label')}</th>
                                <th className="px-4 py-3">{t('scm_sku_label')}</th>
                                <th className="px-4 py-3">{t('scm_quantity_label')}</th>
                                <th className="px-4 py-3">{t('scm_location_label')}</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {managementData.inventory.map(item => (
                                <tr key={item.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                                    <td className="px-4 py-3 font-medium text-slate-100">{item.name}</td>
                                    <td className="px-4 py-3">{item.sku}</td>
                                    <td className="px-4 py-3">{item.quantity}</td>
                                    <td className="px-4 py-3">{item.location}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-1 text-slate-400 hover:text-blue-400"><PencilIcon /></button>
                                        <button onClick={() => handleDeleteItem(item.id)} className="p-1 text-slate-400 hover:text-red-400"><TrashIcon /></button>
                                    </td>
                                </tr>
                            ))}
                            {managementData.inventory.length === 0 && (
                                <tr><td colSpan={5} className="text-center py-6 text-slate-500 italic">{t('scm_no_items')}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && <InventoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveItem} itemData={editingItem} t={t} />}
        </div>
    );
};

const InventoryModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (item: InventoryItem) => void; itemData: InventoryItem | null; t: (key: TranslationKey) => string; }> = ({ isOpen, onClose, onSave, itemData, t }) => {
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [quantity, setQuantity] = useState<number | ''>('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        if (itemData) {
            setName(itemData.name); setSku(itemData.sku); setQuantity(itemData.quantity); setLocation(itemData.location);
        } else {
            setName(''); setSku(''); setQuantity(''); setLocation('');
        }
    }, [itemData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || quantity === '') { alert(t('mra_error_fill_all_fields')); return; }
        onSave({ id: itemData?.id || '', name, sku, quantity: Number(quantity), location });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={itemData ? t('scm_edit_item') : t('scm_add_item')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className={labelBaseClasses}>{t('scm_name_label')}</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className={inputBaseClasses} /></div>
                <div><label className={labelBaseClasses}>{t('scm_sku_label')}</label><input type="text" value={sku} onChange={e => setSku(e.target.value)} className={inputBaseClasses} /></div>
                <div><label className={labelBaseClasses}>{t('scm_quantity_label')}</label><input type="number" value={quantity} onChange={e => setQuantity(e.target.value === '' ? '' : parseInt(e.target.value))} required className={inputBaseClasses} /></div>
                <div><label className={labelBaseClasses}>{t('scm_location_label')}</label><input type="text" value={location} onChange={e => setLocation(e.target.value)} className={inputBaseClasses} /></div>
                <div className="flex justify-end pt-4 space-x-2"><Button type="button" variant="outline" onClick={onClose}>{t('cancel_button')}</Button><Button type="submit" variant="primary">{t('save_button')}</Button></div>
            </form>
        </Modal>
    );
};
// #endregion

// #region QMS Tool
const QmsTool: React.FC<{
    managementData: GrowData['management'];
    onUpdateData: (data: GrowData['management']) => void;
    t: (key: TranslationKey, defaultText?: string) => string;
}> = ({ managementData, onUpdateData, t }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<QmsItem | null>(null);

    const handleSaveItem = (itemToSave: QmsItem) => {
        const existing = managementData.qmsItems.find(i => i.id === itemToSave.id);
        const updatedItems = existing
            ? managementData.qmsItems.map(i => (i.id === itemToSave.id ? itemToSave : i))
            : [...managementData.qmsItems, { ...itemToSave, id: `qms-${Date.now()}` }];
        onUpdateData({ ...managementData, qmsItems: updatedItems });
        setIsModalOpen(false);
    };

    const handleDeleteItem = (id: string) => {
        onUpdateData({ ...managementData, qmsItems: managementData.qmsItems.filter(i => i.id !== id) });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-100">{t('qms_title')}</h3>
                <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} leftIcon={<PlusIcon />}>{t('qms_add_item')}</Button>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
                            <tr>
                                <th className="px-4 py-3">{t('qms_name_label')}</th>
                                <th className="px-4 py-3">{t('qms_category_label')}</th>
                                <th className="px-4 py-3">{t('qms_status_label')}</th>
                                <th className="px-4 py-3">{t('qms_version_label')}</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {managementData.qmsItems.map(item => (
                                <tr key={item.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                                    <td className="px-4 py-3 font-medium text-slate-100">{item.name}</td>
                                    <td className="px-4 py-3">{t(`qms_category_${item.category.toLowerCase()}` as TranslationKey, item.category)}</td>
                                    <td className="px-4 py-3">{t(`qms_status_${item.status.toLowerCase()}` as TranslationKey, item.status)}</td>
                                    <td className="px-4 py-3">{item.version}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-1 text-slate-400 hover:text-blue-400"><PencilIcon /></button>
                                        <button onClick={() => handleDeleteItem(item.id)} className="p-1 text-slate-400 hover:text-red-400"><TrashIcon /></button>
                                    </td>
                                </tr>
                            ))}
                             {managementData.qmsItems.length === 0 && (
                                <tr><td colSpan={5} className="text-center py-6 text-slate-500 italic">{t('qms_no_items')}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && <QmsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveItem} itemData={editingItem} t={t} />}
        </div>
    );
};

const QmsModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (item: QmsItem) => void; itemData: QmsItem | null; t: (key: TranslationKey) => string; }> = ({ isOpen, onClose, onSave, itemData, t }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState<QmsItem['category']>('Process');
    const [status, setStatus] = useState<QmsItem['status']>('draft');
    const [version, setVersion] = useState('1.0');

    useEffect(() => {
        if(itemData) {
            setName(itemData.name); setCategory(itemData.category); setStatus(itemData.status); setVersion(itemData.version);
        } else {
            setName(''); setCategory('Process'); setStatus('draft'); setVersion('1.0');
        }
    }, [itemData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name.trim() || !version.trim()) { alert(t('mra_error_fill_all_fields')); return; }
        onSave({ id: itemData?.id || '', name, category, status, version });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={itemData ? t('qms_edit_item') : t('qms_add_item')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div><label className={labelBaseClasses}>{t('qms_name_label')}</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className={inputBaseClasses} /></div>
                 <div><label className={labelBaseClasses}>{t('qms_category_label')}</label><select value={category} onChange={e => setCategory(e.target.value as QmsItem['category'])} className={inputBaseClasses}><option value="Process">{t('qms_category_process')}</option><option value="Policy">{t('qms_category_policy')}</option><option value="Record">{t('qms_category_record')}</option></select></div>
                 <div><label className={labelBaseClasses}>{t('qms_status_label')}</label><select value={status} onChange={e => setStatus(e.target.value as any)} className={inputBaseClasses}><option value="draft">{t('qms_status_draft')}</option><option value="review">{t('qms_status_review')}</option><option value="approved">{t('qms_status_approved')}</option></select></div>
                 <div><label className={labelBaseClasses}>{t('qms_version_label')}</label><input type="text" value={version} onChange={e => setVersion(e.target.value)} required className={inputBaseClasses} /></div>
                 <div className="flex justify-end pt-4 space-x-2"><Button type="button" variant="outline" onClick={onClose}>{t('cancel_button')}</Button><Button type="submit" variant="primary">{t('save_button')}</Button></div>
            </form>
        </Modal>
    );
};
// #endregion

// #region Customer Service Tool
const CustomerServiceTool: React.FC<{
    managementData: GrowData['management'];
    onUpdateData: (data: GrowData['management']) => void;
    t: (key: TranslationKey, defaultText?: string) => string;
}> = ({ managementData, onUpdateData, t }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTicket, setEditingTicket] = useState<SupportTicket | null>(null);
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

    const handleSaveTicket = (ticket: SupportTicket) => {
        const existing = managementData.supportTickets.find(t => t.id === ticket.id);
        const updatedTickets = existing
            ? managementData.supportTickets.map(t => t.id === ticket.id ? ticket : t)
            : [...managementData.supportTickets, { ...ticket, id: `tkt-${Date.now()}` }];
        onUpdateData({ ...managementData, supportTickets: updatedTickets });
        setIsModalOpen(false);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemId: string) => setDraggedItemId(itemId);
    const handleDragEnd = () => setDraggedItemId(null);
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: 'open' | 'in_progress' | 'closed') => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-slate-800/50');
        if (!draggedItemId) return;
        const updatedTickets = managementData.supportTickets.map(item => item.id === draggedItemId ? { ...item, status: newStatus } : item);
        onUpdateData({ ...managementData, supportTickets: updatedTickets });
        setDraggedItemId(null);
    };

    const STAGES: ('open' | 'in_progress' | 'closed')[] = ['open', 'in_progress', 'closed'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-100">{t('cs_title')}</h3>
                <Button onClick={() => { setEditingTicket(null); setIsModalOpen(true); }} leftIcon={<PlusIcon />}>{t('cs_add_ticket')}</Button>
            </div>
            <div className="w-full overflow-x-auto pb-4">
                <div className="flex space-x-4 min-w-max">
                    {STAGES.map(stage => (
                        <div key={stage} onDragOver={handleDragOver} onDrop={e => handleDrop(e, stage)}
                            onDragEnter={e => e.currentTarget.classList.add('bg-slate-800/50')} onDragLeave={e => e.currentTarget.classList.remove('bg-slate-800/50')}
                            className="w-80 bg-slate-800 p-3 rounded-lg border-t-4 border-slate-600 flex-shrink-0 transition-colors">
                            <h4 className="font-semibold text-slate-300 mb-4">{t(`cs_stage_${stage}`)} ({managementData.supportTickets.filter(i => i.status === stage).length})</h4>
                            <div className="space-y-3 min-h-[100px]">
                                {managementData.supportTickets.filter(i => i.status === stage).map(ticket => (
                                    <div key={ticket.id} draggable onDragStart={e => handleDragStart(e, ticket.id)} onDragEnd={handleDragEnd}
                                        onClick={() => { setEditingTicket(ticket); setIsModalOpen(true); }}
                                        className="bg-slate-700 p-3 rounded-md shadow-md cursor-grab border border-slate-600 hover:border-blue-500">
                                        <p className="font-semibold text-slate-100 text-sm">{ticket.subject}</p>
                                        <p className="text-xs text-slate-400 mt-1">{t('cs_customer_label')}: {ticket.customer}</p>
                                        <div className="flex justify-between items-center mt-2 text-xs">
                                            <span className="text-slate-500">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-white ${ticket.priority === 'high' ? 'bg-red-600' : ticket.priority === 'medium' ? 'bg-yellow-600' : 'bg-sky-600'}`}>{t(`cs_priority_${ticket.priority}`)}</span>
                                        </div>
                                    </div>
                                ))}
                                {managementData.supportTickets.filter(i => i.status === stage).length === 0 && <p className="text-sm text-slate-500 italic text-center py-4">{t('cs_no_tickets')}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
             {isModalOpen && <SupportTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveTicket} ticketData={editingTicket} t={t} />}
        </div>
    );
};

const SupportTicketModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (ticket: SupportTicket) => void; ticketData: SupportTicket | null; t: (key: TranslationKey) => string; }> = ({ isOpen, onClose, onSave, ticketData, t }) => {
    const [subject, setSubject] = useState('');
    const [customer, setCustomer] = useState('');
    const [status, setStatus] = useState<SupportTicket['status']>('open');
    const [priority, setPriority] = useState<SupportTicket['priority']>('medium');

    useEffect(() => {
        if(ticketData) {
            setSubject(ticketData.subject); setCustomer(ticketData.customer); setStatus(ticketData.status); setPriority(ticketData.priority);
        } else {
            setSubject(''); setCustomer(''); setStatus('open'); setPriority('medium');
        }
    }, [ticketData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!subject.trim() || !customer.trim()) { alert(t('mra_error_fill_all_fields')); return; }
        onSave({ id: ticketData?.id || '', subject, customer, status, priority, createdAt: ticketData?.createdAt || new Date().toISOString() });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={ticketData ? t('cs_edit_ticket') : t('cs_add_ticket')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className={labelBaseClasses}>{t('cs_subject_label')}</label><input type="text" value={subject} onChange={e => setSubject(e.target.value)} required className={inputBaseClasses} /></div>
                <div><label className={labelBaseClasses}>{t('cs_customer_label')}</label><input type="text" value={customer} onChange={e => setCustomer(e.target.value)} required className={inputBaseClasses} /></div>
                <div><label className={labelBaseClasses}>{t('qms_status_label')}</label><select value={status} onChange={e => setStatus(e.target.value as any)} className={inputBaseClasses}><option value="open">{t('cs_stage_open')}</option><option value="in_progress">{t('cs_stage_in_progress')}</option><option value="closed">{t('cs_stage_closed')}</option></select></div>
                <div><label className={labelBaseClasses}>{t('cs_priority_label')}</label><select value={priority} onChange={e => setPriority(e.target.value as any)} className={inputBaseClasses}><option value="low">{t('cs_priority_low')}</option><option value="medium">{t('cs_priority_medium')}</option><option value="high">{t('cs_priority_high')}</option></select></div>
                <div className="flex justify-end pt-4 space-x-2"><Button type="button" variant="outline" onClick={onClose}>{t('cancel_button')}</Button><Button type="submit" variant="primary">{t('save_button')}</Button></div>
            </form>
        </Modal>
    );
};
// #endregion

const ManagementPage: React.FC<ManagementPageProps> = ({ initialData, onUpdateData, language, t, userProfile }) => {
    const [activeTool, setActiveTool] = useState<ManagementTool>(ManagementTool.SUPPLY_CHAIN);
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
        addTextWithPageBreaks(doc, t('management_page_title'), MARGIN_MM, yRef, {}, LINE_HEIGHT_TITLE, totalPagesRef, t);
        yRef.value += LINE_HEIGHT_NORMAL;
    
        // --- Supply Chain Section ---
        doc.setFontSize(SECTION_TITLE_FONT_SIZE);
        addTextWithPageBreaks(doc, t(ManagementTool.SUPPLY_CHAIN), MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
        
        const inventoryHead = [[t('scm_name_label'), t('scm_sku_label'), t('scm_quantity_label'), t('scm_location_label')]];
        const inventoryBody = initialData.inventory.map(item => [item.name, item.sku, item.quantity.toString(), item.location]);
    
        if (inventoryBody.length > 0) {
            (doc as any).autoTable({ startY: yRef.value, head: inventoryHead, body: inventoryBody, theme: 'grid', headStyles: { fillColor: [17, 138, 178] } });
            yRef.value = (doc as any).lastAutoTable.finalY + 10;
        } else {
            doc.setFontSize(TEXT_FONT_SIZE); doc.setFont("helvetica", "normal");
            addTextWithPageBreaks(doc, t('no_content_yet_placeholder_pdf'), MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
            yRef.value += LINE_HEIGHT_NORMAL;
        }
        
        // --- Quality Management Section ---
        if (yRef.value > 250) { doc.addPage(); yRef.value = MARGIN_MM; }
        doc.setFontSize(SECTION_TITLE_FONT_SIZE);
        addTextWithPageBreaks(doc, t(ManagementTool.QUALITY_MANAGEMENT), MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
        
        const qmsHead = [[t('qms_name_label'), t('qms_category_label'), t('qms_status_label'), t('qms_version_label')]];
        const qmsBody = initialData.qmsItems.map(item => [item.name, t(`qms_category_${item.category.toLowerCase()}` as TranslationKey, item.category), t(`qms_status_${item.status.toLowerCase()}` as TranslationKey, item.status), item.version]);
        if (qmsBody.length > 0) {
            (doc as any).autoTable({ startY: yRef.value, head: qmsHead, body: qmsBody, theme: 'grid', headStyles: { fillColor: [6, 214, 160] } });
            yRef.value = (doc as any).lastAutoTable.finalY + 10;
        } else {
            doc.setFontSize(TEXT_FONT_SIZE); doc.setFont("helvetica", "normal");
            addTextWithPageBreaks(doc, t('no_content_yet_placeholder_pdf'), MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
            yRef.value += LINE_HEIGHT_NORMAL;
        }
        
        // --- Customer Service Section ---
        if (yRef.value > 250) { doc.addPage(); yRef.value = MARGIN_MM; }
        doc.setFontSize(SECTION_TITLE_FONT_SIZE);
        addTextWithPageBreaks(doc, t(ManagementTool.CUSTOMER_SERVICE), MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
        
        const csHead = [[t('cs_subject_label'), t('cs_customer_label'), t('qms_status_label'), t('cs_priority_label'), t('cs_created_at_label')]];
        const csBody = initialData.supportTickets.map(item => [item.subject, item.customer, t(`cs_stage_${item.status.toLowerCase().replace(' ', '_')}` as TranslationKey, item.status), t(`cs_priority_${item.priority.toLowerCase()}` as TranslationKey, item.priority), new Date(item.createdAt).toLocaleDateString()]);
         if (csBody.length > 0) {
            (doc as any).autoTable({ startY: yRef.value, head: csHead, body: csBody, theme: 'grid', headStyles: { fillColor: [239, 71, 111] } });
            yRef.value = (doc as any).lastAutoTable.finalY + 10;
        } else {
            doc.setFontSize(TEXT_FONT_SIZE); doc.setFont("helvetica", "normal");
            addTextWithPageBreaks(doc, t('no_content_yet_placeholder_pdf'), MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
            yRef.value += LINE_HEIGHT_NORMAL;
        }
        
        for (let i = 1; i <= doc.getNumberOfPages(); i++) {
            doc.setPage(i); addPageFooter(doc, i, doc.getNumberOfPages(), t);
        }
        
        doc.save(`${t('management_page_title', 'management').toLowerCase().replace(/\s/g, '_')}_export.pdf`);
    };

    const managementGrowHelp = GROW_SECTIONS_HELP.find(s => s.title === GrowSection.MANAGEMENT);
    const currentToolHelp = managementGrowHelp?.tools.find(tool => tool.tool === activeTool);

    return (
        <div className="flex flex-col md:flex-row h-full md:h-[calc(100vh-8rem-2rem)] relative bg-transparent">
            <aside className={`fixed top-20 right-0 w-full h-[calc(100vh-5rem)] bg-slate-800 z-40 p-6 overflow-y-auto shadow-xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:static md:w-[320px] md:h-full md:translate-x-0 md:z-auto md:border-r md:border-slate-700`}>
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-semibold text-slate-100">{t('management_sidebar_title')}</h3>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white"><CloseIcon className="h-6 w-6" /></button>
                </div>
                <nav>
                    <ul className="space-y-2">
                        {managementGrowHelp?.tools.map(({ tool }) => (
                            <li key={tool}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveTool(tool as ManagementTool); if(window.innerWidth < 768) setIsSidebarOpen(false); }} className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${activeTool === tool ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-slate-700'}`}>
                                    {t(tool as TranslationKey, tool)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <main className="flex-grow p-4 md:p-8 bg-transparent shadow-inner overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-100">{t('management_page_title')}</h2>
                    <div className="flex items-center gap-4">
                        <Button onClick={handleExport} variant="secondary">{t('export_all_button')}</Button>
                        <Button variant="outline" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
                            {isSidebarOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
                {activeTool === ManagementTool.SUPPLY_CHAIN && <SupplyChainTool managementData={initialData} onUpdateData={onUpdateData} t={t} />}
                {activeTool === ManagementTool.QUALITY_MANAGEMENT && <QmsTool managementData={initialData} onUpdateData={onUpdateData} t={t} />}
                {activeTool === ManagementTool.CUSTOMER_SERVICE && <CustomerServiceTool managementData={initialData} onUpdateData={onUpdateData} t={t} />}
            </main>
             <FloatingActionButton icon={<HelpIcon />} tooltip={t('management_help_button_tooltip')} onClick={() => setIsHelpModalOpen(true)} className="bottom-6 right-6 z-30" colorClass="bg-slate-600 hover:bg-slate-500" />
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

export default ManagementPage;