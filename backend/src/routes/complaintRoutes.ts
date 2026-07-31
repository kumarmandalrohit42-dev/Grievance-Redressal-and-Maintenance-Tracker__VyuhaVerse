import { Router } from 'express';
import {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus
} from '../controllers/complaintController.js';

const router = Router();

router.get('/', getAllComplaints);
router.get('/:id', getComplaintById);
router.post('/', createComplaint);
router.patch('/:id/status', updateComplaintStatus);

export default router;
