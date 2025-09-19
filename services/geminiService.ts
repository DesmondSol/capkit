


import { GenerateContentResponse, Part, Type } from "@google/genai";
import { 
    CanvasData, 
    CanvasSection, 
    ResearchQuestionItem, 
    MarketResearchData, 
    ResearchSection, 
    CompetitorProfile, 
    TrendEntry, 
    ALL_CANVAS_SECTIONS,
    ResearchQuestionnaireSet,
    Language,
    MarketingPost, 
    Pitch, 
    PitchType, 
    MarketingPostStatus,
    MindsetData, 
    AssessmentAnswers, 
    FounderProfileReportData, 
    GoalSettingData, 
    AssessmentScores,
    TranslationKey,
    Persona,
    PersonasData,
    LaunchPhase,
    ProductFeature,
    FeaturePriority,
    FeedbackUrgency,
    LegalDocumentType,
    OnePagerData,
    // FIX: Added missing MarketingStrategy type import
    MarketingStrategy
} from '../types';
import { API_KEY_WARNING } from "../constants";

// Note: GoogleGenAI type will be imported dynamically.
type GoogleGenAI = any;

const API_KEY = process.env.API_KEY;
let ai: GoogleGenAI | null = null; // AI client will be initialized on first use

const TEXT_MODEL = 'gemini-2.5-flash';

// Singleton pattern to get the AI client asynchronously
const getAiClient = async (): Promise<GoogleGenAI | null> => {
    if (ai) return ai; // Return existing instance
    if (!API_KEY) {
        console.warn(API_KEY_WARNING);
        return null;
    }
    try {
        // Dynamically import the library
        const { GoogleGenAI } = await import("@google/genai");
        ai = new GoogleGenAI({ apiKey: API_KEY });
        return ai;
    } catch (error) {
        console.error("Failed to load @google/genai library:", error);
        return null;
    }
};

const parseJsonFromText = <T,>(text: string): T | null => {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", e, "Original text:", text);
    return null;
  }
};

const getAiResponseText = (response: GenerateContentResponse): string | null => {
    try {
        const text = response.text;
        if (text) {
            return text;
        }
        console.error("AI response is empty or invalid.");
        return null;
    } catch (e) {
        console.error("Error accessing AI response text:", e, response);
        return null;
    }
};

const callAi = async (prompt: string, jsonSchema?: any): Promise<string | null> => {
    const localAi = await getAiClient();
    if (!localAi) {
        console.warn(API_KEY_WARNING, "Gemini AI client not initialized.");
        return null;
    }
    try {
        const config: any = {
            temperature: jsonSchema ? 0.2 : 0.7,
        };
        if (jsonSchema) {
            config.responseMimeType = "application/json";
            config.responseSchema = jsonSchema;
        }
        
        const response: GenerateContentResponse = await localAi.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt,
            config: config,
        });

        return getAiResponseText(response);
    } catch (error) {
        console.error("Gemini API call failed:", error);
        return null;
    }
};

export const generateBusinessCanvasContent = async (
  businessIdea: string,
  problemSolved: string,
  targetCustomer: string,
  uniqueSellingProposition: string,
  sections: CanvasSection[],
  language: Language
): Promise<Partial<CanvasData> | null> => {
    const langInstructions = language === 'am'
    ? "All generated textual content for the sections MUST be in Amharic. The JSON keys themselves MUST remain in English. Provide rich, culturally relevant Amharic content that is practical for an Ethiopian entrepreneur."
    : "All generated content should be in English and be practical for an Ethiopian entrepreneur.";

    const prompt = `
    You are an AI assistant helping an entrepreneur develop a business plan for Ethiopia.
    ${langInstructions}

    Business Idea: ${businessIdea}
    Problem Solved (in Ethiopian context): ${problemSolved}
    Target Customer (Focus on Ethiopian demographics, psychographics, and cultural nuances): ${targetCustomer}
    Unique Selling Proposition (for the Ethiopian market): ${uniqueSellingProposition}

    Based on the above information, generate concise and actionable content for a Business Launch Canvas. All generated content MUST be highly relevant and contextualized for the Ethiopian business environment. Financial figures should implicitly relate to Ethiopian Birr (ETB). Market examples, competitor considerations, and business model suggestions should reflect local Ethiopian realities (e.g., infrastructure, logistics, payment systems like Telebirr).

    For each of the following sections, provide a practical description or strategy (2-4 sentences per section):
    ${sections.join("\n")} 

    Return the response as a valid JSON object where keys are the section names (exactly as provided in English) and values are the generated content strings (in ${language === 'am' ? 'Amharic' : 'English'}).
    `;

    const properties = sections.reduce((acc, section) => {
        acc[section] = { type: Type.STRING };
        return acc;
    }, {} as Record<CanvasSection, { type: Type.STRING }>);

    const schema = {
        type: Type.OBJECT,
        properties: properties,
    };

    const textResponse = await callAi(prompt, schema);
    if (!textResponse) return null;

    const parsedData = parseJsonFromText<Partial<CanvasData>>(textResponse);
    return parsedData;
};

