import { db } from '../database/index.js';
import { templates, templateUsage } from '../database/schema/templates.js';
import { eq, and, or, like, sql } from 'drizzle-orm';
export class TemplateService {
    async createTemplate(data) {
        const [template] = await db.insert(templates).values({
            name: data.name,
            description: data.description || null,
            category: data.category,
            tags: data.tags || [],
            workflowData: data.workflowData,
            createdBy: data.createdBy,
            isPublic: data.isPublic || false,
            isOfficial: data.isOfficial || false,
        }).returning();
        return template;
    }
    async getTemplates(filters) {
        const conditions = [];
        if (filters.category) {
            conditions.push(eq(templates.category, filters.category));
        }
        if (filters.isPublic !== undefined) {
            conditions.push(eq(templates.isPublic, filters.isPublic));
        }
        if (filters.isOfficial !== undefined) {
            conditions.push(eq(templates.isOfficial, filters.isOfficial));
        }
        if (filters.search) {
            conditions.push(or(like(templates.name, `%${filters.search}%`), like(templates.description, `%${filters.search}%`)));
        }
        return db.select()
            .from(templates)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .limit(filters.limit || 50);
    }
    async useTemplate(templateId, userId, workflowId) {
        // Increment usage count
        await db.update(templates)
            .set({ usageCount: sql `${templates.usageCount} + 1` })
            .where(eq(templates.id, templateId));
        // Record usage
        await db.insert(templateUsage).values({
            templateId,
            userId,
            workflowId: workflowId || null,
        });
    }
    async rateTemplate(templateId, userId, rating, review) {
        // Check if user already rated
        const existing = await db.select()
            .from(templateUsage)
            .where(and(eq(templateUsage.templateId, templateId), eq(templateUsage.userId, userId)))
            .limit(1);
        if (existing.length > 0) {
            // Update existing rating
            await db.update(templateUsage)
                .set({ rating, review: review || null })
                .where(eq(templateUsage.id, existing[0].id));
        }
        else {
            // Create new rating
            await db.insert(templateUsage).values({
                templateId,
                userId,
                rating,
                review: review || null,
            });
        }
        // Recalculate average rating
        const ratings = await db.select()
            .from(templateUsage)
            .where(and(eq(templateUsage.templateId, templateId), sql `${templateUsage.rating} IS NOT NULL`));
        const avgRating = ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length;
        await db.update(templates)
            .set({
            rating: avgRating,
            ratingCount: ratings.length,
        })
            .where(eq(templates.id, templateId));
    }
}
//# sourceMappingURL=TemplateService.js.map