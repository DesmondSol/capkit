import React, { useState, useMemo } from 'react';
import { SalesData, CrmLead, CrmStage, Language, TranslationKey } from '../../types';
import { Button } from '../common/Button';
import { AddProspectsModal } from './AddProspectsModal';
import { EditLeadModal } from './EditLeadModal';
import { MarkAsLostModal } from './MarkAsLostModal';

interface CrmPipelinePageProps {
  salesData: SalesData;
  onUpdateData: (data: SalesData) => void;
  t: (key: TranslationKey, defaultText?: string) => string;
  language: Language;
}

const STAGES: CrmStage[] = ['prospects', 'negotiation', 'closed', 'lost'];

export const CrmPipelinePage: React.FC<CrmPipelinePageProps> = ({ salesData, onUpdateData, t }) => {
  const [activeStage, setActiveStage] = useState<CrmStage>('prospects');
  
  const [isAddProspectsModalOpen, setIsAddProspectsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLostModalOpen, setIsLostModalOpen] = useState(false);

  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null);
  const [targetStageForEdit, setTargetStageForEdit] = useState<CrmStage | null>(null);

  const crmLeads = useMemo(() => salesData.crmLeads || [], [salesData.crmLeads]);

  const handleUpdateLeads = (updatedLeads: CrmLead[]) => {
    onUpdateData({ ...salesData, crmLeads: updatedLeads });
  };

  const handleBulkAddProspects = (prospectsText: string) => {
    const lines = prospectsText.split('\n').filter(line => line.trim() !== '');
    const newLeads: CrmLead[] = lines.map(line => {
        const [name, email, phone, ...detailsParts] = line.split(',').map(s => s.trim());
        return {
            id: `lead-${Date.now()}-${Math.random()}`,
            name: name || 'Unnamed Lead',
            email: email || undefined,
            phone: phone || undefined,
            details: detailsParts.join(', ') || undefined,
            stage: 'prospects',
            createdAt: new Date().toISOString(),
        };
    });
    handleUpdateLeads([...crmLeads, ...newLeads]);
    setIsAddProspectsModalOpen(false);
  };

  const handleSaveLead = (updatedLead: CrmLead) => {
    const updatedLeads = crmLeads.map(lead => lead.id === updatedLead.id ? updatedLead : lead);
    handleUpdateLeads(updatedLeads);
    setIsEditModalOpen(false);
    setSelectedLead(null);
  };

  const handleMarkAsLost = (leadId: string, reason: string) => {
    const updatedLeads = crmLeads.map(lead => 
        lead.id === leadId ? { ...lead, stage: 'lost' as CrmStage, comments: reason } : lead
    );
    handleUpdateLeads(updatedLeads);
    setIsLostModalOpen(false);
    setSelectedLead(null);
  };
  
  const handleQualifyLead = (lead: CrmLead) => {
    setSelectedLead(lead);
    setTargetStageForEdit('negotiation');
    setIsEditModalOpen(true);
  };
  
  const handleMarkAsWon = (leadId: string) => {
      const updatedLeads = crmLeads.map(lead =>
          lead.id === leadId ? { ...lead, stage: 'closed' as CrmStage } : lead
      );
      handleUpdateLeads(updatedLeads);
  };
  
  const handleOpenMarkAsLostModal = (lead: CrmLead) => {
      setSelectedLead(lead);
      setIsLostModalOpen(true);
  };
  
  const leadsInStage = useMemo(() => crmLeads.filter(lead => lead.stage === activeStage), [crmLeads, activeStage]);

  const LeadCard: React.FC<{ lead: CrmLead }> = ({ lead }) => (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md border border-slate-700 flex flex-col justify-between">
        <div>
            <h4 className="font-semibold text-slate-100">{lead.name}</h4>
            <p className="text-sm text-blue-300 truncate">{lead.email}</p>
            <p className="text-xs text-slate-400 mt-2 line-clamp-2">{lead.details || t('crm_no_leads_in_stage')}</p>
        </div>
        <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-slate-700/50">
            {lead.stage === 'prospects' && <Button size="sm" variant="secondary" onClick={() => handleQualifyLead(lead)}>{t('crm_qualify_button')}</Button>}
            {lead.stage === 'negotiation' && (
                <>
                    <Button size="sm" variant="danger" onClick={() => handleOpenMarkAsLostModal(lead)}>{t('crm_mark_lost_button')}</Button>
                    <Button size="sm" variant="primary" className="bg-green-600 hover:bg-green-500" onClick={() => handleMarkAsWon(lead.id)}>{t('crm_mark_won_button')}</Button>
                </>
            )}
             <Button size="sm" variant="outline" onClick={() => { setSelectedLead(lead); setTargetStageForEdit(null); setIsEditModalOpen(true); }}>{t('edit_button')}</Button>
        </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-2xl font-semibold text-blue-400">{t('crm_pipeline_title')}</h3>
        <Button onClick={() => setIsAddProspectsModalOpen(true)} variant="primary" leftIcon={<PlusIcon className="h-5 w-5" />}>
          {t('crm_add_prospects_button')}
        </Button>
      </div>
      
      <div className="border-b border-slate-700">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {STAGES.map(stage => (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeStage === stage
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                }`}
            >
              {t(`crm_stage_${stage}` as TranslationKey)} ({crmLeads.filter(l => l.stage === stage).length})
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {leadsInStage.length > 0 ? (
          leadsInStage.map(lead => <LeadCard key={lead.id} lead={lead} />)
        ) : (
          <div className="col-span-full text-center py-10 px-6 bg-slate-800/50 rounded-lg border border-dashed border-slate-600">
            <p className="text-slate-400">{t('crm_no_leads_in_stage')}</p>
          </div>
        )}
      </div>

      {isAddProspectsModalOpen && (
        <AddProspectsModal 
            isOpen={isAddProspectsModalOpen} 
            onClose={() => setIsAddProspectsModalOpen(false)} 
            onSave={handleBulkAddProspects}
            t={t}
        />
      )}
      {isEditModalOpen && selectedLead && (
          <EditLeadModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveLead}
            leadData={selectedLead}
            targetStage={targetStageForEdit}
            t={t}
          />
      )}
      {isLostModalOpen && selectedLead && (
          <MarkAsLostModal
            isOpen={isLostModalOpen}
            onClose={() => setIsLostModalOpen(false)}
            onSave={(reason) => handleMarkAsLost(selectedLead.id, reason)}
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