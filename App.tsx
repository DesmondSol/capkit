import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { auth, db } from './components/firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";

const initialCanvasData: CanvasData = ALL_CANVAS_SECTIONS.reduce((acc, section) => {
  acc[section] = "";
  return acc;
}, {} as CanvasData);

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
  landingPageHtml: '',
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
  const [userAuth, setUserAuth] = useState<{ isLoggedIn: boolean; email: string | null; uid: string | null; accessLevel: 'full' | 'mindset_only' }>({ isLoggedIn: false, email: null, uid: null, accessLevel: 'mindset_only' });
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Initialize data states with defaults
  const [canvasData, setCanvasData] = useState<CanvasData>(initialCanvasData);
  const [personasData, setPersonasData] = useState<PersonasData>(initialPersonasData);
  const [marketResearchData, setMarketResearchData] = useState<MarketResearchData>(initialMarketResearchData);
  const [copywritingData, setCopywritingData] = useState<CopywritingData>(initialCopywritingData);
  const [mindsetData, setMindsetData] = useState<MindsetData>(initialMindsetData);
  const [productDesignData, setProductDesignData] = useState<ProductDesignData>(initialProductDesignData);
  const [economicsData, setEconomicsData] = useState<EconomicsData>(initialEconomicsData);
  const [salesData, setSalesData] = useState<SalesData>(initialSalesData);
  const [growData, setGrowData] = useState<GrowData>(initialGrowData);

  // Refs to track remote updates to prevent infinite loops with useEffect dependencies
  const isRemoteUpdate = useRef<{ [key: string]: boolean }>({});

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserAuth({ isLoggedIn: true, email: user.email, uid: user.uid, accessLevel: 'full' }); // Default full for now or fetch from DB
        setIsAuthModalOpen(false);
      } else {
        setUserAuth({ isLoggedIn: false, email: null, uid: null, accessLevel: 'mindset_only' });
        // Reset to defaults on logout
        setCanvasData(initialCanvasData);
        setPersonasData(initialPersonasData);
        setMarketResearchData(initialMarketResearchData);
        setCopywritingData(initialCopywritingData);
        setMindsetData(initialMindsetData);
        setProductDesignData(initialProductDesignData);
        setEconomicsData(initialEconomicsData);
        setSalesData(initialSalesData);
        setGrowData(initialGrowData);
        setUserProfile(null);
        setIsDataLoaded(false);
        setActivePage(null); // Go to landing page
      }
    });
    return () => unsubscribe();
  }, []);

  // --- Real-time Data Sync (Load/Listen) ---
  useEffect(() => {
    if (!userAuth.uid) return;

    const workspaceId = userAuth.uid; // Simple 1:1 user-workspace for now
    const modulesRef = (moduleName: string) => doc(db, 'workspaces', workspaceId, 'modules', moduleName);

    const subs = [
      onSnapshot(modulesRef('canvas'), (doc) => {
        if (doc.exists()) {
          isRemoteUpdate.current['canvas'] = true;
          setCanvasData(doc.data() as CanvasData);
        }
      }),
      onSnapshot(modulesRef('personas'), (doc) => {
        if (doc.exists()) {
          isRemoteUpdate.current['personas'] = true;
          setPersonasData(doc.data().data as PersonasData);
        }
      }),
      onSnapshot(modulesRef('marketResearch'), (doc) => {
        if (doc.exists()) {
          isRemoteUpdate.current['marketResearch'] = true;
          setMarketResearchData(doc.data() as MarketResearchData);
        }
      }),
      onSnapshot(modulesRef('copywriting'), (doc) => {
        if (doc.exists()) {
          isRemoteUpdate.current['copywriting'] = true;
          setCopywritingData(doc.data() as CopywritingData);
        }
      }),
      onSnapshot(modulesRef('mindset'), (doc) => {
        if (doc.exists()) {
          isRemoteUpdate.current['mindset'] = true;
          setMindsetData(doc.data() as MindsetData);
        }
      }),
      onSnapshot(modulesRef('productDesign'), (doc) => {
        if (doc.exists()) {
          isRemoteUpdate.current['productDesign'] = true;
          setProductDesignData(doc.data() as ProductDesignData);
        }
      }),
      onSnapshot(modulesRef('economics'), (doc) => {
        if (doc.exists()) {
          isRemoteUpdate.current['economics'] = true;
          setEconomicsData(doc.data() as EconomicsData);
        }
      }),
      onSnapshot(modulesRef('sales'), (doc) => {
        if (doc.exists()) {
          isRemoteUpdate.current['sales'] = true;
          setSalesData(doc.data() as SalesData);
        }
      }),
      onSnapshot(modulesRef('grow'), (doc) => {
        if (doc.exists()) {
          isRemoteUpdate.current['grow'] = true;
          const data = doc.data() as GrowData;
          // Deep merge logic for grow data to ensure new structure keys exist if missing
          const mergedGrow = {
              legal: { ...initialGrowData.legal, ...(data.legal || {}) },
              investment: { ...initialGrowData.investment, ...(data.investment || {}) },
              management: { ...initialGrowData.management, ...(data.management || {}) },
              checklists: { ...initialGrowData.checklists, ...(data.checklists || {}) },
          };
          setGrowData(mergedGrow);
        }
      }),
      onSnapshot(doc(db, 'users', userAuth.uid), (doc) => {
          if (doc.exists()) {
              setUserProfile(doc.data() as UserProfile);
          } else {
              // Create default profile if not exists
              const defaultProfile: UserProfile = { name: auth.currentUser?.displayName || '', email: auth.currentUser?.email || '' };
              setUserProfile(defaultProfile);
              setDoc(doc.ref, defaultProfile, { merge: true });
          }
      })
    ];

    setIsDataLoaded(true);

    return () => {
      subs.forEach(unsub => unsub());
    };
  }, [userAuth.uid]);

  // --- Debounced Save Effects ---
  const useDebouncedSave = (key: string, data: any, delay: number = 1500) => {
    useEffect(() => {
      if (!userAuth.uid || !isDataLoaded) return;
      if (isRemoteUpdate.current[key]) {
        isRemoteUpdate.current[key] = false;
        return;
      }

      const handler = setTimeout(() => {
        const workspaceId = userAuth.uid!;
        const docRef = doc(db, 'workspaces', workspaceId, 'modules', key);
        // For array roots like PersonasData, we wrap in an object
        const payload = Array.isArray(data) ? { data: data } : data;
        setDoc(docRef, payload, { merge: true }).catch(console.error);
      }, delay);

      return () => clearTimeout(handler);
    }, [data, userAuth.uid, isDataLoaded]);
  };

  useDebouncedSave('canvas', canvasData);
  useDebouncedSave('personas', personasData); // Will be saved as { data: [...] }
  useDebouncedSave('marketResearch', marketResearchData);
  useDebouncedSave('copywriting', copywritingData);
  useDebouncedSave('mindset', mindsetData);
  useDebouncedSave('productDesign', productDesignData);
  useDebouncedSave('economics', economicsData);
  useDebouncedSave('sales', salesData);
  useDebouncedSave('grow', growData);

  const t = useCallback(getTranslator(currentLanguage), [currentLanguage]);

  const handleLogout = async () => {
    try {
        await signOut(auth);
    } catch(e) {
        console.error("Logout failed", e);
    }
  };

  const handleUnlockSuccess = () => {
    // This is less relevant with Firebase but can be used for upgrading role field in Firestore user doc
    setUserAuth(prev => ({ ...prev, accessLevel: 'full' }));
    setIsUserProfileModalOpen(false);
  };
  
  const handleUpdateUserProfile = (profile: UserProfile) => {
    if (userAuth.uid) {
      setUserProfile(profile);
      setDoc(doc(db, 'users', userAuth.uid), profile, { merge: true });
      setIsUserProfileModalOpen(false);
    }
  };

  const handleSelectPage = (page: Page | null, subPage: SubPage | null) => {
    if (!userAuth.isLoggedIn && page !== null) {
      setIsAuthModalOpen(true);
      return;
    }
    setActivePage(page);
    setActiveSubPage(subPage);
  };

  const renderContent = () => {
    if (activePage === null || (activePage !== null && activeSubPage === null)) {
      return <InfographicPage language={currentLanguage} t={t} onNavigate={handleSelectPage} />;
    }
    
    // Simple access check
    if (userAuth.isLoggedIn && userAuth.accessLevel !== 'full' && activePage !== Page.START) {
         return <LockedFeature onUnlockClick={() => setIsUserProfileModalOpen(true)} t={t} />;
    }
    
    if (!userAuth.isLoggedIn) {
      return <InfographicPage language={currentLanguage} t={t} onNavigate={handleSelectPage} />;
    }

    switch (activePage) {
      case Page.START:
        switch(activeSubPage) {
          case SubPage.MINDSET: return <MindsetPage initialData={mindsetData} onUpdateData={setMindsetData} language={currentLanguage} t={t} userProfile={userProfile} />;
          case SubPage.STRATEGY: return <StrategyPage canvasData={canvasData} onSaveCanvasSection={(section, content) => setCanvasData(prev => ({...prev, [section]: content}))} onMassUpdateCanvas={(newData) => setCanvasData(prev => ({...prev, ...newData}))} personasData={personasData} onUpdatePersonasData={setPersonasData} language={currentLanguage} t={t} userProfile={userProfile} />;
          case SubPage.RESEARCH: return <MarketResearchAccelerator initialData={marketResearchData} onUpdateData={setMarketResearchData} strategyData={canvasData} language={currentLanguage} t={t} userProfile={userProfile} />;
          case SubPage.COPYWRITING: return <CopywritingPage initialData={copywritingData} onUpdateData={setCopywritingData} strategyData={canvasData} researchData={marketResearchData} personasData={personasData} language={currentLanguage} t={t} userProfile={userProfile} />;
          default: return <InfographicPage language={currentLanguage} t={t} onNavigate={handleSelectPage} />;
        }
      case Page.BUILD:
        switch(activeSubPage) {
          case SubPage.PRODUCT_DESIGN: return <ProductDesignPage initialData={productDesignData} onUpdateData={setProductDesignData} canvasData={canvasData} language={currentLanguage} t={t} userProfile={userProfile} />;
          case SubPage.ECONOMICS: return <EconomicsPage initialData={economicsData} onUpdateData={setEconomicsData} language={currentLanguage} t={t} userProfile={userProfile} />;
          case SubPage.SALES: return <SalesPage initialData={salesData} onUpdateData={setSalesData} canvasData={canvasData} personasData={personasData} researchData={marketResearchData} language={currentLanguage} t={t} userProfile={userProfile} />;
          default: return <InfographicPage language={currentLanguage} t={t} onNavigate={handleSelectPage} />;
        }
      case Page.GROW:
        switch(activeSubPage) {
          case SubPage.LEGAL: return <LegalPage initialData={growData.legal} onUpdateData={d => setGrowData(p => ({...p, legal: d}))} language={currentLanguage} t={t} userProfile={userProfile} />;
          case SubPage.INVESTMENT: return <InvestmentPage initialData={growData.investment} onUpdateData={d => setGrowData(p => ({...p, investment: d}))} language={currentLanguage} t={t} userProfile={userProfile} />;
          case SubPage.MANAGEMENT: return <ManagementPage initialData={growData.management} onUpdateData={d => setGrowData(p => ({...p, management: d}))} language={currentLanguage} t={t} userProfile={userProfile} />;
          case SubPage.CHECKLISTS: return <ChecklistsPage initialData={growData.checklists} onUpdateData={d => setGrowData(p => ({...p, checklists: d}))} language={currentLanguage} t={t} userProfile={userProfile} />;
          default: return <InfographicPage language={currentLanguage} t={t} onNavigate={handleSelectPage} />;
        }
      default:
        return <InfographicPage language={currentLanguage} t={t} onNavigate={handleSelectPage} />;
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
        isLoggedIn={userAuth.isLoggedIn}
        accessLevel={userAuth.accessLevel}
        onLogout={handleLogout}
      />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
          {renderContent()}
      </main>
      
      {isAuthModalOpen && (
        <AuthPage 
            isOpen={isAuthModalOpen} 
            onClose={() => setIsAuthModalOpen(false)} 
            onLoginSuccess={() => setIsAuthModalOpen(false)} // Handled by auth listener
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
          accessLevel={userAuth.accessLevel}
          onUnlockSuccess={handleUnlockSuccess}
        />
      )}
    </>
  );
};

export default App;