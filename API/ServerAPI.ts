import { User } from "../@types/index.";
import { PhoneFormData, SystemAdminLoginData } from "../validation/index";
import { ServerAxiosInstance } from "./config";
import { Questions } from "../@types/index.";
import { QuestionnaireAnswers } from "../@types/index.";

interface AdminLogin extends SystemAdminLoginData {
  serial_no: string;
}

interface StartTestSessionResponse {
  id: string;
}
class ServerAPI {
  static getSerialNumber = async () => {
    return ServerAxiosInstance.get<{ serialNumber: string }>("/serial-number");
  };

  static adminLogin = async (data: AdminLogin) => {
    return ServerAxiosInstance.post("/kiosk-admin/auth/login", data);
  };

  static createUser = async (data: unknown) => {
    return ServerAxiosInstance.post<{ user: User }>("/user/create-new", data);
  };

  static getQuestionList = async (kioskId: string) => {
    return ServerAxiosInstance.get<{ questions: Questions[] }>(
      `/user/question-list?kioskId=${kioskId}`
    );
  };

  static postQuestionnaireAnswers = async (
    data: QuestionnaireAnswers[],
    kioskId: string
  ) => {
    return ServerAxiosInstance.post(`/user/answers?kioskId=${kioskId}`, data);
  };

  static startTestSession = async ({
    userId,
    kioskId,
  }: {
    userId: string | null;
    kioskId: string | null;
  }): Promise<StartTestSessionResponse> => {
    const response = await ServerAxiosInstance.post("/stats/start-session", {
      userId,
      kioskId,
    });
    return response.data;
  };

  static endTestSession = async ({ statsId }: { statsId: string | null }) => {
    return ServerAxiosInstance.patch(`/stats/end-session?statsId=${statsId}`);
  };
}

export default ServerAPI;
