import React, { useState, useEffect } from 'react';
import {
  Menu,
  Sparkles,
  KeyRound,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Shuffle
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import MobileBottomNav from './components/MobileBottomNav';
import Home from './pages/Home';
import Generate from './pages/Generate';
import Templates from './pages/Templates';
import SavedQuizzes from './pages/SavedQuizzes';
import SettingsPage from './pages/Settings';
import {
  getPreferences,
  savePreferences,
  getApiKey,
  incrementQuestionsGenerated,
  saveRecentQuiz,
} from './utils/storage';
import { getOfflineSampleQuestions, SAMPLE_QUESTIONS_LIBRARY } from './services/aiService';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // App & Studio State
  const initialPrefs = getPreferences();
  const [branding, setBranding] = useState({
    handle: initialPrefs.branding?.handle || 'learn_in_a_minute',
    subText: initialPrefs.branding?.subText || 'Daily Knowledge Booster',
    logoUrl: initialPrefs.branding?.logoUrl || '/logo.png',
    ctaText: initialPrefs.branding?.ctaText || 'Comment Your Answer 👇',
    answerCtaText: initialPrefs.branding?.answerCtaText || 'Did you get it right? Share with friends! 🚀',
  });
  const [selectedTemplate, setSelectedTemplate] = useState(initialPrefs.defaultTemplate || 'black-gold');
  const [dimension, setDimension] = useState(initialPrefs.defaultDimensions || 'square');
  const [customization, setCustomization] = useState({
    font: 'font-sans',
    customBg: '',
    customTextColor: '',
  });

  // Active Questions in Studio (Default sample questions loaded for instant interactive delight!)
  const [questions, setQuestions] = useState(() => {
    return SAMPLE_QUESTIONS_LIBRARY['Indian History'] || [];
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const addNotification = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync theme with HTML document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // 1-Click Instant Random Quiz generator
  const handleQuickGenerateRandom = () => {
    const categories = Object.keys(SAMPLE_QUESTIONS_LIBRARY);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const generated = getOfflineSampleQuestions(randomCategory, 3, 'Medium', 'English');

    setQuestions(generated);
    setCurrentQuestionIndex(0);
    incrementQuestionsGenerated(generated.length);
    saveRecentQuiz({
      id: `quick_${Date.now()}`,
      topic: randomCategory,
      difficulty: 'Medium',
      language: 'English',
      questionsCount: generated.length,
      createdAt: new Date().toISOString(),
      questions: generated,
    });

    setCurrentPage('generate');
    addNotification(`Loaded 3 questions on "${randomCategory}"!`, 'success');
  };

  // Load a saved or recent quiz into studio
  const handleLoadQuizIntoStudio = (quiz) => {
    if (quiz.questions && quiz.questions.length > 0) {
      setQuestions(quiz.questions);
      setCurrentQuestionIndex(0);
      if (quiz.templateId) {
        setSelectedTemplate(quiz.templateId);
      }
      setCurrentPage('generate');
      addNotification(`Opened "${quiz.topic || quiz.title}" in Studio`, 'success');
    }
  };

  // Use a template from the Templates gallery
  const handleUseTemplateInStudio = (templateId) => {
    setSelectedTemplate(templateId);
    setCurrentPage('generate');
    addNotification(`Applied template: ${templateId}`, 'info');
  };

  const hasApiKey = Boolean(getApiKey());

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        hasApiKey={hasApiKey}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main App Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className={`sticky top-0 z-30 px-3 sm:px-8 py-2.5 sm:py-3.5 border-b backdrop-blur-md transition-colors ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
        } flex items-center justify-between`}>
          {/* Mobile hamburger + Breadcrumb */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs font-bold">
              <span className="text-slate-400 hidden xs:inline">QuizCraft</span>
              <span className="text-slate-600 hidden xs:inline">/</span>
              <span className="capitalize text-brand-400 truncate max-w-[130px] sm:max-w-none">
                {currentPage === 'generate' ? 'Studio' : currentPage}
              </span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            <button
              onClick={handleQuickGenerateRandom}
              title="1-Click Random Quiz"
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center space-x-1 sm:space-x-1.5 border border-slate-700/80"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Random Quiz</span>
            </button>

            <button
              onClick={() => setCurrentPage('generate')}
              className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center space-x-1 sm:space-x-1.5 shadow-md shadow-brand-600/25"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Create Post</span>
              <span className="xs:hidden">Create</span>
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-28 lg:pb-8 max-w-7xl w-full mx-auto">
          {currentPage === 'home' && (
            <Home
              onNavigate={setCurrentPage}
              onQuickGenerateRandom={handleQuickGenerateRandom}
              onLoadRecentQuiz={handleLoadQuizIntoStudio}
              hasApiKey={hasApiKey}
            />
          )}

          {currentPage === 'generate' && (
            <Generate
              questions={questions}
              onQuestionsChange={setQuestions}
              currentQuestionIndex={currentQuestionIndex}
              onCurrentQuestionIndexChange={setCurrentQuestionIndex}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
              branding={branding}
              onUpdateBranding={setBranding}
              customization={customization}
              onUpdateCustomization={setCustomization}
              dimension={dimension}
              onUpdateDimension={setDimension}
              onNavigateToSettings={() => setCurrentPage('settings')}
              showNotification={addNotification}
            />
          )}

          {currentPage === 'templates' && (
            <Templates
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
              onUseTemplateInStudio={handleUseTemplateInStudio}
              branding={branding}
            />
          )}

          {currentPage === 'saved' && (
            <SavedQuizzes
              onLoadQuizIntoStudio={handleLoadQuizIntoStudio}
              onNavigateToGenerate={() => setCurrentPage('generate')}
              showNotification={addNotification}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              showNotification={addNotification}
              onPreferencesUpdated={(newPrefs) => {
                if (newPrefs.branding) setBranding(newPrefs.branding);
                if (newPrefs.defaultTemplate) setSelectedTemplate(newPrefs.defaultTemplate);
              }}
            />
          )}
        </main>
      </div>

      {/* Native Mobile Bottom Navigation Bar for Android & Mobile Screens */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isDarkMode={isDarkMode}
      />

      {/* Floating Toast Notifications */}
      <div className="fixed bottom-20 lg:bottom-5 right-3 sm:right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-[calc(100vw-24px)]">
        {toasts.map((toast) => {
          let bgClass = 'bg-slate-900 border-slate-700 text-white';
          let icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />;

          if (toast.type === 'error') {
            bgClass = 'bg-red-950/90 border-red-500/50 text-red-100';
            icon = <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />;
          } else if (toast.type === 'info') {
            bgClass = 'bg-brand-950/90 border-brand-500/50 text-brand-100';
            icon = <Info className="w-4 h-4 text-brand-400 flex-shrink-0" />;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3.5 rounded-2xl border shadow-2xl flex items-center space-x-3 text-xs font-semibold backdrop-blur-md max-w-sm transition-all duration-300 animate-slide-in ${bgClass}`}
            >
              {icon}
              <span className="flex-1 leading-snug">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
