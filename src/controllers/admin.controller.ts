/* eslint-disable sonarjs/no-duplicated-branches */
/* eslint-disable sonarjs/no-all-duplicated-branches */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable unicorn/no-nested-ternary */
/* eslint-disable unicorn/no-array-for-each */
/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/prefer-ternary */
/* eslint-disable camelcase */
import boom from '@hapi/boom';
import Bcrypt from 'bcrypt';
// import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';

import logger from '../config/logger';
import prisma from '../config/prisma';
import { ERRORS } from '../constants/error';
import { UserType } from '../middlewares/jwtValidator.middleware';
import {
  editQuestionSchema,
  idSchema,
  kioskIdSchema,
  kioskRegistrationSchema,
  paginationSchema,
  questionSchema,
  userLoginSchema,
} from '../validation-schema/validationSchema';

export function generateId(num: number) {
  const nano = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', num);
  return nano();
}

export function convertBigIntToNumber(data: unknown) {
  return JSON.stringify(data, (key, value) => {
    return typeof value === 'bigint' ? Number(value) : value;
  });
}

export const adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const result = await userLoginSchema.safeParseAsync(req.body);

  if (result.success === false) {
    logger.error(result.error);
    next(boom.badRequest(ERRORS.INVALID_REQUEST_PAYLOAD));
    return;
  }

  const { email, password } = result.data;
  try {
    const admin = await prisma.admin.findFirst({
      where: {
        email,
      },
    });

    // Check if the users exists
    if (!admin) {
      next(boom.unauthorized('Admin does not exists'));
      return;
    }
    logger.debug(admin);
    // Compare the password
    const passwordMatch = await Bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      logger.debug(JSON.stringify({ passwordMatch }));
      next(boom.unauthorized('Invalid Password'));
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const accessToken = jwt.sign({ userId: admin.id, userType: UserType.ADMIN }, process.env.JWT_SECRET!);

    res.send({ accessToken });
  } catch (error) {
    logger.error(error);
    next(boom.internal('Error in Admin login'));
  }
};

