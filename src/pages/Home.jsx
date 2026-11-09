import React from 'react';
import Dashboard from '../components/Dashboard';

export default function Home({
  onNavigate,
  onLoadRecentQuiz,
}) {
  return (
    <Dashboard
      onNavigate={onNavigate}
      onLoadRecentQuiz={onLoadRecentQuiz}
    />
  );
}
