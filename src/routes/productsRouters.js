import {Router} from 'express';
import * as products from '../controllers/productsController.js';
import authUser from '../middlewares/authMiddlewares.js';

const router = Router();

router.get("/produtos", products.listProducts);

router.use(authUser);
router.post("/addCarrinho/:productId", products.addCart);


export default router;