export const generateMarketResearchQuestions = async (
  strategyData: Partial<CanvasData>,
  researchGoal: string,
  targetAudience: string,
  language: Language
): Promise<ResearchQuestionItem[]> => {
    const langInstructions = language === 'am'
        ? "The 'text' of each question must be in Amharic."
        : "The 'text' of each question must be in English.";
    
    const prompt = `
    Based on the following business strategy for an Ethiopian venture, generate 5-7 insightful market research questions.
    ${langInstructions}
    The questions should help validate the business idea and understand the target audience deeply.

    Business Strategy Summary:
    - Problem: ${strategyData[CanvasSection.PROBLEM]}
    - Solution: ${strategyData[CanvasSection.SOLUTION]}
    - Target Market: ${strategyData[CanvasSection.MARKET]}
    - Unique Value Proposition: ${strategyData[CanvasSection.UNIQUE_VALUE_PROPOSITION]}

    Current Research Goal: "${researchGoal}"
    Target Audience for this research: "${targetAudience}"

    Generate a list of questions that are open-ended, non-leading, and culturally sensitive to the Ethiopian context.
    Return a valid JSON array of objects.
    `;
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                responses: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {id: {type: Type.STRING}, text: {type: Type.STRING}}} }
            }
        }
    };

    const textResponse = await callAi(prompt, schema);
    if (!textResponse) return [];

    const parsedData = parseJsonFromText<{ text: string }[]>(textResponse);
    return parsedData ? parsedData.map(q => ({ id: `ai-${Date.now()}-${Math.random()}`, text: q.text, responses: [] })) : [];
};

export const generateMarketResearchSummary = async (
  researchData: {
    [ResearchSection.QUESTIONS]: ResearchQuestionnaireSet[];
    [ResearchSection.GENERAL_NOTES_IMPORT]: string;
    [ResearchSection.COMPETITOR_ANALYSIS]: CompetitorProfile[];
    [ResearchSection.TRENDS]: TrendEntry[];
  },
  strategyData: Partial<CanvasData>,
  language: Language
): Promise<string | null> => {
    const prompt = `
    Synthesize all the provided market research data for an Ethiopian business into a cohesive summary.
    The output should be a well-structured analysis in ${language === 'am' ? 'Amharic' : 'English'}.
    Highlight key insights, identify potential risks or challenges, and suggest opportunities.

    Business Strategy:
    ${JSON.stringify(strategyData, null, 2)}

    Research Data:
    - Q&A Sets: ${JSON.stringify(researchData[ResearchSection.QUESTIONS], null, 2)}
    - General Notes: ${researchData[ResearchSection.GENERAL_NOTES_IMPORT]}
    - Competitor Analysis: ${JSON.stringify(researchData[ResearchSection.COMPETITOR_ANALYSIS], null, 2)}
    - Industry Trends: ${JSON.stringify(researchData[ResearchSection.TRENDS], null, 2)}

    Generate a summary covering:
    1.  **Key Insights:** What are the most important findings from the research?
    2.  **Customer Validation:** How does the research validate or challenge assumptions about the target customer?
    3.  **Competitive Landscape:** What is the main takeaway from the competitor analysis?
    4.  **Market Trends:** How do current trends affect the business opportunity?
    5.  **Risks & Opportunities:** What are the biggest risks and actionable opportunities identified?
    `;

    return callAi(prompt);
};

