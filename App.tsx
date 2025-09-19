

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { BusinessLaunchCanvas } from './components/BusinessLaunchCanvas/BusinessLaunchCanvas';
import { PersonasPage } from './components/PersonasPage/PersonasPage';
import { MarketResearchAccelerator } from './components/MarketResearchAccelerator/MarketResearchAccelerator';
import { CopywritingPage } from './components/CopywritingPage';
import MindsetPage from './components/MindsetPage';
import ProductDesignPage from './components/ProductDesignPage/ProductDesignPage';
import EconomicsPage from './components/EconomicsPage/EconomicsPage';
import SalesPage from './components/SalesPage/SalesPage';
import StrategyPage from './components/StrategyPage';
import { LegalPage } from './components/Grow/LegalPage';
import { InvestmentPage } from './components/Grow/InvestmentPage';
import ManagementPage from './components/Grow/ManagementPage';
import { ChecklistsPage } from './components/Grow/ChecklistsPage';
import { ComingSoon } from './components/ComingSoon';
import { UserProfileModal } from './components/UserProfileModal';
import InfographicPage from './components/InfographicPage';
import { AuthPage } from './components/AuthPage';
import { LockedFeature } from './components/LockedFeature';
import { 
    Page, 
    SubPage, 
    CanvasData, 
    ALL_CANVAS_SECTIONS, 
    CanvasSection, 
    Language, 
    UserProfile, 
    MarketResearchData, 
    ResearchSection,
    CopywritingData,
    MindsetData,
    PersonasData,
    ProductDesignData,
    EconomicsData,
    SalesData,
    GrowData,
    TranslationKey,
    UserAuthData
} from './types';
import { NAV_ITEMS } from './constants';
import { getTranslator } from './locales';

const initialMarketResearchData: MarketResearchData = {
  [ResearchSection.QUESTIONS]: [], 
  [ResearchSection.GENERAL_NOTES_IMPORT]: "",
  [ResearchSection.COMPETITOR_ANALYSIS]: [],
  [ResearchSection.TRENDS]: [],
  [ResearchSection.AI_SUMMARY]: "",
};

const initialCopywritingData: CopywritingData = {
  marketingStrategies: [],
  marketingPosts: [],
  pitches: [],
  onePager: {
    traction: '',
    team: '',
    ask: '',
    generatedBlurb: '',
  },
};

const initialMindsetData: MindsetData = {
  assessmentAnswers: {
    personality: {},
    businessAcumen: {},
    startupKnowledge: {},
  },
  assessmentStatus: {
    personality: 'not-started',
    businessAcumen: 'not-started',
    startupKnowledge: 'not-started',
  },
  profileReport: null,
  goals: {
    '6-month': { self: '', family: '', world: '' },
    '2-year': { self: '', family: '', world: '' },
    '5-year': { self: '', family: '', world: '' },
    '10-year': { self: '', family: '', world: '' },
  },
  goalsFirstSetDate: undefined,
  shouldAutoGenerateReport: false,
  goalSettingAiChatHistory: [],
};

const initialPersonasData: PersonasData = [];

const initialProductDesignData: ProductDesignData = {
  brainstormIdeas: [],
  features: [],
  actionItems: [],
  feedbackItems: [],
};

const initialEconomicsData: EconomicsData = {
    costs: [],
    revenues: [],
    unitEconomics: {
      avgRevenue: '',
      cogs: '',
      cac: '',
      customerLifetime: '',
    },
    burnRate: {
        startingCapital: '',
        additionalHiringSpend: '',
        additionalMarketingSpend: '',
    },
    financialProjection: {
      inputs: {
        startingCapital: '',
        products: [],
        salesGrowthRate: '',
        monthlyRevenue: '',
        monthlyExpenses: '',
      },
      result: null,
    }
};

const initialSalesData: SalesData = {
    launchSequence: [],
    crmLeads: [],
};

