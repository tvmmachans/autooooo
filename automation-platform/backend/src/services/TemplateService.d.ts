export declare class TemplateService {
    createTemplate(data: {
        name: string;
        description?: string;
        category: string;
        tags?: string[];
        workflowData: any;
        createdBy: number;
        isPublic?: boolean;
        isOfficial?: boolean;
    }): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        metadata: Record<string, any> | null;
        category: string;
        isPublic: boolean;
        usageCount: number;
        tags: string[];
        workflowData: {
            nodes: any[];
            edges: any[];
            variables?: Record<string, any>;
        };
        createdBy: number | null;
        isOfficial: boolean;
        rating: number;
        ratingCount: number;
        version: string;
        compatibility: {
            minVersion?: string;
            maxVersion?: string;
            requiredNodes?: string[];
        } | null;
    } | undefined>;
    getTemplates(filters: {
        category?: string;
        isPublic?: boolean;
        isOfficial?: boolean;
        search?: string;
        limit?: number;
    }): Promise<{
        id: number;
        name: string;
        description: string | null;
        category: string;
        tags: string[];
        workflowData: {
            nodes: any[];
            edges: any[];
            variables?: Record<string, any>;
        };
        createdBy: number | null;
        isPublic: boolean;
        isOfficial: boolean;
        usageCount: number;
        rating: number;
        ratingCount: number;
        version: string;
        compatibility: {
            minVersion?: string;
            maxVersion?: string;
            requiredNodes?: string[];
        } | null;
        metadata: Record<string, any> | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    useTemplate(templateId: number, userId: number, workflowId?: number): Promise<void>;
    rateTemplate(templateId: number, userId: number, rating: number, review?: string): Promise<void>;
}
//# sourceMappingURL=TemplateService.d.ts.map