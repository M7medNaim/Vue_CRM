<template>
  <header>
    <nav class="container-fluid p-0 pe-2">
      <div class="row">
        <div class="col-12">
          <div
            class="d-flex flex-wrap align-items-center justify-content-between"
          >
            <!-- Buttons Group -->
            <div class="col-12 col-md-4 col-xl-auto mb-3 mb-xl-0">
              <button
                class="btn btn-light px-4 py-2 fw-semibold me-2"
                @click="openCreateDealModal"
              >
                {{ t("kanban-button-add-deal") }}
              </button>
              <button
                class="btn btn-light px-4 py-2 fw-semibold"
                @click="openCrmKanban"
                v-if="$route.name !== 'CrmKanban'"
              >
                {{ t("kanban-button-kanban-view") }}
              </button>
              <button
                class="btn btn-light px-4 py-2 fw-semibold"
                @click="openCrmTasks"
                v-if="
                  $route.name !== 'CrmTasks' &&
                  permissionStore.hasPermission(PERMISSIONS.TASKS_KANBAN)
                "
              >
                {{ t("kanban-button-tasks-view") }}
              </button>
            </div>

            <!-- Search Form -->
            <div
              class="col-12 col-md-4 col-xl-auto flex-xl-grow-1 mx-xl-3 mb-3 mb-xl-0"
            >
              <div class="input-group">
                <button class="btn btn-primary">
                  <i class="fa-solid fa-magnifying-glass"></i>
                </button>
                <input
                  type="text"
                  class="form-control bg-light border-light py-2"
                  :placeholder="t('crmlist-placeholder-search')"
                />
                <button
                  class="btn btn-primary"
                  :title="t('kanban-modal-filter-heading')"
                  @click="openFilterModal"
                >
                  <i class="fa-solid fa-filter"></i>
                </button>
              </div>
            </div>

            <!-- Tasks Status -->
            <div class="col-12 col-md-7 col-lg-auto mb-3 mb-md-0 mb-lg-0 me-3">
              <div class="btn-group w-100">
                <div class="btn btn-light px-1">
                  <span
                    class="badge bg-secondary-subtle text-danger fw-bold fs-6"
                    >99+</span
                  >
                  <span class="ms-1">{{
                    t("kanban-task-status-overdue")
                  }}</span>
                </div>
                <div class="btn btn-light px-1">
                  <span
                    class="badge bg-secondary-subtle text-warning fw-bold fs-6"
                    >15</span
                  >
                  <span class="ms-1">{{ t("kanban-task-status-today") }}</span>
                </div>
                <div class="btn btn-light px-1">
                  <span class="badge bg-secondary-subtle text-info fw-bold fs-6"
                    >4</span
                  >
                  <span class="ms-1">{{
                    t("kanban-task-status-tomorrow")
                  }}</span>
                </div>
                <div class="btn btn-light px-1">
                  <span
                    class="badge bg-secondary-subtle text-secondary fw-bold fs-6"
                    >99+</span
                  >
                  <span class="ms-1">{{
                    t("kanban-task-status-notasks")
                  }}</span>
                </div>
              </div>
            </div>
            <!-- Import/Export Buttons -->
            <div class="col-12 col-md-5 col-xl-auto d-flex gap-2 ms-1">
              <button
                class="btn btn-light flex-fill py-2"
                @click="openImportModal"
              >
                <span>{{ t("kanban-button-import") }}</span>
                <i class="fa-solid fa-upload ms-1"></i>
              </button>
              <button
                class="btn btn-light flex-fill py-2"
                @click="openExportModal"
              >
                <span>{{ t("kanban-button-export") }}</span>
                <i class="fa-solid fa-download ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <FilterCrmList
      v-model="filterData"
      @apply-filters="handleFilters"
      @reset-filter="handleResetFilter"
    />
    <ImportModal ref="importModalRef" />
    <ExportModal ref="exportModalRef" />
    <CreateDealModal ref="createDealModalRef" />
  </header>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import FilterCrmList from "@/components/modals/FilterCrmList.vue";
import ImportModal from "@/components/modals/ImportModal.vue";
import ExportModal from "@/components/modals/ExportModal.vue";
import { Modal } from "bootstrap";
import CreateDealModal from "../kanban/CreateDealModal.vue";
import { usePermissionStore, PERMISSIONS } from "@/stores/permissionStore";
import { useI18n } from "vue-i18n";

export default {
  name: "TopHeader2",
  components: {
    FilterCrmList,
    ImportModal,
    ExportModal,
    CreateDealModal,
  },
  props: {
    initialFilters: {
      type: Object,
      default: () => ({
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
      }),
    },
  },
  emits: ["filter-applied", "reset-filter"],
  setup(props, { emit }) {
    const filterData = ref({ ...props.initialFilters });
    const permissionStore = usePermissionStore();
    const { t } = useI18n();
    watch(
      () => props.initialFilters,
      (newFilters) => {
        filterData.value = { ...newFilters };
      },
      { deep: true }
    );
    const openFilterModal = () => {
      const modal = new Modal(document.getElementById("filterModal"));
      modal.show();
    };
    // Import Modal
    const openImportModal = () => {
      const modal = new Modal(document.getElementById("importModal"));
      modal.show();
    };
    const openExportModal = () => {
      const modal = new Modal(document.getElementById("exportModal"));
      modal.show();
    };
    const openCreateDealModal = () => {
      const modal = new Modal(document.getElementById("createDealModal"));
      modal.show();
    };
    const handleFilters = (filters) => {
      emit("filter-applied", filters);
    };

    const handleResetFilter = () => {
      emit("reset-filter");
    };
    const router = useRouter();
    const openCrmTasks = () => {
      router.push({ name: "CrmTasks" });
    };
    const openCrmKanban = () => {
      router.push({ name: "CrmKanban" });
    };
    return {
      filterData,
      openFilterModal,
      handleFilters,
      handleResetFilter,
      openImportModal,
      openExportModal,
      openCreateDealModal,
      openCrmTasks,
      openCrmKanban,
      permissionStore,
      PERMISSIONS,
      t,
    };
  },
};
</script>

<style scoped>
input:focus {
  box-shadow: none;
}

@media (max-width: 1200px) {
  .btn-group {
    display: flex !important;
  }
}
.btn {
  font-size: 14px;
}
</style>
