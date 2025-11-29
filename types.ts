
// This file contains all the core type definitions for the application.

export type Language = 'en' | 'am';

// --- ENUMS for Navigation and Sections ---

export enum Page {
  START = 'Start',
  BUILD = 'Build',
  GROW = 'Grow',
  FEATURES = 'Features',
  TOOLS = 'Tools',
  ROADMAP = 'Roadmap',
  STARTUPS = 'Startups',
  PRIVACY = 'Privacy',
  TERMS = 'Terms',
  SECURITY = 'Security',
  HELP_CENTER = 'Help Center',
  COMMUNITY = 'Community',
  DOCUMENTATION = 'Documentation',
  TEMPLATES = 'Templates',
  ABOUT = 'About',
  BLOG = 'Blog',
  CAREERS = 'Careers',
  CONTACT = 'Contact',
}

export enum SubPage {
  MINDSET = 'Mindset',
  STRATEGY = 'Strategy',
  RESEARCH = 'Research',
  COPYWRITING = 'Copywriting',
  PRODUCT_DESIGN = 'Product Design',
  ECONOMICS = 'Economics',
  SALES = 'Sales',
  LEGAL = 'Legal',
  INVESTMENT = 'Investment',
  MANAGEMENT = 'Management',
  CHECKLISTS = 'Checklists',
}

export enum StrategySubSection {
    BUSINESS_CANVAS = 'Business Canvas',
    PERSONAS = 'Personas'
}

export enum CanvasSection {
    PROJECT_OVERVIEW = "Project Overview",
    PRODUCT_VISION = "Product Vision",
    NORTH_STAR_METRIC = "North Star Metric",
    PRODUCT_WHY = "Product Why",
    PROBLEM = "Problem",
    SOLUTION = "Solution",
    PRODUCT_DETAIL = "Product Detail",
    MARKET = "Market",
    USE_CASES = "Use Cases",
    UNIQUE_VALUE_PROPOSITION = "Unique Value Proposition",
    UNFAIR_ADVANTAGE = "Unfair Advantage",
    BUSINESS_MODEL = "Business Model",
    PRICING = "Pricing",
    COMPETITORS = "Competitors",
    UNIT_ECONOMICS = "Unit Economics",
    BRAND_STYLE_GUIDES = "Brand & Style Guides",
    PRODUCT_MARKET_FIT = "Product - Market Fit",
}

export const ALL_CANVAS_SECTIONS: CanvasSection[] = Object.values(CanvasSection);

export enum ResearchSection {
    QUESTIONS = "Questions & Responses",
    GENERAL_NOTES_IMPORT = "General Notes / Import",
    COMPETITOR_ANALYSIS = "Competitor Analysis",
    TRENDS = "Industry Trends",
    AI_SUMMARY = "AI Summary",
}

export enum CopywritingSubSection {
  MARKETING_STRATEGY = "Marketing Strategy",
  MARKETING = "Marketing Content & Plans",
  PITCH_REFINEMENT = "Pitch Refinement",
  ONE_PAGER_SUMMARY = "Investor One-Pager",
  LANDING_PAGE_BUILDER = "Landing Page Builder",
}

export enum MindsetSubSection {
  ENTREPRENEURIAL_ASSESSMENT = "Entrepreneurial Assessment",
  PROFILE_REPORT = "Profile Report",
  GOAL_SETTING = "Goal Setting",
}

export enum ProductDesignSubSection {
    BRAINSTORM_BOARD = "Brainstorm Board",
    PRODUCT_PLANNING = "Product Planning",
    ACTION_BOARD = "Action Board",
    FEEDBACK_AGGREGATOR = "Feedback Aggregator",
}

export enum EconomicsSubSection {
    COST_REVENUE = "Cost & Revenue",
    UNIT_ECONOMICS = "Unit Economics Calculator",
    BURN_RATE = "Burn Rate Forecaster",
    FINANCIAL_PROJECTION = "Financial Projection Generator",
}

export enum SalesSubSection {
    GO_TO_MARKET = 'Go-to-Market Architect',
    CRM_PIPELINE = 'CRM Pipeline',
}

export enum GrowSection {
    LEGAL = 'Legal',
    INVESTMENT = 'Investment',
    MANAGEMENT = 'Management',
    CHECKLISTS = 'Checklists',
}

export enum LegalTool {
    DOCUMENT_AUTOMATION = 'Legal Document Automation',
    COMPLIANCE_MANAGEMENT = 'Compliance Management',
}

export enum InvestmentTool {
    CAP_TABLE_MANAGEMENT = 'Cap Table Management',
    INVESTOR_RELATIONS_CRM = 'Investor Relations CRM',
}

