<template>
  <div v-if="!isLoggedIn">
    <LoginView @loginSuccess="handleLoginSuccess" />
  </div>
  <div v-else class="app overflow-hidden">
    <div class="row">
      <div :class="sidebarClass">
        <LeftSidebar @toggle="handleSidebarToggle" />
      </div>

      <div :class="headerClass">
        <TopHeader />
        <div class="content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopHeader from "@/components/headers/TopHeader.vue";
import LeftSidebar from "@/components/LeftSidebar.vue";
import LoginView from "@/views/LoginView.vue";

export default {
  name: "HomePage",
  components: { TopHeader, LeftSidebar, LoginView },
  data() {
    return {
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
  },
  mounted() {
    this.loadSavedBackground();
  },
};
</script>

<style lang="scss">
#app {
  font-family: "Poppins", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
