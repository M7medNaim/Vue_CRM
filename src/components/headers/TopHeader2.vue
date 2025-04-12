<template>
  <header>
    <nav class="container-fluid p-0">
      <div class="row">
        <div class="col-12">
          <div class="d-flex flex-wrap align-items-center">
            <!-- Buttons Group -->
            <div class="col-md-auto mb-2 mb-xl-0">
              <button
                v-if="permissionStore.hasPermission(PERMISSIONS.CREATE_DEAL)"
                class="btn btn-header text-white px-2 py-2 fw-semibold me-2"
                @click="openCreateDealModal"
              >
                {{ t("kanban-button-add-deal") }}
              </button>
              <button
                class="btn btn-header text-white px-2 py-2 me-2 fw-semibold"
                @click="openCrmKanban"
                v-if="
                  $route.name !== 'CrmKanban' &&
                  permissionStore.hasPermission(PERMISSIONS.DEALS_KANBAN)
                "
              >
                {{ t("header-subnav-item-kanban-crm") }}
              </button>
              <button
                class="btn btn-header text-white px-2 py-2 fw-semibold"
                @click="openCrmTasks"
              >
                {{ t("header-subnav-item-kanban-tasks") }}
              </button>
            </div>

            <!-- Search Form -->
            <div class="col-md mb-2 mb-xl-0 mx-2 flex-grow-1">
              <div class="input-group">
                <button class="btn btn-header">
                  <i class="fa-solid fa-magnifying-glass text-white"></i>
                </button>
                <input
                  type="text"
                  class="form-control bg-light border-light py-2"
                  :placeholder="t('crmlist-placeholder-search')"
                />
                <button
                  class="btn btn-header"
                  :title="t('kanban-modal-filter-heading')"
                  @click="openFilterModal"
                >
                  <i class="fa-solid fa-filter text-white"></i>
                </button>
              </div>
            </div>

            <!-- Tasks Status -->
            <div
              class="col-md-auto mb-2 mb-md-0 me-2 d-flex align-items-center"
            >
              <div class="btn-group w-100">
                <div
                  class="btn btn-header px-0 px-lg-1 d-flex align-items-center"
                >
                  <span
                    class="badge bg-secondary-subtle text-danger fw-bold fs-6"
                    >99+</span
                  >
                  <span class="ms-1 text-white">{{
                    t("kanban-task-status-overdue")
                  }}</span>
                </div>
                <div
                  class="btn btn-header px-0 px-lg-1 d-flex align-items-center"
                >
                  <span
                    class="badge bg-secondary-subtle text-warning fw-bold fs-6"
                    >15</span
                  >
                  <span class="ms-1 text-white">{{
                    t("kanban-task-status-today")
                  }}</span>
                </div>
                <div
                  class="btn btn-header px-0 px-lg-1 d-flex align-items-center"
                >
                  <span class="badge bg-secondary-subtle text-info fw-bold fs-6"
                    >4</span
                  >
                  <span class="ms-1 text-white">{{
                    t("kanban-task-status-tomorrow")
                  }}</span>
                </div>
                <div
                  class="btn btn-header px-1 px-lg-1 d-flex align-items-center"
                >
                  <span
                    class="badge bg-secondary-subtle text-secondary fw-bold fs-6"
                    >99+</span
                  >
                  <span class="ms-1 text-white">{{
                    t("kanban-task-status-notasks")
                  }}</span>
                </div>
              </div>
              <div class="watsappIcon me-2">
                <button
                  class="rounded-2 d-flex align-items-center justify-content-center gap-1 border-0 p-2 fs-7 ms-2 whatsappIpad"
                  @click="openWhatsappModal"
                  style="background-color: #25d365cc"
                >
                  <i class="fa-brands fa-whatsapp text-white fs-5"></i>
                  <span class="text-white fs-7 removeIpad">{{
                    $t("kanban-modal-edit-whatsapp")
                  }}</span>
                </button>
              </div>
              <div class="documents btn btn-header p-2">
                <!-- v-if="permissionStore.hasPermission(PERMISSIONS.DOCUMENTS)" -->
                <router-link
                  to="/documents"
                  class="text-decoration-none text-white"
                >
                  <div
                    class="d-flex align-items-center justify-content-center gap-2 documentsIpad"
                    :title="$t('sidebar-nav-item-documents')"
                  >
                    <i class="fa-regular fa-folder-open fs-6"></i>
                    <span class="fs-7 removeIpad">{{
                      $t("sidebar-nav-item-documents")
                    }}</span>
                  </div>
                </router-link>
              </div>
            </div>
            <!-- Import/Export Buttons -->
            <div
              v-if="permissionStore.hasPermission(PERMISSIONS.CREATE_DEAL)"
              class="col-md-auto d-flex align-items-center gap-2"
            >
              <button
                class="btn btn-header flex-fill py-2 px-1"
                @click="openImportModal"
              >
                <span class="fs-7 text-white">{{
                  t("kanban-button-import")
                }}</span>
                <i class="fa-solid fa-upload ms-1 fs-7 text-white"></i>
              </button>
              <button
                class="btn btn-header flex-fill py-2 px-1"
                @click="openExportModal"
              >
                <span class="fs-7 text-white">{{
                  t("kanban-button-export")
                }}</span>
                <i class="fa-solid fa-download ms-1 fs-7 text-white"></i>
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
    <WhatsappModal ref="whatsappModalRef" />
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
import WhatsappModal from "@/components/modals/WhatsappModal.vue";

export default {
  name: "TopHeader2",
  components: {
    FilterCrmList,
    ImportModal,
    ExportModal,
    CreateDealModal,
    WhatsappModal,
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
    const whatsappModalRef = ref(null);
    const openWhatsappModal = () => {
      try {
        const modal = new Modal(document.getElementById("whatsappModal"));
        modal.show();
      } catch (error) {
        console.error("Error opening WhatsApp modal:", error);
      }
    };
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
      whatsappModalRef,
      openWhatsappModal,
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
@media (max-width: 850px) {
  .btn-group .btn span {
    font-size: 12px;
  }
  .fs-7 {
    font-size: 12px;
  }
}
.btn {
  font-size: 14px;
}
.btn-header {
  background-color: rgba(128, 128, 128, 0.8) !important;
}
@media (max-width: 1200px) {
  .removeIpad {
    display: none;
  }
  .whatsappIpad {
    padding: 0.5rem 0.7rem !important;
  }
  .whatsappIpad i {
    font-size: 1.5rem !important;
  }
  .documentsIpad {
    padding: 0 !important;
  }
  .documentsIpad i {
    font-size: 1.1rem !important;
    padding: 0.1rem !important;
  }
}
</style>
