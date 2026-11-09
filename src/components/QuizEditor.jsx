import React, { useState } from 'react';
import {
  Type,
  Palette,
  Layout,
  Sliders,
  Upload,
  RotateCcw,
  Check,
  Sparkles,
  Image as ImageIcon,
  HelpCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { TEMPLATES } from '../templates';
import { DIMENSIONS_CONFIG } from '../utils/imageExport';

export default function QuizEditor({
  question,
  onUpdateQuestion,
  branding,
  onUpdateBranding,
  customization,
  onUpdateCustomization,
  dimension,
  onUpdateDimension,
  selectedTemplate,
  onSelectTemplate,
  onClose = null,
}) {
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'styling' | 'branding'

  // Question fields
  const handleFieldChange = (field, value) => {
    onUpdateQuestion({
      ...question,
      [field]: value,
    });
  };

  const handleOptionChange = (key, value) => {
    onUpdateQuestion({
      ...question,
      options: {
        ...question.options,
        [key]: value,
      },
    });
  };

  // Logo file upload handler
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdateBranding({
          ...branding,
          logoUrl: event.target?.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-full">
      {/* Top Header */}
      <div className="px-5 py-4 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <Sliders className="w-5 h-5 text-brand-400" />
          <div>
            <h3 className="text-base font-bold text-white">Live Customization Editor</h3>
            <p className="text-xs text-slate-400">All changes reflect in real-time on your Instagram cards</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Editor Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/80 px-4 pt-2">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 ${
            activeTab === 'content'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Question & Options</span>
        </button>
        <button
          onClick={() => setActiveTab('styling')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 ${
            activeTab === 'styling'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Template & Styles</span>
        </button>
        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 ${
            activeTab === 'branding'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Branding & Format</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-5 overflow-y-auto max-h-[calc(100vh-280px)] space-y-5">
        {/* TAB 1: CONTENT */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Topic / Category Label
              </label>
              <input
                type="text"
                value={question.topic || ''}
                onChange={(e) => handleFieldChange('topic', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500 transition"
                placeholder="e.g. Indian Polity, Science, World History"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Question Text
              </label>
              <textarea
                rows={3}
                value={question.question || ''}
                onChange={(e) => handleFieldChange('question', e.target.value)}
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
                spellCheck={false}
                className="w-full px-3.5 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500 transition leading-relaxed resize-none"
                placeholder="Enter question text..."
              />
            </div>

            {/* 4 Options with Correct Answer selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Options (Choose Correct Radio)
                </label>
                <span className="text-[11px] text-slate-400">Green radio indicates correct answer</span>
              </div>

              <div className="space-y-2.5">
                {['A', 'B', 'C', 'D'].map((key) => {
                  const isCorrect = question.correctAnswer === key;
                  return (
                    <div
                      key={key}
                      className={`flex items-center space-x-2.5 p-2 rounded-xl border transition ${
                        isCorrect ? 'bg-emerald-950/40 border-emerald-500/60' : 'bg-slate-800/80 border-slate-700'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleFieldChange('correctAnswer', key)}
                        title={`Set ${key} as correct answer`}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition ${
                          isCorrect
                            ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {isCorrect ? <Check className="w-4 h-4 stroke-[3]" /> : key}
                      </button>

                      <input
                        type="text"
                        value={question.options?.[key] || ''}
                        onChange={(e) => handleOptionChange(key, e.target.value)}
                        className="flex-1 bg-transparent text-sm text-slate-100 focus:outline-none"
                        placeholder={`Option ${key} text`}
                      />

                      {isCorrect && (
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40">
                          Answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Answer Explanation (Revealed on Post 2)
              </label>
              <textarea
                rows={3}
                value={question.explanation || ''}
                onChange={(e) => handleFieldChange('explanation', e.target.value)}
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
                spellCheck={false}
                className="w-full px-3.5 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500 transition leading-relaxed resize-none"
                placeholder="Explain why this answer is correct..."
              />
            </div>
          </div>
        )}

        {/* TAB 2: STYLING */}
        {activeTab === 'styling' && (
          <div className="space-y-4">
            {/* Template Selector dropdown/grid */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Instagram Design Template
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => onSelectTemplate(tmpl.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition ${
                      selectedTemplate === tmpl.id
                        ? 'border-brand-500 bg-brand-950/40 ring-1 ring-brand-500'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tmpl.accentColor }}
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-200 truncate">{tmpl.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{tmpl.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Font Family
              </label>
              <select
                value={customization.font || 'font-sans'}
                onChange={(e) => onUpdateCustomization({ ...customization, font: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500"
              >
                <option value="font-sans">Plus Jakarta / Inter (Clean Modern)</option>
                <option value="font-heading">Outfit (Bold Editorial)</option>
                <option value="font-serif">Playfair Display (Academic Serif)</option>
                <option value="font-mono">JetBrains Mono (Tech / Code)</option>
                <option value="font-telugu">Telugu & English (Noto Sans)</option>
              </select>
            </div>

            {/* Font Size & Auto-Fit Control */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Typography Scale & Card Fit
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'auto', label: 'Auto Fit' },
                  { id: 'compact', label: 'Compact' },
                  { id: 'normal', label: 'Normal' },
                  { id: 'large', label: 'Large' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onUpdateCustomization({ ...customization, fontSize: s.id })}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition text-center border ${
                      (customization.fontSize || 'auto') === s.id
                        ? 'bg-brand-600 border-brand-500 text-white shadow-sm'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Background Color override */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Custom Background (Optional Override)
                </label>
                {customization.customBg && (
                  <button
                    onClick={() => onUpdateCustomization({ ...customization, customBg: '' })}
                    className="text-[11px] text-brand-400 hover:underline flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={customization.customBg || '#0f172a'}
                  onChange={(e) => onUpdateCustomization({ ...customization, customBg: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-slate-800 border border-slate-700 p-0.5"
                />
                <input
                  type="text"
                  value={customization.customBg || ''}
                  onChange={(e) => onUpdateCustomization({ ...customization, customBg: e.target.value })}
                  placeholder="Template default (or #0f172a)"
                  className="flex-1 px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white text-xs font-mono"
                />
              </div>
            </div>

            {/* Custom Text Color */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Custom Text Color (Optional Override)
                </label>
                {customization.customTextColor && (
                  <button
                    onClick={() => onUpdateCustomization({ ...customization, customTextColor: '' })}
                    className="text-[11px] text-brand-400 hover:underline flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={customization.customTextColor || '#f8fafc'}
                  onChange={(e) => onUpdateCustomization({ ...customization, customTextColor: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-slate-800 border border-slate-700 p-0.5"
                />
                <input
                  type="text"
                  value={customization.customTextColor || ''}
                  onChange={(e) => onUpdateCustomization({ ...customization, customTextColor: e.target.value })}
                  placeholder="Template default (or #f8fafc)"
                  className="flex-1 px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BRANDING & FORMAT */}
        {activeTab === 'branding' && (
          <div className="space-y-4">
            {/* Dimensions Switcher */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Instagram Canvas Dimensions
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(DIMENSIONS_CONFIG).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => onUpdateDimension(key)}
                    className={`p-3 rounded-xl border text-center transition ${
                      dimension === key
                        ? 'border-brand-500 bg-brand-950/50 ring-1 ring-brand-500 text-brand-300'
                        : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold">{config.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {config.width}×{config.height}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Handle / Branding Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Footer Brand Handle
              </label>
              <input
                type="text"
                value={branding.handle || ''}
                onChange={(e) => onUpdateBranding({ ...branding, handle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500"
                placeholder="learn_in_a_minute"
              />
            </div>

            {/* Tagline / Subtitle */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Header Subtitle / Tagline
              </label>
              <input
                type="text"
                value={branding.subText || ''}
                onChange={(e) => onUpdateBranding({ ...branding, subText: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500"
                placeholder="Daily Knowledge Booster"
              />
            </div>

            {/* Call to Action texts */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Question Call to Action (Post 1)
              </label>
              <input
                type="text"
                value={branding.ctaText || ''}
                onChange={(e) => onUpdateBranding({ ...branding, ctaText: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500"
                placeholder="Comment Your Answer 👇"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Answer Call to Action (Post 2)
              </label>
              <input
                type="text"
                value={branding.answerCtaText || ''}
                onChange={(e) => onUpdateBranding({ ...branding, answerCtaText: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500"
                placeholder="Did you get it right? Share with friends! 🚀"
              />
            </div>

            {/* Logo Upload or URL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Brand Logo
                </label>
                {branding.logoUrl && (
                  <button
                    onClick={() => onUpdateBranding({ ...branding, logoUrl: '' })}
                    className="text-[11px] text-red-400 hover:underline"
                  >
                    Remove Logo
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-3">
                {branding.logoUrl ? (
                  <img
                    src={branding.logoUrl}
                    alt="Logo Preview"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-brand-500"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}

                <div className="flex-1 space-y-1.5">
                  <label className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={branding.logoUrl || ''}
                    onChange={(e) => onUpdateBranding({ ...branding, logoUrl: e.target.value })}
                    placeholder="Or paste image URL"
                    className="w-full px-2.5 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-5 py-3 bg-slate-800/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center space-x-1 text-emerald-400">
          <Check className="w-3.5 h-3.5" />
          <span>Live updates active</span>
        </span>
        <span>Auto-saved to current draft</span>
      </div>
    </div>
  );
}

