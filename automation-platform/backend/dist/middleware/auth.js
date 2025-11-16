import jwt from 'jsonwebtoken';
import { db } from '../database/index.js';
import { users } from '../database/schema.js';
import { eq } from 'drizzle-orm';
// JWT authentication middleware
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Access token required' });
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
        // Fetch user from database to ensure they still exist and are active
        const [user] = await db
            .select({
            id: users.id,
            email: users.email,
            name: users.name,
            isActive: users.isActive,
        })
            .from(users)
            .where(eq(users.id, decoded.userId))
            .limit(1);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        if (!user.isActive) {
            return res.status(401).json({ error: 'Account is deactivated' });
        }
        // Attach user to request object
        req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
        };
        next();
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expired' });
        }
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};
// Role-based authorization middleware
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        if (!roles.includes(req.user.role || '')) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
};
// Admin-only middleware
export const requireAdmin = authorize('admin');
// Optional authentication (doesn't fail if no token provided)
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(); // Continue without user
        }
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
        const [user] = await db
            .select({
            id: users.id,
            email: users.email,
            name: users.name,
            isActive: users.isActive,
        })
            .from(users)
            .where(eq(users.id, decoded.userId))
            .limit(1);
        if (user && user.isActive) {
            req.user = {
                id: user.id,
                email: user.email,
                name: user.name,
            };
        }
        next();
    }
    catch (error) {
        // Ignore auth errors for optional auth
        next();
    }
};
