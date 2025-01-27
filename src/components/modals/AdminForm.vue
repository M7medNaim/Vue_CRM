<template>
  <div
    class="modal fade"
    id="adminModal"
    tabindex="-1"
    aria-labelledby="adminModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="adminModalLabel">إضافة مستخدم جديد</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label for="username" class="form-label">اسم المستخدم</label>
              <input
                type="text"
                class="form-control"
                id="username"
                v-model="formData.username"
                required
              />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">البريد الإلكتروني</label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="formData.email"
                required
              />
            </div>
            <div class="mb-3">
              <label for="image" class="form-label">الصورة</label>
              <input
                type="file"
                class="form-control"
                id="image"
                @change="handleImageUpload"
                accept="image/*"
              />
            </div>
            <div class="btns d-flex justify-content-between align-items-center">
              <button type="submit" class="btn btn-primary">
                إضافة المستخدم
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeModal"
              >
                اغلاق
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";

export default {
  name: "AdminModal",
  data() {
    return {
      formData: {
        username: "",
        email: "",
        image: null,
      },
    };
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.formData.image = file;
      } else {
        this.formData.image = null;
      }
    },
    submitForm() {
      const userData = {
        username: this.formData.username,
        email: this.formData.email,
        image: this.formData.image,
        status: "inactive",
        emailVerified: false,
      };
      this.$emit("add-user", userData);
      this.clearForm();
      this.closeModal();
    },
    clearForm() {
      this.formData.username = "";
      this.formData.email = "";
      this.formData.image = null;
    },
    closeModal() {
      const modal = document.getElementById("adminModal");

      const modalInstance = Modal.getInstance(modal);

      if (modalInstance) {
        modalInstance.hide();
      }

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.remove();
      }

      document.body.classList.remove("modal-open");
      document.body.style.paddingRight = "";
    },
  },
};
</script>