export const generateMarketingPlan = async (
  strategyData: Partial<CanvasData>,
  researchData: MarketResearchData,
  inputs: { campaignGoal: string; targetPlatforms: string[]; contentTone: string; duration: string, referenceWeekStartDate: string },
  language: Language
): Promise<MarketingPost[] | null> => {
    const langInstructions = language === 'am' ? "All text content (title, content, visualRecommendation, notes) must be in Amharic." : "All text content must be in English.";
    
    const prompt = `
    Create a marketing content plan for an Ethiopian business.
    ${langInstructions}
    Context:
    - Business Idea: ${strategyData[CanvasSection.PROJECT_OVERVIEW]}
    - Target Audience from Personas: ${researchData[ResearchSection.AI_SUMMARY] || 'Not summarized'}
    - Unique Value Proposition: ${strategyData[CanvasSection.UNIQUE_VALUE_PROPOSITION]}
    - Brand Voice: ${strategyData[CanvasSection.BRAND_STYLE_GUIDES]}

    Campaign Details:
    - Goal: ${inputs.campaignGoal}
    - Platforms: ${inputs.targetPlatforms.join(', ')}
    - Tone: ${inputs.contentTone}
    - Duration: ${inputs.duration}
    - Reference Start Date for Scheduling: ${inputs.referenceWeekStartDate}

    Generate 3-5 distinct marketing posts for this campaign. Schedule them logically based on the start date.
    Return a valid JSON array of marketing post objects.
    `;
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                platform: { type: Type.STRING },
                scheduledDate: { type: Type.STRING, description: "ISO 8601 format: YYYY-MM-DDTHH:mm" },
                visualRecommendation: { type: Type.STRING },
                notes: { type: Type.STRING },
                status: { type: Type.STRING, enum: ['todo', 'in-progress', 'done'] }
            }
        }
    };

    const textResponse = await callAi(prompt, schema);
    if (!textResponse) return null;

    const parsedData = parseJsonFromText<Omit<MarketingPost, 'id'>[]>(textResponse);
    return parsedData ? parsedData.map(p => ({ ...p, id: `ai-${Date.now()}-${Math.random()}`})) : null;
};

export const generatePitchContent = async (
  strategyData: Partial<CanvasData>,
  researchData: MarketResearchData,
  inputs: { pitchType: PitchType; targetAudience: string; keyMessage: string; numEmails?: number },
  language: Language
): Promise<{ title: string; content: string } | null> => {
    const langInstructions = language === 'am' ? "The title and content must be in Amharic." : "The title and content must be in English.";
    const emailInstructions = inputs.pitchType === 'email_campaign' ? `This is an email campaign, generate a sequence of ${inputs.numEmails || 3} emails. Separate each email clearly with a separator like '--- EMAIL X ---'.` : '';

    const prompt = `
    Draft a pitch for an Ethiopian business.
    ${langInstructions}

    Business Context:
    - Idea: ${strategyData[CanvasSection.PROJECT_OVERVIEW]}
    - Problem: ${strategyData[CanvasSection.PROBLEM]}
    - Solution: ${strategyData[CanvasSection.SOLUTION]}
    - Market: ${strategyData[CanvasSection.MARKET]}
    - Unfair Advantage: ${strategyData[CanvasSection.UNFAIR_ADVANTAGE]}
    - Business Model: ${strategyData[CanvasSection.BUSINESS_MODEL]}

    Pitch Details:
    - Type: ${inputs.pitchType.replace('_', ' ')}
    - Target Audience: ${inputs.targetAudience}
    - Key Message: ${inputs.keyMessage}
    ${emailInstructions}

    Generate a compelling title and the full content for the pitch.
    Return a single valid JSON object.
    `;
    const schema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING }
        }
    };
    
    const textResponse = await callAi(prompt, schema);
    return textResponse ? parseJsonFromText<{ title: string; content: string }>(textResponse) : null;
};

