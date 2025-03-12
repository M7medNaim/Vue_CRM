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
import { useToast } from "vue-toastification";

export default {
  name: "ImportModal",
  components: { ImportButtons, ImportForm },

  setup() {
    const toast = useToast();
    const importModalRef = ref(null);
    let modalInstance = null;

    const openImportModal = () => {
      try {
        if (importModalRef.value) {
          modalInstance = new Modal(importModalRef.value);
          modalInstance.show();
          toast.info("يرجى اختيار الملف المراد استيراده", {
            timeout: 3000,
          });
        }
      } catch (error) {
        toast.error("حدث خطأ في فتح نافذة الاستيراد", {
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
        toast.error("حدث خطأ في إغلاق النافذة", {
          timeout: 3000,
        });
        console.error("Error closing modal:", error);
      }
    };

    const submitImports = async () => {
      try {
        // هنا يمكنك إضافة منطق استيراد البيانات
        toast.success("تم استيراد البيانات بنجاح", {
          timeout: 3000,
        });
        closeImportModal();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "فشل في استيراد البيانات",
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
    };
  },
};
</script>
