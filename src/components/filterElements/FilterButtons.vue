<template>
  <div
    class="modal-footer btns d-flex justify-content-between align-items-center"
  >
    <button type="submit" class="btn btn-primary" :disabled="loading">
      <span v-if="loading">
        <i class="fas fa-spinner fa-spin"></i> جاري الفلترة...
      </span>
      <span v-else>تطبيق فلتر</span>
    </button>

    <button type="button" class="btn btn-secondary" @click="$emit('close')">
      إغلاق
    </button>
  </div>
</template>

<script>
export default {
  name: "FilterButtons",
  props: ["loading"],
};
</script>
