<template>
  <div class="modal fade" id="filterModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ t("contacts-modal-filter-heading") }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <form @submit.prevent="applyFilters">
          <div class="modal-body">
            <!-- Date Range Filter -->
            <div class="mb-3">
              <label class="form-label">{{
                t("contacts-modal-filter-label-created-at")
              }}</label>
              <div class="row">
                <div class="col-6">
                  <input
                    type="date"
                    class="form-control"
                    v-model="filterData.startDate"
                    :placeholder="t('contacts-modal-filter-label-created-at')"
                  />
                </div>
                <div class="col-6">
                  <input
                    type="date"
                    class="form-control"
                    v-model="filterData.endDate"
                    :placeholder="t('contacts-modal-filter-label-created-at')"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            class="modal-footer d-flex justify-content-between align-items-center"
          >
            <button type="submit" class="btn btn-primary">
              {{ t("contacts-modal-filter-button-submit") }}
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="resetFilters"
            >
              {{ t("contacts-modal-filter-button-reset") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { Modal } from "bootstrap";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

export default {
  name: "FilterContact",
  emits: ["apply-filters", "reset-filters"],

  setup(props, { emit }) {
    const toast = useToast();
    const modalInstance = ref(null);
    const { t } = useI18n();

    const filterData = ref({
      startDate: "",
      endDate: "",
    });

    const applyFilters = () => {
      try {
        if (!filterData.value.startDate || !filterData.value.endDate) {
          toast.error(t("error.selectDateRange"));
          return;
        }

        const filters = {
          created_at_from: filterData.value.startDate,
          created_at_to: filterData.value.endDate,
        };

        emit("apply-filters", filters);
        modalInstance.value.hide();
      } catch (error) {
        toast.error(t("error.applyFilters"));
      }
    };

    const resetFilters = () => {
      try {
        filterData.value = {
          startDate: "",
          endDate: "",
        };
        emit("reset-filters");
        modalInstance.value.hide();
      } catch (error) {
        console.error("Error resetting filters:", error);
        toast.error(t("error.resetFilters"));
      }
    };

    onMounted(() => {
      modalInstance.value = new Modal(document.getElementById("filterModal"));
    });

    return {
      filterData,
      openFilterModal: () => modalInstance.value.show(),
      applyFilters,
      resetFilters,
      t,
    };
  },
};
</script>

<style scoped></style>
