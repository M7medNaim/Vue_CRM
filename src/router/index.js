import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import UsersView from "../views/UsersView.vue";
import CrmListView from "@/views/CrmListView.vue";
import ContactsView from "@/views/ContactsView.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/home",
    name: "home",
    component: HomeView,
    meta: { title: "الرئيسية" },
  },
  {
    path: "/login",
    name: "LoginView",
    component: LoginView,
  },
  {
    path: "/users",
    name: "UsersView",
    component: UsersView,
    meta: { title: "المستخدمين" },
  },
  {
    path: "/crmlist",
    name: "CrmListView",
    component: CrmListView,
    meta: { title: "Crm List" },
  },
  {
    path: "/contacts",
    name: "ContactsView",
    component: ContactsView,
    meta: { title: "Contact Us" },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
