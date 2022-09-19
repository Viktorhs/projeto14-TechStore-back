import {Router} from 'express';
import {checkout, userInfos} from '../controllers/checkoutController.js';
import authUser from '../middlewares/authMiddlewares.js';

const checkoutRouter = Router();

checkoutRouter.post("/checkout",authUser, checkout);
checkoutRouter.get("/infos", authUser, userInfos);

export default checkoutRouter;