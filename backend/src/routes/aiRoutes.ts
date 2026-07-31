import { Router } from 'express';
import { analyzeGrievanceWithAI } from '../controllers/aiController.js';

const router = Router();

router.post('/analyze', analyzeGrievanceWithAI);

export default router;
