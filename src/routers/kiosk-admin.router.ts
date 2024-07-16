import { Router } from 'express';

import * as kioskAdminController from '../controllers/kiosk-admin.controller';
// import { checkUserType, UserType, verifyJWT } from '../middlewares/jwtValidator.middleware';

const kioskAdminRouter = Router();

kioskAdminRouter.post('/auth/login', kioskAdminController.kioskAdminLogin);

export default kioskAdminRouter;