export enum ManagementTool {
    SUPPLY_CHAIN = 'Supply Chain Management',
    QUALITY_MANAGEMENT = 'Quality Management System',
    CUSTOMER_SERVICE = 'Customer Service Platform',
}

export enum ChecklistTool {
    RELEASE_LIST = 'Release List',
    GROWTH_LIST = 'Growth List',
}

// --- Data Structures ---

export type CanvasData = {
  [key in CanvasSection]: string;
};

// ... Personas ...
export type Gender = 'Male' | 'Female' | 'Other' | '';
export type MaritalStatus = 'Single' | 'Married' | 'In a relationship' | 'Divorced' | 'Widowed' | '';
export type Education = "Bachelor's Degree" | "Master's Degree" | "PhD" | "High School" | "Other" | '';

export interface JobToBeDone {
    id: string;
    title: string;
    situation: string;
    motivation: string;
    outcome: string;
    emotionalJob: string;
    socialJob: string;
}
export interface Persona {
    id: string;
    icon: string;
    name: string;
    profession: string;
    gender: Gender;
    age: number | '';
    location: string;
    maritalStatus: MaritalStatus;
    education: Education;
    bio: string;
    personality: {
        analyticalCreative: number;
        busyTimeRich: number;
        messyOrganized: number;
        independentTeamPlayer: number;
    };
    traits: {
        buyingAuthority: number;
        technical: number;
        socialMedia: number;
        selfHelping: number;
    };
    goals: string;
    likes: string;
    dislikes: string;
    frustrations: string;
    skills: string;
    jobsToBeDone: JobToBeDone[];
}
export type PersonasData = Persona[];

// ... Market Research ...
export interface ResearchQuestionItem {
    id: string;
    text: string;
    responses: { id: string; text: string }[];
}
export interface ResearchQuestionnaireSet {
    id: string;
    name: string;
    researchGoal: string;
    targetAudience: string;
    questions: ResearchQuestionItem[];
}
export interface CompetitorProfile {
    id: string;
    name: string;
    pricingStrategy: string;
    keyFeatures: string;
    strengths: string;
    weaknesses: string;
    marketGapsAddressed: string;
    notes: string;
}
export interface TrendEntry {
    id: string;
    title: string;
    description: string;
    sourceEvidence: string;
    timeframe: string;
    locationMarket: string;
    potentialImpact: string;
    notes: string;
}
export type MarketResearchData = {
    [ResearchSection.QUESTIONS]: ResearchQuestionnaireSet[];
    [ResearchSection.GENERAL_NOTES_IMPORT]: string;
    [ResearchSection.COMPETITOR_ANALYSIS]: CompetitorProfile[];
    [ResearchSection.TRENDS]: TrendEntry[];
    [ResearchSection.AI_SUMMARY]: string;
};

// ... Copywriting ...
export type MarketingPostStatus = 'todo' | 'in-progress' | 'done';
export interface MarketingPost {
    id: string;
    title: string;
    content: string;
    platform: string;
    scheduledDate: string; // ISO format
    visualRecommendation: string;
    notes: string;
    status: MarketingPostStatus;
}
export type PitchType = 'investor_pitch' | 'sales_pitch' | 'email_campaign';
export interface Pitch {
    id: string;
    type: PitchType;
    title: string;
    targetAudience: string;
    keyMessage: string;
    content: string;
    notes?: string;
}
export interface OnePagerData {
  traction: string;
  team: string;
  ask: string;
  generatedBlurb: string;
}
export interface MarketingStrategy {
    id: string;
    title: string;
    objectives: string;
    tacticsAndChannels: string;
    contentStrategy: string;
    timeline: string;
    estimatedRoi: string;
    budgetAllocation: string;
    trackingMethods: string;
    isAiGenerated: boolean;
    createdAt: string;
}
export interface CopywritingData {
    marketingStrategies: MarketingStrategy[];
    marketingPosts: MarketingPost[];
    pitches: Pitch[];
    onePager: OnePagerData;
    landingPageHtml: string;
}

