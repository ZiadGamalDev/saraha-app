import { Router } from 'express';
import authController from './authController.js';
import authValidation from './authValidation.js';
import validate from '../../utils/validate.js';

const router = Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', authController.logout);
router.get('/email/verify/:token', authController.verifyEmail);

export default router;
