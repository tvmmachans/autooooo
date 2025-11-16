import { db } from '../database/index.js';
import { apiKeys, NewAPIKey } from '../database/schema/api.js';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

export interface APIKeyData {
  id: number;
  key: string; // Only returned on creation
  keyPrefix: string;
  name: string;
  scopes: string[];
  rateLimit: number;
  createdAt: Date;
}

export class ApiKeyService {
  async createApiKey(
    userId: number,
    name: string,
    scopes: string[],
    rateLimit?: number,
    expiresAt?: Date
  ): Promise<APIKeyData> {
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
      scopes: apiKey.scopes as string[],
      rateLimit: apiKey.rateLimit,
      createdAt: apiKey.createdAt,
    };
  }

  async validateApiKey(key: string): Promise<{
    valid: boolean;
    apiKey?: any;
    error?: string;
  }> {
    const keyHash = this.hashApiKey(key);
    const keyPrefix = key.substring(0, 8);

    // Find API key by prefix first (for performance)
    const candidates = await db.select()
      .from(apiKeys)
      .where(
        and(
          eq(apiKeys.keyPrefix, keyPrefix),
          eq(apiKeys.isActive, true)
        )
      );

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

  async getApiKeysByUserId(userId: number) {
    return db.select()
      .from(apiKeys)
      .where(eq(apiKeys.userId, userId))
      .orderBy(apiKeys.createdAt);
  }

  async revokeApiKey(id: number, userId: number): Promise<boolean> {
    const result = await db.update(apiKeys)
      .set({ isActive: false })
      .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, userId)))
      .returning();

    return result.length > 0;
  }

  private generateApiKey(): string {
    // Generate a secure random API key
    const randomBytes = crypto.randomBytes(32);
    return `ak_${randomBytes.toString('base64url')}`;
  }

  private hashApiKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
  }
}

