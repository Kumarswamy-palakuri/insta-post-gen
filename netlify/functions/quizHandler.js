/**
 * QuizCraft AI Server Request Handler
 * Shared between Netlify Serverless Functions and Local Vite Dev Server
 */

import { extractJSONFromText, validateQuestionsList, normalizeQuestion } from '../../src/utils/quizValidator.js';
import { getOfflineSampleQuestion, getOfflineSampleQuestions } from '../../src/utils/sampleQuestions.js';

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
      // ignore discovery failure and propagate original error
    }
  }

  if (!result.resp.ok) {
    const errorMsg = result.data?.error?.message || `Gemini API returned HTTP ${result.status}`;
    if (result.status === 400 && errorMsg.toLowerCase().includes('key')) {
      throw new Error('Invalid Gemini API Key. Please verify your GEMINI_API_KEY environment variable or settings.');
    } else if (result.status === 429) {
      throw new Error('Gemini API rate limit or quota exceeded. Please wait a moment before trying again.');
    }
    throw new Error(errorMsg);
  }

  const rawText = result.data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    if (result.data.candidates?.[0]?.finishReason === 'SAFETY') {
      throw new Error('The requested topic triggered Gemini safety filters. Please try another educational topic.');
    }
    throw new Error('Empty response received from Gemini API.');
  }

  return { rawText, modelUsed: result.modelUsed };
}

/**
 * Main quiz request handler
 */
