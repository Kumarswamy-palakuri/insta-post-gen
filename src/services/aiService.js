/**
 * AI Service for Gemini REST API integration (Frontend Direct)
 * Interacts directly with Google Gemini API endpoints from browser.
 */

import { getApiKey, getSelectedModel, setSelectedModel } from '../utils/storage';
import { extractJSONFromText, validateQuestionsList, normalizeQuestion } from '../utils/quizValidator';

export const AVAILABLE_MODELS = [
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Next-Gen Fast & Recommended)', desc: 'Fastest generation, highest availability' },
  { id: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash Latest', desc: 'Latest 1.5 Flash alias' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', desc: 'Standard 1.5 Flash' },
  { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro (Deep Reasoning)', desc: 'High depth for complex academic questions' },
];

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * List models dynamically available for the provided Gemini API key
 */
export const listAvailableModels = async (apiKey) => {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('API key cannot be empty.');
  }

  const endpoint = `${GEMINI_BASE_URL}?key=${apiKey.trim()}`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  if (!response.ok) {
    const errMsg = data.error?.message || `API error (${response.status}): ${response.statusText}`;
    throw new Error(errMsg);
  }

  if (!data.models || !Array.isArray(data.models)) {
    return [];
  }

  // Filter only models that support 'generateContent'
  const generationModels = data.models
    .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
    .map((m) => {
      const cleanId = m.name.replace(/^models\//, '');
      return {
        id: cleanId,
        name: m.displayName || cleanId,
        desc: m.description || '',
      };
    });

  // Sort prioritizing flash & modern models
  generationModels.sort((a, b) => {
    const aFlash = a.id.includes('flash') ? -1 : 1;
    const bFlash = b.id.includes('flash') ? -1 : 1;
    return aFlash - bFlash;
  });

  return generationModels;
};

/**
 * Test Gemini API connection
 * If the requested model is not found, automatically discovers supported models and switches to a working one!
 */
export const testApiConnection = async (apiKey, requestedModel = 'gemini-2.0-flash') => {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, message: 'API key cannot be empty.' };
  }

  const key = apiKey.trim();

  try {
    // 1. Fetch available models for this key to verify authentication
    let availableModels = [];
    try {
      availableModels = await listAvailableModels(key);
    } catch (listErr) {
      return { success: false, message: listErr.message };
    }

    if (availableModels.length === 0) {
      return {
        success: false,
        message: 'The provided API key does not have access to any generateContent models.',
      };
    }

    // 2. Pick the best model to test
    // Check if requestedModel is available
    let modelToTest = requestedModel;
    const isRequestedAvailable = availableModels.some((m) => m.id === requestedModel);

    if (!isRequestedAvailable) {
      // Find the first flash or top model
      const preferred =
        availableModels.find((m) => m.id.includes('2.0-flash')) ||
        availableModels.find((m) => m.id.includes('flash-latest')) ||
        availableModels.find((m) => m.id.includes('1.5-flash')) ||
        availableModels.find((m) => m.id.includes('flash')) ||
        availableModels[0];

      modelToTest = preferred ? preferred.id : availableModels[0].id;
    }

    // 3. Test generateContent with modelToTest
    const endpoint = `${GEMINI_BASE_URL}/${modelToTest}:generateContent?key=${key}`;
    const payload = {
      contents: [{ parts: [{ text: 'Respond with the single word: "OK"' }] }],
      generationConfig: {
        maxOutputTokens: 10,
        temperature: 0.1,
      },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data.error?.message || `API error (${response.status}): ${response.statusText}`;
      return { success: false, message: errMsg, availableModels };
    }

    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidate) {
      // Auto-save working model
      setSelectedModel(modelToTest);

      const notice = modelToTest !== requestedModel
        ? `Connected! "${requestedModel}" was unavailable for your key, so QuizCraft automatically switched to supported model "${modelToTest}".`
        : `Connection successful! Active model: "${modelToTest}".`;

      return {
        success: true,
        message: notice,
        activeModel: modelToTest,
        availableModels,
      };
    } else {
      return { success: false, message: 'Unexpected response format from Gemini API.', availableModels };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Network error while reaching Gemini API. Check your connection.',
    };
  }
};

/**
 * Generate Quiz Questions using Gemini API
 */
