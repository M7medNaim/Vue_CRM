<template>
  <header>
    <nav class="container-fluid p-0">
      <div class="row">
        <div class="col-12">
          <div class="d-flex flex-wrap align-items-center">
            <!-- Buttons Group -->
            <div class="col-md-auto">
              <button
                v-if="permissionStore.hasPermission(PERMISSIONS.CREATE_DEAL)"
                class="btn btn-header text-white px-2 py-2 me-2 fs-7 btnAddKanban"
                @click="openCreateDealModal"
              >
                <span class="textAddKanban">{{
                  t("kanban-button-add-deal")
                }}</span>
                <span class="iconAddKanban d-none">+</span>
              </button>
              <button
                class="btn btn-header text-white px-2 py-2 me-2 fs-7 btnKanban"
                @click="openCrmKanban"
                v-if="permissionStore.hasPermission(PERMISSIONS.DEALS_KANBAN)"
              >
                {{ t("header-subnav-item-kanban-crm") }}
              </button>
              <button
                class="btn btn-header text-white px-2 py-2 fs-7 btnKanban"
                @click="openCrmTasks"
                v-if="permissionStore.hasPermission(PERMISSIONS.TASKS_KANBAN)"
              >
                {{ t("header-subnav-item-kanban-tasks") }}
              </button>
            </div>

            <!-- Search Form -->
            <div :class="lgIpadClass">
              <div class="input-group">
                <button
                  class="btn btn-header btnSearchIpad"
                  @click="openSearchModalIpad"
                >
                  <i class="fa-solid fa-magnifying-glass text-white"></i>
                </button>
                <input
                  type="text"
                  class="form-control bg-light border-light py-2 inputSearchIpad"
                  :placeholder="t('crmlist-placeholder-search')"
                />
                <button
                  class="btn btn-header py-2 btnFilterIpad"
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
                    >{{ overdue_count }}</span
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
                    >{{ today_count }}</span
                  >
                  <span class="ms-1 text-white">{{
                    t("kanban-task-status-today")
                  }}</span>
                </div>
                <div
                  class="btn btn-header px-0 px-lg-1 d-flex align-items-center"
                >
                  <span
                    class="badge bg-secondary-subtle text-info fw-bold fs-6"
                    >{{ tomorrow_count }}</span
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
                    >{{ notasks_count }}</span
                  >
                  <span class="ms-1 text-white">{{
                    t("kanban-task-status-notasks")
                  }}</span>
                </div>
              </div>
              <div class="watsappIcon me-2">
                <button
                  class="rounded-2 d-flex align-items-center justify-content-center gap-1 border-0 fs-7 ms-2 whatsappIpad"
                  @click="openWhatsappModal"
                  style="background-color: #25d365cc; padding: 0.6rem 0.6rem"
                >
                  <i class="fa-brands fa-whatsapp text-white fs-5"></i>
                  <span class="text-white removeIpad" style="font-size: 14px">{{
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
                    class="d-flex align-items-center fs-7 justify-content-center gap-2 documentsIpad"
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
                class="btn btn-header flex-fill py-2 px-1 btnImport"
                @click="openImportModal"
              >
                <span class="fs-7 text-white textImport">{{
                  t("kanban-button-import")
                }}</span>
                <i class="fa-solid fa-upload ms-1 fs-7 text-white"></i>
              </button>
              <button
                class="btn btn-header flex-fill py-2 px-1 btnExport"
                @click="openExportModal"
              >
                <span class="fs-7 text-white textExport">{{
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
    <WhatsappModal
      ref="whatsappModalRef"
      :conversation="conversation"
      :new_message="local_new_message"
    />
    <SearchModalIpad ref="searchModalIpadRef" />
  </header>
</template>

<script>
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import FilterCrmList from "@/components/modals/FilterCrmList.vue";
import ImportModal from "@/components/modals/ImportModal.vue";
import ExportModal from "@/components/modals/ExportModal.vue";
import { Modal } from "bootstrap";
import CreateDealModal from "../kanban/CreateDealModal.vue";
import { usePermissionStore, PERMISSIONS } from "@/stores/permissionStore";
import { useI18n } from "vue-i18n";
import WhatsappModal from "@/components/modals/WhatsappModal.vue";
import SearchModalIpad from "@/components/headers/SearchModalIpad.vue";
import { fetchTasksCountByStageName } from "@/plugins/services/authService";

export default {
  name: "TopHeader2",
  components: {
    FilterCrmList,
    ImportModal,
    ExportModal,
    CreateDealModal,
    WhatsappModal,
    SearchModalIpad,
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

    selected_conversation: {
      type: Object,
      default: null,
    },

    new_message: {
      type: Object,
      default: null,
    },
  },
  emits: ["filter-applied", "reset-filter"],
  setup(props, { emit }) {
    const conversation = ref(null);
    const local_new_message = ref(null);
    const filterData = ref({ ...props.initialFilters });
    const permissionStore = usePermissionStore();
    const { t } = useI18n();
    const whatsappModalRef = ref(null);
    const overdue_count = ref(0);
    const today_count = ref(0);
    const tomorrow_count = ref(0);
    const notasks_count = ref(0);
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
    const isSmallScreen = ref(window.innerWidth < 1050);
    const handleResize = () => {
      isSmallScreen.value = window.innerWidth < 1050;
    };
    onMounted(() => {
      window.addEventListener("resize", handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", handleResize);
    });
    const openSearchModalIpad = () => {
      if (isSmallScreen.value) {
        const modal = new Modal(document.getElementById("searchIpadModal"));
        modal.show();
      }
    };
    const lgIpadClass = computed(() => {
      return isSmallScreen.value
        ? "col-md-auto mx-2"
        : "col-md mx-2 flex-grow-1";
    });
    const setConversation = (data) => {
      conversation.value = data;
    };
    const setNewMessage = (data) => {
      local_new_message.value = data;
    };
    const fetchTasksCounter = async () => {
      // Simulate fetching data from an API
      overdue_count.value = await fetchTasksCountByStageName("overdue"); // Example value
      today_count.value = await fetchTasksCountByStageName("today"); // Example value
      tomorrow_count.value = await fetchTasksCountByStageName("tomorrow"); // Example value
      notasks_count.value = await fetchTasksCountByStageName("notask"); // Example value
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
      openSearchModalIpad,
      lgIpadClass,
      conversation,
      setConversation,
      setNewMessage,
      local_new_message,
      overdue_count,
      today_count,
      tomorrow_count,
      notasks_count,
      fetchTasksCounter,
    };
  },

  watch: {
    selected_conversation(newValue) {
      if (newValue) {
        console.log("top header2 set conversation", newValue);
        this.openWhatsappModal();
        this.setConversation(newValue);
      }
    },
    new_message(newValue) {
      if (newValue) {
        console.log("top header2 new message", newValue);
        this.setNewMessage(newValue);
      }
    },
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
    padding: 0.35rem 0.7rem !important;
  }
  .whatsappIpad i {
    font-size: 1.7rem !important;
  }
  .documentsIpad {
    padding: 0px 7px !important;
  }
  .documentsIpad i {
    font-size: 1.3rem !important;
  }
  .textAddKanban {
    display: none;
  }
  .iconAddKanban {
    display: inline-block !important;
    font-size: 1.6rem !important;
    padding: 0 5px !important;
  }
  .btnAddKanban {
    padding: 0px 10px !important;
  }
  .textImport {
    display: none;
  }
  .textExport {
    display: none;
  }
  .btnImport {
    /* padding-right: 8px !important;
    padding-top: 10px !important;
    padding-bottom: 10px !important; */
    padding: 4px 13px 4px 10px !important;
    font-size: 1.2rem !important;
  }
  .btnExport {
    padding: 4px 13px 4px 10px !important;
    font-size: 1.2rem !important;
  }
  @media screen and (max-width: 1050px) {
    .inputSearchIpad {
      display: none;
    }
    .input-group {
      gap: 0.5rem;
    }
    .btnFilterIpad {
      border-radius: 0.35rem !important;
      font-size: 0.9rem !important;
    }
    .btnSearchIpad {
      border-radius: 0.35rem !important;
      font-size: 1rem !important;
    }
    .btnKanban {
      padding: 9px 10px !important;
    }
  }
}
</style>
