/* eslint-disable @typescript-eslint/no-namespace */
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import logger from '../config/logger';
import { ERRORS } from '../constants/error';

export enum UserType {
  ADMIN,
  // KIOSK_ADMIN,
  CLIENT,
  // USER,
}

interface UserPayload {
  userId: string; // when the user is kioskADMIN,client or admin then there will be only userId
  userType: UserType;
}

declare global {
  namespace Express {
    interface Request {
      currentUser: UserPayload;
    }
  }
}

//* Middleware to verify JWT token
export const verifyJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  //* if token is not provided, send 401
  if (!token) {
    next(boom.unauthorized(ERRORS.NOT_AUTHORIZED));
    return;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    req.currentUser = payload;
    // logger.debug(payload);
    next();
  } catch (error) {
    logger.error(error);
    //* if token is invalid, send 401
    next(boom.unauthorized(ERRORS.NOT_AUTHORIZED));
  }
};

export const checkUserType =
  (utype: UserType) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userType } = req.currentUser;
    if (utype === UserType.ADMIN && userType !== UserType.ADMIN) {
      next(boom.unauthorized(ERRORS.NOT_AUTHORIZED));
      return;
    }
    // if (utype === UserType.KIOSK_ADMIN && userType !== UserType.KIOSK_ADMIN) {
    //   next(boom.unauthorized(ERRORS.NOT_AUTHORIZED));
    //   return;
    // }
    if (utype === UserType.CLIENT && userType !== UserType.CLIENT) {
      next(boom.unauthorized(ERRORS.NOT_AUTHORIZED));
      return;
    }
    // if (utype === UserType.USER && userType !== UserType.USER) {
    //   next(boom.unauthorized(ERRORS.NOT_AUTHORIZED));
    //   return;
    // }
    next();
  };
