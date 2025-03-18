<template>
  <div class="modal-footer d-flex justify-content-between align-items-center">
    <div class="btns d-flex justify-content-end align-items-center gap-3">
      <button type="submit" class="btn btn-primary">
        {{ t("crmlist-modal-filter-button-submit") }}
      </button>
      <button type="button" class="btn btn-warning" @click="removeFilter">
        {{ t("crmlist-modal-filter-button-reset") }}
      </button>
    </div>
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
      {{ t("crmlist-modal-filter-button-close") }}
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
