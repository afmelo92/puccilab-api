import { Router } from 'express';
import MenuController from './controllers/MenuController';
import ProductsController from './controllers/ProductsController';
import SessionsController from './controllers/SessionsController';
import UsersController from './controllers/UsersController';
import OrdersController from './controllers/OrdersController';
import isAdmin from './middlewares/isAdmin';
import isAuthenticated from './middlewares/isAuthenticated';
import personalAction from './middlewares/personalAction';
import uploadHandler from './middlewares/uploadHandler';
import PatientsController from './controllers/PatientsController';

const router = Router();

// Session
router.post('/session', SessionsController.create);

// Forgot/reset password
router.put('/session/forgot-password', SessionsController.update);
router.put('/session/forgot-password/:token/:id', SessionsController.update);

// Users
router.post('/users', UsersController.create);
router.get('/users', isAuthenticated, isAdmin, UsersController.index);
router.get('/users/:id', isAuthenticated, personalAction, UsersController.show);
router.put(
  '/users/:id',
  isAuthenticated,
  personalAction,
  UsersController.update
);
router.delete('/users/:id', isAuthenticated, isAdmin, UsersController.delete);

// Menus
router.get('/menus', isAuthenticated, MenuController.index);
router.post('/menus', isAuthenticated, isAdmin, MenuController.create);
router.put('/menus/:id', isAuthenticated, isAdmin, MenuController.update);
router.delete('/menus/:id', isAuthenticated, isAdmin, MenuController.delete);

// Products
router.get('/products', isAuthenticated, ProductsController.index);
router.post('/products', isAuthenticated, isAdmin, ProductsController.create);
router.get('/products/:id', isAuthenticated, ProductsController.show);
router.put(
  '/products/:id',
  isAuthenticated,
  isAdmin,
  ProductsController.update
);
router.delete(
  '/products/:id',
  isAuthenticated,
  isAdmin,
  ProductsController.delete
);

// Orders
router.post(
  '/orders',
  isAuthenticated,
  uploadHandler.array('upload'),
  OrdersController.create
);
router.get('/orders', isAuthenticated, OrdersController.index);
router.get('/orders/:id', isAuthenticated, OrdersController.show);
router.put(
  '/orders/:id',
  isAuthenticated,
  uploadHandler.array('upload'),
  OrdersController.update
);
router.delete('/orders/:id', isAuthenticated, OrdersController.delete);

// Patients
router.post('/patients', isAuthenticated, PatientsController.create);
router.get('/patients', isAuthenticated, PatientsController.index);

export default router;
