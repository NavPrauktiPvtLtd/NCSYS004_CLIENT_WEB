/* eslint-disable camelcase */
import boom from '@hapi/boom';
import Bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import logger from '../config/logger';
import prisma from '../config/prisma';
import { ERRORS } from '../constants/error';
import { UserType } from '../middlewares/jwtValidator.middleware';
import { kioskLoginSchema } from '../validation-schema/validationSchema';

export const kioskAdminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await kioskLoginSchema.safeParseAsync(req.body);

    if (result.success === false) {
      logger.error(JSON.stringify(result.error));
      next(boom.badRequest(ERRORS.INVALID_REQUEST_PAYLOAD));
      return;
    }

    const { email, password, serial_no } = result.data;

    const kioskExist = await prisma.kiosk.findFirst({
      where: {
        serial_no,
      },
    });
    if (!kioskExist) {
      next(boom.badRequest('kiosk does not exists'));
      return;
    }
    const admin = await prisma.kioskAdmin.findFirst({
      where: {
        email,
        kioskId: kioskExist.id,
      },
    });
    logger.debug(admin);
    // Check if the users exists
    if (!admin) {
      next(boom.unauthorized('Admin does not exists'));
      return;
    }
    // Compare the password
    const passwordMatch = await Bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      next(boom.unauthorized('Invalid Password'));
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const accessToken = jwt.sign({ userId: admin.id, userType: UserType.KIOSK_ADMIN }, process.env.JWT_SECRET!);

    res.send({ accessToken });
  } catch (error) {
    logger.error(error);
    next(boom.internal('Error in Admin login'));
  }
};
