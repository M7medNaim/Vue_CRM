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
        <form @submit.prevent="submitFilters">
          <div class="modal-body">
            <FilterForm
              v-model:role="role"
              v-model:status="status"
              v-model:createdAt="createdAt"
              v-model:perPage="perPage"
            />
          </div>
          <FilterButtons
            :loading="loading"
            @close="closeFilterModal"
            @reset-filters="resetFilters"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import FilterForm from "@/components/filterElements/FilterForm.vue";
import FilterButtons from "@/components/filterElements/FilterButtons.vue";
import { getRoles } from "@/plugins/services/authService";

export default {
  name: "FilterModal",
  components: { FilterForm, FilterButtons },
  data() {
    return {
      status: "",
      role: "",
      createdAt: "",
      perPage: "10",
      loading: false,
      modalInstance: null,
    };
  },
  mounted() {
    this.modalInstance = new Modal(this.$refs.filterModal);
  },
  methods: {
    openFilterModal() {
      this.fetchRoles();
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
    submitFilters() {
      this.loading = true;
      this.$emit("apply-filters", {
        role: this.role,
        status: this.status,
        createdAt: this.createdAt,
        perPage: this.perPage,
      });
      setTimeout(() => {
        this.loading = false;
        this.closeFilterModal();
      }, 1000);
    },
    resetFilters() {
      this.role = "";
      this.status = "";
      this.createdAt = "";
      this.perPage = "10";

      this.$emit("reset-filters");
      this.closeFilterModal();
    },
    async fetchRoles() {
      try {
        const response = await getRoles();
        this.roles = response.data.data;
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    },
  },
};
</script>
