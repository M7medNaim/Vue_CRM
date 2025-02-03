<template>
  <div class="mb-3">
    <label for="newPassword" class="form-label">كلمة المرور الجديدة</label>
    <input
      type="password"
      class="form-control"
      placeholder="New Password"
      id="newPassword"
      v-model="newPassword"
    />
  </div>
  <div class="mb-3">
    <label for="confirmPassword" class="form-label"> تأكيد كلمة المرور</label>
    <input
      type="password"
      class="form-control"
      placeholder="Confirm Password"
      id="confirmPassword"
      v-model="confirmPassword"
    />
  </div>

  <div v-if="errorMessage" class="alert alert-danger">
    {{ errorMessage }}
  </div>
  <div v-if="successMessage" class="alert alert-success">
    {{ successMessage }}
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "ChangePasswordForm",
  setup() {
    const newPassword = ref("");
    const confirmPassword = ref("");
    const errorMessage = ref("");
    const successMessage = ref("");

    return {
      newPassword,
      confirmPassword,
      errorMessage,
      successMessage,
    };
  },
};
</script>

<style scoped>
input:focus {
  box-shadow: none;
  outline: none;
}
</style>