export const generateOnePagerBlurb = async (
    onePagerData: OnePagerData,
    strategyData: Partial<CanvasData>,
    language: Language
): Promise<string | null> => {
    const langInstructions = language === 'am' ? "The response must be a single paragraph in Amharic." : "The response must be a single paragraph in English.";

    const prompt = `
    You are a startup advisor crafting a pitch for investors. Based on the following business canvas and key metrics, write a concise, compelling one-paragraph blurb for an investor one-pager or email.
    The blurb should be powerful, data-driven, and enticing.
    ${langInstructions}

    Business Core Information:
    - Problem: ${strategyData[CanvasSection.PROBLEM]}
    - Solution: ${strategyData[CanvasSection.SOLUTION]}
    - Market: ${strategyData[CanvasSection.MARKET]}
    - Unique Value Proposition: ${strategyData[CanvasSection.UNIQUE_VALUE_PROPOSITION]}

    Key Metrics & Information:
    - Traction: ${onePagerData.traction}
    - Team Summary: ${onePagerData.team}
    - The Ask: ${onePagerData.ask}

    Combine these elements into a single, seamless, and persuasive paragraph. Start with the company's mission (solving the problem), mention the traction, briefly touch on the team's expertise, and end with the funding ask and what it will achieve.
    `;

    return callAi(prompt);
};

// FIX: Added missing generateMarketingStrategy function
export const generateMarketingStrategy = async (
  inputs: { primaryGoal: string, totalBudget: string, duration: string },
  strategyData: Partial<CanvasData>,
  researchData: MarketResearchData,
  personasData: PersonasData,
  language: Language
): Promise<MarketingStrategy | null> => {
    const langInstructions = language === 'am' ? "All text content for the strategy fields MUST be in Amharic." : "All text content for the strategy fields MUST be in English.";

    const prompt = `
    You are an AI Marketing Strategist for an Ethiopian startup.
    Based on the provided business context and campaign goals, generate a comprehensive marketing strategy.
    ${langInstructions}

    Business Context:
    - Canvas: ${JSON.stringify(strategyData, null, 2)}
    - Research Summary: ${researchData[ResearchSection.AI_SUMMARY]}
    - Target Personas: ${JSON.stringify(personasData.map(p => ({ name: p.name, frustrations: p.frustrations, goals: p.goals })), null, 2)}

    Campaign Details:
    - Primary Goal: ${inputs.primaryGoal}
    - Total Budget: ${inputs.totalBudget || 'Not specified'}
    - Duration: ${inputs.duration}

    Generate a detailed strategy and return it as a single valid JSON object.
    The 'title' should be a concise name for this marketing plan.
    `;

    const schema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            objectives: { type: Type.STRING },
            tacticsAndChannels: { type: Type.STRING },
            contentStrategy: { type: Type.STRING },
            timeline: { type: Type.STRING },
            estimatedRoi: { type: Type.STRING },
            budgetAllocation: { type: Type.STRING },
            trackingMethods: { type: Type.STRING },
        }
    };
    
    const textResponse = await callAi(prompt, schema);
    if (!textResponse) return null;

    const parsedData = parseJsonFromText<Omit<MarketingStrategy, 'id' | 'isAiGenerated' | 'createdAt'>>(textResponse);
    if (!parsedData) return null;
    
    return {
        ...parsedData,
        id: `ms-ai-${Date.now()}`,
        isAiGenerated: true,
        createdAt: new Date().toISOString(),
    };
};

export const askAiMindsetCoach = async (
  goals: GoalSettingData,
  userInput: string,
  chatHistory: { role: 'user' | 'model'; parts: {text: string}[] }[],
  language: Language
): Promise<string> => {
    const prompt = `
    You are an encouraging and practical mindset coach for an Ethiopian entrepreneur.
    Your response must be in ${language === 'am' ? 'Amharic' : 'English'}.
    Keep your responses concise, actionable, and supportive.

    Their stated goals are: ${JSON.stringify(goals, null, 2)}

    Their new message is: "${userInput}"

    Review the chat history for context if needed.
    Provide a helpful response that either helps them refine their goals, provides motivation, or gives a practical next step.
    `;
    // Using a chat-optimized model might be better, but for now we format it for generateContent
    const historyPrompt = chatHistory.map(h => `${h.role}: ${h.parts[0].text}`).join('\n');
    const fullPrompt = `${historyPrompt}\n${prompt}`;
    
    const response = await callAi(fullPrompt);
    return response || (language === 'am' ? "ይቅርታ, ምላሽ መስጠት አልቻልኩም. እንደገና ይሞክሩ." : "Sorry, I couldn't generate a response. Please try again.");
};

