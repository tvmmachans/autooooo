import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { SettingItem } from '../../components/settings/SettingItem';
import { Input } from '../../components/settings/Input';
import { Button } from '../../components/ui/Button';
import { Shield, Lock, QrCode, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const SecuritySettings = () => {
    const queryClient = useQueryClient();
    const [verificationCode, setVerificationCode] = useState('');
    const [showQR, setShowQR] = useState(false);
    const [qrCode, setQrCode] = useState('');
    const [backupCodes, setBackupCodes] = useState([]);
    const [copied, setCopied] = useState(false);
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
    const { data: securityLogs } = useQuery({
        queryKey: ['security-logs'],
        queryFn: async () => {
            const token = localStorage.getItem('accessToken');
            const res = await axios.get(`${API_BASE_URL}/api/settings/security-logs`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        },
    });
    const setup2FAMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem('accessToken');
            const res = await axios.post(`${API_BASE_URL}/api/settings/user/2fa/setup`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        },
        onSuccess: (data) => {
            setQrCode(data.qrCode);
            setBackupCodes(data.backupCodes);
            setShowQR(true);
        },
    });
    const verify2FAMutation = useMutation({
        mutationFn: async (token) => {
            const authToken = localStorage.getItem('accessToken');
            const res = await axios.post(`${API_BASE_URL}/api/settings/user/2fa/verify`, { token }, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-settings'] });
            setShowQR(false);
            setVerificationCode('');
            alert('2FA enabled successfully!');
        },
    });
    const disable2FAMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem('accessToken');
            const res = await axios.post(`${API_BASE_URL}/api/settings/user/2fa/disable`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-settings'] });
            alert('2FA disabled successfully');
        },
    });
    const handleCopyBackupCodes = async () => {
        const codesText = backupCodes.join('\n');
        await navigator.clipboard.writeText(codesText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsx(SettingsSection, { title: "Two-Factor Authentication", description: "Add an extra layer of security to your account", icon: _jsx(Shield, { className: "w-6 h-6" }), children: settingsData?.settings?.twoFactorEnabled ? (_jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-green-500 flex items-center justify-center", children: _jsx(Check, { className: "w-6 h-6 text-white" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-green-900 dark:text-green-100", children: "2FA is enabled" }), _jsx("p", { className: "text-sm text-green-700 dark:text-green-300", children: "Your account is protected with two-factor authentication" })] })] }), _jsx(Button, { variant: "danger", onClick: () => {
                                    if (confirm('Are you sure you want to disable 2FA?')) {
                                        disable2FAMutation.mutate();
                                    }
                                }, isLoading: disable2FAMutation.isPending, children: "Disable 2FA" })] }) })) : (_jsx("div", { className: "space-y-4", children: !showQR ? (_jsxs(_Fragment, { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Two-factor authentication adds an extra layer of security by requiring a code from your authenticator app." }), _jsxs(Button, { onClick: () => setup2FAMutation.mutate(), isLoading: setup2FAMutation.isPending, children: [_jsx(QrCode, { className: "w-4 h-4 mr-2" }), "Set up 2FA"] })] })) : (_jsx(AnimatePresence, { children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "space-y-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-4", children: "Scan this QR code with your authenticator app" }), _jsx("img", { src: qrCode, alt: "QR Code", className: "mx-auto w-48 h-48 border rounded-lg" })] }), _jsx(SettingItem, { label: "Verification Code", children: _jsx(Input, { value: verificationCode, onChange: (e) => setVerificationCode(e.target.value), placeholder: "Enter 6-digit code", maxLength: 6 }) }), backupCodes.length > 0 && (_jsxs("div", { className: "p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("p", { className: "font-medium text-yellow-900 dark:text-yellow-100", children: "Backup Codes" }), _jsxs(Button, { variant: "ghost", size: "sm", onClick: handleCopyBackupCodes, children: [copied ? (_jsx(Check, { className: "w-4 h-4 mr-2" })) : (_jsx(Copy, { className: "w-4 h-4 mr-2" })), "Copy"] })] }), _jsx("p", { className: "text-xs text-yellow-700 dark:text-yellow-300 mb-2", children: "Save these codes in a safe place. You can use them to access your account if you lose your device." }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: backupCodes.map((code, i) => (_jsx("code", { className: "text-xs font-mono p-2 bg-white dark:bg-gray-800 rounded", children: code }, i))) })] })), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: () => {
                                                if (verificationCode.length === 6) {
                                                    verify2FAMutation.mutate(verificationCode);
                                                }
                                            }, isLoading: verify2FAMutation.isPending, disabled: verificationCode.length !== 6, children: "Verify & Enable" }), _jsx(Button, { variant: "ghost", onClick: () => {
                                                setShowQR(false);
                                                setQrCode('');
                                                setBackupCodes([]);
                                            }, children: "Cancel" })] })] }) })) })) }), _jsx(SettingsSection, { title: "Security Logs", description: "View recent security events and login history", icon: _jsx(Lock, { className: "w-6 h-6" }), children: _jsx("div", { className: "space-y-2", children: securityLogs?.logs?.length === 0 ? (_jsx("p", { className: "text-center py-8 text-gray-500", children: "No security logs yet" })) : (securityLogs?.logs?.slice(0, 20).map((log) => (_jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: log.action.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) }), _jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: [log.ipAddress, " \u2022 ", new Date(log.createdAt).toLocaleString()] })] }), _jsx("div", { className: `px-2 py-1 rounded text-xs font-medium ${log.status === 'success'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`, children: log.status })] }, log.id)))) }) })] }));
};
//# sourceMappingURL=SecuritySettings.js.map