import { Router } from 'express';
import { getCampusMetrics, getBuildingsHealth } from '../controllers/adminController.js';

const router = Router();

router.get('/metrics', getCampusMetrics);
router.get('/buildings', getBuildingsHealth);

export default router;
