import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Sparkles,
  Flame,
  Hash,
  Share2,
  FileText,
  Layers,
  CheckCircle2
} from 'lucide-react';
import {
  generateSingleQuestionCaption,
  generateCarouselCaption,
  getCuratedHashtags
} from '../utils/captionGenerator';

export default function CaptionModal({
  isOpen,
  onClose,
  question,
  questions = [],
  questionIndex = 0,
  branding = {},
  showNotification,
}) {
  const [captionMode, setCaptionMode] = useState('single'); // 'single' | 'carousel'
  const [editableCaption, setEditableCaption] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate caption when modal opens or mode changes
  useEffect(() => {
    if (!isOpen) return;

    if (captionMode === 'single') {
      const generated = generateSingleQuestionCaption({
        question,
        branding,
        questionIndex,
        totalQuestions: questions.length,
      });
      setEditableCaption(generated);
    } else {
      const generated = generateCarouselCaption({
        questions,
        branding,
      });
      setEditableCaption(generated);
    }
  }, [isOpen, captionMode, question, questions, questionIndex, branding]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(editableCaption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    if (showNotification) {
      showNotification('Viral Instagram caption & hashtags copied to clipboard!', 'success');
    }
  };

  const topic = question?.topic || 'General Knowledge';
  const hashtags = getCuratedHashtags(topic);
  const charCount = editableCaption.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center space-x-2">
                <span>Viral Instagram Caption & Hashtags</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  SEO Optimized
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Engineered with curiosity hooks, comment triggers, and high-reach hashtags for maximum reach.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-700/60 hover:bg-slate-750 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Caption Mode Switcher */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setCaptionMode('single')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                captionMode === 'single'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Current Question (Q{questionIndex + 1})</span>
            </button>

            <button
              onClick={() => setCaptionMode('carousel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                captionMode === 'carousel'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Full Carousel ({questions.length} Questions)</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <span>{charCount} / 2,200 chars</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">{hashtags.length} Hashtags</span>
          </div>
        </div>

        {/* Caption Editor & Preview Area */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          <div className="relative rounded-2xl border border-slate-700/80 bg-slate-950 shadow-inner overflow-hidden">
            <textarea
              value={editableCaption}
              onChange={(e) => setEditableCaption(e.target.value)}
              rows={12}
              spellCheck={false}
              className="w-full p-4 font-sans text-xs sm:text-sm text-slate-200 bg-transparent resize-y focus:outline-none focus:ring-1 focus:ring-rose-500/50 leading-relaxed"
              placeholder="Instagram caption will appear here..."
            />
          </div>

          {/* Hashtag Highlights Pill Strip */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Hash className="w-3.5 h-3.5 text-rose-400" />
              <span>Targeted Viral Hashtags Included ({hashtags.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 rounded-xl bg-slate-950/60 border border-slate-800">
              {hashtags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-800/90 border-t border-slate-700/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ready to paste directly into Instagram!</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-650 text-slate-300 font-bold text-xs transition"
            >
              Close
            </button>

            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-500/25 transition flex items-center space-x-1.5 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Viral Caption'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