const initialGrowData: GrowData = {
  legal: {
    documents: [],
    complianceItems: [
        { id: 'comp-1', name: 'Business Registration & Licensing', status: 'pending', notes: 'Register company name and obtain principal registration certificate from Ministry of Trade and Industry (MoTI).'},
        { id: 'comp-2', name: 'Tax Identification Number (TIN)', status: 'pending', notes: 'Obtain TIN from the Ethiopian Revenue and Customs Authority (ERCA). This is mandatory for all businesses.'},
        { id: 'comp-3', name: 'Value Added Tax (VAT) Registration', status: 'pending', notes: 'Register for VAT if annual turnover is expected to exceed ETB 1,000,000.'},
        { id: 'comp-4', name: 'Employment Contracts', status: 'pending', notes: 'Ensure all employment contracts comply with the Ethiopian Labour Proclamation No. 1156/2019.'},
        { id: 'comp-5', name: 'Private Organization Employees Pension Fund', status: 'pending', notes: 'Register and contribute for all permanent employees. Contribution is 7% from employer and 11% from employee.'},
        { id: 'comp-6', name: 'Business Bank Account', status: 'pending', notes: 'Open a dedicated commercial bank account for all business transactions.'},
        { id: 'comp-7', name: 'Intellectual Property (IP) Protection', status: 'pending', notes: 'Consider registering trademarks, patents, or copyrights with the Ethiopian Intellectual Property Office (EIPO).'},
    ],
  },
  investment: {
    capTable: [],
    investorCrm: [],
  },
  management: {
    inventory: [],
    qmsItems: [],
    supportTickets: [],
  },
  checklists: {
    releaseList: [],
    growthList: [],
  }
};

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page | null>(null);
  const [activeSubPage, setActiveSubPage] = useState<SubPage | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [auth, setAuth] = useState<{ isLoggedIn: boolean; email: string | null; accessLevel: 'full' | 'mindset_only' }>({ isLoggedIn: false, email: null, accessLevel: 'mindset_only' });

  useEffect(() => {
    const sessionEmail = localStorage.getItem('capkitSessionEmail');
    if (sessionEmail) {
      const users: UserAuthData[] = JSON.parse(localStorage.getItem('capkitUsers') || '[]');
      const currentUser = users.find(u => u.email === sessionEmail);
      if (currentUser) {
        setAuth({ isLoggedIn: true, email: sessionEmail, accessLevel: currentUser.accessLevel });
      }
    }
  }, []);

  const [canvasData, setCanvasData] = useState<CanvasData>(() => {
    const storedCanvasData = localStorage.getItem('capkitCanvasData');
    if (storedCanvasData) {
      try {
        const parsedData = JSON.parse(storedCanvasData);
        return ALL_CANVAS_SECTIONS.reduce((acc, section) => {
          acc[section] = parsedData[section] || "";
          return acc;
        }, {} as CanvasData);
      } catch (e) { console.error("Failed to parse canvasData from localStorage", e); }
    }
    return ALL_CANVAS_SECTIONS.reduce((acc, section) => { acc[section] = ""; return acc; }, {} as CanvasData);
  });

  const [personasData, setPersonasData] = useState<PersonasData>(() => {
    const storedPersonasData = localStorage.getItem('capkitPersonasData');
    if (storedPersonasData) {
        try { return JSON.parse(storedPersonasData); } catch (e) { console.error("Failed to parse personasData from localStorage", e); }
    }
    return initialPersonasData;
  });

  const [marketResearchData, setMarketResearchData] = useState<MarketResearchData>(() => {
    const storedMarketData = localStorage.getItem('capkitMarketResearchData');
    if (storedMarketData) {
      try {
        const parsed = JSON.parse(storedMarketData);
        return {
          [ResearchSection.QUESTIONS]: parsed[ResearchSection.QUESTIONS] || [],
          [ResearchSection.GENERAL_NOTES_IMPORT]: parsed[ResearchSection.GENERAL_NOTES_IMPORT] || "",
          [ResearchSection.COMPETITOR_ANALYSIS]: parsed[ResearchSection.COMPETITOR_ANALYSIS] || [],
          [ResearchSection.TRENDS]: parsed[ResearchSection.TRENDS] || [],
          [ResearchSection.AI_SUMMARY]: parsed[ResearchSection.AI_SUMMARY] || "",
        };
      } catch (e) { console.error("Failed to parse marketResearchData from localStorage", e); }
    }
    return initialMarketResearchData;
  });

  const [copywritingData, setCopywritingData] = useState<CopywritingData>(() => {
    const storedCopywritingData = localStorage.getItem('capkitCopywritingData');
    if (storedCopywritingData) {
      try {
        const parsed = JSON.parse(storedCopywritingData);
        return {
          marketingStrategies: parsed.marketingStrategies || [], 
          marketingPosts: parsed.marketingPosts || [], 
          pitches: parsed.pitches || [],
          onePager: parsed.onePager || initialCopywritingData.onePager
        };
      } catch (e) { console.error("Failed to parse copywritingData from localStorage", e); }
    }
    return initialCopywritingData;
  });

  const [mindsetData, setMindsetData] = useState<MindsetData>(() => {
    const storedMindsetData = localStorage.getItem('capkitMindsetData');
    if (storedMindsetData) {
      try {
        const parsed = JSON.parse(storedMindsetData);
        return {
          assessmentAnswers: { personality: parsed.assessmentAnswers?.personality || {}, businessAcumen: parsed.assessmentAnswers?.businessAcumen || {}, startupKnowledge: parsed.assessmentAnswers?.startupKnowledge || {} },
          assessmentStatus: { personality: parsed.assessmentStatus?.personality || 'not-started', businessAcumen: parsed.assessmentStatus?.businessAcumen || 'not-started', startupKnowledge: parsed.assessmentStatus?.startupKnowledge || 'not-started' },
          profileReport: parsed.profileReport || null,
          goals: {
            '6-month': parsed.goals?.['6-month'] || { self: '', family: '', world: '' }, '2-year': parsed.goals?.['2-year'] || { self: '', family: '', world: '' },
            '5-year': parsed.goals?.['5-year'] || { self: '', family: '', world: '' }, '10-year': parsed.goals?.['10-year'] || { self: '', family: '', world: '' },
          },
          goalsFirstSetDate: parsed.goalsFirstSetDate || undefined,
          shouldAutoGenerateReport: typeof parsed.shouldAutoGenerateReport === 'boolean' ? parsed.shouldAutoGenerateReport : false,
          goalSettingAiChatHistory: Array.isArray(parsed.goalSettingAiChatHistory) ? parsed.goalSettingAiChatHistory : [],
        };
      } catch (e) { console.error("Failed to parse mindsetData from localStorage", e); }
    }
    return initialMindsetData;
  });

  const [productDesignData, setProductDesignData] = useState<ProductDesignData>(() => {
    const storedData = localStorage.getItem('capkitProductDesignData');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        return {
          brainstormIdeas: parsed.brainstormIdeas || [], features: parsed.features || [],
          actionItems: (parsed.actionItems || []).map((item: any) => ({ ...item, dueDate: item.dueDate || null, completedAt: item.completedAt || null })),
          feedbackItems: parsed.feedbackItems || [],
        };
      } catch (e) { console.error("Failed to parse productDesignData from localStorage", e); }
    }
    return initialProductDesignData;
  });

  const [economicsData, setEconomicsData] = useState<EconomicsData>(() => {
    const storedData = localStorage.getItem('capkitEconomicsData');
    if (storedData) {
        try {
            const parsed = JSON.parse(storedData); const now = new Date().toISOString().split('T')[0];
            const costs = (parsed.costs || []).map((item: any) => ({ ...item, date: item.date || now, type: item.type || 'one_time', details: item.details || '' }));
            const revenues = (parsed.revenues || []).map((item: any) => ({ ...item, date: item.date || now, type: item.type || 'one_time', details: item.details || '' }));
            const unitEconomics = parsed.unitEconomics || initialEconomicsData.unitEconomics; const burnRate = parsed.burnRate || initialEconomicsData.burnRate;
            const financialProjection = parsed.financialProjection || initialEconomicsData.financialProjection;
            return { costs, revenues, unitEconomics, burnRate, financialProjection };
        } catch (e) { console.error("Failed to parse economicsData from localStorage", e); }
    }
    return initialEconomicsData;
  });
  
  const [salesData, setSalesData] = useState<SalesData>(() => {
    const storedData = localStorage.getItem('capkitSalesData');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        return { launchSequence: parsed.launchSequence || [], crmLeads: parsed.crmLeads || [] };
      } catch (e) { console.error("Failed to parse salesData from localStorage", e); }
    }
    return initialSalesData;
  });

  const [growData, setGrowData] = useState<GrowData>(() => {
    const storedData = localStorage.getItem('capkitGrowData');
    if (storedData) {
        try {
            const parsed = JSON.parse(storedData);
            const mergedLegal = { ...initialGrowData.legal, ...(parsed.legal || {}), complianceItems: parsed.legal?.complianceItems || initialGrowData.legal.complianceItems };
            return {
                legal: mergedLegal, investment: { ...initialGrowData.investment, ...(parsed.investment || {}) },
                management: { ...initialGrowData.management, ...(parsed.management || {}) }, checklists: { ...initialGrowData.checklists, ...(parsed.checklists || {}) },
            };
        } catch (e) { console.error("Failed to parse growData from localStorage", e); }
    }
    return initialGrowData;
  });

  const t = useCallback(getTranslator(currentLanguage), [currentLanguage]);

  useEffect(() => {
    if (auth.email) {
      const storedProfile = localStorage.getItem(`capkitUserProfile_${auth.email}`);
      if (storedProfile) {
        try { setUserProfile(JSON.parse(storedProfile)); } catch (e) { console.error("Failed to parse userProfile from localStorage", e); }
      } else {
        const users: UserAuthData[] = JSON.parse(localStorage.getItem('capkitUsers') || '[]');
        const currentUser = users.find(u => u.email === auth.email);
        setUserProfile({ name: currentUser?.name || '', email: currentUser?.email || '' });
      }
    } else {
      setUserProfile(null);
    }
  }, [auth.email]);

  const handleLoginSuccess = (email: string, accessLevel: 'full' | 'mindset_only') => {
    localStorage.setItem('capkitSessionEmail', email);
    setAuth({ isLoggedIn: true, email, accessLevel });
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('capkitSessionEmail');
    setAuth({ isLoggedIn: false, email: null, accessLevel: 'mindset_only' });
    setActivePage(null);
    setActiveSubPage(null);
  };

  const handleUnlockSuccess = () => {
    if (!auth.email) return;
    const users: UserAuthData[] = JSON.parse(localStorage.getItem('capkitUsers') || '[]');
    const updatedUsers = users.map(u => u.email === auth.email ? { ...u, accessLevel: 'full' } : u);
    localStorage.setItem('capkitUsers', JSON.stringify(updatedUsers));
    setAuth(prev => ({ ...prev, accessLevel: 'full' }));
    setIsUserProfileModalOpen(false);
  };
  
  const handleUpdateUserProfile = (profile: UserProfile) => {
    if (auth.email) {
      setUserProfile(profile);
      localStorage.setItem(`capkitUserProfile_${auth.email}`, JSON.stringify(profile));
      setIsUserProfileModalOpen(false);
    }
  };

  const handleSelectPage = (page: Page | null, subPage: SubPage | null) => {
    // If user is not logged in and tries to navigate, always show auth modal first.
    if (!auth.isLoggedIn && page !== null) {
      setIsAuthModalOpen(true);
      return;
    }
  
    // Default action: navigate to the selected page/subpage.
    setActivePage(page);
    setActiveSubPage(subPage);
  };

  const renderContent = () => {
    if (activePage === null || (activePage !== null && activeSubPage === null)) {
      return <InfographicPage language={currentLanguage} t={t} />;
    }
    
    const hasAccess = auth.isLoggedIn && (auth.accessLevel === 'full' || (activePage === Page.START && activeSubPage === SubPage.MINDSET));

    if (auth.isLoggedIn && !hasAccess) {
        return <LockedFeature onUnlockClick={() => setIsUserProfileModalOpen(true)} t={t} />;
    }
    
    if (!auth.isLoggedIn) {
      return <InfographicPage language={currentLanguage} t={t} />;
    }

    switch (activePage) {
      case Page.START:
        switch(activeSubPage) {
          case SubPage.MINDSET: return <MindsetPage initialData={mindsetData} onUpdateData={setMindsetData} language={currentLanguage} t={t} userProfile={userProfile} />;
          case SubPage.STRATEGY: return <StrategyPage canvasData={canvasData} onSaveCanvasSection={(section, content) => setCanvasData(prev => ({...prev, [section]: content}))} onMassUpdateCanvas={(newData) => setCanvasData(prev => ({...prev, ...newData}))} personasData={personasData} onUpdatePersonasData={setPersonasData} language={currentLanguage} t={t} userProfile={userProfile} />;
          case SubPage.RESEARCH: return <MarketResearchAccelerator initialData={marketResearchData} onUpdateData={setMarketResearchData} strategyData={canvasData} language={currentLanguage} t={t} userProfile={userProfile} />;
          case SubPage.COPYWRITING: return <CopywritingPage initialData={copywritingData} onUpdateData={setCopywritingData} strategyData={canvasData} researchData={marketResearchData} personasData={personasData} language={currentLanguage} t={t} userProfile={userProfile} />;
          default: return <InfographicPage language={currentLanguage} t={t} />;
        }
      case Page.BUILD:
        switch(activeSubPage) {
          case SubPage.PRODUCT_DESIGN: return <ProductDesignPage initialData={productDesignData} onUpdateData={setProductDesignData} canvasData={canvasData} language={currentLanguage} t={t} userProfile={userProfile} />;
          case SubPage.ECONOMICS: return <EconomicsPage initialData={economicsData} onUpdateData={setEconomicsData} language={currentLanguage} t={t} userProfile={userProfile} />;
          case SubPage.SALES: return <SalesPage initialData={salesData} onUpdateData={setSalesData} canvasData={canvasData} personasData={personasData} researchData={marketResearchData} language={currentLanguage} t={t} userProfile={userProfile} />;
          default: return <InfographicPage language={currentLanguage} t={t} />;
        }
      case Page.GROW:
        switch(activeSubPage) {
          case SubPage.LEGAL: return <LegalPage initialData={growData.legal} onUpdateData={d => setGrowData(p => ({...p, legal: d}))} language={currentLanguage} t={t} userProfile={userProfile} />;
          case SubPage.INVESTMENT: return <InvestmentPage initialData={growData.investment} onUpdateData={d => setGrowData(p => ({...p, investment: d}))} language={currentLanguage} t={t} userProfile={userProfile} />;
          case SubPage.MANAGEMENT: return <ManagementPage initialData={growData.management} onUpdateData={d => setGrowData(p => ({...p, management: d}))} language={currentLanguage} t={t} userProfile={userProfile} />;
          case SubPage.CHECKLISTS: return <ChecklistsPage initialData={growData.checklists} onUpdateData={d => setGrowData(p => ({...p, checklists: d}))} language={currentLanguage} t={t} userProfile={userProfile} />;
          default: return <InfographicPage language={currentLanguage} t={t} />;
        }
      default:
        return <InfographicPage language={currentLanguage} t={t} />;
    }
  };

  return (
    <>
      <Navbar
        navItems={NAV_ITEMS}
        onSelectPage={handleSelectPage}
        activeSubPage={activeSubPage}
        currentLanguage={currentLanguage}
        changeLanguage={setCurrentLanguage}
        t={t}
        userProfile={userProfile}
        onOpenProfileModal={() => setIsUserProfileModalOpen(true)}
        isLoggedIn={auth.isLoggedIn}
        accessLevel={auth.accessLevel}
        onLogout={handleLogout}
      />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
          {renderContent()}
      </main>
      
      {isAuthModalOpen && (
        <AuthPage 
            isOpen={isAuthModalOpen} 
            onClose={() => setIsAuthModalOpen(false)} 
            onLoginSuccess={handleLoginSuccess}
            t={t}
            language={currentLanguage}
        />
      )}

      {isUserProfileModalOpen && userProfile && (
        <UserProfileModal
          isOpen={isUserProfileModalOpen}
          onClose={() => setIsUserProfileModalOpen(false)}
          onSave={handleUpdateUserProfile}
          currentUserProfile={userProfile}
          t={t}
          accessLevel={auth.accessLevel}
          onUnlockSuccess={handleUnlockSuccess}
        />
      )}
    </>
  );
};

export default App;