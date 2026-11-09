import React, { useState, useEffect } from 'react';
import {
  Code2,
  Download,
  Bookmark,
  Palette,
  Sliders,
  ArrowRight,
  Clock,
  Layers,
  ChevronRight,
  FileCode,
  Image as ImageIcon
} from 'lucide-react';
import { getStats, getRecentQuizzes, getDownloadHistory } from '../utils/storage';

export default function Dashboard({
  onNavigate,
  onLoadRecentQuiz,
}) {
  const [stats, setStats] = useState({ totalQuestionsGenerated: 0, totalImagesDownloaded: 0, totalSavedQuizzes: 0 });
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [downloadHistory, setDownloads] = useState([]);

  useEffect(() => {
    setStats(getStats());
    setRecentQuizzes(getRecentQuizzes());
    setDownloads(getDownloadHistory());
  }, []);

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 border border-brand-500/30 p-4 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-400/30">
            <Code2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-400" />
            <span>JSON to Frame Studio</span>
          </div>

          <h1 className="text-xl sm:text-4xl font-black text-white tracking-tight leading-snug sm:leading-tight">
            Transform Quiz JSON into <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Viral Instagram Post Frames
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Paste or upload any quiz JSON, and instantly convert it into 8 high-conversion Instagram-ready templates with Question & Answer Reveal pairs.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1 sm:pt-2">
            <button
              onClick={() => onNavigate('generate')}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 transition flex items-center justify-center space-x-2 active:scale-95"
            >
              <Code2 className="w-4 h-4" />
              <span>Open JSON to Frame Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('templates')}
              className="px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 shadow-sm active:scale-95"
            >
              <Palette className="w-4 h-4 text-purple-400" />
              <span>Explore 8 Templates</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-800 p-2.5 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center sm:space-x-4 text-center sm:text-left">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center border border-brand-500/20 mb-1.5 sm:mb-0">
            <Layers className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-base sm:text-2xl font-black text-white">{stats.totalQuestionsGenerated}</div>
            <div className="text-[9px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5 truncate">
              Frames Created
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-800 p-2.5 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center sm:space-x-4 text-center sm:text-left">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 mb-1.5 sm:mb-0">
            <Download className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-base sm:text-2xl font-black text-white">{stats.totalImagesDownloaded}</div>
            <div className="text-[9px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5 truncate">
              Exported
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-800 p-2.5 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center sm:space-x-4 text-center sm:text-left">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 mb-1.5 sm:mb-0">
            <Bookmark className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-base sm:text-2xl font-black text-white">{stats.totalSavedQuizzes}</div>
            <div className="text-[9px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5 truncate">
              Saved Projects
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div
          onClick={() => onNavigate('generate')}
          className="group p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/60 cursor-pointer transition shadow-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition">
            JSON to Frame
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Paste or upload quiz JSON to generate Question & Answer Reveal frames.
          </p>
        </div>

        <div
          onClick={() => onNavigate('templates')}
          className="group p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/60 cursor-pointer transition shadow-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Palette className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
            8 Post Templates
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Black & Gold, Blue & Yellow, Minimal, Exam Style, and high-conversion styles.
          </p>
        </div>

        <div
          onClick={() => onNavigate('saved')}
          className="group p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/60 cursor-pointer transition shadow-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Bookmark className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
            Saved Projects
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Access your saved question libraries anytime and export fresh variations.
          </p>
        </div>

        <div
          onClick={() => onNavigate('settings')}
          className="group p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/60 cursor-pointer transition shadow-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
            Branding & Setup
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Customize default Instagram handle, watermarks, logo URL, and CTAs.
          </p>
        </div>
      </div>

      {/* Two Column Section: Recently Generated Quizzes & Templates Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Generated Quizzes */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-bold text-white">Recent Saved Drafts</h3>
              </div>
              <span className="text-xs text-slate-500">{recentQuizzes.length} Drafts</span>
            </div>

            <div className="divide-y divide-slate-800/80 mt-2">
              {recentQuizzes.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No saved drafts yet. Open JSON to Frame Studio to create your first post!
                </div>
              ) : (
                recentQuizzes.slice(0, 5).map((q) => (
                  <div
                    key={q.id}
                    className="py-3 flex items-center justify-between hover:bg-slate-800/40 px-2 rounded-xl transition"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{q.topic}</div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span>{q.questionsCount || q.questions?.length || 1} questions</span>
                        <span>•</span>
                        <span>{q.difficulty || 'Medium'}</span>
                        <span>•</span>
                        <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onLoadRecentQuiz(q)}
                      className="px-2.5 py-1 rounded-lg bg-brand-600/20 hover:bg-brand-600 text-brand-300 hover:text-white text-xs font-bold transition flex items-center space-x-1"
                    >
                      <span>Open</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {recentQuizzes.length > 0 && (
            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => onNavigate('saved')}
                className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center space-x-1"
              >
                <span>View all saved collections</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Download History Preview */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Recent Export History</h3>
              </div>
              <span className="text-xs text-slate-500">{downloadHistory.length} Exports</span>
            </div>

            <div className="divide-y divide-slate-800/80 mt-2">
              {downloadHistory.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No images exported yet. Exported frames will be logged here for tracking.
                </div>
              ) : (
                downloadHistory.slice(0, 5).map((d) => (
                  <div
                    key={d.id}
                    className="py-3 flex items-center justify-between hover:bg-slate-800/40 px-2 rounded-xl transition"
                  >
                    <div>
                      <div className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                        {d.title}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span className="uppercase text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-brand-400">
                          {d.type}
                        </span>
                        <span>•</span>
                        <span>{d.format}</span>
                        <span>•</span>
                        <span>{new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      Exported
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs text-slate-500">
            Posts export at true 1080px resolution for high Instagram engagement.
          </div>
        </div>
      </div>
    </div>
  );
}
