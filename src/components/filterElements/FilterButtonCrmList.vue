<template>
  <div class="modal-footer d-flex justify-content-between align-items-center">
    <div class="btns d-flex justify-content-end align-items-center gap-3">
      <button type="submit" class="btn btn-primary">تطبيق الفلتر</button>
      <button type="button" class="btn btn-warning" @click="removeFilter">
        إزالة الفلتر
      </button>
    </div>
    <button type="button" class="btn btn-secondary" @click="closeFilterModal">
      إغلاق
    </button>
  </div>
</template>

<script>
export default {
  name: "FilterButtonCrmList",
  methods: {
    closeFilterModal() {
      this.$emit("close-modal");
    },
    removeFilter() {
      this.$emit("reset-filter");
      this.$emit("close-modal");
    },
  },
};
</script>

<style scoped>
/* يمكنك إضافة الأنماط الخاصة بك هنا */
</style>
