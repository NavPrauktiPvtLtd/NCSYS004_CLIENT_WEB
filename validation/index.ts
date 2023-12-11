import { z } from "zod";
import { GENDER } from "../@types/index.";

export const userDetailsFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "name must be at least 3 characters long" })
    .max(20, { message: "name can not exceed 20 characters" }),
  dob: z.date(),
  gender: z.enum([GENDER.MALE, GENDER.FEMALE, GENDER.OTHERS]),
  phoneNumber: z
    .string()
    .regex(/^(\+91|0)?[6789]\d{9}$/, { message: "Invalid mobile number " }),
});

export type UserFormData = z.infer<typeof userDetailsFormSchema>;

export const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^(\+91|0)?[6789]\d{9}$/, { message: "Invalid mobile number " }),
});

export type PhoneFormData = z.infer<typeof phoneSchema>;

export const systemAdminLoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});

export type SystemAdminLoginData = z.infer<typeof systemAdminLoginSchema>;
