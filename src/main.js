import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import Swal from "sweetalert2";
import i18n from "./i18n";
import { getTranslations } from "./plugins/services/authService";

// تعريف toastOptions خارج then و catch
const toastOptions = {
  position: "top-left",
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  ltr: true,
};

Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success mx-2",
    cancelButton: "btn btn-danger",
  },
  buttonsStyling: false,
  reverseButtons: true,
});

// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@/assets/global.css";

// Create Vue app
const app = createApp(App);

// Create and use Pinia
const pinia = createPinia();
app.use(pinia);

// تحميل الترجمات قبل تثبيت التطبيق
const currentLocale = localStorage.getItem("locale") || "en";

// تحميل الترجمات من API
getTranslations(currentLocale)
  .then((response) => {
    if (response.data && response.data.translations) {
      // تحديث الترجمات في i18n
      i18n.global.setLocaleMessage(currentLocale, response.data.translations);
    }
    // تثبيت التطبيق
    app.use(store);
    app.use(router);
    app.use(i18n);
    app.use(Toast, toastOptions);
    app.mount("#app");
  })
  .catch((error) => {
    console.error("Failed to load translations:", error);
    // تثبيت التطبيق حتى في حالة فشل تحميل الترجمات
    app.use(store);
    app.use(router);
    app.use(i18n);
    app.use(Toast, toastOptions);
    app.mount("#app");
  });
