import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Check,
  RefreshCw,
  FolderArchive,
  ArrowLeft
} from 'lucide-react';
import QuizGenerator from '../components/QuizGenerator';
import QuizPreview from '../components/QuizPreview';
import QuizEditor from '../components/QuizEditor';
import DownloadManager from '../components/DownloadManager';
import { regenerateSingleQuestionWithAI } from '../services/aiService';
import { saveQuiz, getApiKey } from '../utils/storage';

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
  const [showGeneratorForm, setShowGeneratorForm] = useState(questions.length === 0);
  const [showEditor, setShowEditor] = useState(false);
  const [showDownloadManager, setShowDownloadManager] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // When new questions are generated from QuizGenerator
  const handleQuizGenerated = (newQuestions, metadata) => {
    onQuestionsChange(newQuestions);
    onCurrentQuestionIndexChange(0);
    setShowGeneratorForm(false);
  };

  // Update a single question
  const handleUpdateCurrentQuestion = (updatedQuestion) => {
    const updated = [...questions];
    updated[currentQuestionIndex] = updatedQuestion;
    onQuestionsChange(updated);
  };

  // Regenerate a single question with Gemini AI
  const handleRegenerateQuestion = async (index) => {
    const qToReplace = questions[index];
    if (!qToReplace) return;

    setIsRegenerating(true);
    try {
      const newQ = await regenerateSingleQuestionWithAI({
        topic: qToReplace.topic,
        difficulty: qToReplace.difficulty,
        language: qToReplace.language,
        excludeQuestion: qToReplace.question,
      });

      const updated = [...questions];
      updated[index] = newQ;
      onQuestionsChange(updated);

      if (showNotification) {
        showNotification(`Question ${index + 1} regenerated successfully!`, 'success');
      }
    } catch (err) {
      if (showNotification) {
        showNotification(`Failed to regenerate question: ${err.message}`, 'error');
      }
    } finally {
      setIsRegenerating(false);
    }
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
          <h2 className="text-xl sm:text-2xl font-black text-white">Quiz Studio</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Craft AI questions, select styles & export for Instagram.
          </p>
        </div>

        {questions.length > 0 && (
          <div className="w-full sm:w-auto flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setShowGeneratorForm(!showGeneratorForm)}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition flex items-center space-x-1.5 flex-shrink-0 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>{showGeneratorForm ? 'Hide Form' : 'New Topic'}</span>
              {showGeneratorForm ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setShowEditor(!showEditor)}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border flex-shrink-0 active:scale-95 ${
                showEditor
                  ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-brand-400" />
              <span>{showEditor ? 'Preview Only' : 'Customize'}</span>
            </button>

            <button
              onClick={() => setShowDownloadManager(true)}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-500/25 transition flex items-center space-x-1.5 flex-shrink-0 active:scale-95"
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>Export ZIP ({questions.length * 2})</span>
            </button>
          </div>
        )}
      </div>

      {/* Generator Form Section */}
      {showGeneratorForm && (
        <QuizGenerator
          onQuizGenerated={handleQuizGenerated}
          onNavigateToSettings={onNavigateToSettings}
          showNotification={showNotification}
        />
      )}

      {/* Main Studio Workspace: Editor + Preview */}
      {questions.length > 0 && (
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
              onRegenerateQuestion={handleRegenerateQuestion}
              isRegenerating={isRegenerating}
              showNotification={showNotification}
            />
          </div>
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

