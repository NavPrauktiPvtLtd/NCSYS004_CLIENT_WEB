export enum GENDER {
  MALE = 'male',
  FEMALE = 'female',
  OTHERS = 'others',
}

export interface User {
  id: string | null;
  name: string;
  dob: string;
  gender: GENDER;
  createdAt: Date;
  phoneNumber: string;
}

export enum PageRoutes {
  HOME = '/',
  AUTH_USER_REGISTER_MEMEBER = '/register-member',
  AUTH_USER_QUESTIONNAIRE = '/questionnaire',
  AUTH_USER_REGISTRATION_COMPLETE = '/feedback-complete',
}

export enum QuestionType {
  OPTIONS = 'Options',
  STRING = 'String',
  Rating = 'Rating',
}

export interface Options {
  id: string;
  questionId: string;
  created_at: Date;
  option_val_primary: string;
  option_val_secondary: string;
}

export type Questions = {
  id: string;
  is_active: boolean;
  question_text_primary: string;
  question_text_secondary: string;
  questionType: QuestionType.Rating;
  kioskClientId: string;
};

export type QuestionnaireAnswers = {
  questionId: string;
  userId: string | null;
  answerType: QuestionType.Rating;
  rating_answer: number;
};
// | {
//     questionId: string;
//     userId: string;
//     optionId: string;
//     answerType: QuestionType.OPTIONS;
//   }
// | {
//     questionId: string;
//     userId: string;
//     answerType: QuestionType.STRING;
//     string_answer: string;
//   };
