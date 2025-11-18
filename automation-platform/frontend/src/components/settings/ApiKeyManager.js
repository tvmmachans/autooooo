import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Eye, EyeOff, Trash2, Plus, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from './Input';
import { Card } from '../ui/Card';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const ApiKeyManager = () => {
    const queryClient = useQueryClient();
    const [showNewKey, setShowNewKey] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [newKeyScopes, setNewKeyScopes] = useState([]);
    const [newKeyValue, setNewKeyValue] = useState(null);
    const [visibleKeys, setVisibleKeys] = useState(new Set());
    const [copiedKey, setCopiedKey] = useState(null);
    const { data: keys, isLoading } = useQuery({
        queryKey: ['api-keys'],
        queryFn: async () => {
            const token = localStorage.getItem('accessToken');
            const res = await axios.get(`${API_BASE_URL}/api/settings/api-keys`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        },
    });
    const createKeyMutation = useMutation({
        mutationFn: async (data) => {
            const token = localStorage.getItem('accessToken');
            const res = await axios.post(`${API_BASE_URL}/api/settings/api-keys`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        },
        onSuccess: (data) => {
            setNewKeyValue(data.key);
            queryClient.invalidateQueries({ queryKey: ['api-keys'] });
        },
    });
    const revokeKeyMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`${API_BASE_URL}/api/settings/api-keys/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['api-keys'] });
        },
    });
    const handleCopy = async (key, id) => {
        await navigator.clipboard.writeText(key);
        setCopiedKey(id);
        setTimeout(() => setCopiedKey(null), 2000);
    };
    const handleCreate = () => {
        if (!newKeyName || newKeyScopes.length === 0)
            return;
        createKeyMutation.mutate({ name: newKeyName, scopes: newKeyScopes });
    };
    const scopeOptions = [
        'workflow:read',
        'workflow:write',
        'workflow:execute',
        'media:read',
        'media:write',
        'ai:use',
    ];
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: "API Keys" }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: "Manage your API keys for programmatic access" })] }), _jsxs(Button, { onClick: () => setShowNewKey(!showNewKey), size: "sm", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Create Key"] })] }), _jsx(AnimatePresence, { children: showNewKey && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "overflow-hidden", children: _jsxs(Card, { className: "p-4 space-y-4", children: [_jsx(Input, { label: "Key Name", value: newKeyName, onChange: (e) => setNewKeyName(e.target.value), placeholder: "My API Key" }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Scopes" }), _jsx("div", { className: "space-y-2", children: scopeOptions.map((scope) => (_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: newKeyScopes.includes(scope), onChange: (e) => {
                                                        if (e.target.checked) {
                                                            setNewKeyScopes([...newKeyScopes, scope]);
                                                        }
                                                        else {
                                                            setNewKeyScopes(newKeyScopes.filter((s) => s !== scope));
                                                        }
                                                    }, className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: scope })] }, scope))) })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: handleCreate, isLoading: createKeyMutation.isPending, children: "Create" }), _jsx(Button, { variant: "ghost", onClick: () => setShowNewKey(false), children: "Cancel" })] })] }) })) }), newKeyValue && (_jsx(Card, { className: "p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-green-900 dark:text-green-100", children: "New API Key Created" }), _jsx("p", { className: "text-sm text-green-700 dark:text-green-300 mt-1", children: "Save this key securely - it won't be shown again" }), _jsx("code", { className: "block mt-2 p-2 bg-white dark:bg-gray-800 rounded text-sm font-mono", children: newKeyValue })] }), _jsxs(Button, { variant: "secondary", size: "sm", onClick: () => {
                                navigator.clipboard.writeText(newKeyValue);
                                setNewKeyValue(null);
                                setShowNewKey(false);
                                setNewKeyName('');
                                setNewKeyScopes([]);
                            }, children: [_jsx(Copy, { className: "w-4 h-4 mr-2" }), "Copy"] })] }) })), isLoading ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "Loading..." })) : keys?.keys.length === 0 ? (_jsx(Card, { className: "p-8 text-center text-gray-500", children: _jsx("p", { children: "No API keys yet. Create one to get started." }) })) : (_jsx("div", { className: "space-y-3", children: keys?.keys.map((key) => (_jsx(Card, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-gray-100", children: key.name }), !key.isActive && (_jsx("span", { className: "px-2 py-0.5 text-xs rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300", children: "Revoked" }))] }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsxs("code", { className: "text-sm text-gray-600 dark:text-gray-400", children: [key.keyPrefix, "..."] }), _jsx("button", { onClick: () => {
                                                    const newVisible = new Set(visibleKeys);
                                                    if (newVisible.has(key.id)) {
                                                        newVisible.delete(key.id);
                                                    }
                                                    else {
                                                        newVisible.add(key.id);
                                                    }
                                                    setVisibleKeys(newVisible);
                                                }, className: "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300", children: visibleKeys.has(key.id) ? (_jsx(EyeOff, { className: "w-4 h-4" })) : (_jsx(Eye, { className: "w-4 h-4" })) })] }), _jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: key.scopes.map((scope) => (_jsx("span", { className: "px-2 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300", children: scope }, scope))) }), key.lastUsedAt && (_jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-2", children: ["Last used: ", new Date(key.lastUsedAt).toLocaleDateString()] }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [copiedKey === key.id && (_jsx(Check, { className: "w-4 h-4 text-green-500" })), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleCopy(`${key.keyPrefix}...`, key.id), children: _jsx(Copy, { className: "w-4 h-4" }) }), key.isActive && (_jsx(Button, { variant: "danger", size: "sm", onClick: () => {
                                            if (confirm('Are you sure you want to revoke this API key?')) {
                                                revokeKeyMutation.mutate(key.id);
                                            }
                                        }, children: _jsx(Trash2, { className: "w-4 h-4" }) }))] })] }) }, key.id))) }))] }));
};
//# sourceMappingURL=ApiKeyManager.js.map