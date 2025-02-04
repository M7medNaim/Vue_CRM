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
            <div class="mb-3">
              <label for="phoneNumber" class="form-label">رقم الهاتف</label>
              <input
                type="text"
                class="form-control"
                id="phoneNumber"
                v-model="formData.phoneNumber"
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
              <select class="form-control" id="role" v-model="formData.role">
                <option v-if="!isEditMode" value="" disabled selected>
                  اختر الدور
                </option>
                <option v-for="role in roles" :key="role.id" :value="role.name">
                  {{ role.name }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="reportTo" class="form-label">من يتبع له</label>
              <Multiselect
                v-model="formData.reportTo"
                :options="filteredUsers"
                label="name"
                track-by="id"
                placeholder="اختر المسؤول"
                :searchable="true"
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
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";

import {
  createUser,
  updateUser,
  getUser,
  getRoles,
} from "@/plugins/services/authService";

export default {
  name: "AdminModal",
  components: { Multiselect },
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
        reportTo: "",
        phoneNumber: "",
        image: null,
      },
      users: [],
      roles: [],
      loading: false,
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await getUser();
        this.users = response.data.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async fetchRoles() {
      try {
        const response = await getRoles();
        this.roles = response.data.data;
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.formData.image = file ? file : null;
    },

    openModal(user = null) {
      this.fetchUsers();
      this.fetchRoles();

      if (user) {
        this.isEditMode = true;
        this.formData = {
          id: user.id,
          username: user.name,
          email: user.email,
          role: user.role?.id || user.role,
          reportTo: user.reportTo?.id || user.reportTo,
          phoneNumber: user.phoneNumber,
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
          reportTo: "",
          phoneNumber: "",
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
        const selectedRole = this.roles.find(
          (role) => role.name === this.formData.role
        );
        formData.append("role", selectedRole ? selectedRole.id : "");

        formData.append("reportTo", this.formData.reportTo);
        formData.append("phoneNumber", this.formData.phoneNumber);
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
        reportTo: "",
        phoneNumber: "",
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

    isParentRole(parentRole, childRole) {
      const childRoleData = this.roles.find((role) => role.name === childRole);
      return childRoleData && childRoleData.parent_role === parentRole;
    },
  },
  computed: {
    filteredUsers() {
      if (!this.formData.role) return [];

      const selectedRole = this.roles.find(
        (role) => role.name === this.formData.role
      );
      if (!selectedRole || !selectedRole.parent_role) return [];

      return this.users.filter(
        (user) => user.role === selectedRole.parent_role
      );
    },
  },
};
</script>