export const generateQuestionsWithAI = async ({
  topic,
  difficulty = 'Medium',
  language = 'English',
  count = 5,
  apiKey: explicitKey = null,
  model: explicitModel = null,
}) => {
  const apiKey = explicitKey || getApiKey();
  let model = explicitModel || getSelectedModel() || 'gemini-2.0-flash';

  if (!apiKey) {
    const err = new Error('No Gemini API Key found. Please add your API key in Settings, or generate with Sample/Demo mode.');
    err.code = 'NO_API_KEY';
    throw err;
  }

  let languageInstruction = 'English';
  if (language === 'Telugu') {
    languageInstruction = 'Telugu (both the questions, options, and explanations must be in accurate Telugu script)';
  } else if (language === 'Bilingual') {
    languageInstruction = 'Bilingual (Provide English followed by Telugu translation in parentheses for question and options, e.g., "Question text (ప్రశ్న పాఠ్యం)")';
  }

  const prompt = `You are an expert educator and competitive exam quiz designer for social media (Instagram educational pages).
Generate ${count} high-quality, engaging multiple-choice quiz questions on the topic: "${topic}".

Difficulty: ${difficulty}
Language: ${languageInstruction}

Strict JSON schema requirement:
Return a JSON array containing exactly ${count} objects.
Each object MUST strictly adhere to this format:
{
  "topic": "${topic}",
  "question": "Clear, concise, engaging question suitable for an Instagram post image",
  "options": {
    "A": "First realistic option",
    "B": "Second realistic option",
    "C": "Third realistic option",
    "D": "Fourth realistic option"
  },
  "correctAnswer": "A",
  "explanation": "Brief, informative explanation (1-2 sentences) revealing why this answer is correct and an interesting fact.",
  "difficulty": "${difficulty}",
  "language": "${language}"
}

Rules:
1. Every question must have EXACTLY four options: "A", "B", "C", "D".
2. "correctAnswer" MUST be exactly one uppercase letter: "A", "B", "C", or "D".
3. Factually 100% accurate. Avoid controversial or ambiguous answers.
4. Distractors (wrong options) should be plausible and educational.
5. Avoid duplicate or repetitive questions.
6. Return ONLY the valid JSON array. Do not include markdown code ticks (\`\`\`json) if possible, or wrap properly.`;

  const makeRequest = async (targetModel) => {
    const endpoint = `${GEMINI_BASE_URL}/${targetModel}:generateContent?key=${apiKey.trim()}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        responseMimeType: 'application/json',
      },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return { response, status: response.status, data: await response.json() };
  };

  let reqResult;
  try {
    reqResult = await makeRequest(model);
  } catch (netErr) {
    throw new Error(`Network failure connecting to Gemini API: ${netErr.message}`);
  }

  // If model is not found (404), auto-detect available models and retry
  if (
    !reqResult.response.ok &&
    (reqResult.status === 404 || reqResult.data.error?.message?.toLowerCase().includes('not found'))
  ) {
    try {
      const models = await listAvailableModels(apiKey);
      const fallbackModel =
        models.find((m) => m.id.includes('2.0-flash'))?.id ||
        models.find((m) => m.id.includes('flash-latest'))?.id ||
        models.find((m) => m.id.includes('flash'))?.id ||
        models[0]?.id;

      if (fallbackModel && fallbackModel !== model) {
        model = fallbackModel;
        setSelectedModel(fallbackModel);
        reqResult = await makeRequest(model);
      }
    } catch (discoveryErr) {
      // Continue to error reporting below
    }
  }

  if (!reqResult.response.ok) {
    const errorDetails = reqResult.data.error?.message || `Gemini API returned status ${reqResult.status}`;
    if (reqResult.status === 400 && errorDetails.toLowerCase().includes('key')) {
      throw new Error('Invalid Gemini API Key. Please verify your key in Settings.');
    } else if (reqResult.status === 429) {
      throw new Error('Gemini API quota/rate limit exceeded. Please wait a moment or try again.');
    }
    throw new Error(errorDetails);
  }

  const rawText = reqResult.data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    if (reqResult.data.candidates?.[0]?.finishReason === 'SAFETY') {
      throw new Error('The requested topic triggered Gemini safety filters. Please try a different educational topic.');
    }
    throw new Error('Empty response received from Gemini API.');
  }

  // Parse and validate the response
  const parsed = extractJSONFromText(rawText);
  const validatedQuestions = validateQuestionsList(parsed, topic);

  return validatedQuestions;
};

/**
 * Regenerate a single question with fresh content
 */
export const regenerateSingleQuestionWithAI = async ({
  topic,
  difficulty = 'Medium',
  language = 'English',
  excludeQuestion = '',
  apiKey: explicitKey = null,
  model: explicitModel = null,
}) => {
  const apiKey = explicitKey || getApiKey();
  const model = explicitModel || getSelectedModel() || 'gemini-2.0-flash';

  if (!apiKey) {
    return getOfflineSampleQuestion(topic, difficulty, language);
  }

  const prompt = `Generate a single fresh, high-quality multiple choice question on the topic: "${topic}".
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

  let targetModel = model;
  const makeSingleReq = async (m) => {
    const endpoint = `${GEMINI_BASE_URL}/${m}:generateContent?key=${apiKey.trim()}`;
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.85,
          responseMimeType: 'application/json',
        },
      }),
    });
    return { resp, status: resp.status, data: await resp.json() };
  };

  let result = await makeSingleReq(targetModel);

  if (!result.resp.ok && (result.status === 404 || result.data.error?.message?.toLowerCase().includes('not found'))) {
    try {
      const models = await listAvailableModels(apiKey);
      const fallbackModel =
        models.find((m) => m.id.includes('2.0-flash'))?.id ||
        models.find((m) => m.id.includes('flash-latest'))?.id ||
        models.find((m) => m.id.includes('flash'))?.id ||
        models[0]?.id;

      if (fallbackModel && fallbackModel !== targetModel) {
        targetModel = fallbackModel;
        setSelectedModel(fallbackModel);
        result = await makeSingleReq(targetModel);
      }
    } catch (e) {
      // ignore
    }
  }

  if (!result.resp.ok) {
    throw new Error(result.data.error?.message || 'Failed to regenerate question.');
  }

  const rawText = result.data.candidates?.[0]?.content?.parts?.[0]?.text;
  const parsed = extractJSONFromText(rawText);
  const normalized = normalizeQuestion(parsed, topic, difficulty, language);

  if (!normalized) {
    throw new Error('Failed to parse regenerated question.');
  }

  return normalized;
};

