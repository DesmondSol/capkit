import React, { useState, useEffect, useMemo } from 'react';
import { GrowData, ChecklistTool, Language, UserProfile, TranslationKey, ChecklistTab, ChecklistCard, ChecklistItem, GrowSection } from '../../types';
import { GROW_SECTIONS_HELP, INITIAL_RELEASE_LIST_DATA, INITIAL_GROWTH_LIST_DATA } from '../../constants';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { FloatingActionButton } from '../common/FloatingActionButton';

interface ChecklistsPageProps {
  initialData: GrowData['checklists'];
  onUpdateData: (data: GrowData['checklists']) => void;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
  userProfile: UserProfile | null;
}

// Add Card Modal Component
const AddCardModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string) => void;
    t: (key: TranslationKey, defaultText?: string) => string;
}> = ({ isOpen, onClose, onSave, t }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onSave(title.trim());
            setTitle('');
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('checklist_add_card_modal_title')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="cardTitle" className="block text-sm font-medium text-slate-300 mb-1">{t('checklist_card_title_label')}</label>
                    <input
                        id="cardTitle"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-blue-500"
                        required
                        autoFocus
                    />
                </div>
                <div className="flex justify-end pt-2 space-x-2">
                    <Button type="button" variant="outline" onClick={onClose}>{t('cancel_button')}</Button>
                    <Button type="submit" variant="primary">{t('add_button')}</Button>
                </div>
            </form>
        </Modal>
    );
};


