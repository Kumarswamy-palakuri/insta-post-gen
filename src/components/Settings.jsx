import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Trash2,
  ShieldAlert,
  Sliders,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Save,
  Check,
  Upload,
  Image as ImageIcon,
  RotateCcw
} from 'lucide-react';
import {
  getApiKey,
  setApiKey,
  removeApiKey,
  getSelectedModel,
  setSelectedModel,
  getPreferences,
  savePreferences,
  clearAllQuizzes,
  clearDownloadHistory,
} from '../utils/storage';
import { testApiConnection, listAvailableModels, AVAILABLE_MODELS } from '../services/aiService';

export default function Settings({ showNotification, onPreferencesUpdated }) {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [selectedModel, setModel] = useState('gemini-2.0-flash');
  const [detectedModels, setDetectedModels] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('idle'); // 'idle' | 'testing' | 'connected' | 'error'
  const [statusMessage, setStatusMessage] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);

  // Preferences state
  const [preferences, setPrefs] = useState(getPreferences());

  useEffect(() => {
    const currentKey = getApiKey();
    setApiKeyInput(currentKey);
    setModel(getSelectedModel() || 'gemini-2.0-flash');
    if (currentKey) {
      setConnectionStatus('idle');
      setStatusMessage('API Key configured in LocalStorage.');
    } else {
      setConnectionStatus('idle');
      setStatusMessage('No API key configured.');
    }
  }, []);

  // Handle Save API Key
  const handleSaveKey = () => {
    if (!apiKeyInput.trim()) {
      removeApiKey();
      setConnectionStatus('idle');
      setStatusMessage('API Key cleared.');
      if (showNotification) showNotification('API key removed', 'info');
      return;
    }

    setApiKey(apiKeyInput.trim());
    setSelectedModel(selectedModel);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    if (showNotification) showNotification('API Settings saved to LocalStorage', 'success');
  };

  // Handle Discover Models
  const handleDiscoverModels = async () => {
    setIsDiscovering(true);
    setStatusMessage('Querying available models from AI server...');

    try {
      const models = await listAvailableModels(apiKeyInput.trim());
      setDetectedModels(models);
      if (models.length > 0) {
        setStatusMessage(`Loaded ${models.length} generateContent models from server.`);
        if (showNotification) showNotification(`Loaded ${models.length} supported models!`, 'success');
      } else {
        setStatusMessage('No generateContent models found.');
      }
    } catch (err) {
      setStatusMessage(`Failed to list models: ${err.message}`);
      if (showNotification) showNotification(`Could not fetch models: ${err.message}`, 'error');
    } finally {
      setIsDiscovering(false);
    }
  };

  // Handle Test Connection
  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    setStatusMessage('Testing connection to Local / Netlify AI Server...');

    const result = await testApiConnection(apiKeyInput.trim(), selectedModel);

    if (result.availableModels && result.availableModels.length > 0) {
      setDetectedModels(result.availableModels);
    }

    if (result.success) {
      setConnectionStatus('connected');
      setStatusMessage(result.message);
      if (apiKeyInput.trim()) {
        setApiKey(apiKeyInput.trim());
      }
      if (result.activeModel) {
        setModel(result.activeModel);
        setSelectedModel(result.activeModel);
      }
      if (showNotification) showNotification(result.message, 'success');
    } else {
      setConnectionStatus('error');
      setStatusMessage(result.message);
      if (showNotification) showNotification(`Connection test failed: ${result.message}`, 'error');
    }
  };

  // Handle Remove API Key
  const handleRemoveKey = () => {
    removeApiKey();
    setApiKeyInput('');
    setConnectionStatus('idle');
    setStatusMessage('API key has been removed.');
    if (showNotification) showNotification('API key removed from browser storage', 'info');
  };

  // Handle Save Branding Defaults
  const handleSaveBranding = (e) => {
    e.preventDefault();
    const updated = savePreferences(preferences);
    setPrefs(updated);
    if (onPreferencesUpdated) onPreferencesUpdated(updated);
    if (showNotification) showNotification('Default branding preferences updated!', 'success');
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
      if (showNotification) showNotification('Saved quizzes cleared', 'info');
    }
  };

  // Handle Reset Download History
  const handleClearDownloads = () => {
    if (window.confirm('Are you sure you want to reset download history?')) {
      clearDownloadHistory();
      if (showNotification) showNotification('Download history cleared', 'info');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white">Application Settings</h2>
        <p className="text-sm text-slate-400 mt-1">
          Configure Gemini AI credentials, default branding, and manage local storage data.
        </p>
      </div>

      {/* Security Warning Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
        <div className="flex items-center space-x-2 font-bold text-amber-400 text-sm">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>Frontend-Only Client-Side Architecture Notice</span>
        </div>
        <p className="leading-relaxed text-amber-200/90">
          This application connects <strong>directly from your browser</strong> to the Google Gemini REST API. Your API key is stored strictly inside your browser's <code>LocalStorage</code> and is never transmitted to any third-party backend server.
        </p>
        <p className="text-amber-300 font-semibold">
          ⚠️ Security Best Practice: Browser-stored keys can be inspected via Developer Tools. This architecture is intended for personal creation, controlled environments, or private workflows, not for public untrusted production deployments.
        </p>
      </div>

      {/* Section 1: AI API Configuration */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Engine & Serverless API Configuration</h3>
              <p className="text-xs text-slate-400">Powered by Local Vite Server & Netlify Serverless Function (/api/generate-quiz)</p>
            </div>
          </div>

          {/* Connection Status Badge */}
          <div className="flex items-center space-x-2">
            {connectionStatus === 'connected' && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Connected & Verified</span>
              </span>
            )}
            {connectionStatus === 'testing' && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-400 border border-brand-500/40 flex items-center space-x-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying...</span>
              </span>
            )}
            {connectionStatus === 'error' && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center space-x-1.5">
                <XCircle className="w-3.5 h-3.5" />
                <span>Connection Failed</span>
              </span>
            )}
            {connectionStatus === 'idle' && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                {apiKeyInput ? 'Key Saved' : 'No Key'}
              </span>
            )}
          </div>
        </div>

        {/* API Key Input */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Custom Gemini API Key Override (Optional)
          </label>
          <p className="text-[11px] text-slate-400 mb-2">
            The server automatically uses <code className="text-brand-300 bg-slate-800 px-1 py-0.5 rounded">GEMINI_API_KEY</code> from your <code className="text-brand-300 bg-slate-800 px-1 py-0.5 rounded">.env</code> file or Netlify environment variables. Enter a custom key below only if you want to override the server key from your browser.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Leave empty to use server GEMINI_API_KEY..."
              className="flex-1 px-4 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-brand-500"
            />
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={connectionStatus === 'testing'}
                className="flex-1 sm:flex-initial justify-center px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-bold text-slate-200 transition flex items-center space-x-1.5"
                title="Test connection using server environment key or custom override"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${connectionStatus === 'testing' ? 'animate-spin' : ''}`} />
                <span>Test Connection</span>
              </button>
              <button
                type="button"
                onClick={handleSaveKey}
                className="flex-1 sm:flex-initial justify-center px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition flex items-center space-x-1.5 shadow-md shadow-brand-600/30"
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'Saved' : 'Save Key'}</span>
              </button>
              {apiKeyInput && (
                <button
                  type="button"
                  onClick={handleRemoveKey}
                  className="px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition flex items-center justify-center"
                  title="Remove Custom Key"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          {statusMessage && (
            <p className="text-xs text-slate-400 mt-2">{statusMessage}</p>
          )}
          <div className="mt-2 text-xs text-slate-500 flex items-center space-x-1">
            <span>Don't have an API key?</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-brand-400 hover:underline flex items-center space-x-0.5"
            >
              <span>Get one free at Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Model Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Selected Gemini Model
            </label>
            <button
              type="button"
              onClick={handleDiscoverModels}
              disabled={isDiscovering}
              className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center space-x-1.5 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isDiscovering ? 'animate-spin' : ''}`} />
              <span>{isDiscovering ? 'Querying Google...' : 'Fetch Supported Models from Key'}</span>
            </button>
          </div>

          {/* If live models were detected */}
          {detectedModels.length > 0 && (
            <div className="mb-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Models detected for your API Key ({detectedModels.length})</span>
                </span>
                <span className="text-[10px] text-slate-400">Click to activate</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {detectedModels.map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => {
                      setModel(m.id);
                      setSelectedModel(m.id);
                      if (showNotification) showNotification(`Selected: ${m.id}`, 'info');
                    }}
                    className={`p-2 rounded-lg border text-left text-xs transition ${
                      selectedModel === m.id
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold'
                        : 'border-slate-800 bg-slate-850 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="truncate font-mono">{m.id}</div>
                    {m.name && m.name !== m.id && (
                      <div className="text-[10px] text-slate-400 truncate">{m.name}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preset Recommendation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {AVAILABLE_MODELS.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => {
                  setModel(m.id);
                  setSelectedModel(m.id);
                  if (showNotification) showNotification(`Model set to ${m.name}`, 'info');
                }}
                className={`p-3 rounded-xl border text-left transition ${
                  selectedModel === m.id
                    ? 'border-brand-500 bg-brand-950/40 ring-1 ring-brand-500 text-brand-300'
                    : 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold truncate">{m.name}</div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">{m.desc}</div>
              </button>
            ))}
          </div>

          {/* Active Model pill and Custom Model input */}
          <div className="mt-3 flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Current Model:</span>
            <span className="font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
              {selectedModel}
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Default Branding Preferences */}
      <form onSubmit={handleSaveBranding} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Default Instagram Branding</h3>
            <p className="text-xs text-slate-400">Set default handles and call-to-action text for newly generated posts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Default Handle
            </label>
            <input
              type="text"
              value={preferences.branding?.handle || ''}
              onChange={(e) =>
                setPrefs({
                  ...preferences,
                  branding: { ...preferences.branding, handle: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-brand-500"
              placeholder="learn_in_a_minute"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Default Subtext / Tagline
            </label>
            <input
              type="text"
              value={preferences.branding?.subText || ''}
              onChange={(e) =>
                setPrefs({
                  ...preferences,
                  branding: { ...preferences.branding, subText: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-brand-500"
              placeholder="Daily Knowledge Booster"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Question CTA (Post 1)
            </label>
            <input
              type="text"
              value={preferences.branding?.ctaText || ''}
              onChange={(e) =>
                setPrefs({
                  ...preferences,
                  branding: { ...preferences.branding, ctaText: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-brand-500"
              placeholder="Comment Your Answer 👇"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Answer Reveal CTA (Post 2)
            </label>
            <input
              type="text"
              value={preferences.branding?.answerCtaText || ''}
              onChange={(e) =>
                setPrefs({
                  ...preferences,
                  branding: { ...preferences.branding, answerCtaText: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-brand-500"
              placeholder="Share with study group! 🚀"
            />
          </div>
        </div>

        {/* Brand Logo Upload & Preview */}
        <div className="pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Brand Logo
            </label>
            {preferences.branding?.logoUrl && preferences.branding.logoUrl !== '/logo.png' && (
              <button
                type="button"
                onClick={handleResetDefaultLogo}
                className="text-[11px] text-brand-400 hover:text-brand-300 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Default Logo</span>
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative group flex-shrink-0">
              <img
                src={preferences.branding?.logoUrl || '/logo.png'}
                alt="Brand Logo"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-500/40 shadow-lg shadow-brand-500/20 bg-slate-800"
              />
            </div>

            <div className="space-y-1.5 flex-1 w-full">
              <div className="flex items-center space-x-2">
                <label className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5 text-brand-400" />
                  <span>Upload Custom Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                {preferences.branding?.logoUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      setPrefs((prev) => ({
                        ...prev,
                        branding: { ...prev.branding, logoUrl: '' },
                      }))
                    }
                    className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                value={preferences.branding?.logoUrl || ''}
                onChange={(e) =>
                  setPrefs((prev) => ({
                    ...prev,
                    branding: { ...prev.branding, logoUrl: e.target.value },
                  }))
                }
                placeholder="Or paste image URL (e.g., /logo.png)"
                className="w-full px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-brand-600/30 transition flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Branding Defaults</span>
          </button>
        </div>
      </form>

      {/* Section 3: Local Data Management */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white">LocalStorage Data Management</h3>
        <p className="text-xs text-slate-400">
          Clear cached quizzes and download logs stored in this browser session.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handleClearQuizzes}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-red-950/40 border border-slate-700 hover:border-red-500/50 text-xs font-semibold text-slate-300 hover:text-red-300 transition flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Saved Quizzes</span>
          </button>

          <button
            type="button"
            onClick={handleClearDownloads}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-red-950/40 border border-slate-700 hover:border-red-500/50 text-xs font-semibold text-slate-300 hover:text-red-300 transition flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Download History</span>
          </button>
        </div>
      </div>
    </div>
  );
}

