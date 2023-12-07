export enum TestStatus {
  START_NOW = "START NOW",
  TRY_AGAIN = "TRY AGAIN",
  PROCESSING = "PROCESSING",
  DONE = "DONE",
}

export enum GENDER {
  MALE = "male",
  FEMALE = "female",
  OTHERS = "others",
}

export interface User {
  id: string;
  patient_id: string;
  firstname: string;
  lastname: string;
  dob: string;
  gender: GENDER;
  email: string;
  createdAt: Date;
  phone_number: string;
}

export enum Health_Test {
  TEMPERATURE = "TEMPERATURE",
}

export enum PageRoutes {
  HOME = "/",
  SYSTEM_ADMIN_LOGIN = "/system-admin/login",
  SYSTEM_ADMIN_HOME = "/system-admin",
  SYSTEM_ADMIN_CALI_WEIGHT = "/system-admin/cali/weight",
  SYSTEM_ADMIN_CALI_HEIGHT = "/system-admin/cali/height",
  AUTH_USER_LOGIN = "/auth/login",
  AUTH_USER_SELECT_MEMBER = "/auth/select-member",
  AUTH_USER_REGISTER_MEMEBER = "/auth/register-member",
  AUTH_USER_QUESTIONNAIRE = "/auth/questionnaire",
  AUTH_USER_REGISTRATION_COMPLETE = "/auth/registration-complete",
  TEST_START = "/test/",
  TEST_TEMPERATURE = "/test/temperature",
  TEST_TEMPERATURE_INSTRUCTION = "/test/temperature/instruction",
}

export enum QuestionType {
  OPTIONS = "Options",
  STRING = "String",
}

export interface Options {
  id: string;
  optionVal: string;
}

export type Questions =
  | {
      id: string;
      question: string;
      is_active: boolean;
      questionType: QuestionType.STRING;
    }
  | {
      id: string;
      question: string;
      is_active: boolean;
      questionType: QuestionType.OPTIONS;
      options: Options[];
    };

export type QuestionnaireAnswers =
  | {
      questionId: string;
      userId: string;
      optionIds: string[];
      answerType: QuestionType.OPTIONS;
    }
  | {
      questionId: string;
      userId: string;
      answerType: QuestionType.STRING;
      string_answer: string;
    };
