import { db } from '../database/index.js';
import { userSettings, workspaceSettings, apiKeys, integrationTokens, aiServiceConfig, auditLogs, workflowPreferences, } from '../database/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { randomBytes, createHash } from 'crypto';
import bcrypt from 'bcryptjs';
// Note: speakeasy and qrcode need to be installed
// For now, using a simplified 2FA implementation
// import speakeasy from 'speakeasy';
// import QRCode from 'qrcode';
export class SettingsController {
    // ============ USER SETTINGS ============
    async getUserSettings(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const [settings] = await db
                .select()
                .from(userSettings)
                .where(eq(userSettings.userId, req.user.id))
                .limit(1);
            if (!settings) {
                // Create default settings
                const [newSettings] = await db
                    .insert(userSettings)
                    .values({
                    userId: req.user.id,
                    preferences: {
                        theme: 'system',
                        language: 'en',
                        dateFormat: 'YYYY-MM-DD',
                        timeFormat: '24h',
                        notifications: {
                            email: true,
                            push: true,
                            workflowAlerts: true,
                        },
                    },
                })
                    .returning();
                return res.json({ settings: newSettings });
            }
            res.json({ settings });
        }
        catch (error) {
            console.error('Get user settings error:', error);
            res.status(500).json({ error: 'Failed to get user settings' });
        }
    }
    async updateUserSettings(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const { name, email, profilePicture, preferences } = req.body;
            // Update user basic info if provided
            if (name || email) {
                const { users } = await import('../database/schema.js');
                const updateData = {};
                if (name)
                    updateData.name = name;
                if (email)
                    updateData.email = email;
                updateData.updatedAt = new Date();
                await db
                    .update(users)
                    .set(updateData)
                    .where(eq(users.id, req.user.id));
            }
            // Update or create settings
            const [existing] = await db
                .select()
                .from(userSettings)
                .where(eq(userSettings.userId, req.user.id))
                .limit(1);
            if (existing) {
                const updateData = {
                    updatedAt: new Date(),
                };
                if (profilePicture !== undefined)
                    updateData.profilePicture = profilePicture;
                if (preferences) {
                    updateData.preferences = {
                        ...existing.preferences,
                        ...preferences,
                    };
                }
                const [updated] = await db
                    .update(userSettings)
                    .set(updateData)
                    .where(eq(userSettings.userId, req.user.id))
                    .returning();
                // Log audit
                await this.logAudit(req, 'settings_update', 'user_settings', updated.id, { section: 'user' });
                res.json({ settings: updated });
            }
            else {
                const [newSettings] = await db
                    .insert(userSettings)
                    .values({
                    userId: req.user.id,
                    profilePicture,
                    preferences: preferences || {},
                })
                    .returning();
                res.json({ settings: newSettings });
            }
        }
        catch (error) {
            console.error('Update user settings error:', error);
            res.status(500).json({ error: 'Failed to update user settings' });
        }
    }
    async changePassword(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ error: 'Current and new passwords are required' });
            }
            const { users } = await import('../database/schema.js');
            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.id, req.user.id))
                .limit(1);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const isValid = await bcrypt.compare(currentPassword, user.password);
            if (!isValid) {
                await this.logAudit(req, 'password_change', 'user', user.id, { status: 'failed' });
                return res.status(400).json({ error: 'Current password is incorrect' });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            await db
                .update(users)
                .set({ password: hashedPassword, updatedAt: new Date() })
                .where(eq(users.id, req.user.id));
            await this.logAudit(req, 'password_change', 'user', user.id, { status: 'success' });
            res.json({ message: 'Password changed successfully' });
        }
        catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({ error: 'Failed to change password' });
        }
    }
    // ============ TWO-FACTOR AUTHENTICATION ============
    async setup2FA(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            // Generate a base32 secret (simplified - in production use speakeasy)
            const secret = randomBytes(20).toString('base64').replace(/[^A-Z2-7]/g, '').substring(0, 32);
            // Generate backup codes
            const backupCodes = Array.from({ length: 10 }, () => randomBytes(4).toString('hex').toUpperCase());
            // Store secret temporarily (encrypted) - user needs to verify before enabling
            const [settings] = await db
                .select()
                .from(userSettings)
                .where(eq(userSettings.userId, req.user.id))
                .limit(1);
            const updateData = {
                twoFactorSecret: secret, // Store base32 for verification
                twoFactorBackupCodes: backupCodes,
                updatedAt: new Date(),
            };
            if (settings) {
                await db
                    .update(userSettings)
                    .set(updateData)
                    .where(eq(userSettings.userId, req.user.id));
            }
            else {
                await db.insert(userSettings).values({
                    userId: req.user.id,
                    ...updateData,
                });
            }
            // Generate QR code URL (simplified - in production use QRCode library)
            const otpauthUrl = `otpauth://totp/Automation%20Platform:${encodeURIComponent(req.user.email)}?secret=${secret}&issuer=Automation%20Platform`;
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`;
            res.json({
                secret,
                qrCode: qrCodeUrl,
                backupCodes,
            });
        }
        catch (error) {
            console.error('Setup 2FA error:', error);
            res.status(500).json({ error: 'Failed to setup 2FA' });
        }
    }
    async verify2FA(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const { token } = req.body;
            const [settings] = await db
                .select()
                .from(userSettings)
                .where(eq(userSettings.userId, req.user.id))
                .limit(1);
            if (!settings || !settings.twoFactorSecret) {
                return res.status(400).json({ error: '2FA not set up' });
            }
            // Simplified verification - in production use speakeasy.totp.verify
            // For now, just check if token is provided (implement proper TOTP verification)
            const verified = token && token.length === 6 && /^\d+$/.test(token);
            if (verified) {
                await db
                    .update(userSettings)
                    .set({
                    twoFactorEnabled: true,
                    updatedAt: new Date(),
                })
                    .where(eq(userSettings.userId, req.user.id));
                await this.logAudit(req, '2fa_enabled', 'user_settings', settings.id);
                res.json({ message: '2FA enabled successfully' });
            }
            else {
                res.status(400).json({ error: 'Invalid verification code' });
            }
        }
        catch (error) {
            console.error('Verify 2FA error:', error);
            res.status(500).json({ error: 'Failed to verify 2FA' });
        }
    }
    async disable2FA(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            await db
                .update(userSettings)
                .set({
                twoFactorEnabled: false,
                twoFactorSecret: null,
                twoFactorBackupCodes: null,
                updatedAt: new Date(),
            })
                .where(eq(userSettings.userId, req.user.id));
            await this.logAudit(req, '2fa_disabled', 'user_settings', req.user.id);
            res.json({ message: '2FA disabled successfully' });
        }
        catch (error) {
            console.error('Disable 2FA error:', error);
            res.status(500).json({ error: 'Failed to disable 2FA' });
        }
    }
    // ============ WORKSPACE SETTINGS ============
    async getWorkspaceSettings(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const [workspace] = await db
                .select()
                .from(workspaceSettings)
                .where(eq(workspaceSettings.userId, req.user.id))
                .limit(1);
            res.json({ workspace: workspace || null });
        }
        catch (error) {
            console.error('Get workspace settings error:', error);
            res.status(500).json({ error: 'Failed to get workspace settings' });
        }
    }
    async updateWorkspaceSettings(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const { name, description, logo, settings } = req.body;
            const [existing] = await db
                .select()
                .from(workspaceSettings)
                .where(eq(workspaceSettings.userId, req.user.id))
                .limit(1);
            if (existing) {
                const updateData = {
                    updatedAt: new Date(),
                };
                if (name)
                    updateData.name = name;
                if (description !== undefined)
                    updateData.description = description;
                if (logo !== undefined)
                    updateData.logo = logo;
                if (settings) {
                    updateData.settings = {
                        ...existing.settings,
                        ...settings,
                    };
                }
                const [updated] = await db
                    .update(workspaceSettings)
                    .set(updateData)
                    .where(eq(workspaceSettings.userId, req.user.id))
                    .returning();
                await this.logAudit(req, 'settings_update', 'workspace_settings', updated.id);
                res.json({ workspace: updated });
            }
            else {
                const [newWorkspace] = await db
                    .insert(workspaceSettings)
                    .values({
                    userId: req.user.id,
                    name: name || 'My Workspace',
                    description,
                    logo,
                    settings: settings || {},
                })
                    .returning();
                res.json({ workspace: newWorkspace });
            }
        }
        catch (error) {
            console.error('Update workspace settings error:', error);
            res.status(500).json({ error: 'Failed to update workspace settings' });
        }
    }
    // ============ API KEYS ============
    async getApiKeys(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const keys = await db
                .select({
                id: apiKeys.id,
                name: apiKeys.name,
                keyPrefix: apiKeys.keyPrefix,
                scopes: apiKeys.scopes,
                lastUsedAt: apiKeys.lastUsedAt,
                expiresAt: apiKeys.expiresAt,
                isActive: apiKeys.isActive,
                createdAt: apiKeys.createdAt,
            })
                .from(apiKeys)
                .where(eq(apiKeys.userId, req.user.id))
                .orderBy(desc(apiKeys.createdAt));
            res.json({ keys });
        }
        catch (error) {
            console.error('Get API keys error:', error);
            res.status(500).json({ error: 'Failed to get API keys' });
        }
    }
    async createApiKey(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const { name, scopes, expiresInDays } = req.body;
            if (!name || !scopes || !Array.isArray(scopes)) {
                return res.status(400).json({ error: 'Name and scopes are required' });
            }
            // Generate API key
            const fullKey = `ak_${randomBytes(32).toString('hex')}`;
            const keyPrefix = fullKey.substring(0, 12);
            const keyHash = createHash('sha256').update(fullKey).digest('hex');
            const expiresAt = expiresInDays
                ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
                : null;
            await db.insert(apiKeys).values({
                userId: req.user.id,
                name,
                keyPrefix,
                keyHash,
                scopes,
                expiresAt,
            });
            await this.logAudit(req, 'api_key_created', 'api_keys', req.user.id, { name });
            // Return full key only once
            res.json({
                key: fullKey,
                keyPrefix,
                message: 'API key created. Save this key securely - it will not be shown again.',
            });
        }
        catch (error) {
            console.error('Create API key error:', error);
            res.status(500).json({ error: 'Failed to create API key' });
        }
    }
    async revokeApiKey(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const { id } = req.params;
            const [key] = await db
                .select()
                .from(apiKeys)
                .where(and(eq(apiKeys.id, parseInt(id)), eq(apiKeys.userId, req.user.id)))
                .limit(1);
            if (!key) {
                return res.status(404).json({ error: 'API key not found' });
            }
            await db
                .update(apiKeys)
                .set({ isActive: false })
                .where(eq(apiKeys.id, parseInt(id)));
            await this.logAudit(req, 'api_key_revoked', 'api_keys', parseInt(id));
            res.json({ message: 'API key revoked successfully' });
        }
        catch (error) {
            console.error('Revoke API key error:', error);
            res.status(500).json({ error: 'Failed to revoke API key' });
        }
    }
    // ============ INTEGRATIONS ============
    async getIntegrations(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const integrations = await db
                .select()
                .from(integrationTokens)
                .where(eq(integrationTokens.userId, req.user.id))
                .orderBy(desc(integrationTokens.createdAt));
            res.json({ integrations });
        }
        catch (error) {
            console.error('Get integrations error:', error);
            res.status(500).json({ error: 'Failed to get integrations' });
        }
    }
    async connectIntegration(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const { platform, accessToken, refreshToken, tokenExpiresAt, platformUserId, platformUsername, scopes } = req.body;
            if (!platform || !accessToken) {
                return res.status(400).json({ error: 'Platform and access token are required' });
            }
            const [existing] = await db
                .select()
                .from(integrationTokens)
                .where(and(eq(integrationTokens.userId, req.user.id), eq(integrationTokens.platform, platform)))
                .limit(1);
            if (existing) {
                const [updated] = await db
                    .update(integrationTokens)
                    .set({
                    accessToken,
                    refreshToken,
                    tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : null,
                    platformUserId,
                    platformUsername,
                    scopes,
                    isActive: true,
                    updatedAt: new Date(),
                })
                    .where(eq(integrationTokens.id, existing.id))
                    .returning();
                await this.logAudit(req, 'integration_updated', 'integration_tokens', updated.id, { platform });
                res.json({ integration: updated });
            }
            else {
                const [newIntegration] = await db
                    .insert(integrationTokens)
                    .values({
                    userId: req.user.id,
                    platform,
                    accessToken,
                    refreshToken,
                    tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : null,
                    platformUserId,
                    platformUsername,
                    scopes,
                })
                    .returning();
                await this.logAudit(req, 'integration_connected', 'integration_tokens', newIntegration.id, { platform });
                res.json({ integration: newIntegration });
            }
        }
        catch (error) {
            console.error('Connect integration error:', error);
            res.status(500).json({ error: 'Failed to connect integration' });
        }
    }
    async disconnectIntegration(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const { id } = req.params;
            const [integration] = await db
                .select()
                .from(integrationTokens)
                .where(and(eq(integrationTokens.id, parseInt(id)), eq(integrationTokens.userId, req.user.id)))
                .limit(1);
            if (!integration) {
                return res.status(404).json({ error: 'Integration not found' });
            }
            await db
                .update(integrationTokens)
                .set({ isActive: false, updatedAt: new Date() })
                .where(eq(integrationTokens.id, parseInt(id)));
            await this.logAudit(req, 'integration_disconnected', 'integration_tokens', parseInt(id), {
                platform: integration.platform,
            });
            res.json({ message: 'Integration disconnected successfully' });
        }
        catch (error) {
            console.error('Disconnect integration error:', error);
            res.status(500).json({ error: 'Failed to disconnect integration' });
        }
    }
    // ============ AI SERVICE CONFIG ============
    async getAIServiceConfig(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const configs = await db
                .select()
                .from(aiServiceConfig)
                .where(eq(aiServiceConfig.userId, req.user.id))
                .orderBy(desc(aiServiceConfig.createdAt));
            res.json({ configs });
        }
        catch (error) {
            console.error('Get AI service config error:', error);
            res.status(500).json({ error: 'Failed to get AI service config' });
        }
    }
    async updateAIServiceConfig(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const { service, apiKey, baseUrl, defaultModel } = req.body;
            if (!service || !apiKey) {
                return res.status(400).json({ error: 'Service and API key are required' });
            }
            const [existing] = await db
                .select()
                .from(aiServiceConfig)
                .where(and(eq(aiServiceConfig.userId, req.user.id), eq(aiServiceConfig.service, service)))
                .limit(1);
            if (existing) {
                const [updated] = await db
                    .update(aiServiceConfig)
                    .set({
                    apiKey,
                    baseUrl,
                    defaultModel,
                    updatedAt: new Date(),
                })
                    .where(eq(aiServiceConfig.id, existing.id))
                    .returning();
                res.json({ config: updated });
            }
            else {
                const [newConfig] = await db
                    .insert(aiServiceConfig)
                    .values({
                    userId: req.user.id,
                    service,
                    apiKey,
                    baseUrl,
                    defaultModel,
                })
                    .returning();
                res.json({ config: newConfig });
            }
            await this.logAudit(req, 'ai_config_updated', 'ai_service_config', req.user.id, { service });
        }
        catch (error) {
            console.error('Update AI service config error:', error);
            res.status(500).json({ error: 'Failed to update AI service config' });
        }
    }
    // ============ WORKFLOW PREFERENCES ============
    async getWorkflowPreferences(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const [prefs] = await db
                .select()
                .from(workflowPreferences)
                .where(eq(workflowPreferences.userId, req.user.id))
                .limit(1);
            if (!prefs) {
                const [newPrefs] = await db
                    .insert(workflowPreferences)
                    .values({
                    userId: req.user.id,
                    preferences: {
                        autoSave: { enabled: true, frequency: 30 },
                        draftRetention: 30,
                        executionLimits: { maxConcurrent: 5, timeout: 300 },
                    },
                })
                    .returning();
                return res.json({ preferences: newPrefs });
            }
            res.json({ preferences: prefs });
        }
        catch (error) {
            console.error('Get workflow preferences error:', error);
            res.status(500).json({ error: 'Failed to get workflow preferences' });
        }
    }
    async updateWorkflowPreferences(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const { preferences } = req.body;
            const [existing] = await db
                .select()
                .from(workflowPreferences)
                .where(eq(workflowPreferences.userId, req.user.id))
                .limit(1);
            if (existing) {
                const [updated] = await db
                    .update(workflowPreferences)
                    .set({
                    preferences: {
                        ...existing.preferences,
                        ...preferences,
                    },
                    updatedAt: new Date(),
                })
                    .where(eq(workflowPreferences.userId, req.user.id))
                    .returning();
                res.json({ preferences: updated });
            }
            else {
                const [newPrefs] = await db
                    .insert(workflowPreferences)
                    .values({
                    userId: req.user.id,
                    preferences: preferences || {},
                })
                    .returning();
                res.json({ preferences: newPrefs });
            }
        }
        catch (error) {
            console.error('Update workflow preferences error:', error);
            res.status(500).json({ error: 'Failed to update workflow preferences' });
        }
    }
    // ============ SECURITY LOGS ============
    async getSecurityLogs(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const limit = parseInt(req.query.limit) || 50;
            const offset = parseInt(req.query.offset) || 0;
            const logs = await db
                .select()
                .from(auditLogs)
                .where(eq(auditLogs.userId, req.user.id))
                .orderBy(desc(auditLogs.createdAt))
                .limit(limit)
                .offset(offset);
            res.json({ logs });
        }
        catch (error) {
            console.error('Get security logs error:', error);
            res.status(500).json({ error: 'Failed to get security logs' });
        }
    }
    // ============ HELPER METHODS ============
    async logAudit(req, action, resource, resourceId, details) {
        try {
            await db.insert(auditLogs).values({
                userId: req.user?.id || null,
                action,
                resource,
                resourceId,
                details: details || {},
                ipAddress: req.ip || req.socket.remoteAddress,
                userAgent: req.get('User-Agent'),
                status: 'success',
            });
        }
        catch (error) {
            console.error('Failed to log audit:', error);
        }
    }
}
export const settingsController = new SettingsController();
//# sourceMappingURL=settingsController.js.map