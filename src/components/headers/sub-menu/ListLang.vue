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

export default {
  name: "ListLang",
  setup() {
    const loadingStore = useLoadingStore();
    return { loadingStore };
  },
  methods: {
    async handleLanguageChange(lang) {
      try {
        this.loadingStore.startLoading();

        await changeLanguage(lang);

        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Error changing language:", error);
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
