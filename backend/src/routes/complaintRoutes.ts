import { Router } from 'express';
import { ComplaintController } from '../controllers/complaintController';
import { authenticate } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = Router();

// All complaint endpoints require authentication
router.use(authenticate);

router.post('/', ComplaintController.createComplaint);
router.get('/', ComplaintController.getComplaints);
router.get('/:id', ComplaintController.getComplaintById);

// Admin-only lifecycle updates
router.patch('/:id/status', requireAdmin, ComplaintController.updateStatus);
router.patch('/:id/priority', requireAdmin, ComplaintController.updatePriority);
router.post('/:id/assign', requireAdmin, ComplaintController.assignComplaint);
router.post('/:id/resolve', requireAdmin, ComplaintController.resolveComplaint);

// Shared / Role-specific actions
router.post('/:id/close', ComplaintController.closeComplaint);
router.post('/:id/updates', ComplaintController.addComment);
router.post('/:id/attachments', ComplaintController.addAttachment);

export default router;
