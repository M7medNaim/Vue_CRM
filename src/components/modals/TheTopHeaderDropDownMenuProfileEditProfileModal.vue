<template>
  <div
    class="modal fade"
    id="EditProfileModal"
    tabindex="-1"
    aria-labelledby="EditProfileModalLabel"
    aria-hidden="true"
    ref="EditProfileModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="EditProfileModalLabel">
            {{ t("modals.editProfile") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeEditProfile"
          ></button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body">
            <profile-form :name="name" :email="email" />
          </div>
          <profile-buttons :loading="loading" @close="closeEditProfile" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import ProfileForm from "@/components/editProfileElements/TheTopHeaderDropDownMenuProfileEditProfileModalFormItems.vue";
import ProfileButtons from "@/components/editProfileElements/TheTopHeaderDropDownMenuProfileEditProfileModalButtonsItems.vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
export default {
  name: "TheTopHeaderDropDownMenuProfileEditProfileModal",
  components: { ProfileForm, ProfileButtons },
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    return { toast, t };
  },
  data() {
    return {
      modalInstance: null,
      loading: false,
      name: "",
      email: "",
    };
  },
  methods: {
    openEditProfile() {
      try {
        const modal = this.$refs.EditProfileModal;
        this.modalInstance = new Modal(modal);
        this.modalInstance.show();
      } catch (error) {
        console.error("Error opening modal:", error);
        this.toast.error(this.t("error.closeModal"), {
          timeout: 3000,
          id: "edit-profile-error",
          singleton: true,
        });
      }
    },
    closeEditProfile() {
      try {
        const modal = this.$refs.EditProfileModal;
        const modalInstance = Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
          document.querySelector(".modal-backdrop")?.remove();
          document.body.classList.remove("modal-open");
        }
      } catch (error) {
        this.toast.error(this.t("error.closeModal"), {
          timeout: 3000,
          id: "edit-profile-close-error",
          singleton: true,
        });
      }
    },
    async submitForm() {
      try {
        this.loading = true;
        // هنا يتم إضافة المنطق الخاص بحفظ البيانات
        this.toast.success(this.t("success.updated"), {
          timeout: 3000,
          id: "edit-profile-success",
          singleton: true,
        });
        this.closeEditProfile();
      } catch (error) {
        console.error("Error submitting form:", error);
        this.toast.error(this.t("error.saveData"), {
          timeout: 3000,
          id: "edit-profile-submit-error",
          singleton: true,
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
