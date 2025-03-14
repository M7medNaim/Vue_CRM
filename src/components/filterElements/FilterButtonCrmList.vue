<template>
  <div class="modal-footer d-flex justify-content-between align-items-center">
    <div class="btns d-flex justify-content-end align-items-center gap-3">
      <button type="submit" class="btn btn-primary">تطبيق الفلتر</button>
      <button type="button" class="btn btn-warning" @click="removeFilter">
        {{ t("modals.resetFilters") }}
      </button>
    </div>
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
      {{ t("buttons.close") }}
    </button>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
export default {
  name: "FilterButtonCrmList",
  setup() {
    const { t } = useI18n();
    return { t };
  },
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