export const registerKiosk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await kioskRegistrationSchema.safeParseAsync(req.body);

    if (result.success === false) {
      logger.error(result.error);
      next(boom.badRequest(ERRORS.INVALID_REQUEST_PAYLOAD));
      return;
    }
    const { name, address, clientId } = result.data;

    const serial_no = generateId(12);

    const kioskExists = await prisma.kiosk.findFirst({
      where: {
        serial_no,
      },
    });

    if (kioskExists) {
      next(boom.conflict('kiosk with serial no already exists'));
      return;
    }

    const kioskName = await prisma.kiosk.findFirst({
      where: {
        name,
      },
    });

    if (kioskName) {
      next(boom.conflict('kiosk name already exists'));
      return;
    }

    // const userName = await prisma.kiosk.findFirst({
    //   where: {
    //     KioskAdmin: {
    //       email,
    //     },
    //   },
    // });

    // if (userName) {
    //   next(boom.conflict('username/email already exists'));
    //   return;
    // }

    // const encryptedPassword = await bcrypt.hash(password, 10);
    const data = await prisma.kiosk.create({
      data: {
        serial_no,
        name,
        status: 'Offline',
        Address: {
          create: {
            state: address.state,
            district: address.district,
            pincode: address.pincode,
          },
        },
        kioskClientId: clientId,
        // KioskAdmin: {
        //   create: {
        //     email,
        //     password: encryptedPassword,
        //   },
        // },
      },
    });

    res.status(201).send({ data });
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(ERRORS.INTERNAL_SERVER_ERROR));
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId: clientId, userType } = req.currentUser;
    const result = await paginationSchema.safeParseAsync(req.query);

    if (result.success === false) {
      logger.error(result.error);
      next(boom.badRequest(ERRORS.INVALID_REQUEST_PAYLOAD));
      return;
    }

    const { limit, offset, q, sort, sortMode } = result.data;

    let whereFilter = {};

    if (q && q.length > 0) {
      whereFilter = {
        name: {
          contains: q,
          mode: 'insensitive',
        },
      };
    }

    let sortObj = {};

    if (!sort || sort === '') {
      sortObj = {
        createdAt: 'desc',
      };
    } else {
      sortObj = {
        [sort]: sortMode === 'desc' ? 'desc' : 'asc',
      };
    }

    if (userType === UserType.CLIENT) {
      const userList = await prisma.statistics.findMany({
        distinct: ['userId'],
        select: {
          userId: true,
          kioskId_fk: { select: { serial_no: true } },
          userId_fk: {
            select: {
              name: true,
              dob: true,
              gender: true,
              phoneNumber: true,
              createdAt: true,
            },
          },
        },
        where: {
          kioskId_fk: { kioskClientId: clientId },
          feedbackGiven: true,
          userId_fk: { name: { contains: q, mode: 'insensitive' } },
          // OR: [{ userId_fk: { name: { contains: q, mode: 'insensitive' } } }],
        },
        orderBy:
          sort === 'name'
            ? { userId_fk: { name: sortMode } }
            : sort === 'dob'
            ? { userId_fk: { dob: sortMode } }
            : undefined,
        take: limit,
        skip: offset,
      });
      let count;
      if (q && q.trim() !== '') {
        count = await prisma.$queryRaw`
        SELECT COUNT(DISTINCT "Statistics"."userId") AS "count"
        FROM "Statistics"
        JOIN "Kiosk" ON "Statistics"."kioskId" = "Kiosk"."id"
        JOIN "User" ON "Statistics"."userId" = "User"."id"
        WHERE "Kiosk"."kioskClientId" = ${clientId}
        AND "Statistics"."feedbackGiven" = true
        AND ("User"."name" ILIKE '%' || ${q} || '%') `;
      } else {
        count = await prisma.$queryRaw`
        SELECT COUNT(DISTINCT "Statistics"."userId") AS "count"
        FROM "Statistics"
        JOIN "Kiosk" ON "Statistics"."kioskId" = "Kiosk"."id"
        JOIN "User" ON "Statistics"."userId" = "User"."id"
        WHERE "Kiosk"."kioskClientId" = ${clientId}
        AND "Statistics"."feedbackGiven" = true`;
      }
      const customJson = convertBigIntToNumber(count);
      const totalCount = JSON.parse(customJson);
      const modifiedUserList = userList.map(user => {
        const { userId_fk, kioskId_fk, userId: id } = user;
        return {
          ...userId_fk,
          ...kioskId_fk,
          id,
        };
      });
      res.send({ users: modifiedUserList, count: totalCount[0].count || 0 });
    } else {
      const users = await prisma.user.findMany({
        take: limit,
        skip: offset,
        where: {
          ...whereFilter,
        },
        orderBy: {
          ...sortObj,
        },
      });

      const records = await prisma.user.aggregate({
        where: {
          ...whereFilter,
        },
        _count: {
          id: true,
        },
      });
      res.send({ users, count: records._count.id });
    }
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(ERRORS.INTERNAL_SERVER_ERROR));
  }
};

export const kioskClientList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await paginationSchema.safeParseAsync(req.query);

    if (result.success === false) {
      logger.error(result.error);
      next(boom.badRequest(ERRORS.INVALID_REQUEST_PAYLOAD));
      return;
    }

    const { limit, offset, q, sort, sortMode } = result.data;

    let whereFilter = {};

    if (q && q.length > 0) {
      whereFilter = {
        name: {
          contains: q,
          mode: 'insensitive',
        },
      };
    }

    let sortObj = {};

    if (!sort || sort === '') {
      sortObj = {
        created_at: 'desc',
      };
    } else {
      sortObj = {
        [sort]: sortMode === 'desc' ? 'desc' : 'asc',
      };
    }

    const clients = await prisma.kioskClient.findMany({
      take: limit,
      skip: offset,
      where: {
        ...whereFilter,
      },

      include: {
        Address: true,
      },
      orderBy: {
        ...sortObj,
      },
    });
    const records = await prisma.kioskClient.aggregate({
      where: {
        ...whereFilter,
      },
      _count: {
        id: true,
      },
    });
    res.send({ kioskClient: clients, count: records._count.id });
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(ERRORS.INTERNAL_SERVER_ERROR));
  }
};

