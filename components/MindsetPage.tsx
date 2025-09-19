

import React, { useState, useEffect } from 'react';
import { 
    MindsetData, 
    MindsetSubSection, 
    Language, 
    UserProfile 
} from '../types';
import { TranslationKey } from '../types';
import { MINDSET_SECTIONS_HELP } from '../constants';
import EntrepreneurialAssessment from './Mindset/EntrepreneurialAssessment';
import ProfileReport from './Mindset/ProfileReport';
import GoalSetting from './Mindset/GoalSetting';
import AiCoachModal from './Mindset/AiCoachModal';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { FloatingActionButton } from './common/FloatingActionButton';

interface MindsetPageProps {
  initialData: MindsetData;
  onUpdateData: (data: MindsetData) => void;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
  userProfile: UserProfile | null;
}

const MindsetPage: React.FC<MindsetPageProps> = ({
  initialData,
  onUpdateData,
  language,
  t,
  userProfile
}) => {
  const [activeSubSection, setActiveSubSection] = useState<MindsetSubSection>(MindsetSubSection.ENTREPRENEURIAL_ASSESSMENT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isAiCoachModalOpen, setIsAiCoachModalOpen] = useState(false); // New state for AI coach

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const currentHelpContent = MINDSET_SECTIONS_HELP.find(h => h.title === activeSubSection) || MINDSET_SECTIONS_HELP[0];

  const handleSubSectionSelect = (subSection: MindsetSubSection) => {
    setActiveSubSection(subSection);
    if (window.innerWidth < 768 && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const handleNavigateAndTriggerReport = () => {
    setActiveSubSection(MindsetSubSection.PROFILE_REPORT);
    onUpdateData({
      ...initialData,
      shouldAutoGenerateReport: true,
    });
    if (window.innerWidth < 768 && isSidebarOpen) { // Close sidebar on mobile after action
        setIsSidebarOpen(false);
    }
  };

  const renderSubSectionContent = () => {
    switch (activeSubSection) {
      case MindsetSubSection.ENTREPRENEURIAL_ASSESSMENT:
        return <EntrepreneurialAssessment 
                  mindsetData={initialData} 
                  onUpdateMindsetData={onUpdateData} 
                  language={language} t={t} 
                  onNavigateAndTriggerReport={handleNavigateAndTriggerReport}
                />;
      case MindsetSubSection.PROFILE_REPORT:
        return <ProfileReport 
                  mindsetData={initialData} 
                  onUpdateMindsetData={onUpdateData} 
                  language={language} t={t} 
                  userProfile={userProfile}
                />;
      case MindsetSubSection.GOAL_SETTING:
        return <GoalSetting 
                  mindsetData={initialData} 
                  onUpdateMindsetData={onUpdateData} 
                  language={language} t={t} 
                  userProfile={userProfile}
                />;
      default:
        return <p>{t('coming_soon_message')}</p>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full md:h-[calc(100vh-8rem-2rem)] relative bg-transparent">
      <aside 
        className={`
          fixed top-20 right-0 w-full h-[calc(100vh-5rem)] bg-slate-800 z-40 p-6 overflow-y-auto shadow-xl transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          md:static md:w-[320px] md:h-full md:translate-x-0 md:z-auto md:border-r md:border-slate-700 md:shadow-none md:transition-none md:left-auto md:right-auto md:top-auto
        `}
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-semibold text-slate-100">{t('mindset_sidebar_title')}</h3>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            {MINDSET_SECTIONS_HELP.map(sectionHelp => (
              <li key={sectionHelp.title}>
                <a
                  href="#"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    handleSubSectionSelect(sectionHelp.title);
                  }}
                  className={`block px-4 py-3 rounded-lg transition-colors duration-200
                    ${activeSubSection === sectionHelp.title 
                      ? 'bg-blue-600 text-white font-semibold shadow-md' 
                      : 'hover:bg-slate-700 hover:text-slate-100'
                    }`}
                >
                  {/* FIX: Cast sidebarTitle to TranslationKey to resolve TypeScript error */}
                  {t(sectionHelp.sidebarTitle[language] as TranslationKey, sectionHelp.title)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className={`flex-grow p-4 md:p-8 bg-transparent shadow-inner overflow-y-auto ${isSidebarOpen && 'md:ml-0'}`}>
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-100">{t('mindset_page_title')}</h2>
            <Button variant="outline" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
                {isSidebarOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </Button>
        </div>
        {renderSubSectionContent()}
      </main>
      
      {/* AI Coach FAB - visible only on Goal Setting tab */}
      {activeSubSection === MindsetSubSection.GOAL_SETTING && (
          <FloatingActionButton
            icon={<SparklesIcon className="h-7 w-7" />}
            tooltip={t('mindset_goal_setting_ai_coach_button_tooltip')}
            onClick={() => setIsAiCoachModalOpen(true)}
            className="bottom-6 right-6 z-30" // Primary position
            colorClass="bg-green-600 hover:bg-green-500" // Distinct color
            size="lg"
          />
      )}

      {/* Help FAB */}
      <FloatingActionButton
        icon={<HelpIcon className="h-6 w-6" />}
        tooltip={t('mindset_help_button_tooltip')}
        onClick={() => setIsHelpModalOpen(true)}
        className={activeSubSection === MindsetSubSection.GOAL_SETTING ? "bottom-28 right-6 z-30" : "bottom-6 right-6 z-30"} // Position above AI coach if visible
        colorClass="bg-slate-600 hover:bg-slate-500"
        size="md"
      />

      <Modal 
        isOpen={isHelpModalOpen} 
        onClose={() => setIsHelpModalOpen(false)} 
        // FIX: Cast sidebarTitle to TranslationKey to resolve TypeScript error
        title={`${t('mra_help_modal_title_prefix')}: ${t(currentHelpContent.sidebarTitle[language] as TranslationKey, currentHelpContent.title)}`} 
        size="xl"
      >
        <div className="prose prose-sm prose-invert max-w-none text-slate-300 whitespace-pre-line max-h-[70vh] overflow-y-auto pr-2">
            {t(currentHelpContent.explanationKey)}
        </div>
      </Modal>

      {isAiCoachModalOpen && (
        <AiCoachModal
          isOpen={isAiCoachModalOpen}
          onClose={() => setIsAiCoachModalOpen(false)}
          mindsetData={initialData}
          onUpdateMindsetData={onUpdateData}
          language={language}
          t={t}
        />
      )}
    </div>
  );
};

// --- SVG Icons (re-use from other components or define here if specific) ---
const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const HelpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 7.5l.813 2.846a4.5 4.5 0 01-3.09 3.09L12.187 15l-2.846.813a4.5 4.5 0 01-3.09-3.09L5.437 10.5l2.846-.813a4.5 4.5 0 013.09-3.09L12 3.75l.813 2.846a4.5 4.5 0 013.09 3.09L18.75 9l-2.846.813a4.5 4.5 0 01-3.09-3.09L12.187 6 12 5.25l.187.75z" />
  </svg>
);

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export default MindsetPage;
