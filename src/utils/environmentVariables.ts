/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
import dotenv from 'dotenv';
import { z } from 'zod';

import logger from '../config/logger';

dotenv.config();

export const environmentVariablesSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  // AWS_ACCESS_KEY: z.string(),
  // AWS_SECRET_KEY: z.string(),
  ADMIN_USER: z.string(),
  ADMIN_EMAIL: z.string(),
  ADMIN_PASSWORD: z.string(),
  SERIAL_NO: z.string(),
  // KIOSK_ADMIN_EMAIL: z.string(),
  // KIOSK_ADMIN_PASSWORD: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof environmentVariablesSchema> {}
  }
}

export const checkEnv = () => {
  try {
    environmentVariablesSchema.parse(process.env);
  } catch (error) {
    logger.error(error);
    throw new Error('Environment variables not found');
  }
};
