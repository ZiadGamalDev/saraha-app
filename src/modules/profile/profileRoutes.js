import { Router } from 'express';
import profileController from './profileController.js';
import authenticate from '../../middlewares/authenticate.js';
import validate from '../../middlewares/validate.js';
import profileValidation from './profileValidation.js';
import upload from '../../middlewares/configMulter.js';

const router = Router();

router.get('/', authenticate, profileController.show);
router.put('/', upload.single('image'), authenticate, validate(profileValidation.update), profileController.update);

export default router;