// Internal component for displaying one of the checklist tools
const ChecklistViewer: React.FC<{
    listData: ChecklistTab[];
    listType: 'releaseList' | 'growthList';
    onUpdateList: (listType: 'releaseList' | 'growthList', updatedList: ChecklistTab[]) => void;
    t: (key: TranslationKey, defaultText?: string) => string;
}> = ({ listData, listType, onUpdateList, t }) => {
    const [activeTabId, setActiveTabId] = useState(listData.length > 0 ? listData[0].id : '');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');
    const [newItemText, setNewItemText] = useState<Record<string, string>>({}); // card.id -> text
    const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);

    // Ensure activeTabId is always valid
    useEffect(() => {
        if (!listData.find(tab => tab.id === activeTabId) && listData.length > 0) {
            setActiveTabId(listData[0].id);
        }
    }, [listData, activeTabId]);
    
    const activeTab = useMemo(() => listData.find(tab => tab.id === activeTabId), [listData, activeTabId]);

    const handleItemToggle = (cardId: string, itemId: string) => {
        const updatedList = listData.map(tab => {
            if (tab.id === activeTabId) {
                return {
                    ...tab,
                    cards: tab.cards.map(card => {
                        if (card.id === cardId) {
                            return {
                                ...card,
                                items: card.items.map(item =>
                                    item.id === itemId ? { ...item, completed: !item.completed } : item
                                ),
                            };
                        }
                        return card;
                    }),
                };
            }
            return tab;
        });
        onUpdateList(listType, updatedList);
    };

    const handleAddItem = (cardId: string) => {
        const text = newItemText[cardId]?.trim();
        if (!text) return;

        const newItem: ChecklistItem = {
            id: `item-${Date.now()}`,
            text: text,
            completed: false,
        };
        const updatedList = listData.map(tab => {
            if (tab.id === activeTabId) {
                return {
                    ...tab,
                    cards: tab.cards.map(card => {
                        if (card.id === cardId) {
                            return { ...card, items: [...card.items, newItem] };
                        }
                        return card;
                    }),
                };
            }
            return tab;
        });
        onUpdateList(listType, updatedList);
        setNewItemText(prev => ({ ...prev, [cardId]: '' }));
    };

    const handleDeleteItem = (cardId: string, itemId: string) => {
       const updatedList = listData.map(tab => {
            if (tab.id === activeTabId) {
                return {
                    ...tab,
                    cards: tab.cards.map(card => {
                        if (card.id === cardId) {
                            return { ...card, items: card.items.filter(item => item.id !== itemId) };
                        }
                        return card;
                    }),
                };
            }
            return tab;
        });
        onUpdateList(listType, updatedList);
    };

    const handleAddCard = (title: string) => {
        const newCard: ChecklistCard = {
            id: `card-${Date.now()}`,
            title: title,
            items: [],
        };
        const updatedList = listData.map(tab =>
            tab.id === activeTabId ? { ...tab, cards: [...tab.cards, newCard] } : tab
        );
        onUpdateList(listType, updatedList);
    };

    const handleStartEditing = (item: ChecklistItem) => {
        setEditingId(item.id);
        setEditText(item.text || t(item.textKey as TranslationKey, '') || '');
    };
    
    const handleSaveEdit = (cardId: string, itemId: string) => {
        const updatedList = listData.map(tab => {
            if (tab.id === activeTabId) {
                return {
                    ...tab,
                    cards: tab.cards.map(card => {
                        if (card.id === cardId) {
                            return {
                                ...card,
                                items: card.items.map(item =>
                                    item.id === itemId ? { ...item, text: editText.trim(), textKey: undefined } : item
                                ),
                            };
                        }
                        return card;
                    }),
                };
            }
            return tab;
        });
        onUpdateList(listType, updatedList);
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-slate-700">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {listData.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTabId(tab.id)}
                            className={`flex-shrink-0 whitespace-nowrap py-4 px-2 border-b-2 font-medium text-sm transition-colors
                            ${activeTabId === tab.id ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'}`}>
                            {t(tab.titleKey)}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div className="flex justify-end">
                <Button onClick={() => setIsAddCardModalOpen(true)} variant="secondary" size="sm" leftIcon={<PlusIcon className="h-4 w-4"/>}>
                    {t('checklist_add_card_button')}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab?.cards.map(card => (
                    <div key={card.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col">
                        <h4 className="font-bold text-slate-100 mb-4">{card.title || t(card.titleKey as TranslationKey)}</h4>
                        <div className="space-y-2 flex-grow">
                            {card.items.map(item => (
                                <div key={item.id} className="group flex items-start gap-2">
                                    <input type="checkbox" checked={item.completed} onChange={() => handleItemToggle(card.id, item.id)} className="mt-1 h-4 w-4 rounded bg-slate-600 border-slate-500 text-blue-500 focus:ring-blue-500"/>
                                    {editingId === item.id ? (
                                        <input
                                            type="text"
                                            value={editText}
                                            onChange={e => setEditText(e.target.value)}
                                            onBlur={() => handleSaveEdit(card.id, item.id)}
                                            onKeyPress={e => e.key === 'Enter' && handleSaveEdit(card.id, item.id)}
                                            className="w-full bg-slate-700 text-sm p-1 rounded-md"
                                            autoFocus
                                        />
                                    ) : (
                                        <label className={`flex-grow text-sm ${item.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{item.text || t(item.textKey as TranslationKey)}</label>
                                    )}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <button onClick={() => handleStartEditing(item)} className="p-1 text-slate-400 hover:text-blue-400"><PencilIcon className="h-4 w-4"/></button>
                                        <button onClick={() => handleDeleteItem(card.id, item.id)} className="p-1 text-slate-400 hover:text-red-400"><TrashIcon className="h-4 w-4"/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                         <div className="mt-4 pt-4 border-t border-slate-700 flex gap-2">
                             <input type="text" value={newItemText[card.id] || ''} onChange={e => setNewItemText({...newItemText, [card.id]: e.target.value})}
                                 onKeyPress={e => e.key === 'Enter' && handleAddItem(card.id)}
                                 placeholder={t('checklist_add_item_placeholder')}
                                 className="flex-grow w-full bg-slate-700 text-sm p-1 rounded-md placeholder-slate-500"/>
                            <Button onClick={() => handleAddItem(card.id)} variant="outline" size="sm" className="!p-1.5" disabled={!newItemText[card.id]?.trim()}><PlusIcon className="h-4 w-4"/></Button>
                         </div>
                    </div>
                ))}
            </div>

            <AddCardModal isOpen={isAddCardModalOpen} onClose={() => setIsAddCardModalOpen(false)} onSave={handleAddCard} t={t} />
        </div>
    );
};


export const ChecklistsPage: React.FC<ChecklistsPageProps> = ({ initialData, onUpdateData, language, t, userProfile }) => {
    const [activeTool, setActiveTool] = useState<ChecklistTool>(ChecklistTool.RELEASE_LIST);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    useEffect(() => {
        if (window.innerWidth < 768) setIsSidebarOpen(false);

        // Initialize with default data if empty
        const releaseListEmpty = !initialData.releaseList || initialData.releaseList.length === 0;
        const growthListEmpty = !initialData.growthList || initialData.growthList.length === 0;
        
        if (releaseListEmpty || growthListEmpty) {
            onUpdateData({
                releaseList: releaseListEmpty ? INITIAL_RELEASE_LIST_DATA : initialData.releaseList,
                growthList: growthListEmpty ? INITIAL_GROWTH_LIST_DATA : initialData.growthList,
            });
        }
    }, []); // Run only once on mount

    const checklistsGrowHelp = GROW_SECTIONS_HELP.find(s => s.title === GrowSection.CHECKLISTS);
    const currentToolHelp = checklistsGrowHelp?.tools.find(tool => tool.tool === activeTool);

    const handleUpdateList = (listType: 'releaseList' | 'growthList', updatedList: ChecklistTab[]) => {
        onUpdateData({
            ...initialData,
            [listType]: updatedList,
        });
    };

    return (
        <div className="flex flex-col md:flex-row h-full md:h-[calc(100vh-8rem-2rem)] relative bg-transparent">
            <aside className={`fixed top-20 right-0 w-full h-[calc(100vh-5rem)] bg-slate-800 z-40 p-6 overflow-y-auto shadow-xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:static md:w-[320px] md:h-full md:translate-x-0 md:z-auto md:border-r md:border-slate-700`}>
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-semibold text-slate-100">{t('checklists_sidebar_title')}</h3>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white"><CloseIcon className="h-6 w-6" /></button>
                </div>
                <nav>
                    <ul className="space-y-2">
                        {checklistsGrowHelp?.tools.map(({ tool }) => (
                            <li key={tool}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveTool(tool as ChecklistTool); if(window.innerWidth < 768) setIsSidebarOpen(false); }} className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${activeTool === tool ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-slate-700'}`}>
                                    {t(tool as TranslationKey, tool)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <main className="flex-grow p-4 md:p-8 bg-transparent shadow-inner overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-100">{t('checklists_page_title')}</h2>
                    <Button variant="outline" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
                        {isSidebarOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
                    </Button>
                </div>

                {activeTool === ChecklistTool.RELEASE_LIST && (
                    <ChecklistViewer listData={initialData.releaseList || []} listType="releaseList" onUpdateList={handleUpdateList} t={t} />
                )}
                 {activeTool === ChecklistTool.GROWTH_LIST && (
                    <ChecklistViewer listData={initialData.growthList || []} listType="growthList" onUpdateList={handleUpdateList} t={t} />
                )}
            </main>
             <FloatingActionButton icon={<HelpIcon className="h-6 w-6" />} tooltip={t('checklists_help_button_tooltip')} onClick={() => setIsHelpModalOpen(true)} className="bottom-6 right-6 z-30" colorClass="bg-slate-600 hover:bg-slate-500" />
             <Modal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} title={`${t('mra_help_modal_title_prefix')}: ${t(activeTool as TranslationKey)}`} size="xl">
                <div className="prose prose-sm prose-invert max-w-none text-slate-300 whitespace-pre-line max-h-[70vh] overflow-y-auto pr-2">
                    {currentToolHelp ? t(currentToolHelp.explanationKey) : "Help not found."}
                </div>
            </Modal>
        </div>
    );
};

export default ChecklistsPage;

// --- SVG Icons ---
const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>);
const HelpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>);
const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>);
const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>);
const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25-.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>);