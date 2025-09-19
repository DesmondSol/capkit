import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ProductFeature, FeatureVersion, FeaturePriority, TranslationKey, Language } from '../../types';

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (feature: ProductFeature) => void;
  onDelete: (featureId: string) => void;
  featureData: ProductFeature | null;
  t: (key: TranslationKey, defaultText?: string) => string;
  language: Language;
}

const createNewFeature = (): ProductFeature => {
  const now = new Date().toISOString();
  return {
    id: `feat-${Date.now()}`,
    name: '',
    priority: 'medium',
    createdAt: now,
    versions: [
      {
        id: `ver-${Date.now()}`,
        versionNumber: 1,
        description: '',
        problemSolved: '',
        feedbackNotes: '',
        createdAt: now,
      }
    ]
  };
};

export const FeatureModal: React.FC<FeatureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  featureData,
  t,
  language
}) => {
  const [feature, setFeature] = useState<ProductFeature>(featureData || createNewFeature());
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  useEffect(() => {
    setFeature(featureData || createNewFeature());
    setIsHistoryExpanded(false);
  }, [featureData, isOpen]);

  const handleFieldChange = (field: keyof Omit<ProductFeature, 'versions' | 'id' | 'createdAt'>, value: string) => {
    setFeature(prev => ({ ...prev, [field]: value }));
  };

  const handleVersionFieldChange = (field: keyof Omit<FeatureVersion, 'id' | 'versionNumber' | 'createdAt'>, value: string) => {
    setFeature(prev => {
      const updatedVersions = [...prev.versions];
      const activeVersionIndex = updatedVersions.length - 1;
      updatedVersions[activeVersionIndex] = {
        ...updatedVersions[activeVersionIndex],
        [field]: value,
      };
      return { ...prev, versions: updatedVersions };
    });
  };
  
  const handleCreateNewVersion = () => {
    setFeature(prev => {
      const now = new Date().toISOString();
      const lastVersion = prev.versions[prev.versions.length - 1];
      const newVersion: FeatureVersion = {
        ...lastVersion, // Carry over details from the last version
        id: `ver-${Date.now()}`,
        versionNumber: lastVersion.versionNumber + 1,
        createdAt: now,
        feedbackNotes: '', // Clear feedback notes for new version
      };
      return { ...prev, versions: [...prev.versions, newVersion] };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feature.name.trim()) {
      alert(t('planning_feature_name_label') + ' is required.');
      return;
    }
    onSave(feature);
  };
  
  const activeVersion = feature.versions[feature.versions.length - 1];
  const versionHistory = feature.versions.slice(0, -1).reverse();
  const priorityOptions: { value: FeaturePriority; labelKey: TranslationKey }[] = [
    { value: 'low', labelKey: 'planning_priority_low' },
    { value: 'medium', labelKey: 'planning_priority_medium' },
    { value: 'high', labelKey: 'planning_priority_high' },
    { value: 'critical', labelKey: 'planning_priority_critical' },
  ];
  const inputBaseClasses = "w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm";
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={featureData ? t('planning_feature_modal_title_edit') : t('planning_feature_modal_title_add')} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t('planning_feature_name_label')}</label>
            <input type="text" value={feature.name} onChange={(e) => handleFieldChange('name', e.target.value)} required className={inputBaseClasses} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t('planning_feature_priority_label')}</label>
            <select value={feature.priority} onChange={(e) => handleFieldChange('priority', e.target.value)} className={inputBaseClasses}>
              {priorityOptions.map(opt => <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>)}
            </select>
          </div>
        </div>

        {/* Active Version Editor */}
        <div className="p-4 border border-blue-500/50 rounded-lg bg-slate-800/50 space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-blue-300">{t('planning_active_version_label')}: v{activeVersion.versionNumber}</h4>
                <Button type="button" onClick={handleCreateNewVersion} variant="secondary" size="sm">{t('planning_version_create_new_button')}</Button>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t('planning_version_description_label')}</label>
                <textarea value={activeVersion.description} onChange={e => handleVersionFieldChange('description', e.target.value)} rows={3} className={inputBaseClasses}/>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t('planning_version_problem_solved_label')}</label>
                <textarea value={activeVersion.problemSolved} onChange={e => handleVersionFieldChange('problemSolved', e.target.value)} rows={2} className={inputBaseClasses}/>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t('planning_version_feedback_notes_label')}</label>
                <textarea value={activeVersion.feedbackNotes} onChange={e => handleVersionFieldChange('feedbackNotes', e.target.value)} rows={2} className={inputBaseClasses}/>
            </div>
        </div>
        
        {/* Version History */}
        {versionHistory.length > 0 && (
          <details className="p-4 border border-slate-700 rounded-lg bg-slate-800/30" onToggle={(e) => setIsHistoryExpanded((e.target as HTMLDetailsElement).open)}>
            <summary className="cursor-pointer text-lg font-semibold text-slate-300 hover:text-white transition-colors">
              {t('planning_version_history_title')} ({versionHistory.length})
            </summary>
            {isHistoryExpanded && (
                <div className="mt-4 space-y-4 max-h-60 overflow-y-auto pr-2">
                {versionHistory.map(version => (
                    <div key={version.id} className="p-3 bg-slate-700/50 rounded-md border border-slate-600">
                        <p className="font-semibold text-slate-200">{t('planning_version_number_label')} {version.versionNumber}</p>
                        <p className="text-sm text-slate-400 mt-2"><span className="font-semibold">{t('planning_version_description_label')}:</span> {version.description}</p>
                        <p className="text-sm text-slate-400 mt-1"><span className="font-semibold">{t('planning_version_problem_solved_label')}:</span> {version.problemSolved}</p>
                        <p className="text-sm text-slate-400 mt-1"><span className="font-semibold">{t('planning_version_feedback_notes_label')}:</span> {version.feedbackNotes}</p>
                    </div>
                ))}
                </div>
            )}
          </details>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-5 border-t border-slate-700">
          <div>
            {featureData && (
              <Button type="button" variant="danger" onClick={() => onDelete(featureData.id)}>{t('delete_button')}</Button>
            )}
          </div>
          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>{t('cancel_button')}</Button>
            <Button type="submit" variant="primary">{t('save_button')}</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