/**
 * Curated offline fallback questions library
 */
export const SAMPLE_QUESTIONS_LIBRARY = {
  'Indian History': [
    {
      topic: 'Indian History',
      question: 'Who founded the Maurya Empire with the guidance of Chanakya?',
      options: {
        A: 'Ashoka the Great',
        B: 'Chandragupta Maurya',
        C: 'Bindusara',
        D: 'Harshavardhana',
      },
      correctAnswer: 'B',
      explanation: 'Chandragupta Maurya founded the Maurya Empire in 322 BCE after overthrowing the Nanda Dynasty with the mentorship of Chanakya.',
      difficulty: 'Easy',
      language: 'English',
    },
    {
      topic: 'Indian History',
      question: 'In which year did the historic Battle of Plassey take place?',
      options: {
        A: '1757',
        B: '1764',
        C: '1857',
        D: '1761',
      },
      correctAnswer: 'A',
      explanation: 'The Battle of Plassey was fought on June 23, 1757, leading to British East India Company control over Bengal.',
      difficulty: 'Medium',
      language: 'English',
    },
    {
      topic: 'Indian History',
      question: 'Which Mughal Emperor built the iconic Buland Darwaza at Fatehpur Sikri?',
      options: {
        A: 'Babur',
        B: 'Shah Jahan',
        C: 'Akbar',
        D: 'Jahangir',
      },
      correctAnswer: 'C',
      explanation: 'Akbar built the Buland Darwaza in 1601 to commemorate his victory over Gujarat.',
      difficulty: 'Medium',
      language: 'English',
    },
  ],
  'Indian Polity': [
    {
      topic: 'Indian Polity',
      question: 'Which article of the Indian Constitution guarantees the "Right to Constitutional Remedies"?',
      options: {
        A: 'Article 19',
        B: 'Article 21',
        C: 'Article 32',
        D: 'Article 44',
      },
      correctAnswer: 'C',
      explanation: 'Dr. B.R. Ambedkar called Article 32 the "Heart and Soul of the Constitution" as it empowers citizens to move the Supreme Court for enforcement of fundamental rights.',
      difficulty: 'Medium',
      language: 'English',
    },
    {
      topic: 'Indian Polity',
      question: 'What is the minimum age required to become the President of India?',
      options: {
        A: '25 years',
        B: '30 years',
        C: '35 years',
        D: '40 years',
      },
      correctAnswer: 'C',
      explanation: 'According to Article 58 of the Constitution, a citizen must have completed 35 years of age to be eligible for election as President.',
      difficulty: 'Easy',
      language: 'English',
    },
  ],
  'Geography': [
    {
      topic: 'Geography',
      question: 'Which is the highest peak in the Western Ghats (Sahyadri) range?',
      options: {
        A: 'Doddabetta',
        B: 'Anamudi',
        C: 'Kalsubai',
        D: 'Mullayanagiri',
      },
      correctAnswer: 'B',
      explanation: 'Anamudi in Kerala stands at 2,695 meters (8,842 ft) and is the highest peak in South India and the Western Ghats.',
      difficulty: 'Medium',
      language: 'English',
    },
    {
      topic: 'Geography',
      question: 'Which river forms the famous Victoria Falls?',
      options: {
        A: 'Nile',
        B: 'Congo',
        C: 'Zambezi',
        D: 'Amazon',
      },
      correctAnswer: 'C',
      explanation: "The Victoria Falls is located on the Zambezi River between Zambia and Zimbabwe, one of the world's largest waterfalls.",
      difficulty: 'Medium',
      language: 'English',
    },
  ],
  'Computer Knowledge': [
    {
      topic: 'Computer Knowledge',
      question: 'Which protocol is responsible for secure encrypted communication across the World Wide Web?',
      options: {
        A: 'HTTP',
        B: 'FTP',
        C: 'HTTPS',
        D: 'SMTP',
      },
      correctAnswer: 'C',
      explanation: 'HTTPS (HyperText Transfer Protocol Secure) encrypts communication using TLS/SSL to safeguard user credentials and data.',
      difficulty: 'Easy',
      language: 'English',
    },
    {
      topic: 'Computer Knowledge',
      question: 'What does "SQL" stand for in database management systems?',
      options: {
        A: 'Structured Query Language',
        B: 'Simple Question Logic',
        C: 'Standard Quantum Language',
        D: 'System Quality Link',
      },
      correctAnswer: 'A',
      explanation: 'SQL stands for Structured Query Language, the standardized domain-specific language for managing relational databases.',
      difficulty: 'Easy',
      language: 'English',
    },
  ],
  'General Knowledge': [
    {
      topic: 'General Knowledge',
      question: 'Which country is widely known as the "Land of the Rising Sun"?',
      options: {
        A: 'China',
        B: 'South Korea',
        C: 'Japan',
        D: 'Norway',
      },
      correctAnswer: 'C',
      explanation: 'Japan is called "Nihon" or "Nippon" which translates literally to "sun origin" or the Land of the Rising Sun.',
      difficulty: 'Easy',
      language: 'English',
    },
    {
      topic: 'General Knowledge',
      question: 'Which organ in the human body is primarily responsible for filtering blood and producing urine?',
      options: {
        A: 'Liver',
        B: 'Kidneys',
        C: 'Lungs',
        D: 'Pancreas',
      },
      correctAnswer: 'B',
      explanation: 'The kidneys filter about 120 to 150 quarts of blood daily to produce 1 to 2 quarts of urine, maintaining body fluid balance.',
      difficulty: 'Easy',
      language: 'English',
    },
  ],
};

