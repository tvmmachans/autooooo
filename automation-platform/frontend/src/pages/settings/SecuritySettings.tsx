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

export const SecuritySettings: React.FC = () => {
  const queryClient = useQueryClient();
  const [verificationCode, setVerificationCode] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
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
    mutationFn: async (token: string) => {
      const authToken = localStorage.getItem('accessToken');
      const res = await axios.post(
        `${API_BASE_URL}/api/settings/user/2fa/verify`,
        { token },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
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

  return (
    <div className="space-y-8">
      <SettingsSection
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account"
        icon={<Shield className="w-6 h-6" />}
      >
        {settingsData?.settings?.twoFactorEnabled ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">2FA is enabled</p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Your account is protected with two-factor authentication
                  </p>
                </div>
              </div>
              <Button
                variant="danger"
                onClick={() => {
                  if (confirm('Are you sure you want to disable 2FA?')) {
                    disable2FAMutation.mutate();
                  }
                }}
                isLoading={disable2FAMutation.isPending}
              >
                Disable 2FA
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {!showQR ? (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Two-factor authentication adds an extra layer of security by requiring a code from your authenticator app.
                </p>
                <Button
                  onClick={() => setup2FAMutation.mutate()}
                  isLoading={setup2FAMutation.isPending}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Set up 2FA
                </Button>
              </>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Scan this QR code with your authenticator app
                    </p>
                    <img src={qrCode} alt="QR Code" className="mx-auto w-48 h-48 border rounded-lg" />
                  </div>

                  <SettingItem label="Verification Code">
                    <Input
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                    />
                  </SettingItem>

                  {backupCodes.length > 0 && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-yellow-900 dark:text-yellow-100">
                          Backup Codes
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyBackupCodes}
                        >
                          {copied ? (
                            <Check className="w-4 h-4 mr-2" />
                          ) : (
                            <Copy className="w-4 h-4 mr-2" />
                          )}
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-2">
                        Save these codes in a safe place. You can use them to access your account if you lose your device.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {backupCodes.map((code, i) => (
                          <code key={i} className="text-xs font-mono p-2 bg-white dark:bg-gray-800 rounded">
                            {code}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        if (verificationCode.length === 6) {
                          verify2FAMutation.mutate(verificationCode);
                        }
                      }}
                      isLoading={verify2FAMutation.isPending}
                      disabled={verificationCode.length !== 6}
                    >
                      Verify & Enable
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowQR(false);
                        setQrCode('');
                        setBackupCodes([]);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        )}
      </SettingsSection>

      <SettingsSection
        title="Security Logs"
        description="View recent security events and login history"
        icon={<Lock className="w-6 h-6" />}
      >
        <div className="space-y-2">
          {securityLogs?.logs?.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No security logs yet</p>
          ) : (
            securityLogs?.logs?.slice(0, 20).map((log: any) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {log.action.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {log.ipAddress} • {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    log.status === 'success'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}
                >
                  {log.status}
                </div>
              </div>
            ))
          )}
        </div>
      </SettingsSection>
    </div>
  );
};

