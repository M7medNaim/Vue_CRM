<template>
  <div v-if="!isLoggedIn">
    <LoginView @loginSuccess="handleLoginSuccess" />
  </div>
  <div v-else class="app overflow-hidden">
    <div class="row">
      <div :class="sidebarClass">
        <LeftSidebar
          @toggle="handleSidebarToggle"
          @changeComponent="changeComponent"
        />
      </div>
      <div :class="headerClass">
        <TopHeader />
        <div class="content">
          <component :is="currentComponent" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopHeader from "@/components/headers/TopHeader.vue";
import LeftSidebar from "@/components/LeftSidebar.vue";
// import SuperAdmin from "@/components/EditAdmin.vue";
// import LoginComponent from "@/components/LoginComponent.vue";
import HomePage from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import users from "@/views/UsersView.vue";

export default {
  name: "HomePage",
  components: { TopHeader, LeftSidebar, users, HomePage, LoginView },
  data() {
    return {
      isLoggedIn: false,
      currentComponent: "users",
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
    changeComponent(componentName) {
      if (this.$options.components[componentName]) {
        this.currentComponent = componentName;
      } else {
        console.error(`Component "${componentName}" not found.`);
      }
    },
    handleLoginSuccess() {
      this.isLoggedIn = true;
      this.currentComponent = "users";
    },
    handleLogout() {
      this.isLoggedIn = false;
      this.$router.push("/login");
    },
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
