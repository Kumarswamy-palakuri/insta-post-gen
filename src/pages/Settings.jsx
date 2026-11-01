import React from 'react';
import SettingsComponent from '../components/Settings';

export default function SettingsPage({ showNotification, onPreferencesUpdated }) {
  return (
    <SettingsComponent
      showNotification={showNotification}
      onPreferencesUpdated={onPreferencesUpdated}
    />
  );
}

