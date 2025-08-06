import { createRouter, createWebHistory } from "vue-router";
import { requireGuest, requirePermission } from "@/router/guards";
import { PERMISSIONS } from "@/stores/permissionStore";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import UsersView from "@/views/UsersView.vue";
import ContactsView from "@/views/ContactsView.vue";
import GeneralSettingView from "@/views/GeneralSettingView.vue";
import RoleSettingsView from "@/views/RoleSettingsView.vue";
import DocumentsFolderView from "@/views/DocumentsFolderView.vue";
import FolderFilesView from "@/views/FolderFilesView.vue";
import CrmDealKanbanView from "@/views/CrmDealKanbanView.vue";
import Cookies from "js-cookie";
import CrmDealTasksView from "@/views/CrmDealTasksView.vue";
import CrmListView from "@/views/CrmListView.vue";
// import TasksKanban from "@/views/CrmDealTasksView.vue";
import BroadcastSettingsView from "@/views/BroadcastSettingsView.vue";
import StagingSettingView from "@/views/StagingSettingView.vue";
import WebWhatsapp from "@/views/WebWhatsapp.vue";
import PatientRegistrationView from "@/views/PatientRegistrationView.vue";
import ApprovalsView from "@/views/ApprovalsView.vue";
import EmrDealKanbanView from "@/views/EmrDealKanbanView.vue";
import AfterSalesDealKanbanView from "@/views/AfterSalesDealKanbanView.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "LoginView",
    component: LoginView,
    meta: {
      requiresAuth: false,
      hideNavigation: true,
    },
    beforeEnter: requireGuest(),
  },
  // {
  //   path: "/unauthorized",
  //   name: "Unauthorized",
  //   component: Unauthorized,
  //   meta: {
  //     requiresAuth: false,
  //     hideNavigation: true,
  //     title: "غير مصرح",
  //   },
  // },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: HomeView,
    meta: {
      requiresAuth: true,
      title: "Dashboard",
      titleKey: "sidebar-nav-item-dashboard",
    },
    beforeEnter: requirePermission(PERMISSIONS.DASHBOARD),
  },
  {
    path: "/crm-kanban",
    name: "CrmDealKanbanView",
    component: CrmDealKanbanView,
    meta: {
      requiresAuth: true,
      title: "CRM Kanban",
      titleKey: "sidebar-nav-item-kanban",
    },
    beforeEnter: requirePermission(PERMISSIONS.DEALS_KANBAN),
  },
  {
    path: "/approvals",
    name: "ApprovalsView",
    component: ApprovalsView,
    meta: {
      requiresAuth: true,
      title: "Approvals",
      titleKey: "sidebar-nav-item-approvals",
    },
    // beforeEnter: requirePermission(PERMISSIONS.DEALS_KANBAN),
  },
  {
    path: "/crm-tasks",
    name: "CrmDealTasksView",
    component: CrmDealTasksView,
    meta: {
      requiresAuth: true,
      title: "CRM Tasks",
      titleKey: "header-subnav-item-kanban-tasks",
    },
    beforeEnter: requirePermission(PERMISSIONS.TASKS_KANBAN),
  },
  {
    path: "/emr-kanban",
    name: "EmrDealKanbanView",
    component: EmrDealKanbanView,
    meta: {
      requiresAuth: true,
      title: "EMR Kanban",
    },
    beforeEnter: requirePermission(PERMISSIONS.ROLES_SETTINGS),
  },
  {
    path: "/after-sales-kanban",
    name: "AfterSalesDealKanbanView",
    component: AfterSalesDealKanbanView,
    meta: {
      requiresAuth: true,
      title: "After Sales Kanban",
    },
    beforeEnter: requirePermission(PERMISSIONS.ROLES_SETTINGS),
  },
  {
    path: "/users",
    name: "UsersView",
    component: UsersView,
    meta: {
      requiresAuth: true,
      title: "Users",
      titleKey: "sidebar-nav-item-users",
    },
    beforeEnter: requirePermission(PERMISSIONS.USERS),
  },
  {
    path: "/crmlist",
    name: "CrmListView",
    component: CrmListView,
    meta: {
      requiresAuth: true,
      title: "CRM List",
      titleKey: "sidebar-nav-item-crmlist",
    },
    beforeEnter: requirePermission(PERMISSIONS.DEALS_LIST),
  },
  {
    path: "/contacts",
    name: "ContactsView",
    component: ContactsView,
    meta: {
      requiresAuth: true,
      title: "Contacts",
      titleKey: "sidebar-nav-item-contacts",
    },
    beforeEnter: requirePermission(PERMISSIONS.CONTACTS),
  },
  {
    path: "/general-settings",
    name: "GeneralSettingView",
    component: GeneralSettingView,
    meta: {
      requiresAuth: true,
      title: "General Settings",
      titleKey: "sidebar-nav-item-settings",
    },
    beforeEnter: requirePermission(PERMISSIONS.GENERAL_SETTINGS),
  },
  {
    path: "/stage-settings",
    name: "StagingSettingView",
    component: StagingSettingView,
    meta: {
      requiresAuth: true,
      title: "Stage Settings",
      titleKey: "sidebar-nav-item-stage-settings",
    },
    beforeEnter: requirePermission(PERMISSIONS.GENERAL_SETTINGS),
  },
  {
    path: "/role-settings",
    name: "RoleSettingsView",
    component: RoleSettingsView,
    meta: {
      requiresAuth: true,
      title: "Role Settings",
    },
    beforeEnter: requirePermission(PERMISSIONS.ROLES_SETTINGS),
  },
  {
    path: "/broadcast-settings",
    name: "BroadcastSettingsView",
    component: BroadcastSettingsView,
    meta: {
      requiresAuth: true,
      title: "Broadcast Settings",
    },
    beforeEnter: requirePermission(PERMISSIONS.ROLES_SETTINGS),
  },
  {
    path: "/patient-registration",
    name: "PatientRegistrationView",
    component: PatientRegistrationView,
    meta: {
      requiresAuth: true,
      title: "Patient Registration",
    },
    beforeEnter: requirePermission(PERMISSIONS.ROLES_SETTINGS),
  },
  {
    path: "/documents",
    name: "DocumentsFolderView",
    component: DocumentsFolderView,
    meta: {
      requiresAuth: true,
      title: "Documents",
      titleKey: "sidebar-nav-item-documents",
    },
    beforeEnter: requirePermission(PERMISSIONS.DOCUMENTS),
  },
  {
    path: "/documents/:folderName+",
    name: "FolderFilesView",
    component: FolderFilesView,
    meta: {
      requiresAuth: true,
      title: "Documents Files",
    },
    beforeEnter: requirePermission(PERMISSIONS.DOCUMENTS),
  },
  // {
  //   path: "/tasks-kanban",
  //   component: TasksKanban,
  //   beforeEnter: requirePermission(PERMISSIONS.TASKS_KANBAN),
  // },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/crm-kanban",
  },
  {
    path: "/WebWhatsapp",
    name: "webwhatsapp",
    component: WebWhatsapp,
    meta: {
      requiresAuth: true,
      title: "Web Whatsapp",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const token = Cookies.get("authToken");
  const isAuthRoute = to.matched.some(
    (record) => record.meta.requiresAuth !== false
  );

  if (isAuthRoute && !token) {
    const redirectPath = to.fullPath;
    next({
      path: "/login",
      query: { redirect: redirectPath },
      replace: true,
    });
    return;
  }

  if (to.path === "/login" && token) {
    next({ path: "/crm-kanban", replace: true });
    return;
  }

  next();
});

export default router;
