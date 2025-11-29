import { Page, SubPage, NavItem, CanvasSection, CanvasSectionHelp, ResearchSection, ResearchSectionHelp, Language, ALL_CANVAS_SECTIONS, CopywritingSubSection, CopywritingSectionHelp, MindsetSubSection, MindsetSectionHelp, TranslationKey, AssessmentQuestion, Partner, Trainer, Testimonial, ProductDesignSubSection, ProductDesignSectionHelp, EconomicsSubSection, EconomicsSectionHelp, SalesSubSection, SalesSectionHelp, StrategySubSection, StrategySectionHelp, GrowSection, GrowSectionHelp, LegalTool, InvestmentTool, ManagementTool, ChecklistTool, ChecklistTab, ChecklistCard, ChecklistItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  {
    label: Page.START,
    subItems: [SubPage.MINDSET, SubPage.STRATEGY, SubPage.RESEARCH, SubPage.COPYWRITING],
  },
  {
    label: Page.BUILD,
    subItems: [SubPage.PRODUCT_DESIGN, SubPage.ECONOMICS, SubPage.SALES],
  },
  {
    label: Page.GROW,
    subItems: [SubPage.LEGAL, SubPage.INVESTMENT, SubPage.MANAGEMENT, SubPage.CHECKLISTS],
  },
];

export const API_KEY_WARNING = "API key is not set. AI features will be disabled.";
export const GENERIC_ERROR_MESSAGE = "An unexpected error occurred. Please try again later.";


export const STRATEGY_SECTIONS_HELP: StrategySectionHelp[] = [
  {
    title: StrategySubSection.BUSINESS_CANVAS,
    sidebarTitle: { en: StrategySubSection.BUSINESS_CANVAS, am: StrategySubSection.BUSINESS_CANVAS },
    explanationKey: 'canvas_explanation'
  },
  {
    title: StrategySubSection.PERSONAS,
    sidebarTitle: { en: StrategySubSection.PERSONAS, am: StrategySubSection.PERSONAS },
    explanationKey: 'personas_explanation'
  }
];


export const CANVAS_SECTIONS_HELP: CanvasSectionHelp[] = ALL_CANVAS_SECTIONS.map(section => ({
  title: section,
  sidebarTitle: { en: section, am: section },
  explanation: { en: `Explanation for ${section}`, am: `ማብራሪያ ለ ${section}` },
  example: { en: `Example for ${section}`, am: `ምሳሌ ለ ${section}` }
}));


export const COPYWRITING_SECTIONS_HELP: CopywritingSectionHelp[] = [
  {
    title: CopywritingSubSection.MARKETING_STRATEGY,
    sidebarTitle: { en: 'sidebar_copywriting_strategy', am: 'sidebar_copywriting_strategy' },
    explanation: {
      en: 'Develop a high-level marketing strategy. Define your goals, target audience, budget, and KPIs.',
      am: 'ከፍተኛ ደረጃ የግብይት ስትራቴጂ ያዳብሩ። ግቦችዎን፣ ዒላማ ታዳሚዎችዎን፣ በጀትዎን እና KPIs ይግለጹ።'
    }
  },
  {
    title: CopywritingSubSection.MARKETING,
    sidebarTitle: { en: 'sidebar_copywriting_marketing', am: 'sidebar_copywriting_marketing' },
    explanation: {
      en: 'Plan and create content for your marketing channels. Use the calendar to schedule posts and campaigns.',
      am: 'ለግብይት ሰርጦችዎ ይዘት ያቅዱ እና ይፍጠሩ። ልጥፎችን እና ዘመቻዎችን መርሐግብር ለማስያዝ የቀን መቁጠሪያውን ይጠቀሙ።'
    }
  },
  {
    title: CopywritingSubSection.PITCH_REFINEMENT,
    sidebarTitle: { en: 'sidebar_copywriting_pitch', am: 'sidebar_copywriting_pitch' },
    explanation: {
      en: 'Craft and refine pitches for different audiences, such as investors, customers, or partners.',
      am: 'እንደ ኢንቨስተሮች፣ ደንበኞች ወይም አጋሮች ላሉ የተለያዩ ታዳሚዎች የንግድ ሃሳብ ማቅረቢያዎችን ይስሩ እና ያሻሽሉ።'
    }
  },
  {
    title: CopywritingSubSection.ONE_PAGER_SUMMARY,
    sidebarTitle: { en: 'sidebar_copywriting_onepager', am: 'sidebar_copywriting_onepager' },
    explanation: {
      en: 'Create a concise one-page summary of your business for investors and stakeholders.',
      am: 'ለባለሀብቶች እና ባለድርሻ አካላት የንግድዎን አጭር የአንድ ገጽ ማጠቃለያ ይፍጠሩ።'
    }
  },
  {
    title: CopywritingSubSection.LANDING_PAGE_BUILDER,
    sidebarTitle: { en: 'sidebar_copywriting_landing_page', am: 'sidebar_copywriting_landing_page' },
    explanation: {
      en: 'Use AI to instantly generate a complete, single-file HTML landing page for your business based on your Business Launch Canvas data. You can copy the code or download it as an .html file.',
      am: 'በቢዝነስ ማስጀመሪያ ሸራ መረጃዎ ላይ በመመስረት ለንግድዎ የተሟላ፣ ባለአንድ-ፋይል HTML ላንዲንግ ገጽ በፍጥነት ለማመንጨት AI ይጠቀሙ። ኮዱን መቅዳት ወይም እንደ .html ፋይል ማውረድ ይችላሉ።'
    }
  }
];

