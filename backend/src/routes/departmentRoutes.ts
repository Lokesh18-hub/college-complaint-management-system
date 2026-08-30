import { Router } from 'express';
import { DepartmentController } from '../controllers/departmentController';
import { authenticate } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = Router();

// Department list can be accessed by authenticated users (e.g. for dropdowns)
router.use(authenticate);

router.get('/', DepartmentController.getAll);
router.get('/:id', DepartmentController.getById);

// Admin-only mutation routes
router.post('/', requireAdmin, DepartmentController.create);
router.put('/:id', requireAdmin, DepartmentController.update);
router.delete('/:id', requireAdmin, DepartmentController.delete);

export default router;
