<template>
  <div
    class="modal fade"
    id="editModal"
    tabindex="-1"
    aria-labelledby="editModalLabel"
    aria-hidden="true"
    ref="editModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editModalLabel">تعديل المستخدم</h5>
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
                حفظ التعديلات
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
  name: "EditModal",
  data() {
    return {
      formData: {
        id: null,
        username: "",
        email: "",
        image: null,
      },
    };
  },
  methods: {
    // handleImageUpload(event) {
    //   const file = event.target.files[0];
    //   if (file) {
    //     this.formData.image = file;
    //   } else {
    //     this.formData.image = null;
    //   }
    // },
    // submitForm() {
    //   const updatedUser = {
    //     id: this.formData.id,
    //     username: this.formData.name,
    //     email: this.formData.email,
    //     image: this.formData.image,
    //   };
    //   this.$emit("update-user", updatedUser);
    //   this.clearForm();
    //   this.closeModal();
    // },
    // clearForm() {
    //   this.formData = {
    //     id: null,
    //     username: "",
    //     email: "",
    //     image: null,
    //   };
    // },
    closeModal() {
      const modal = this.$refs.editModal;
      const modalInstance = Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    },
    // openModal(item) {
    //   this.formData = { ...item };
    //   const modal = this.$refs.editModal;
    //   const modalInstance = new Modal(modal);
    //   modalInstance.show();
    // },
  },
};
</script>
