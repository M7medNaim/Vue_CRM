<template>
  <div
    class="modal fade"
    id="filterModal"
    tabindex="-1"
    aria-labelledby="filterModalLabel"
    aria-hidden="true"
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
          <FilterCrmListFormVue
            :filters="filters"
            :selectedStatuses="localSelectedStatuses"
            @update:filters="updateFilters"
            @update:selectedStatuses="updateSelectedStatuses"
          />
          <FilterButtonCrmList
            @reset-filter="resetFilter"
            @close-modal="closeFilterModal"
            @submit-filters="submitFilters"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { Modal } from "bootstrap";
import FilterCrmListFormVue from "../filterElements/FilterCrmListForm.vue";
import FilterButtonCrmList from "../filterElements/FilterButtonCrmList.vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

export default {
  name: "FilterModal",
  components: { FilterCrmListFormVue, FilterButtonCrmList },
  props: {
    modelValue: { type: Object, required: true },
    selectedStatuses: { type: Array, default: () => [] },
  },
  emits: ["update:modelValue", "apply-filters", "reset-filter"],

  setup(props, { emit }) {
    const { t } = useI18n();
    const toast = useToast();
    const filters = ref({ ...props.modelValue });
    const localSelectedStatuses = ref([...props.selectedStatuses]);

    // Watch for changes in modelValue
    watch(
      () => props.modelValue,
      (newFilters) => {
        if (newFilters) {
          filters.value = { ...newFilters };
          localSelectedStatuses.value = Array.isArray(newFilters.status)
            ? [...newFilters.status]
            : [];
        }
      },
      { immediate: true, deep: true }
    );

    // Watch for changes in selectedStatuses prop
    watch(
      () => props.selectedStatuses,
      (newStatuses) => {
        if (Array.isArray(newStatuses)) {
          localSelectedStatuses.value = [...newStatuses];
          filters.value.status = [...newStatuses];
        }
      },
      { immediate: true }
    );

    const closeFilterModal = () => {
      try {
        const modal = document.getElementById("filterModal");
        const modalInstance = Modal.getInstance(modal);
        if (modalInstance) modalInstance.hide();
        document.querySelector(".modal-backdrop")?.remove();
        document.body.classList.remove("modal-open");
      } catch (error) {
        toast.error(t("error.closeModal"), { timeout: 3000 });
      }
    };

    const submitFilters = () => {
      try {
        // Update filters with current statuses
        if (Array.isArray(localSelectedStatuses.value)) {
          filters.value.status = [...localSelectedStatuses.value];
        }

        // Emit both the updated filters and apply them
        emit("update:modelValue", { ...filters.value });
        emit("apply-filters", { ...filters.value });

        toast.success(t("success.applyFilters"), { timeout: 3000 });
        closeFilterModal();
      } catch (error) {
        toast.error(t("error.applyFilters"), { timeout: 3000 });
      }
    };

    const updateFilters = (newFilters) => {
      if (newFilters) {
        filters.value = { ...newFilters };
        emit("update:modelValue", { ...filters.value });
      }
    };

    const resetFilter = () => {
      try {
        const emptyFilters = {
          source: "",
          stage: "",
          supervisor: "",
          representative: "",
          package: "",
          createdStart: "",
          createdEnd: "",
          modifiedStart: "",
          modifiedEnd: "",
          status: [],
        };
        filters.value = { ...emptyFilters };
        localSelectedStatuses.value = [];
        emit("update:modelValue", { ...emptyFilters });
        emit("reset-filter");
        toast.success(t("success.resetFilters"), { timeout: 3000 });
        closeFilterModal();
      } catch (error) {
        toast.error(t("error.resetFilters"), { timeout: 3000 });
      }
    };

    const updateSelectedStatuses = (newStatuses) => {
      if (Array.isArray(newStatuses)) {
        localSelectedStatuses.value = [...newStatuses];
        filters.value.status = [...newStatuses];
        emit("update:modelValue", { ...filters.value });
      }
    };

    return {
      filters,
      localSelectedStatuses,
      closeFilterModal,
      submitFilters,
      updateFilters,
      updateSelectedStatuses,
      resetFilter,
      t,
    };
  },
};
</script>
