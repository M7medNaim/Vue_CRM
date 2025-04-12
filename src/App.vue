<template>
  <div class="" @contextmenu.prevent="closeAllModals">
    <Loader
      :is-loading="loadingStore.isLoading"
      :loader-image="loaderImage"
      :loader-color="loaderColor"
    />

    <div v-if="!isLoggedIn">
      <LoginView @loginSuccess="handleLoginSuccess" />
    </div>

    <div v-else class="app overflow-hidden">
      <div v-if="!$route.meta.hideNavigation" class="row g-0 flex-nowrap">
        <div
          :class="['sidebar', sidebarClass, isSidebarCollapsed]"
          v-if="!hideSidebar"
        >
          <LeftSidebar @toggle="handleSidebarToggle" />
        </div>

        <div :class="headerClass">
          <TopHeader @logout="handleLogout" />
          <div class="content">
            <router-view />
          </div>
        </div>
      </div>

      <div v-else>
        <router-view />
      </div>

      <!-- شريط الإعلانات -->
      <NewsBar v-if="showNewsBar" />
    </div>
  </div>
</template>

<script>
// import { ref, onMounted } from "vue";
import axiosInstance from "@/plugins/axios";
import TopHeader from "@/components/headers/TopHeader.vue";
import LeftSidebar from "@/components/LeftSidebar.vue";
import LoginView from "@/views/LoginView.vue";
import Cookies from "js-cookie";
import Loader from "@/components/LoaderComponent.vue";
import NewsBar from "@/components/NewsBar.vue";
import { useLoadingStore } from "@/plugins/loadingStore";
import { logout, getBackgroundId } from "@/plugins/services/authService";
import { requirePermission } from "./router/guards";

export default {
  name: "App",
  components: { TopHeader, LeftSidebar, LoginView, Loader, NewsBar },

  setup() {
    const loadingStore = useLoadingStore();
    return {
      loadingStore,
    };
  },

  data() {
    return {
      loaderImage: "/images/new-nokta-logo.png",
      loaderColor: "#9e2929",
      isLoggedIn: false,
      isSidebarCollapsed: true,
    };
  },

  computed: {
    sidebarClass() {
      // return this.isSidebarCollapsed ? "col-1" : "col-2";
      if (this.isSidebarCollapsed) {
        return "col-auto";
      }
      return "col-sm-3 col-lg-auto";
    },
    headerClass() {
      // return this.isSidebarCollapsed ? "col-11" : "col-10";
      if (this.isSidebarCollapsed) {
        return "col";
      }
      return "col-sm-9 col-lg";
    },
    showNewsBar() {
      return (
        this.$route.path === "/crm-kanban" || this.$route.path === "/crm-tasks"
      );
    },

    hideSidebar() {
      return requirePermission("read-navigations");
    },
  },

  methods: {
    handleSidebarToggle(isCollapsed) {
      this.isSidebarCollapsed = isCollapsed;
    },

    handleLoginSuccess() {
      this.isLoggedIn = true;
      this.$router.push("/crm-kanban");
    },

    async handleLogout() {
      await logout();
      Cookies.remove("authToken");
      Cookies.remove("name");
      Cookies.remove("image");
      Cookies.remove("email");
      Cookies.remove("user_role");
      Cookies.remove("user_id");
      localStorage.removeItem("backgroundImage");
      localStorage.removeItem("locale");
      localStorage.removeItem("userPermissions");
      this.isLoggedIn = false;
      delete axiosInstance.defaults.headers["Authorization"];
      this.$router.push("/login");
    },

    async loadSavedBackground() {
      try {
        let response = await getBackgroundId(Cookies.get("background_id"));
        if (!response) {
          console.error("No background image found");
          return;
        }
        const savedImage = response.data.data.url;
        document.body.style.backgroundImage = `url(${savedImage})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
      } catch (error) {
        console.error("Error loading background image:", error);
      }
    },

    checkAuthStatus() {
      const token = Cookies.get("authToken");
      this.isLoggedIn = !!token;

      if (!token && this.$route.path !== "/login") {
        this.$router.push("/login");
      } else if (token && this.$route.path === "/login") {
        this.$router.push("/dashboard");
      }
    },
    closeAllModals() {
      this.$root.$emit("close-all-modals");
    },
  },
  mounted() {
    this.loadSavedBackground();
    this.checkAuthStatus();
  },
  watch: {
    $route() {
      this.checkAuthStatus();
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: "Alexandria", "Poppins", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
