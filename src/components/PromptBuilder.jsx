import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Compass,
  Layers,
  Globe2,
  Sliders,
  ArrowRight,
  BookOpen,
  Cpu,
  HelpCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

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

export default function PromptBuilder({
  onSwitchToJsonInput,
  showNotification,
}) {
  const [topic, setTopic] = useState('Indian History');
  const [customTopic, setCustomTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('Medium');
  const [language, setLanguage] = useState('English');
  const [style, setStyle] = useState('Competitive Exam Preparation (UPSC / SSC / Banking)');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [copied, setCopied] = useState(false);

  // Auto-generate prompt in real time whenever any option changes!
  const generatedPrompt = useMemo(() => {
    return buildQuizPrompt({
      topic,
      customTopic,
      questionCount,
      difficulty,
      language,
      style,
      additionalNotes,
    });
  }, [topic, customTopic, questionCount, difficulty, language, style, additionalNotes]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    if (showNotification) {
      showNotification('AI Prompt copied! Paste into your local AI (ChatGPT, Claude, Ollama), then paste JSON result below.', 'success');
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden transition-all">
      {/* Header */}
      <div className="px-4 py-3.5 bg-slate-800/90 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center space-x-2">
              <span>Auto AI Prompt Builder</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Local / Web AI Ready
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Select your options below — the prompt auto-updates instantly. Copy & paste it into your local AI, then paste the JSON back here!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyPrompt}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-purple-600/30 active:scale-95"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy AI Prompt'}</span>
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        {/* Step-by-Step Workflow Guide */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center border border-purple-500/30 text-[10px]">
              1
            </span>
            <span className="text-slate-300 font-semibold">Select options & Copy prompt</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center border border-purple-500/30 text-[10px]">
              2
            </span>
            <span className="text-slate-300 font-semibold">Paste in Local AI / ChatGPT / Ollama</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center border border-purple-500/30 text-[10px]">
              3
            </span>
            <span className="text-slate-300 font-semibold">Paste JSON response below to render</span>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Topic Selector */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-brand-400" />
              <span>Quiz Topic</span>
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-brand-500"
            >
              {SUGGESTED_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Custom Topic Input if 'Custom Topic' selected */}
            {topic === 'Custom Topic' && (
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g. Mughal Architecture, ISRO Missions, Python Basics..."
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 mt-2"
              />
            )}
          </div>

          {/* Question Count */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Questions Count</span>
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-brand-500"
            >
              <option value={1}>1 Question (2 Slides)</option>
              <option value={3}>3 Questions (6 Slides)</option>
              <option value={5}>5 Questions (10 Slides)</option>
              <option value={10}>10 Questions (20 Slides)</option>
              <option value={15}>15 Questions (30 Slides)</option>
            </select>
          </div>

          {/* Difficulty */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Difficulty Level</span>
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-brand-500"
            >
              {DIFFICULTY_LEVELS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Language</span>
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-brand-500"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Target Style / Focus */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-rose-400" />
              <span>Target Style</span>
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-brand-500"
            >
              {QUIZ_STYLES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Specific Focus / Sub-topic notes */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              <span>Optional Scope / Specific Focus</span>
            </label>
            <input
              type="text"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g. Focus on Freedom Movement (1857-1947), or Famous Battles..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Auto-Generated Prompt Preview Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-2 font-bold text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>Auto-Generated AI Prompt (Updates Live)</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {generatedPrompt.length} chars
            </span>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 p-3 shadow-inner">
            <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto select-all">
              {generatedPrompt}
            </pre>

            <button
              type="button"
              onClick={handleCopyPrompt}
              className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-purple-600/90 hover:bg-purple-600 text-white text-xs font-bold shadow-md transition flex items-center space-x-1 active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Navigation CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="text-xs text-slate-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Prompt is 100% compatible with Ollama, LM Studio, ChatGPT, Claude, DeepSeek & Gemini</span>
          </div>

          {onSwitchToJsonInput && (
            <button
              type="button"
              onClick={onSwitchToJsonInput}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center space-x-1.5 active:scale-95"
            >
              <span>Ready? Paste Result in JSON Input</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

