/* eslint-disable unicorn/no-null */
import { z } from 'zod';

const numberString = z.string().regex(/^\d+$/).transform(Number);

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const kioskLoginSchema = z.object({
  email: z.string().min(6),
  password: z.string().min(6),
  serial_no: z.string(),
});

export const kioskRegistrationSchema = z.object({
  name: z.string(),
  address: z.object({
    state: z.string(),
    district: z.string(),
    pincode: z.string(),
  }),
  clientId: z.string(),
  // email: z.string().min(6),
  // password: z.string().min(6),
});

export const paginationSchema = z.object({
  q: z.string().optional(),
  limit: numberString,
  offset: numberString,
  created_at: z.date().optional(),
  status: z.enum(['Offline', 'Online']).optional(),
  sort: z.string().optional(),
  sortMode: z.enum(['desc', 'asc']).optional().default('asc'),
});

export const optionsSchema = z
  .object({
    primary: z.string(),
    secondary: z.string().optional().nullable().default(null),
  })
  .array()
  .optional();

export const questionSchema = z.object({
  question_text_primary: z.string().min(6),
  // question_text_secondary: z.string().min(6),
  // is_active: z.boolean().default(true),
  questionType: z.enum(['String', 'Options', 'Rating']).default('Rating'),
  // options: optionsSchema,
  // kioskClientId: z.string(),
});

export const editOptionsSchema = z
  .object({
    option_val_primary: z.string(),
    option_val_secondary: z.string().optional().nullable().default(null),
  })
  .array()
  .optional();

export const editQuestionSchema = z.object({
  question_text_primary: z.string().min(6),
  // question_text_secondary: z.string().min(6),
  // is_active: z.boolean().default(true),
  questionType: z.enum(['String', 'Options', 'Rating']).default('Rating'),
  // options: editOptionsSchema,
  // kioskClientId: z.string(),
});

export const answerSchema = z
  .object({
    questionId: z.string(),
    userId: z.string(),
    optionId: z.string().optional(),
    answerType: z.enum(['String', 'Options', 'Rating']),
    string_answer: z.string().optional(),
    rating_answer: z.number().min(1).max(10).optional(),
  })
  .array();

export const idSchema = z.object({
  id: z.string(),
});

export const questonIdSchema = z.object({
  id: z.string(),
  kioskClientId: z.string(),
});
export const kioskIdSchema = z.object({
  kioskId: z.string(),
});

export const kioskClientRegistrationSchema = z.object({
  linkId: z.string(),
  userName: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  address: z.object({
    state: z.string(),
    district: z.string(),
    pincode: z.string(),
  }),
  // phoneNumber: z.string().regex(/^(\+91|0)?[6-9]\d{9}$/, { message: 'Invalid mobile number ' }),
  phoneNumber: z.string().length(10).regex(/^\d+$/, { message: 'Invalid mobile number ' }),
  pan: z.string().length(10),
});

export const startStatisticsSchema = z.object({
  userId: z.string(),
  kioskId: z.string(),
});

export const endStatisticsSchema = z.object({
  statsId: z.string(),
});

export const userRegistrationSchema = z.object({
  name: z.string(),
  dob: z.coerce.date(),
  gender: z.enum(['male', 'female', 'others']),
  phoneNumber: z.string().length(10).regex(/^\d+$/, { message: 'Invalid mobile number ' }),
});
