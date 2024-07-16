import { Router } from 'express';

import * as adminController from '../controllers/admin.controller';
import { checkUserType, UserType, verifyJWT } from '../middlewares/jwtValidator.middleware';

const adminRouter = Router();

adminRouter.post('/auth/login', adminController.adminLogin);

adminRouter.post('/register-kiosk', verifyJWT, checkUserType(UserType.ADMIN), adminController.registerKiosk);

adminRouter.get('/kiosks', verifyJWT, adminController.getAllKiosk);

adminRouter.get('/users', verifyJWT, adminController.getAllUsers);

adminRouter.get('/kiosk-list', verifyJWT, adminController.getKioskList);

adminRouter.get('/kiosk/user', verifyJWT, adminController.usersPerKiosk);

adminRouter.get('/kiosk-clients', verifyJWT, adminController.kioskClientList);

adminRouter.post('/question', verifyJWT, checkUserType(UserType.CLIENT), adminController.addQuestions);

adminRouter.get('/question-list', verifyJWT, adminController.getQuestions);

adminRouter.post('/edit-question/:id', verifyJWT, checkUserType(UserType.CLIENT), adminController.editQuestions);

adminRouter.patch('/delete-question/:id', verifyJWT, checkUserType(UserType.CLIENT), adminController.deleteQuestion);

adminRouter.post('/generate-link', verifyJWT, checkUserType(UserType.ADMIN), adminController.generateLink);

adminRouter.get('/validate-link/:id', adminController.validateLink);

adminRouter.get(
  '/questions-and-answers',
  verifyJWT,
  checkUserType(UserType.ADMIN),
  adminController.getQuestionsAndAnswers
);

export default adminRouter;
