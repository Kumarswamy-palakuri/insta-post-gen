import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Trash2,
  FolderOpen,
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Clock,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { getSavedQuizzes, deleteQuiz, clearAllQuizzes } from '../utils/storage';

export default function SavedQuizzes({
  onLoadQuizIntoStudio,
  onNavigateToGenerate,
  showNotification,
}) {
  const [quizzes, setQuizzes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuizId, setExpandedQuizId] = useState(null);

  const loadQuizzes = () => {
    setQuizzes(getSavedQuizzes());
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete quiz "${title}"?`)) {
      deleteQuiz(id);
      loadQuizzes();
      if (showNotification) {
        showNotification('Quiz deleted from library', 'info');
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all saved quizzes?')) {
      clearAllQuizzes();
      loadQuizzes();
      if (showNotification) {
        showNotification('All saved quizzes removed', 'info');
      }
    }
  };

  const filteredQuizzes = quizzes.filter((q) => {
    const query = searchQuery.toLowerCase();
    const topic = (q.topic || '').toLowerCase();
    const title = (q.title || '').toLowerCase();
    return topic.includes(query) || title.includes(query);
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Saved Quizzes Library</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage your saved questions sets, re-open them in the studio, or export new variations.
          </p>
        </div>

        {quizzes.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Library</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      {quizzes.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved quizzes by topic..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 rounded-xl border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      )}

      {/* Quizzes List */}
      {filteredQuizzes.length === 0 ? (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
            <Bookmark className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Saved Quizzes Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              {searchQuery
                ? 'No quizzes matched your search query. Try searching for a different keyword.'
                : 'You have not saved any quizzes yet. Generate a quiz and click "Save Quiz" in the studio.'}
            </p>
          </div>
          <div>
            <button
              onClick={onNavigateToGenerate}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold uppercase tracking-wider transition inline-flex items-center space-x-2 shadow-md shadow-brand-600/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate a Quiz Now</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredQuizzes.map((quiz) => {
            const isExpanded = expandedQuizId === quiz.id;
            const qCount = quiz.questions?.length || 0;

            return (
              <div
                key={quiz.id}
                className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl transition"
              >
                {/* Quiz Item Main Header */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
                        {quiz.topic || 'General'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        • {quiz.difficulty || 'Medium'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        • {quiz.language || 'English'}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {quiz.title || `${quiz.topic} Quiz`}
                    </h3>

                    <div className="text-xs text-slate-500 flex items-center space-x-3">
                      <span>{qCount} Questions</span>
                      <span>•</span>
                      <span>Saved on {new Date(quiz.savedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-2 sm:pt-0 border-t border-slate-800/60 sm:border-0 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setExpandedQuizId(isExpanded ? null : quiz.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-300 transition flex items-center space-x-1"
                    >
                      <span>{isExpanded ? 'Hide' : 'Inspect'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => onLoadQuizIntoStudio(quiz)}
                      className="flex-1 sm:flex-initial justify-center px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-brand-600/30"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Studio</span>
                    </button>

                    <button
                      onClick={() => handleDelete(quiz.id, quiz.title || quiz.topic)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                      title="Delete quiz"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Question List */}
                {isExpanded && quiz.questions && (
                  <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-slate-800 bg-slate-950/40 space-y-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Included Questions ({qCount}):
                    </div>
                    <div className="space-y-2">
                      {quiz.questions.map((q, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1.5"
                        >
                          <div className="font-bold text-white flex items-start space-x-2">
                            <span className="text-brand-400">Q{idx + 1}.</span>
                            <span>{q.question}</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                            <div>A: {q.options?.A}</div>
                            <div>B: {q.options?.B}</div>
                            <div>C: {q.options?.C}</div>
                            <div>D: {q.options?.D}</div>
                          </div>
                          <div className="text-emerald-400 font-semibold text-[11px] pt-1">
                            Correct Answer: ({q.correctAnswer}) {q.options?.[q.correctAnswer]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

