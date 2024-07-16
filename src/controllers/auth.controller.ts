import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import logger from '../config/logger';
import prisma from '../config/prisma';
import { ERRORS } from '../constants/error';
import { UserType } from '../middlewares/jwtValidator.middleware';

export const getSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, userType } = req.currentUser;
    // eslint-disable-next-line unicorn/prefer-switch
    if (userType === UserType.CLIENT) {
      const client = await prisma.kioskClient.findFirst({
        where: {
          id: userId,
        },
      });
      if (!client) {
        next(boom.notFound('Client not found'));
        return;
      }

      res.send({ userId, userType });
    } else {
      const admin = await prisma.admin.findFirst({
        where: {
          id: userId,
        },
      });
      if (!admin) {
        next(boom.notFound('Admin not found'));
        return;
      }

      res.send({ userId, userType });
    }
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(ERRORS.INTERNAL_SERVER_ERROR));
  }
};
