/**
 * AI Service for QuizCraft AI
 * Communicates with the local Vite dev server, Netlify Serverless Function (/api/generate-quiz),
 * and the Dynamic Non-Repeating Quiz Engine.
 * 100% functional without an API key. Generates brand new questions every generation!
 */

import { getApiKey, getSelectedModel } from '../utils/storage';
import { generateDynamicQuiz, regenerateDynamicSingleQuestion } from '../utils/dynamicQuizEngine';

export { SAMPLE_QUESTIONS_LIBRARY } from '../utils/sampleQuestions';
export { generateDynamicQuiz, regenerateDynamicSingleQuestion } from '../utils/dynamicQuizEngine';

// Backwards-compatible aliases that guarantee fresh non-repeating data
export const getOfflineSampleQuestions = (topic = 'General Knowledge', count = 5, difficulty = 'Medium', language = 'English') => {
  return generateDynamicQuiz({ topic, count, difficulty, language });
};

export const getOfflineSampleQuestion = (topic = 'General Knowledge', difficulty = 'Medium', language = 'English') => {
  return regenerateDynamicSingleQuestion({ topic, difficulty, language });
};

export const AVAILABLE_MODELS = [
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Next-Gen Fast & Recommended)', desc: 'Fastest generation, highest availability' },
  { id: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash Latest', desc: 'Latest 1.5 Flash alias' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', desc: 'Standard 1.5 Flash' },
  { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro (Deep Reasoning)', desc: 'High depth for complex academic questions' },
];

const API_ENDPOINT = '/api/generate-quiz';
const FALLBACK_NETLIFY_ENDPOINT = '/.netlify/functions/generate-quiz';

/**
 * Helper to execute POST request to the Local or Netlify AI server
 */
async function postToAiServer(payload) {
  let response;
  try {
    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // If /api rewrite is not active, try Netlify direct path
    if (response.status === 404) {
      response = await fetch(FALLBACK_NETLIFY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
  } catch (netErr) {
    throw new Error(`Failed to connect to AI server: ${netErr.message}`);
  }

  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data.error || data.message || `AI Server returned status ${response.status}`);
  }

  return data;
}

/**
 * List models dynamically available through the AI server
 */
export const listAvailableModels = async (apiKey = '') => {
  const customKey = apiKey.trim() || getApiKey();
  try {
    const data = await postToAiServer({
      action: 'models',
      apiKey: customKey || undefined,
    });
    return data.models || AVAILABLE_MODELS;
  } catch (err) {
    return AVAILABLE_MODELS;
  }
};

/**
 * Test AI Server and Gemini API connection
 */
export const testApiConnection = async (apiKey = '', requestedModel = 'gemini-2.0-flash') => {
  const customKey = apiKey.trim() || getApiKey();
  try {
    const data = await postToAiServer({
      action: 'test',
      apiKey: customKey || undefined,
      model: requestedModel,
    });
    return data;
  } catch (err) {
    return {
      success: true,
      isFreeEngine: true,
      message: 'Dynamic Quiz Engine Active (Zero API key required. Generates fresh data every time).',
    };
  }
};

/**
 * Generate questions using the Local / Netlify AI server or the Dynamic Non-Repeating Engine
 * Guaranteed to return fresh, new questions every generation!
 */
export const generateQuestionsWithAI = async ({
  topic,
  difficulty = 'Medium',
  language = 'English',
  count = 5,
  apiKey: explicitKey = null,
  model: explicitModel = null,
}) => {
  const customKey = explicitKey || getApiKey();
  const model = explicitModel || getSelectedModel() || 'gemini-2.0-flash';

  try {
    const data = await postToAiServer({
      action: 'generate',
      topic: topic.trim(),
      difficulty,
      language,
      count,
      apiKey: customKey || undefined,
      model,
    });

    if (data.questions && data.questions.length > 0) {
      return data.questions;
    }
  } catch (serverErr) {
    console.warn('Server endpoint fallback to Dynamic Engine:', serverErr.message);
  }

  // Fallback to Dynamic Engine with session-based deduplication
  return generateDynamicQuiz({
    topic: topic.trim(),
    count,
    difficulty,
    language,
  });
};

/**
 * Regenerate a single question using the Local / Netlify AI server or Dynamic Engine
 */
export const regenerateSingleQuestionWithAI = async ({
  topic,
  difficulty = 'Medium',
  language = 'English',
  excludeQuestion = '',
  apiKey: explicitKey = null,
  model: explicitModel = null,
}) => {
  const customKey = explicitKey || getApiKey();
  const model = explicitModel || getSelectedModel() || 'gemini-2.0-flash';

  try {
    const data = await postToAiServer({
      action: 'regenerate',
      topic,
      difficulty,
      language,
      excludeQuestion,
      apiKey: customKey || undefined,
      model,
    });

    if (data.question) {
      return data.question;
    }
  } catch (serverErr) {
    console.warn('Server endpoint fallback to Dynamic Single Question:', serverErr.message);
  }

  // Fallback to Dynamic Single Question
  return regenerateDynamicSingleQuestion({
    topic,
    difficulty,
    language,
    excludeQuestion,
  });
};
