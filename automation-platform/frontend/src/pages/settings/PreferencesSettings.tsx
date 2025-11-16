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

export const PreferencesSettings: React.FC = () => {
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
    mutationFn: async (data: any) => {
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

  return (
    <div className="space-y-8">
      <SettingsSection
        title="Default AI Settings"
        description="Configure default AI model and generation preferences"
        icon={<SettingsIcon className="w-6 h-6" />}
      >
        <SettingItem label="Default AI Service">
          <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="sarvam">Sarvam AI</option>
            <option value="groq">Groq</option>
            <option value="gemini">Google Gemini</option>
            <option value="deepseek">DeepSeek</option>
          </select>
        </SettingItem>

        <SettingItem label="Default Language">
          <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </SettingItem>

        <SettingItem label="Default Tone">
          <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
          </select>
        </SettingItem>
      </SettingsSection>

      <SettingsSection
        title="Auto-save Configuration"
        description="Configure how workflows are automatically saved"
        icon={<SettingsIcon className="w-6 h-6" />}
      >
        <SettingItem
          label="Auto-save Enabled"
          description="Automatically save workflow changes"
        >
          <Toggle
            enabled={preferences?.preferences?.preferences?.autoSave?.enabled ?? true}
            onChange={(enabled) => {
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
            }}
          />
        </SettingItem>

        <SettingItem
          label="Save Frequency (seconds)"
          description="How often to auto-save workflow changes"
        >
          <Input
            type="number"
            value={autoSaveFrequency}
            onChange={(e) => setAutoSaveFrequency(parseInt(e.target.value) || 30)}
            min={5}
            max={300}
          />
        </SettingItem>

        <SettingItem
          label="Draft Retention (days)"
          description="How long to keep draft workflows"
        >
          <Input
            type="number"
            value={draftRetention}
            onChange={(e) => setDraftRetention(parseInt(e.target.value) || 30)}
            min={1}
            max={365}
          />
        </SettingItem>
      </SettingsSection>

      <SettingsSection
        title="Execution Limits"
        description="Configure workflow execution limits and timeouts"
        icon={<SettingsIcon className="w-6 h-6" />}
      >
        <SettingItem
          label="Max Concurrent Workflows"
          description="Maximum number of workflows that can run simultaneously"
        >
          <Input
            type="number"
            value={maxConcurrent}
            onChange={(e) => setMaxConcurrent(parseInt(e.target.value) || 5)}
            min={1}
            max={20}
          />
        </SettingItem>

        <SettingItem
          label="Timeout (seconds)"
          description="Maximum execution time for a workflow"
        >
          <Input
            type="number"
            value={timeout}
            onChange={(e) => setTimeout(parseInt(e.target.value) || 300)}
            min={60}
            max={3600}
          />
        </SettingItem>
      </SettingsSection>

      <div className="flex justify-end">
        <Button onClick={handleSave} isLoading={updatePreferencesMutation.isPending}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

