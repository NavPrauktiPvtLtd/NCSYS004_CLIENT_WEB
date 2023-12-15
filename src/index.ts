import cors from 'cors';
import express, { Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import logger from './config/logger';
import errorHandler from './middlewares/errorHandler.middleware';
import notFoundHandler from './middlewares/notFoundHandler.middleware';
import testRouter from './routers/test.router';

const PORT = process.env.PORT || 8080;

const app = express();

//* Middilewares
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

//* Register routers
app.use('/api/test', testRouter);
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('/api/serial-number', async (_, res: Response): Promise<void> => {
  try {
    const serialNumber = process.env.SERIAL_NO;

    res.json({ serialNumber });
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

//* Start the server
app.listen(PORT, () => {
  logger.info(`Listening at http://localhost:${PORT}`);
});

//* Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);
