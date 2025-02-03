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

export default {
  name: "EditProfile",
  components: { ProfileForm, ProfileButtons },
  methods: {
    openEditProfile() {
      const modal = this.$refs.EditProfileModal;
      this.modalInstance = new Modal(modal);
      this.modalInstance.show();
    },
    closeEditProfile() {
      const modal = this.$refs.EditProfileModal;
      const modalInstance = Modal.getInstance(modal);
      if (modalInstance) modalInstance.hide();
      document.querySelector(".modal-backdrop")?.remove();
      document.body.classList.remove("modal-open");
    },
  },
};
</script>
