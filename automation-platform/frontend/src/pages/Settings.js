import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
export const Settings = () => {
    return (_jsx(Routes, { children: _jsxs(Route, { element: _jsx(SettingsLayout, {}), children: [_jsx(Route, { path: "profile", element: _jsx(ProfileSettings, {}) }), _jsx(Route, { path: "workspace", element: _jsx(WorkspaceSettings, {}) }), _jsx(Route, { path: "integrations", element: _jsx(IntegrationsSettings, {}) }), _jsx(Route, { path: "preferences", element: _jsx(PreferencesSettings, {}) }), _jsx(Route, { path: "appearance", element: _jsx(AppearanceSettings, {}) }), _jsx(Route, { path: "security", element: _jsx(SecuritySettings, {}) }), _jsx(Route, { path: "billing", element: _jsx(BillingSettings, {}) }), _jsx(Route, { path: "advanced", element: _jsx(AdvancedSettings, {}) }), _jsx(Route, { path: "", element: _jsx(Navigate, { to: "/settings/profile", replace: true }) })] }) }));
};
//# sourceMappingURL=Settings.js.map