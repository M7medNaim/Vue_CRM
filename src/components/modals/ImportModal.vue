<template>
  <div
    class="modal fade"
    id="importModal"
    tabindex="-1"
    aria-labelledby="importModalLabel"
    aria-hidden="true"
    ref="importModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="importModalLabel">Import</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeImportModal"
          ></button>
        </div>
        <form @submit.prevent="submitImports">
          <ImportForm />
          <ImportButtons
            @close-modal="closeImportModal"
            @submit="submitImports"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { Modal } from "bootstrap";
import ImportForm from "../importElements/ImportForm.vue";
import ImportButtons from "../importElements/ImportButtons.vue";

export default {
  name: "ImportModal",
  components: { ImportButtons, ImportForm },

  setup() {
    const importModalRef = ref(null);
    let modalInstance = null;

    const openImportModal = () => {
      if (importModalRef.value) {
        modalInstance = new Modal(importModalRef.value);
        modalInstance.show();
      }
    };

    const closeImportModal = () => {
      if (modalInstance) {
        modalInstance.hide();
      }
    };

    const submitImports = () => {
      closeImportModal();
    };

    return {
      importModalRef,
      openImportModal,
      closeImportModal,
      submitImports,
    };
  },
};
</script>
