import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import settingsEs from "./locales/es/settings.json";
import buttonsES from "./locales/es/buttons.json";
import generalEs from "./locales/es/general.json";
import emptyStateEs from "./locales/es/emptyState.json";

import settingsEn from "./locales/en/settings.json";
import buttonsEn from "./locales/en/buttons.json";
import generalEn from "./locales/en/general.json";
import emptyStateEn from "./locales/en/emptyState.json";

import settingsIt from "./locales/it/settings.json";
import buttonsIt from "./locales/it/buttons.json";
import generalIt from "./locales/it/general.json";
import emptyStateIt from "./locales/it/emptyState.json";

// i18n global configuration
i18n.use(initReactI18next).init({
  resources: {
    es: {
      settings: settingsEs,
      buttons: buttonsES,
      general: generalEs,
      emptyState: emptyStateEs,
    },
    en: {
      settings: settingsEn,
      buttons: buttonsEn,
      general: generalEn,
      emptyState: emptyStateEn,
    },
    it: {
      settings: settingsIt,
      buttons: buttonsIt,
      general: generalIt,
      emptyState: emptyStateIt,
    },
  },

  lng: "es",
  fallbackLng: "es",
  ns: ["settings", "buttons", "general", "emptyState"],
  defaultNS: "settings",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
