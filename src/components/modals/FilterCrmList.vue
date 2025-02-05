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
            @update:filters="updateFilters"
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
      filters.value = { name: "", stage: "", source: "" };
      emit("apply-filters", filters.value);
    };
    return {
      filters,
      openFilterModal,
      closeFilterModal,
      submitFilters,
      updateFilters,
      applyFilters,
      resetFilter,
    };
  },
};
</script>
