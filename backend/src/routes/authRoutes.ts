import { Router } from 'express';
import { login, getCurrentUser, switchRole } from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.get('/me', getCurrentUser);
router.post('/switch-role', switchRole);

export default router;
