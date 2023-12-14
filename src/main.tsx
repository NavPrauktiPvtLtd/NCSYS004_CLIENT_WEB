import * as ReactDOM from "react-dom/client";
import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MantineProvider, createEmotionCache } from "@mantine/core";
import Questionnaire from "./pages/auth/questionnaire";
import UserDetails from "./pages/auth/register-member";
import RegistrationComplete from "./pages/auth/registration-complete";

import Unauthorized from "./pages/unauthorized";
import { PageRoutes } from "../@types/index.";
import "@/styles/globals.css";
import Layout from "./components/layout/Layout";
import Home from "./pages";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

const router = createBrowserRouter([
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: PageRoutes.HOME,
    element: <Home />,
  },
  {
    path: PageRoutes.AUTH_USER_REGISTER_MEMEBER,
    element: <UserDetails />,
  },
  {
    path: PageRoutes.AUTH_USER_QUESTIONNAIRE,
    element: <Questionnaire />,
  },
  {
    path: PageRoutes.AUTH_USER_REGISTRATION_COMPLETE,
    element: <Questionnaire />,
  },
]);

const myCache = createEmotionCache({ key: "required", prepend: true });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider emotionCache={myCache} withGlobalStyles withNormalizeCSS>
      <I18nextProvider i18n={i18n}>
        <Layout>
          <RouterProvider router={router} />
        </Layout>
      </I18nextProvider>
    </MantineProvider>
  </React.StrictMode>
);
