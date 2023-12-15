import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import * as enTranslations from "./src/assets/translations/en.json";
import * as asTranslations from "./src/assets/translations/as.json";

const resources = {
  en: {
    translation: enTranslations,
  },
  as: {
    translation: asTranslations,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
