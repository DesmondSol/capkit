import React, { useState } from 'react';
import { ProductDesignData, ActionItem, ActionBoardStatus, TranslationKey, Language } from '../../types';
import { Button } from '../common/Button';
import { ActionItemModal } from './ActionItemModal';

interface ActionBoardProps {
  productDesignData: ProductDesignData;
  onUpdateData: (data: ProductDesignData) => void;
  t: (key: TranslationKey, defaultText?: string) => string;
  language: Language;
}

const KANBAN_COLUMNS: ActionBoardStatus[] = [
  ActionBoardStatus.IDEA,
  ActionBoardStatus.DESIGN,
  ActionBoardStatus.BUILD,
  ActionBoardStatus.DEPLOY,
];

const getColumnTitleKey = (status: ActionBoardStatus): TranslationKey => `action_board_status_${status}` as TranslationKey;

const getColumnBorderColor = (status: ActionBoardStatus): string => {
    switch(status) {
        case ActionBoardStatus.IDEA: return 'border-t-purple-400';
        case ActionBoardStatus.DESIGN: return 'border-t-blue-400';
        case ActionBoardStatus.BUILD: return 'border-t-orange-400';
        case ActionBoardStatus.DEPLOY: return 'border-t-green-400';
        default: return 'border-t-slate-500';
    }
};

export const ActionBoard: React.FC<ActionBoardProps> = ({ productDesignData, onUpdateData, t, language }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ActionItem | null>(null);
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

    const actionItems = productDesignData.actionItems || [];

    const handleOpenModal = (item: ActionItem | null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleSaveItem = (itemToSave: ActionItem) => {
        let updatedItems: ActionItem[];
        if (editingItem && itemToSave.id) {
            updatedItems = actionItems.map(i => i.id === itemToSave.id ? itemToSave : i);
        } else {
            updatedItems = [...actionItems, { ...itemToSave, id: `action-${Date.now()}` }];
        }
        onUpdateData({ ...productDesignData, actionItems: updatedItems });
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleDeleteItem = (itemId: string) => {
        if (window.confirm(t('delete_button') + ' this action item?')) {
            const updatedItems = actionItems.filter(i => i.id !== itemId);
            onUpdateData({ ...productDesignData, actionItems: updatedItems });
            setIsModalOpen(false);
            setEditingItem(null);
        }
    };
    
    // Drag and Drop handlers
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemId: string) => {
        setDraggedItemId(itemId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => {
        setDraggedItemId(null);
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-slate-800/50');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-slate-800/50');
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: ActionBoardStatus) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-slate-800/50');
        if (!draggedItemId) return;

        const updatedItems = actionItems.map(item => {
            if (item.id === draggedItemId) {
                const isNowComplete = newStatus === ActionBoardStatus.DEPLOY;
                return { 
                    ...item, 
                    status: newStatus,
                    completedAt: isNowComplete ? (item.completedAt || new Date().toISOString()) : null,
                };
            }
            return item;
        });
        
        onUpdateData({ ...productDesignData, actionItems: updatedItems });
        setDraggedItemId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-start">
                <Button onClick={() => handleOpenModal(null)} variant="primary" leftIcon={<PlusIcon className="h-5 w-5" />}>
                    {t('action_board_add_item_button')}
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {KANBAN_COLUMNS.map(status => (
                    <div 
                        key={status} 
                        className={`bg-slate-800 rounded-lg p-4 border-t-4 transition-colors ${getColumnBorderColor(status)}`}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, status)}
                    >
                        <h3 className={`font-semibold text-lg mb-4 ${getColumnBorderColor(status).replace('border-t-', 'text-')}`}>
                            {t(getColumnTitleKey(status))}
                        </h3>
                        <div className="space-y-4 min-h-[200px]">
                            {actionItems
                                .filter(item => item.status === status)
                                .map(item => {
                                    const today = new Date().toISOString().split('T')[0];
                                    const isOverdue = item.dueDate && item.dueDate < today && item.status !== 'deploy';
                                    return (
                                        <div 
                                            key={item.id} 
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, item.id)}
                                            onDragEnd={handleDragEnd}
                                            onClick={() => handleOpenModal(item)}
                                            className={`bg-slate-700 p-3 rounded-md shadow-md cursor-grab border border-slate-600 hover:border-blue-500 transition-colors ${isOverdue ? 'border-l-4 border-l-red-500' : ''} ${item.completedAt ? 'opacity-70' : ''}`}
                                        >
                                            <p className={`font-semibold text-slate-100 ${item.completedAt ? 'line-through' : ''}`}>{item.title}</p>
                                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                                            
                                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-600/50 text-xs text-slate-400">
                                                {item.dueDate ? (
                                                    <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-400 font-semibold' : ''}`} title={t('action_item_due_date_label') as string}>
                                                        <CalendarIcon className="h-3 w-3" />
                                                        {new Date(item.dueDate + 'T00:00:00').toLocaleDateString(language === 'am' ? 'am-ET' : 'en-CA')}
                                                    </span>
                                                ) : <div />}
                                                {item.completedAt && (
                                                    <span className="flex items-center gap-1 text-green-400" title={t('action_item_completed_at_label') as string}>
                                                        <CheckCircleIcon className="h-4 w-4" />
                                                        {new Date(item.completedAt).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-CA')}
                                                    </span>
                                                )}
                                            </div>

                                            {item.featureId && (
                                                <div className="text-xs text-purple-300 mt-2 pt-1 border-t border-slate-600/50">
                                                    🔗 {productDesignData.features.find(f => f.id === item.featureId)?.name || 'Linked Feature'}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <ActionItemModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveItem}
                    onDelete={handleDeleteItem}
                    itemData={editingItem}
                    features={productDesignData.features || []}
                    t={t}
                />
            )}
        </div>
    );
};

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);
const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M5.75 3a.75.75 0 01.75.75V4h7V3.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V3.75A.75.75 0 015.75 3zM4.5 8.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V8.5h-11z" clipRule="evenodd" />
    </svg>
);
const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
);
