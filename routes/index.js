import express from 'express';
const router = express.Router();
import { registerController, loginController, userController, refreshTokenController, productController } from '../controllers';
import auth from '../middlewares/auth';

// Auth Routes
router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/user', auth, userController.user);
router.post('/refresh-token', refreshTokenController.refresh);
router.post('/logout', auth, loginController.logout);


// Products routes
router.post('/products', productController.store);

export default router;