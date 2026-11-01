import React, { useState } from 'react';
import { TEMPLATES } from '../templates';
import { Palette, Check, ArrowRight, Sparkles, Layers } from 'lucide-react';

const SAMPLE_PREVIEW_QUESTION = {
  topic: 'Indian History',
  question: 'Who founded the Maurya Empire with the mentorship of Chanakya?',
  options: {
    A: 'Ashoka the Great',
    B: 'Chandragupta Maurya',
    C: 'Bindusara',
    D: 'Harshavardhana',
  },
  correctAnswer: 'B',
  explanation: 'Chandragupta Maurya founded the Maurya Empire in 322 BCE after overthrowing the Nanda Dynasty with Chanakya.',
  difficulty: 'Easy',
  language: 'English',
};

export default function Templates({
  selectedTemplate,
  onSelectTemplate,
  onUseTemplateInStudio,
  branding,
}) {
  const [filter, setFilter] = useState('All');
  const [previewMode, setPreviewMode] = useState('question'); // 'question' | 'answer'

  const categories = ['All', 'Dark', 'Light', 'High Contrast'];

  const filtered = TEMPLATES.filter((t) => {
    if (filter === 'All') return true;
    if (filter === 'Dark') return t.id.includes('black') || t.id.includes('purple') || t.id.includes('orange') || t.id.includes('minimal');
    if (filter === 'Light') return t.id.includes('white');
    if (filter === 'High Contrast') return t.id.includes('yellow') || t.id.includes('exam') || t.id.includes('green');
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Instagram Post Templates</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Choose from 8 handcrafted, educational design themes engineered for maximum Instagram engagement.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-800 p-1 sm:p-1.5 rounded-xl border border-slate-700 w-full sm:w-auto">
          <button
            onClick={() => setPreviewMode('question')}
            className={`flex-1 sm:flex-initial text-center px-3 py-1.5 sm:py-1 rounded-lg text-xs font-bold transition ${
              previewMode === 'question' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Question View
          </button>
          <button
            onClick={() => setPreviewMode('answer')}
            className={`flex-1 sm:flex-initial text-center px-3 py-1.5 sm:py-1 rounded-lg text-xs font-bold transition ${
              previewMode === 'answer' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Answer Reveal View
          </button>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filter === cat
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-750 hover:text-white border border-slate-700'
            }`}
          >
            {cat} Styles
          </button>
        ))}
      </div>

      {/* Grid of Templates with Live Component Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {filtered.map((t) => {
          const TemplateComponent = t.component;
          const isSelected = selectedTemplate === t.id;

          return (
            <div
              key={t.id}
              className={`bg-slate-900 rounded-3xl border-2 overflow-hidden shadow-2xl transition flex flex-col ${
                isSelected
                  ? 'border-brand-500 ring-4 ring-brand-500/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Template Header Info */}
              <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: t.accentColor }}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{t.name}</h3>
                    <p className="text-[11px] text-slate-400">{t.description}</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {t.category}
                </span>
              </div>

              {/* Live Preview Canvas */}
              <div className="p-2 sm:p-6 bg-slate-950/70 flex items-center justify-center">
                <div className="w-full max-w-[420px] aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/5 flex flex-col">
                  <TemplateComponent
                    question={SAMPLE_PREVIEW_QUESTION}
                    isAnswerMode={previewMode === 'answer'}
                    branding={branding}
                    customization={{}}
                    dimension="square"
                    questionIndex={0}
                    totalQuestions={1}
                  />
                </div>
              </div>

              {/* Template Footer Actions */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onSelectTemplate(t.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5 text-brand-400" /> : null}
                  <span>{isSelected ? 'Active Template' : 'Select'}</span>
                </button>

                <button
                  onClick={() => onUseTemplateInStudio(t.id)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-brand-600/30"
                >
                  <span>Use in Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

