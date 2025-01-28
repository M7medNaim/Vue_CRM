<template>
  <div class="top-bar pe-1 position-relative">
    <div class="row">
      <div class="col-4 d-flex align-items-center">
        <span class="">CRM Staging</span>
      </div>
      <div class="col-4 d-flex justify-content-center align-items-center g-3">
        <span class="fs-2 text-body-secondary">{{ currentTime }}</span>
        <button
          class="border-0 bg-transparent"
          ref="notifiButton"
          @click="toggleMenu('notifications', $refs.notifiButton)"
        >
          <i class="fa-solid fa-bell fs-4 ms-2 pt-1 text-secondary"></i>
        </button>
      </div>
      <div class="col-4 d-flex justify-content-end align-items-center">
        <div class="user-info d-flex justify-content-end align-items-center">
          <div class="lang">
            <button
              class="border-0 bg-transparent d-flex align-items-center justify-content-end gap-1 text-body-secondary"
              ref="langButton"
              @click="toggleMenu('lang', $refs.langButton)"
            >
              <i class="fa-solid fa-globe"></i>
              <span class="fs-6">English</span>
              <i class="fa-solid fa-chevron-down"></i>
            </button>
          </div>

          <div
            class="profile d-flex justify-content-end align-items-center ps-3"
          >
            <div class="userImg">
              <img
                src="../../assets/new-nokta-logo.png"
                class="img-fluid user-img rounded-5"
                alt="user image"
              />
            </div>
            <button
              type="button"
              class="border-0 bg-transparent"
              ref="profileButton"
              @click="toggleMenu('profile', $refs.profileButton)"
            >
              <span class="me-1">{{ name }}</span>
              <i class="fa-solid fa-chevron-down"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <ListLang v-if="activeMenu === 'lang'" :style="listLangStyle" />
    </transition>
    <transition name="fade">
      <MenuProfile v-if="activeMenu === 'profile'" :style="listProfileStyle" />
    </transition>
    <transition name="fade">
      <NotificationsHead
        v-if="activeMenu === 'notifications'"
        :style="listNotifiStyle"
      />
    </transition>
  </div>
</template>

<script>
import ListLang from "@/components/headers/sub-menu/ListLang.vue";
import MenuProfile from "@/components/headers/sub-menu/MenuProfile.vue";
import NotificationsHead from "@/components/headers/sub-menu/NotificationsHead.vue";
import Cookies from "js-cookie";
import { ref, onMounted, onBeforeUnmount } from "vue";

export default {
  name: "HeaderComponent",
  components: {
    ListLang,
    MenuProfile,
    NotificationsHead,
  },
  data() {
    return {
      activeMenu: null,
      listLangStyle: {},
      listProfileStyle: {},
      listNotifiStyle: {},
      name: Cookies.get("name") || "User",
    };
  },
  setup() {
    const currentTime = ref("");

    const updateTime = () => {
      const now = new Date();

      const utcHours = now.getUTCHours();
      const utcMinutes = now.getUTCMinutes();
      const utcSeconds = now.getUTCSeconds();

      const turkeyHours = (utcHours + 3) % 24;
      const ampm = turkeyHours >= 12 ? "PM" : "AM";
      const formattedHours = turkeyHours % 12 || 12;

      currentTime.value = `${formattedHours}:${String(utcMinutes).padStart(
        2,
        "0"
      )}:${String(utcSeconds).padStart(2, "0")} ${ampm}`;
    };

    let interval;

    onMounted(() => {
      updateTime();
      interval = setInterval(updateTime, 1000);
    });

    onBeforeUnmount(() => {
      clearInterval(interval);
    });

    return {
      currentTime,
    };
  },
  methods: {
    toggleMenu(menu, buttonRef) {
      if (this.activeMenu === menu) {
        this.activeMenu = null;
      } else {
        this.activeMenu = menu;
        this.calculatePosition(buttonRef);
      }
    },
    calculatePosition(buttonRef) {
      if (buttonRef) {
        const rect = buttonRef.getBoundingClientRect();
        if (this.activeMenu === "lang") {
          this.listLangStyle = {
            top: `${rect.bottom + 10}px`,
            left: `${rect.left - 130}px`,
          };
        } else if (this.activeMenu === "profile") {
          this.listProfileStyle = {
            top: `${rect.bottom + 10}px`,
            left: `${rect.left - 285}px`,
          };
        } else if (this.activeMenu === "notifications") {
          this.listNotifiStyle = {
            top: `${rect.bottom + 10}px`,
            left: `${rect.left}px`,
          };
        }
      }
    },
    handleClickOutside(event) {
      if (
        this.activeMenu &&
        !this.$refs.langButton?.contains(event.target) &&
        !this.$refs.profileButton?.contains(event.target) &&
        !this.$refs.notifiButton?.contains(event.target)
      ) {
        this.activeMenu = null;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>
<style scoped>
.logo-img {
  height: 60px;
}
.user-img {
  height: 40px;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
