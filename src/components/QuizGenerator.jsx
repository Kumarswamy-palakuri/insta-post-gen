import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Shuffle,
  Compass,
  Layers,
  Globe2,
  AlertCircle,
  KeyRound,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Flame,
  Zap,
  Clock,
  Timer,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateQuestionsWithAI, getOfflineSampleQuestions } from '../services/aiService';
import { getApiKey, incrementQuestionsGenerated, saveRecentQuiz } from '../utils/storage';
import { getFormattedCurrentDate, getTodayQuizTopic } from '../utils/dateUtils';

export const SUGGESTED_CATEGORIES = [
  'General Knowledge',
  'Indian History',
  'Geography',
  'Indian Polity',
  'Current Affairs',
  'Mathematics',
  'Reasoning',
  'Science',
  'Computer Knowledge',
  'Economics',
  'Sports',
  'English Grammar',
  'Custom Topic',
];

const RANDOM_TOPIC_POOL = [
  'Indian Freedom Struggle (1857-1947)',
  'Mughal Dynasty & Architecture',
  'Indian Constitution & Fundamental Rights',
  'Solar System & ISRO Missions',
  'World Rivers, Oceans & Straits',
  'Cybersecurity, AI & Modern Tech',
  'Human Body & Medical Science',
  'Ancient Indus Valley Civilization',
  'Nobel Laureates and Discoveries',
  'National Parks & Wildlife Sanctuaries in India',
  'Global Geography & Mountain Ranges',
  'Indian Economy, GDP & Banking System',
  'Olympic Games & World Records',
  'English Grammar & Vocabulary Builder',
  'Environmental Science & Climate Change',
  'Famous Battles in Indian History',
  'Telugu Literature & Andhra History',
];