export const PARTNERS_DATA: Partner[] = [
  { id: 'p1', name: 'Gebeya Inc.', logoUrl: 'https://gebeya.com/wp-content/uploads/2022/02/logo-1.svg', description: 'The Pan-African source for vetted tech talent.', website: 'https://gebeya.com' },
  { id: 'p2', name: 'Orbit Innovation Hub', logoUrl: 'https://orbitinnovationhub.com/images/logo/logo.png', description: 'A technology and innovation center in Addis Ababa.', website: 'https://orbitinnovationhub.com' },
  { id: 'p3', name: 'iceaddis', logoUrl: 'https://iceaddis.com/wp-content/uploads/2020/06/iceaddis-logo.svg', description: 'Ethiopia’s first innovation hub and tech startup incubator.', website: 'https://iceaddis.com/' },
  { id: 'p4', name: 'blueMoon', logoUrl: 'https://www.bluemoonethiopia.com/images/bluemoonlogo.png', description: 'Ethiopia\'s leading youth agribusiness incubator and seed investor.', website: 'https://www.bluemoonethiopia.com/' }
];

export const TRAINERS_DATA: Trainer[] = [
  { id: 't1', name: 'Solomon T.', photoUrl: 'https://avatars.githubusercontent.com/u/10899852?v=4', specialty: 'Product & Tech', bio: 'Experienced product manager and software engineer focusing on building scalable solutions for emerging markets.' },
  { id: 't2', name: 'John A.', photoUrl: 'https://media.licdn.com/dms/image/C4D03AQGLd1zUo4v3JQ/profile-displayphoto-shrink_800_800/0/1578423235282?e=1727308800&v=beta&t=k6h-T1f-N04s7wP6bI5t2qI9o5u4oX_j8f4vY9j8Z7w', specialty: 'Marketing & Sales', bio: 'Growth hacker with a track record of scaling startups from 0 to 1 million users. Expert in digital marketing and sales funnel optimization.' },
  { id: 't3', name: 'Liya K.', photoUrl: 'https://media.licdn.com/dms/image/D4E03AQGg8o8c5k8c8Q/profile-displayphoto-shrink_800_800/0/1689083324128?e=1727308800&v=beta&t=4g8wI4k8z8j9x7sX2v9h7f5s_N9wX9j5k4l3K0i_l4I', specialty: 'Finance & Investment', bio: 'Former venture capitalist and CFO. Specializes in financial modeling, fundraising strategy, and investment readiness.' }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  { id: 'test1', authorName: 'Abebe G.', authorTitle: 'Founder, Sheba Fresh', photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg', quote: 'The Business Canvas tool was a game-changer for us. It forced us to think critically about every aspect of our model and identify weaknesses we hadn\'t seen.' },
  { id: 'test2', authorName: 'Fatuma H.', authorTitle: 'CEO, Kafa Coffee Tech', photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg', quote: 'The Market Research module saved us weeks of work. The AI-generated questions were incredibly insightful and helped us truly understand our customers in Addis.' },
  // FIX: Changed 'name' property to 'authorName' to match the Testimonial type.
  { id: 'test3', authorName: 'Yared M.', authorTitle: 'CTO, Tana Deliveries', photoUrl: 'https://randomuser.me/api/portraits/men/36.jpg', quote: 'As a technical founder, the Mindset assessment was surprisingly valuable. It highlighted my strengths and showed me the kind of co-founder I needed to succeed.' },
  { id: 'test4', authorName: 'Tigist B.', authorTitle: 'Co-founder, Injera Labs', photoUrl: 'https://randomuser.me/api/portraits/women/50.jpg', quote: 'CapKit provided the structure and tools we needed to go from a simple idea to a fundable business plan. The platform is an essential co-pilot for any Ethiopian entrepreneur.' }
];

export const RESEARCH_SECTIONS_HELP: ResearchSectionHelp[] = [
  { title: ResearchSection.QUESTIONS, sidebarTitle: { en: 'sidebar_research_qa', am: 'sidebar_research_qa' }, explanation: { en: "Define your research goals and generate targeted questions for customer interviews, surveys, and focus groups. Use the AI to suggest questions based on your strategy.", am: "የምርምር ግቦችዎን ይግለጹ እና ለደንበኛ ቃለመጠይቆች፣ ዳሰሳ ጥናቶች እና የትኩረት ቡድኖች የታለሙ ጥያቄዎችን ይፍጠሩ። በእርስዎ ስትራቴጂ ላይ በመመስረት ጥያቄዎችን እንዲጠቁም AI ይጠቀሙ።" } },
  { title: ResearchSection.GENERAL_NOTES_IMPORT, sidebarTitle: { en: 'sidebar_research_notes', am: 'sidebar_research_notes' }, explanation: { en: "A scratchpad for all your unstructured thoughts, interview transcripts, and observations. You can also import data from CSV files like Google Forms responses.", am: "ያልተደራጁ ሀሳቦችዎን፣ የቃለመጠይቅ ቅጂዎችዎን እና ምልከታዎችዎን ለመመዝገብ የሚያገለግል ቦታ። እንደ Google Forms ካሉ የ CSV ፋይሎች መረጃ ማስገባትም ይችላሉ።" } },
  { title: ResearchSection.COMPETITOR_ANALYSIS, sidebarTitle: { en: 'sidebar_research_competitors', am: 'sidebar_research_competitors' }, explanation: { en: "Profile your direct and indirect competitors. Analyze their pricing, features, strengths, and weaknesses to identify opportunities and market gaps.", am: "ቀጥተኛ እና ቀጥተኛ ያልሆኑ ተወዳዳሪዎችዎን ይግለጹ። እድሎችን እና የገበያ ክፍተቶችን ለመለየት ዋጋቸውን፣ ባህሪያቸውን፣ ጥንካሬዎቻቸውን እና ድክመቶቻቸውን ይተንትኑ።" } },
  { title: ResearchSection.TRENDS, sidebarTitle: { en: 'sidebar_research_trends', am: 'sidebar_research_trends' }, explanation: { en: "Track key industry, technological, and cultural trends that could impact your business. Document their potential impact and source.", am: "ንግድዎን ሊነኩ የሚችሉ ቁልፍ የኢንዱስትሪ፣ የቴክኖሎጂ እና የባህል አዝማሚያዎችን ይከታተሉ። ያላቸውን ተጽዕኖ እና ምንጭ ይመዝግቡ።" } },
  { title: ResearchSection.AI_SUMMARY, sidebarTitle: { en: 'sidebar_research_ai_summary', am: 'sidebar_research_ai_summary' }, explanation: { en: "After gathering data in the other sections, use the AI to synthesize everything into a cohesive summary. It will highlight key insights, risks, and opportunities.", am: "በሌሎች ክፍሎች ውስጥ መረጃ ከሰበሰቡ በኋላ፣ ሁሉንም ነገር ወደ አንድ ወጥ ማጠቃለያ ለማዋሃድ AI ይጠቀሙ። ቁልፍ ግንዛቤዎችን፣ ስጋቶችን እና እድሎችን ያጎላል።" } },
];

export const MINDSET_SECTIONS_HELP: MindsetSectionHelp[] = [
  { title: MindsetSubSection.ENTREPRENEURIAL_ASSESSMENT, sidebarTitle: { en: MindsetSubSection.ENTREPRENEURIAL_ASSESSMENT, am: MindsetSubSection.ENTREPRENEURIAL_ASSESSMENT }, explanationKey: 'mindset_assessment_explanation' },
  { title: MindsetSubSection.PROFILE_REPORT, sidebarTitle: { en: MindsetSubSection.PROFILE_REPORT, am: MindsetSubSection.PROFILE_REPORT }, explanationKey: 'mindset_profile_report_explanation' },
  { title: MindsetSubSection.GOAL_SETTING, sidebarTitle: { en: MindsetSubSection.GOAL_SETTING, am: MindsetSubSection.GOAL_SETTING }, explanationKey: 'mindset_goal_setting_explanation' },
];

export const PRODUCT_DESIGN_SECTIONS_HELP: ProductDesignSectionHelp[] = [
  { title: ProductDesignSubSection.BRAINSTORM_BOARD, sidebarTitle: { en: ProductDesignSubSection.BRAINSTORM_BOARD, am: ProductDesignSubSection.BRAINSTORM_BOARD }, explanationKey: 'brainstorm_board_explanation' },
  { title: ProductDesignSubSection.PRODUCT_PLANNING, sidebarTitle: { en: ProductDesignSubSection.PRODUCT_PLANNING, am: ProductDesignSubSection.PRODUCT_PLANNING }, explanationKey: 'product_planning_explanation' },
  { title: ProductDesignSubSection.ACTION_BOARD, sidebarTitle: { en: ProductDesignSubSection.ACTION_BOARD, am: ProductDesignSubSection.ACTION_BOARD }, explanationKey: 'action_board_explanation' },
  { title: ProductDesignSubSection.FEEDBACK_AGGREGATOR, sidebarTitle: { en: ProductDesignSubSection.FEEDBACK_AGGREGATOR, am: ProductDesignSubSection.FEEDBACK_AGGREGATOR }, explanationKey: 'feedback_aggregator_explanation' },
];

export const ECONOMICS_SECTIONS_HELP: EconomicsSectionHelp[] = [
  { title: EconomicsSubSection.COST_REVENUE, sidebarTitle: { en: EconomicsSubSection.COST_REVENUE, am: EconomicsSubSection.COST_REVENUE }, explanationKey: 'cost_revenue_explanation' },
  { title: EconomicsSubSection.UNIT_ECONOMICS, sidebarTitle: { en: EconomicsSubSection.UNIT_ECONOMICS, am: EconomicsSubSection.UNIT_ECONOMICS }, explanationKey: 'unit_economics_explanation' },
  { title: EconomicsSubSection.BURN_RATE, sidebarTitle: { en: EconomicsSubSection.BURN_RATE, am: EconomicsSubSection.BURN_RATE }, explanationKey: 'burn_rate_explanation' },
  { title: EconomicsSubSection.FINANCIAL_PROJECTION, sidebarTitle: { en: EconomicsSubSection.FINANCIAL_PROJECTION, am: EconomicsSubSection.FINANCIAL_PROJECTION }, explanationKey: 'financial_projection_explanation' },
];

export const SALES_SECTIONS_HELP: SalesSectionHelp[] = [
  { title: SalesSubSection.GO_TO_MARKET, sidebarTitle: { en: SalesSubSection.GO_TO_MARKET, am: SalesSubSection.GO_TO_MARKET }, explanationKey: 'goto_market_explanation' },
  { title: SalesSubSection.CRM_PIPELINE, sidebarTitle: { en: SalesSubSection.CRM_PIPELINE, am: SalesSubSection.CRM_PIPELINE }, explanationKey: 'crm_pipeline_explanation' },
];

export const GROW_SECTIONS_HELP: GrowSectionHelp[] = [
  {
    title: GrowSection.LEGAL, sidebarTitle: { en: GrowSection.LEGAL, am: GrowSection.LEGAL }, explanationKey: 'grow_legal_explanation', tools: [
      { tool: LegalTool.DOCUMENT_AUTOMATION, explanationKey: 'grow_legal_doc_auto_explanation' },
      { tool: LegalTool.COMPLIANCE_MANAGEMENT, explanationKey: 'grow_legal_compliance_explanation' },
    ]
  },
  {
    title: GrowSection.INVESTMENT, sidebarTitle: { en: GrowSection.INVESTMENT, am: GrowSection.INVESTMENT }, explanationKey: 'grow_investment_explanation', tools: [
      { tool: InvestmentTool.CAP_TABLE_MANAGEMENT, explanationKey: 'grow_investment_cap_table_explanation' },
      { tool: InvestmentTool.INVESTOR_RELATIONS_CRM, explanationKey: 'grow_investment_ir_crm_explanation' },
    ]
  },
  {
    title: GrowSection.MANAGEMENT, sidebarTitle: { en: GrowSection.MANAGEMENT, am: GrowSection.MANAGEMENT }, explanationKey: 'grow_management_explanation', tools: [
      { tool: ManagementTool.SUPPLY_CHAIN, explanationKey: 'grow_management_scm_explanation' },
      { tool: ManagementTool.QUALITY_MANAGEMENT, explanationKey: 'grow_management_qms_explanation' },
      { tool: ManagementTool.CUSTOMER_SERVICE, explanationKey: 'grow_management_cs_explanation' },
    ]
  },
  {
    title: GrowSection.CHECKLISTS, sidebarTitle: { en: GrowSection.CHECKLISTS, am: GrowSection.CHECKLISTS }, explanationKey: 'grow_checklists_explanation', tools: [
      { tool: ChecklistTool.RELEASE_LIST, explanationKey: 'grow_checklists_release_explanation' },
      { tool: ChecklistTool.GROWTH_LIST, explanationKey: 'grow_checklists_growth_explanation' },
    ]
  },
];

export const PERSONALITY_QUESTIONS: AssessmentQuestion[] = [
  { id: 'p1', textKey: 'q_p1_text', type: 'multiple-choice-scale', category: 'personality', scaleMin: 1, scaleMax: 5 },
  { id: 'p2', textKey: 'q_p2_text', type: 'multiple-choice-options', category: 'personality', options: [{ value: 'analyze', labelKey: 'q_p2_opt_analyze' }, { value: 'action', labelKey: 'q_p2_opt_action' }, { value: 'seek_help', labelKey: 'q_p2_opt_seek_help' }, { value: 'wait', labelKey: 'q_p2_opt_wait' }] },
  { id: 'p3', textKey: 'q_p3_text', type: 'multiple-choice-options', category: 'personality', options: [{ value: 'delegate', labelKey: 'q_p3_opt_delegate' }, { value: 'control', labelKey: 'q_p3_opt_control' }, { value: 'collaborate', labelKey: 'q_p3_opt_collaborate' }, { value: 'avoid', labelKey: 'q_p3_opt_avoid' }] },
  { id: 'p4', textKey: 'q_p4_text', type: 'multiple-choice-scale', category: 'personality', scaleMin: 1, scaleMax: 5 },
  { id: 'p5', textKey: 'q_p5_text', type: 'multiple-choice-options', category: 'personality', options: [{ value: 'data', labelKey: 'q_p5_opt_data' }, { value: 'intuition', labelKey: 'q_p5_opt_intuition' }, { value: 'advice', labelKey: 'q_p5_opt_advice' }, { value: 'trial_error', labelKey: 'q_p5_opt_trial_error' }] }
];

export const BUSINESS_ACUMEN_QUESTIONS: AssessmentQuestion[] = [
  { id: 'ba1', textKey: 'q_ba1_text', type: 'multiple-choice-options', category: 'businessAcumen', options: [{ value: 'detailed_plan', labelKey: 'q_ba1_opt_detailed_plan' }, { value: 'flexible_approach', labelKey: 'q_ba1_opt_flexible_approach' }, { value: 'customer_feedback', labelKey: 'q_ba1_opt_customer_feedback' }, { value: 'competitor_focus', labelKey: 'q_ba1_opt_competitor_focus' }] },
  { id: 'ba2', textKey: 'q_ba2_text', type: 'multiple-choice-options', category: 'businessAcumen', options: [{ value: 'revenue_first', labelKey: 'q_ba2_opt_revenue_first' }, { value: 'profit_first', labelKey: 'q_ba2_opt_profit_first' }, { value: 'growth_first', labelKey: 'q_ba2_opt_growth_first' }, { value: 'balance', labelKey: 'q_ba2_opt_balance' }] },
  { id: 'ba3', textKey: 'q_ba3_text', type: 'multiple-choice-scale', category: 'businessAcumen', scaleMin: 1, scaleMax: 5 },
  { id: 'ba4', textKey: 'q_ba4_text', type: 'multiple-choice-options', category: 'businessAcumen', options: [{ value: 'organic', labelKey: 'q_ba4_opt_organic' }, { value: 'paid_ads', labelKey: 'q_ba4_opt_paid_ads' }, { value: 'partnerships', labelKey: 'q_ba4_opt_partnerships' }, { value: 'sales_team', labelKey: 'q_ba4_opt_sales_team' }] },
  { id: 'ba5', textKey: 'q_ba5_text', type: 'multiple-choice-options', category: 'businessAcumen', options: [{ value: 'cut_costs', labelKey: 'q_ba5_opt_cut_costs' }, { value: 'increase_marketing', labelKey: 'q_ba5_opt_increase_marketing' }, { value: 'pivot_product', labelKey: 'q_ba5_opt_pivot_product' }, { value: 'seek_funding', labelKey: 'q_ba5_opt_seek_funding' }] }
];

export const STARTUP_KNOWLEDGE_QUESTIONS: AssessmentQuestion[] = [
  { id: 'sk1', textKey: 'q_sk1_text', type: 'multiple-choice-options', category: 'startupKnowledge', options: [{ value: 'mvp_basic', labelKey: 'q_sk1_opt_mvp_basic' }, { value: 'mvp_polished', labelKey: 'q_sk1_opt_mvp_polished' }, { value: 'mvp_many_features', labelKey: 'q_sk1_opt_mvp_many_features' }, { value: 'mvp_no_need', labelKey: 'q_sk1_opt_mvp_no_need' }] },
  { id: 'sk2', textKey: 'q_sk2_text', type: 'multiple-choice-scale', category: 'startupKnowledge', scaleMin: 1, scaleMax: 5 },
  { id: 'sk3', textKey: 'q_sk3_text', type: 'multiple-choice-options', category: 'startupKnowledge', options: [{ value: 'bootstrapping', labelKey: 'q_sk3_opt_bootstrapping' }, { value: 'friends_family', labelKey: 'q_sk3_opt_friends_family' }, { value: 'angel_investors', labelKey: 'q_sk3_opt_angel_investors' }, { value: 'venture_capital', labelKey: 'q_sk3_opt_venture_capital' }] },
  { id: 'sk4', textKey: 'q_sk4_text', type: 'multiple-choice-options', category: 'startupKnowledge', options: [{ value: 'surveys', labelKey: 'q_sk4_opt_surveys' }, { value: 'interviews', labelKey: 'q_sk4_opt_interviews' }, { value: 'presales', labelKey: 'q_sk4_opt_presales' }, { value: 'analytics', labelKey: 'q_sk4_opt_analytics' }] },
  { id: 'sk5', textKey: 'q_sk5_text', type: 'multiple-choice-options', category: 'startupKnowledge', options: [{ value: 'solo', labelKey: 'q_sk5_opt_solo' }, { value: 'complementary', labelKey: 'q_sk5_opt_complementary' }, { value: 'similar_skills', labelKey: 'q_sk5_opt_similar_skills' }, { value: 'friends', labelKey: 'q_sk5_opt_friends' }] }
];

const createChecklistItems = (keys: TranslationKey[]): ChecklistItem[] =>
  keys.map((key, index) => ({ id: `item-${key}-${index}`, textKey: key, completed: false }));

export const INITIAL_RELEASE_LIST_DATA: ChecklistTab[] = [
  {
    id: 'rl-tab-1', titleKey: 'checklist_rl_tab_product', cards: [
      { id: 'rl-card-1', titleKey: 'checklist_rl_card_legal', items: createChecklistItems(['checklist_rl_item_legal_1', 'checklist_rl_item_legal_2', 'checklist_rl_item_legal_3', 'checklist_rl_item_legal_4']) },
      { id: 'rl-card-2', titleKey: 'checklist_rl_card_pmf', items: createChecklistItems(['checklist_rl_item_pmf_1', 'checklist_rl_item_pmf_2', 'checklist_rl_item_pmf_3', 'checklist_rl_item_pmf_4', 'checklist_rl_item_pmf_5']) },
      { id: 'rl-card-3', titleKey: 'checklist_rl_card_dev', items: createChecklistItems(['checklist_rl_item_dev_1', 'checklist_rl_item_dev_2', 'checklist_rl_item_dev_3', 'checklist_rl_item_dev_4', 'checklist_rl_item_dev_5', 'checklist_rl_item_dev_6']) },
      { id: 'rl-card-4', titleKey: 'checklist_rl_card_cx', items: createChecklistItems(['checklist_rl_item_cx_1', 'checklist_rl_item_cx_2', 'checklist_rl_item_cx_3', 'checklist_rl_item_cx_4', 'checklist_rl_item_cx_5', 'checklist_rl_item_cx_6']) },
      { id: 'rl-card-5', titleKey: 'checklist_rl_card_metrics', items: createChecklistItems(['checklist_rl_item_metrics_1', 'checklist_rl_item_metrics_2', 'checklist_rl_item_metrics_3']) },
    ]
  },
  {
    id: 'rl-tab-2', titleKey: 'checklist_rl_tab_marketing', cards: [
      { id: 'rl-card-6', titleKey: 'checklist_rl_card_press', items: createChecklistItems(['checklist_rl_item_press_1', 'checklist_rl_item_press_2', 'checklist_rl_item_press_3']) },
      { id: 'rl-card-7', titleKey: 'checklist_rl_card_brand', items: createChecklistItems(['checklist_rl_item_brand_1', 'checklist_rl_item_brand_2']) },
      { id: 'rl-card-8', titleKey: 'checklist_rl_card_ext_comms', items: createChecklistItems(['checklist_rl_item_ext_comms_1', 'checklist_rl_item_ext_comms_2', 'checklist_rl_item_ext_comms_3', 'checklist_rl_item_ext_comms_4', 'checklist_rl_item_ext_comms_5', 'checklist_rl_item_ext_comms_6']) },
      { id: 'rl-card-9', titleKey: 'checklist_rl_card_acq_growth', items: createChecklistItems(['checklist_rl_item_acq_growth_1', 'checklist_rl_item_acq_growth_2', 'checklist_rl_item_acq_growth_3', 'checklist_rl_item_acq_growth_4', 'checklist_rl_item_acq_growth_5', 'checklist_rl_item_acq_growth_6', 'checklist_rl_item_acq_growth_7', 'checklist_rl_item_acq_growth_8']) },
      { id: 'rl-card-10', titleKey: 'checklist_rl_card_int_comms', items: createChecklistItems(['checklist_rl_item_int_comms_1', 'checklist_rl_item_int_comms_2', 'checklist_rl_item_int_comms_3', 'checklist_rl_item_int_comms_4', 'checklist_rl_item_int_comms_5', 'checklist_rl_item_int_comms_6']) },
    ]
  },
  {
    id: 'rl-tab-3', titleKey: 'checklist_rl_tab_pricing', cards: [
      { id: 'rl-card-11', titleKey: 'checklist_rl_card_pricing_structure', items: createChecklistItems(['checklist_rl_item_pricing_structure_1', 'checklist_rl_item_pricing_structure_2', 'checklist_rl_item_pricing_structure_3']) },
      { id: 'rl-card-12', titleKey: 'checklist_rl_card_channel_pricing', items: createChecklistItems(['checklist_rl_item_channel_pricing_1', 'checklist_rl_item_channel_pricing_2', 'checklist_rl_item_channel_pricing_3', 'checklist_rl_item_channel_pricing_4']) },
      { id: 'rl-card-13', titleKey: 'checklist_rl_card_pricing_tools', items: createChecklistItems(['checklist_rl_item_pricing_tools_1', 'checklist_rl_item_pricing_tools_2', 'checklist_rl_item_pricing_tools_3']) },
      { id: 'rl-card-14', titleKey: 'checklist_rl_card_pricing_analysis', items: createChecklistItems(['checklist_rl_item_pricing_analysis_1', 'checklist_rl_item_pricing_analysis_2', 'checklist_rl_item_pricing_analysis_3']) },
    ]
  },
  {
    id: 'rl-tab-4', titleKey: 'checklist_rl_tab_ops', cards: [
      { id: 'rl-card-15', titleKey: 'checklist_rl_card_ops_partners', items: createChecklistItems(['checklist_rl_item_ops_partners_1', 'checklist_rl_item_ops_partners_2', 'checklist_rl_item_ops_partners_3', 'checklist_rl_item_ops_partners_4']) },
      // FIX: The translation keys for these checklist items were missing from the TranslationKey type. They have been added in types.ts.
      { id: 'rl-card-16', titleKey: 'checklist_rl_card_ops_plans', items: createChecklistItems(['checklist_rl_item_ops_plans_1', 'checklist_rl_item_ops_plans_2', 'checklist_rl_item_ops_plans_3', 'checklist_rl_item_ops_plans_4', 'checklist_rl_item_ops_plans_5']) },
      { id: 'rl-card-17', titleKey: 'checklist_rl_card_ops_post_launch', items: createChecklistItems(['checklist_rl_item_ops_post_launch_1', 'checklist_rl_item_ops_post_launch_2', 'checklist_rl_item_ops_post_launch_3', 'checklist_rl_item_ops_post_launch_4', 'checklist_rl_item_ops_post_launch_5', 'checklist_rl_item_ops_post_launch_6', 'checklist_rl_item_ops_post_launch_7', 'checklist_rl_item_ops_post_launch_8', 'checklist_rl_item_ops_post_launch_9']) },
      { id: 'rl-card-18', titleKey: 'checklist_rl_card_ops_support', items: createChecklistItems(['checklist_rl_item_ops_support_1', 'checklist_rl_item_ops_support_2', 'checklist_rl_item_ops_support_3', 'checklist_rl_item_ops_support_4']) },
    ]
  },
];

export const INITIAL_GROWTH_LIST_DATA: ChecklistTab[] = [
  {
    id: 'gl-tab-1', titleKey: 'checklist_gl_tab_plg', cards: [
      { id: 'gl-card-1', titleKey: 'checklist_gl_card_acq', items: createChecklistItems(['checklist_gl_item_acq_1', 'checklist_gl_item_acq_2', 'checklist_gl_item_acq_3', 'checklist_gl_item_acq_4', 'checklist_gl_item_acq_5', 'checklist_gl_item_acq_6', 'checklist_gl_item_acq_7', 'checklist_gl_item_acq_8', 'checklist_gl_item_acq_9']) },
      { id: 'gl-card-2', titleKey: 'checklist_gl_card_landing', items: createChecklistItems(['checklist_gl_item_landing_1', 'checklist_gl_item_landing_2', 'checklist_gl_item_landing_3', 'checklist_gl_item_landing_4']) },
      { id: 'gl-card-3', titleKey: 'checklist_gl_card_onboarding', items: createChecklistItems(['checklist_gl_item_onboarding_1', 'checklist_gl_item_onboarding_2', 'checklist_gl_item_onboarding_3', 'checklist_gl_item_onboarding_4', 'checklist_gl_item_onboarding_5']) },
      { id: 'gl-card-4', titleKey: 'checklist_gl_card_retention', items: createChecklistItems(['checklist_gl_item_retention_1', 'checklist_gl_item_retention_2', 'checklist_gl_item_retention_3', 'checklist_gl_item_retention_4']) },
    ]
  },
  {
    id: 'gl-tab-2', titleKey: 'checklist_gl_tab_paid', cards: [
      // FIX: The translation keys for these checklist items were missing from the TranslationKey type. They have been added in types.ts.
      { id: 'gl-card-5', titleKey: 'checklist_gl_card_paid_linkedin', items: createChecklistItems(['checklist_gl_item_paid_linkedin_1', 'checklist_gl_item_paid_linkedin_2', 'checklist_gl_item_paid_linkedin_3', 'checklist_gl_item_paid_linkedin_4']) },
      { id: 'gl-card-6', titleKey: 'checklist_gl_card_paid_lead_auto', items: createChecklistItems(['checklist_gl_item_paid_lead_auto_1', 'checklist_gl_item_paid_lead_auto_2']) },
      { id: 'gl-card-7', titleKey: 'checklist_gl_card_paid_google', items: createChecklistItems(['checklist_gl_item_paid_google_1']) },
      { id: 'gl-card-8', titleKey: 'checklist_gl_card_paid_instagram', items: createChecklistItems(['checklist_gl_item_paid_instagram_1', 'checklist_gl_item_paid_instagram_2']) },
    ]
  },
  {
    id: 'gl-tab-3', titleKey: 'checklist_gl_tab_thought', cards: [
      // FIX: The translation keys for these checklist items were missing from the TranslationKey type. They have been added in types.ts.
      { id: 'gl-card-9', titleKey: 'checklist_gl_card_thought_social', items: createChecklistItems(['checklist_gl_item_thought_social_1', 'checklist_gl_item_thought_social_2', 'checklist_gl_item_thought_social_3', 'checklist_gl_item_thought_social_4', 'checklist_gl_item_thought_social_5', 'checklist_gl_item_thought_social_6']) },
      { id: 'gl-card-10', titleKey: 'checklist_gl_card_thought_content', items: createChecklistItems(['checklist_gl_item_thought_content_1', 'checklist_gl_item_thought_content_2', 'checklist_gl_item_thought_content_3']) },
      { id: 'gl-card-11', titleKey: 'checklist_gl_card_thought_speaking', items: createChecklistItems(['checklist_gl_item_thought_speaking_1', 'checklist_gl_item_thought_speaking_2', 'checklist_gl_item_thought_speaking_3']) },
      { id: 'gl-card-12', titleKey: 'checklist_gl_card_thought_podcasts', items: createChecklistItems(['checklist_gl_item_thought_podcasts_1', 'checklist_gl_item_thought_podcasts_2', 'checklist_gl_item_thought_podcasts_3']) },
    ]
  },
  {
    id: 'gl-tab-4', titleKey: 'checklist_gl_tab_partners', cards: [
      // FIX: The translation keys for these checklist items were missing from the TranslationKey type. They have been added in types.ts.
      { id: 'gl-card-13', titleKey: 'checklist_gl_card_partners_events', items: createChecklistItems(['checklist_gl_item_partners_events_1', 'checklist_gl_item_partners_events_2', 'checklist_gl_item_partners_events_3']) },
      { id: 'gl-card-14', titleKey: 'checklist_gl_card_partners_channel', items: createChecklistItems(['checklist_gl_item_partners_channel_1', 'checklist_gl_item_partners_channel_2', 'checklist_gl_item_partners_channel_3']) },
      { id: 'gl-card-15', titleKey: 'checklist_gl_card_partners_orgs', items: createChecklistItems(['checklist_gl_item_partners_orgs_1', 'checklist_gl_item_partners_orgs_2', 'checklist_gl_item_partners_orgs_3', 'checklist_gl_item_partners_orgs_4']) },
    ]
  },
  {
    id: 'gl-tab-5', titleKey: 'checklist_gl_tab_enterprise', cards: [
      // FIX: The translation keys for these checklist items were missing from the TranslationKey type. They have been added in types.ts.
      { id: 'gl-card-16', titleKey: 'checklist_gl_card_enterprise_bdr', items: createChecklistItems(['checklist_gl_item_enterprise_bdr_1', 'checklist_gl_item_enterprise_bdr_2', 'checklist_gl_item_enterprise_bdr_3']) },
      { id: 'gl-card-17', titleKey: 'checklist_gl_card_enterprise_ae', items: createChecklistItems(['checklist_gl_item_enterprise_ae_1', 'checklist_gl_item_enterprise_ae_2', 'checklist_gl_item_enterprise_ae_3']) },
      { id: 'gl-card-18', titleKey: 'checklist_gl_card_enterprise_cs', items: createChecklistItems(['checklist_gl_item_enterprise_cs_1', 'checklist_gl_item_enterprise_cs_2', 'checklist_gl_item_enterprise_cs_3']) },
    ]
  },
];