<template>
  <div
    class="modal fade"
    id="showDataModal"
    tabindex="-1"
    aria-labelledby="showDataModalLabel"
    aria-hidden="true"
    ref="showDataModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="showDataModalLabel">Show Deal Details</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeShowDataModal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12">
              <!-- Deal Information -->
              <h6 class="mb-3">Deal Information</h6>
              <div class="mb-3">
                <label class="form-label">Stage Name</label>
                <input
                  type="text"
                  class="form-control"
                  :value="dealData?.stage_name"
                  disabled
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Source Name</label>
                <input
                  type="text"
                  class="form-control"
                  :value="dealData?.source_name || 'No source'"
                  disabled
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Rating</label>
                <input
                  type="text"
                  class="form-control"
                  :value="dealData?.rating || 'No rating'"
                  disabled
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Nots</label>
                <input
                  type="text"
                  class="form-control"
                  :value="dealData?.description || 'No description'"
                  disabled
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Created At</label>
                <input
                  type="text"
                  class="form-control"
                  :value="formatDate(dealData?.created_at)"
                  disabled
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Updated At</label>
                <input
                  type="text"
                  class="form-control"
                  :value="formatDate(dealData?.updated_at)"
                  disabled
                />
              </div>

              <!-- Contact Information -->
              <h6 class="mb-3 mt-4">Contact Information</h6>
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input
                  type="text"
                  class="form-control"
                  :value="dealData?.name"
                  disabled
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Nickname</label>
                <input
                  type="text"
                  class="form-control"
                  :value="dealData?.nickname || 'No nickname'"
                  disabled
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  :value="dealData?.email"
                  disabled
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Address</label>
                <input
                  type="text"
                  class="form-control"
                  :value="dealData?.address || 'No address'"
                  disabled
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Country</label>
                <input
                  type="text"
                  class="form-control"
                  :value="dealData?.country || 'No country'"
                  disabled
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Phone Number</label>
                <input
                  type="text"
                  class="form-control"
                  :value="dealData?.phone"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { Modal } from "bootstrap";
import { useToast } from "vue-toastification";

export default {
  name: "showDataModal",
  props: {
    formData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const toast = useToast();
    const showDataModalRef = ref(null);
    const dealData = ref(null);

    watch(
      () => props.formData,
      (newData) => {
        if (newData) {
          dealData.value = newData;
          toast.success("تم جلب بيانات الصفقة بنجاح", {
            timeout: 3000,
          });
        }
      },
      { deep: true, immediate: true }
    );

    const formatDate = (dateString) => {
      if (!dateString) return "No date";
      return new Date(dateString).toLocaleString();
    };

    const openShowData = () => {
      try {
        const modalElement = document.getElementById("showDataModal");
        const modal = new Modal(modalElement);
        modal.show();
      } catch (error) {
        toast.error("حدث خطأ في عرض البيانات", {
          timeout: 3000,
        });
        console.error("Error opening modal:", error);
      }
    };

    const closeShowDataModal = () => {
      try {
        const modalElement = document.getElementById("showDataModal");
        const modal = Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      } catch (error) {
        toast.error("حدث خطأ في إغلاق النافذة", {
          timeout: 3000,
        });
        console.error("Error closing modal:", error);
      }
    };

    return {
      openShowData,
      closeShowDataModal,
      showDataModalRef,
      dealData,
      formatDate,
    };
  },
};
</script>

<style scoped>
h6 {
  color: #666;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.form-control:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}
</style>