// ... Mindset ...
export type AssessmentCategory = 'personality' | 'businessAcumen' | 'startupKnowledge';
export type AssessmentStatus = 'not-started' | 'in-progress' | 'completed';
export type AssessmentAnswers = Record<AssessmentCategory, Record<string, string | number>>;
export interface AssessmentScores {
    riskTolerance: number; leadership: number; adaptability: number;
    marketInsight: number; financialLiteracy: number; strategicThinking: number;
    resilience: number; creativity: number; salesAbility: number; technicalSkills: number;
}
export interface FounderProfileReportData {
    founderTypeTitle: string;
    founderTypeDescription: string;
    scores: AssessmentScores;
    cofounderPersonaSuggestion: string;
    keyTakeaways: string[];
    generatedDate: string;
    language: Language;
}
export type GoalTimeframe = '6-month' | '2-year' | '5-year' | '10-year';
export interface GoalDetail { self: string; family: string; world: string; }
export type GoalSettingData = Record<GoalTimeframe, GoalDetail>;
export interface MindsetData {
  assessmentAnswers: AssessmentAnswers;
  assessmentStatus: Record<AssessmentCategory, AssessmentStatus>;
  profileReport: FounderProfileReportData | null;
  goals: GoalSettingData;
  goalsFirstSetDate?: string | null;
  shouldAutoGenerateReport: boolean;
  goalSettingAiChatHistory: { role: 'user' | 'model'; parts: {text: string}[] }[];
}

// ... Product Design ...
export interface BrainstormIdea { id: string; content: string; color: string; }
export type FeaturePriority = 'low' | 'medium' | 'high' | 'critical';
export interface FeatureVersion { id: string; versionNumber: number; description: string; problemSolved: string; feedbackNotes: string; createdAt: string; }
export interface ProductFeature { id: string; name: string; priority: FeaturePriority; createdAt: string; versions: FeatureVersion[]; }
export enum ActionBoardStatus { IDEA = 'idea', DESIGN = 'design', BUILD = 'build', DEPLOY = 'deploy' }
export interface ActionItem { id: string; title: string; description: string; status: ActionBoardStatus; featureId: string | null; createdAt: string; dueDate: string | null; completedAt: string | null; }
export type FeedbackSource = 'app_store' | 'survey' | 'social_media' | 'manual' | 'ai_bulk_import';
export type FeedbackUrgency = 'low' | 'medium' | 'high';
export interface FeedbackItem { id: string; content: string; source: FeedbackSource; urgency: FeedbackUrgency; featureId: string | null; createdAt: string; }
export interface ProductDesignData {
    brainstormIdeas: BrainstormIdea[];
    features: ProductFeature[];
    actionItems: ActionItem[];
    feedbackItems: FeedbackItem[];
}

// ... Economics ...
export enum CostCategory { OPERATIONAL = "Operational", MARKETING = "Marketing", PERSONNEL = "Personnel", RD = "R&D", OTHER = "Other" }
export enum RevenueCategory { PRODUCT_SALES = "Product Sales", SERVICE_FEES = "Service Fees", SUBSCRIPTIONS = "Subscriptions", OTHER = "Other Revenue" }
export interface FinancialItem { id: string; name: string; amount: number; date: string; type: 'one_time' | 'recurring'; details: string; }
export interface CostItem extends FinancialItem { category: CostCategory; }
export interface RevenueItem extends FinancialItem { category: RevenueCategory; }
export interface UnitEconomicsData { avgRevenue: string | number; cogs: string | number; cac: string | number; customerLifetime: string | number; }
export interface BurnRateData { startingCapital: string | number; additionalHiringSpend: string | number; additionalMarketingSpend: string | number; }
export interface ProjectionProduct { id: string; name: string; price: string | number; cost: string | number; initialSales: string | number; }
export interface FinancialProjectionResultMonth { month: number; revenue: number; cogs: number; grossProfit: number; otherExpenses: number; netProfit: number; endingBalance: number; }
export interface FinancialProjectionInputs { startingCapital: string | number; products: ProjectionProduct[]; salesGrowthRate: string | number; monthlyRevenue: string | number; monthlyExpenses: string | number; }
export interface FinancialProjection { inputs: FinancialProjectionInputs; result: FinancialProjectionResultMonth[] | null; }
export interface EconomicsData { costs: CostItem[]; revenues: RevenueItem[]; unitEconomics: UnitEconomicsData; burnRate: BurnRateData; financialProjection: FinancialProjection; }

// ... Sales ...
export type ActivityStatus = 'todo' | 'in_progress' | 'done';
export interface Activity { id: string; name: string; status: ActivityStatus; }
export interface LaunchPhase { id: string; name: string; activities: Activity[]; }
export type CrmStage = 'prospects' | 'negotiation' | 'closed' | 'lost';
export interface CrmLead { id: string; name: string; email?: string; phone?: string; details?: string; stage: CrmStage; createdAt: string; needsAnalysis?: string; valueProposition?: string; comments?: string; }
export interface SalesData { launchSequence: LaunchPhase[]; crmLeads: CrmLead[]; }

