import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Sparkles,
  Save,
  Check,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Trash2,
  Bookmark,
  Layers,
  Palette
} from 'lucide-react';
import {
  getPreferences,
  savePreferences,
  clearAllQuizzes,
  clearDownloadHistory,
  getStats
} from '../utils/storage';
import { TEMPLATES } from '../templates';
import { DIMENSIONS_CONFIG } from '../utils/imageExport';

export default function Settings({ showNotification, onPreferencesUpdated }) {
  const [preferences, setPrefs] = useState(getPreferences());
  const [isSaved, setIsSaved] = useState(false);
  const [stats, setStats] = useState({ totalQuestionsGenerated: 0, totalImagesDownloaded: 0, totalSavedQuizzes: 0 });

  useEffect(() => {
    setStats(getStats());
  }, []);

  // Handle Save Branding Defaults
  const handleSaveBranding = (e) => {
    e.preventDefault();
    const updated = savePreferences(preferences);
    setPrefs(updated);
    if (onPreferencesUpdated) onPreferencesUpdated(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    if (showNotification) showNotification('Branding & Studio settings saved!', 'success');
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPrefs((prev) => ({
          ...prev,
          branding: {
            ...prev.branding,
            logoUrl: event.target?.result,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetDefaultLogo = () => {
    setPrefs((prev) => ({
      ...prev,
      branding: {
        ...prev.branding,
        logoUrl: '/logo.png',
      },
    }));
    if (showNotification) showNotification('Restored default logo', 'info');
  };

  // Handle Reset Quizzes
  const handleClearQuizzes = () => {
    if (window.confirm('Are you sure you want to delete all saved quizzes? This cannot be undone.')) {
      clearAllQuizzes();
      setStats(getStats());
      if (showNotification) showNotification('Saved quizzes cleared', 'info');
    }
  };

  // Handle Reset Download History
  const handleClearDownloads = () => {
    if (window.confirm('Are you sure you want to reset download history?')) {
      clearDownloadHistory();
      setStats(getStats());
      if (showNotification) showNotification('Download history cleared', 'info');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white">Studio & Branding Settings</h2>
        <p className="text-sm text-slate-400 mt-1">
          Customize your default Instagram handle, watermarks, post templates, and export dimensions.
        </p>
      </div>

      {/* Section 1: Default Branding Configuration */}
      <form onSubmit={handleSaveBranding} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Default Instagram Branding</h3>
              <p className="text-xs text-slate-400">These details automatically apply to all generated post frames</p>
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center space-x-1.5 shadow-md shadow-brand-600/30 active:scale-95"
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Saved!' : 'Save Preferences'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Instagram Handle */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Instagram Username / Handle
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold">@</span>
              <input
                type="text"
                value={preferences.branding?.handle?.replace(/^@/, '') || ''}
                onChange={(e) =>
                  setPrefs((prev) => ({
                    ...prev,
                    branding: { ...prev.branding, handle: e.target.value.trim() },
                  }))
                }
                placeholder="learn_in_a_minute"
                className="w-full pl-8 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Displayed in the header watermark and footer credits.</p>
          </div>

          {/* Subtitle / Channel Slogan */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Channel Slogan / Subtext
            </label>
            <input
              type="text"
              value={preferences.branding?.subText || ''}
              onChange={(e) =>
                setPrefs((prev) => ({
                  ...prev,
                  branding: { ...prev.branding, subText: e.target.value },
                }))
              }
              placeholder="Daily Knowledge Booster"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">Appears directly beneath your Instagram handle in the post frame.</p>
          </div>

          {/* Question Call to Action */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Question Slide CTA Text
            </label>
            <input
              type="text"
              value={preferences.branding?.ctaText || ''}
              onChange={(e) =>
                setPrefs((prev) => ({
                  ...prev,
                  branding: { ...prev.branding, ctaText: e.target.value },
                }))
              }
              placeholder="Comment Your Answer 👇"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">Shown in the footer of Slide 1 to boost Instagram comments.</p>
          </div>

          {/* Answer Slide Call to Action */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Answer Reveal Slide CTA Text
            </label>
            <input
              type="text"
              value={preferences.branding?.answerCtaText || ''}
              onChange={(e) =>
                setPrefs((prev) => ({
                  ...prev,
                  branding: { ...prev.branding, answerCtaText: e.target.value },
                }))
              }
              placeholder="Did you get it right? Share with friends! 🚀"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">Shown in the footer of Slide 2 to maximize shares and saves.</p>
          </div>

          {/* Default Template Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Default Post Template
            </label>
            <select
              value={preferences.defaultTemplate || 'black-gold'}
              onChange={(e) =>
                setPrefs((prev) => ({
                  ...prev,
                  defaultTemplate: e.target.value,
                }))
              }
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
            >
              {TEMPLATES.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.name} ({tmpl.category})
                </option>
              ))}
            </select>
          </div>

          {/* Default Dimensions */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Default Export Aspect Ratio
            </label>
            <select
              value={preferences.defaultDimensions || 'square'}
              onChange={(e) =>
                setPrefs((prev) => ({
                  ...prev,
                  defaultDimensions: e.target.value,
                }))
              }
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
            >
              {Object.entries(DIMENSIONS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label} ({config.width}x{config.height}px)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Logo Customization */}
        <div className="pt-4 border-t border-slate-800">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Brand Logo / Avatar
          </label>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/80">
            <img
              src={preferences.branding?.logoUrl || '/logo.png'}
              alt="Logo Preview"
              className="w-14 h-14 rounded-full object-cover border-2 border-brand-500/50 shadow-md"
            />
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <label className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs cursor-pointer transition flex items-center space-x-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Logo Image</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
                <button
                  type="button"
                  onClick={handleResetDefaultLogo}
                  className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-650 text-slate-300 font-semibold text-xs transition flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Default</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Recommended: Square PNG with transparent background (1:1 ratio, min 200x200px).
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* Section 2: Storage & Reset Data */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Browser Storage & Reset</h3>
            <p className="text-xs text-slate-400">Manage saved JSON drafts and downloaded post history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Saved Quizzes in Library</div>
              <div className="text-[11px] text-slate-400">{stats.totalSavedQuizzes} saved draft sets</div>
            </div>
            <button
              onClick={handleClearQuizzes}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white font-bold text-xs transition"
            >
              Clear
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Download History Log</div>
              <div className="text-[11px] text-slate-400">{stats.totalImagesDownloaded} images exported</div>
            </div>
            <button
              onClick={handleClearDownloads}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white font-bold text-xs transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
