<template>
  <div class="crm-container mt-3 bg-white rounded-3 me-2 p-3 pb-0">
    <div class="controls mb-3">
      <div class="row">
        <div class="col-sm-6 col-lg">
          <div class="input-group">
            <select
              v-model="selectedAction"
              class="text-secondary form-control"
            >
              <option value="" disabled>
                {{ t("crmlist-placeholder-action") }}
              </option>
              <option
                v-for="action in actions"
                :key="action.value"
                :value="action.value"
              >
                {{ action.label }}
              </option>
            </select>
            <button
              class="btn-actions btn btn-primary input-group-text"
              @click="executeAction"
              :disabled="!selectedAction || !selectedRows.length"
            >
              <span>{{ t("crmlist-button-actionsubmit") }}</span> ({{
                selectedRows.length
              }})
            </button>
          </div>
        </div>
        <div class="col-sm-6 col-lg">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              :placeholder="t('crmlist-placeholder-search')"
              v-model="search"
            />
            <button
              :title="t('buttons.filter')"
              type="button"
              class="btn btn-primary input-group-text"
              @click="openFilterModal"
            >
              <i class="fas fa-filter"></i>
            </button>
          </div>
        </div>
        <div class="col-sm-12 mt-2 mt-lg-0 col-lg text-end">
          <button
            class="btn btn-primary rounded-2 me-2 fs-7"
            @click="openDealModal"
          >
            <span>{{ t("kanban-button-add-deal") }}</span>
          </button>
          <button
            class="btn btn-primary rounded-2 fs-7"
            @click="openImportModal"
          >
            <i class="fa-solid fa-upload me-2"></i>
            <span>{{ t("crmlist-button-import") }}</span>
          </button>
        </div>
      </div>
    </div>

    <DataTable
      :value="filteredItems"
      :paginator="true"
      :rows="rowsPerPage"
      :rowsPerPageOptions="[10, 25, 50]"
      :total-records="totalRows"
      :lazy="true"
      :onLazyLoad="loadCarsLazy"
      :loading="loading"
      @page="onPageChange"
      v-model:selection="selectedRows"
      selectionMode="multiple"
      responsive="true"
    >
      <Column selectionMode="multiple" headerStyle="width: 3rem;"></Column>
      <Column :header="'#'">
        <template #body="slotProps">
          {{ slotProps.index + 1 + currentPage * rowsPerPage }}
        </template>
      </Column>
      <Column
        field="name"
        :header="t('crmlist-table-header-fullname')"
      ></Column>
      <Column field="phone" :header="t('crmlist-table-header-phone')"></Column>
      <!-- <Column :header="t('contacts-table-header-phone')">
        <template #body="slotProps">
          {{
            slotProps.data.phones && slotProps.data.phones.length > 0
              ? slotProps.data.phones.join(", ")
              : "N/A"
          }}
        </template>
      </Column> -->
      <Column field="note" :header="t('crmlist-table-header-notes')"></Column>
      <Column
        class="d-none d-lg-table-cell"
        field="created_at"
        :header="t('created at')"
      ></Column>
      <Column
        field="source"
        :header="t('crmlist-table-header-source')"
      ></Column>
      <Column field="stage" :header="t('crmlist-table-header-stage')"></Column>
      <!-- <Column
        field="responsible"
        :header="t('crmlist-table-header-responsible')"
      ></Column> -->
      <Column :header="t('crmlist-table-header-action')">
        <template #body="slotProps">
          <div class="d-flex gap-2">
            <button
              class="btn btn-sm btn-primary"
              @click="handleShowDeal(slotProps.data.id)"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="deleteItem(slotProps.data.id)"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </template>
      </Column>

      <template #loading>
        <div class="text-center loading-container">
          <div class="position-relative d-inline-block">
            <img
              src="../assets/new-nokta-logo.png"
              class="loading-logo"
              style="width: 50px; height: 50px"
            />
          </div>
          <div class="mt-2 text-primary">{{ t("tables.loading") }}</div>
        </div>
      </template>
    </DataTable>

    <ActionsDeal
      :selected-rows="selectedRows"
      @update-stage="(value) => handleBulkUpdate('stage_id', value)"
      @update-user="(value) => handleBulkUpdate('user_id', value)"
      @update-source="(value) => handleBulkUpdate('source_id', value)"
    />
  </div>
  <!-- filter modal -->
  <FilterCrmList
    v-model:filters="filters"
    @apply-filters="applyFilters"
    @reset-filter="resetFilter"
    :selectedStatuses="selectedStatuses"
  />
  <!-- @add-deal="addNewDeal" -->
  <DealModal @add-deal="addNewDeal" ref="dealModal" />
  <ImportModal />
  <ShowData :formData="dealData" ref="showDataModal" />
