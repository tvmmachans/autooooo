import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { IntegrationCard } from '../../components/settings/IntegrationCard';
import { SettingItem } from '../../components/settings/SettingItem';
import { Input } from '../../components/settings/Input';
import { Button } from '../../components/ui/Button';
import { Plug, Youtube, Instagram, Twitter, Facebook, Linkedin, Brain } from 'lucide-react';
const AIServiceConfigs = ({ services, configs, onUpdate, isLoading }) => {
    const [apiKeys, setApiKeys] = useState({});
    return (_jsx("div", { className: "space-y-6", children: services.map((service) => {
            const config = configs?.find((c) => c.service === service.id);
            const currentKey = apiKeys[service.id] ?? (config?.apiKey ? '••••••••' : '');
            return (_jsx(SettingItem, { label: service.name, children: _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { type: "password", value: currentKey, onChange: (e) => {
                                setApiKeys({ ...apiKeys, [service.id]: e.target.value });
                            }, placeholder: service.placeholder, className: "flex-1" }), _jsx(Button, { onClick: () => {
                                const key = apiKeys[service.id];
                                if (key && key !== '••••••••') {
                                    onUpdate({
                                        service: service.id,
                                        apiKey: key,
                                    });
                                }
                            }, isLoading: isLoading, children: "Save" })] }) }, service.id));
        }) }));
};
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const socialPlatforms = [
    {
        id: 'youtube',
        name: 'YouTube',
        icon: _jsx(Youtube, { className: "w-6 h-6" }),
        description: 'Connect your YouTube channel to publish videos',
        color: 'red',
    },
    {
        id: 'instagram',
        name: 'Instagram',
        icon: _jsx(Instagram, { className: "w-6 h-6" }),
        description: 'Post content directly to Instagram',
        color: 'pink',
    },
    {
        id: 'twitter',
        name: 'Twitter',
        icon: _jsx(Twitter, { className: "w-6 h-6" }),
        description: 'Share updates and engage with your audience',
        color: 'blue',
    },
    {
        id: 'facebook',
        name: 'Facebook',
        icon: _jsx(Facebook, { className: "w-6 h-6" }),
        description: 'Connect your Facebook page',
        color: 'blue',
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: _jsx(Linkedin, { className: "w-6 h-6" }),
        description: 'Share professional content on LinkedIn',
        color: 'blue',
    },
];
const aiServices = [
    { id: 'sarvam', name: 'Sarvam AI', placeholder: 'Enter Sarvam API key' },
    { id: 'groq', name: 'Groq', placeholder: 'Enter Groq API key' },
    { id: 'gemini', name: 'Google Gemini', placeholder: 'Enter Gemini API key' },
    { id: 'deepseek', name: 'DeepSeek', placeholder: 'Enter DeepSeek API key' },
];
export const IntegrationsSettings = () => {
    const queryClient = useQueryClient();
    const { data: integrations } = useQuery({
        queryKey: ['integrations'],
        queryFn: async () => {
            const token = localStorage.getItem('accessToken');
            const res = await axios.get(`${API_BASE_URL}/api/settings/integrations`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        },
    });
    const { data: aiConfigs } = useQuery({
        queryKey: ['ai-services'],
        queryFn: async () => {
            const token = localStorage.getItem('accessToken');
            const res = await axios.get(`${API_BASE_URL}/api/settings/ai-services`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        },
    });
    const disconnectIntegrationMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`${API_BASE_URL}/api/settings/integrations/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['integrations'] });
        },
    });
    const updateAIServiceMutation = useMutation({
        mutationFn: async (data) => {
            const token = localStorage.getItem('accessToken');
            const res = await axios.put(`${API_BASE_URL}/api/settings/ai-services`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ai-services'] });
        },
    });
    const getIntegrationStatus = (platform) => {
        const integration = integrations?.integrations?.find((i) => i.platform === platform && i.isActive);
        return integration
            ? { connected: true, username: integration.platformUsername, id: integration.id }
            : { connected: false };
    };
    const handleConnect = (platform) => {
        // In a real app, this would redirect to OAuth flow
        alert(`OAuth flow for ${platform} would start here`);
    };
    const handleDisconnect = (id) => {
        if (confirm('Are you sure you want to disconnect this integration?')) {
            disconnectIntegrationMutation.mutate(id);
        }
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsx(SettingsSection, { title: "Social Media Integrations", description: "Connect your social media accounts to automate content publishing", icon: _jsx(Plug, { className: "w-6 h-6" }), children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: socialPlatforms.map((platform) => {
                        const status = getIntegrationStatus(platform.id);
                        return (_jsx(IntegrationCard, { platform: platform.id, name: platform.name, icon: platform.icon, description: platform.description, connected: status.connected, username: status.username, color: platform.color, onConnect: () => handleConnect(platform.id), onDisconnect: () => status.id && handleDisconnect(status.id) }, platform.id));
                    }) }) }), _jsx(SettingsSection, { title: "AI Service Configuration", description: "Configure API keys for AI services", icon: _jsx(Brain, { className: "w-6 h-6" }), children: _jsx(AIServiceConfigs, { services: aiServices, configs: aiConfigs?.configs, onUpdate: updateAIServiceMutation.mutate, isLoading: updateAIServiceMutation.isPending }) })] }));
};
//# sourceMappingURL=IntegrationsSettings.js.map