import express from 'express';
const router = express.Router();
import { registerController, loginController, userController, refreshTokenController, productController } from '../controllers';
import auth from '../middlewares/auth';
import admin from '../middlewares/admin';

// Auth Routes
router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/user', auth, userController.user);
router.post('/refresh-token', refreshTokenController.refresh);
router.post('/logout', auth, loginController.logout);

router.post('/products/cart-items', productController.getProducts);

// Products routes
router.post('/products', [auth, admin], productController.store);
router.put('/products/:id', [auth, admin], productController.update);
router.delete('/products/:id', [auth, admin], productController.destroy);
router.get('/products', productController.index);
router.get('/products/:id', productController.show);

export default router;