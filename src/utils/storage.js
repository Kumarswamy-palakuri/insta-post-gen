/**
 * LocalStorage utility for QuizCraft AI
 * Manages API keys, saved quizzes, download history, branding preferences, and statistics.
 */

const KEYS = {
  API_KEY: 'quizcraft_api_key',
  SELECTED_MODEL: 'quizcraft_selected_model',
  SAVED_QUIZZES: 'quizcraft_saved_quizzes',
  DOWNLOAD_HISTORY: 'quizcraft_download_history',
  STATS: 'quizcraft_stats',
  PREFERENCES: 'quizcraft_preferences',
  RECENT_QUIZZES: 'quizcraft_recent_quizzes',
};

// Initial default branding & preferences
const DEFAULT_PREFERENCES = {
  theme: 'dark', // 'dark' | 'light'
  defaultDimensions: 'square', // 'square' (1080x1080) | 'portrait' (1080x1350) | 'story' (1080x1920)
  defaultTemplate: 'black-gold',
  branding: {
    handle: 'learn_in_a_minute',
    subText: 'Daily Knowledge Booster',
    logoUrl: '/logo.png',
    ctaText: 'Comment Your Answer 👇',
    answerCtaText: 'Did you get it right? Share with friends! 🚀',
    showBadge: true,
  },
};

const DEFAULT_STATS = {
  totalQuestionsGenerated: 0,
  totalImagesDownloaded: 0,
  totalSavedQuizzes: 0,
};

// --- API Key Management ---
export const getApiKey = () => {
  try {
    return localStorage.getItem(KEYS.API_KEY) || '';
  } catch (e) {
    console.error('Failed to get API key from localStorage', e);
    return '';
  }
};

export const setApiKey = (key) => {
  try {
    if (!key) {
      localStorage.removeItem(KEYS.API_KEY);
    } else {
      localStorage.setItem(KEYS.API_KEY, key.trim());
    }
    return true;
  } catch (e) {
    console.error('Failed to save API key to localStorage', e);
    return false;
  }
};

export const removeApiKey = () => {
  try {
    localStorage.removeItem(KEYS.API_KEY);
    return true;
  } catch (e) {
    console.error('Failed to remove API key', e);
    return false;
  }
};

// --- Model Selection ---
export const getSelectedModel = () => {
  try {
    const saved = localStorage.getItem(KEYS.SELECTED_MODEL);
    // Auto-migrate legacy or unsupported models to gemini-2.0-flash
    if (!saved || saved === 'gemini-1.5-flash') {
      localStorage.setItem(KEYS.SELECTED_MODEL, 'gemini-2.0-flash');
      return 'gemini-2.0-flash';
    }
    return saved;
  } catch (e) {
    return 'gemini-2.0-flash';
  }
};

export const setSelectedModel = (model) => {
  try {
    localStorage.setItem(KEYS.SELECTED_MODEL, model);
  } catch (e) {
    console.error('Failed to save model', e);
  }
};

// --- Preferences & Branding ---
export const getPreferences = () => {
  try {
    const raw = localStorage.getItem(KEYS.PREFERENCES);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    // Auto-migrate legacy handle to learn_in_a_minute
    if (!parsed.branding?.handle || parsed.branding.handle === 'LEARNWITHAKSHAY') {
      parsed.branding = {
        ...(parsed.branding || {}),
        handle: 'learn_in_a_minute',
      };
      localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(parsed));
    }
    // Auto-migrate default logo if empty
    if (!parsed.branding?.logoUrl) {
      parsed.branding = {
        ...(parsed.branding || {}),
        logoUrl: '/logo.png',
      };
      localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    return DEFAULT_PREFERENCES;
  }
};

export const savePreferences = (prefs) => {
  try {
    const current = getPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save preferences', e);
    return DEFAULT_PREFERENCES;
  }
};

// --- Statistics ---
export const getStats = () => {
  try {
    const raw = localStorage.getItem(KEYS.STATS);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_STATS;
  }
};

