import { createI18n } from "vue-i18n";
import en from "./locales/en";
import ar from "./locales/ar";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("locale") || "en",
  fallbackLocale: "en",
  messages: {
    en,
    ar,
  },
  globalInjection: true,
});

export default i18n;

export function changeLanguage(locale) {
  i18n.global.locale.value = locale;
  localStorage.setItem("locale", locale);
  document.documentElement.lang = locale;

  window.location.reload();
}
