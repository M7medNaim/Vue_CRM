import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import UsersView from "../views/UsersView.vue";
import CrmListView from "@/views/CrmListView.vue";
import ContactsView from "@/views/ContactsView.vue";
import GeneralSetting from "@/views/GeneralSetting.vue";
import RoleSettings from "@/views/RoleSettings.vue";
import DocumentsFolder from "@/views/DocumentsFolderView.vue";
import DocumentsFiles from "@/views/FolderFilesView.vue";
import Cookies from "js-cookie";
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
  },
  {
    path: "/home",
    name: "home",
    component: HomeView,
    meta: {
      requiresAuth: true,
      title: "الرئيسية",
    },
  },
  {
    path: "/users",
    name: "UsersView",
    component: UsersView,
    meta: {
      requiresAuth: true,
      title: "المستخدمين",
    },
  },
  {
    path: "/crmlist",
    name: "CrmListView",
    component: CrmListView,
    meta: {
      requiresAuth: true,
      title: "Crm List",
    },
  },
  {
    path: "/contacts",
    name: "ContactsView",
    component: ContactsView,
    meta: {
      requiresAuth: true,
      title: "Contact Us",
    },
  },
  {
    path: "/general-setting",
    name: "GeneralSetting",
    component: GeneralSetting,
    meta: {
      requiresAuth: true,
      title: "General Setting",
    },
  },
  {
    path: "/role-settings",
    name: "RoleSettings",
    component: RoleSettings,
    meta: {
      requiresAuth: true,
      title: "Role Settings",
    },
  },
  {
    path: "/role-settings",
    name: "RoleSettings",
    component: RoleSettings,
    meta: {
      requiresAuth: true,
      title: "Role Settings",
    },
  },
  {
    path: "/documents-folders",
    name: "DocumentsFolder",
    component: DocumentsFolder,
    meta: {
      requiresAuth: true,
      title: "Documents Folder",
    },
  },
  {
    path: "/folders/:folderId/files",
    name: "FolderFiles",
    component: DocumentsFiles,
    meta: {
      requiresAuth: true,
      title: "Documents Files",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const token = Cookies.get("authToken");
  const isAuthRoute = to.matched.some((record) => record.meta.requiresAuth);
  if (isAuthRoute && !token) {
    next({ path: "/login" });
  } else if (to.path === "/login" && token) {
    next({ path: "/home" });
  } else {
    next();
  }
});

export default router;