export const incrementQuestionsGenerated = (count = 1) => {
  try {
    const current = getStats();
    current.totalQuestionsGenerated += count;
    localStorage.setItem(KEYS.STATS, JSON.stringify(current));
    return current;
  } catch (e) {
    return DEFAULT_STATS;
  }
};

export const incrementImagesDownloaded = (count = 1) => {
  try {
    const current = getStats();
    current.totalImagesDownloaded += count;
    localStorage.setItem(KEYS.STATS, JSON.stringify(current));
    return current;
  } catch (e) {
    return DEFAULT_STATS;
  }
};

// --- Saved Quizzes ---
export const getSavedQuizzes = () => {
  try {
    const raw = localStorage.getItem(KEYS.SAVED_QUIZZES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to get saved quizzes', e);
    return [];
  }
};

export const saveQuiz = (quiz) => {
  try {
    const quizzes = getSavedQuizzes();
    const newQuiz = {
      ...quiz,
      id: quiz.id || `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      savedAt: new Date().toISOString(),
    };
    
    // Check if already exists (update it)
    const existingIndex = quizzes.findIndex((q) => q.id === newQuiz.id);
    if (existingIndex >= 0) {
      quizzes[existingIndex] = newQuiz;
    } else {
      quizzes.unshift(newQuiz);
    }
    
    localStorage.setItem(KEYS.SAVED_QUIZZES, JSON.stringify(quizzes));

    // Update stats
    const stats = getStats();
    stats.totalSavedQuizzes = quizzes.length;
    localStorage.setItem(KEYS.STATS, JSON.stringify(stats));

    return newQuiz;
  } catch (e) {
    console.error('Failed to save quiz', e);
    return null;
  }
};

export const deleteQuiz = (id) => {
  try {
    const quizzes = getSavedQuizzes().filter((q) => q.id !== id);
    localStorage.setItem(KEYS.SAVED_QUIZZES, JSON.stringify(quizzes));
    
    const stats = getStats();
    stats.totalSavedQuizzes = quizzes.length;
    localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
    
    return true;
  } catch (e) {
    console.error('Failed to delete quiz', e);
    return false;
  }
};

export const clearAllQuizzes = () => {
  try {
    localStorage.removeItem(KEYS.SAVED_QUIZZES);
    const stats = getStats();
    stats.totalSavedQuizzes = 0;
    localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
    return true;
  } catch (e) {
    return false;
  }
};

// --- Download History ---
export const getDownloadHistory = () => {
  try {
    const raw = localStorage.getItem(KEYS.DOWNLOAD_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const addDownloadHistory = (item) => {
  try {
    const history = getDownloadHistory();
    const record = {
      id: `dl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: item.title || 'Instagram Quiz Post',
      type: item.type || 'PNG',
      format: item.format || 'square',
      template: item.template || 'black-gold',
      count: item.count || 1,
      timestamp: new Date().toISOString(),
    };
    history.unshift(record);
    // keep maximum 50 records
    if (history.length > 50) history.pop();
    localStorage.setItem(KEYS.DOWNLOAD_HISTORY, JSON.stringify(history));
    incrementImagesDownloaded(item.count || 1);
    return record;
  } catch (e) {
    console.error('Failed to record download history', e);
    return null;
  }
};

export const clearDownloadHistory = () => {
  try {
    localStorage.removeItem(KEYS.DOWNLOAD_HISTORY);
    return true;
  } catch (e) {
    return false;
  }
};

// --- Recent Generated Quizzes History ---
export const getRecentQuizzes = () => {
  try {
    const raw = localStorage.getItem(KEYS.RECENT_QUIZZES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveRecentQuiz = (quiz) => {
  try {
    let recent = getRecentQuizzes();
    // remove if exists
    recent = recent.filter((q) => q.id !== quiz.id);
    recent.unshift(quiz);
    if (recent.length > 10) recent.pop();
    localStorage.setItem(KEYS.RECENT_QUIZZES, JSON.stringify(recent));
  } catch (e) {
    console.error('Failed to save recent quiz', e);
  }
};

