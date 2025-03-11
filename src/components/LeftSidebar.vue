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
    <div class="sidebar-items overflow-auto">
      <div
        v-if="permissionStore.hasPermission(PERMISSIONS.DASHBOARD)"
        class="sidebar-item d-flex align-items-center p-2 my-2 ps-3"
        title="Dashboard"
      >
        <router-link to="/dashboard" class="text-decoration-none text-white">
          <i class="fa-solid fa-house fs-5 me-2"></i>
          <!-- <i class="fa-solid fa-chart-line"></i> -->
          <span v-if="!isCollapsed">Dashboard</span>
        </router-link>
      </div>
      <div
        v-if="permissionStore.hasPermission(PERMISSIONS.DEALS_KANBAN)"
        class="sidebar-item d-flex align-items-center p-2 my-2 ps-3"
        title="CRM Kanban"
      >
        <router-link to="/crm-kanban" class="text-decoration-none text-white">
          <i class="fa-solid fa-chart-column fs-5 me-2"></i>
          <span v-if="!isCollapsed">CRM Kanban</span>
        </router-link>
      </div>
      <router-link
        v-if="permissionStore.hasPermission(PERMISSIONS.DEALS_LIST)"
        to="/crmlist"
        class="text-decoration-none text-white"
      >
        <div
          class="sidebar-item d-flex align-items-center p-2 my-2 ps-3"
          title="CRM List"
        >
          <i class="fa-solid fa-table-list fs-5 me-2"></i>
          <span v-if="!isCollapsed">CRM List</span>
        </div>
      </router-link>
      <router-link
        v-if="permissionStore.hasPermission(PERMISSIONS.USERS)"
        to="/users"
        class="text-decoration-none text-white"
      >
        <div
          class="sidebar-item d-flex align-items-center p-2 my-2 ps-3"
          title="Users"
        >
          <i class="fa-solid fa-users fs-5 me-2"></i>
          <span v-if="!isCollapsed">Users</span>
        </div>
      </router-link>
      <router-link
        v-if="permissionStore.hasPermission(PERMISSIONS.CONTACTS)"
        to="/contacts"
        class="text-decoration-none text-white"
      >
        <div
          class="sidebar-item d-flex align-items-center p-2 my-2 ps-3"
          title="Contacts"
        >
          <i class="fa-regular fa-address-book fs-5 me-2"></i>
          <span v-if="!isCollapsed">Contacts</span>
        </div>
      </router-link>
      <router-link
        v-if="permissionStore.hasPermission(PERMISSIONS.DOCUMENTS)"
        to="/documents-folders"
        class="text-decoration-none text-white"
      >
        <div
          class="sidebar-item d-flex align-items-center p-2 my-2 ps-3"
          title="Documents"
        >
          <i class="fa-regular fa-folder-open fs-5 me-2"></i>
          <span v-if="!isCollapsed">Documents</span>
        </div>
      </router-link>
      <router-link
        v-if="permissionStore.hasPermission(PERMISSIONS.GENERAL_SETTINGS)"
        to="/general-setting"
        class="text-decoration-none text-white"
      >
        <div
          class="sidebar-item d-flex align-items-center p-2 my-2 ps-3"
          title="Settings"
        >
          <i class="fa-solid fa-cog fs-5 me-2"></i>
          <span v-if="!isCollapsed">Settings</span>
        </div>
      </router-link>
      <!-- <router-link
        v-if="permissionStore.hasPermission(PERMISSIONS.ROLES_SETTINGS)"
        to="/role-settings"
        class="text-decoration-none text-white"
      >
        <div
          class="sidebar-item d-flex align-items-center p-2 my-2 ps-3"
          title="Role Settings"
        >
          <i class="fa-solid fa-cogs fs-5 me-2"></i>
          <span v-if="!isCollapsed">Role Settings</span>
        </div>
      </router-link> -->

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
import { usePermissionStore, PERMISSIONS } from "@/stores/permissionStore";

export default {
  name: "LeftSidebar",
  emits: ["toggle"],
  setup(props, { emit }) {
    const isCollapsed = ref(true);
    const permissionStore = usePermissionStore();
    permissionStore.setPermissions([
      "dashboard",
      "deals-kanban",
      "deals-list",
      "users",
      // "contacts",
      "tasks-kanban",
      // "documents",
      "general-settings",
      "roles-settings",
    ]);

    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value;
      emit("toggle", isCollapsed.value);
    };

    return {
      isCollapsed,
      toggleSidebar,
      permissionStore,
      PERMISSIONS,
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
