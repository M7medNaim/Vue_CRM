<template>
  <div v-if="!isLoggedIn">
    <LoginComponent @loginSuccess="handleLoginSuccess" />
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
import LoginComponent from "@/components/LoginComponent.vue";
import TopHeader from "@/components/headers/TopHeader.vue";
import LeftSidebar from "@/components/LeftSidebar.vue";
import SuperAdmin from "@/components/EditAdmin.vue";
import HomePage from "@/views/HomeView.vue";

export default {
  name: "HomePage",
  components: { TopHeader, LeftSidebar, SuperAdmin, HomePage, LoginComponent },
  data() {
    return {
      isLoggedIn: false,
      currentComponent: "SuperAdmin",
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
      this.currentComponent = "SuperAdmin";
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
