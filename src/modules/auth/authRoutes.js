import { Router } from 'express';
import authController from './authController.js';
import authValidation from './authValidation.js';
import validate from '../../middlewares/validate.js';
import authenticate from '../../middlewares/authenticate.js';
import verified from '../../middlewares/verified.js';

const router = Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), verified, authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh', validate(authValidation.refresh), authController.refresh);
router.get('/verify/:token', authController.verifyEmail);

export default router;
