import { GoogleGenAI, Type } from "@google/genai";
import { Assignment, Priority } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-3-flash-preview';
const PRO_MODEL = 'gemini-3-pro-preview';

const MOM_SYSTEM_INSTRUCTION = `
  You are an "Indian Mother" who is the Supervisor-in-Chief of her child's homework. 
  Your tone is strict but deeply caring. You use phrases like "Beta", "Concentrate!", "Shaurya next door is already done", 
  and "I do everything for you, just study!". You emphasize neatness, discipline, and the fact that 
  education is the only path to a "Nawab" (noble/successful) life. You are judgmental about non-STEM subjects 
  and never satisfied with less than 100%.
`;

export const breakDownAssignment = async (assignment: Assignment, isCrisis: boolean = false): Promise<string[]> => {
  try {
    const prompt = `${MOM_SYSTEM_INSTRUCTION}\nBeta, I see you have this task: ${assignment.title} (${assignment.subject}). ${isCrisis ? "ARRE! You told me about this project at 9 PM?! Sit down, we are doing it together now." : "Don't delay it. Break it down into 4-6 small steps."}\nGive me steps in a JSON array called 'steps'.`;
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { steps: { type: Type.ARRAY, items: { type: Type.STRING } } }
        }
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return parsed.steps || [];
  } catch (error) { return []; }
};

export const getMomWisdom = async (assignment: Assignment): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `${MOM_SYSTEM_INSTRUCTION}\nGive me 3 pieces of "Mummy Wisdom" for: ${assignment.title}.`,
    });
    return response.text || "Just study.";
  } catch (error) { return "Study now."; }
};

export const judgeGrade = async (subject: string, score: number, total: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `${MOM_SYSTEM_INSTRUCTION}\nMy child got ${score}/${total} in ${subject}. Reaction?`,
    });
    return response.text || "Where are the marks?";
  } catch (error) { return "I see."; }
};

export interface GlobalCompetitor {
  name: string;
  achievement: string;
  sourceUrl: string;
  momComment: string;
}

export const getGlobalStandards = async (userCompletionRate: number): Promise<GlobalCompetitor[]> => {
  try {
    const prompt = `
      Search for the latest real-world academic news, like 2024/2025 Board exam toppers, JEE toppers, UPSC results, or SAT records.
      Then, acting as an Indian Mother, list 3 real-world "toppers" and compare them to my child who only has a ${userCompletionRate}% completion rate on their homework.
      Format the output as a JSON object with an array 'competitors'. 
      Each competitor should have: 'name', 'achievement', 'sourceUrl', and 'momComment'.
    `;

    const response = await ai.models.generateContent({
      model: PRO_MODEL,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            competitors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  achievement: { type: Type.STRING },
                  sourceUrl: { type: Type.STRING },
                  momComment: { type: Type.STRING }
                },
                required: ["name", "achievement", "sourceUrl", "momComment"]
              }
            }
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return parsed.competitors || [];
  } catch (error) {
    console.error("Global search failed:", error);
    return [];
  }
};

export const prioritizeAssignments = async (assignments: Assignment[]): Promise<string[]> => {
  if (assignments.length === 0) return [];
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `${MOM_SYSTEM_INSTRUCTION}\nOrder these tasks: ${JSON.stringify(assignments.map(a => ({ id: a.id, title: a.title, subject: a.subject })))}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { orderedIds: { type: Type.ARRAY, items: { type: Type.STRING } } }
        }
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return parsed.orderedIds || [];
  } catch (error) { return assignments.map(a => a.id); }
};
