<template>
  <div
    class="modal fade"
    id="filterModal"
    tabindex="-1"
    aria-labelledby="filterModalLabel"
    aria-hidden="true"
    ref="filterModal"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="filterModalLabel">
            {{ t("crmlist-modal-filter-heading") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeFilterModal"
          ></button>
        </div>
        <form @submit.prevent="submitFilters">
          <filter-modal-form-items
            :headerFilters="headerFilterData"
            :headerSelectedStatuses="headerSelectedStatuses"
            @update:headerFilters="updateFilters"
            @update:headerSelectedStatuses="updateSelectedStatuses"
          />
          <filter-modal-buttons-items
            @reset-filter="resetFilter"
            @close-modal="closeFilterModal"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { Modal } from "bootstrap";
import FilterModalFormItems from "@/components/filterElements/CrmDealKanbanViewTopHeaderFilterModalFormItems.vue";
import FilterModalButtonsItems from "@/components/filterElements/CrmDealKanbanViewTopHeaderFilterModalButtonsItems.vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

export default {
  name: "CrmDealKanbanViewTopHeaderFilterModal",
  components: { FilterModalFormItems, FilterModalButtonsItems },
  props: {
    modelValue: { type: Object, required: true },
    selectedStatuses: { type: Array, required: true, default: () => [] },
  },
  emits: ["update:modelValue", "apply-filters", "reset-filter"],

  setup(props, { emit }) {
    const { t } = useI18n();
    const toast = useToast();
    const headerFilterData = ref({ ...props.modelValue });
    const headerSelectedStatuses = ref([]);
    const filterModal = ref(null);

    watch(
      () => props.modelValue,
      (newFilters) => {
        if (newFilters) {
          headerFilterData.value = { ...newFilters };
          headerSelectedStatuses.value = Array.isArray(newFilters.status)
            ? [...newFilters.status]
            : [];
        }
      },
      { immediate: true, deep: true }
    );

    watch(
      () => props.selectedStatuses,
      (newStatuses) => {
        if (Array.isArray(newStatuses)) {
          headerSelectedStatuses.value = [...newStatuses];
          headerFilterData.value.status = [...newStatuses];
        }
      },
      { immediate: true }
    );

    const closeFilterModal = () => {
      try {
        const modal = filterModal.value;
        const modalInstance = Modal.getInstance(modal);
        if (modalInstance) modalInstance.hide();
        document.querySelector(".modal-backdrop")?.remove();
        document.body.classList.remove("modal-open");
      } catch (error) {
        toast.error(t("error.closeModal"), { timeout: 3000 });
        console.error("Error closing modal:", error);
      }
    };

    const submitFilters = () => {
      try {
        if (Array.isArray(headerSelectedStatuses.value)) {
          headerFilterData.value.status = [...headerSelectedStatuses.value];
        }

        emit("update:modelValue", { ...headerFilterData.value });
        emit("apply-filters", { ...headerFilterData.value });

        // closeFilterModal();
      } catch (error) {
        toast.error(t("error.applyFilters"), { timeout: 3000 });
      }
    };

    const updateFilters = (newFilters) => {
      if (newFilters) {
        headerFilterData.value = { ...newFilters };
        emit("update:modelValue", { ...headerFilterData.value });
      }
    };

    const resetFilter = () => {
      try {
        const emptyFilters = {
          package_id: null,
          updated_at_start: null,
          updated_at_end: null,
          source_id: null,
          stage_id: null,
          user_id: null,
          created_at_start: null,
          created_at_end: null,
          status: [],
        };
        headerFilterData.value = emptyFilters;
        headerSelectedStatuses.value = [];
        emit("update:modelValue", emptyFilters);
        emit("reset-filter");
      } catch (error) {
        toast.error(t("error.resetFilters"), { timeout: 3000 });
      }
    };

    const updateSelectedStatuses = (newStatuses) => {
      if (Array.isArray(newStatuses)) {
        headerSelectedStatuses.value = [...newStatuses];
        headerFilterData.value.status = [...newStatuses];
        emit("update:modelValue", { ...headerFilterData.value });
      }
    };

    return {
      headerFilterData,
      headerSelectedStatuses,
      closeFilterModal,
      submitFilters,
      updateFilters,
      updateSelectedStatuses,
      resetFilter,
      t,
      filterModal,
    };
  },
};
</script>
