import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Bookmark,
  Share2,
  Sliders,
  Sparkles,
  Layers,
  FolderArchive,
  Check
} from 'lucide-react';
import QuestionCard from './QuestionCard';
import AnswerCard from './AnswerCard';
import { DIMENSIONS_CONFIG } from '../utils/imageExport';

export default function QuizPreview({
  questions = [],
  currentQuestionIndex = 0,
  onChangeQuestionIndex,
  selectedTemplate = 'black-gold',
  branding = {},
  customization = {},
  dimension = 'square',
  onUpdateDimension,
  onOpenEditor,
  onSaveQuiz,
  onOpenDownloadManager,
  showNotification,
}) {
  const [viewMode, setViewMode] = useState('both'); // 'both' | 'question' | 'answer'
  const [isSaved, setIsSaved] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/60 p-12 text-center">
        <Sparkles className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">No Questions Generated Yet</h3>
        <p className="text-sm text-slate-400">Generate a quiz using the form above to see the live Instagram posts.</p>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex] || questions[0];

  const handleSave = () => {
    if (onSaveQuiz) {
      onSaveQuiz();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-3 sm:p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Question Pagination Selector */}
        <div className="flex items-center justify-between sm:justify-start space-x-2">
          <button
            onClick={() => onChangeQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="p-2 rounded-xl bg-slate-700/70 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition flex-shrink-0 active:scale-95"
            title="Previous question"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar touch-scroll max-w-[200px] sm:max-w-[360px] py-1 px-0.5">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => onChangeQuestionIndex(idx)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition flex items-center justify-center flex-shrink-0 active:scale-95 ${
                  currentQuestionIndex === idx
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                    : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => onChangeQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
            disabled={currentQuestionIndex === questions.length - 1}
            className="p-2 rounded-xl bg-slate-700/70 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition flex-shrink-0 active:scale-95"
            title="Next question"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-[11px] sm:text-xs font-semibold text-slate-400 ml-1 whitespace-nowrap">
            {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>

        {/* View Mode & Dimension Selector */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2">
          {/* Dimension Dropdown */}
          <select
            value={dimension}
            onChange={(e) => onUpdateDimension(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-700/80 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs font-bold text-slate-200 focus:outline-none flex-1 sm:flex-initial"
          >
            {Object.entries(DIMENSIONS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>

          {/* View Mode Tabs */}
          <div className="flex items-center bg-slate-700/50 p-0.5 rounded-xl border border-slate-700 text-xs font-medium">
            <button
              onClick={() => setViewMode('both')}
              className={`px-2 py-1 rounded-lg transition text-xs ${
                viewMode === 'both' ? 'bg-brand-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Both
            </button>
            <button
              onClick={() => setViewMode('question')}
              className={`px-2 py-1 rounded-lg transition text-xs ${
                viewMode === 'question' ? 'bg-brand-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Question
            </button>
            <button
              onClick={() => setViewMode('answer')}
              className={`px-2 py-1 rounded-lg transition text-xs ${
                viewMode === 'answer' ? 'bg-brand-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Answer
            </button>
          </div>

          <button
            onClick={handleSave}
            className="px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 transition flex items-center space-x-1 border border-slate-600 active:scale-95"
            title="Save quiz to library"
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden xs:inline">{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={onOpenDownloadManager}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-xs font-bold text-white transition flex items-center space-x-1.5 shadow-md shadow-brand-600/30"
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Download All ({questions.length * 2})</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Question Post & Answer Reveal */}
      <div className={`grid gap-6 ${viewMode === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-xl mx-auto'}`}>
        {(viewMode === 'both' || viewMode === 'question') && (
          <QuestionCard
            question={currentQ}
            questionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            selectedTemplate={selectedTemplate}
            branding={branding}
            customization={customization}
            dimension={dimension}
            onEdit={onOpenEditor}
            showNotification={showNotification}
          />
        )}

        {(viewMode === 'both' || viewMode === 'answer') && (
          <AnswerCard
            question={currentQ}
            questionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            selectedTemplate={selectedTemplate}
            branding={branding}
            customization={customization}
            dimension={dimension}
            showNotification={showNotification}
          />
        )}
      </div>
    </div>
  );
}

