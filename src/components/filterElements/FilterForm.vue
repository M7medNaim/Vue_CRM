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
/* تغيير لون الراديو */
input[type="radio"] {
  accent-color: #292929;
  box-shadow: none;
  color: #292929;
  cursor: pointer;
}

input[type="radio"]:focus,
input[type="radio"]:active,
input[type="radio"]:checked {
  box-shadow: none;
  border: #292929;
  outline: none;
  background-color: #292929;
}
</style>
