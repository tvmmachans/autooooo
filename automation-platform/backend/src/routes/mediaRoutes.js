import { Router } from 'express';
import { uploadSingle } from '../middleware/upload.js';
import { uploadMedia, getMedia, deleteMedia } from '../controllers/mediaController.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
// All routes require authentication
router.use(authenticate);
// Upload media
router.post('/upload', uploadSingle, uploadMedia);
// Get media by ID
router.get('/:id', getMedia);
// Delete media
router.delete('/:id', deleteMedia);
export default router;
//# sourceMappingURL=mediaRoutes.js.map