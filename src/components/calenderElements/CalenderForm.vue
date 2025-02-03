<template>
  <div class="mb-3">
    <label for="calender" class="form-label">إضافة تاريخ</label>
    <input
      type="date"
      class="form-control"
      placeholder="Date"
      id="calender"
      v-model="calender"
      @input="$emit('update:modelValue', $event)"
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
  name: "CalenderForm",
  props: {
    modelValue: { type: String, default: "" },
  },
  setup() {
    const calender = ref("");
    const errorMessage = ref("");
    const successMessage = ref("");

    const validateCalender = () => {
      if (calender.value === "") {
        errorMessage.value = "يرجى اختيار التاريخ";
        successMessage.value = "";
      } else {
        successMessage.value = "تم اختيار التاريخ بنجاح";
        errorMessage.value = "";

        setTimeout(() => {
          successMessage.value = "";
        }, 3000);
      }
    };

    return {
      calender,
      errorMessage,
      successMessage,
      validateCalender,
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
