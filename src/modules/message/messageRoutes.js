import { Router } from 'express';
import authenticate from '../../middlewares/authenticate.js';
import validate from '../../middlewares/validate.js';
import messageValidation from './messageValidation.js';
import messageController from './messageController.js';

const router = Router();

router.get('/', authenticate, messageController.getAll);
router.post('/', validate(messageValidation.create), messageController.create);
router.delete('/:id', authenticate, validate(messageValidation.delete), messageController.delete);

export default router;