export default function QuizGenerator({
  onQuizGenerated,
  onNavigateToSettings,
  showNotification,
}) {
  const [topic, setTopic] = useState('Indian History');
  const [selectedCategory, setSelectedCategory] = useState('Indian History');
  const [difficulty, setDifficulty] = useState('Medium');
  const [language, setLanguage] = useState('English');
  const [questionCount, setQuestionCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Countdown timer & live progress states
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [activeStage, setActiveStage] = useState('');
  const timerIntervalRef = useRef(null);

  const GENERATION_STAGES = [
    'Connecting to Gemini AI & analyzing topic curriculum...',
    'Drafting factually verified questions & distractors...',
    'Validating single-answer correctness & difficulty...',
    'Writing comprehensive educational solution explanations...',
    'Finalizing JSON structure and styling Instagram cards...',
  ];

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const hasApiKey = Boolean(getApiKey());

  // Handle category selection
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'Custom Topic') {
      setTopic('');
    } else {
      setTopic(cat);
    }
  };

  // Pick random topic
  const handleRandomTopic = () => {
    const randomPick = RANDOM_TOPIC_POOL[Math.floor(Math.random() * RANDOM_TOPIC_POOL.length)];
    setTopic(randomPick);
    setSelectedCategory('Custom Topic');
  };

  // Pick today's date-based history & current affairs quiz topic
  const handleTodayDateQuiz = () => {
    const todayTopic = getTodayQuizTopic();
    setTopic(todayTopic);
    setSelectedCategory('Custom Topic');
  };

  // Trigger generator
  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!topic || !topic.trim()) {
      setErrorMessage('Please enter or select a topic to generate questions.');
      return;
    }

    setErrorMessage('');
    setIsGenerating(true);

    // Calculate realistic estimated time based on question count
    // 1 question ~3s, 5 questions ~6s, 10 questions ~11s, 20 questions ~20s
    const estimatedSeconds = Math.max(3, Math.round(questionCount * 0.9 + 2));
    setRemainingSeconds(estimatedSeconds);
    setElapsedSeconds(0);
    setProgressPercent(8);
    setActiveStage(GENERATION_STAGES[0]);

    const startTime = Date.now();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, estimatedSeconds - elapsed);

      setElapsedSeconds(elapsed);
      setRemainingSeconds(remaining);

      // Smooth progress calculation
      if (elapsed < estimatedSeconds) {
        const pct = Math.min(92, Math.round((elapsed / estimatedSeconds) * 90));
        setProgressPercent(pct);
      } else {
        // Asymptotically approach 98% if API takes slightly longer than estimate
        setProgressPercent((prev) => Math.min(98, prev + 1));
      }

      // Rotate generation stages
      const stageIdx = Math.min(
        GENERATION_STAGES.length - 1,
        Math.floor((elapsed / Math.max(1, estimatedSeconds)) * GENERATION_STAGES.length)
      );
      setActiveStage(GENERATION_STAGES[stageIdx]);
    }, 250);

    try {
      let questions = [];

      // Check if API key is present
      if (hasApiKey) {
        questions = await generateQuestionsWithAI({
          topic: topic.trim(),
          difficulty,
          language,
          count: questionCount,
        });
      } else {
        // Fallback demo/sample generator
        questions = getOfflineSampleQuestions(topic.trim(), questionCount, difficulty, language);
        if (showNotification) {
          showNotification('Generated in Demo Mode. Connect your Gemini API Key in Settings for unlimited AI topics!', 'info');
        }
      }

      if (questions && questions.length > 0) {
        // Increment stats
        incrementQuestionsGenerated(questions.length);

        // Record in recent history
        saveRecentQuiz({
          id: `recent_${Date.now()}`,
          topic: topic.trim(),
          difficulty,
          language,
          questionsCount: questions.length,
          createdAt: new Date().toISOString(),
          questions,
        });

        // Fire celebration confetti!
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch (confettiErr) {
          // ignore if canvas blocked
        }

        if (showNotification) {
          showNotification(`Successfully generated ${questions.length} Instagram quiz questions!`, 'success');
        }

        onQuizGenerated(questions, { topic: topic.trim(), difficulty, language });
      }
    } catch (err) {
      console.error('Quiz generation error:', err);
      setErrorMessage(err.message || 'Failed to generate quiz questions. Please try again.');
    } finally {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      setProgressPercent(100);
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-900/95 rounded-2xl sm:rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-6">
      {/* Top Banner if API Key is not set */}
      {!hasApiKey && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-200">
          <div className="flex items-start space-x-2.5">
            <KeyRound className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Gemini API Key Recommended
              </div>
              <p className="text-xs text-amber-200/90 mt-0.5 leading-relaxed">
                Connect your free Google Gemini API key in Settings for unlimited custom AI topics. Running in Demo Mode with offline library.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToSettings}
            className="w-full sm:w-auto text-center px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition flex-shrink-0 shadow-sm"
          >
            Configure Key
          </button>
        </div>
      )}

      {/* Form Section */}
      <form onSubmit={handleGenerate} className="space-y-4 sm:space-y-6">
        {/* Topic Input with Random & Today's Topic Buttons */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-brand-400" />
              <span>Quiz Topic</span>
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleTodayDateQuiz}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1 transition px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 active:scale-95"
                title="Generate today's date-based history and current affairs quiz"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Today's Quiz ({getFormattedCurrentDate().split(' ').slice(0, 2).join(' ')})</span>
              </button>
              <button
                type="button"
                onClick={handleRandomTopic}
                className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center space-x-1 transition px-2.5 py-1 rounded-lg bg-brand-500/10 border border-brand-500/20 active:scale-95"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Random</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setSelectedCategory('Custom Topic');
              }}
              placeholder="e.g. Indian History, Geography, Space Science..."
              className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-inner transition"
              required
            />
          </div>
        </div>

        {/* Suggested Categories */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Suggested Categories
            </label>
            <span className="text-[10px] text-slate-500 sm:hidden">Swipe →</span>
          </div>
          <div className="flex overflow-x-auto no-scrollbar touch-scroll sm:flex-wrap gap-2 pb-1 -mx-1 px-1">
            {SUGGESTED_CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => handleSelectCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all active:scale-95 ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-750 border border-slate-700/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
          {/* Difficulty */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-brand-500"
            >
              <option value="Easy">Easy (Beginner Friendly)</option>
              <option value="Medium">Medium (Standard Exam)</option>
              <option value="Hard">Hard (Advanced Aspirants)</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center space-x-1">
              <Globe2 className="w-3.5 h-3.5 text-brand-400" />
              <span>Language</span>
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-brand-500"
            >
              <option value="English">English</option>
              <option value="Telugu">Telugu (తెలుగు)</option>
              <option value="Bilingual">Bilingual (English + Telugu)</option>
            </select>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
              Number of Questions
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 5, 10, 20].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setQuestionCount(num)}
                  className={`py-2 rounded-xl text-xs font-bold transition text-center border ${
                    questionCount === num
                      ? 'bg-brand-600 border-brand-500 text-white shadow-sm'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start space-x-2 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Generation Error: </span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Live Remaining Time & Progress Card (Active while generating) */}
        {isGenerating && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-950/80 via-slate-900 to-indigo-950/80 border border-brand-500/40 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
                  <Clock className="w-4 h-4 animate-spin-slow" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <span>Generating {questionCount} Questions</span>
                    <span className="text-[10px] text-brand-400 font-semibold">• {difficulty}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">• {language}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[220px] sm:max-w-md mt-0.5">
                    {activeStage}
                  </div>
                </div>
              </div>

              {/* Countdown badge */}
              <div className="text-right flex-shrink-0">
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/40 text-brand-300 text-xs font-black font-mono shadow-sm">
                  <Timer className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
                  <span>
                    {remainingSeconds > 0 ? `~${remainingSeconds}s remaining` : 'Finalizing...'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Elapsed: {elapsedSeconds}s
                </div>
              </div>
            </div>

            {/* Animated Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 via-sky-400 to-indigo-500 rounded-full transition-all duration-300 ease-out shadow-glow-primary"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>AI Reasoning & Verification</span>
                <span className="font-bold text-brand-400">{progressPercent}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-500 via-sky-600 to-indigo-600 hover:from-brand-400 hover:via-sky-500 hover:to-indigo-500 text-white font-extrabold text-sm uppercase tracking-wider transition-all duration-200 shadow-xl shadow-brand-500/25 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>
                Generating Quiz Posts... (~{remainingSeconds > 0 ? `${remainingSeconds}s remaining` : 'almost ready'})
              </span>
            </div>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Generate {questionCount} Quiz Posts with AI</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

