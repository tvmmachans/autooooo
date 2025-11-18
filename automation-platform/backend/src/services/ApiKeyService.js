import { db } from '../database/index.js';
import { apiKeys, NewAPIKey } from '../database/schema/api.js';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';
export class ApiKeyService {
    async createApiKey(userId, name, scopes, rateLimit, expiresAt) {
        // Generate API key
        const key = this.generateApiKey();
        const keyHash = this.hashApiKey(key);
        const keyPrefix = key.substring(0, 8);
        // Create database record
        const [apiKey] = await db.insert(apiKeys).values({
            userId,
            keyHash,
            keyPrefix,
            name,
            scopes,
            rateLimit: rateLimit || 100,
            expiresAt: expiresAt || null,
            isActive: true,
        }).returning();
        return {
            id: apiKey.id,
            key, // Only returned once
            keyPrefix: apiKey.keyPrefix,
            name: apiKey.name,
            scopes: apiKey.scopes,
            rateLimit: apiKey.rateLimit,
            createdAt: apiKey.createdAt,
        };
    }
    async validateApiKey(key) {
        const keyHash = this.hashApiKey(key);
        const keyPrefix = key.substring(0, 8);
        // Find API key by prefix first (for performance)
        const candidates = await db.select()
            .from(apiKeys)
            .where(and(eq(apiKeys.keyPrefix, keyPrefix), eq(apiKeys.isActive, true)));
        // Verify hash
        for (const candidate of candidates) {
            if (candidate.keyHash === keyHash) {
                // Check expiration
                if (candidate.expiresAt && candidate.expiresAt < new Date()) {
                    return { valid: false, error: 'API key has expired' };
                }
                // Update last used
                await db.update(apiKeys)
                    .set({
                    lastUsedAt: new Date(),
                    usageCount: candidate.usageCount + 1,
                })
                    .where(eq(apiKeys.id, candidate.id));
                return { valid: true, apiKey: candidate };
            }
        }
        return { valid: false, error: 'Invalid API key' };
    }
    async getApiKeysByUserId(userId) {
        return db.select()
            .from(apiKeys)
            .where(eq(apiKeys.userId, userId))
            .orderBy(apiKeys.createdAt);
    }
    async revokeApiKey(id, userId) {
        const result = await db.update(apiKeys)
            .set({ isActive: false })
            .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, userId)))
            .returning();
        return result.length > 0;
    }
    generateApiKey() {
        // Generate a secure random API key
        const randomBytes = crypto.randomBytes(32);
        return `ak_${randomBytes.toString('base64url')}`;
    }
    hashApiKey(key) {
        return crypto.createHash('sha256').update(key).digest('hex');
    }
}
//# sourceMappingURL=ApiKeyService.js.map