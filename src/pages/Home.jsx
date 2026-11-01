import React from 'react';
import Dashboard from '../components/Dashboard';

export default function Home({
  onNavigate,
  onQuickGenerateRandom,
  onLoadRecentQuiz,
  hasApiKey,
}) {
  return (
    <Dashboard
      onNavigate={onNavigate}
      onQuickGenerateRandom={onQuickGenerateRandom}
      onLoadRecentQuiz={onLoadRecentQuiz}
      hasApiKey={hasApiKey}
    />
  );
}

