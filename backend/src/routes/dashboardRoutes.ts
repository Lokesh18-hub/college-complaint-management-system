import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authenticate } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticate);

router.get('/student', DashboardController.getStudentDashboard);
router.get('/admin', requireAdmin, DashboardController.getAdminDashboard);

export default router;
