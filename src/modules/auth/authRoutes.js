import { Router } from 'express';
import authController from './authController.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/email/verify/:token', authController.verifyEmail);

export default router;