<template>
  <div
    class="modal fade"
    id="adminModal"
    tabindex="-1"
    aria-labelledby="adminModalLabel"
    aria-hidden="true"
    ref="adminModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="adminModalLabel">
            {{ isEditMode ? "تعديل المستخدم" : "إضافة مستخدم جديد" }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body">
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

            <div v-if="!isEditMode" class="mb-3">
              <label for="password" class="form-label">كلمة المرور</label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="formData.password"
                required
              />
            </div>
            <div v-if="!isEditMode" class="mb-3">
              <label for="password_confirmation" class="form-label"
                >تأكيد كلمة المرور</label
              >
              <input
                type="password"
                class="form-control"
                id="password_confirmation"
                v-model="formData.password_confirmation"
                required
              />
            </div>

            <div class="mb-3">
              <label for="role" class="form-label">الدور</label>
              <select
                class="form-control"
                id="role"
                v-model="formData.role"
                required
              >
                <option value="" disabled selected>اختر الدور</option>
                <option value="super-admin">مشرف</option>
                <option value="sales">مبيعات</option>
              </select>
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

            <div v-if="errorMessage" class="alert alert-danger">
              {{ errorMessage }}
            </div>
            <div v-if="successMessage" class="alert alert-success">
              {{ successMessage }}
            </div>
          </div>
          <div
            class="modal-footer btns d-flex justify-content-between align-items-center p-2"
          >
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{
                loading
                  ? isEditMode
                    ? "جاري التعديل..."
                    : "جاري الحفظ..."
                  : isEditMode
                  ? "تعديل المستخدم"
                  : "إنشاء مستخدم"
              }}
            </button>
            <button type="button" class="btn btn-secondary" @click="closeModal">
              إغلاق
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import { createUser, updateUser } from "@/plugins/services/authService";

export default {
  name: "AdminModal",
  data() {
    return {
      isEditMode: false,
      formData: {
        id: null,
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
        image: null,
      },
      loading: false,
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.formData.image = file ? file : null;
    },

    openModal(user = null) {
      if (user) {
        this.isEditMode = true;
        this.formData = {
          id: user.id,
          username: user.name,
          email: user.email,
          role: user.role,
          image: null,
        };
      } else {
        this.isEditMode = false;
        this.formData = {
          id: null,
          username: "",
          email: "",
          password: "",
          password_confirmation: "",
          role: "",
          image: null,
        };
      }
      const modal = new Modal(document.getElementById("adminModal"));
      modal.show();
    },

    async submitForm() {
      try {
        this.loading = true;
        this.successMessage = "";
        this.errorMessage = "";

        const formData = new FormData();
        formData.append("name", this.formData.username);
        formData.append("email", this.formData.email);
        formData.append("role", this.formData.role);
        if (!this.isEditMode) {
          formData.append("password", this.formData.password);
          formData.append(
            "password_confirmation",
            this.formData.password_confirmation
          );
        }
        if (this.formData.image) {
          formData.append("image", this.formData.image);
        }

        let response;
        if (this.isEditMode) {
          response = await updateUser(this.formData.id, formData);
        } else {
          response = await createUser(formData);
        }

        if (response.data) {
          this.successMessage = this.isEditMode
            ? "Update User Is Successfully"
            : "Created User Is Successfully";
          this.$emit("user-updated", response.data.data || response.data);
          setTimeout(() => {
            this.clearForm();
            this.closeModal();
          }, 1500);
        }
      } catch (error) {
        this.errorMessage = "An error occurred, try again";
        console.error("Error:", error);
      } finally {
        this.loading = false;
      }
    },

    clearForm() {
      this.formData = {
        id: null,
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
        image: null,
      };
    },

    closeModal() {
      const modal = document.getElementById("adminModal");
      const modalInstance = Modal.getInstance(modal);
      if (modalInstance) modalInstance.hide();
      document.querySelector(".modal-backdrop")?.remove();
      document.body.classList.remove("modal-open");
    },
  },
};
</script>
