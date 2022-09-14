import {Router} from 'express';
import { signUp } from '../controllers/authController.js';

const authRouter = Router();

authRouter.post("/cadastro", signUp);

export default authRouter;