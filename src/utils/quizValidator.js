/**
 * Quiz validator and parser utility
 * Validates, cleans, and structures AI question outputs.
 */

/**
 * Extracts and parses JSON from raw text returned by LLMs
 * Handles markdown code fences (```json ... ```), extra explanatory text, etc.
 */
export const extractJSONFromText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('AI response is empty or not a string.');
  }

  let text = rawText.trim();

  // Strip markdown code fences if present
  const markdownRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = text.match(markdownRegex);
  if (match && match[1]) {
    text = match[1].trim();
  }

  // Attempt to parse directly
  try {
    return JSON.parse(text);
  } catch (initialErr) {
    // If text has surrounding text before/after brackets, find first [ or { and last ] or }
    const firstSquare = text.indexOf('[');
    const lastSquare = text.lastIndexOf(']');
    const firstCurly = text.indexOf('{');
    const lastCurly = text.lastIndexOf('}');

    // Prioritize array if both exist and array brackets are outermost
    if (firstSquare !== -1 && lastSquare !== -1 && (firstCurly === -1 || firstSquare < firstCurly)) {
      const arraySubstring = text.slice(firstSquare, lastSquare + 1);
      try {
        return JSON.parse(arraySubstring);
      } catch (err) {
        // Continue to try other repairs
      }
    }

    if (firstCurly !== -1 && lastCurly !== -1) {
      const objectSubstring = text.slice(firstCurly, lastCurly + 1);
      try {
        return JSON.parse(objectSubstring);
      } catch (err) {
        // Continue
      }
    }

    throw new Error(`Failed to parse AI output as JSON: ${initialErr.message}`);
  }
};

/**
 * Validates and normalizes an individual question object
 */
export const normalizeQuestion = (q, defaultTopic = 'General Knowledge', defaultDifficulty = 'Medium', defaultLanguage = 'English') => {
  if (!q || typeof q !== 'object') return null;

  const questionText = (q.question || q.title || q.prompt || '').trim();
  if (!questionText) return null;

  // Options normalization
  let options = { A: '', B: '', C: '', D: '' };
  if (Array.isArray(q.options)) {
    options.A = q.options[0]?.text || q.options[0] || 'Option A';
    options.B = q.options[1]?.text || q.options[1] || 'Option B';
    options.C = q.options[2]?.text || q.options[2] || 'Option C';
    options.D = q.options[3]?.text || q.options[3] || 'Option D';
  } else if (q.options && typeof q.options === 'object') {
    options.A = String(q.options.A || q.options.a || q.options['1'] || '').trim();
    options.B = String(q.options.B || q.options.b || q.options['2'] || '').trim();
    options.C = String(q.options.C || q.options.c || q.options['3'] || '').trim();
    options.D = String(q.options.D || q.options.d || q.options['4'] || '').trim();
  }

  // Ensure all 4 options exist
  if (!options.A || !options.B || !options.C || !options.D) {
    return null;
  }

  // Correct answer normalization
  let rawAnswer = String(q.correctAnswer || q.answer || q.correct || 'A').toUpperCase().trim();
  // If AI gave full answer text instead of key (e.g. "B) Chandragupta Maurya" or "Chandragupta Maurya")
  let correctAnswer = 'A';
  if (['A', 'B', 'C', 'D'].includes(rawAnswer)) {
    correctAnswer = rawAnswer;
  } else if (rawAnswer.startsWith('A') || rawAnswer.startsWith('OPTION A')) {
    correctAnswer = 'A';
  } else if (rawAnswer.startsWith('B') || rawAnswer.startsWith('OPTION B')) {
    correctAnswer = 'B';
  } else if (rawAnswer.startsWith('C') || rawAnswer.startsWith('OPTION C')) {
    correctAnswer = 'C';
  } else if (rawAnswer.startsWith('D') || rawAnswer.startsWith('OPTION D')) {
    correctAnswer = 'D';
  } else {
    // Try matching answer text with options
    for (const key of ['A', 'B', 'C', 'D']) {
      if (options[key].toLowerCase() === rawAnswer.toLowerCase()) {
        correctAnswer = key;
        break;
      }
    }
  }

  const explanation = (q.explanation || q.reason || `${options[correctAnswer]} is the correct answer.`).trim();
  const topic = (q.topic || defaultTopic).trim();
  const difficulty = (q.difficulty || defaultDifficulty).trim();
  const language = (q.language || defaultLanguage).trim();

  return {
    id: q.id || `q_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    topic,
    question: questionText,
    options,
    correctAnswer,
    explanation,
    difficulty,
    language,
  };
};

/**
 * Validates a list of questions, cleans duplicates, and returns validated items
 */
export const validateQuestionsList = (rawParsed, fallbackTopic = 'General Knowledge') => {
  let list = [];
  if (Array.isArray(rawParsed)) {
    list = rawParsed;
  } else if (rawParsed && Array.isArray(rawParsed.questions)) {
    list = rawParsed.questions;
  } else if (rawParsed && typeof rawParsed === 'object') {
    list = [rawParsed];
  }

  const normalized = [];
  const seenQuestions = new Set();

  for (const item of list) {
    const valid = normalizeQuestion(item, fallbackTopic);
    if (!valid) continue;

    // Check duplicate by normalized text
    const key = valid.question.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seenQuestions.has(key)) {
      seenQuestions.add(key);
      normalized.push(valid);
    }
  }

  if (normalized.length === 0) {
    throw new Error('No valid questions could be extracted from the AI output. Please try again.');
  }

  return normalized;
};

