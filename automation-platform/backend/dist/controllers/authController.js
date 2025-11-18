import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, withTransaction } from '../database/index.js';
import { users, roles, userRoles, sessions } from '../database/schema.js';
import { eq, and, sql } from 'drizzle-orm';
import { randomBytes } from 'crypto';
// JWT token generation
const generateAccessToken = (userId) => {
    return jwt.sign({ userId, type: 'access' }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '15m' });
};
const generateRefreshToken = () => {
    return randomBytes(64).toString('hex');
};
// Password validation
const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};
// Email validation
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
export class AuthController {
    // Register new user
    async register(req, res) {
        try {
            const { email, password, name } = req.body;
            // Validation
            if (!email || !password || !name) {
                return res.status(400).json({ error: 'Email, password, and name are required' });
            }
            if (!validateEmail(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
            if (!validatePassword(password)) {
                return res.status(400).json({ error: 'Password must be at least 8 characters with uppercase, lowercase, and number' });
            }
            if (name.length < 2 || name.length > 50) {
                return res.status(400).json({ error: 'Name must be between 2 and 50 characters' });
            }
            // Check if user already exists
            const existingUser = await db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);
            if (existingUser.length > 0) {
                return res.status(409).json({ error: 'User with this email already exists' });
            }
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);
            // Create user and assign default role in transaction
            const result = await withTransaction(async (tx) => {
                // Create user
                const [newUser] = await tx
                    .insert(users)
                    .values({
                    email,
                    password: hashedPassword,
                    name,
                })
                    .returning();
                // Get default user role
                const [defaultRole] = await tx
                    .select()
                    .from(roles)
                    .where(eq(roles.name, 'user'))
                    .limit(1);
                if (defaultRole) {
                    // Assign user role
                    await tx
                        .insert(userRoles)
                        .values({
                        userId: newUser.id,
                        roleId: defaultRole.id,
                    });
                }
                return newUser;
            });
            // Generate tokens
            const accessToken = generateAccessToken(result.id);
            const refreshToken = generateRefreshToken();
            // Create session
            await db.insert(sessions).values({
                userId: result.id,
                refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                userAgent: req.get('User-Agent'),
                ipAddress: req.ip,
            });
            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: result.id,
                    email: result.email,
                    name: result.name,
                },
                accessToken,
                refreshToken,
            });
        }
        catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Registration failed' });
        }
    }
    // Login user
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }
            // Find user
            const [user] = await db
                .select()
                .from(users)
                .where(and(eq(users.email, email), eq(users.isActive, true)))
                .limit(1);
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            // Get user roles and permissions
            const userRoleData = await db
                .select({
                roleName: roles.name,
                permissions: roles.permissions,
            })
                .from(userRoles)
                .innerJoin(roles, eq(userRoles.roleId, roles.id))
                .where(and(eq(userRoles.userId, user.id), eq(roles.isActive, true)));
            const userRolesList = userRoleData.map(r => r.roleName);
            const userPermissions = [...new Set(userRoleData.flatMap(r => r.permissions))];
            // Generate tokens
            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken();
            // Create session
            await db.insert(sessions).values({
                userId: user.id,
                refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                userAgent: req.get('User-Agent'),
                ipAddress: req.ip,
            });
            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    roles: userRolesList,
                    permissions: userPermissions,
                },
                accessToken,
                refreshToken,
            });
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Login failed' });
        }
    }
    // Logout user
    async logout(req, res) {
        try {
            const refreshToken = req.body.refreshToken;
            if (refreshToken) {
                // Invalidate session
                await db
                    .update(sessions)
                    .set({ isActive: false })
                    .where(eq(sessions.refreshToken, refreshToken));
            }
            res.json({ message: 'Logout successful' });
        }
        catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ error: 'Logout failed' });
        }
    }
    // Refresh access token
    async refresh(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ error: 'Refresh token is required' });
            }
            // Find and validate session
            const [session] = await db
                .select()
                .from(sessions)
                .where(and(eq(sessions.refreshToken, refreshToken), eq(sessions.isActive, true), sql `${sessions.expiresAt} > NOW()`))
                .limit(1);
            if (!session) {
                return res.status(401).json({ error: 'Invalid or expired refresh token' });
            }
            // Generate new access token
            const accessToken = generateAccessToken(session.userId);
            res.json({
                accessToken,
                refreshToken, // Return same refresh token
            });
        }
        catch (error) {
            console.error('Refresh token error:', error);
            res.status(500).json({ error: 'Token refresh failed' });
        }
    }
    // Get current user profile
    async me(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const userId = req.user.id;
            // Get user with roles and permissions
            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.id, userId))
                .limit(1);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            // Get user roles and permissions
            const userRoleData = await db
                .select({
                roleName: roles.name,
                permissions: roles.permissions,
            })
                .from(userRoles)
                .innerJoin(roles, eq(userRoles.roleId, roles.id))
                .where(and(eq(userRoles.userId, userId), eq(roles.isActive, true)));
            const userRolesList = userRoleData.map(r => r.roleName);
            const userPermissions = [...new Set(userRoleData.flatMap(r => r.permissions))];
            res.json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    isActive: user.isActive,
                    emailVerified: user.emailVerified,
                    roles: userRolesList,
                    permissions: userPermissions,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            });
        }
        catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ error: 'Failed to get user profile' });
        }
    }
    // Change password
    async changePassword(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ error: 'Current password and new password are required' });
            }
            if (!validatePassword(newPassword)) {
                return res.status(400).json({ error: 'New password must be at least 8 characters with uppercase, lowercase, and number' });
            }
            // Get user
            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.id, userId))
                .limit(1);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            // Verify current password
            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ error: 'Current password is incorrect' });
            }
            // Hash new password
            const hashedNewPassword = await bcrypt.hash(newPassword, 12);
            // Update password
            await db
                .update(users)
                .set({
                password: hashedNewPassword,
                updatedAt: new Date(),
            })
                .where(eq(users.id, userId));
            // Invalidate all sessions except current
            await db
                .update(sessions)
                .set({ isActive: false })
                .where(and(eq(sessions.userId, userId), eq(sessions.isActive, true)));
            res.json({ message: 'Password changed successfully' });
        }
        catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({ error: 'Failed to change password' });
        }
    }
}
// Export singleton instance
export const authController = new AuthController();
