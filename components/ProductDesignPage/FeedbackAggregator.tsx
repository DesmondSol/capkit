import React, { useState, useMemo } from 'react';
import { ProductDesignData, FeedbackItem, TranslationKey, Language, FeedbackSource, FeedbackUrgency } from '../../types';
import { Button } from '../common/Button';
import { FeedbackModal } from './FeedbackModal';
import { AiFeedbackAggregatorModal } from './AiFeedbackAggregatorModal';
import { processBulkFeedback } from '../../services/geminiService';

interface FeedbackAggregatorProps {
  productDesignData: ProductDesignData;
  onUpdateData: (data: ProductDesignData) => void;
  t: (key: TranslationKey, defaultText?: string) => string;
  language: Language;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (isOpen: boolean) => void;
}

const SourceIcon: React.FC<{ source: FeedbackSource }> = ({ source }) => {
  const iconProps = { className: "h-5 w-5" };
  switch (source) {
    case 'app_store': return <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
    case 'survey': return <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
    case 'social_media': return <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h6l2-2h2l-2 2z" /></svg>;
    case 'manual': return <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
    case 'ai_bulk_import': return <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 7.5l.813 2.846a4.5 4.5 0 01-3.09 3.09L12.187 15l-2.846.813a4.5 4.5 0 01-3.09-3.09L5.437 10.5l2.846-.813a4.5 4.5 0 013.09-3.09L12 3.75l.813 2.846a4.5 4.5 0 013.09 3.09L18.75 9l-2.846.813a4.5 4.5 0 01-3.09-3.09L12.187 6 12 5.25l.187.75z" /></svg>;
    default: return null;
  }
};

