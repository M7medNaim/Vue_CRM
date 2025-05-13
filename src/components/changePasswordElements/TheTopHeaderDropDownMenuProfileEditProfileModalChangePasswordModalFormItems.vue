<template>
  <div class="mb-3">
    <label for="newPassword" class="form-label">{{
      t("modals.newPassword")
    }}</label>
    <input
      type="password"
      class="form-control"
      placeholder="New Password"
      id="newPassword"
      v-model="newPassword"
    />
  </div>
  <div class="mb-3">
    <label for="confirmPassword" class="form-label">{{
      t("modals.confirmPassword")
    }}</label>
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
import { useI18n } from "vue-i18n";
export default {
  name: "TheTopHeaderDropDownMenuProfileEditProfileModalChangePasswordModalFormItems",
  setup() {
    const { t } = useI18n();
    const newPassword = ref("");
    const confirmPassword = ref("");
    const errorMessage = ref("");
    const successMessage = ref("");

    return {
      newPassword,
      confirmPassword,
      errorMessage,
      successMessage,
      t,
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
