import {Router} from 'express';
import { signUp, signIn } from '../controllers/authController.js';

const authRouter = Router();

authRouter.post("/cadastro", signUp);
authRouter.post("/login", signIn);

export default authRouter;