<template>
  <div class="mb-3">
    <label for="role" class="form-label">الدور</label>
    <select class="form-control" id="role" v-model="localRole">
      <option value="" disabled selected>اختر الدور</option>
      <option value="super-admin">مشرف</option>
      <option value="sales">مبيعات</option>
    </select>
  </div>

  <div class="mb-3">
    <label for="status" class="form-label">الحالة</label>
    <select class="form-control" id="status" v-model="localStatus">
      <option value="" disabled selected>اختر الحالة</option>
      <option value="active">نشط</option>
      <option value="inactive">غير نشط</option>
    </select>
  </div>

  <div v-if="errorMessage" class="alert alert-danger">
    {{ errorMessage }}
  </div>
  <div v-if="successMessage" class="alert alert-success">
    {{ successMessage }}
  </div>
</template>

<script>
export default {
  name: "FilterForm",
  props: ["role", "status"],
  data() {
    return {
      localRole: this.role,
      localStatus: this.status,
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    submitForm() {
      this.$emit("submit", { role: this.localRole, status: this.localStatus });
    },
  },
};
</script>
<style scoped>
select:focus {
  box-shadow: none;
  outline: none;
}
</style>
