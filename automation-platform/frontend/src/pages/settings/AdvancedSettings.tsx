import React from 'react';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { SettingItem } from '../../components/settings/SettingItem';
import { Button } from '../../components/ui/Button';
import { Code, Database, Download, Upload, Trash2, AlertTriangle } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export const AdvancedSettings: React.FC = () => {
  const handleExport = () => {
    // In real app, fetch data and create download
    alert('Export functionality coming soon');
  };

  const handleImport = () => {
    // In real app, open file picker and import
    alert('Import functionality coming soon');
  };

  const handleReset = () => {
    if (
      confirm(
        'Are you sure you want to reset all settings? This action cannot be undone.'
      )
    ) {
      alert('Reset functionality coming soon');
    }
  };

  return (
    <div className="space-y-8">
      <SettingsSection
        title="Developer Options"
        description="API documentation and developer tools"
        icon={<Code className="w-6 h-6" />}
      >
        <SettingItem
          label="API Documentation"
          description="View API endpoints and documentation"
        >
          <Button variant="secondary" onClick={() => window.open('/api-docs', '_blank')}>
            Open API Docs
          </Button>
        </SettingItem>

        <SettingItem
          label="Webhook Endpoints"
          description="Manage webhook endpoints for workflow triggers"
        >
          <Button variant="secondary" onClick={() => alert('Webhook management coming soon')}>
            Manage Webhooks
          </Button>
        </SettingItem>
      </SettingsSection>

      <SettingsSection
        title="Data Management"
        description="Export, import, or reset your data"
        icon={<Database className="w-6 h-6" />}
      >
        <SettingItem
          label="Export Data"
          description="Download all your workflows and settings as JSON"
        >
          <Button variant="secondary" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export All Data
          </Button>
        </SettingItem>

        <SettingItem
          label="Import Data"
          description="Import workflows and settings from a JSON file"
        >
          <Button variant="secondary" onClick={handleImport}>
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
        </SettingItem>
      </SettingsSection>

      <SettingsSection
        title="Danger Zone"
        description="Irreversible and destructive actions"
        icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
      >
        <Card className="p-6 border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <SettingItem
            label="Reset All Settings"
            description="Reset all settings to their default values. This cannot be undone."
          >
            <Button variant="danger" onClick={handleReset}>
              <Trash2 className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </SettingItem>
        </Card>
      </SettingsSection>

      <SettingsSection
        title="System Information"
        description="Platform version and diagnostics"
        icon={<Code className="w-6 h-6" />}
      >
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Platform Version</span>
            <span className="font-mono">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">API Version</span>
            <span className="font-mono">v1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Status</span>
            <span className="text-green-600 dark:text-green-400">Operational</span>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
};