export const getAllKiosk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId: clientId, userType } = req.currentUser;
    const result = await paginationSchema.safeParseAsync(req.query);

    if (result.success === false) {
      logger.error(result.error);
      next(boom.badRequest(ERRORS.INVALID_REQUEST_PAYLOAD));
      return;
    }

    const { limit, offset, q, sort, sortMode } = result.data;

    let filterObj = {};

    if (q && q.length > 0) {
      filterObj = {
        ...filterObj,
        OR: [
          {
            serial_no: {
              contains: q,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: q,
              mode: 'insensitive',
            },
          },
        ],
      };
    }
    if (userType === UserType.CLIENT) {
      filterObj = {
        ...filterObj,
        kioskClientId: clientId,
      };
    }
    let sortObj = {};

    if (!sort || sort === '') {
      sortObj = {
        createdAt: 'desc',
      };
    } else {
      sortObj = {
        [sort]: sortMode === 'desc' ? 'desc' : 'asc',
      };
    }

    const kiosks = await prisma.kiosk.findMany({
      take: limit,
      skip: offset,
      where: {
        ...filterObj,
      },

      include: {
        kioskClientId_fk: true,
        // KioskAdmin: true,
      },
      orderBy: {
        ...sortObj,
      },
    });
    const records = await prisma.kiosk.aggregate({
      where: {
        ...filterObj,
      },
      _count: {
        id: true,
      },
    });
    res.send({ kiosks, count: records._count.id });
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(ERRORS.INTERNAL_SERVER_ERROR));
  }
};

export const getKioskList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId: kioskClientId, userType } = req.currentUser;
    if (userType === UserType.CLIENT) {
      const clientExist = await prisma.kioskClient.findFirst({
        where: {
          id: kioskClientId,
        },
      });
      if (!clientExist) {
        // eslint-disable-next-line sonarjs/no-duplicate-string
        next(boom.badRequest('Users not found'));
        return;
      }

      const kiosks = await prisma.kiosk.findMany({
        where: {
          kioskClientId: clientExist.id,
        },
      });
      res.send({ kiosks });
    } else {
      const kiosks = await prisma.kiosk.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.send({ kiosks });
    }
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(ERRORS.INTERNAL_SERVER_ERROR));
  }
};

export const usersPerKiosk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const { userType } = req.currentUser;
    const result = await kioskIdSchema.safeParseAsync(req.query);
    if (result.success === false) {
      logger.error(result.error);
      next(boom.badRequest(ERRORS.INVALID_QUERY_PARAMETERS));
      return;
    }

    const { kioskId } = result.data;

    const endDate = dayjs().format();

    const startDate = dayjs().subtract(1, 'month').format();
    // if (userType === UserType.CLIENT) {
    //   const allUsers = await prisma.statistics.findMany({
    //     where: {
    //       kioskId,
    //       end_time: {
    //         gte: startDate,
    //         lte: endDate,
    //       },
    //     },
    //     orderBy: {
    //       end_time: 'asc',
    //     },
    //   });

    //   if (!allUsers) {
    //     next(boom.badRequest('Users not found'));
    //     return;
    //   }

    //   const dateCounts = new Map();

    //   allUsers.forEach(user => {
    //     const userDate = dayjs(user.end_time).startOf('day'); // Ignore time
    //     const formattedDate = userDate.format();

    //     // Increment count for the formatted date in the map
    //     dateCounts.set(formattedDate, (dateCounts.get(formattedDate) || 0) + 1);
    //   });

    //   // Convert the map to an array of objects
    //   const formattedUsers = [...dateCounts].map(([date, count]) => ({ date, count }));
    //   res.send({ users: formattedUsers });
    // } else
    // {
    const allUsers = await prisma.statistics.findMany({
      where: {
        kioskId,
        end_time: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        end_time: 'asc',
      },
    });

    if (!allUsers) {
      next(boom.badRequest('Users not found'));
      return;
    }

    const dateCounts = new Map();

    allUsers.forEach(user => {
      const userDate = dayjs(user.end_time).startOf('day'); // Ignore time
      const formattedDate = userDate.format();

      // Increment count for the formatted date in the map
      dateCounts.set(formattedDate, (dateCounts.get(formattedDate) || 0) + 1);
    });

    // Convert the map to an array of objects
    const formattedUsers = [...dateCounts].map(([date, count]) => ({ date, count }));
    res.send({ users: formattedUsers });
    // }
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(ERRORS.INTERNAL_SERVER_ERROR));
  }
};

