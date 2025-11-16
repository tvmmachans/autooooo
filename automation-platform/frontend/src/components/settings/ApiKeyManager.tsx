import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Eye, EyeOff, Trash2, Plus, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from './Input';
import { Card } from '../ui/Card';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface ApiKey {
  id: number;
  name: string;
  keyPrefix: string;
  scopes: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const ApiKeyManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>([]);
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<number>>(new Set());
  const [copiedKey, setCopiedKey] = useState<number | null>(null);

  const { data: keys, isLoading } = useQuery<{ keys: ApiKey[] }>({
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
    mutationFn: async (data: { name: string; scopes: string[] }) => {
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
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${API_BASE_URL}/api/settings/api-keys/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });

  const handleCopy = async (key: string, id: number) => {
    await navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreate = () => {
    if (!newKeyName || newKeyScopes.length === 0) return;
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">API Keys</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your API keys for programmatic access
          </p>
        </div>
        <Button onClick={() => setShowNewKey(!showNewKey)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Key
        </Button>
      </div>

      <AnimatePresence>
        {showNewKey && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-4 space-y-4">
              <Input
                label="Key Name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="My API Key"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Scopes
                </label>
                <div className="space-y-2">
                  {scopeOptions.map((scope) => (
                    <label key={scope} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newKeyScopes.includes(scope)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewKeyScopes([...newKeyScopes, scope]);
                          } else {
                            setNewKeyScopes(newKeyScopes.filter((s) => s !== scope));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{scope}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreate} isLoading={createKeyMutation.isPending}>
                  Create
                </Button>
                <Button variant="ghost" onClick={() => setShowNewKey(false)}>
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {newKeyValue && (
        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-green-900 dark:text-green-100">New API Key Created</p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Save this key securely - it won't be shown again
              </p>
              <code className="block mt-2 p-2 bg-white dark:bg-gray-800 rounded text-sm font-mono">
                {newKeyValue}
              </code>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(newKeyValue);
                setNewKeyValue(null);
                setShowNewKey(false);
                setNewKeyName('');
                setNewKeyScopes([]);
              }}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : keys?.keys.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          <p>No API keys yet. Create one to get started.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {keys?.keys.map((key) => (
            <Card key={key.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{key.name}</h4>
                    {!key.isActive && (
                      <span className="px-2 py-0.5 text-xs rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                        Revoked
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm text-gray-600 dark:text-gray-400">
                      {key.keyPrefix}...
                    </code>
                    <button
                      onClick={() => {
                        const newVisible = new Set(visibleKeys);
                        if (newVisible.has(key.id)) {
                          newVisible.delete(key.id);
                        } else {
                          newVisible.add(key.id);
                        }
                        setVisibleKeys(newVisible);
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {visibleKeys.has(key.id) ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {key.scopes.map((scope) => (
                      <span
                        key={scope}
                        className="px-2 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                  {key.lastUsedAt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Last used: {new Date(key.lastUsedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {copiedKey === key.id && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(`${key.keyPrefix}...`, key.id)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  {key.isActive && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to revoke this API key?')) {
                          revokeKeyMutation.mutate(key.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

