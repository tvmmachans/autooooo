import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
// Protected routes
router.get('/me', authenticate, authController.me);
router.put('/change-password', authenticate, authController.changePassword);
export default router;
//# sourceMappingURL=authRoutes.js.map