<template>
  <div class="mb-3">
    <label for="role" class="form-label">الدور</label>
    <select class="form-control" id="role" v-model="localRole">
      <option value="" disabled selected>اختر الدور</option>
      <option v-for="role in roles" :key="role.id" :value="role.name">
        {{ role.name }}
      </option>
    </select>
  </div>
  <div class="row">
    <div class="col-6">
      <div class="mb-3">
        <label for="createdAt" class="form-label">تاريخ الاضافة</label>
        <input
          type="date"
          class="form-control"
          id="createdAt"
          v-model="localCreatedAt"
        />
      </div>
    </div>
    <div class="col-6">
      <div class="mb-3">
        <label for="rowsPerPage" class="form-label">عدد الصفوف في الصفحة</label>
        <select
          class="form-control"
          id="rowsPerPage"
          v-model="localRowsPerPage"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  </div>
  <div class="mb-3">
    <label class="form-label">الحالة</label>
    <div
      class="radioStatus d-flex justify-content-start align-items-center gap-3"
    >
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          id="status-active"
          value="active"
          v-model="localStatus"
        />
        <label class="form-check-label" for="status-active"> نشط </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          id="status-inactive"
          value="inactive"
          v-model="localStatus"
        />
        <label class="form-check-label" for="status-inactive"> غير نشط </label>
      </div>
    </div>
  </div>
  <div v-if="errorMessage" class="alert alert-danger">
    {{ errorMessage }}
  </div>
  <div v-if="successMessage" class="alert alert-success">
    {{ successMessage }}
  </div>
</template>

<script>
import { getRoles } from "@/plugins/services/authService";

export default {
  name: "FilterForm",
  props: {
    role: String,
    status: String,
    createdAt: String,
    perPage: String,
  },
  emits: ["update:role", "update:status", "update:createdAt", "update:perPage"],

  data() {
    return {
      roles: [],
      localRole: this.role,
      localStatus: this.status,
      localCreatedAt: this.createdAt,
      localRowsPerPage: this.perPage,
      errorMessage: "",
      successMessage: "",
    };
  },
  watch: {
    localRole(newVal) {
      this.$emit("update:role", newVal);
    },
    localStatus(newVal) {
      this.$emit("update:status", newVal);
    },
    localCreatedAt(newVal) {
      this.$emit("update:createdAt", newVal);
    },
    localRowsPerPage(newVal) {
      this.$emit("update:perPage", newVal);
    },
  },
  mounted() {
    this.fetchRoles();
  },
  methods: {
    async fetchRoles() {
      try {
        const response = await getRoles();
        this.roles = response.data.data;
      } catch (error) {
        this.errorMessage = "Error in Upload Roles ";
      }
    },
    submitFilters() {
      console.log({
        role: this.localRole,
        status: this.localStatus,
        createdAt: this.localCreatedAt,
        rowsPerPage: this.localRowsPerPage,
      });
      this.$emit("apply-filters", {
        role: this.localRole,
        status: this.localStatus,
        createdAt: this.localCreatedAt,
        rowsPerPage: this.localRowsPerPage,
      });
    },
  },
};
</script>
