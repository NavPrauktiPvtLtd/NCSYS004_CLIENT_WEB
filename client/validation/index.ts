import { z } from 'zod';
import { GENDER } from '../@types/index.';

export const userDetailsFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(50, { message: 'Name can not exceed 50 characters' }),
  dob: z.string(),
  gender: z.enum([GENDER.MALE, GENDER.FEMALE, GENDER.OTHERS]),
  phoneNumber: z
    .string()
    .length(10, { message: 'The number must contain exactly 10 digits' })
    .regex(/^\d+$/, { message: 'Invalid mobile number ' }),
  department: z.string(),
});

export type UserFormData = z.infer<typeof userDetailsFormSchema>;

export const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .length(10, { message: 'The number must contain exactly 10 digits' })
    .regex(/^\d+$/, { message: 'Invalid mobile number ' }),
});

export type PhoneFormData = z.infer<typeof phoneSchema>;

export const systemAdminLoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string(),
});

export type SystemAdminLoginData = z.infer<typeof systemAdminLoginSchema>;