export const generateFounderProfileReport = async (
  answers: AssessmentAnswers,
  language: Language,
  t: (key: TranslationKey, defaultText?: string) => string
): Promise<FounderProfileReportData | null> => {
    const langInstructions = language === 'am'
        ? "All textual descriptions ('founderTypeTitle', 'founderTypeDescription', 'cofounderPersonaSuggestion', 'keyTakeaways' array items) MUST be in Amharic."
        : "All textual descriptions must be in English.";

    const prompt = `
    Analyze the following entrepreneurial assessment answers and generate a founder profile report.
    ${langInstructions}

    Assessment Answers:
    ${JSON.stringify(answers, null, 2)}

    Based on the answers, generate a JSON object with the following structure:
    1. founderTypeTitle: A catchy archetype name (e.g., "The Visionary Catalyst", "The Pragmatic Builder").
    2. founderTypeDescription: A short paragraph describing this founder type's main characteristics.
    3. scores: An object with scores from 0-100 for each of these 10 dimensions: 'riskTolerance', 'leadership', 'adaptability', 'marketInsight', 'financialLiteracy', 'strategicThinking', 'resilience', 'creativity', 'salesAbility', 'technicalSkills'. Infer scores logically from the answers.
    4. cofounderPersonaSuggestion: A brief description of an ideal co-founder profile that would complement this founder's strengths and weaknesses.
    5. keyTakeaways: An array of 3-4 short, actionable pieces of advice for this founder.
    `;
    const schema = {
        type: Type.OBJECT,
        properties: {
            founderTypeTitle: { type: Type.STRING },
            founderTypeDescription: { type: Type.STRING },
            scores: {
                type: Type.OBJECT,
                properties: {
                    riskTolerance: { type: Type.NUMBER },
                    leadership: { type: Type.NUMBER },
                    adaptability: { type: Type.NUMBER },
                    marketInsight: { type: Type.NUMBER },
                    financialLiteracy: { type: Type.NUMBER },
                    strategicThinking: { type: Type.NUMBER },
                    resilience: { type: Type.NUMBER },
                    creativity: { type: Type.NUMBER },
                    salesAbility: { type: Type.NUMBER },
                    technicalSkills: { type: Type.NUMBER },
                }
            },
            cofounderPersonaSuggestion: { type: Type.STRING },
            keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
    };
    
    const textResponse = await callAi(prompt, schema);
    if (!textResponse) return null;
    
    const parsedData = parseJsonFromText<Omit<FounderProfileReportData, 'generatedDate' | 'language'>>(textResponse);
    return parsedData ? { ...parsedData, generatedDate: new Date().toISOString(), language: language } : null;
};

export const generateAiPersona = async (
  idea: string,
  problem: string,
  dayInLife: string,
  discoveryMethod: string,
  canvasData: Partial<CanvasData>,
  language: Language
): Promise<Partial<Omit<Persona, 'id' | 'icon'>> | null> => {
    const langInstructions = language === 'am' ? "All string values in the JSON output must be in Amharic." : "All string values in the JSON output must be in English.";
    
    const prompt = `
    Generate a detailed customer persona for an Ethiopian business.
    ${langInstructions}
    The persona should be a realistic representation of a target customer in Ethiopia.

    Context:
    - Business Idea: ${idea}
    - Problem this persona faces: ${problem}
    - A key challenge or a typical day for this persona: ${dayInLife}
    - How they might discover a service like this: ${discoveryMethod}
    - Broader Business Strategy: ${JSON.stringify(canvasData, null, 2)}

    Generate a single JSON object representing the persona.
    - Demographics (name, profession, gender, age, location, maritalStatus, education) should be realistic for Ethiopia.
    - Personality and Traits sliders should be numbers between 0 and 100.
    - Bio, Goals, Frustrations, etc., should be detailed and reflect the provided context.
    - Generate 2-3 'Jobs To Be Done' (JTBD) that are specific and follow the situation/motivation/outcome format.
    `;
    const schema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING }, profession: { type: Type.STRING },
            gender: { type: Type.STRING, enum: ['Male', 'Female', 'Other'] }, age: { type: Type.NUMBER },
            location: { type: Type.STRING }, maritalStatus: { type: Type.STRING, enum: ['Single', 'Married', 'In a relationship', 'Divorced', 'Widowed'] },
            education: { type: Type.STRING, enum: ["Bachelor's Degree", "Master's Degree", "PhD", "High School", "Other"]},
            bio: { type: Type.STRING },
            personality: {
                type: Type.OBJECT,
                properties: { analyticalCreative: { type: Type.NUMBER }, busyTimeRich: { type: Type.NUMBER }, messyOrganized: { type: Type.NUMBER }, independentTeamPlayer: { type: Type.NUMBER } }
            },
            traits: {
                type: Type.OBJECT,
                properties: { buyingAuthority: { type: Type.NUMBER }, technical: { type: Type.NUMBER }, socialMedia: { type: Type.NUMBER }, selfHelping: { type: Type.NUMBER } }
            },
            goals: { type: Type.STRING }, likes: { type: Type.STRING }, dislikes: { type: Type.STRING },
            frustrations: { type: Type.STRING }, skills: { type: Type.STRING },
            jobsToBeDone: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: { title: { type: Type.STRING }, situation: { type: Type.STRING }, motivation: { type: Type.STRING }, outcome: { type: Type.STRING }, emotionalJob: { type: Type.STRING }, socialJob: { type: Type.STRING } }
                }
            }
        }
    };
    
    const textResponse = await callAi(prompt, schema);
    if (!textResponse) return null;

    const parsedData = parseJsonFromText<Partial<Omit<Persona, 'id' | 'icon'>>>(textResponse);
    if (parsedData && parsedData.jobsToBeDone) {
        parsedData.jobsToBeDone = parsedData.jobsToBeDone.map(job => ({...job, id: `jtbd-ai-${Date.now()}-${Math.random()}`}));
    }
    return parsedData;
};

