import React, { useState } from 'react';
import { ProductDesignData, ProductFeature, TranslationKey, Language, FeaturePriority, ActionItem, ActionBoardStatus } from '../../types';
import { Button } from '../common/Button';
import { FeatureModal } from './FeatureModal';

interface ProductPlanningProps {
  productDesignData: ProductDesignData;
  onUpdateData: (data: ProductDesignData) => void;
  t: (key: TranslationKey, defaultText?: string) => string;
  language: Language;
}

const getPriorityStyles = (priority: FeaturePriority): string => {
  switch (priority) {
    case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/50';
    case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
    case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
    case 'low': return 'bg-sky-500/20 text-sky-300 border-sky-500/50';
    default: return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
  }
};

export const ProductPlanning: React.FC<ProductPlanningProps> = ({ productDesignData, onUpdateData, t, language }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<ProductFeature | null>(null);

  const features = productDesignData.features || [];
  const actionItems = productDesignData.actionItems || [];

  const handleOpenModal = (feature: ProductFeature | null) => {
    setEditingFeature(feature);
    setIsModalOpen(true);
  };

  const handleSaveFeature = (featureToSave: ProductFeature) => {
    let updatedFeatures: ProductFeature[];
    let updatedActionItems = [...actionItems];

    if (editingFeature) { // Editing existing feature
      updatedFeatures = features.map(f => f.id === featureToSave.id ? featureToSave : f);
    } else { // Adding new feature
      updatedFeatures = [...features, featureToSave];
      
      const newActionItem: ActionItem = {
          id: `action-${Date.now()}`,
          title: featureToSave.name,
          description: t('action_item_linked_feature_desc', 'Initial action item for feature: {featureName}').replace('{featureName}', featureToSave.name),
          status: ActionBoardStatus.IDEA,
          featureId: featureToSave.id,
          createdAt: new Date().toISOString(),
          dueDate: null,
          completedAt: null,
      };
      updatedActionItems.push(newActionItem);
    }
    onUpdateData({ ...productDesignData, features: updatedFeatures, actionItems: updatedActionItems });
    setIsModalOpen(false);
    setEditingFeature(null);
  };
  
  const handleDeleteFeature = (featureId: string) => {
    if (window.confirm(t('delete_button') + ` feature? This will not delete linked action items.`)) {
      const updatedFeatures = features.filter(f => f.id !== featureId);
      // Also unlink from action items
      const updatedActionItems = actionItems.map(item => item.featureId === featureId ? {...item, featureId: null} : item);

      onUpdateData({ ...productDesignData, features: updatedFeatures, actionItems: updatedActionItems });
      setIsModalOpen(false);
      setEditingFeature(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-start">
        <Button onClick={() => handleOpenModal(null)} variant="primary" leftIcon={<PlusIcon className="h-5 w-5" />}>
          {t('planning_add_feature_button')}
        </Button>
      </div>

      {features.length === 0 ? (
        <div className="text-center py-10 px-6 bg-slate-800/50 rounded-lg border border-dashed border-slate-600">
          <p className="text-slate-400">{t('planning_no_features_placeholder')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {features.map(feature => {
            const activeVersion = feature.versions[feature.versions.length - 1];
            return(
              <div 
                key={feature.id} 
                className="bg-slate-800 p-5 rounded-lg shadow-md border border-slate-700 hover:border-blue-600 transition-colors cursor-pointer"
                onClick={() => handleOpenModal(feature)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-slate-100">{feature.name}</h4>
                    <div className={`inline-block px-3 py-1 text-xs font-medium rounded-full mt-2 border ${getPriorityStyles(feature.priority)}`}>
                      {t(`planning_priority_${feature.priority}` as TranslationKey, feature.priority)}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-sm text-slate-400">{t('planning_active_version_label')}</p>
                    <p className="text-lg font-semibold text-slate-200">v{activeVersion?.versionNumber || 'N/A'}</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-700">
                  <p className="text-sm text-slate-300 line-clamp-2">{activeVersion?.description || 'No description for the active version.'}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {isModalOpen && (
        <FeatureModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveFeature}
          onDelete={handleDeleteFeature}
          featureData={editingFeature}
          t={t}
          language={language}
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
