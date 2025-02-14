<template>
  <Loader
    :is-loading="loadingStore.isLoading"
    :loader-image="loaderImage"
    :loader-color="loaderColor"
  />

  <div v-if="!isLoggedIn">
    <LoginView @loginSuccess="handleLoginSuccess" />
  </div>

  <div v-else-if="!$route.meta.hideNavigation" class="app overflow-hidden">
    <div class="row">
      <div :class="sidebarClass">
        <LeftSidebar @toggle="handleSidebarToggle" />
      </div>

      <div :class="headerClass">
        <TopHeader @logout="handleLogout" />
        <div class="content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { ref, onMounted } from "vue";
import TopHeader from "@/components/headers/TopHeader.vue";
import LeftSidebar from "@/components/LeftSidebar.vue";
import LoginView from "@/views/LoginView.vue";
import Cookies from "js-cookie";
import Loader from "@/components/LoaderComponent.vue";
import { useLoadingStore } from "@/plugins/loadingStore";

export default {
  name: "App",
  components: { TopHeader, LeftSidebar, LoginView, Loader },

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
      return this.isSidebarCollapsed ? "col-1" : "col-2";
    },
    headerClass() {
      return this.isSidebarCollapsed ? "col-11" : "col-10";
    },
  },

  methods: {
    handleSidebarToggle(isCollapsed) {
      this.isSidebarCollapsed = isCollapsed;
    },

    handleLoginSuccess() {
      this.isLoggedIn = true;
      this.$router.push("/home");
    },

    handleLogout() {
      Cookies.remove("authToken");
      Cookies.remove("name");
      Cookies.remove("image");
      Cookies.remove("email");
      this.isLoggedIn = false;
      this.$router.push("/login");
    },

    loadSavedBackground() {
      const savedImage = localStorage.getItem("backgroundImage");
      if (savedImage) {
        document.body.style.backgroundImage = `url(${savedImage})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
      }
    },

    checkAuthStatus() {
      const token = Cookies.get("authToken");
      this.isLoggedIn = !!token;

      if (!token && this.$route.path !== "/login") {
        this.$router.push("/login");
      } else if (token && this.$route.path === "/login") {
        this.$router.push("/home");
      }
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
