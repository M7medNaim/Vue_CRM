<template>
  <div class="modal-footer d-flex justify-content-between align-items-center">
    <div class="btns d-flex justify-content-end align-items-center gap-3">
      <button type="submit" class="btn btn-primary">Import</button>
    </div>
    <button
      type="button"
      class="btn btn-secondary"
      data-bs-dismiss="modal"
      @click="closeImportModal"
    >
      إغلاق
    </button>
  </div>
</template>

<script>
export default {
  name: "ImportButtons",
  methods: {
    closeImportModal() {
      this.$emit("close-modal");
    },
  },
};
</script>