export const addQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId: kioskClientId } = req.currentUser;
    const result = await questionSchema.safeParseAsync(req.body);

    if (result.success === false) {
      logger.error(result.error);
      next(boom.badRequest(ERRORS.INVALID_REQUEST_PAYLOAD));
      return;
    }

    const { question_text_primary, questionType } = result.data;
    const createdQuestion = await prisma.questionnaire.create({
      data: {
        question_text_primary,
        questionType,
        is_active: true,
        kioskClientId,
      },
    });
    // if (questionType === 'Options' && (!options || options.length < 2)) {
    //   next(boom.badRequest('Options should have a minimum of 2 values'));
    //   return;
    // }

    // let createdQuestion;
    // if (questionType === 'Options') {
    //   if (options && options.length >= 2) {
    //     createdQuestion = await prisma.questionnaire.create({
    //       data: {
    //         question_text_primary,
    //         question_text_secondary,
    //         is_active,
    //         questionType,
    //         QuestionsOption: {
    //           create: options.map(option => ({
    //             option_val_primary: option.primary,
    //             option_val_secondary: option.secondary,
    //           })),
    //         },
    //         kioskClientId,
    //       },
    //       include: {
    //         QuestionsOption: true,
    //       },
    //     });
    //   }
    // } else {
    // const createdQuestion = await prisma.questionnaire.create({
    //   data: {
    //     question_text_primary,
    //     // question_text_secondary,
    //     questionType,
    //     is_active,
    //     kioskClientId,
    //   },
    // });
    // } else {
    //   createdQuestion = await prisma.questionnaire.create({
    //     data: {
    //       question_text_primary,
    //       question_text_secondary,
    //       questionType,
    //       is_active,
    //       kioskClientId,
    //     },
    //   });
    // }
    res.status(201).send({ createdQuestion });
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(ERRORS.INTERNAL_SERVER_ERROR));
  }
};

export const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId: kioskClientId, userType } = req.currentUser;
    const result = await paginationSchema.safeParseAsync(req.query);
    if (result.success === false) {
      logger.error(result.error);
      next(boom.badRequest(ERRORS.INVALID_REQUEST_PAYLOAD));
      return;
    }

    const { limit, offset } = result.data;

    if (userType === UserType.CLIENT) {
      const questionnaire = await prisma.questionnaire.findMany({
        where: {
          is_active: true,
          kioskClientId,
        },
        include: {
          KioskClient: true,
        },
        take: limit,
        skip: offset,
        orderBy: {
          created_at: 'asc',
        },
      });
      const finalResults = await Promise.all(
        questionnaire.map(async question => {
          if (question.questionType === 'Options') {
            const options = await prisma.questionsOption.findMany({
              where: {
                questionId: question.id,
              },
            });
            return { ...question, options };
          }
          return question;
        })
      );
      const record = await prisma.questionnaire.aggregate({
        where: {
          is_active: true,
          kioskClientId,
        },
        _count: {
          id: true,
        },
      });
      res.send({ questions: finalResults, count: record._count.id });
    } else {
      const questionnaire = await prisma.questionnaire.findMany({
        where: {
          is_active: true,
        },
        include: {
          KioskClient: true,
        },
        take: limit,
        skip: offset,
        orderBy: {
          created_at: 'asc',
        },
      });
      const finalResults = await Promise.all(
        questionnaire.map(async question => {
          if (question.questionType === 'Options') {
            const options = await prisma.questionsOption.findMany({
              where: {
                questionId: question.id,
              },
            });
            return { ...question, options };
          }
          return question;
        })
      );
      const record = await prisma.questionnaire.aggregate({
        where: {
          is_active: true,
        },
        _count: {
          id: true,
        },
      });
      res.send({ questions: finalResults, count: record._count.id });
    }
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(ERRORS.INTERNAL_SERVER_ERROR));
  }
};

export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId: kioskClientId } = req.currentUser;
    const result = await idSchema.safeParseAsync(req.params);

    if (result.success === false) {
      logger.error(result.error);
      next(boom.badRequest(ERRORS.INVALID_QUERY_PARAMETERS));
      return;
    }
    const { id: questionId } = result.data;
    const questionExist = await prisma.questionnaire.findFirst({
      where: {
        id: questionId,
        kioskClientId,
      },
    });

    if (!questionExist) {
      next(boom.badRequest('Question does not exist'));
      return;
    }
    const questionIdExist = await prisma.userAnswer.findFirst({
      where: {
        questionId,
      },
    });

    if (questionIdExist) {
      next(boom.conflict('question already in use'));
      return;
    }

    await prisma.questionnaire.update({
      where: {
        id: questionId,
      },
      data: {
        is_active: false,
      },
    });

    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(ERRORS.INTERNAL_SERVER_ERROR));
  }
};

