import { Router } from 'express';

import * as authController from '../controllers/auth.controller';
import { verifyJWT } from '../middlewares/jwtValidator.middleware';
// import { checkUserType, UserType, verifyJWT } from '../middlewares/jwtValidator.middleware';

const authRouter = Router();

authRouter.get('/session', verifyJWT, authController.getSession);

export default authRouter;
