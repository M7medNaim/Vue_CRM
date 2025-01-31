<template>
  <div
    class="modal fade"
    id="filterModal"
    tabindex="-1"
    aria-labelledby="filterModalLabel"
    aria-hidden="true"
    ref="filterModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="filterModalLabel">تطبيق فلتر</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeFilterModal"
          ></button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body">
            <FilterForm :role="role" :status="status" @submit="applyFilters" />
          </div>
          <FilterButtons :loading="loading" @close="closeFilterModal" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import FilterForm from "@/components/filterElements/FilterForm.vue";
import FilterButtons from "@/components/filterElements/FilterButtons.vue";

export default {
  name: "FilterModal",
  components: { FilterForm, FilterButtons },
  data() {
    return {
      status: "",
      role: "",
      loading: false,
      modalInstance: null,
    };
  },
  mounted() {
    this.modalInstance = new Modal(this.$refs.filterModal);
  },
  methods: {
    openFilterModal() {
      this.modalInstance.show();
    },
    applyFilters(filters) {
      this.loading = true;
      this.$emit("apply-filters", filters);
      setTimeout(() => {
        this.loading = false;
        this.closeFilterModal();
      }, 1000);
    },
    closeFilterModal() {
      const modal = this.$refs.filterModal;
      const modalInstance = Modal.getInstance(modal);
      if (modalInstance) modalInstance.hide();
      document.querySelector(".modal-backdrop")?.remove();
      document.body.classList.remove("modal-open");
    },
  },
};
</script>
