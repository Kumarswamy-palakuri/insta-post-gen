/**
 * AI Quiz Prompt Generator Utility
 * Auto-generates structured prompts formatted for Local LLMs (Ollama, LM Studio) and Web AIs (ChatGPT, Claude, DeepSeek).
 */

export const SUGGESTED_TOPICS = [
  'Indian History',
  'General Science',
  'Geography',
  'Indian Polity & Constitution',
  'Computer Knowledge & AI',
  'Current Affairs',
  'Economics & Banking',
  'Sports',
  'English Grammar',
  'Telugu Literature & History',
  'Custom Topic',
];

export const DIFFICULTY_LEVELS = [
  { id: 'Easy', label: 'Easy (Beginner Friendly)' },
  { id: 'Medium', label: 'Medium (Standard)' },
  { id: 'Hard', label: 'Hard (Challenging)' },
  { id: 'Competitive Exam', label: 'Competitive Exam (UPSC / SSC / State PSC)' },
];

export const LANGUAGES = [
  'English',
  'Telugu',
  'Hindi',
  'Bilingual (English + Telugu)',
  'Bilingual (English + Hindi)',
  'Spanish',
  'Tamil',
];

export const QUIZ_STYLES = [
  'Competitive Exam Preparation (UPSC / SSC / Banking)',
  'General Knowledge & Trivia',
  'High-Yield Viral Facts (Instagram Carousel)',
  'School & College Students',
];

/**
 * Builds the exact prompt formatted for local and cloud LLMs
 */
export function buildQuizPrompt({
  topic = 'Indian History',
  customTopic = '',
  questionCount = 5,
  difficulty = 'Medium',
  language = 'English',
  style = 'Competitive Exam Preparation (UPSC / SSC / Banking)',
  additionalNotes = '',
}) {
  const effectiveTopic = topic === 'Custom Topic' ? (customTopic.trim() || 'General Knowledge') : topic;

  return `You are an expert exam quiz creator for Instagram educational carousel posts.
Generate exactly ${questionCount} educational multiple-choice quiz questions on the topic: "${effectiveTopic}".

PARAMETERS:
- Number of Questions: ${questionCount}
- Difficulty Level: ${difficulty}
- Language: ${language}
- Target Context / Style: ${style}${additionalNotes.trim() ? `\n- Specific Scope / Focus: ${additionalNotes.trim()}` : ''}

OUTPUT FORMAT REQUIREMENTS:
1. Return ONLY a valid JSON array of objects. Do NOT include any markdown preamble, conversational text, or postscript outside the JSON array.
2. Each question MUST contain:
   - "topic": "${effectiveTopic}"
   - "difficulty": "${difficulty}"
   - "language": "${language}"
   - "question": Clear, concise, factually accurate question text
   - "options": An object with exactly 4 distinct options ("A", "B", "C", "D")
   - "correctAnswer": The single correct option letter ("A", "B", "C", or "D")
   - "explanation": A concise, educational explanation (1-2 sentences) of why the answer is correct for the reveal slide.

STRICT JSON SCHEMA TO FOLLOW:
[
  {
    "topic": "${effectiveTopic}",
    "difficulty": "${difficulty}",
    "language": "${language}",
    "question": "Question text here?",
    "options": {
      "A": "Option 1",
      "B": "Option 2",
      "C": "Option 3",
      "D": "Option 4"
    },
    "correctAnswer": "A",
    "explanation": "Brief solution explanation highlighting key facts."
  }
]`;
}

