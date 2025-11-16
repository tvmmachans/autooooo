import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { SettingItem } from '../../components/settings/SettingItem';
import { Toggle } from '../../components/settings/Toggle';
import { Palette } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const AppearanceSettings: React.FC = () => {
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
    mutationFn: async (data: any) => {
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

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    updateSettingsMutation.mutate({
      preferences: {
        ...settingsData?.settings?.preferences,
        theme: newTheme,
      },
    });
  };

  return (
    <div className="space-y-8">
      <SettingsSection
        title="Theme & Appearance"
        description="Customize the look and feel of the application"
        icon={<Palette className="w-6 h-6" />}
      >
        <SettingItem
          label="Theme"
          description="Choose your preferred color theme"
        >
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'light'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
            >
              <div className="text-center">
                <div className="w-full h-12 bg-white border-2 border-gray-300 rounded mb-2" />
                <span className="text-sm font-medium">Light</span>
              </div>
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'dark'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
            >
              <div className="text-center">
                <div className="w-full h-12 bg-gray-800 border-2 border-gray-600 rounded mb-2" />
                <span className="text-sm font-medium">Dark</span>
              </div>
            </button>
            <button
              onClick={() => handleThemeChange('system')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'system'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
            >
              <div className="text-center">
                <div className="w-full h-12 bg-gradient-to-r from-white to-gray-800 border-2 border-gray-300 rounded mb-2" />
                <span className="text-sm font-medium">System</span>
              </div>
            </button>
          </div>
        </SettingItem>

        <SettingItem
          label="Language"
          description="Select your preferred language"
        >
          <select
            value={settingsData?.settings?.preferences?.language || 'en'}
            onChange={(e) => {
              updateSettingsMutation.mutate({
                preferences: {
                  ...settingsData?.settings?.preferences,
                  language: e.target.value,
                },
              });
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </SettingItem>

        <SettingItem
          label="Date Format"
          description="Choose how dates are displayed"
        >
          <select
            value={settingsData?.settings?.preferences?.dateFormat || 'YYYY-MM-DD'}
            onChange={(e) => {
              updateSettingsMutation.mutate({
                preferences: {
                  ...settingsData?.settings?.preferences,
                  dateFormat: e.target.value,
                },
              });
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          </select>
        </SettingItem>

        <SettingItem
          label="Time Format"
          description="Choose 12-hour or 24-hour time format"
        >
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="timeFormat"
                value="12h"
                checked={settingsData?.settings?.preferences?.timeFormat === '12h'}
                onChange={() => {
                  updateSettingsMutation.mutate({
                    preferences: {
                      ...settingsData?.settings?.preferences,
                      timeFormat: '12h',
                    },
                  });
                }}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>12-hour</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="timeFormat"
                value="24h"
                checked={settingsData?.settings?.preferences?.timeFormat === '24h'}
                onChange={() => {
                  updateSettingsMutation.mutate({
                    preferences: {
                      ...settingsData?.settings?.preferences,
                      timeFormat: '24h',
                    },
                  });
                }}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>24-hour</span>
            </label>
          </div>
        </SettingItem>
      </SettingsSection>

      <SettingsSection
        title="Accessibility"
        description="Configure accessibility options"
        icon={<Palette className="w-6 h-6" />}
      >
        <SettingItem
          label="High Contrast Mode"
          description="Increase contrast for better visibility"
        >
          <Toggle
            enabled={settingsData?.settings?.preferences?.accessibility?.highContrast ?? false}
            onChange={(enabled) => {
              updateSettingsMutation.mutate({
                preferences: {
                  ...settingsData?.settings?.preferences,
                  accessibility: {
                    ...settingsData?.settings?.preferences?.accessibility,
                    highContrast: enabled,
                  },
                },
              });
            }}
          />
        </SettingItem>

        <SettingItem
          label="Screen Reader Support"
          description="Optimize interface for screen readers"
        >
          <Toggle
            enabled={settingsData?.settings?.preferences?.accessibility?.screenReader ?? false}
            onChange={(enabled) => {
              updateSettingsMutation.mutate({
                preferences: {
                  ...settingsData?.settings?.preferences,
                  accessibility: {
                    ...settingsData?.settings?.preferences?.accessibility,
                    screenReader: enabled,
                  },
                },
              });
            }}
          />
        </SettingItem>
      </SettingsSection>
    </div>
  );
};

