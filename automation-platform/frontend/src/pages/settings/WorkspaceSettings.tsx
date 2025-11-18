import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { SettingItem } from '../../components/settings/SettingItem';
import { Input } from '../../components/settings/Input';
import { FileUpload } from '../../components/settings/FileUpload';
import { Button } from '../../components/ui/Button';
import { Building2, Users, Key } from 'lucide-react';
import { ApiKeyManager } from '../../components/settings/ApiKeyManager';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const WorkspaceSettings: React.FC = () => {
  const queryClient = useQueryClient();
  const [workspaceName, setWorkspaceName] = useState('');
  const [description, setDescription] = useState('');

  const { data: workspaceData } = useQuery({
    queryKey: ['workspace-settings'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get(`${API_BASE_URL}/api/settings/workspace`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  useEffect(() => {
    if (workspaceData?.workspace) {
      setWorkspaceName(workspaceData.workspace.name);
      setDescription(workspaceData.workspace.description || '');
    }
  }, [workspaceData]);

  const updateWorkspaceMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = localStorage.getItem('accessToken');
      const res = await axios.put(`${API_BASE_URL}/api/settings/workspace`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-settings'] });
    },
  });

  const handleUpdateWorkspace = () => {
    updateWorkspaceMutation.mutate({
      name: workspaceName,
      description,
    });
  };

  const handleLogoUpload = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        updateWorkspaceMutation.mutate({ logo: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      <SettingsSection
        title="Workspace Information"
        description="Manage your workspace details and branding"
        icon={<Building2 className="w-6 h-6" />}
      >
        <SettingItem label="Workspace Logo">
          <FileUpload
            value={workspaceData?.workspace?.logo}
            onChange={handleLogoUpload}
            accept="image/*"
            maxSize={2 * 1024 * 1024}
          />
        </SettingItem>

        <SettingItem label="Workspace Name" required>
          <Input
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="My Workspace"
          />
        </SettingItem>

        <SettingItem label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your workspace..."
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </SettingItem>

        <div className="flex justify-end">
          <Button
            onClick={handleUpdateWorkspace}
            isLoading={updateWorkspaceMutation.isPending}
          >
            Save Changes
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection
        title="API Keys"
        description="Generate and manage API keys for programmatic access"
        icon={<Key className="w-6 h-6" />}
      >
        <ApiKeyManager />
      </SettingsSection>

      <SettingsSection
        title="Team Members"
        description="Invite and manage team members (Coming Soon)"
        icon={<Users className="w-6 h-6" />}
      >
        <div className="text-center py-8 text-gray-500">
          <p>Team management features coming soon</p>
        </div>
      </SettingsSection>
    </div>
  );
};

