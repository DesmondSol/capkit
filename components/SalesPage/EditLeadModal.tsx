import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CrmLead, CrmStage, TranslationKey } from '../../types';

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: CrmLead) => void;
  leadData: CrmLead;
  targetStage: CrmStage | null; // If not null, we're moving the lead
  t: (key: TranslationKey) => string;
}

export const EditLeadModal: React.FC<EditLeadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  leadData,
  targetStage,
  t,
}) => {
  const [lead, setLead] = useState<CrmLead>(leadData);

  useEffect(() => {
    setLead(leadData);
  }, [leadData, isOpen]);

  const handleChange = (field: keyof CrmLead, value: string) => {
    setLead(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetStage && !lead.name.trim()) {
        alert(t('crm_lead_name_label') + ' is required.');
        return;
    }
    const finalLead = targetStage ? { ...lead, stage: targetStage } : lead;
    onSave(finalLead);
  };

  const inputClasses = "w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm";
  const labelClasses = "block text-sm font-medium text-slate-300 mb-1";
  
  const modalTitle = targetStage ? t('crm_qualify_lead_modal_title') : t('crm_edit_lead_modal_title');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>{t('crm_lead_name_label')}</label>
            <input type="text" value={lead.name} onChange={e => handleChange('name', e.target.value)} required className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>{t('crm_lead_email_label')}</label>
            <input type="email" value={lead.email || ''} onChange={e => handleChange('email', e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>{t('crm_lead_phone_label')}</label>
            <input type="tel" value={lead.phone || ''} onChange={e => handleChange('phone', e.target.value)} className={inputClasses} />
          </div>
        </div>
        <div>
            <label className={labelClasses}>{t('crm_lead_details_label')}</label>
            <textarea value={lead.details || ''} onChange={e => handleChange('details', e.target.value)} rows={3} className={inputClasses} />
        </div>
        
        {/* Fields for Negotiation Stage */}
        {(lead.stage === 'negotiation' || targetStage === 'negotiation') && (
            <div className="p-4 border-t border-slate-700 mt-4 space-y-4">
                 <div>
                    <label className={labelClasses}>{t('crm_needs_analysis_label')}</label>
                    <textarea value={lead.needsAnalysis || ''} onChange={e => handleChange('needsAnalysis', e.target.value)} rows={3} className={inputClasses} required={targetStage === 'negotiation'} />
                </div>
                 <div>
                    <label className={labelClasses}>{t('crm_value_proposition_label')}</label>
                    <textarea value={lead.valueProposition || ''} onChange={e => handleChange('valueProposition', e.target.value)} rows={3} className={inputClasses} required={targetStage === 'negotiation'} />
                </div>
            </div>
        )}
        
        {(lead.stage === 'negotiation' || lead.stage === 'lost') && !targetStage && (
            <div>
                 <label className={labelClasses}>{t('crm_comments_label')}</label>
                 <textarea value={lead.comments || ''} onChange={e => handleChange('comments', e.target.value)} rows={3} className={inputClasses} />
             </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
          <Button type="button" variant="outline" onClick={onClose}>{t('cancel_button')}</Button>
          <Button type="submit" variant="primary">{t('save_button')}</Button>
        </div>
      </form>
    </Modal>
  );
};