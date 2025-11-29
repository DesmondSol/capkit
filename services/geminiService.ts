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
    5.  **Risks & Opportunities:** What risks were identified, and what opportunities emerged?

    Ensure the tone is professional, encouraging, and specific to the Ethiopian market context.
    `;

    return await callAi(prompt);
};

export const generateMarketingPlan = async (
    strategyData: Partial<CanvasData>,
    researchData: MarketResearchData,
    inputs: { campaignGoal: string; targetPlatforms: string[]; contentTone: string; duration: string; referenceWeekStartDate: string },
    language: Language
): Promise<MarketingPost[]> => {
    const langInstructions = language === 'am' ? "Content should be in Amharic." : "Content should be in English.";
    const prompt = `
    Generate a ${inputs.duration} marketing content plan for an Ethiopian startup.
    ${langInstructions}
    
    Business Context:
    - Product: ${strategyData[CanvasSection.SOLUTION]}
    - Target Audience: ${strategyData[CanvasSection.MARKET]}
    - UVP: ${strategyData[CanvasSection.UNIQUE_VALUE_PROPOSITION]}
    
    Campaign Details:
    - Goal: ${inputs.campaignGoal}
    - Platforms: ${inputs.targetPlatforms.join(', ')}
    - Tone: ${inputs.contentTone}
    - Reference Start Date: ${inputs.referenceWeekStartDate}

    Generate specific, actionable social media posts.
    `;

    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                platform: { type: Type.STRING },
                scheduledDate: { type: Type.STRING, description: "ISO 8601 date string" },
                visualRecommendation: { type: Type.STRING },
                notes: { type: Type.STRING },
                status: { type: Type.STRING, enum: ['todo', 'in-progress', 'done'] }
            }
        }
    };

    const textResponse = await callAi(prompt, schema);
    if (!textResponse) return [];
    
    const parsed = parseJsonFromText<MarketingPost[]>(textResponse);
    return parsed ? parsed.map(p => ({ ...p, id: `ai-post-${Date.now()}-${Math.random()}` })) : [];
};

export const generatePitchContent = async (
    strategyData: Partial<CanvasData>,
    researchData: MarketResearchData,
    inputs: { pitchType: PitchType; targetAudience: string; keyMessage: string; numEmails?: number },
    language: Language
): Promise<{ title: string; content: string } | null> => {
    const langInstructions = language === 'am' ? "Content must be in Amharic." : "Content must be in English.";
    const prompt = `
    Write a ${inputs.pitchType} for an Ethiopian startup.
    ${langInstructions}
    
    Context:
    - Solution: ${strategyData[CanvasSection.SOLUTION]}
    - Problem: ${strategyData[CanvasSection.PROBLEM]}
    - Target Audience for Pitch: ${inputs.targetAudience}
    - Key Message to Convey: ${inputs.keyMessage}
    
    Format:
    ${inputs.pitchType === 'email_campaign' ? `Generate a sequence of ${inputs.numEmails || 3} short, engaging emails.` : 'Generate a structured pitch script or document.'}
    `;

    const schema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING }
        }
    };

    const textResponse = await callAi(prompt, schema);
    return parseJsonFromText(textResponse || "{}");
};

export const askAiMindsetCoach = async (
    goals: GoalSettingData,
    userInput: string,
    history: { role: 'user' | 'model'; parts: {text: string}[] }[],
    language: Language
): Promise<string> => {
    const langInstructions = language === 'am' ? "Reply in Amharic." : "Reply in English.";
    const context = `
    You are an empathetic and wise startup mindset coach for an Ethiopian entrepreneur.
    Current Goals: 
    - 6-month: ${JSON.stringify(goals['6-month'])}
    - 2-year: ${JSON.stringify(goals['2-year'])}
    
    User Input: ${userInput}
    ${langInstructions}
    
    Provide concise, motivating, and actionable advice.
    `;
    
    // In a real implementation, we would pass 'history' to the chat model.
    // For this single-turn helper, we prepend context.
    return (await callAi(context)) || "";
};

export const generateFounderProfileReport = async (
    assessmentAnswers: AssessmentAnswers,
    language: Language,
    t: (key: TranslationKey) => string
): Promise<FounderProfileReportData | null> => {
    const langInstructions = language === 'am' ? "Report must be in Amharic." : "Report must be in English.";
    const prompt = `
    Analyze the following founder assessment answers and generate a profile report.
    ${langInstructions}
    
    Answers: ${JSON.stringify(assessmentAnswers)}
    
    Generate:
    1. Founder Type Title (e.g., "The Visionary Builder")
    2. Description
    3. Scores (0-100) for: riskTolerance, leadership, adaptability, marketInsight, financialLiteracy, strategicThinking, resilience, creativity, salesAbility, technicalSkills.
    4. Co-founder Suggestion
    5. Key Takeaways
    `;

    const schema = {
        type: Type.OBJECT,
        properties: {
            founderTypeTitle: { type: Type.STRING },
            founderTypeDescription: { type: Type.STRING },
            scores: { 
                type: Type.OBJECT,
                properties: {
                    riskTolerance: { type: Type.NUMBER }, leadership: { type: Type.NUMBER }, adaptability: { type: Type.NUMBER },
                    marketInsight: { type: Type.NUMBER }, financialLiteracy: { type: Type.NUMBER }, strategicThinking: { type: Type.NUMBER },
                    resilience: { type: Type.NUMBER }, creativity: { type: Type.NUMBER }, salesAbility: { type: Type.NUMBER }, technicalSkills: { type: Type.NUMBER }
                }
            },
            cofounderPersonaSuggestion: { type: Type.STRING },
            keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
            generatedDate: { type: Type.STRING },
            language: { type: Type.STRING }
        }
    };

    const textResponse = await callAi(prompt, schema);
    if (!textResponse) return null;
    
    const parsed = parseJsonFromText<FounderProfileReportData>(textResponse);
    if (parsed) {
        parsed.generatedDate = new Date().toISOString();
        parsed.language = language;
    }
    return parsed;
};

export const generateAiPersona = async (
    idea: string, q1: string, q2: string, q3: string,
    canvasData: Partial<CanvasData>,
    language: Language
): Promise<Partial<Persona> | null> => {
    const langInstructions = language === 'am' ? "Generate content in Amharic." : "Generate content in English.";
    const prompt = `
    Create a detailed user persona for an Ethiopian product based on:
    Idea: ${idea}
    Context: ${JSON.stringify(canvasData)}
    User Inputs: ${q1}, ${q2}, ${q3}
    ${langInstructions}
    
    Generate name, profession, age, bio, goals, frustrations, etc. suitable for the Ethiopian market.
    `;

    const schema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            profession: { type: Type.STRING },
            gender: { type: Type.STRING },
            age: { type: Type.NUMBER },
            location: { type: Type.STRING },
            maritalStatus: { type: Type.STRING },
            education: { type: Type.STRING },
            bio: { type: Type.STRING },
            goals: { type: Type.STRING },
            frustrations: { type: Type.STRING },
            likes: { type: Type.STRING },
            dislikes: { type: Type.STRING },
            skills: { type: Type.STRING },
            personality: { type: Type.OBJECT, properties: { analyticalCreative: {type: Type.NUMBER}, busyTimeRich: {type: Type.NUMBER}, messyOrganized: {type: Type.NUMBER}, independentTeamPlayer: {type: Type.NUMBER} } },
            traits: { type: Type.OBJECT, properties: { buyingAuthority: {type: Type.NUMBER}, technical: {type: Type.NUMBER}, socialMedia: {type: Type.NUMBER}, selfHelping: {type: Type.NUMBER} } },
        }
    };

    const textResponse = await callAi(prompt, schema);
    return parseJsonFromText<Partial<Persona>>(textResponse || "{}");
};

export const generateProductFeatures = async (
    canvasData: Partial<CanvasData>,
    language: Language
): Promise<Array<{name: string, priority: FeaturePriority, description: string, problemSolved: string}> | null> => {
    const langInstructions = language === 'am' ? "Content in Amharic." : "Content in English.";
    const prompt = `
    Suggest 5 key product features based on this Business Canvas:
    ${JSON.stringify(canvasData)}
    ${langInstructions}
    `;

    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                priority: { type: Type.STRING, enum: ['low', 'medium', 'high', 'critical'] },
                description: { type: Type.STRING },
                problemSolved: { type: Type.STRING }
            }
        }
    };

    const textResponse = await callAi(prompt, schema);
    return parseJsonFromText(textResponse || "[]");
};

export const processBulkFeedback = async (
    bulkText: string,
    features: ProductFeature[],
    language: Language
): Promise<Array<{content: string, source: any, urgency: FeedbackUrgency, featureId: string | null}> | null> => {
    const langInstructions = language === 'am' ? "Process in Amharic context." : "Process in English context.";
    const prompt = `
    Analyze this raw user feedback and split it into distinct items. 
    Map each item to an existing feature if relevant.
    Existing Features: ${JSON.stringify(features.map(f => ({id: f.id, name: f.name})))}
    
    Feedback: ${bulkText}
    ${langInstructions}
    `;

    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                content: { type: Type.STRING },
                urgency: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
                featureId: { type: Type.STRING, nullable: true }
            }
        }
    };

    const textResponse = await callAi(prompt, schema);
    return parseJsonFromText(textResponse || "[]");
};

export const generateLaunchSequence = async (
    canvasData: Partial<CanvasData>,
    personasData: PersonasData,
    researchData: MarketResearchData,
    language: Language
): Promise<LaunchPhase[] | null> => {
    const langInstructions = language === 'am' ? "Content in Amharic." : "Content in English.";
    const prompt = `
    Create a product launch sequence (Go-to-Market plan) for this business.
    Context: ${JSON.stringify(canvasData)}
    ${langInstructions}
    `;

    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                activities: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { name: { type: Type.STRING } }
                    }
                }
            }
        }
    };

    const textResponse = await callAi(prompt, schema);
    return parseJsonFromText(textResponse || "[]");
};

export const generateLegalDocument = async (
    docType: LegalDocumentType,
    formState: Record<string, string>,
    language: Language
): Promise<{ name: string; content: string } | null> => {
    const langInstructions = language === 'am' ? "Generate document in Amharic (where legally appropriate or as a translation) or English." : "Generate in English.";
    const prompt = `
    Draft a legal document: ${docType}.
    Details: ${JSON.stringify(formState)}
    ${langInstructions}
    Ensure it uses standard legal clauses relevant to Ethiopian business context if applicable.
    `;

    const schema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            content: { type: Type.STRING }
        }
    };

    const textResponse = await callAi(prompt, schema);
    return parseJsonFromText(textResponse || "{}");
};

export const generateMarketingStrategy = async (
    inputs: { primaryGoal: string, totalBudget: string, duration: string },
    strategyData: Partial<CanvasData>,
    researchData: MarketResearchData,
    personasData: PersonasData,
    language: Language
): Promise<MarketingStrategy | null> => {
    const langInstructions = language === 'am' ? "Strategy in Amharic." : "Strategy in English.";
    const prompt = `
    Develop a high-level marketing strategy.
    Goal: ${inputs.primaryGoal}
    Budget: ${inputs.totalBudget}
    Duration: ${inputs.duration}
    Context: ${JSON.stringify(strategyData)}
    ${langInstructions}
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
            isAiGenerated: { type: Type.BOOLEAN },
            createdAt: { type: Type.STRING }
        }
    };

    const textResponse = await callAi(prompt, schema);
    return parseJsonFromText(textResponse || "{}");
};

