<template>
  <div
    class="modal fade"
    id="changePasswordModal"
    tabindex="-1"
    aria-labelledby="changePasswordModalLabel"
    aria-hidden="true"
    ref="changePasswordModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="changePasswordModalLabel">
            تغيير كلمة المرور
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeChangePassword"
          ></button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body">
            <ChangePasswordForm v-model="password" />
          </div>
          <ChangePasswordButtons
            :loading="loading"
            @close="closeChangePassword"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import ChangePasswordForm from "@/components/changePasswordElements/ChangePasswordForm.vue";
import ChangePasswordButtons from "@/components/changePasswordElements/ChangePasswordButtons.vue";
import { ref } from "vue";

export default {
  name: "ChangePassword",
  components: { ChangePasswordForm, ChangePasswordButtons },
  setup() {
    const password = ref("");
    const loading = ref(false);

    const openChangePassword = () => {
      const modal = document.getElementById("changePasswordModal");
      const modalInstance = new Modal(modal);
      modalInstance.show();
    };

    const closeChangePassword = () => {
      const modal = document.getElementById("changePasswordModal");
      const modalInstance = Modal.getInstance(modal);
      if (modalInstance) modalInstance.hide();
      document.querySelector(".modal-backdrop")?.remove();
      document.body.classList.remove("modal-open");
    };

    // const submitForm = () => {
    // };

    return {
      password,
      loading,
      openChangePassword,
      closeChangePassword,
    };
  },
};
</script>
