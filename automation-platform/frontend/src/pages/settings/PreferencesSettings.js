import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { SettingItem } from '../../components/settings/SettingItem';
import { Input } from '../../components/settings/Input';
import { Toggle } from '../../components/settings/Toggle';
import { Button } from '../../components/ui/Button';
import { Settings as SettingsIcon } from 'lucide-react';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const PreferencesSettings = () => {
    const queryClient = useQueryClient();
    const [autoSaveFrequency, setAutoSaveFrequency] = useState(30);
    const [draftRetention, setDraftRetention] = useState(30);
    const [maxConcurrent, setMaxConcurrent] = useState(5);
    const [timeout, setTimeout] = useState(300);
    const { data: preferences } = useQuery({
        queryKey: ['workflow-preferences'],
        queryFn: async () => {
            const token = localStorage.getItem('accessToken');
            const res = await axios.get(`${API_BASE_URL}/api/settings/workflow-preferences`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        },
    });
    useEffect(() => {
        if (preferences?.preferences?.preferences) {
            setAutoSaveFrequency(preferences.preferences.preferences.autoSave?.frequency || 30);
            setDraftRetention(preferences.preferences.preferences.draftRetention || 30);
            setMaxConcurrent(preferences.preferences.preferences.executionLimits?.maxConcurrent || 5);
            setTimeout(preferences.preferences.preferences.executionLimits?.timeout || 300);
        }
    }, [preferences]);
    const updatePreferencesMutation = useMutation({
        mutationFn: async (data) => {
            const token = localStorage.getItem('accessToken');
            const res = await axios.put(`${API_BASE_URL}/api/settings/workflow-preferences`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workflow-preferences'] });
            alert('Preferences saved successfully');
        },
    });
    const handleSave = () => {
        updatePreferencesMutation.mutate({
            preferences: {
                autoSave: {
                    enabled: true,
                    frequency: autoSaveFrequency,
                },
                draftRetention,
                executionLimits: {
                    maxConcurrent,
                    timeout,
                },
            },
        });
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs(SettingsSection, { title: "Default AI Settings", description: "Configure default AI model and generation preferences", icon: _jsx(SettingsIcon, { className: "w-6 h-6" }), children: [_jsx(SettingItem, { label: "Default AI Service", children: _jsxs("select", { className: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "sarvam", children: "Sarvam AI" }), _jsx("option", { value: "groq", children: "Groq" }), _jsx("option", { value: "gemini", children: "Google Gemini" }), _jsx("option", { value: "deepseek", children: "DeepSeek" })] }) }), _jsx(SettingItem, { label: "Default Language", children: _jsxs("select", { className: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "en", children: "English" }), _jsx("option", { value: "hi", children: "Hindi" }), _jsx("option", { value: "es", children: "Spanish" }), _jsx("option", { value: "fr", children: "French" })] }) }), _jsx(SettingItem, { label: "Default Tone", children: _jsxs("select", { className: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "professional", children: "Professional" }), _jsx("option", { value: "casual", children: "Casual" }), _jsx("option", { value: "friendly", children: "Friendly" }), _jsx("option", { value: "formal", children: "Formal" })] }) })] }), _jsxs(SettingsSection, { title: "Auto-save Configuration", description: "Configure how workflows are automatically saved", icon: _jsx(SettingsIcon, { className: "w-6 h-6" }), children: [_jsx(SettingItem, { label: "Auto-save Enabled", description: "Automatically save workflow changes", children: _jsx(Toggle, { enabled: preferences?.preferences?.preferences?.autoSave?.enabled ?? true, onChange: (enabled) => {
                                const currentPrefs = preferences?.preferences?.preferences || {};
                                updatePreferencesMutation.mutate({
                                    preferences: {
                                        ...currentPrefs,
                                        autoSave: {
                                            ...currentPrefs.autoSave,
                                            enabled,
                                        },
                                    },
                                });
                            } }) }), _jsx(SettingItem, { label: "Save Frequency (seconds)", description: "How often to auto-save workflow changes", children: _jsx(Input, { type: "number", value: autoSaveFrequency, onChange: (e) => setAutoSaveFrequency(parseInt(e.target.value) || 30), min: 5, max: 300 }) }), _jsx(SettingItem, { label: "Draft Retention (days)", description: "How long to keep draft workflows", children: _jsx(Input, { type: "number", value: draftRetention, onChange: (e) => setDraftRetention(parseInt(e.target.value) || 30), min: 1, max: 365 }) })] }), _jsxs(SettingsSection, { title: "Execution Limits", description: "Configure workflow execution limits and timeouts", icon: _jsx(SettingsIcon, { className: "w-6 h-6" }), children: [_jsx(SettingItem, { label: "Max Concurrent Workflows", description: "Maximum number of workflows that can run simultaneously", children: _jsx(Input, { type: "number", value: maxConcurrent, onChange: (e) => setMaxConcurrent(parseInt(e.target.value) || 5), min: 1, max: 20 }) }), _jsx(SettingItem, { label: "Timeout (seconds)", description: "Maximum execution time for a workflow", children: _jsx(Input, { type: "number", value: timeout, onChange: (e) => setTimeout(parseInt(e.target.value) || 300), min: 60, max: 3600 }) })] }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { onClick: handleSave, isLoading: updatePreferencesMutation.isPending, children: "Save Preferences" }) })] }));
};
//# sourceMappingURL=PreferencesSettings.js.map