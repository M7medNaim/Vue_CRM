import { createI18n } from "vue-i18n";
import { getTranslations } from "@/plugins/services/authService";

// إنشاء i18n مع messages فارغة
const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("locale") || "en",
  fallbackLocale: "en",
  messages: {
    en: {},
    ar: {},
  },
  globalInjection: true,
});

async function loadTranslationsFromAPI(locale) {
  try {
    // جلب الترجمات من API مباشرة بدون التحقق من localStorage
    const response = await getTranslations(locale);

    if (response.data && response.data.translations) {
      const translations = response.data.translations;

      // تحديث الترجمات في i18n
      i18n.global.setLocaleMessage(locale, translations);
      return translations;
    }
  } catch (error) {
    console.error("Error loading translations:", error);
    return null;
  }
}

export async function changeLanguage(locale) {
  try {
    await loadTranslationsFromAPI(locale);
    i18n.global.locale.value = locale;
    localStorage.setItem("locale", locale);
    document.documentElement.lang = locale;
  } catch (error) {
    console.error("Error changing language:", error);
  }
}

export const initializeTranslations = loadTranslationsFromAPI;

export default i18n;
