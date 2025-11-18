import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { SettingItem } from '../../components/settings/SettingItem';
import { Toggle } from '../../components/settings/Toggle';
import { Palette } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const AppearanceSettings = () => {
    const queryClient = useQueryClient();
    const { theme, setTheme } = useThemeStore();
    const { data: settingsData } = useQuery({
        queryKey: ['user-settings'],
        queryFn: async () => {
            const token = localStorage.getItem('accessToken');
            const res = await axios.get(`${API_BASE_URL}/api/settings/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        },
    });
    const updateSettingsMutation = useMutation({
        mutationFn: async (data) => {
            const token = localStorage.getItem('accessToken');
            const res = await axios.put(`${API_BASE_URL}/api/settings/user`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-settings'] });
        },
    });
    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        updateSettingsMutation.mutate({
            preferences: {
                ...settingsData?.settings?.preferences,
                theme: newTheme,
            },
        });
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs(SettingsSection, { title: "Theme & Appearance", description: "Customize the look and feel of the application", icon: _jsx(Palette, { className: "w-6 h-6" }), children: [_jsx(SettingItem, { label: "Theme", description: "Choose your preferred color theme", children: _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsx("button", { onClick: () => handleThemeChange('light'), className: `p-4 rounded-lg border-2 transition-all ${theme === 'light'
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}`, children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-full h-12 bg-white border-2 border-gray-300 rounded mb-2" }), _jsx("span", { className: "text-sm font-medium", children: "Light" })] }) }), _jsx("button", { onClick: () => handleThemeChange('dark'), className: `p-4 rounded-lg border-2 transition-all ${theme === 'dark'
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}`, children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-full h-12 bg-gray-800 border-2 border-gray-600 rounded mb-2" }), _jsx("span", { className: "text-sm font-medium", children: "Dark" })] }) }), _jsx("button", { onClick: () => handleThemeChange('system'), className: `p-4 rounded-lg border-2 transition-all ${theme === 'system'
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}`, children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-full h-12 bg-gradient-to-r from-white to-gray-800 border-2 border-gray-300 rounded mb-2" }), _jsx("span", { className: "text-sm font-medium", children: "System" })] }) })] }) }), _jsx(SettingItem, { label: "Language", description: "Select your preferred language", children: _jsxs("select", { value: settingsData?.settings?.preferences?.language || 'en', onChange: (e) => {
                                updateSettingsMutation.mutate({
                                    preferences: {
                                        ...settingsData?.settings?.preferences,
                                        language: e.target.value,
                                    },
                                });
                            }, className: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "en", children: "English" }), _jsx("option", { value: "hi", children: "Hindi" }), _jsx("option", { value: "es", children: "Spanish" }), _jsx("option", { value: "fr", children: "French" })] }) }), _jsx(SettingItem, { label: "Date Format", description: "Choose how dates are displayed", children: _jsxs("select", { value: settingsData?.settings?.preferences?.dateFormat || 'YYYY-MM-DD', onChange: (e) => {
                                updateSettingsMutation.mutate({
                                    preferences: {
                                        ...settingsData?.settings?.preferences,
                                        dateFormat: e.target.value,
                                    },
                                });
                            }, className: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "YYYY-MM-DD", children: "YYYY-MM-DD" }), _jsx("option", { value: "MM/DD/YYYY", children: "MM/DD/YYYY" }), _jsx("option", { value: "DD/MM/YYYY", children: "DD/MM/YYYY" })] }) }), _jsx(SettingItem, { label: "Time Format", description: "Choose 12-hour or 24-hour time format", children: _jsxs("div", { className: "flex gap-4", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "radio", name: "timeFormat", value: "12h", checked: settingsData?.settings?.preferences?.timeFormat === '12h', onChange: () => {
                                                updateSettingsMutation.mutate({
                                                    preferences: {
                                                        ...settingsData?.settings?.preferences,
                                                        timeFormat: '12h',
                                                    },
                                                });
                                            }, className: "text-blue-600 focus:ring-blue-500" }), _jsx("span", { children: "12-hour" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "radio", name: "timeFormat", value: "24h", checked: settingsData?.settings?.preferences?.timeFormat === '24h', onChange: () => {
                                                updateSettingsMutation.mutate({
                                                    preferences: {
                                                        ...settingsData?.settings?.preferences,
                                                        timeFormat: '24h',
                                                    },
                                                });
                                            }, className: "text-blue-600 focus:ring-blue-500" }), _jsx("span", { children: "24-hour" })] })] }) })] }), _jsxs(SettingsSection, { title: "Accessibility", description: "Configure accessibility options", icon: _jsx(Palette, { className: "w-6 h-6" }), children: [_jsx(SettingItem, { label: "High Contrast Mode", description: "Increase contrast for better visibility", children: _jsx(Toggle, { enabled: settingsData?.settings?.preferences?.accessibility?.highContrast ?? false, onChange: (enabled) => {
                                updateSettingsMutation.mutate({
                                    preferences: {
                                        ...settingsData?.settings?.preferences,
                                        accessibility: {
                                            ...settingsData?.settings?.preferences?.accessibility,
                                            highContrast: enabled,
                                        },
                                    },
                                });
                            } }) }), _jsx(SettingItem, { label: "Screen Reader Support", description: "Optimize interface for screen readers", children: _jsx(Toggle, { enabled: settingsData?.settings?.preferences?.accessibility?.screenReader ?? false, onChange: (enabled) => {
                                updateSettingsMutation.mutate({
                                    preferences: {
                                        ...settingsData?.settings?.preferences,
                                        accessibility: {
                                            ...settingsData?.settings?.preferences?.accessibility,
                                            screenReader: enabled,
                                        },
                                    },
                                });
                            } }) })] })] }));
};
//# sourceMappingURL=AppearanceSettings.js.map