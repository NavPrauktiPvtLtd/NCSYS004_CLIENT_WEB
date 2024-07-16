import cors from 'cors';
import express, { Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import logger from './config/logger';
import errorHandler from './middlewares/errorHandler.middleware';
import notFoundHandler from './middlewares/notFoundHandler.middleware';
import dotenv from 'dotenv';
import adminRouter from './routers/admin.router';
import clientRouter from './routers/client.router';
import kioskAdminRouter from './routers/kiosk-admin.router';
import statisticsRouter from './routers/statistics.router';
import userRouter from './routers/user.router';
import authRouter from './routers/auth.router';
import prisma from './config/prisma';
import { checkEnv } from './utils/environmentVariables';

dotenv.config();

const PORT = process.env.PORT || 5050;

const app = express();

//* Middilewares
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

//* Register routers
app.use('/api/admin', adminRouter);
app.use('/api/client', clientRouter);
app.use('/api/kiosk-admin', kioskAdminRouter);
app.use('/api/stats', statisticsRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/api/kiosk/serial-number', async (_, res: Response): Promise<void> => {
  try {
    const serialNumber = process.env.SERIAL_NO;

    res.json({ serialNumber });
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});
//* Start the server
app.listen(PORT, async () => {
  try {
    await checkEnv();
    const adminExists = await prisma.admin.findFirst({
      where: {
        email: process.env.ADMIN_EMAIL,
      },
    });
    if (!adminExists) {
      await prisma.admin.create({
        data: {
          username: process.env.ADMIN_USER!,
          email: process.env.ADMIN_EMAIL!,
          password: process.env.ADMIN_PASSWORD!,
        },
      });
      logger.info('Admin created');
    } else {
      logger.info('Admin already exists');
    }
  } catch (error) {
    logger.error(error);
  }
  logger.info(`Listening at http://localhost:${PORT}`);
});

//* Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);
