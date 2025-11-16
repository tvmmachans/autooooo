import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SettingsLayout } from '../components/settings/SettingsLayout';
import { ProfileSettings } from './settings/ProfileSettings';
import { WorkspaceSettings } from './settings/WorkspaceSettings';
import { IntegrationsSettings } from './settings/IntegrationsSettings';
import { PreferencesSettings } from './settings/PreferencesSettings';
import { AppearanceSettings } from './settings/AppearanceSettings';
import { SecuritySettings } from './settings/SecuritySettings';
import { BillingSettings } from './settings/BillingSettings';
import { AdvancedSettings } from './settings/AdvancedSettings';

export const Settings: React.FC = () => {
  return (
    <Routes>
      <Route element={<SettingsLayout />}>
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="workspace" element={<WorkspaceSettings />} />
        <Route path="integrations" element={<IntegrationsSettings />} />
        <Route path="preferences" element={<PreferencesSettings />} />
        <Route path="appearance" element={<AppearanceSettings />} />
        <Route path="security" element={<SecuritySettings />} />
        <Route path="billing" element={<BillingSettings />} />
        <Route path="advanced" element={<AdvancedSettings />} />
        <Route path="" element={<Navigate to="/settings/profile" replace />} />
      </Route>
    </Routes>
  );
};

