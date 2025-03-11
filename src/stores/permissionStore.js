import { defineStore } from "pinia";

export const PERMISSIONS = {
  DASHBOARD: "dashboard",
  DEALS_KANBAN: "deals-kanban",
  DEALS_LIST: "deals-list",
  USERS: "users",
  CONTACTS: "contacts",
  DOCUMENTS: "documents",
  GENERAL_SETTINGS: "general-settings",
  TASKS_KANBAN: "tasks-kanban",
  ROLES_SETTINGS: "roles-settings",
};

export const usePermissionStore = defineStore("permissions", {
  state: () => ({
    userPermissions: JSON.parse(localStorage.getItem("userPermissions")) || [],
  }),

  getters: {
    hasPermission: (state) => (permission) => {
      return state.userPermissions.includes(permission);
    },

    hasAnyPermission: (state) => (permissions) => {
      return permissions.some((permission) =>
        state.userPermissions.includes(permission)
      );
    },
  },

  actions: {
    setPermissions(permissions) {
      this.userPermissions = permissions;
      localStorage.setItem("userPermissions", JSON.stringify(permissions));
    },

    addPermission(permission) {
      if (!this.userPermissions.includes(permission)) {
        this.userPermissions.push(permission);
        localStorage.setItem(
          "userPermissions",
          JSON.stringify(this.userPermissions)
        );
      }
    },

    removePermission(permission) {
      this.userPermissions = this.userPermissions.filter(
        (p) => p !== permission
      );
      localStorage.setItem(
        "userPermissions",
        JSON.stringify(this.userPermissions)
      );
    },

    clearPermissions() {
      this.userPermissions = [];
      localStorage.removeItem("userPermissions");
    },
  },
});
