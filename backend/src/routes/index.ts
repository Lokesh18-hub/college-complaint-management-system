import { Router } from 'express';
import authRoutes from './authRoutes';
import complaintRoutes from './complaintRoutes';
import departmentRoutes from './departmentRoutes';
import staffRoutes from './staffRoutes';
import dashboardRoutes from './dashboardRoutes';
import notificationRoutes from './notificationRoutes';
import uploadRoutes from './uploadRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/complaints', complaintRoutes);
router.use('/departments', departmentRoutes);
router.use('/staff', staffRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/notifications', notificationRoutes);
router.use('/upload', uploadRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'CCMS API',
  });
});

export default router;
