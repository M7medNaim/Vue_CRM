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
import { useToast } from "vue-toastification";

export default {
  name: "ChangePassword",
  components: { ChangePasswordForm, ChangePasswordButtons },
  setup() {
    const toast = useToast();
    const password = ref("");
    const loading = ref(false);

    const openChangePassword = () => {
      try {
        const modal = document.getElementById("changePasswordModal");
        const modalInstance = new Modal(modal);
        modalInstance.show();
        toast.info("يمكنك تغيير كلمة المرور الخاصة بك", {
          timeout: 3000,
          id: "change-password-open",
          singleton: true,
        });
      } catch (error) {
        toast.error("حدث خطأ أثناء فتح نافذة تغيير كلمة المرور", {
          timeout: 3000,
          id: "change-password-error",
          singleton: true,
        });
      }
    };

    const closeChangePassword = () => {
      try {
        const modal = document.getElementById("changePasswordModal");
        const modalInstance = Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
          document.querySelector(".modal-backdrop")?.remove();
          document.body.classList.remove("modal-open");
          password.value = "";
        }
      } catch (error) {
        toast.error("حدث خطأ أثناء إغلاق النافذة", {
          timeout: 3000,
          id: "change-password-close-error",
          singleton: true,
        });
      }
    };

    const submitForm = async () => {
      try {
        loading.value = true;
        if (!password.value) {
          toast.error("الرجاء إدخال كلمة المرور الجديدة", {
            timeout: 3000,
            id: "change-password-validation",
            singleton: true,
          });
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast.success("تم تغيير كلمة المرور بنجاح", {
          timeout: 3000,
          id: "change-password-success",
          singleton: true,
        });
        closeChangePassword();
      } catch (error) {
        toast.error("حدث خطأ أثناء تغيير كلمة المرور", {
          timeout: 3000,
          id: "change-password-submit-error",
          singleton: true,
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      password,
      loading,
      openChangePassword,
      closeChangePassword,
      submitForm,
    };
  },
};
</script>
