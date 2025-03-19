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
          <h5 class="modal-title" id="importModalLabel">
            {{ $t("kanban-modal-import-heading") }}
          </h5>
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
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
export default {
  name: "ImportModal",
  components: { ImportButtons, ImportForm },

  setup() {
    const toast = useToast();
    const { t } = useI18n();
    const importModalRef = ref(null);
    let modalInstance = null;

    const openImportModal = () => {
      try {
        if (importModalRef.value) {
          modalInstance = new Modal(importModalRef.value);
          modalInstance.show();
          toast.info(t("modals.importModalInfo"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        toast.error(t("error.importModalError"), {
          timeout: 3000,
        });
        console.error("Error opening modal:", error);
      }
    };

    const closeImportModal = () => {
      try {
        if (modalInstance) {
          modalInstance.hide();
        }
      } catch (error) {
        toast.error(t("error.closeModal"), {
          timeout: 3000,
        });
        console.error("Error closing modal:", error);
      }
    };

    const submitImports = async () => {
      try {
        // هنا يمكنك إضافة منطق استيراد البيانات
        toast.success(t("success.importModalSuccess"), {
          timeout: 3000,
        });
        closeImportModal();
      } catch (error) {
        toast.error(
          error.response?.data?.message || t("error.importModalError"),
          {
            timeout: 3000,
          }
        );
        console.error("Import Error:", error);
      }
    };

    return {
      importModalRef,
      openImportModal,
      closeImportModal,
      submitImports,
      t,
    };
  },
};
</script>
