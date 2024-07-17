/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import logger from '../config/logger';
import prisma from '../config/prisma';
import { ERRORS } from '../constants/error';
import { UserType } from '../middlewares/jwtValidator.middleware';
// import { UserType } from '../middlewares/jwtValidator.middleware';
import { endStatisticsSchema, startStatisticsSchema } from '../validation-schema/validationSchema';

export const totalKiosk = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId, userType } = req.currentUser;
    if (userType === UserType.CLIENT) {
      const kiosks = await prisma.kiosk.aggregate({
        where: {
          kioskClientId: userId,
        },
        _count: {
          id: true,
        },
      });
      res.send({ count: kiosks._count.id });
    } else {
      const kiosks = await prisma.kiosk.aggregate({
        _count: {
          id: true,
        },
      });
      res.send({ count: kiosks._count.id });
    }
  } catch (error) {
    logger.error(error);
    next(boom.internal('Error fetching kiosk count'));
  }
};

export const totalUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId: clientId, userType } = req.currentUser;
    if (userType === UserType.CLIENT) {
      const count = await prisma.$queryRaw`
        SELECT COUNT(DISTINCT "Statistics"."userId") AS "count"
        FROM "Statistics"
        JOIN "Kiosk" ON "Statistics"."kioskId" = "Kiosk"."id"
        JOIN "User" ON "Statistics"."userId" = "User"."id"
        WHERE "Kiosk"."kioskClientId" = ${clientId}
        AND "Statistics"."feedbackGiven" = true
      `;
      const customJson = JSON.stringify(count, (key, value) => {
        return typeof value === 'bigint' ? Number(value) : value;
      });

      const totalCount = JSON.parse(customJson);
      // const totalCount = countResult[0]?.count;
      res.send({ count: totalCount[0].count || 0 });
    } else {
      const users = await prisma.user.aggregate({
        _count: {
          id: true,
        },
      });
      res.send({ count: users._count.id });
    }
  } catch (error) {
    logger.error(error);
    next(boom.internal('Error fetching user count'));
  }
};

export const startTestSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await startStatisticsSchema.safeParseAsync(req.body);

    if (result.success === false) {
      logger.error(JSON.stringify(result.error));
      next(boom.badRequest(ERRORS.INVALID_REQUEST_PAYLOAD));
      return;
    }

    const { userId, kioskId: serial_no } = result.data;

    const start_time = new Date();

    const userExist = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!userExist) {
      next(boom.notFound('user does not exists'));
      return;
    }

    const kioskExist = await prisma.kiosk.findFirst({
      where: {
        serial_no,
      },
    });

    if (!kioskExist) {
      next(boom.notFound('kiosk does not exists'));
      return;
    }

    const data = await prisma.statistics.create({
      data: {
        userId,
        kioskId: kioskExist.id,
        start_time,
        feedbackGiven: false,
      },
    });

    res.status(201).send({ id: data.id });
  } catch (error) {
    logger.error(error);
    next(boom.internal('Error adding user statistics'));
  }
};

export const endTestSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log(req.query);
    const result = await endStatisticsSchema.safeParseAsync(req.query);

    if (result.success === false) {
      logger.error(JSON.stringify(result.error));
      next(boom.badRequest(ERRORS.INVALID_QUERY_PARAMETERS));
      return;
    }
    const { statsId } = result.data;

    const end_time = new Date();

    const statsExist = await prisma.statistics.findFirst({
      where: {
        id: statsId,
      },
    });

    if (!statsExist) {
      next(boom.notFound('Data not found'));
      return;
    }
    const data = await prisma.statistics.update({
      where: {
        id: statsId,
      },
      data: {
        feedbackGiven: true,
        end_time,
      },
    });
    res.status(201).send({ data });
  } catch (error) {
    logger.error(error);
    next(boom.internal('Error updating user statistics'));
  }
};
