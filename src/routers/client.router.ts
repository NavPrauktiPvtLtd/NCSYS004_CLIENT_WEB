import { Router } from 'express';

import * as clientController from '../controllers/client.controller';
import { checkUserType, UserType, verifyJWT } from '../middlewares/jwtValidator.middleware';
// import { checkUserType, UserType, verifyJWT } from '../middlewares/jwtValidator.middleware';

const clientRouter = Router();

clientRouter.post('/register', clientController.registerClient);

clientRouter.post('/auth/login', clientController.clientLogin);
clientRouter.get(
  '/questions-and-answers',
  verifyJWT,
  checkUserType(UserType.CLIENT),
  clientController.getQuestionsAndAnswers
);
export default clientRouter;
