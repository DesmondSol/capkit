import React, { useState } from 'react';
import { MindsetData, Language, AssessmentCategory } from '../../types';
import { TranslationKey } from '../../types';
import { Button } from '../common/Button';
import AssessmentModal from './AssessmentModal'; 

interface EntrepreneurialAssessmentProps {
  mindsetData: MindsetData;
  onUpdateMindsetData: (data: MindsetData) => void;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
  onNavigateAndTriggerReport: () => void; // Added this prop
}

const EntrepreneurialAssessment: React.FC<EntrepreneurialAssessmentProps> = ({ 
  mindsetData, 
  onUpdateMindsetData, 
  language, 
  t,
  onNavigateAndTriggerReport // Destructure the prop
}) => {
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [currentAssessmentType, setCurrentAssessmentType] = useState<AssessmentCategory | null>(null);

  const openAssessment = (type: AssessmentCategory) => {
    setCurrentAssessmentType(type);
    setIsAssessmentModalOpen(true);
  };

  const allAssessmentsDone = 
    mindsetData.assessmentStatus.personality === 'completed' &&
    mindsetData.assessmentStatus.businessAcumen === 'completed' &&
    mindsetData.assessmentStatus.startupKnowledge === 'completed';

  return (
    <div className="p-4 md:p-6 bg-slate-800 rounded-xl shadow-xl border border-slate-700">
      <h3 className="text-2xl font-semibold text-blue-400 mb-6">{t('mindset_assessment_title')}</h3>
      <p className="text-slate-300 mb-8">{t('mindset_assessment_start_prompt')}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button 
          variant="primary" 
          size="lg" 
          className="w-full py-4 flex items-center justify-center"
          onClick={() => openAssessment('personality')}
        >
          {t('mindset_assessment_personality_button')} 
          {mindsetData.assessmentStatus.personality === 'completed' && <CheckIcon className="ml-2 h-5 w-5 text-green-300 flex-shrink-0" />}
        </Button>
        <Button 
          variant="primary" 
          size="lg" 
          className="w-full py-4 flex items-center justify-center"
          onClick={() => openAssessment('businessAcumen')}
        >
          {t('mindset_assessment_acumen_button')}
          {mindsetData.assessmentStatus.businessAcumen === 'completed' && <CheckIcon className="ml-2 h-5 w-5 text-green-300 flex-shrink-0" />}
        </Button>
        <Button 
          variant="primary" 
          size="lg" 
          className="w-full py-4 flex items-center justify-center"
          onClick={() => openAssessment('startupKnowledge')}
        >
          {t('mindset_assessment_knowledge_button')}
          {mindsetData.assessmentStatus.startupKnowledge === 'completed' && <CheckIcon className="ml-2 h-5 w-5 text-green-300 flex-shrink-0" />}
        </Button>
      </div>

      {allAssessmentsDone && (
        <div className="mt-10 text-center">
            <Button
                onClick={onNavigateAndTriggerReport}
                variant="primary"
                size="lg"
                className="w-full md:w-auto md:max-w-md py-4 px-8 bg-green-600 hover:bg-green-500" // Distinct color for generate report
            >
                {t('mindset_profile_report_generate_button')}
                <ArrowRightIcon className="ml-3 h-5 w-5" />
            </Button>
        </div>
      )}


      {isAssessmentModalOpen && currentAssessmentType && (
        <AssessmentModal
          isOpen={isAssessmentModalOpen}
          onClose={() => setIsAssessmentModalOpen(false)}
          assessmentType={currentAssessmentType}
          mindsetData={mindsetData}
          onUpdateMindsetData={onUpdateMindsetData}
          language={language}
          t={t}
        />
      )}
    </div>
  );
};

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
);

const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
  </svg>
);


export default EntrepreneurialAssessment;