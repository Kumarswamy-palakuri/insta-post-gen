/**
 * Instagram Viral Caption & Hashtag Generator
 * Generates algorithm-optimized, high-reach captions with viral hooks,
 * structured question formatting, engagement triggers, and trending SEO hashtags.
 */

// Core viral and high-traffic hashtags
const CORE_VIRAL_HASHTAGS = [
  '#quiz',
  '#quiztime',
  '#dailyquiz',
  '#generalknowledge',
  '#gk',
  '#knowledgeispower',
  '#didyouknow',
  '#facts',
  '#education',
  '#studygram',
  '#upsc',
  '#ssc',
  '#ssccgl',
  '#currentaffairs',
  '#explorepage',
  '#viral',
  '#trending',
  '#explore',
  '#reels',
  '#viralpost',
];

// Topic-specific high-reach hashtags & keywords
const TOPIC_HASHTAG_MAP = {
  history: [
    '#indianhistory',
    '#historyfacts',
    '#ancienthistory',
    '#modernhistory',
    '#historicalfacts',
    '#freedomfighters',
    '#upschistory',
    '#history',
  ],
  geography: [
    '#geography',
    '#geographyquiz',
    '#worldgeography',
    '#earthfacts',
    '#maps',
    '#upscgeography',
    '#naturefacts',
  ],
  polity: [
    '#indianpolity',
    '#constitutionofindia',
    '#upscpolity',
    '#fundamentalrights',
    '#civics',
    '#indianlaw',
    '#governance',
  ],
  constitution: [
    '#constitutionofindia',
    '#indianpolity',
    '#lawquiz',
    '#supremecourtofindia',
    '#upscpolity',
  ],
  science: [
    '#sciencefacts',
    '#physics',
    '#chemistry',
    '#biology',
    '#spacefacts',
    '#isro',
    '#technology',
    '#stem',
  ],
  computer: [
    '#computerknowledge',
    '#programming',
    '#coding',
    '#techfacts',
    '#cybersecurity',
    '#computerscience',
    '#ai',
  ],
  tech: [
    '#technology',
    '#techquiz',
    '#gadgets',
    '#artificialintelligence',
    '#futuretech',
  ],
  economics: [
    '#economics',
    '#rbi',
    '#bankingexams',
    '#finance',
    '#financialliteracy',
    '#commerce',
    '#economy',
  ],
  sports: [
    '#sportsquiz',
    '#cricket',
    '#olympics',
    '#football',
    '#sportsfacts',
    '#athletes',
    '#sportsnews',
  ],
  english: [
    '#englishgrammar',
    '#vocabulary',
    '#learnenglish',
    '#wordoftheday',
    '#englishquiz',
    '#grammarpolice',
  ],
  grammar: [
    '#englishgrammar',
    '#vocabulary',
    '#grammarquiz',
    '#languagelearning',
  ],
  telugu: [
    '#telugugk',
    '#telugufacts',
    '#teluguliterature',
    '#andhrapradesh',
    '#telangana',
    '#teluguculture',
    '#telugumotivation',
  ],
  current: [
    '#currentaffairs',
    '#dailycurrentaffairs',
    '#currentaffairsquiz',
    '#newsupdate',
    '#dailygk',
  ],
};

/**
 * Gets curated hashtags tailored to topic with fallback to viral core
 */
export function getCuratedHashtags(topic = '') {
  const cleanTopic = (topic || '').toLowerCase();
  const matchedTags = new Set(CORE_VIRAL_HASHTAGS);

  // Match topic keywords
  Object.entries(TOPIC_HASHTAG_MAP).forEach(([key, tags]) => {
    if (cleanTopic.includes(key)) {
      tags.forEach((tag) => matchedTags.add(tag));
    }
  });

  // Limit to Instagram's sweet spot (20-25 hashtags)
  return Array.from(matchedTags).slice(0, 25);
}

/**
 * Generates an engagement-optimized caption for a Single Question Post
 */
export function generateSingleQuestionCaption({
  question,
  branding = {},
  questionIndex = 0,
  totalQuestions = 1,
}) {
  if (!question) return '';

  const handle = (branding.handle || 'learn_in_a_minute').replace(/^@/, '');
  const subText = branding.subText || 'Daily Knowledge Booster';
  const topic = question.topic || 'General Knowledge';
  const difficulty = question.difficulty || 'Medium';
  const options = question.options || {};
  const hashtags = getCuratedHashtags(topic).join(' ');

  const hooks = [
    '🧠 90% OF PEOPLE GET THIS WRONG! Can you answer it? 🤯',
    '⚡ TEST YOUR KNOWLEDGE! Only top 5% know the right answer! 👇',
    '🎯 BRAIN CHALLENGE: How sharp is your memory today? 🧐',
    '🔥 EXAM REVISION: Can you solve this without checking Slide 2? 📚',
  ];
  const selectedHook = hooks[questionIndex % hooks.length];

  return `${selectedHook}

━━━━━━━━━━━━━━━━━━━━━━
📌 TOPIC: ${topic.toUpperCase()}
⚡ DIFFICULTY: ${difficulty.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━

❓ QUESTION:
${question.question}

A) ${options.A || ''}
B) ${options.B || ''}
C) ${options.C || ''}
D) ${options.D || ''}

━━━━━━━━━━━━━━━━━━━━━━

👇 COMMENT YOUR ANSWER below before swiping! (A, B, C, or D)
👉 SWIPE LEFT to Slide 2 to check the correct answer & explanation!

💾 SAVE this post so you can revise it later!
🚀 SHARE this with a friend to test their general knowledge!

🔔 Follow @${handle} for daily high-yield quizzes and exam preparation!
✨ ${subText}

.
.
.
${hashtags}`;
}

/**
 * Generates an engagement-optimized caption for a Full Carousel Post
 */
export function generateCarouselCaption({
  questions = [],
  branding = {},
  selectedTemplate = '',
}) {
  if (!questions || questions.length === 0) return '';

  const handle = (branding.handle || 'learn_in_a_minute').replace(/^@/, '');
  const subText = branding.subText || 'Daily Knowledge Booster';
  const firstQ = questions[0] || {};
  const topic = firstQ.topic || 'General Knowledge';
  const count = questions.length;
  const hashtags = getCuratedHashtags(topic).join(' ');

  return `🔥 ${count}-QUESTION QUIZ CHALLENGE: ${topic.toUpperCase()} 🎯
How many can you get right? Test your knowledge right now! 🧠👇

━━━━━━━━━━━━━━━━━━━━━━
📌 TOPIC: ${topic}
📊 TOTAL QUESTIONS: ${count}
⚡ FORMAT: Question & Answer Reveal Slides
━━━━━━━━━━━━━━━━━━━━━━

👉 SWIPE THROUGH each slide to test your knowledge!
💬 COMMENT YOUR FINAL SCORE below (e.g. ${count}/${count})! 🏆

🏆 QUESTIONS PREVIEW:
${questions.slice(0, 3).map((q, idx) => `Q${idx + 1}: ${q.question.substring(0, 50)}...`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━

💾 SAVE this post for quick revision before your tests!
👥 TAG a friend and challenge them to beat your score!

🔔 Follow @${handle} for daily interactive quizzes & study notes!
✨ ${subText}

.
.
.
${hashtags}`;
}