export const editQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // console.log(req.body);
    const { userId: kioskClientId } = req.currentUser;
    const result = await editQuestionSchema.safeParseAsync(req.body);

    if (result.success === false) {
      logger.error(result.error);
      next(boom.badRequest(ERRORS.INVALID_REQUEST_PAYLOAD));
      return;
    }

    const results = await idSchema.safeParseAsync(req.params);

    if (results.success === false) {
      logger.error(results.error);
      next(boom.badRequest(ERRORS.INVALID_QUERY_PARAMETERS));
      return;
    }

    const { id: questionId } = results.data;

    const { question_text_primary, questionType } = result.data;

    const questionIdExist = await prisma.userAnswer.findFirst({
      where: {
        questionId,
      },
    });
    if (questionIdExist) {
      next(boom.conflict('Cannot edit the question as its already in use'));
      return;
    }
    const questionExist = await prisma.questionnaire.findFirst({
      where: {
        id: questionId,
      },
    });
    if (!questionExist) {
      next(boom.badRequest('Question does not exist'));
      return;
    }
    await prisma.questionnaire.delete({
      where: {
        id: questionId,
      },
    });
    const updatedQuestion = await prisma.questionnaire.create({
      data: {
        id: questionId,
        question_text_primary,
        questionType,
        is_active: true,
        kioskClientId,
      },
    });
    // let updatedQuestion;
    // if (questionType === 'Options') {
    //   if (options) {
    //     updatedQuestion = await prisma.questionnaire.create({
    //       data: {
    //         id: questionId,
    //         question_text_primary,
    //         question_text_secondary,
    //         is_active,
    //         questionType,
    //         QuestionsOption: {
    //           create: options.map(option => ({
    //             option_val_primary: option.option_val_primary,
    //             option_val_secondary: option.option_val_secondary,
    //           })),
    //         },
    //         kioskClientId,
    //       },
    //       include: {
    //         QuestionsOption: true,
    //       },
    //     });
    //   }
    // } else {
    //   updatedQuestion = await prisma.questionnaire.create({
    //     data: {
    //       id: questionId,
    //       question_text_primary,
    //       question_text_secondary,
    //       questionType,
    //       is_active,
    //       kioskClientId,
    //     },
    //   });
    // }
    res.status(201).send({ updatedQuestion });
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(ERRORS.INTERNAL_SERVER_ERROR));
  }
};

export const generateLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = generateId(10);

    if (!id) {
      throw new Error('Failed to generate an ID.');
    }

    // console.log(id);
    const expiryTime = new Date(Date.now() + 30 * 60 * 1000);
    // console.log(expiryTime);

    // console.log(new Date());

    const data = await prisma.link.create({
      data: {
        id,
        expiryTime,
      },
    });

    res.json({ id: data.id });
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(ERRORS.INTERNAL_SERVER_ERROR));
  }
};

export const validateLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await idSchema.safeParseAsync(req.params);
    if (results.success === false) {
      logger.error(results.error);
      next(boom.badRequest(ERRORS.INVALID_QUERY_PARAMETERS));
      return;
    }
    const { id } = results.data;

    const link = await prisma.link.findFirst({
      where: {
        id,
      },
    });
    // eslint-disable-next-line unicorn/prefer-date-now
    if (link && link.expiryTime.getTime() > new Date().getTime()) {
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(ERRORS.INTERNAL_SERVER_ERROR));
  }
};
export const getQuestionsAndAnswers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await prisma.user.findMany({
      include: {
        UserAnswer: {
          include: {
            questionId_fk: true,
            optionId_fk: true,
          },
        },
      },
    });

    const data = result.map(user => ({
      userId: user.id,
      userName: user.name,
      answers: user.UserAnswer.map(answer => ({
        questionId: answer.questionId_fk.id,
        questionTextPrimary: answer.questionId_fk.question_text_primary,
        // questionTextSecondary: answer.questionId_fk.question_text_secondary,
        answerType: answer.type,
        answerValue:
          answer.strVal ||
          answer.ratingVal ||
          (answer.optionId_fk && answer.optionId_fk.option_val_primary) ||
          // (answer.optionId_fk && answer.optionId_fk.option_val_primary && answer.optionId_fk?.option_val_secondary) ||
          // eslint-disable-next-line unicorn/no-null
          null,
      })),
    }));
    res.send({ data });
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(ERRORS.INTERNAL_SERVER_ERROR));
  }
};
