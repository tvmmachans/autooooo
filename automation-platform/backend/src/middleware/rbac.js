import { db } from '../database/index.js';
import { roles, userRoles, PERMISSIONS } from '../database/schema.js';
import { eq, and } from 'drizzle-orm';
// Permission-based middleware
export const requirePermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            const userId = req.user.id;
            // Get user permissions from roles
            const userRoleData = await db
                .select({
                permissions: roles.permissions,
            })
                .from(userRoles)
                .innerJoin(roles, eq(userRoles.roleId, roles.id))
                .where(and(eq(userRoles.userId, userId), eq(roles.isActive, true)));
            const userPermissions = [...new Set(userRoleData.flatMap(r => r.permissions))];
            // Check if user has required permission
            if (!userPermissions.includes(requiredPermission)) {
                return res.status(403).json({
                    error: 'Insufficient permissions',
                    required: requiredPermission,
                    has: userPermissions
                });
            }
            next();
        }
        catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({ error: 'Permission check failed' });
        }
    };
};
// Multiple permissions middleware (user must have at least one)
export const requireAnyPermission = (...requiredPermissions) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            const userId = req.user.id;
            // Get user permissions from roles
            const userRoleData = await db
                .select({
                permissions: roles.permissions,
            })
                .from(userRoles)
                .innerJoin(roles, eq(userRoles.roleId, roles.id))
                .where(and(eq(userRoles.userId, userId), eq(roles.isActive, true)));
            const userPermissions = [...new Set(userRoleData.flatMap(r => r.permissions))];
            // Check if user has any of the required permissions
            const hasPermission = requiredPermissions.some(permission => userPermissions.includes(permission));
            if (!hasPermission) {
                return res.status(403).json({
                    error: 'Insufficient permissions',
                    required: requiredPermissions,
                    has: userPermissions
                });
            }
            next();
        }
        catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({ error: 'Permission check failed' });
        }
    };
};
// All permissions middleware (user must have all)
export const requireAllPermissions = (...requiredPermissions) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            const userId = req.user.id;
            // Get user permissions from roles
            const userRoleData = await db
                .select({
                permissions: roles.permissions,
            })
                .from(userRoles)
                .innerJoin(roles, eq(userRoles.roleId, roles.id))
                .where(and(eq(userRoles.userId, userId), eq(roles.isActive, true)));
            const userPermissions = [...new Set(userRoleData.flatMap(r => r.permissions))];
            // Check if user has all required permissions
            const hasAllPermissions = requiredPermissions.every(permission => userPermissions.includes(permission));
            if (!hasAllPermissions) {
                return res.status(403).json({
                    error: 'Insufficient permissions',
                    required: requiredPermissions,
                    has: userPermissions
                });
            }
            next();
        }
        catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({ error: 'Permission check failed' });
        }
    };
};
// Role-based middleware
export const requireRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            const userId = req.user.id;
            // Get user roles
            const userRoleData = await db
                .select({
                roleName: roles.name,
            })
                .from(userRoles)
                .innerJoin(roles, eq(userRoles.roleId, roles.id))
                .where(and(eq(userRoles.userId, userId), eq(roles.isActive, true)));
            const userRolesList = userRoleData.map(r => r.roleName);
            // Check if user has required role
            if (!userRolesList.includes(requiredRole)) {
                return res.status(403).json({
                    error: 'Insufficient role',
                    required: requiredRole,
                    has: userRolesList
                });
            }
            next();
        }
        catch (error) {
            console.error('Role check error:', error);
            res.status(500).json({ error: 'Role check failed' });
        }
    };
};
// Resource ownership middleware
export const requireOwnership = (resourceType) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            const userId = req.user.id;
            const resourceId = parseInt(req.params.id || '0');
            if (!resourceId) {
                return res.status(400).json({ error: 'Resource ID required' });
            }
            let isOwner = false;
            switch (resourceType) {
                case 'workflow':
                    const workflowCheck = await db
                        .select()
                        .from(require('../database/schema.js').workflows)
                        .where(and(eq(require('../database/schema.js').workflows.id, resourceId), eq(require('../database/schema.js').workflows.userId, userId)))
                        .limit(1);
                    isOwner = workflowCheck.length > 0;
                    break;
                case 'credential':
                    const credentialCheck = await db
                        .select()
                        .from(require('../database/schema.js').credentials)
                        .where(and(eq(require('../database/schema.js').credentials.id, resourceId), eq(require('../database/schema.js').credentials.userId, userId)))
                        .limit(1);
                    isOwner = credentialCheck.length > 0;
                    break;
                case 'execution':
                    // For executions, check if user owns the associated workflow
                    const executionCheck = await db
                        .select()
                        .from(require('../database/schema.js').executions)
                        .innerJoin(require('../database/schema.js').workflows, eq(require('../database/schema.js').executions.workflowId, require('../database/schema.js').workflows.id))
                        .where(and(eq(require('../database/schema.js').executions.id, resourceId), eq(require('../database/schema.js').workflows.userId, userId)))
                        .limit(1);
                    isOwner = executionCheck.length > 0;
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid resource type' });
            }
            if (!isOwner) {
                return res.status(403).json({ error: 'Access denied: not resource owner' });
            }
            next();
        }
        catch (error) {
            console.error('Ownership check error:', error);
            res.status(500).json({ error: 'Ownership check failed' });
        }
    };
};
// Admin or owner middleware
export const requireAdminOrOwner = (resourceType) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            const userId = req.user.id;
            const resourceId = parseInt(req.params.id || '0');
            // Check if user is admin
            const adminCheck = await db
                .select()
                .from(userRoles)
                .innerJoin(roles, eq(userRoles.roleId, roles.id))
                .where(and(eq(userRoles.userId, userId), eq(roles.name, 'admin'), eq(roles.isActive, true)))
                .limit(1);
            if (adminCheck.length > 0) {
                return next(); // Admin has access to everything
            }
            // If not admin, check ownership
            const ownershipMiddleware = requireOwnership(resourceType);
            return ownershipMiddleware(req, res, next);
        }
        catch (error) {
            console.error('Admin/owner check error:', error);
            res.status(500).json({ error: 'Access check failed' });
        }
    };
};
// Predefined permission middlewares for common operations
export const canCreateWorkflow = requirePermission(PERMISSIONS.WORKFLOW_CREATE);
export const canReadWorkflow = requirePermission(PERMISSIONS.WORKFLOW_READ);
export const canUpdateWorkflow = requirePermission(PERMISSIONS.WORKFLOW_UPDATE);
export const canDeleteWorkflow = requirePermission(PERMISSIONS.WORKFLOW_DELETE);
export const canExecuteWorkflow = requirePermission(PERMISSIONS.WORKFLOW_EXECUTE);
export const canCreateCredential = requirePermission(PERMISSIONS.CREDENTIAL_CREATE);
export const canReadCredential = requirePermission(PERMISSIONS.CREDENTIAL_READ);
export const canUpdateCredential = requirePermission(PERMISSIONS.CREDENTIAL_UPDATE);
export const canDeleteCredential = requirePermission(PERMISSIONS.CREDENTIAL_DELETE);
export const canReadExecution = requirePermission(PERMISSIONS.EXECUTION_READ);
export const canDeleteExecution = requirePermission(PERMISSIONS.EXECUTION_DELETE);
export const canAdmin = requirePermission(PERMISSIONS.ADMIN_ALL);
//# sourceMappingURL=rbac.js.map