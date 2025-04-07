<template>
  <div class="dropdown-menu my-2 d-block border-0 position-absolute">
    <ul class="list-unstyled mb-0 lh-lg">
      <li>
        <a class="dropdown-item ps-3" @click="handleLanguageChange('en')">
          <span class="dropdown-icon me-4 text-secondary flageImage">
            <img src="@/assets/flag-usa.png" alt="English" />
          </span>
          <span>English</span>
        </a>
      </li>
      <li>
        <a class="dropdown-item ps-3" @click="handleLanguageChange('ar')">
          <span class="dropdown-icon me-4 text-secondary flageImage">
            <img src="@/assets/Flag_of_Saudi_Arabia.svg" alt="العربية" />
          </span>
          <span>العربية</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { changeLanguage } from "@/i18n";
import { useLoadingStore } from "@/plugins/loadingStore";
import { saveUserLanguage } from "@/plugins/services/authService";

export default {
  name: "ListLang",
  setup() {
    const loadingStore = useLoadingStore();
    return { loadingStore };
  },
  methods: {
    async handleLanguageChange(lang) {
      if (lang === localStorage.getItem("locale")) {
        this.toast.info("تم تحديد هذه اللغة بالفعل!", { timeout: 2000 });
        return;
      }

      try {
        this.loadingStore.startLoading();

        await changeLanguage(lang);

        const response = await saveUserLanguage(lang);
        if (response.status === 200) {
          localStorage.setItem("locale", lang);

          this.toast.success("تم تغيير اللغة بنجاح!", { timeout: 3000 });
        } else {
          throw new Error("فشل حفظ اللغة في API");
        }
      } catch (error) {
        console.error("Error changing language:", error);
        this.toast.error("حدث خطأ أثناء حفظ اللغة!", { timeout: 3000 });
      } finally {
        this.loadingStore.stopLoading();
      }
    },
  },
};
</script>

<style scoped>
.dropdown-menu {
  top: 35px;
  left: 0;
  width: fit-content !important;
  z-index: 1000 !important;
}
.flageImage img {
  width: 30px;
  height: 20px;
}
</style>
