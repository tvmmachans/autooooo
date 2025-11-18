import { Router } from 'express';
import { settingsController } from '../controllers/settingsController.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
// All routes require authentication
router.use(authenticate);
// User settings
router.get('/user', settingsController.getUserSettings.bind(settingsController));
router.put('/user', settingsController.updateUserSettings.bind(settingsController));
router.put('/user/password', settingsController.changePassword.bind(settingsController));
// Two-factor authentication
router.post('/user/2fa/setup', settingsController.setup2FA.bind(settingsController));
router.post('/user/2fa/verify', settingsController.verify2FA.bind(settingsController));
router.post('/user/2fa/disable', settingsController.disable2FA.bind(settingsController));
// Workspace settings
router.get('/workspace', settingsController.getWorkspaceSettings.bind(settingsController));
router.put('/workspace', settingsController.updateWorkspaceSettings.bind(settingsController));
// API keys
router.get('/api-keys', settingsController.getApiKeys.bind(settingsController));
router.post('/api-keys', settingsController.createApiKey.bind(settingsController));
router.delete('/api-keys/:id', settingsController.revokeApiKey.bind(settingsController));
// Integrations
router.get('/integrations', settingsController.getIntegrations.bind(settingsController));
router.post('/integrations', settingsController.connectIntegration.bind(settingsController));
router.delete('/integrations/:id', settingsController.disconnectIntegration.bind(settingsController));
// AI service configuration
router.get('/ai-services', settingsController.getAIServiceConfig.bind(settingsController));
router.put('/ai-services', settingsController.updateAIServiceConfig.bind(settingsController));
// Workflow preferences
router.get('/workflow-preferences', settingsController.getWorkflowPreferences.bind(settingsController));
router.put('/workflow-preferences', settingsController.updateWorkflowPreferences.bind(settingsController));
// Security logs
router.get('/security-logs', settingsController.getSecurityLogs.bind(settingsController));
export default router;
//# sourceMappingURL=settingsRoutes.js.map