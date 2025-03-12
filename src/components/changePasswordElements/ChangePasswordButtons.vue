<template>
  <div
    class="modal-footer btns d-flex justify-content-between align-items-center"
  >
    <button type="submit" class="btn btn-primary" :disabled="loading">
      <span v-if="loading">
        <i class="fas fa-spinner fa-spin"></i> جاري التحديث...
      </span>
      <span v-else>تأكيد</span>
    </button>

    <button
      type="button"
      class="btn btn-secondary"
      @click="handleClose"
      data-bs-dismiss="modal"
    >
      إغلاق
    </button>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useToast } from "vue-toastification";

export default {
  name: "ChangePasswordButtons",
  props: ["loading"],
  emits: ["close"],
  setup(props, { emit }) {
    const toast = useToast();

    const handleClose = () => {
      try {
        const modal = document.getElementById("changePasswordModal");
        const modalInstance = Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
          document.querySelector(".modal-backdrop")?.remove();
          document.body.classList.remove("modal-open");
          emit("close");
        }
      } catch (error) {
        toast.error("حدث خطأ أثناء إغلاق النافذة", {
          timeout: 3000,
        });
      }
    };

    return {
      handleClose,
    };
  },
};
</script>
