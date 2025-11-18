export interface APIKeyData {
    id: number;
    key: string;
    keyPrefix: string;
    name: string;
    scopes: string[];
    rateLimit: number;
    createdAt: Date;
}
export declare class ApiKeyService {
    createApiKey(userId: number, name: string, scopes: string[], rateLimit?: number, expiresAt?: Date): Promise<APIKeyData>;
    validateApiKey(key: string): Promise<{
        valid: boolean;
        apiKey?: any;
        error?: string;
    }>;
    getApiKeysByUserId(userId: number): Promise<{
        id: number;
        userId: number;
        keyHash: string;
        keyPrefix: string;
        name: string;
        scopes: string[];
        rateLimit: number;
        usageCount: number;
        lastUsedAt: Date | null;
        expiresAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    revokeApiKey(id: number, userId: number): Promise<boolean>;
    private generateApiKey;
    private hashApiKey;
}
//# sourceMappingURL=ApiKeyService.d.ts.map