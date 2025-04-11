<template>
  <div class="dropdown-menu my-2 position-absolute d-block end-0 border-0">
    <div
      class="image my-2 d-flex justify-content-start align-items-center w-100 p-2 px-1"
    >
      <div class="profileImage me-1 border border-2 rounded-5">
        <img
          :src="userImage || require('@/assets/default-user-image.jpg')"
          class="img-fluid rounded-5"
          alt="profile image"
        />
      </div>
      <div class="data">
        <span class="">{{ name }}</span
        ><br />
        <span class="text-secondary userEmail">{{ userEmail }}</span>
      </div>
    </div>
    <hr />
    <ul class="list-unstyled mb-0 lh-lg">
      <ProfileMenuItem
        icon="fa-user"
        :title="t('header-user-menu-item-profile')"
        @click="openEditProfileModal"
      />
      <ProfileMenuItem
        icon="fa-calendar-days"
        :title="t('header-user-menu-item-calendar')"
        @click="openCalenderModal"
      />
      <ProfileMenuItem
        icon="fa-image"
        :title="t('header-user-menu-item-background')"
        @click="changeBackground"
      />
      <ProfileMenuItem
        icon="fa-rotate"
        :title="t('header-reload')"
        @click="reloadPage"
      />
      <ProfileMenuItem
        icon="fa-lock"
        :title="t('header-user-menu-item-password')"
        @click="openChangePasswordModal"
      />
      <ProfileMenuItem
        icon="fa-globe"
        :title="t('header-user-menu-item-language')"
        @click="openChangeLangModal"
      />
      <ProfileMenuItem
        icon="fa-right-from-bracket"
        :title="t('header-user-menu-item-logout')"
        @click="handleLogout"
      />
    </ul>
  </div>
  <EditProfile ref="editProfileModal" />
  <ChangePassword ref="changePasswordModal" />
  <ChangeLang ref="changeLangModal" />
  <CalenderModal ref="CalenderModal" />
  <CustomBackground />
</template>
<script>
import Cookies from "js-cookie";
import axiosInstance from "@/plugins/axios";
import ProfileMenuItem from "@/components/headers/sub-menu/profileMenuItems/ProfileMenuItem.vue";
import EditProfile from "@/components/modals/EditProfile.vue";
import ChangePassword from "@/components/modals/ChangePassword.vue";
import ChangeLang from "@/components/modals/ChangeLang.vue";
import CalenderModal from "@/components/modals/CalenderModal.vue";
import CustomBackground from "@/components/headers/sub-menu/profileMenuItems/CustmBackground.vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { Modal } from "bootstrap";
import { logout } from "@/plugins/services/authService";

export default {
  name: "MenuProfile",
  components: {
    ProfileMenuItem,
    EditProfile,
    ChangePassword,
    ChangeLang,
    CalenderModal,
    CustomBackground,
  },
  setup() {
    const toast = useToast();
    const { t } = useI18n();
    return { toast, t };
  },
  data() {
    return {
      name: Cookies.get("name") || "User",
      userEmail: Cookies.get("email") || "test@email",
      userImage: Cookies.get("image") || "",
      images: [
        "/images/bg1.jpg",
        "/images/bg2.jpg",
        "/images/bg3.jpg",
        "/images/bg4.jpg",
        "/images/bg5.jpg",
        "/images/bg6.jpg",
        "/images/bg7.jpg",
        "/images/bg8.jpg",
        "/images/bg9.jpg",
        "/images/bg10.jpg",
        "/images/bg11.jpg",
        "/images/bg12.jpg",
      ],
    };
  },
  methods: {
    async handleLogout() {
      try {
        Cookies.remove("authToken");
        Cookies.remove("name");
        Cookies.remove("image");
        Cookies.remove("email");
        Cookies.remove("user_role");
        Cookies.remove("user_id");

        delete axiosInstance.defaults.headers["Authorization"];
        await logout();
        this.$emit("logout");
        this.$router.push("/login");
      } catch (error) {
        console.error("Error logging out:", error);
        this.toast.error(this.t("topHeader.logoutError"), {
          timeout: 3000,
        });
      }
    },
    changeBackground() {
      const modal = new Modal(document.getElementById("customBackgroundModal"));
      modal.show();
    },
    openEditProfileModal() {
      this.$refs.editProfileModal.openEditProfile();
    },
    openChangePasswordModal() {
      this.$refs.changePasswordModal.openChangePassword();
    },
    openChangeLangModal() {
      this.$refs.changeLangModal.openChangeLang();
    },
    openCalenderModal() {
      this.$refs.CalenderModal.openCalenderModal();
    },
    reloadPage() {
      location.reload();
    },
  },
};
</script>
<style scoped>
.dropdown-menu {
  top: 40px;
  left: -90px;
  width: fit-content !important;
}
.profileImage img {
  min-width: 45px;
  width: 45px;
  min-height: 45px;
  height: 45px;
}
.dropdown-item {
  cursor: pointer;
}
.userEmail {
  font-size: 14px;
}
@media (max-width: 900px) {
  .userEmail {
    font-size: 12px;
  }
  .profileImage img {
    min-width: 45px;
    width: 45px;
    min-height: 45px;
    height: 45px;
  }
}
</style>
