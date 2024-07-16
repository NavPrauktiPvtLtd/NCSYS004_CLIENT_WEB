import { Router } from 'express';

import * as userController from '../controllers/user.controller';

const userRouter = Router();

userRouter.post('/create-new', userController.createUser);

userRouter.post('/answers', userController.addAnswers);

userRouter.get('/question-list', userController.getQuestions);

export default userRouter;