const UrgencyBadge: React.FC<{ urgency: FeedbackUrgency, t: (key: TranslationKey, defaultText?: string) => string }> = ({ urgency, t }) => {
  const styles: Record<FeedbackUrgency, string> = {
    low: 'bg-sky-500/20 text-sky-300 border-sky-500/50',
    medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    high: 'bg-red-500/20 text-red-300 border-red-500/50',
  };
  const labelKey: Record<FeedbackUrgency, TranslationKey> = {
    low: 'feedback_urgency_low',
    medium: 'feedback_urgency_medium',
    high: 'feedback_urgency_high',
  };
  return (
    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${styles[urgency]}`}>
      {t(labelKey[urgency], urgency)}
    </span>
  );
};

export const FeedbackAggregator: React.FC<FeedbackAggregatorProps> = ({ productDesignData, onUpdateData, t, language, isAiModalOpen, setIsAiModalOpen }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FeedbackItem | null>(null);
  const [sourceFilter, setSourceFilter] = useState<FeedbackSource | 'all'>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<FeedbackUrgency | 'all'>('all');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const feedbackItems = useMemo(() => productDesignData.feedbackItems || [], [productDesignData.feedbackItems]);
  const features = useMemo(() => productDesignData.features || [], [productDesignData.features]);

  const handleOpenModal = (item: FeedbackItem | null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = (itemToSave: FeedbackItem) => {
    let updatedItems: FeedbackItem[];
    if (editingItem && itemToSave.id) {
        updatedItems = feedbackItems.map(i => i.id === itemToSave.id ? itemToSave : i);
    } else {
        updatedItems = [...feedbackItems, { ...itemToSave, id: `fb-${Date.now()}` }];
    }
    onUpdateData({ ...productDesignData, feedbackItems: updatedItems });
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm(t('delete_button') + ' this feedback?')) {
        const updatedItems = feedbackItems.filter(i => i.id !== itemId);
        onUpdateData({ ...productDesignData, feedbackItems: updatedItems });
    }
  };

  const handleAiProcess = async (bulkText: string) => {
    setIsAiLoading(true);
    setAiError(null);
    try {
        const processedItems = await processBulkFeedback(bulkText, features, language);

        if (processedItems) {
            let updatedFeedbackItems = [...feedbackItems];
            let updatedFeatures = [...features];

            processedItems.forEach(item => {
                const newFeedback: FeedbackItem = {
                    id: `fb-ai-${Date.now()}-${Math.random()}`,
                    content: item.content,
                    source: 'ai_bulk_import',
                    urgency: item.urgency,
                    featureId: item.featureId,
                    createdAt: new Date().toISOString(),
                };
                updatedFeedbackItems.push(newFeedback);

                if (item.featureId) {
                    let featureFound = false;
                    updatedFeatures = updatedFeatures.map(f => {
                        if (f.id === item.featureId) {
                            featureFound = true;
                            const latestVersionIndex = f.versions.length - 1;
                            const latestVersion = f.versions[latestVersionIndex];
                            
                            const updatedVersion = {
                                ...latestVersion,
                                feedbackNotes: `${latestVersion.feedbackNotes}\n- (AI Insight): ${item.content}`.trim()
                            };
                            
                            const newVersions = [...f.versions];
                            newVersions[latestVersionIndex] = updatedVersion;

                            return { ...f, versions: newVersions };
                        }
                        return f;
                    });
                    if (!featureFound) {
                        console.warn(`AI returned featureId ${item.featureId} which was not found in the features list.`);
                    }
                }
            });

            onUpdateData({
                ...productDesignData,
                feedbackItems: updatedFeedbackItems,
                features: updatedFeatures,
            });
            
            setIsAiModalOpen(false);

        } else {
            setAiError(t('error_ai_failed_generic'));
        }
    } catch (e) {
        console.error(e);
        setAiError(t('error_ai_failed_generic'));
    } finally {
        setIsAiLoading(false);
    }
  };


  const filteredItems = useMemo(() => feedbackItems.filter(item => {
    const sourceMatch = sourceFilter === 'all' || item.source === sourceFilter;
    const urgencyMatch = urgencyFilter === 'all' || item.urgency === urgencyFilter;
    return sourceMatch && urgencyMatch;
  }).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [feedbackItems, sourceFilter, urgencyFilter]);

  const sourceOptions: { value: FeedbackSource | 'all', labelKey: TranslationKey }[] = [
    { value: 'all', labelKey: 'feedback_filter_all_sources' },
    { value: 'app_store', labelKey: 'feedback_source_app_store' },
    { value: 'survey', labelKey: 'feedback_source_survey' },
    { value: 'social_media', labelKey: 'feedback_source_social_media' },
    { value: 'manual', labelKey: 'feedback_source_manual' },
    { value: 'ai_bulk_import', labelKey: 'feedback_source_ai_bulk_import'},
  ];

  const urgencyOptions: { value: FeedbackUrgency | 'all', labelKey: TranslationKey }[] = [
    { value: 'all', labelKey: 'feedback_filter_all_urgencies' },
    { value: 'high', labelKey: 'feedback_urgency_high' },
    { value: 'medium', labelKey: 'feedback_urgency_medium' },
    { value: 'low', labelKey: 'feedback_urgency_low' },
  ];
  
  const selectClasses = "p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <Button onClick={() => handleOpenModal(null)} variant="primary" leftIcon={<PlusIcon className="h-5 w-5"/>}>
          {t('feedback_aggregator_add_button')}
        </Button>
        <div className="flex flex-wrap items-center gap-4">
            <div>
                <label htmlFor="sourceFilter" className="sr-only">{t('feedback_filter_by_source')}</label>
                <select id="sourceFilter" value={sourceFilter} onChange={e => setSourceFilter(e.target.value as any)} className={selectClasses}>
                    {sourceOptions.map(opt => <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="urgencyFilter" className="sr-only">{t('feedback_filter_by_urgency')}</label>
                <select id="urgencyFilter" value={urgencyFilter} onChange={e => setUrgencyFilter(e.target.value as any)} className={selectClasses}>
                    {urgencyOptions.map(opt => <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>)}
                </select>
            </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-10 px-6 bg-slate-800/50 rounded-lg border border-dashed border-slate-600">
            <p className="text-slate-400">{t('feedback_aggregator_no_feedback_placeholder')}</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="bg-slate-800 p-4 rounded-lg shadow-md border border-slate-700 space-y-3">
                <p className="text-slate-200 whitespace-pre-line">{item.content}</p>
                <div className="flex flex-wrap justify-between items-center gap-4 pt-3 border-t border-slate-700/50">
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-400" title={t('feedback_source_label') as string}>
                           <SourceIcon source={item.source} /> {t(`feedback_source_${item.source}` as TranslationKey)}
                        </div>
                        <UrgencyBadge urgency={item.urgency} t={t} />
                        {item.featureId && (
                           <div className="text-xs text-purple-300" title={t('feedback_feature_link_label') as string}>
                             🔗 {features.find(f => f.id === item.featureId)?.name || 'Linked Feature'}
                           </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenModal(item)}>{t('edit_button')}</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteItem(item.id)}>{t('delete_button')}</Button>
                    </div>
                </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <FeedbackModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveItem}
          itemData={editingItem}
          features={features}
          t={t}
        />
      )}
      {isAiModalOpen && (
        <AiFeedbackAggregatorModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          onProcess={handleAiProcess}
          isLoading={isAiLoading}
          error={aiError}
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