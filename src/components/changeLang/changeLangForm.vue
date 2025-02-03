<template>
  <div class="mb-3">
    <label for="lang" class="form-label">اللغة</label>
    <select
      class="form-control"
      id="lang"
      v-model="lang"
      @change="validateLang"
    >
      <option value="" disabled selected>اختر اللغة</option>
      <option value="arabic">العربية</option>
      <option value="english">English</option>
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
import { ref } from "vue";

export default {
  name: "ChangeLangForm",
  setup() {
    const lang = ref("");
    const errorMessage = ref("");
    const successMessage = ref("");

    const validateLang = () => {
      if (lang.value === "") {
        errorMessage.value = "يرجى اختيار اللغة";
        successMessage.value = "";
      } else {
        successMessage.value = "تم اختيار اللغة بنجاح";
        errorMessage.value = "";
      }
    };

    return {
      lang,
      errorMessage,
      successMessage,
      validateLang,
    };
  },
};
</script>

<style scoped>
select:focus {
  box-shadow: none;
  outline: none;
}
</style>
