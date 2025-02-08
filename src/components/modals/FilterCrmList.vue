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
          <h5 class="modal-title" id="filterModalLabel">Filter Deal</h5>
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
            :selectedStatuses="selectedStatuses"
            @update:filters="updateFilters"
            @update:selectedStatuses="updateSelectedStatuses"
          />
          <FilterButtonCrmList
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
import FilterCrmListFormVue from "../filterElements/FilterCrmListForm.vue";
import FilterButtonCrmList from "../filterElements/FilterButtonCrmList.vue";

export default {
  name: "FilterModal",
  components: { FilterCrmListFormVue, FilterButtonCrmList },
  props: {
    modelValue: { type: Object, required: true },
  },
  emits: ["update:modelValue", "apply-filters"],

  setup(props, { emit }) {
    const filters = ref({ ...props.modelValue });
    const selectedStatuses = ref([]);
    watch(
      () => props.modelValue,
      (newFilters) => {
        filters.value = { ...newFilters };
      }
    );

    const openFilterModal = () => {
      this.isModalOpen = true;
    };

    const closeFilterModal = () => {
      const modal = document.getElementById("filterModal");
      const modalInstance = Modal.getInstance(modal);
      if (modalInstance) modalInstance.hide();
      document.querySelector(".modal-backdrop")?.remove();
      document.body.classList.remove("modal-open");
    };
    const submitFilters = () => {
      emit("update:modelValue", filters.value);
      emit("apply-filters", filters.value);
      closeFilterModal();
    };

    const updateFilters = (newFilters) => {
      filters.value = newFilters;
      emit("update:modelValue", newFilters);
    };

    const applyFilters = (appliedFilters) => {
      filters.value = appliedFilters;
    };
    const resetFilter = () => {
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
      selectedStatuses.value = [];
      emit("update:modelValue", emptyFilters);
      emit("apply-filters", emptyFilters);
    };

    const updateSelectedStatuses = (newStatuses) => {
      selectedStatuses.value = newStatuses;
    };
    return {
      filters,
      selectedStatuses,
      openFilterModal,
      closeFilterModal,
      submitFilters,
      updateFilters,
      updateSelectedStatuses,
      applyFilters,
      resetFilter,
    };
  },
};
</script>
