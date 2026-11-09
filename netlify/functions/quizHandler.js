/**
 * QuizCraft AI Server Request Handler
 * Shared between Netlify Serverless Functions and Local Vite Dev Server
 * Supports:
 * 1. Google Gemini AI (if GEMINI_API_KEY is provided)
 * 2. Free AI Engine (Zero API Key required)
 * 3. Dynamic Procedural Question Engine with session tracking (Zero repeats guaranteed)
 */

import { extractJSONFromText, validateQuestionsList, normalizeQuestion } from '../../src/utils/quizValidator.js';
import { generateDynamicQuiz, regenerateDynamicSingleQuestion } from '../../src/utils/dynamicQuizEngine.js';

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

const FALLBACK_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-1.5-pro-latest',
];

/**
 * List supported models from Gemini API
 */
async function fetchAvailableModels(apiKey) {
  if (!apiKey || !apiKey.trim()) return [];
  const endpoint = `${GEMINI_BASE_URL}?key=${apiKey.trim()}`;
  try {
    const resp = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await resp.json();
    if (!resp.ok || !data.models) return [];

    return data.models
      .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
      .map((m) => {
        const cleanId = m.name.replace(/^models\//, '');
        return {
          id: cleanId,
          name: m.displayName || cleanId,
          desc: m.description || '',
        };
      })
      .sort((a, b) => (a.id.includes('flash') ? -1 : 1));
  } catch (e) {
    return [];
  }
}

/**
 * Execute Gemini generateContent request with automatic fallback
 */
async function callGeminiApi({ prompt, apiKey, model = 'gemini-2.0-flash', temperature = 0.7 }) {
  let targetModel = model;

  const doRequest = async (m) => {
    const endpoint = `${GEMINI_BASE_URL}/${m}:generateContent?key=${apiKey.trim()}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        topP: 0.95,
        responseMimeType: 'application/json',
      },
    };

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await resp.json();
    return { resp, status: resp.status, data, modelUsed: m };
  };

  let result = await doRequest(targetModel);

  // If model not found (404), attempt discovery & fallback
  if (!result.resp.ok && (result.status === 404 || result.data?.error?.message?.toLowerCase().includes('not found'))) {
    try {
      const available = await fetchAvailableModels(apiKey);
      const fallback =
        available.find((m) => m.id.includes('2.0-flash'))?.id ||
        available.find((m) => m.id.includes('flash-latest'))?.id ||
        available.find((m) => m.id.includes('flash'))?.id ||
        available[0]?.id;

      if (fallback && fallback !== targetModel) {
        result = await doRequest(fallback);
      }
    } catch (e) {
      // ignore
    }
  }

  if (!result.resp.ok) {
    const errorMsg = result.data?.error?.message || `Gemini API returned HTTP ${result.status}`;
    if (result.status === 400 && errorMsg.toLowerCase().includes('key')) {
      throw new Error('Invalid Gemini API Key.');
    } else if (result.status === 429) {
      throw new Error('Gemini API rate limit exceeded.');
    }
    throw new Error(errorMsg);
  }

  const rawText = result.data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('Empty response received from Gemini API.');
  }

  return { rawText, modelUsed: result.modelUsed };
}

/**
 * Call Free Dynamic AI Engine (Zero API Key required)
 */
async function callFreeAiApi(prompt) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6500);

  try {
    const resp = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        jsonMode: true,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!resp.ok) return null;
    const text = await resp.text();
    return text;
  } catch (e) {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * Main quiz request handler
 */
export async function handleQuizRequest({ method = 'POST', body = {}, query = {}, headers = {} }) {
  const headerKey = headers['x-api-key'] || headers['X-Api-Key'];
  const resolvedApiKey =
    (body.apiKey && body.apiKey.trim()) ||
    (headerKey && headerKey.trim()) ||
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    '';

  const action = body.action || query.action || 'generate';

  // 1. Healthcheck
  if (method === 'GET' || action === 'health') {
    return {
      statusCode: 200,
      data: {
        status: 'ok',
        mode: resolvedApiKey ? 'gemini_api' : 'free_dynamic_engine',
        message: 'QuizCraft AI Engine active (zero key required)',
      },
    };
  }

  // 2. Models Discovery
  if (action === 'models') {
    if (!resolvedApiKey) {
      return {
        statusCode: 200,
        data: {
          success: true,
          models: FALLBACK_MODELS.map((id) => ({ id, name: id, desc: 'Free AI / Gemini Engine' })),
          isFreeEngine: true,
        },
      };
    }
    try {
      const models = await fetchAvailableModels(resolvedApiKey);
      return {
        statusCode: 200,
        data: { success: true, models: models.length ? models : FALLBACK_MODELS },
      };
    } catch (err) {
      return {
        statusCode: 200,
        data: { success: true, models: FALLBACK_MODELS },
      };
    }
  }

  // 3. Test Connection
  if (action === 'test') {
    if (!resolvedApiKey) {
      return {
        statusCode: 200,
        data: {
          success: true,
          message: 'Free AI Engine active! You do not need any API key. Generates brand new questions every time.',
          isFreeEngine: true,
          activeModel: 'Free Dynamic AI Engine',
        },
      };
    }

    try {
      const testModel = body.model || 'gemini-2.0-flash';
      const prompt = 'Return JSON: [{"question": "What is 2+2?", "options": {"A":"3","B":"4","C":"5","D":"6"}, "correctAnswer":"B", "explanation":"2+2=4"}]';
      const { modelUsed } = await callGeminiApi({
        prompt,
        apiKey: resolvedApiKey,
        model: testModel,
      });

      return {
        statusCode: 200,
        data: {
          success: true,
          message: `Connected to Gemini API via Server using ${modelUsed}!`,
          activeModel: modelUsed,
          source: body.apiKey ? 'custom_client_key' : 'server_environment',
        },
      };
    } catch (err) {
      return {
        statusCode: 200,
        data: {
          success: true,
          message: `Gemini key error (${err.message}). Automatically switched to Free AI Engine!`,
          isFreeEngine: true,
        },
      };
    }
  }

  // 4. Regenerate Single Question
  if (action === 'regenerate') {
    const { topic = 'General Knowledge', difficulty = 'Medium', language = 'English', excludeQuestion = '', model = 'gemini-2.0-flash' } = body;

    // A) If Gemini API Key is configured, use Gemini
    if (resolvedApiKey) {
      const prompt = `Generate a single fresh, factually accurate multiple choice question on the topic: "${topic}".
Difficulty: ${difficulty}
Language: ${language}
${excludeQuestion ? `Do NOT generate this question or anything similar to: "${excludeQuestion}"` : ''}

Strict JSON format:
{
  "topic": "${topic}",
  "question": "Question text here",
  "options": {
    "A": "Option 1",
    "B": "Option 2",
    "C": "Option 3",
    "D": "Option 4"
  },
  "correctAnswer": "A",
  "explanation": "Brief explanation why",
  "difficulty": "${difficulty}",
  "language": "${language}"
}

Return ONLY raw JSON object.`;

      try {
        const { rawText } = await callGeminiApi({ prompt, apiKey: resolvedApiKey, model, temperature: 0.85 });
        const parsed = extractJSONFromText(rawText);
        const normalized = normalizeQuestion(parsed, topic, difficulty, language);
        if (normalized) {
          return { statusCode: 200, data: { success: true, question: normalized } };
        }
      } catch (err) {
        // Fallback to Free Dynamic Engine
      }
    }

    // B) Free Dynamic Engine (Never repeats!)
    const singleQ = regenerateDynamicSingleQuestion({ topic, difficulty, language, excludeQuestion });
    return {
      statusCode: 200,
      data: {
        success: true,
        question: singleQ,
      },
    };
  }

  // 5. Generate Questions (Default)
  const { topic = 'General Knowledge', difficulty = 'Medium', language = 'English', count = 5, model = 'gemini-2.0-flash' } = body;

  // A) If Gemini API key is configured, use Gemini
  if (resolvedApiKey) {
    const prompt = `You are an expert exam question creator for Instagram educational carousels.
Generate exactly ${count} educational multiple-choice quiz questions on the topic: "${topic}".
Parameters:
- Difficulty Level: ${difficulty}
- Language: ${language}
- Topic Scope: "${topic}"

Strict JSON format (array of objects):
[
  {
    "topic": "${topic}",
    "question": "Clear, concise question?",
    "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
    "correctAnswer": "B",
    "explanation": "Brief explanation of why it is correct and interesting fact.",
    "difficulty": "${difficulty}",
    "language": "${language}"
  }
]
Return ONLY JSON array.`;

    try {
      const { rawText } = await callGeminiApi({ prompt, apiKey: resolvedApiKey, model, temperature: 0.75 });
      const parsed = extractJSONFromText(rawText);
      const validated = validateQuestionsList(parsed, topic);
      if (validated && validated.length > 0) {
        return {
          statusCode: 200,
          data: { success: true, questions: validated },
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to Free AI Engine:', err.message);
    }
  }

  // B) Try Free AI Engine (Zero API Key required)
  const freeAiPrompt = `Generate exactly ${count} educational multiple choice questions on the topic "${topic}".
Difficulty: ${difficulty}
Language: ${language}
Strict JSON format:
[
  {
    "topic": "${topic}",
    "question": "Question text here?",
    "options": { "A": "Option 1", "B": "Option 2", "C": "Option 3", "D": "Option 4" },
    "correctAnswer": "A",
    "explanation": "Brief explanation",
    "difficulty": "${difficulty}",
    "language": "${language}"
  }
]
Return ONLY raw JSON array.`;

  try {
    const freeAiText = await callFreeAiApi(freeAiPrompt);
    if (freeAiText) {
      const parsed = extractJSONFromText(freeAiText);
      const validated = validateQuestionsList(parsed, topic);
      if (validated && validated.length >= count) {
        return {
          statusCode: 200,
          data: {
            success: true,
            questions: validated.slice(0, count),
            source: 'free_ai_engine',
          },
        };
      }
    }
  } catch (err) {
    // continue to dynamic engine
  }

  // C) Free Dynamic Quiz Engine with Session Deduplication
  // Guaranteed brand new questions every time without repeat!
  const dynamicQuestions = generateDynamicQuiz({
    topic,
    count,
    difficulty,
    language,
  });

  return {
    statusCode: 200,
    data: {
      success: true,
      questions: dynamicQuestions,
      source: 'dynamic_engine',
    },
  };
}
