import { Router } from 'express';

import * as statisticsController from '../controllers/statistics.controller';
import { verifyJWT } from '../middlewares/jwtValidator.middleware';

const statisticsRouter = Router();

// add validation middleware later

statisticsRouter.get('/total-kiosk', verifyJWT, statisticsController.totalKiosk);

statisticsRouter.get('/total-users', verifyJWT, statisticsController.totalUsers);

statisticsRouter.post('/start-session', statisticsController.startTestSession);

statisticsRouter.patch('/end-session', statisticsController.endTestSession);

export default statisticsRouter;