export async function handleQuizRequest({ method = 'POST', body = {}, query = {}, headers = {} }) {
  // Extract API key: priority to custom key in body/header, then server environment variable
  const headerKey = headers['x-api-key'] || headers['X-Api-Key'];
  const resolvedApiKey = (body.apiKey && body.apiKey.trim()) ||
    (headerKey && headerKey.trim()) ||
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    '';

  const action = body.action || query.action || 'generate';

  // 1. Healthcheck / Info
  if (method === 'GET' || action === 'health') {
    return {
      statusCode: 200,
      data: {
        status: 'ok',
        serverAiConfigured: Boolean(resolvedApiKey),
        environment: process.env.NODE_ENV || 'development',
        defaultModel: 'gemini-2.0-flash',
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
          models: FALLBACK_MODELS.map((id) => ({ id, name: id, desc: 'Gemini model' })),
          serverAiConfigured: false,
        },
      };
    }
    try {
      const models = await fetchAvailableModels(resolvedApiKey);
      return {
        statusCode: 200,
        data: { success: true, models, serverAiConfigured: true },
      };
    } catch (err) {
      return {
        statusCode: 500,
        data: { success: false, error: err.message },
      };
    }
  }

  // 3. Test Connection
  if (action === 'test') {
    if (!resolvedApiKey) {
      return {
        statusCode: 200,
        data: {
          success: false,
          serverAiConfigured: false,
          message: 'No Gemini API key found. Add GEMINI_API_KEY in .env or Netlify Environment Variables.',
        },
      };
    }

    try {
      const available = await fetchAvailableModels(resolvedApiKey);
      const testModel = body.model || 'gemini-2.0-flash';
      const prompt = 'Generate 1 simple math question in JSON format: {"question": "2+2?", "options": {"A":"3","B":"4","C":"5","D":"6"}, "correctAnswer":"B", "explanation":"2+2=4"}';
      const { modelUsed } = await callGeminiApi({
        prompt,
        apiKey: resolvedApiKey,
        model: testModel,
      });

      return {
        statusCode: 200,
        data: {
          success: true,
          message: `Successfully connected to Gemini API via Server using ${modelUsed}!`,
          activeModel: modelUsed,
          availableModels: available,
          source: body.apiKey ? 'custom_client_key' : 'server_environment',
        },
      };
    } catch (err) {
      return {
        statusCode: 200,
        data: {
          success: false,
          message: `Connection test failed: ${err.message}`,
        },
      };
    }
  }

  // 4. Regenerate Single Question
  if (action === 'regenerate') {
    const { topic = 'General Knowledge', difficulty = 'Medium', language = 'English', excludeQuestion = '', model = 'gemini-2.0-flash' } = body;

    // If no API key configured on server and none provided, fallback to sample questions
    if (!resolvedApiKey) {
      const fallbackQ = getOfflineSampleQuestion(topic, difficulty, language);
      return {
        statusCode: 200,
        data: {
          success: true,
          isDemo: true,
          question: fallbackQ,
          message: 'Running in sample demo mode. Set GEMINI_API_KEY in .env or Netlify for custom AI questions.',
        },
      };
    }

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
      const { rawText } = await callGeminiApi({
        prompt,
        apiKey: resolvedApiKey,
        model,
        temperature: 0.85,
      });

      const parsed = extractJSONFromText(rawText);
      const normalized = normalizeQuestion(parsed, topic, difficulty, language);

      if (!normalized) {
        throw new Error('Failed to validate question structure from Gemini response.');
      }

      return {
        statusCode: 200,
        data: {
          success: true,
          question: normalized,
        },
      };
    } catch (err) {
      return {
        statusCode: 500,
        data: {
          success: false,
          error: err.message,
        },
      };
    }
  }

  // 5. Generate Questions (Default)
  const { topic = 'General Knowledge', difficulty = 'Medium', language = 'English', count = 5, model = 'gemini-2.0-flash' } = body;

  // If no API key configured on server and none provided, fallback to sample questions
  if (!resolvedApiKey) {
    const sampleQuestions = getOfflineSampleQuestions(topic, count, difficulty, language);
    return {
      statusCode: 200,
      data: {
        success: true,
        isDemo: true,
        questions: sampleQuestions,
        message: 'Running in demo mode. Set GEMINI_API_KEY in .env or Netlify for custom AI questions.',
      },
    };
  }

  const prompt = `You are an expert exam question creator and educational content creator for Instagram carousels.
Generate exactly ${count} educational multiple-choice quiz questions on the topic: "${topic}".

Parameters:
- Difficulty Level: ${difficulty} (Easy = basic fundamentals; Medium = competitive exams like UPSC/SSC; Hard = advanced specialist level)
- Language: ${language} (If "Telugu", provide question, options, and explanation in Telugu. If "Bilingual", provide English with Telugu translation in parentheses).
- Topic Scope: "${topic}"

Strict JSON Format Requirements:
Return a JSON array of question objects. Example format:
[
  {
    "topic": "${topic}",
    "question": "Clear, concise, educational question text?",
    "options": {
      "A": "Plausible Option A",
      "B": "Plausible Option B",
      "C": "Plausible Option C",
      "D": "Plausible Option D"
    },
    "correctAnswer": "B",
    "explanation": "Brief, informative explanation (1-2 sentences) revealing why this answer is correct and an interesting fact.",
    "difficulty": "${difficulty}",
    "language": "${language}"
  }
]

Rules:
1. Every question must have EXACTLY four options: "A", "B", "C", "D".
2. "correctAnswer" MUST be exactly one uppercase letter: "A", "B", "C", or "D".
3. Factually 100% accurate. Avoid controversial or ambiguous answers.
4. Distractors (wrong options) should be plausible and educational.
5. Avoid duplicate or repetitive questions.
6. Return ONLY the valid JSON array. Do not include markdown code ticks (\`\`\`json) if possible.`;

  try {
    const { rawText } = await callGeminiApi({
      prompt,
      apiKey: resolvedApiKey,
      model,
      temperature: 0.7,
    });

    const parsed = extractJSONFromText(rawText);
    const validatedQuestions = validateQuestionsList(parsed, topic);

    return {
      statusCode: 200,
      data: {
        success: true,
        questions: validatedQuestions,
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      data: {
        success: false,
        error: err.message,
      },
    };
  }
}

