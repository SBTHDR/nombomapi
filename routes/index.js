import express from 'express';
const router = express.Router();
import { registerController, loginController, userController, refreshTokenController } from '../controllers';
import auth from '../middlewares/auth';

router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/user', auth, userController.user);
router.post('/refresh-token', refreshTokenController.refresh);
router.post('/logout', auth, loginController.logout);

export default router;