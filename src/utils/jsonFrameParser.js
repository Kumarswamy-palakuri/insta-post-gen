/**
 * JSON to Frame Parser & Validator
 * Converts raw JSON text or objects into structured Instagram Quiz Card frames.
 */

/**
 * Parses and validates raw JSON input for Instagram Post Frames
 * @param {string|object} input - Raw JSON string or JS object/array
 * @returns {{ success: boolean, questions?: Array, error?: string, line?: number }}
 */
export function parseQuizJsonToFrames(input) {
  if (!input) {
    return { success: false, error: 'Please enter or paste your quiz JSON.' };
  }

  let parsedData = input;

  // If input is string, clean markdown code blocks and parse JSON
  if (typeof input === 'string') {
    let cleanText = input.trim();

    // Strip markdown code fences if present (e.g. ```json ... ```)
    const codeBlockMatch = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (codeBlockMatch && codeBlockMatch[1]) {
      cleanText = codeBlockMatch[1].trim();
    }

    try {
      parsedData = JSON.parse(cleanText);
    } catch (parseErr) {
      // Extract line number from error message if available
      let errorLine = null;
      const lineMatch = parseErr.message.match(/at position (\d+)/i);
      if (lineMatch && lineMatch[1]) {
        const pos = parseInt(lineMatch[1], 10);
        errorLine = cleanText.substring(0, pos).split('\n').length;
      }
      return {
        success: false,
        error: `Invalid JSON syntax: ${parseErr.message}${errorLine ? ` (around line ${errorLine})` : ''}`,
        line: errorLine,
      };
    }
  }

  // Allow single object or array of objects
  const rawList = Array.isArray(parsedData) ? parsedData : [parsedData];

  if (rawList.length === 0) {
    return { success: false, error: 'JSON array is empty. Please provide at least 1 question object.' };
  }

  const normalizedQuestions = [];

  for (let i = 0; i < rawList.length; i++) {
    const item = rawList[i];
    if (!item || typeof item !== 'object') {
      return { success: false, error: `Item ${i + 1} in JSON is not an object.` };
    }

    const questionText = (item.question || item.title || item.prompt || '').trim();
    if (!questionText) {
      return { success: false, error: `Item ${i + 1} is missing a "question" field.` };
    }

    // Normalize options
    let options = { A: '', B: '', C: '', D: '' };
    if (Array.isArray(item.options)) {
      options.A = String(item.options[0] ?? 'Option A').trim();
      options.B = String(item.options[1] ?? 'Option B').trim();
      options.C = String(item.options[2] ?? 'Option C').trim();
      options.D = String(item.options[3] ?? 'Option D').trim();
    } else if (item.options && typeof item.options === 'object') {
      options.A = String(item.options.A || item.options.a || item.options['1'] || '').trim();
      options.B = String(item.options.B || item.options.b || item.options['2'] || '').trim();
      options.C = String(item.options.C || item.options.c || item.options['3'] || '').trim();
      options.D = String(item.options.D || item.options.d || item.options['4'] || '').trim();
    }

    if (!options.A || !options.B || !options.C || !options.D) {
      return {
        success: false,
        error: `Item ${i + 1} ("${questionText.substring(0, 30)}...") must include 4 options (A, B, C, D).`,
      };
    }

    // Normalize correct answer
    let rawAns = String(item.correctAnswer || item.answer || item.correct || 'A').toUpperCase().trim();
    let correctAnswer = 'A';

    if (['A', 'B', 'C', 'D'].includes(rawAns)) {
      correctAnswer = rawAns;
    } else {
      // Check if user provided option text instead of letter key
      const matchKey = Object.keys(options).find(
        (k) => options[k].toLowerCase() === rawAns.toLowerCase()
      );
      if (matchKey) {
        correctAnswer = matchKey;
      } else if (rawAns.startsWith('A')) correctAnswer = 'A';
      else if (rawAns.startsWith('B')) correctAnswer = 'B';
      else if (rawAns.startsWith('C')) correctAnswer = 'C';
      else if (rawAns.startsWith('D')) correctAnswer = 'D';
    }

    normalizedQuestions.push({
      id: item.id || `frame_q_${Date.now()}_${i}`,
      topic: (item.topic || item.category || 'General Knowledge').trim(),
      difficulty: (item.difficulty || 'Medium').trim(),
      language: (item.language || 'English').trim(),
      question: questionText,
      options,
      correctAnswer,
      explanation: (
        item.explanation ||
        item.solution ||
        item.reason ||
        `Correct answer is (${correctAnswer}) ${options[correctAnswer]}.`
      ).trim(),
    });
  }

  return {
    success: true,
    questions: normalizedQuestions,
  };
}

