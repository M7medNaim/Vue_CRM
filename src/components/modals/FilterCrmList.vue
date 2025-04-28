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
            :selectedStatuses="selectedStatuses"
            :stages="local_stages"
            :sources="local_sources"
            :users="local_users"
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
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
export default {
  name: "FilterModal",
  components: { FilterCrmListFormVue, FilterButtonCrmList },
  props: {
    modelValue: { type: Object, required: true },
    stages: {
      type: Array,
      default: () => [],
    },
    sources: {
      type: Array,
      default: () => [],
    },
    users: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:modelValue", "apply-filters"],

  setup(props, { emit }) {
    const { t } = useI18n();
    const toast = useToast();
    const filters = ref({ ...props.modelValue });
    const selectedStatuses = ref([]);
    const local_stages = ref([]);
    const local_sources = ref([]);
    const local_users = ref([]);

    watch(
      () => props.modelValue,
      (newFilters) => {
        filters.value = { ...newFilters };
      }
    );

    const openFilterModal = () => {
      try {
        this.isModalOpen = true;
      } catch (error) {
        toast.error(t("error.closeModal"), {
          timeout: 3000,
        });
      }
    };

    const closeFilterModal = () => {
      try {
        const modal = document.getElementById("filterModal");
        const modalInstance = Modal.getInstance(modal);
        if (modalInstance) modalInstance.hide();
        document.querySelector(".modal-backdrop")?.remove();
        document.body.classList.remove("modal-open");
      } catch (error) {
        toast.error(t("error.closeModal"), {
          timeout: 3000,
        });
      }
    };

    const submitFilters = () => {
      try {
        emit("update:modelValue", filters.value);
        emit("apply-filters", filters.value);
        toast.success(t("success.applyFilters"), {
          timeout: 3000,
        });
        closeFilterModal();
      } catch (error) {
        toast.error(t("error.applyFilters"), {
          timeout: 3000,
        });
      }
    };

    const updateFilters = (newFilters) => {
      filters.value = newFilters;
      emit("update:modelValue", newFilters);
    };

    const applyFilters = (appliedFilters) => {
      filters.value = appliedFilters;
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
        selectedStatuses.value = [];
        emit("update:modelValue", emptyFilters);
        emit("apply-filters", emptyFilters);
        toast.success(t("success.resetFilters"), {
          timeout: 3000,
        });
      } catch (error) {
        toast.error(t("error.resetFilters"), {
          timeout: 3000,
        });
      }
    };

    const updateSelectedStatuses = (newStatuses) => {
      selectedStatuses.value = newStatuses;
    };

    watch(
      () => props.stages,
      (newStages) => {
        local_stages.value = newStages;
        console.log("filters local_stages", local_stages.value);
      },
      { deep: true }
    );

    watch(
      () => props.sources,
      (newSources) => {
        local_sources.value = newSources;
        console.log("filters local_sources", local_sources.value);
      },
      { deep: true }
    );

    watch(
      () => props.users,
      (newUsers) => {
        console.log("filters new users", newUsers);
        local_users.value = newUsers;
      },
      { deep: true }
    );

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
      t,
      local_stages,
      local_sources,
      local_users,
    };
  },
};
</script>
