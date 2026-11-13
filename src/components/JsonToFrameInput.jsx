import React, { useState, useEffect, useRef } from 'react';
import {
  Code2,
  Upload,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileCode,
  Layers,
  ArrowRight,
  Trash2,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { parseQuizJsonToFrames } from '../utils/jsonFrameParser';
import { DEFAULT_SAMPLE_JSON_STRING } from '../utils/sampleQuizJson';
import PromptBuilder from './PromptBuilder';

export default function JsonToFrameInput({
  initialQuestions = [],
  onFramesUpdated,
  showNotification,
}) {
  const [activeTab, setActiveTab] = useState('prompt'); // 'prompt' | 'json'
  const [jsonText, setJsonText] = useState(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      return JSON.stringify(initialQuestions, null, 2);
    }
    return DEFAULT_SAMPLE_JSON_STRING;
  });

  const [parseStatus, setParseStatus] = useState({ success: true, count: 0, error: null });
  const [copied, setCopied] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Validate on change
  useEffect(() => {
    const result = parseQuizJsonToFrames(jsonText);
    if (result.success) {
      setParseStatus({ success: true, count: result.questions.length, error: null });
      if (autoSync && onFramesUpdated) {
        onFramesUpdated(result.questions);
      }
    } else {
      setParseStatus({ success: false, count: 0, error: result.error });
    }
  }, [jsonText, autoSync]);

  // Handle manual "Apply to Frames" click
  const handleApplyFrames = () => {
    const result = parseQuizJsonToFrames(jsonText);
    if (result.success) {
      onFramesUpdated(result.questions);
      if (showNotification) {
        showNotification(`Rendered ${result.questions.length} questions (${result.questions.length * 2} Instagram slides)!`, 'success');
      }
    } else {
      if (showNotification) {
        showNotification(result.error, 'error');
      }
    }
  };

  // Prettify / format JSON
  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
      if (showNotification) showNotification('JSON formatted successfully', 'success');
    } catch (err) {
      if (showNotification) showNotification('Cannot format invalid JSON syntax', 'error');
    }
  };

  // Load sample JSON
  const handleLoadSample = () => {
    setJsonText(DEFAULT_SAMPLE_JSON_STRING);
    if (showNotification) showNotification('Loaded sample Quiz JSON!', 'info');
  };

  // Copy JSON to clipboard
  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (showNotification) showNotification('JSON copied to clipboard', 'success');
  };

  // Upload .json file
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setJsonText(content);
        if (showNotification) showNotification(`Loaded JSON from "${file.name}"`, 'success');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Clear editor
  const handleClear = () => {
    setJsonText('');
  };

  const handleSwitchToJsonTab = () => {
    setActiveTab('json');
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  return (
    <div className="space-y-3">
      {/* Workflow Tabs: Prompt Generator vs JSON Input */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('prompt')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 active:scale-95 ${
              activeTab === 'prompt'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>1. Auto AI Prompt Builder</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 active:scale-95 ${
              activeTab === 'json'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-brand-300" />
            <span>2. Paste JSON to Frames</span>
            {parseStatus.success && parseStatus.count > 0 && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-white/20">
                {parseStatus.count}
              </span>
            )}
          </button>
        </div>

        <div className="text-[11px] text-slate-400 hidden md:flex items-center space-x-1.5 px-3">
          <span>Workflow:</span>
          <span className="text-slate-300 font-semibold">Select Options → Copy Prompt → Paste in Local AI → Paste JSON below</span>
        </div>
      </div>

      {/* TAB 1: Auto AI Prompt Builder */}
      {activeTab === 'prompt' && (
        <PromptBuilder
          onSwitchToJsonInput={handleSwitchToJsonTab}
          showNotification={showNotification}
        />
      )}

      {/* TAB 2: Direct JSON to Frame Input */}
      {activeTab === 'json' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden transition-all">
          {/* Header Bar */}
          <div className="px-4 py-3 bg-slate-800/90 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white flex items-center space-x-2">
                  <span>JSON to Frame Input</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    Paste AI Result Here
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Paste the JSON received from your local AI (ChatGPT, Claude, Ollama, DeepSeek) to render frames.
                </p>
              </div>
            </div>

            {/* Toolbar Buttons */}
            <div className="flex items-center flex-wrap gap-1.5">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json,application/json"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition flex items-center space-x-1.5 active:scale-95"
                title="Upload a .json file from computer"
              >
                <Upload className="w-3.5 h-3.5 text-sky-400" />
                <span>Upload JSON</span>
              </button>

              <button
                type="button"
                onClick={handleLoadSample}
                className="px-2.5 py-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition flex items-center space-x-1.5 active:scale-95"
                title="Load 3-question example JSON"
              >
                <FileCode className="w-3.5 h-3.5 text-amber-400" />
                <span>Sample JSON</span>
              </button>

              <button
                type="button"
                onClick={handleFormatJson}
                className="px-2.5 py-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition flex items-center space-x-1.5 active:scale-95"
                title="Prettify JSON indentation"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Format</span>
              </button>

              <button
                type="button"
                onClick={handleCopyJson}
                className="px-2.5 py-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition flex items-center space-x-1.5 active:scale-95"
                title="Copy JSON to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg bg-slate-700/80 hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition"
                title="Clear editor"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Paste the AI JSON array here. Any markdown formatting (e.g. ```json) is automatically cleaned.
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('prompt')}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center space-x-1 underline underline-offset-2 flex-shrink-0 ml-2"
            >
              <span>Need a prompt? Open Prompt Builder</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Editor Body */}
          <div className="p-3 sm:p-4 space-y-3">
            <div className="relative rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-inner">
              <textarea
                ref={textareaRef}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                rows={11}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
                placeholder={`[\n  {\n    "topic": "Indian History",\n    "difficulty": "Medium",\n    "question": "Who founded the Maurya Empire with Chanakya?",\n    "options": {\n      "A": "Ashoka the Great",\n      "B": "Chandragupta Maurya",\n      "C": "Bindusara",\n      "D": "Harshavardhana"\n    },\n    "correctAnswer": "B",\n    "explanation": "Chandragupta Maurya founded the Maurya Empire in 322 BCE."\n  }\n]`}
                className="w-full p-3 font-mono text-xs sm:text-sm text-slate-200 bg-transparent resize-y focus:outline-none focus:ring-1 focus:ring-brand-500/50 leading-relaxed placeholder:text-slate-600"
              />
            </div>

            {/* Status Bar & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              {/* Status Badge */}
              <div className="min-w-0">
                {parseStatus.success ? (
                  <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">
                      Valid JSON: {parseStatus.count} Questions ({parseStatus.count * 2} Instagram slides ready)
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-2 text-xs font-bold text-red-400 bg-red-950/50 border border-red-500/30 px-3 py-1.5 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="truncate">{parseStatus.error}</span>
                  </div>
                )}
              </div>

              {/* Sync & Apply Buttons */}
              <div className="flex items-center space-x-3 self-end sm:self-auto">
                <label className="flex items-center space-x-2 text-xs text-slate-300 font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoSync}
                    onChange={(e) => setAutoSync(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 bg-slate-800 border-slate-700 focus:ring-brand-500 focus:ring-offset-slate-900"
                  />
                  <span>Live Auto-Sync</span>
                </label>

                <button
                  type="button"
                  onClick={handleApplyFrames}
                  disabled={!parseStatus.success}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-brand-600/30 transition flex items-center space-x-1.5 disabled:opacity-40 disabled:pointer-events-none active:scale-95"
                >
                  <Layers className="w-4 h-4" />
                  <span>Apply to Frames</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
