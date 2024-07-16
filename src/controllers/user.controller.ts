/* eslint-disable unicorn/no-array-for-each */
/* eslint-disable unicorn/prefer-ternary */
/* eslint-disable camelcase */
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import logger from '../config/logger';
import prisma from '../config/prisma';
import { ERRORS } from '../constants/error';
import { answerSchema, kioskIdSchema, userRegistrationSchema } from '../validation-schema/validationSchema';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userRegistrationSchema.safeParseAsync(req.body);
    if (result.success === false) {
      logger.error(result.error);
      next(boom.badRequest(ERRORS.INVALID_REQUEST_PAYLOAD));
      return;
    }

    const { name, dob, gender, phoneNumber } = result.data;

    const serialNumber = process.env.SERIAL_NO;
    const kioskExist = await prisma.kiosk.findFirst({
      where: {
        serial_no: serialNumber,
      },
    });
    if (!kioskExist) {
      next(boom.badRequest('kiosk does not exist'));
      return;
    }

    const user = await prisma.user.create({
      data: {
        // firstname: firstName,
        name,
        dob,
        gender,
        phoneNumber,
      },
    });

    res.status(201).send({ user });
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(ERRORS.INTERNAL_SERVER_ERROR));
  }
};

export const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await kioskIdSchema.safeParseAsync(req.query);

    if (result.success === false) {
      logger.error(result.error);
      next(boom.badRequest(ERRORS.INVALID_REQUEST_PAYLOAD));
      return;
    }

    const { kioskId: serial_no } = result.data;

    const kioskExist = await prisma.kiosk.findFirst({
      where: {
        serial_no,
      },
    });

    if (!kioskExist) {
      next(boom.badRequest('kiosk does not exist'));
      return;
    }

    const kioskClient = await prisma.kioskClient.findFirst({
      where: {
        id: kioskExist.kioskClientId,
      },
      include: {
        Questionnaire: {
          where: {
            is_active: true,
          },
        },
      },
    });

    // const questionResults = await prisma.questionnaire.findMany({
    //   where: {
    //     is_active: true,
    //   },

    // });

    if (!kioskClient) {
      next(boom.badRequest('kiosk-client does not exist'));
      return;
    }
    // console.log('questions', kioskClient);

    const finalResults = await Promise.all(
      kioskClient.Questionnaire.map(async questionResult => {
        if (questionResult.questionType === 'Options') {
          const options = await prisma.questionsOption.findMany({
            where: {
              questionId: questionResult.id,
            },
          });
          return { ...questionResult, options };
        }
        return questionResult;
      })
    );
    res.send({ questions: finalResults });
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(ERRORS.INTERNAL_SERVER_ERROR));
  }
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export const addAnswers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await answerSchema.safeParseAsync(req.body);
    // TODO verify if the member exist for the current user
    if (result.success === false) {
      logger.error(result.error);
      next(boom.badRequest(ERRORS.INVALID_REQUEST_PAYLOAD));
      return;
    }

    const results = await kioskIdSchema.safeParseAsync(req.query);

    if (results.success === false) {
      logger.error(results.error);
      next(boom.badRequest(ERRORS.INVALID_QUERY_PARAMETERS));
      return;
    }

    const { kioskId: serial_no } = results.data;
    const kioskExist = await prisma.kiosk.findFirst({
      where: {
        serial_no,
      },
    });

    if (!kioskExist) {
      next(boom.badRequest('kiosk does not exist'));
      return;
    }

    const kioskClient = await prisma.kioskClient.findFirst({
      where: {
        id: kioskExist.kioskClientId,
      },
    });

    if (!kioskClient) {
      next(boom.badRequest('client does not exist'));
      return;
    }
    const answersData = result.data;
    answersData.forEach(async answerData => {
      const { questionId, userId, optionId, answerType, string_answer, rating_answer } = answerData;
      if (answerType === 'String') {
        if (!string_answer) {
          next(boom.badRequest('string answer not found'));
          return;
        }
        await prisma.userAnswer.create({
          data: {
            questionId,
            userId,
            type: answerType,
            strVal: string_answer,
          },
        });
      } else if (answerType === 'Rating') {
        if (!rating_answer) {
          next(boom.badRequest('rating answer not found'));
          return;
        }
        await prisma.userAnswer.create({
          data: {
            questionId,
            userId,
            type: answerType,
            ratingVal: rating_answer,
          },
        });
      } else if (answerType === 'Options') {
        if (!optionId) {
          next(boom.badRequest('options not found'));
          return;
        }
        await prisma.userAnswer.create({
          data: {
            questionId,
            userId,
            type: answerType,
            optionId,
          },
        });
      } else {
        res.sendStatus(401);
      }
    });
    // res.status(201).send({ answerList });
    res.sendStatus(201);
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(ERRORS.INTERNAL_SERVER_ERROR));
  }
};

// export const addAnswers = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const result = await answerSchema.safeParseAsync(req.body);
//     // TODO verify if the member exist for the current user

//     if (result.success === false) {
//       logger.error(result.error);
//       next(boom.badRequest(ERRORS.INVALID_REQUEST_PAYLOAD));
//       return;
//     }

//     const results = await kioskIdSchema.safeParseAsync(req.query);

//     if (results.success === false) {
//       logger.error(results.error);
//       next(boom.badRequest(ERRORS.INVALID_QUERY_PARAMETERS));
//       return;
//     }

//     const { kioskId: serial_no } = results.data;
//     const kioskExist = await prisma.kiosk.findFirst({
//       where: {
//         serial_no,
//       },
//     });

//     if (!kioskExist) {
//       next(boom.badRequest('kiosk does not exist'));
//       return;
//     }

//     const kioskClient = await prisma.kioskClient.findFirst({
//       where: {
//         id: kioskExist.kioskClientId,
//       },
//     });

//     if (!kioskClient) {
//       next(boom.badRequest('client does not exist'));
//       return;
//     }

//     const answersData = result.data;
//     answersData.map(async answerData => {
//       const { questionId, userId, optionIds, answerType, string_answer } = answerData;

//       if (answerType === 'String') {
//         if (!string_answer) {
//           next(boom.notFound(' string answer not found'));
//           return;
//         }

//         await prisma.userAnswer.create({
//           data: {
//             questionId,
//             userId,
//             type: answerType,
//             strVal: string_answer,
//           },
//         });
//       } else if (answerType === 'Options') {
//         if (!optionIds) {
//           next(boom.notFound(' optionIds not found'));
//           return;
//         }
//         const userAnswer = await prisma.userAnswer.create({
//           data: {
//             questionId,
//             userId,
//             type: answerType,
//           },
//         });

//         await Promise.all(
//           optionIds.map(optionId => {
//             return prisma.userAnswerOption.create({
//               data: {
//                 userAnswerId: userAnswer.id,
//                 questionOptionId: optionId,
//               },
//             });
//           })
//         );
//       }
//     });
//     res.sendStatus(201);
//   } catch (error) {
//     logger.error(error);
//     next(boom.badRequest(ERRORS.INTERNAL_SERVER_ERROR));
//   }
// };