export const generateProductFeatures = async (
  canvasData: Partial<CanvasData>,
  language: Language
): Promise<{ name: string, description: string, problemSolved: string, priority: FeaturePriority }[] | null> => {
    const langInstructions = language === 'am' ? "All text content (name, description, problemSolved) must be in Amharic." : "All text content must be in English.";
    
    const prompt = `
    Based on the provided Business Launch Canvas for an Ethiopian venture, generate a list of 5-7 core product features.
    ${langInstructions}

    Business Canvas Summary:
    - Problem: ${canvasData[CanvasSection.PROBLEM]}
    - Solution: ${canvasData[CanvasSection.SOLUTION]}
    - Unique Value Proposition: ${canvasData[CanvasSection.UNIQUE_VALUE_PROPOSITION]}
    - Use Cases: ${canvasData[CanvasSection.USE_CASES]}

    For each feature, provide a name, a brief description of what it does, the specific problem it solves for the user, and a priority level ('low', 'medium', 'high', 'critical').
    Focus on features that would constitute a strong Minimum Viable Product (MVP).
    Return a valid JSON array of feature objects.
    `;
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                problemSolved: { type: Type.STRING },
                priority: { type: Type.STRING, enum: ['low', 'medium', 'high', 'critical'] }
            }
        }
    };

    const textResponse = await callAi(prompt, schema);
    return textResponse ? parseJsonFromText<{ name: string, description: string, problemSolved: string, priority: FeaturePriority }[]>(textResponse) : null;
};

