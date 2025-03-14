<template>
  <div
    class="modal-footer btns d-flex justify-content-between align-items-center"
  >
    <div class="btns">
      <button type="submit" class="btn btn-primary me-2" :disabled="loading">
        <span v-if="loading">
          <i class="fas fa-spinner fa-spin"></i
          >{{ t("modals.applyingFilters") }}
        </span>
        <span v-else>{{ t("modals.applyFilters") }}</span>
      </button>
      <button
        type="button"
        class="btn btn-warning"
        @click="$emit('reset-filters')"
      >
        {{ t("modals.resetFilters") }}
      </button>
    </div>

    <button type="button" class="btn btn-secondary" @click="$emit('close')">
      {{ t("buttons.close") }}
    </button>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
export default {
  name: "FilterButtons",
  props: ["loading"],
  emits: ["close", "reset-filters"],
  setup() {
    const { t } = useI18n();
    return { t };
  },
};
</script>
