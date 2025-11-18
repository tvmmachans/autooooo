import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
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
export const WorkspaceSettings = () => {
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
        mutationFn: async (data) => {
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
    const handleLogoUpload = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result;
                updateWorkspaceMutation.mutate({ logo: imageUrl });
            };
            reader.readAsDataURL(file);
        }
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs(SettingsSection, { title: "Workspace Information", description: "Manage your workspace details and branding", icon: _jsx(Building2, { className: "w-6 h-6" }), children: [_jsx(SettingItem, { label: "Workspace Logo", children: _jsx(FileUpload, { value: workspaceData?.workspace?.logo, onChange: handleLogoUpload, accept: "image/*", maxSize: 2 * 1024 * 1024 }) }), _jsx(SettingItem, { label: "Workspace Name", required: true, children: _jsx(Input, { value: workspaceName, onChange: (e) => setWorkspaceName(e.target.value), placeholder: "My Workspace" }) }), _jsx(SettingItem, { label: "Description", children: _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Describe your workspace...", rows: 4, className: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" }) }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { onClick: handleUpdateWorkspace, isLoading: updateWorkspaceMutation.isPending, children: "Save Changes" }) })] }), _jsx(SettingsSection, { title: "API Keys", description: "Generate and manage API keys for programmatic access", icon: _jsx(Key, { className: "w-6 h-6" }), children: _jsx(ApiKeyManager, {}) }), _jsx(SettingsSection, { title: "Team Members", description: "Invite and manage team members (Coming Soon)", icon: _jsx(Users, { className: "w-6 h-6" }), children: _jsx("div", { className: "text-center py-8 text-gray-500", children: _jsx("p", { children: "Team management features coming soon" }) }) })] }));
};
//# sourceMappingURL=WorkspaceSettings.js.map