import {Router} from 'express';
import { signUp, signIn, logout } from '../controllers/authController.js';
import authUser from '../middlewares/authMiddlewares.js';

const authRouter = Router();

authRouter.post("/cadastro", signUp);
authRouter.post("/login", signIn);

authRouter.delete("/logout", authUser, logout);

export default authRouter;