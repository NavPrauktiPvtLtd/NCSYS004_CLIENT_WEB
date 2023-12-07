import { User } from "../@types/index.";
import { PhoneFormData, SystemAdminLoginData } from "../validation/index";
import { ServerAxiosInstance } from "./config";
import { Questions } from "../@types/index.";
import { QuestionnaireAnswers } from "../@types/index.";

interface OtpData {
  otp: string;
  token: string;
}

interface AdminLogin extends SystemAdminLoginData {
  serial_no: string;
}

interface StartTestSessionResponse {
  id: string;
}
class ServerAPI {
  static adminLogin = async (data: AdminLogin) => {
    return ServerAxiosInstance.post("/kiosk-admin/auth/login", data);
  };

  static requestOTP = async (data: PhoneFormData) => {
    return ServerAxiosInstance.post<{ token: string }>(
      "/auth/request-otp",
      data
    );
  };

  static submitTestReport = async (accessToken: string, data: FormData) => {
    return ServerAxiosInstance.post("/user/generate-report", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  static verifyOTP = async (data: OtpData) => {
    return ServerAxiosInstance.post<{ accessToken: string }>(
      "/auth/verify-otp",
      data
    );
  };

  static createUser = async (accessToken: string, data: unknown) => {
    return ServerAxiosInstance.post<{ user: User }>("/user/create-new", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  static getUsers = async (accessToken: string) => {
    return ServerAxiosInstance.get<{ users: User[] }>("/user/list", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  static getQuestionList = async () => {
    return ServerAxiosInstance.get<{ questions: Questions[] }>(
      "/user/question-list"
    );
  };

  static postQuestionnaireAnswers = async (data: QuestionnaireAnswers[]) => {
    return ServerAxiosInstance.post("/user/answers", data);
  };

  static startTestSession = async ({
    userId,
    kioskId,
  }: {
    userId: string | null;
    kioskId: string | null;
  }): Promise<StartTestSessionResponse> => {
    const response = await ServerAxiosInstance.post("/stats/start-test", {
      userId,
      kioskId,
    });
    return response.data;
  };

  static endTestSession = async ({
    statsId,
    reportId,
  }: {
    statsId: string | null;
    reportId: string | null;
  }) => {
    return ServerAxiosInstance.patch("/stats/end-test", { statsId, reportId });
  };
}

export default ServerAPI;