export const generateOnePagerBlurb = async (
    onePager: OnePagerData,
    strategyData: Partial<CanvasData>,
    language: Language
): Promise<string | null> => {
    const langInstructions = language === 'am' ? "Write in Amharic." : "Write in English.";
    const prompt = `
    Write a compelling investor one-pager blurb summary.
    Traction: ${onePager.traction}
    Team: ${onePager.team}
    Ask: ${onePager.ask}
    Business Info: ${JSON.stringify(strategyData)}
    ${langInstructions}
    `;
    
    return await callAi(prompt);
};

export const generateLandingPageHtml = async (
    strategyData: Partial<CanvasData>
): Promise<string | null> => {
    const prompt = `
    Generate a single-file HTML5 landing page for this business.
    Include inline CSS for styling (Tailwind CSS via CDN is allowed).
    Structure: Header, Hero (Value Prop), Features, Testimonials (placeholder), CTA, Footer.
    Business Info: ${JSON.stringify(strategyData)}
    
    Return ONLY the raw HTML code.
    `;
    
    // Using a simpler model call as we want raw text (code), not JSON structure usually.
    // However, sticking to consistent helper.
    const text = await callAi(prompt);
    // Remove markdown code fences if present
    if (text) {
        return text.replace(/^```html/, '').replace(/^```/, '').replace(/```$/, '');
    }
    return null;
};