</template>
<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {
  getDeals,
  showDeal,
  deleteDeals,
  getSources,
  getStages,
  bulkUpdateDeals,
  bulkDeleteDeals,
} from "@/plugins/services/authService";
import ActionsDeal from "@/components/modals/ActionsDeal.vue";
import FilterCrmList from "@/components/modals/FilterCrmList.vue";
import DealModal from "@/components/modals/CreateDeal.vue";
import ImportModal from "@/components/modals/ImportModal.vue";
import ShowData from "@/components/modals/ShowData.vue";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import Swal from "sweetalert2";

const { t } = useI18n();
const toast = useToast();

// Table state
const rows = ref([]);
const loading = ref(false);
const totalRows = ref(0);
const currentPage = ref(0);
const rowsPerPage = ref(10);
const search = ref("");
const selectedRows = ref([]);
const selectedAction = ref("");
const selectedStatuses = ref([]);
const sources = ref([]);
const stages = ref([]);

const filters = ref({
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
});
const dealData = ref(null);
const showDataModal = ref(null);
// Actions operations
const actions = ref([
  { value: "changeStage", label: t("actions.changeStage") },
  { value: "assignUser", label: t("actions.assignUser") },
  { value: "changeSource", label: t("actions.changeSource") },
  { value: "delete", label: t("actions.delete") },
]);
const executeAction = () => {
  if (!selectedAction.value || selectedRows.value.length === 0) {
    alert("Please select an action and at least one item.");
    return;
  }

  let modalElement;
  let modal;

  switch (selectedAction.value) {
    case "changeStage":
      modalElement = document.getElementById("changeStageModal");
      if (modalElement) {
        modal = new Modal(modalElement, {
          backdrop: true,
          keyboard: true,
          focus: true,
        });
        modal.show();
      }
      break;

    // case "assignSalesSupervisor":
    //   modalElement = document.getElementById("assignSupervisorModal");
    //   if (modalElement) {
    //     modal = new Modal(modalElement, {
    //       backdrop: true,
    //       keyboard: true,
    //       focus: true,
    //     });
    //     modal.show();
    //   }
    //   break;

    case "assignUser":
      modalElement = document.getElementById("assignUser");
      if (modalElement) {
        modal = new Modal(modalElement, {
          backdrop: true,
          keyboard: true,
          focus: true,
        });
        modal.show();
      }
      break;

    case "changeSource":
      modalElement = document.getElementById("changeSourceModal");
      if (modalElement) {
        modal = new Modal(modalElement, {
          backdrop: true,
          keyboard: true,
          focus: true,
        });
        modal.show();
      }
      break;

    case "delete":
      bulkDeleteItems();
      break;
  }
};
// Fetch data from the server
const fetchData = async () => {
  try {
    loading.value = true;

    if (stages.value.length === 0 || sources.value.length === 0) {
      await fetchStagesAndSources();
    }
    // if (stages.value.length === 0 || sources.value.length === 0) {
    //   const [stagesRes, sourcesRes] = await Promise.all([
    //     getStages(),
    //     getSources(),
    //   ]);
    //   stages.value = stagesRes.data.data;
    //   sources.value = sourcesRes.data.data;
    // }

    const dealsRes = await getDeals({
      page: currentPage.value + 1,
      per_page: rowsPerPage.value,
      sort_by: "created_at",
      sort_order: "desc",
    });

    if (!Array.isArray(dealsRes?.data?.data)) {
      toast.info(t("noDealsFound"));
    }
    rows.value = dealsRes.data.data.map((deal) => {
      const matchedStage = stages.value.find(
        (stage) => stage.id === deal.stage_id
      );
      const matchedSource = sources.value.find(
        (source) => source.id === deal.source_id
      );

      return {
        id: deal.id,
        name: deal.name || "unassigned",
        // phone1: deal.contact.phones?.[0] || "",
        // phone2: deal.contact.phones?.[1] || "",
        phone: deal.phone,
        note: deal.note || "unassigned",
        created_at: deal.created_at.split("T")[0],
        stage: matchedStage ? matchedStage.name : "null",
        responsible: deal.name || "Null",
        source: matchedSource ? matchedSource.name : "Null",
      };
    });

    totalRows.value = dealsRes.data.meta.total;
  } catch (error) {
    console.error("Error fetching data:", error);
    toast.error(t("error.fetchFailed"));
    rows.value = [];
    totalRows.value = 0;
  } finally {
    loading.value = false;
  }
};

