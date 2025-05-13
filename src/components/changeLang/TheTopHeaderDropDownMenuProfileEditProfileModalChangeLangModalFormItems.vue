<template>
  <div class="mb-3">
    <label for="lang" class="form-label">{{ $t("forms.language") }}</label>
    <select class="form-control" id="lang" v-model="selectedLang">
      <option value="" disabled selected>
        {{ $t("forms.select_language") }}
      </option>
      <option value="ar">العربية</option>
      <option value="en">English</option>
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
  name: "TheTopHeaderDropDownMenuProfileEditProfileModalChangeLangModalFormItems",
  props: {
    modelValue: {
      type: String,
      default: "en",
    },
  },
  emits: ["update:modelValue"],
  setup() {
    const selectedLang = ref(null);
    const errorMessage = ref("");
    const successMessage = ref("");

    const validateLang = () => {
      if (selectedLang.value === "") {
        errorMessage.value = "يرجى اختيار اللغة";
        successMessage.value = "";
      } else {
        successMessage.value = "تم اختيار اللغة بنجاح";
        errorMessage.value = "";
      }
    };

    return {
      selectedLang,
      errorMessage,
      successMessage,
      validateLang,
    };
  },
  watch: {
    selectedLang(newVal) {
      this.$emit("update:modelValue", newVal);
    },
    modelValue(newVal) {
      this.selectedLang = newVal;
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
