<template>
  <div class="modal-footer d-flex justify-content-between align-items-center">
    <div class="btns d-flex justify-content-end align-items-center gap-3">
      <button type="submit" class="btn btn-primary">
        {{ t("crmlist-modal-import-button-submit") }}
      </button>
    </div>
    <button
      type="button"
      class="btn btn-secondary"
      data-bs-dismiss="modal"
      @click="closeImportModal"
    >
      {{ t("crmlist-modal-import-button-close") }}
    </button>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";

export default {
  name: "ImportButtons",
  setup() {
    const { t } = useI18n();
    return { t };
  },
  methods: {
    closeImportModal() {
      this.$emit("close-modal");
    },
  },
};
</script>