// Handle page change event
const onPageChange = (event) => {
  currentPage.value = event.page;
  rowsPerPage.value = event.rows;
  fetchData();
};
const deleteItem = async (id) => {
  try {
    const result = await Swal.fire({
      title: t("error.deleteTitle"),
      text: t("error.deleteText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("success.deleteConfirm"),
      cancelButtonText: t("error.deleteCancel"),
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await deleteDeals([id]);
      rows.value = rows.value.filter((item) => item.id !== id);
      toast.success(t("success.deleteSuccess"), { timeout: 3000 });
    }
  } catch (error) {
    toast.error(t("error.deleteFailed"), { timeout: 3000 });
    console.error("Delete Error:", error);
  }
};
const handleShowDeal = async (dealId) => {
  try {
    const response = await showDeal(dealId);
    const deal = response.data.data;
    const matchedStage = stages.value.find(
      (stage) => stage.id === deal.stage_id
    );
    const matchedSource = sources.value.find(
      (source) => source.id === deal.source_id
    );
    dealData.value = {
      name: deal.contact?.name || "unassigned",
      nickname: deal.contact?.nickname || "unassigned",
      address: deal.contact?.address || "unassigned",
      country: deal.contact?.country || "unassigned",
      email: deal.contact?.email || "unassigned",
      phone: deal.contact?.phones?.[0]?.phone || "unassigned",
      note: deal.note || "unassigned",
      rating: deal.rating || "unassigned",
      created_at: deal.created_at
        ? new Date(deal.created_at).toISOString().split("T")[0]
        : "",
      updated_at: deal.updated_at
        ? new Date(deal.updated_at).toISOString().split("T")[0]
        : "",
      stage_name: matchedStage?.name || "Unassigned",
      source_name: matchedSource?.name || "Unassigned",
      responsablePerson: deal.responsible_user.name || "unassigned",
    };

    showDataModal.value?.openShowData();
  } catch (error) {
    console.error("Error fetching deal data:", error);
  }
};

const applyFilters = async (newFilters) => {
  try {
    filters.value = { ...newFilters };

    const response = await getDeals(filters.value);
    rows.value = response.data.data;
  } catch (error) {
    console.error("Filter Error:", error);
  }
};

// create New Deal Modal
const openDealModal = () => {
  const modalElement = document.getElementById("dealModal");
  const modal = new Modal(modalElement);
  modal.show();
};
// const addNewDeal = (newDeal) => {
//   try {
//     const formattedDeal = {
//       id: newDeal.id,
//       name: newDeal.contact.name,
//       phones: newDeal.contact.phones.join(", "),
//       email: newDeal.contact.email,
//       note: newDeal.note,
//       created_at: new Date().toISOString().split("T")[0],
//       source: newDeal.source_id,
//       stage: newDeal.stage_id,
//       responsible: newDeal.responsible_user_id,
//     };

//     rows.value = [...rows.value, formattedDeal];
//     const modal = new Modal(document.getElementById("dealModal"));
//     modal.hide();
//   } catch (error) {
//     console.error("Error fetching user data for new deal:", error);
//   }
// };

// Filtered items search and filters
const filteredItems = computed(() => {
  return rows.value.filter((item) => {
    const searchLower = search.value.toLowerCase();

    const matchesSearch =
      !search.value ||
      item.name?.toLowerCase().includes(searchLower) ||
      item.phone?.includes(search.value) ||
      item.note?.toLowerCase().includes(searchLower) ||
      item.source?.toLowerCase().includes(searchLower) ||
      item.stage?.toLowerCase().includes(searchLower) ||
      item.responsible?.toLowerCase().includes(searchLower);

    // Filters
    const matchesSource =
      !filters.value.source || item.source === filters.value.source;
    const matchesStage =
      !filters.value.stage || item.stage === filters.value.stage;
    const matchesSupervisor =
      !filters.value.supervisor || item.supervisor === filters.value.supervisor;
    const matchesRepresentative =
      !filters.value.representative ||
      item.representative === filters.value.representative;
    const matchesPackage =
      !filters.value.package || item.package === filters.value.package;

    // Date filters
    const matchesCreatedDate =
      (!filters.value.createdStart ||
        new Date(item.created_at) >= new Date(filters.value.createdStart)) &&
      (!filters.value.createdEnd ||
        new Date(item.created_at) <= new Date(filters.value.createdEnd));

    const matchesModifiedDate =
      (!filters.value.modifiedStart ||
        new Date(item.updated_at) >= new Date(filters.value.modifiedStart)) &&
      (!filters.value.modifiedEnd ||
        new Date(item.updated_at) <= new Date(filters.value.modifiedEnd));

    // Status filter
    const matchesStatus =
      filters.value.status.length === 0 ||
      filters.value.status.includes(item.status);

    return (
      matchesSearch &&
      matchesSource &&
      matchesStage &&
      matchesSupervisor &&
      matchesRepresentative &&
      matchesPackage &&
      matchesCreatedDate &&
      matchesModifiedDate &&
      matchesStatus
    );
  });
});
// Opening and closing modals
const resetFilter = () => {
  filters.value = {
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
  selectedStatuses.value = [];
};

const openFilterModal = () => {
  const modalElement = document.getElementById("filterModal");
  const modal = new Modal(modalElement);
  modal.show();
};
const openImportModal = () => {
  const modalElement = document.getElementById("importModal");
  const modal = new Modal(modalElement);
  modal.show();
};
// const handleDelete = async () => {
//   try {
//     const selectedIds = selectedRows.value.map((row) => row.id);

//     const result = await Swal.fire({
//       title: t("error.deleteTitle"),
//       text: t("error.deleteText"),
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: t("success.deleteConfirm"),
//       cancelButtonText: t("error.deleteCancel"),
//       reverseButtons: true,
//     });

//     if (result.isConfirmed) {
//       const response = await deleteDeals(selectedIds);

//       if (response.data.success) {
//         rows.value = rows.value.filter(
//           (item) => !selectedIds.includes(item.id)
//         );
//         selectedRows.value = [];
//         selectedAction.value = "";

//         toast.success(t("success.deleteSuccess"), {
//           timeout: 3000,
//         });
//       } else {
//         throw new Error(response.data.message || t("error.deleteFailed"));
//       }
//     }
//   } catch (error) {
//     toast.error(error.response?.data?.message || t("error.deleteFailed"), {
//       timeout: 3000,
//     });
//     console.error("Delete Error:", error);
//   }
// };

// const handleRowClick = (item, event) => {
//   if (event?.target?.closest("button")) {
//     return;
//   }

//   const checkbox = event.currentTarget.querySelector('input[type="checkbox"]');
//   const isSelected = selectedRows.value.some((row) => row.id === item.id);

//   if (isSelected) {
//     selectedRows.value = selectedRows.value.filter((row) => row.id !== item.id);
//     if (checkbox) {
//       checkbox.checked = false;
//     }
//   } else {
//     selectedRows.value = [...selectedRows.value, item];
//     if (checkbox) {
//       checkbox.checked = true;
//     }
//   }
// };
const handleRightClick = (event) => {
  event.preventDefault();
  const modalElements = document.querySelectorAll(".modal");
  modalElements.forEach((modal) => {
    if (modal.classList.contains("show")) {
      const closeButton = modal.querySelector('[data-bs-dismiss="modal"]');
      if (closeButton) {
        closeButton.click();
      }
    }
  });
};
const fetchStagesAndSources = async () => {
  try {
    if (stages.value.length === 0 || sources.value.length === 0) {
      const [stagesRes, sourcesRes] = await Promise.all([
        getStages(),
        getSources(),
      ]);
      stages.value = stagesRes.data.data;
      sources.value = sourcesRes.data.data;
    }
  } catch (error) {
    console.error("Error fetching stages and sources:", error);
  }
};

const loadCarsLazy = async (event) => {
  try {
    const response = await getDeals({
      page: event.page + 1,
      per_page: event.rows,
      sort_by: "created_at",
      sort_order: "desc",
    });
    rows.value = response.data.data;
    totalRows.value = response.data.meta.total;
  } catch (error) {
    console.error("Error fetching lazy data:", error);
    toast.error(t("error.fetchFailed"));
  }
};

const handleBulkUpdate = async (key, value) => {
  try {
    const selectedIds = selectedRows.value.map((row) => row.id);

    if (selectedIds.length === 0) {
      toast.error(t("error.noItemsSelected"), { timeout: 3000 });
      return;
    }

    const response = await bulkUpdateDeals(
      selectedIds,
      String(key),
      String(value)
    );

    if (
      response.data.success ||
      response.data.message === "Deals updated successfully"
    ) {
      await fetchData();
      selectedRows.value = [];
      selectedAction.value = "";

      let modalElement;
      let modal;

      switch (key) {
        case "stage_id":
          modalElement = document.getElementById("changeStageModal");
          break;
        case "user_id":
          modalElement = document.getElementById("assignUser");
          break;
        case "source_id":
          modalElement = document.getElementById("changeSourceModal");
          break;
      }

      if (modalElement) {
        modal = Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }

      toast.success(t("success.bulkUpdateSuccess"), { timeout: 3000 });
    } else {
      console.error(
        "Error updating stage:",
        response.data.message || "Unknown error"
      );
    }
  } catch (error) {
    toast.error(error.response?.data?.message || t("error.bulkUpdateFailed"), {
      timeout: 3000,
    });
    console.error("Bulk Update Error:", error);
  }
};

const bulkDeleteItems = async () => {
  try {
    const ids = selectedRows.value.map((row) => row.id);

    if (ids.length === 0) {
      toast.error(t("error.noItemsSelected"), { timeout: 3000 });
      return;
    }

    const result = await Swal.fire({
      title: t("error.deleteTitle"),
      text: t("error.deleteText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("success.deleteConfirm"),
      cancelButtonText: t("error.deleteCancel"),
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      console.log("IDs to delete:", ids);
      const response = await bulkDeleteDeals(ids);
      console.log("Delete response:", response);

      if (response.status === 204 || response.data?.success) {
        rows.value = rows.value.filter((item) => !ids.includes(item.id));
        selectedRows.value = [];
        selectedAction.value = "";

        toast.success(t("success.deleteSuccess"), { timeout: 3000 });
      } else {
        throw new Error(response.data.message || t("error.deleteFailed"));
      }
    }
  } catch (error) {
    console.error("Bulk Delete Error:", error);
    toast.error(error.response?.data?.message || t("error.deleteFailed"), {
      timeout: 3000,
    });
  }
};

const addNewDeal = (newDeal) => {
  try {
    const formattedDeal = {
      id: newDeal.id,
      name: newDeal.name,
      phones: newDeal.phone,
      email: newDeal.email,
      note: newDeal.note,
      created_at: new Date().toISOString().split("T")[0],
      source_id: newDeal.source_id,
      stage_id: newDeal.stage_id,
      responsible_user: newDeal.responsible_user,
      rating: newDeal.rating,
    };

    rows.value = [...rows.value, formattedDeal];
    const modal = Modal.getInstance(document.getElementById("dealModal"));
    if (modal) {
      modal.hide();
    }
  } catch (error) {
    console.error("Error fetching user data for new deal:", error);
  }
};

onMounted(async () => {
  // await fetchStagesAndSources();
  await fetchData();
  const modalElements = document.querySelectorAll(".modal");
  modalElements.forEach((element) => {
    new Modal(element, {
      backdrop: true,
      keyboard: true,
      focus: true,
    });
  });
  window.addEventListener("contextmenu", handleRightClick);
});
onUnmounted(() => {
  window.removeEventListener("contextmenu", handleRightClick);
});
</script>
<style scoped>
.crm-container {
  width: 100%;
}
input:focus {
  box-shadow: none;
  border: 1px solid #333;
}
.btn-actions {
  font-size: 14px;
}
select {
  border: 2px solid #eee;
}
select:focus {
  box-shadow: none;
  border: 2px solid #eee;
  font-size: 14px;
}
:deep(.custom-table) {
  --easy-table-row-height: 45px;
  --easy-table-header-height: 30px;
  --easy-table-body-row-font-size: 15px;
  --easy-table-header-font-size: 13px;
}
/* media query for small screens */
@media (max-width: 850px) {
  .create-at-column {
    display: none;
  }
}

/* Better padding for action buttons */
:deep(.custom-table .btns) {
  padding: 5px 0;
  font-size: 12px;
}

:deep(.custom-table tbody tr) {
  cursor: pointer;
  user-select: none;
}

:deep(.custom-table tbody tr:hover) {
  background-color: rgba(0, 0, 0, 0.05);
}

:deep(.custom-table td) {
  pointer-events: auto;
}

.loading-logo {
  animation: pulse-and-spin 2s infinite linear;
  z-index: 2;
}

@keyframes pulse-and-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
:deep(.sorted-asc),
:deep(.sorted-desc) {
  background-color: rgba(0, 0, 0, 0.05);
}

:deep(.sortable):hover {
  background-color: rgba(0, 0, 0, 0.02);
  cursor: pointer;
}

:deep(.pagination-container) {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.page-info) {
  font-size: 0.9rem;
  color: #666;
}

:deep(.p-datatable) {
  font-size: 14px;
}

:deep(.p-datatable th),
:deep(.p-datatable td) {
  padding: 8px;
}

:deep(.p-datatable thead th) {
  font-weight: bold;
  text-align: center;
}

:deep(.p-datatable tbody td) {
  text-align: left;
}
@media (max-width: 850px) {
  .fs-7 {
    font-size: 14px;
  }
}
</style>
