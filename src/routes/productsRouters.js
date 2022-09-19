import {Router} from 'express';
import * as products from '../controllers/productsController.js';
import authUser from '../middlewares/authMiddlewares.js';

const router = Router();

router.get("/produtos", products.listProducts);
router.get("/produto/:productId", products.findProduct)

router.use(authUser);
router.get("/carrinho", products.listCart)
router.post("/addCarrinho/:productId", products.addCart);
router.post("/removeOne/:productId", products.removeOneCart);
router.delete("/removeItem/:productId", products.removeCart);


export default router;