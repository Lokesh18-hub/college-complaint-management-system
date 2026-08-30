import { Router } from 'express';
import { StaffController } from '../controllers/staffController';
import { authenticate } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', StaffController.getAll);
router.get('/:id', StaffController.getById);

// Admin-only mutation routes
router.post('/', requireAdmin, StaffController.create);
router.put('/:id', requireAdmin, StaffController.update);
router.delete('/:id', requireAdmin, StaffController.delete);

export default router;
