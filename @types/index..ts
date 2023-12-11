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
  AUTH_USER_REGISTER_MEMEBER = "/auth/register-member",
  AUTH_USER_QUESTIONNAIRE = "/auth/questionnaire",
  AUTH_USER_REGISTRATION_COMPLETE = "/auth/registration-complete",
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
