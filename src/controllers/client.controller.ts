import boom from '@hapi/boom';
import Bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import logger from '../config/logger';
import prisma from '../config/prisma';
import { ERRORS } from '../constants/error';
import { UserType } from '../middlewares/jwtValidator.middleware';
import { kioskClientRegistrationSchema, userLoginSchema } from '../validation-schema/validationSchema';

export const registerClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await kioskClientRegistrationSchema.safeParseAsync(req.body);

    if (result.success === false) {
      logger.error(JSON.stringify(result.error));
      next(boom.badRequest(ERRORS.INVALID_REQUEST_PAYLOAD));
      return;
    }

    const { email, password, userName, name, address, phoneNumber, linkId, pan } = result.data;

    const idExists = await prisma.kioskClient.findFirst({
      where: {
        linkId,
      },
    });
    if (idExists) {
      next(boom.conflict('client already exist'));
      return;
    }
    const [emailExists, usernameExists, phoneExists, panExists] = await Promise.all([
      prisma.kioskClient.findFirst({
        where: {
          email,
        },
      }),
      prisma.kioskClient.findFirst({
        where: {
          userName,
        },
      }),
      prisma.kioskClient.findFirst({
        where: {
          phoneNumber,
        },
      }),
      prisma.kioskClient.findFirst({
        where: {
          pan,
        },
      }),
    ]);

    if (emailExists || usernameExists || phoneExists || panExists) {
      let message = '';
      if (emailExists) {
        message += 'email';
      }
      if (usernameExists) {
        message += ' username';
      }
      if (phoneExists) {
        message += ' phone';
      }
      if (panExists) {
        message += ' pan';
      }
      next(boom.conflict(message));
      return;
    }
    const data = await prisma.kioskClient.create({
      data: {
        userName,
        email,
        password,
        name,
        phoneNumber,
        pan,
        Address: {
          create: {
            state: address.state,
            district: address.district,
            pincode: address.pincode,
          },
        },
        linkId,
      },
    });
    res.status(201).send({ data });
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(ERRORS.INTERNAL_SERVER_ERROR));
  }
};

export const clientLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await userLoginSchema.safeParseAsync(req.body);

    if (result.success === false) {
      logger.error(JSON.stringify(result.error));
      next(boom.badRequest(ERRORS.INVALID_REQUEST_PAYLOAD));
      return;
    }

    const { email, password } = result.data;

    const user = await prisma.kioskClient.findFirst({
      where: {
        email,
      },
    });
    // Check if the users exists
    if (!user) {
      next(boom.unauthorized('User does not exists'));
      return;
    }
    // Compare the password
    const passwordMatch = await Bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      next(boom.unauthorized('Invalid Password'));
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const accessToken = jwt.sign({ userId: user.id, userType: UserType.CLIENT }, process.env.JWT_SECRET!);

    res.send({ accessToken });
  } catch (error) {
    logger.error(error);
  }
};
export const getQuestionsAndAnswers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId: kioskClientId } = req.currentUser;
    const questionsAndAnswers = await prisma.kioskClient.findUnique({
      where: { id: kioskClientId },
      select: {
        Questionnaire: {
          select: {
            question_text_primary: true,
            question_text_secondary: true,
            UserAnswer: {
              select: {
                userId_fk: {
                  select: {
                    name: true,
                    // phoneNumber: true,
                  },
                },
                type: true,
                strVal: true,
                ratingVal: true,
                // created_at: true,
                optionId_fk: {
                  select: {
                    option_val_primary: true,
                    option_val_secondary: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    res.send({ data: questionsAndAnswers });
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(ERRORS.INTERNAL_SERVER_ERROR));
  }
};
