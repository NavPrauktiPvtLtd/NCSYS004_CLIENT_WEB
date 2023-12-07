import * as ReactDOM from "react-dom/client";
import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MantineProvider, createEmotionCache } from "@mantine/core";
import Phone from "./pages/auth/login";
import Questionnaire from "./pages/auth/questionnaire";
import UserDetails from "./pages/auth/register-member";
import RegistrationComplete from "./pages/auth/registration-complete";
import UserType from "./pages/auth/select-member";
import HeightCalibration from "./pages/system-admin/cali/height";
import WeightCalibration from "./pages/system-admin/cali/weight";
import SystemAdminPanel from "./pages/system-admin/index";
import SystemAdminAuthenticate from "./pages/system-admin/login";
import WeightHeightMeasure from "./pages/test/bmi/index";
import WeightInstruction from "./pages/test/bmi/instruction";
import Ecg from "./pages/test/ecg/index";
import Ecgsteps from "./pages/test/ecg/instruction";
import Nibp from "./pages/test/nibp/index";
import NibpInstruction from "./pages/test/nibp/instruction";
import Oximeter from "./pages/test/spo2/index";
import Spo2Instruction from "./pages/test/spo2/instruction";
import Stress from "./pages/test/stress/index";
import Temperature from "./pages/test/temperature/index";
import StressInstruction from "./pages/test/stress/instruction";
import TemperatureInstruction from "./pages/test/temperature/instruction";
import StartTest from "./pages/test/index";
import Home from "./pages/index";
import Page404 from "./pages/404";
import ErrorPage500 from "./pages/500";
import FinalReport from "./pages/final-report";
import Report from "./pages/report";
import Unauthorized from "./pages/unauthorized";
import { PageRoutes } from "../@types/index.";
import "@/styles/globals.css";
import Layout from "./components/layout/Layout";

const router = createBrowserRouter([
  {
    path: PageRoutes.GENERATED_REPORT,
    element: <FinalReport />,
  },
  {
    path: "/report",
    element: <Report />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/page-500",
    element: <ErrorPage500 />,
  },
  {
    path: "/page-404",
    element: <Page404 />,
  },
  {
    path: PageRoutes.HOME,
    element: <Home />,
  },
  {
    path: PageRoutes.TEST_START,
    element: <StartTest />,
  },
  {
    path: PageRoutes.AUTH_USER_LOGIN,
    element: <Phone />,
  },
  {
    path: PageRoutes.AUTH_USER_QUESTIONNAIRE,
    element: <Questionnaire />,
  },
  {
    path: PageRoutes.AUTH_USER_REGISTER_MEMEBER,
    element: <UserDetails />,
  },
  {
    path: PageRoutes.AUTH_USER_REGISTRATION_COMPLETE,
    element: <RegistrationComplete />,
  },
  {
    path: PageRoutes.AUTH_USER_SELECT_MEMBER,
    element: <UserType />,
  },
  {
    path: PageRoutes.SYSTEM_ADMIN_CALI_HEIGHT,
    element: <HeightCalibration />,
  },
  {
    path: PageRoutes.SYSTEM_ADMIN_CALI_WEIGHT,
    element: <WeightCalibration />,
  },
  {
    path: PageRoutes.SYSTEM_ADMIN_HOME,
    element: <SystemAdminPanel />,
  },
  {
    path: PageRoutes.SYSTEM_ADMIN_LOGIN,
    element: <SystemAdminAuthenticate />,
  },
  {
    path: PageRoutes.TEST_BMI,
    element: <WeightHeightMeasure />,
  },
  {
    path: PageRoutes.TEST_BMI_INSTRUCTION,
    element: <WeightInstruction />,
  },
  {
    path: PageRoutes.TEST_ECG,
    element: <Ecg />,
  },
  {
    path: PageRoutes.TEST_ECG_INSTRUCTION,
    element: <Ecgsteps />,
  },
  {
    path: PageRoutes.TEST_NIBP,
    element: <Nibp />,
  },
  {
    path: PageRoutes.TEST_NIBP_INSTRUCTION,
    element: <NibpInstruction />,
  },
  {
    path: PageRoutes.TEST_SPO2,
    element: <Oximeter />,
  },
  {
    path: PageRoutes.TEST_SPO2_INSTRUCTION,
    element: <Spo2Instruction />,
  },
  {
    path: PageRoutes.TEST_STRESS,
    element: <Stress />,
  },
  {
    path: PageRoutes.TEST_STRESS_INSTRUCTION,
    element: <StressInstruction />,
  },
  {
    path: PageRoutes.TEST_TEMPERATURE,
    element: <Temperature />,
  },
  {
    path: PageRoutes.TEST_TEMPERATURE_INSTRUCTION,
    element: <TemperatureInstruction />,
  }
]);
 
const myCache = createEmotionCache({ key: "required", prepend: true });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider emotionCache={myCache} withGlobalStyles withNormalizeCSS>
    <Layout>
      <RouterProvider router={router} />
    </Layout>
    </MantineProvider>
  </React.StrictMode>
);
