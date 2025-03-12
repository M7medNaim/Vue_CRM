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
            تعديل البروفايل
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
            <ProfileForm :name="name" :email="email" />
          </div>
          <ProfileButtons :loading="loading" @close="closeEditProfile" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import ProfileForm from "@/components/editProfileElements/ProfileForm.vue";
import ProfileButtons from "@/components/editProfileElements/ProfileButtons.vue";
import { useToast } from "vue-toastification";

export default {
  name: "EditProfile",
  components: { ProfileForm, ProfileButtons },
  setup() {
    const toast = useToast();
    return { toast };
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
        this.toast.info("يمكنك تعديل بيانات البروفايل الخاص بك", {
          timeout: 3000,
          id: "edit-profile-open",
          singleton: true,
        });
      } catch (error) {
        console.error("Error opening modal:", error);
        this.toast.error("حدث خطأ أثناء فتح نافذة التعديل", {
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
        this.toast.error("حدث خطأ أثناء إغلاق النافذة", {
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
        this.toast.success("تم تحديث البيانات بنجاح", {
          timeout: 3000,
          id: "edit-profile-success",
          singleton: true,
        });
        this.closeEditProfile();
      } catch (error) {
        console.error("Error submitting form:", error);
        this.toast.error("حدث خطأ أثناء حفظ البيانات", {
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
