<template>
  <div
    class="modal fade"
    id="exportModal"
    tabindex="-1"
    aria-labelledby="exportModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exportModalLabel">
            {{ t("modals.exportData") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleExport">
            <div class="mb-3">
              <label class="form-label">
                {{ t("modals.exportFormat") }}
              </label>
              <select class="form-select" v-model="exportFormat" required>
                <option value="" disabled selected>
                  {{ t("modals.chooseExportFormat") }}
                </option>
                <option value="excel">Excel</option>
                <option value="sql">SQL</option>
              </select>
            </div>
            <div class="modal-footer d-flex justify-content-between">
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="!exportFormat"
              >
                {{ t("buttons.export") }}
                <i class="fa-solid fa-download ms-1"></i>
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                {{ t("buttons.cancel") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { Modal } from "bootstrap";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
export default {
  name: "ExportModal",
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    const exportFormat = ref("");

    const handleExport = () => {
      try {
        if (!exportFormat.value) {
          toast.error(t("error.chooseExportFormat"), {
            timeout: 3000,
          });
          return;
        }

        toast.info(t("modals.exportingData"), {
          timeout: 2000,
        });

        console.log("Exporting as:", exportFormat.value);

        const modal = Modal.getInstance(document.getElementById("exportModal"));
        modal?.hide();

        toast.success(t("success.exportData"), {
          timeout: 3000,
        });

        exportFormat.value = "";
      } catch (error) {
        console.error("Error during export:", error);
        toast.error(t("error.exportData"), {
          timeout: 3000,
        });
      }
    };

    return {
      exportFormat,
      handleExport,
      t,
    };
  },
};
</script>
