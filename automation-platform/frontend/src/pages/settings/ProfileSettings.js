import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { SettingItem } from '../../components/settings/SettingItem';
import { Input } from '../../components/settings/Input';
import { FileUpload } from '../../components/settings/FileUpload';
import { Toggle } from '../../components/settings/Toggle';
import { Button } from '../../components/ui/Button';
import { User, Mail, Bell, Lock } from 'lucide-react';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const ProfileSettings = () => {
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { data: userData } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const token = localStorage.getItem('accessToken');
            const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        },
    });
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
    useEffect(() => {
        if (userData?.user) {
            setName(userData.user.name);
            setEmail(userData.user.email);
        }
    }, [userData]);
    const updateProfileMutation = useMutation({
        mutationFn: async (data) => {
            const token = localStorage.getItem('accessToken');
            const res = await axios.put(`${API_BASE_URL}/api/settings/user`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            queryClient.invalidateQueries({ queryKey: ['user-settings'] });
        },
    });
    const changePasswordMutation = useMutation({
        mutationFn: async (data) => {
            const token = localStorage.getItem('accessToken');
            const res = await axios.put(`${API_BASE_URL}/api/settings/user/password`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        },
        onSuccess: () => {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordError('');
            alert('Password changed successfully');
        },
        onError: (error) => {
            setPasswordError(error.response?.data?.error || 'Failed to change password');
        },
    });
    const handleUpdateProfile = () => {
        updateProfileMutation.mutate({ name, email });
    };
    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        if (newPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            return;
        }
        setPasswordError('');
        changePasswordMutation.mutate({ currentPassword, newPassword });
    };
    const handleFileUpload = (file) => {
        if (file) {
            // In a real app, upload to server first, then update settings
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result;
                updateProfileMutation.mutate({ profilePicture: imageUrl });
            };
            reader.readAsDataURL(file);
        }
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs(SettingsSection, { title: "Personal Information", description: "Update your personal details and profile picture", icon: _jsx(User, { className: "w-6 h-6" }), children: [_jsx(SettingItem, { label: "Profile Picture", children: _jsx(FileUpload, { value: settingsData?.settings?.profilePicture, onChange: handleFileUpload, accept: "image/*", maxSize: 5 * 1024 * 1024 }) }), _jsx(SettingItem, { label: "Full Name", required: true, children: _jsx(Input, { icon: _jsx(User, { className: "w-4 h-4" }), value: name, onChange: (e) => setName(e.target.value), placeholder: "Your name" }) }), _jsx(SettingItem, { label: "Email Address", required: true, children: _jsx(Input, { type: "email", icon: _jsx(Mail, { className: "w-4 h-4" }), value: email, onChange: (e) => setEmail(e.target.value), placeholder: "your.email@example.com" }) }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { onClick: handleUpdateProfile, isLoading: updateProfileMutation.isPending, children: "Save Changes" }) })] }), _jsxs(SettingsSection, { title: "Password Management", description: "Change your password to keep your account secure", icon: _jsx(Lock, { className: "w-6 h-6" }), children: [_jsx(SettingItem, { label: "Current Password", required: true, children: _jsx(Input, { type: "password", value: currentPassword, onChange: (e) => setCurrentPassword(e.target.value), placeholder: "Enter current password" }) }), _jsx(SettingItem, { label: "New Password", required: true, children: _jsx(Input, { type: "password", value: newPassword, onChange: (e) => setNewPassword(e.target.value), placeholder: "Enter new password", description: "Must be at least 8 characters with uppercase, lowercase, and number" }) }), _jsx(SettingItem, { label: "Confirm New Password", required: true, children: _jsx(Input, { type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "Confirm new password", error: passwordError }) }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { onClick: handleChangePassword, isLoading: changePasswordMutation.isPending, children: "Change Password" }) })] }), _jsxs(SettingsSection, { title: "Notification Preferences", description: "Control how you receive notifications", icon: _jsx(Bell, { className: "w-6 h-6" }), children: [_jsx(SettingItem, { label: "Email Notifications", description: "Receive notifications via email", children: _jsx(Toggle, { enabled: settingsData?.settings?.preferences?.notifications?.email ?? true, onChange: (enabled) => {
                                updateProfileMutation.mutate({
                                    preferences: {
                                        ...settingsData?.settings?.preferences,
                                        notifications: {
                                            ...settingsData?.settings?.preferences?.notifications,
                                            email: enabled,
                                        },
                                    },
                                });
                            } }) }), _jsx(SettingItem, { label: "Push Notifications", description: "Receive browser push notifications", children: _jsx(Toggle, { enabled: settingsData?.settings?.preferences?.notifications?.push ?? true, onChange: (enabled) => {
                                updateProfileMutation.mutate({
                                    preferences: {
                                        ...settingsData?.settings?.preferences,
                                        notifications: {
                                            ...settingsData?.settings?.preferences?.notifications,
                                            push: enabled,
                                        },
                                    },
                                });
                            } }) }), _jsx(SettingItem, { label: "Workflow Alerts", description: "Get notified when workflows complete or fail", children: _jsx(Toggle, { enabled: settingsData?.settings?.preferences?.notifications?.workflowAlerts ?? true, onChange: (enabled) => {
                                updateProfileMutation.mutate({
                                    preferences: {
                                        ...settingsData?.settings?.preferences,
                                        notifications: {
                                            ...settingsData?.settings?.preferences?.notifications,
                                            workflowAlerts: enabled,
                                        },
                                    },
                                });
                            } }) })] })] }));
};
//# sourceMappingURL=ProfileSettings.js.map