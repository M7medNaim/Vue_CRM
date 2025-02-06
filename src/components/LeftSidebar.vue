<template>
  <div
    class="sidebar vh-100 overflow-hidden text-white"
    :class="{ 'sidebar-collapsed': isCollapsed }"
  >
    <div class="d-flex justify-content-start align-items-center p-2">
      <div class="imgLogo me-2">
        <img
          src="@/assets/new-nokta-logo.png"
          style="width: 50px; height: 50px"
          alt=""
        />
      </div>
      <span class="fw-bold" v-if="!isCollapsed">CRM Staging</span>
    </div>
    <!-- <transition name="scale">
      <div
        v-if="!isCollapsed"
        class="searchInput d-flex justify-content-center align-items-center p-2"
      >
        <form action="" class="position-relative">
          <i
            class="fa-solid fa-search me-2 position-absolute text-secondary"
          ></i>
          <input
            type="text"
            placeholder="Search"
            class="rounded-1 border-0 p-2 ps-4 fs-6"
            style="width: 230px; height: 40px; outline: none"
          />
        </form>
      </div>
    </transition> -->
    <div class="sidebar-items overflow-auto">
      <div
        class="sidebar-item d-flex align-items-center p-2 my-2 ps-3"
        title="Dashboard"
      >
        <router-link to="/home" class="text-decoration-none text-white">
          <i class="fa-solid fa-house fs-5 me-2"></i>
          <!-- <i class="fa-solid fa-chart-line"></i> -->
          <span v-if="!isCollapsed">Dashboard</span>
        </router-link>
      </div>
      <div
        class="sidebar-item d-flex align-items-center p-2 my-2 ps-3"
        title="CRM Board"
      >
        <router-link to="/users" class="text-decoration-none text-white">
          <i class="fa-solid fa-chart-column fs-5 me-2"></i>
          <span v-if="!isCollapsed">CRM Board </span>
        </router-link>
      </div>
      <div
        class="sidebar-item d-flex align-items-center p-2 my-2 ps-3"
        title="CRM List"
      >
        <router-link to="/crmlist" class="text-decoration-none text-white">
          <i class="fa-solid fa-table-list fs-5 me-2"></i>
          <span v-if="!isCollapsed">CRM List </span>
        </router-link>
      </div>
      <div
        class="sidebar-item d-flex align-items-center p-2 my-2 ps-3"
        title="Users"
      >
        <router-link to="/users" class="text-decoration-none text-white">
          <i class="fa-solid fa-users fs-5 me-2"></i>
          <span v-if="!isCollapsed">Users</span>
        </router-link>
      </div>
      <div
        class="sidebar-item d-flex align-items-center p-2 my-2 ps-3"
        title="Contacts"
      >
        <router-link to="/users" class="text-decoration-none text-white">
          <i class="fa-regular fa-address-book fs-5 me-2"></i>
          <span v-if="!isCollapsed">Contacts</span>
        </router-link>
      </div>
      <div
        class="sidebar-item d-flex align-items-center p-2 my-2 ps-3"
        title="Settings"
      >
        <i class="fa-solid fa-cog fs-5 me-2"></i>
        <span v-if="!isCollapsed">Settings</span>
      </div>
      <div
        class="sidebar-item d-flex justify-content-start align-items-center p-2 my-2 toggle-icon border-0 text-center fs-6 ps-3"
        @click="toggleSidebar"
        title="Toggle Menu"
      >
        <i class="fa-solid fa-bars fs-5 me-2"></i>
        <span v-if="!isCollapsed">Toggle Menu</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "LeftSidebar",
  emits: ["toggle"],
  setup(props, { emit }) {
    const isCollapsed = ref(true);

    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value;
      emit("toggle", isCollapsed.value);
    };

    return {
      isCollapsed,
      toggleSidebar,
    };
  },
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  transition: width 0.3s ease;
}

.sidebar-collapsed {
  width: 70px;
}

.toggle-icon {
  cursor: pointer;
}

.sidebar-items {
  height: calc(100vh - 130px);
  padding: 8px;
}

.sidebar-item {
  cursor: pointer;
  transition: background-color 0.3s ease;
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
}

.sidebar-item:hover {
  background-color: #34495e;
}

.sidebar-item span {
  white-space: nowrap;
  font-size: 14px;
}
/*
.searchInput form i {
  top: 32%;
  left: 2%;
  font-size: 14px;
}
.searchInput form input:focus {
  box-shadow: 10px 10px 10px #605e5e80;
}
  */

.scale-enter-active {
  transition: all 0.4s ease;
}

.scale-enter-from,
.scale-leave-to {
  width: 30px;
  opacity: 0;
}

.scale-enter-to,
.scale-leave-from {
  opacity: 1;
}
/* scroll style */
.sidebar .sidebar-items::-webkit-scrollbar {
  width: 5px;
}

.sidebar .sidebar-items::-webkit-scrollbar-thumb {
  background: #c2c0c0a7;
  border-radius: 8px;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  -ms-border-radius: 8px;
  -o-border-radius: 8px;
}
</style>