/**
 * Get offline sample question for quick testing
 */
export const getOfflineSampleQuestion = (topic = 'General Knowledge', difficulty = 'Medium', language = 'English') => {
  const categoryPool = SAMPLE_QUESTIONS_LIBRARY[topic] || SAMPLE_QUESTIONS_LIBRARY['General Knowledge'];
  const randomPick = categoryPool[Math.floor(Math.random() * categoryPool.length)];
  return {
    ...randomPick,
    id: `q_sample_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    topic,
    difficulty,
    language,
  };
};

/**
 * Get multiple offline sample questions
 */
export const getOfflineSampleQuestions = (topic = 'General Knowledge', count = 5, difficulty = 'Medium', language = 'English') => {
  let pool = [];
  if (SAMPLE_QUESTIONS_LIBRARY[topic]) {
    pool = [...SAMPLE_QUESTIONS_LIBRARY[topic]];
  } else {
    Object.values(SAMPLE_QUESTIONS_LIBRARY).forEach((arr) => pool.push(...arr));
  }

  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const selected = [];

  for (let i = 0; i < count; i++) {
    const base = shuffled[i % shuffled.length];
    selected.push({
      ...base,
      id: `q_offline_${Date.now()}_${i}`,
      topic: topic || base.topic,
      difficulty,
      language,
    });
  }

  return selected;
};
