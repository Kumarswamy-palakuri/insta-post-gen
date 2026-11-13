import React, { useState } from 'react';
import {
  Code2,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Check,
  FolderArchive,
  Layers
} from 'lucide-react';
import JsonToFrameInput from '../components/JsonToFrameInput';
import QuizPreview from '../components/QuizPreview';
import QuizEditor from '../components/QuizEditor';
import DownloadManager from '../components/DownloadManager';
import { saveQuiz } from '../utils/storage';

export default function Generate({
  questions,
  onQuestionsChange,
  currentQuestionIndex,
  onCurrentQuestionIndexChange,
  selectedTemplate,
  onSelectTemplate,
  branding,
  onUpdateBranding,
  customization,
  onUpdateCustomization,
  dimension,
  onUpdateDimension,
  onNavigateToSettings,
  showNotification,
}) {
  const [showJsonInput, setShowJsonInput] = useState(questions.length === 0);
  const [showEditor, setShowEditor] = useState(false);
  const [showDownloadManager, setShowDownloadManager] = useState(false);

  // When new questions are parsed from JsonToFrameInput
  const handleFramesUpdated = (newQuestions) => {
    onQuestionsChange(newQuestions);
    if (currentQuestionIndex >= newQuestions.length) {
      onCurrentQuestionIndexChange(0);
    }
  };

  // Update a single question
  const handleUpdateCurrentQuestion = (updatedQuestion) => {
    const updated = [...questions];
    updated[currentQuestionIndex] = updatedQuestion;
    onQuestionsChange(updated);
  };

  // Save current quiz to local storage
  const handleSaveQuiz = () => {
    if (!questions || questions.length === 0) return;
    const firstQ = questions[0];
    saveQuiz({
      title: `${firstQ.topic || 'Quiz'} Set`,
      topic: firstQ.topic || 'General Quiz',
      difficulty: firstQ.difficulty || 'Medium',
      language: firstQ.language || 'English',
      questions: questions,
      templateId: selectedTemplate,
    });
    if (showNotification) {
      showNotification('Quiz saved to your library!', 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
            <span>JSON to Frame Studio</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
              Instant Posts
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Convert Quiz JSON into high-resolution Question & Answer Instagram frames.
          </p>
        </div>

        <div className="w-full sm:w-auto flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setShowJsonInput(!showJsonInput)}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 flex-shrink-0 active:scale-95 border ${
              showJsonInput
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>{showJsonInput ? 'Hide Prompt/JSON' : 'AI Prompt & JSON'}</span>
            {showJsonInput ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {questions.length > 0 && (
            <>
              <button
                onClick={() => setShowEditor(!showEditor)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border flex-shrink-0 active:scale-95 ${
                  showEditor
                    ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-brand-400" />
                <span>{showEditor ? 'Frames Only' : 'Customize Style'}</span>
              </button>

              <button
                onClick={() => setShowDownloadManager(true)}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-500/25 transition flex items-center space-x-1.5 flex-shrink-0 active:scale-95"
              >
                <FolderArchive className="w-3.5 h-3.5" />
                <span>Export All ({questions.length * 2})</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* JSON to Frame Input Section */}
      {showJsonInput && (
        <JsonToFrameInput
          initialQuestions={questions}
          onFramesUpdated={handleFramesUpdated}
          showNotification={showNotification}
        />
      )}

      {/* Main Studio Workspace: Visual Customizer + Frame Preview */}
      {questions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Optional Sidebar Editor Panel */}
          {showEditor && (
            <div className="lg:col-span-5 order-2 lg:order-1">
              <QuizEditor
                question={questions[currentQuestionIndex] || questions[0]}
                onUpdateQuestion={handleUpdateCurrentQuestion}
                branding={branding}
                onUpdateBranding={onUpdateBranding}
                customization={customization}
                onUpdateCustomization={onUpdateCustomization}
                dimension={dimension}
                onUpdateDimension={onUpdateDimension}
                selectedTemplate={selectedTemplate}
                onSelectTemplate={onSelectTemplate}
                onClose={() => setShowEditor(false)}
              />
            </div>
          )}

          {/* Live Preview Area */}
          <div className={`${showEditor ? 'lg:col-span-7' : 'lg:col-span-12'} order-1 lg:order-2 space-y-4`}>
            <QuizPreview
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              onChangeQuestionIndex={onCurrentQuestionIndexChange}
              selectedTemplate={selectedTemplate}
              branding={branding}
              customization={customization}
              dimension={dimension}
              onUpdateDimension={onUpdateDimension}
              onOpenEditor={() => setShowEditor(true)}
              onSaveQuiz={handleSaveQuiz}
              onOpenDownloadManager={() => setShowDownloadManager(true)}
              showNotification={showNotification}
            />
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-12 text-center space-y-3">
          <Code2 className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No JSON Loaded Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click "Edit JSON" above or paste your Quiz JSON to render Question and Answer post frames.
          </p>
          <button
            onClick={() => setShowJsonInput(true)}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition"
          >
            Open JSON Editor
          </button>
        </div>
      )}

      {/* Bulk Download Manager Modal */}
      {showDownloadManager && (
        <DownloadManager
          questions={questions}
          selectedTemplate={selectedTemplate}
          branding={branding}
          customization={customization}
          dimension={dimension}
          onClose={() => setShowDownloadManager(false)}
          showNotification={showNotification}
        />
      )}
    </div>
  );
}
