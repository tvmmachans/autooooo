import { Router } from 'express';
import { createApiKey, getApiKeys, revokeApiKey } from '../controllers/apiController.js';
import { authenticate } from '../middleware/auth.js';
import { apiKeyAuth, requireScope } from '../middleware/apiAuth.js';
const router = Router();
// Public API routes (require API key authentication)
const publicRouter = Router();
publicRouter.use(apiKeyAuth);
// Execute workflow via API
publicRouter.post('/workflows/:id/execute', requireScope('workflow:execute'), async (req, res) => {
    // This would call the workflow execution service
    res.json({ success: true, message: 'Workflow execution endpoint' });
});
// Get execution status
publicRouter.get('/executions/:id', requireScope('execution:read'), async (req, res) => {
    // This would get execution status
    res.json({ success: true, message: 'Execution status endpoint' });
});
// User API key management routes (require user authentication)
const userRouter = Router();
userRouter.use(authenticate);
userRouter.post('/keys', createApiKey);
userRouter.get('/keys', getApiKeys);
userRouter.delete('/keys/:id', revokeApiKey);
// Mount routers
router.use('/v1', publicRouter);
router.use('/keys', userRouter);
export default router;
//# sourceMappingURL=apiRoutes.js.map