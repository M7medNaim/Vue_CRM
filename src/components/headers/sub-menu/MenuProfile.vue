<template>
  <div class="dropdown-menu my-2 position-absolute d-block end-0 border-0">
    <div
      class="image my-2 d-flex justify-content-start align-items-center w-100 p-2"
    >
      <div class="profileImage me-2 border border-2 rounded-5">
        <img
          :src="userImage || require('@/assets/default-user-image.jpg')"
          class="img-fluid rounded-5"
          alt="profile image"
        />
      </div>
      <div class="data">
        <span class="">{{ name }}</span
        ><br />
        <span class="text-secondary">{{ userEmail }}</span>
      </div>
    </div>
    <hr />
    <ul class="list-unstyled mb-0 lh-lg">
      <li>
        <a class="dropdown-item ps-3">
          <span class="dropdown-icon me-4 text-secondary">
            <i class="fa-solid fa-user"></i>
          </span>
          <span>Edit Profile</span>
        </a>
      </li>
      <li>
        <a class="dropdown-item ps-3">
          <span class="dropdown-icon me-4 text-secondary">
            <i class="fa-solid fa-calendar-days"></i>
          </span>
          <span>Calender</span></a
        >
      </li>
      <li>
        <button type="button" class="btn btn-primary dropdown-item">
          <span class="dropdown-icon me-4 text-secondary">
            <i class="fa-solid fa-image"></i>
          </span>
          <span>Customize Background</span>
        </button>
      </li>
      <li>
        <button type="button" class="btn btn-primary dropdown-item">
          <span class="dropdown-icon me-4 text-secondary">
            <i class="fa-solid fa-rotate"></i>
          </span>
          <span>Reload</span>
        </button>
      </li>
      <li>
        <button type="button" class="btn btn-primary dropdown-item">
          <span class="dropdown-icon me-4 text-secondary">
            <i class="fa-solid fa-lock"></i>
          </span>
          <span>Change Password</span>
        </button>
      </li>
      <li>
        <button type="button" class="btn btn-primary dropdown-item">
          <span class="dropdown-icon me-4 text-secondary">
            <i class="fa-solid fa-globe"></i>
          </span>
          <span>Change Language</span>
        </button>
      </li>
      <li @click="handleLogout">
        <a class="dropdown-item ps-3">
          <span class="dropdown-icon me-4 text-secondary">
            <i class="fa-solid fa-right-from-bracket ps-1"></i>
          </span>
          <span>Logout</span></a
        >
      </li>
    </ul>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import axiosInstance from "@/plugins/axios";

export default {
  name: "MenuProfile",
  data() {
    return {
      name: Cookies.get("name") || "User",
      userEmail: Cookies.get("email") || "test@email",
      userImage: Cookies.get("image") || "",
    };
  },
  methods: {
    async handleLogout() {
      try {
        Cookies.remove("authToken");
        Cookies.remove("name");
        Cookies.remove("image");
        Cookies.remove("email");

        delete axiosInstance.defaults.headers["Authorization"];

        this.$emit("logout");
        this.$router.push("/login");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    },
  },
};
</script>
<style scoped>
.dropdown-menu {
  width: fit-content !important;
}
.profileImage img {
  width: 55px;
  height: 55px;
}
.dropdown-item {
  cursor: pointer;
}
</style>
