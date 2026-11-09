/**
 * Sample Quiz JSON
 * Provides default and reference JSON structures for the JSON to Frame Studio.
 */

export const DEFAULT_SAMPLE_QUIZ = [
  {
    topic: 'Indian History',
    difficulty: 'Medium',
    question: 'Who founded the Maurya Empire with the guidance and mentorship of Chanakya?',
    options: {
      A: 'Ashoka the Great',
      B: 'Chandragupta Maurya',
      C: 'Bindusara',
      D: 'Harshavardhana',
    },
    correctAnswer: 'B',
    explanation: 'Chandragupta Maurya founded the Maurya Empire in 322 BCE after overthrowing the Nanda Dynasty with the guidance of Chanakya.',
  },
  {
    topic: 'World Geography',
    difficulty: 'Easy',
    question: 'Which is officially recognized as the longest river in the world by total length?',
    options: {
      A: 'Amazon River',
      B: 'Nile River',
      C: 'Yangtze River',
      D: 'Mississippi River',
    },
    correctAnswer: 'B',
    explanation: 'The Nile River in northeastern Africa spans roughly 6,650 km (4,132 miles), making it the longest river on Earth.',
  },
  {
    topic: 'General Science',
    difficulty: 'Easy',
    question: 'What is the powerhouse organelle of eukaryotic cells responsible for producing ATP?',
    options: {
      A: 'Ribosome',
      B: 'Mitochondria',
      C: 'Endoplasmic Reticulum',
      D: 'Golgi Apparatus',
    },
    correctAnswer: 'B',
    explanation: 'Mitochondria generate most of the chemical energy required by the cell through cellular respiration, stored as ATP.',
  },
];

export const DEFAULT_SAMPLE_JSON_STRING = JSON.stringify(DEFAULT_SAMPLE_QUIZ, null, 2);