// ... Grow ...
export type LegalDocumentType = 'nda' | 'service-agreement' | 'employment-contract';
export interface LegalDocument { id: string; type: LegalDocumentType; name: string; content: string; createdAt: string; }
export type ComplianceStatus = 'pending' | 'in_progress' | 'completed';
export interface ComplianceItem { id: string; name: string; status: ComplianceStatus; notes: string; }
export type ShareType = 'Common' | 'Preferred' | 'Options';
export interface CapTableEntry { id: string; stakeholder: string; shareCount: number; shareType: ShareType; }
export type InvestorStage = 'initial' | 'contacted' | 'meeting' | 'due_diligence' | 'closed' | 'passed';
export interface InvestorCrmEntry { id: string; name: string; contact: string; stage: InvestorStage; lastContacted: string; notes: string; }
export interface InventoryItem { id: string; name: string; sku: string; quantity: number; location: string; }
export interface QmsItem { id: string; name: string; category: 'Process' | 'Policy' | 'Record'; status: 'draft' | 'review' | 'approved'; version: string; }
export interface SupportTicket { id: string; subject: string; customer: string; status: 'open' | 'in_progress' | 'closed'; priority: 'low' | 'medium' | 'high'; createdAt: string; }
export interface ChecklistItem { id: string; text?: string; textKey?: TranslationKey; completed: boolean; }
export interface ChecklistCard { id: string; title?: string; titleKey?: TranslationKey; items: ChecklistItem[]; }
export interface ChecklistTab { id: string; titleKey: TranslationKey; cards: ChecklistCard[]; }
export interface GrowData {
    legal: { documents: LegalDocument[]; complianceItems: ComplianceItem[]; };
    investment: { capTable: CapTableEntry[]; investorCrm: InvestorCrmEntry[]; };
    management: { inventory: InventoryItem[]; qmsItems: QmsItem[]; supportTickets: SupportTicket[]; };
    checklists: { releaseList: ChecklistTab[]; growthList: ChecklistTab[]; }
}

// --- Help & UI Structures ---
export interface NavItem { label: Page; subItems: SubPage[]; }
export interface SectionHelp {
    title: string | SubPage;
    sidebarTitle: { [key in Language]: TranslationKey };
    explanationKey: TranslationKey;
}
export interface CanvasSectionHelp { title: CanvasSection; sidebarTitle: { [key in Language]: TranslationKey }; explanation: { [key in Language]: string }; example: { [key in Language]: string }; }
export interface ResearchSectionHelp { title: ResearchSection; sidebarTitle: { [key in Language]: TranslationKey }; explanation: { [key in Language]: string }; }
export interface CopywritingSectionHelp { title: CopywritingSubSection; sidebarTitle: { [key in Language]: TranslationKey }; explanation: { [key in Language]: string }; }
export type MindsetSectionHelp = SectionHelp & { title: MindsetSubSection };
export type ProductDesignSectionHelp = SectionHelp & { title: ProductDesignSubSection };
export type EconomicsSectionHelp = SectionHelp & { title: EconomicsSubSection };
export type SalesSectionHelp = SectionHelp & { title: SalesSubSection };
export type StrategySectionHelp = SectionHelp & { title: StrategySubSection };
export interface GrowSectionHelpTool { tool: LegalTool | InvestmentTool | ManagementTool | ChecklistTool; explanationKey: TranslationKey; }
export interface GrowSectionHelp extends Omit<SectionHelp, 'explanationKey'> { title: GrowSection; explanationKey: TranslationKey; tools: GrowSectionHelpTool[]; }

// --- User & Auth ---
export interface UserProfile { name: string; email?: string; phone?: string; otherDetails?: string; photo?: string | null; }
export interface UserAuthData {
    email: string;
    name: string;
    password; // Insecure, but for this exercise
    accessLevel: 'full' | 'mindset_only';
}

// --- Other ---
export interface AssessmentQuestion { id: string; textKey: TranslationKey; type: 'multiple-choice-scale' | 'multiple-choice-options' | 'scenario-options'; category: AssessmentCategory; scaleMin?: number; scaleMax?: number; options?: { value: string; labelKey: TranslationKey; }[]; }
export interface Partner { id: string; name: string; logoUrl: string; description: string; website: string; }
export interface Trainer { id: string; name: string; photoUrl: string; specialty: string; bio: string; }
export interface Testimonial { id: string; authorName: string; authorTitle: string; photoUrl: string; quote: string; }

// --- Translation Keys ---
export type TranslationKey =
  | Page | SubPage | CanvasSection | ResearchSection | CopywritingSubSection | MindsetSubSection
  | ProductDesignSubSection | EconomicsSubSection | SalesSubSection | StrategySubSection | GrowSection
  | LegalTool | InvestmentTool | ManagementTool | ChecklistTool | CostCategory | RevenueCategory
  | string;