export const processBulkFeedback = async (
  bulkText: string,
  features: ProductFeature[],
  language: Language
): Promise<{ content: string, urgency: FeedbackUrgency, featureId: string | null }[] | null> => {
    const langInstructions = language === 'am' ? "The 'content' of each feedback item must be in Amharic." : "The 'content' of each feedback item must be in English.";
    const featureList = features.map(f => ({ id: f.id, name: f.name, description: f.versions[f.versions.length-1].description })).join('\n');
    
    const prompt = `
    Analyze the following block of unstructured user feedback.
    ${langInstructions}
    Extract each distinct piece of feedback into a separate item. For each item, determine its urgency ('low', 'medium', 'high') and attempt to link it to one of the existing product features provided below. If no feature is a clear match, set featureId to null.

    Existing Features (for linking):
    ${featureList}

    Bulk Feedback Text:
    ---
    ${bulkText}
    ---

    Return a valid JSON array of feedback objects.
    `;
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                content: { type: Type.STRING },
                urgency: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
                featureId: { type: Type.STRING, description: "ID of the linked feature, or null if no match." }
            }
        }
    };
    const textResponse = await callAi(prompt, schema);
    return textResponse ? parseJsonFromText<{ content: string, urgency: FeedbackUrgency, featureId: string | null }[]>(textResponse) : null;
};

export const generateLaunchSequence = async (
  strategyData: Partial<CanvasData>,
  personasData: PersonasData,
  researchData: MarketResearchData,
  language: Language
): Promise<{ name: string; activities: { name: string }[] }[] | null> => {
    const langInstructions = language === 'am' ? "The names for phases and activities must be in Amharic." : "The names for phases and activities must be in English.";
    const personasSummary = personasData.map(p => `${p.name} (${p.profession}) who is frustrated by ${p.frustrations}`).join('; ');
    const researchSummary = researchData[ResearchSection.AI_SUMMARY] || 'No summary available.';

    const prompt = `
    You are an expert Go-to-Market strategist specializing in the Ethiopian market.
    Based on the provided business details, create a detailed, actionable launch sequence.
    The sequence should be broken down into logical phases (e.g., Pre-Launch, Launch Week, Post-Launch).
    Each phase must contain a list of specific, executable tasks relevant to the Ethiopian context.
    ${langInstructions}

    Business Strategy:
    - Idea: ${strategyData[CanvasSection.PROJECT_OVERVIEW]}
    - Problem: ${strategyData[CanvasSection.PROBLEM]}
    - Solution: ${strategyData[CanvasSection.SOLUTION]}
    - Target Market: ${strategyData[CanvasSection.MARKET]}
    - Unique Value Proposition: ${strategyData[CanvasSection.UNIQUE_VALUE_PROPOSITION]}

    Target Personas:
    ${personasSummary}

    Market Research Summary:
    ${researchSummary}

    Generate the launch sequence as a valid JSON array of phase objects.
    Each phase object should have a 'name' (string) and an 'activities' array.
    Each item in the 'activities' array should be an object with a single 'name' property (string).
    `;
    
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "Name of the launch phase (e.g., 'Pre-Launch (T-4 Weeks)')" },
                activities: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "A specific, actionable task for this phase." }
                        },
                        required: ["name"]
                    }
                }
            },
            required: ["name", "activities"]
        }
    };
    
    const textResponse = await callAi(prompt, schema);
    if (!textResponse) return null;

    return parseJsonFromText<{ name: string; activities: { name: string }[] }[]>(textResponse);
};

export const generateLegalDocument = async (
  documentType: LegalDocumentType,
  inputs: Record<string, string>,
  language: Language
): Promise<{ name: string; content: string } | null> => {
  const langInstructions = language === 'am' ? "The document MUST be written in Amharic, suitable for use in Ethiopia." : "The document MUST be written in English, suitable for use in Ethiopia.";
  
  const prompt = `
  You are an AI legal assistant specialized in Ethiopian business law.
  Generate a professional legal document based on the following details.
  ${langInstructions}

  Document Type: ${documentType.replace(/-/g, ' ')}
  
  Inputs provided by user:
  ${JSON.stringify(inputs, null, 2)}

  Please generate the full text of the legal document. The document should be comprehensive and include standard clauses appropriate for the document type and Ethiopian context.
  Use placeholders like [Your Company Name] or [Date] where specific information is still needed, but fill in all the details provided in the user inputs.
  
  Return a valid JSON object with two keys:
  - "name": A suitable filename for the document (e.g., "NDA for [Party Name].txt").
  - "content": The full text of the legal document as a single string.
  `;
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      content: { type: Type.STRING }
    }
  };
  
  const textResponse = await callAi(prompt, schema);
  if (!textResponse) return null;

  return parseJsonFromText<{ name: string; content: string }>(textResponse);
};
