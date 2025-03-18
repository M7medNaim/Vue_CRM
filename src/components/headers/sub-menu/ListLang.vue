<template>
  <div class="dropdown-menu my-2 d-block border-0 position-absolute">
    <ul class="list-unstyled mb-0 lh-lg">
      <li>
        <a class="dropdown-item ps-3" @click="changeLanguage('en')">
          <span class="dropdown-icon me-4 text-secondary flageImage">
            <img src="@/assets/flag-usa.png" alt="English" />
          </span>
          <span>English</span>
        </a>
      </li>
      <li>
        <a class="dropdown-item ps-3" @click="changeLanguage('ar')">
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

export default {
  name: "ListLang",
  methods: {
    changeLanguage(lang) {
      try {
        changeLanguage(lang);
      } catch (error) {
        console.error("Error changing language:", error);
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
