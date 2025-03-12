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
import { useToast } from "vue-toastification";

export default {
  name: "FilterModal",
  components: { FilterCrmListFormVue, FilterButtonCrmList },
  props: {
    modelValue: { type: Object, required: true },
  },
  emits: ["update:modelValue", "apply-filters"],

  setup(props, { emit }) {
    const toast = useToast();
    const filters = ref({ ...props.modelValue });
    const selectedStatuses = ref([]);

    watch(
      () => props.modelValue,
      (newFilters) => {
        filters.value = { ...newFilters };
      }
    );

    const openFilterModal = () => {
      try {
        this.isModalOpen = true;
        toast.info("يمكنك تحديد معايير الفلترة", {
          timeout: 3000,
        });
      } catch (error) {
        toast.error("حدث خطأ في فتح نافذة الفلترة", {
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
        toast.error("حدث خطأ في إغلاق النافذة", {
          timeout: 3000,
        });
      }
    };

    const submitFilters = () => {
      try {
        emit("update:modelValue", filters.value);
        emit("apply-filters", filters.value);
        toast.success("تم تطبيق الفلتر بنجاح", {
          timeout: 3000,
        });
        closeFilterModal();
      } catch (error) {
        toast.error("فشل في تطبيق الفلتر", {
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
        toast.success("تم إعادة تعيين الفلتر بنجاح", {
          timeout: 3000,
        });
      } catch (error) {
        toast.error("فشل في إعادة تعيين الفلتر", {
          timeout: 3000,
        });
      }
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
