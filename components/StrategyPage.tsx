import React, { useState, useEffect } from 'react';
import {
    CanvasData,
    PersonasData,
    StrategySubSection,
    Language,
    UserProfile,
    TranslationKey,
    StrategySectionHelp,
    CanvasSection,
} from '../types';
import { STRATEGY_SECTIONS_HELP } from '../constants';
import { BusinessLaunchCanvas } from './BusinessLaunchCanvas/BusinessLaunchCanvas';
import { PersonasPage } from './PersonasPage/PersonasPage';
import { Button } from './common/Button';

interface StrategyPageProps {
  canvasData: CanvasData;
  onSaveCanvasSection: (section: CanvasSection, content: string) => void;
  onMassUpdateCanvas: (newData: Partial<CanvasData>) => void;
  personasData: PersonasData;
  onUpdatePersonasData: (data: PersonasData) => void;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
  userProfile: UserProfile | null;
}

const StrategyPage: React.FC<StrategyPageProps> = ({
  canvasData,
  onSaveCanvasSection,
  onMassUpdateCanvas,
  personasData,
  onUpdatePersonasData,
  language,
  t,
  userProfile,
}) => {
  const [activeSubSection, setActiveSubSection] = useState<StrategySubSection>(StrategySubSection.BUSINESS_CANVAS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const handleSubSectionSelect = (subSection: StrategySubSection) => {
    setActiveSubSection(subSection);
    if (window.innerWidth < 768 && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const renderContent = () => {
    switch (activeSubSection) {
      case StrategySubSection.BUSINESS_CANVAS:
        return (
          <BusinessLaunchCanvas
            canvasData={canvasData}
            onSaveSection={onSaveCanvasSection}
            onMassUpdate={onMassUpdateCanvas}
            language={language}
            t={t}
            userProfile={userProfile}
          />
        );
      case StrategySubSection.PERSONAS:
        return (
          <PersonasPage
            initialData={personasData}
            onUpdateData={onUpdatePersonasData}
            canvasData={canvasData}
            language={language}
            t={t}
            userProfile={userProfile}
          />
        );
      default:
        return <p>Select a section</p>;
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
          <h3 className="text-xl font-semibold text-slate-100">{t('strategy_sidebar_title')}</h3>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            {STRATEGY_SECTIONS_HELP.map(sectionHelp => (
              <li key={sectionHelp.title}>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleSubSectionSelect(sectionHelp.title); }}
                  className={`block px-4 py-3 rounded-lg transition-colors duration-200
                    ${activeSubSection === sectionHelp.title
                      ? 'bg-blue-600 text-white font-semibold shadow-md'
                      : 'hover:bg-slate-700 hover:text-slate-100'
                    }`}
                >
                  {t(sectionHelp.sidebarTitle[language] as TranslationKey, sectionHelp.title)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-grow p-0 md:p-0 bg-transparent shadow-inner overflow-y-auto w-full h-full">
        <div className="flex justify-end items-center mb-2 md:hidden pr-4 pt-2">
          <Button variant="outline" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
        </div>
        <div className="w-full h-full">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

// --- SVG Icons ---
const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export default StrategyPage;