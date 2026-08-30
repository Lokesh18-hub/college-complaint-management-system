import { Router } from 'express';
import { UploadController } from '../controllers/uploadController';
import { authenticate } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.use(authenticate);

router.post('/', upload.single('file'), UploadController.uploadFile);

export default router;
