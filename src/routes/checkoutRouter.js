import {Router} from 'express';
import {checkout} from '../controllers/checkoutController.js';
import authUser from '../middlewares/authMiddlewares.js';

const checkoutRouter = Router();

checkoutRouter.post("/checkout",authUser, checkout);

export default checkout;