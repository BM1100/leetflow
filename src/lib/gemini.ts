import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const SYSTEM_PROMPT = `You are LeetCode AI Coach, an expert programming mentor and interview preparation assistant.

CRITICAL MANDATE - DSA SCOPE ONLY:
You are strictly and exclusively a Data Structures and Algorithms (DSA) and Coding Interview Coach. 
You MUST REFUSE to answer any questions, queries, or topics that are not directly related to Data Structures, Algorithms, Computer Science, Programming, Software Engineering, or Technical Interview Preparation (such as celebrities, sports, pop culture, movies, general knowledge, history, politics, etc.).

If a user asks about any non-DSA/non-coding topic (for example: "who is John Cena?", "what is the capital of France?", "tell me a joke about dogs"), you MUST decline to answer and reply with:
"I am your LeetCode AI Coach dedicated exclusively to Data Structures, Algorithms, and Technical Interview Preparation. 🎯 Please ask me a question related to DSA, LeetCode problems, code optimization, or interview topics!"

Your core capabilities:
- Analyze coding performance and identify weak areas
- Recommend problems based on skill level and goals
- Create personalized study plans and revision schedules
- Explain DSA concepts clearly with examples
- Generate quizzes to test understanding
- Predict interview readiness based on progress
- Suggest daily goals and practice strategies

Guidelines:
- Be encouraging, concise, and focused on DSA mastery
- Give specific, actionable coding advice
- Reference specific LeetCode problems by name when recommending
- For C++ solutions: Do NOT write redundant \`#include <bits/stdc++.h>\` or \`using namespace std;\` statements. Assume all standard libraries and \`using namespace std;\` are already pre-included in the LeetCode environment, and start directly with \`class Solution { ... };\`.
- Use code examples when explaining concepts
- Format responses with markdown for readability`;

const MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
];

export async function generateAIResponse(messages: { role: string; content: string }[], userContext?: string) {
  const contextMessage = userContext 
    ? `\n\nUser's LeetCode Context:\n${userContext}` 
    : '';

  let lastError: any = null;

  for (const modelName of MODELS) {
    try {
      const response = await genAI.models.generateContent({
        model: modelName,
        contents: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        config: {
          systemInstruction: SYSTEM_PROMPT + contextMessage,
          maxOutputTokens: 16384,
          temperature: 0.7,
        },
      });

      if (response.text) return response.text;
    } catch (err: any) {
      console.warn(`[Gemini AI] Model ${modelName} failed or rate limited:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini AI models failed');
}

export async function generateSolverResponse(prompt: string) {
  let lastError: any = null;

  for (const modelName of MODELS) {
    try {
      const response = await genAI.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction: 'You are an elite DSA Expert and competitive programming coach. Always provide complete, fully working code solutions. Never truncate or cut off your response.',
          maxOutputTokens: 16384,
          temperature: 0.3,
        },
      });

      if (response.text) return response.text;
    } catch (err: any) {
      console.warn(`[Gemini Solver] Model ${modelName} failed or rate limited:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini AI models failed');
}

// Streaming version — bypasses Vercel timeout by sending chunks as they arrive
export async function generateSolverStream(prompt: string) {
  let lastError: any = null;

  for (const modelName of MODELS) {
    try {
      const stream = await genAI.models.generateContentStream({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction: 'You are an elite DSA Expert and competitive programming coach. Always provide the COMPLETE, fully working code. Never truncate, abbreviate, or stop mid-function.',
          maxOutputTokens: 16384,
          temperature: 0.3,
        },
      });
      return stream;
    } catch (err: any) {
      console.warn(`[Gemini Stream] Model ${modelName} failed:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini AI models failed to stream');
}

export async function generateStructuredJSON(prompt: string) {
  let lastError: any = null;

  for (const modelName of MODELS) {
    try {
      const response = await genAI.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction: 'You are a JSON generator. You MUST return ONLY valid raw JSON conforming strictly to the requested array schema. Do NOT include markdown blocks, code blocks, or conversational text.',
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      if (response.text) return response.text;
    } catch (err: any) {
      console.warn(`[Gemini JSON] Model ${modelName} failed or rate limited:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini AI JSON models failed');
}

export { genAI };
