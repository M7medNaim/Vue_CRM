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
              []
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
          <div class="input-group position-relative">
            <input
              type="search"
              class="form-control"
              :placeholder="t('crmlist-placeholder-search')"
              v-model="searchInput"
              @search="fetchData"
            />
            <i
              v-if="searchInput"
              class="fas fa-times clear-icon p-2 rounded-2"
              @click="clearSearch"
              title="Clear Search"
            >
              CLR
            </i>
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
      :value="rows"
      :paginator="true"
      :rows="rowsPerPage"
      :rowsPerPageOptions="[10, 25, 50]"
      :total-records="totalRows"
      :lazy="true"
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
      <Column
        field="note"
        :header="t('crmlist-table-header-notes')"
        class="note-column"
      ></Column>
      <Column
        field="responsible"
        :header="t('crmlist-table-header-responsible')"
      ></Column>
      <Column
        class="d-lg-table-cell"
        field="created_at"
        :header="t('crmlist-table-header-createdat')"
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
              src="../assets/Mediceva-Logo.png"
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
    :stages="stages"
    :sources="sources"
    :users="users"
  />
  <!-- @add-deal="addNewDeal" -->
  <DealModal @add-deal="addNewDeal" ref="dealModal" />
  <ImportModal @import-complete="fetchData" />
  <ShowData :formData="dealData" ref="showDataModal" />
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
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
  getAllUsers,
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
const searchInput = ref("");
const selectedRows = ref([]);
const selectedAction = ref("");
const selectedStatuses = ref([]);
const sources = ref([]);
const stages = ref([]);
const users = ref([]);

const filters = ref({
  source: "",
  stage: "",
  supervisor: "",
  representative: "",
  package: "",
  created_at_start: "",
  created_at_end: "",
  updated_at_start: "",
  updated_at_end: "",
  status: [],
});
const dealData = ref(null);
const showDataModal = ref(null);
// Actions operations
const actions = ref([
  { value: "changeStage", label: t("crmlist-action-changestage") },
  { value: "assignUser", label: t("crmlist-action-assignto") },
  { value: "changeSource", label: t("crmlist-action-changesource") },
  { value: "delete", label: t("crmlist-action-delete") },
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

    console.log("filters", filters.value);

    const dealsRes = await getDeals({
      search: searchInput.value,
      page: currentPage.value + 1,
      per_page: rowsPerPage.value,
      sort_by: "created_at",
      sort_order: "desc",
      filters: filters.value,
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
        name: deal.name || "Empty",
        // phone1: deal.contact.phones?.[0] || "",
        // phone2: deal.contact.phones?.[1] || "",
        phone: deal.phone,
        note: deal.note || "Empty",
        created_at: deal.created_at.split("T")[0],
        stage: matchedStage ? matchedStage.name : "Not set",
        responsible: deal.responsible_user?.name || "Not Assigned",
        source: matchedSource ? matchedSource.name : "Not set",
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
  applyFilters(filters.value); // Reapply current filters with new pagination
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
      name: deal.contact?.name || "Empty",
      nickname: deal.contact?.nickname || "Empty",
      address: deal.contact?.address || "Empty",
      country: deal.contact?.country || "Empty",
      email: deal.contact?.email || "Empty",
      phone: deal.contact?.phones?.[0]?.phone || "Empty",
      note: deal.note || "Empty",
      rating: deal.rating || "Empty",
      created_at: deal.created_at
        ? new Date(deal.created_at).toISOString().split("T")[0]
        : "",
      updated_at: deal.updated_at
        ? new Date(deal.updated_at).toISOString().split("T")[0]
        : "",
      stage_name: matchedStage?.name || "Empty",
      source_name: matchedSource?.name || "Empty",
      responsablePerson: deal.responsible_user.name || "Not assigned",
    };

    showDataModal.value?.openShowData();
  } catch (error) {
    console.error("Error fetching deal data:", error);
  }
};

const applyFilters = async (newFilters) => {
  try {
    loading.value = true;
    filters.value = { ...newFilters };

    // Build filters object in the correct format
    const apiFilters = {
      page: currentPage.value + 1,
      per_page: rowsPerPage.value,
      sort_by: "created_at",
      sort_type: "desc",
    };

    // Add filters directly to the main object
    if (filters.value.source) {
      apiFilters["filters[source_id]"] = parseInt(filters.value.source);
    }

    if (filters.value.stage) {
      apiFilters["filters[stage_id]"] = parseInt(filters.value.stage);
    }

    // Add status filters
    if (Array.isArray(filters.value.status)) {
      if (filters.value.status.includes("unassigned")) {
        apiFilters["filters[unassigned]"] = 1;
      }
      if (filters.value.status.includes("no_comments")) {
        apiFilters["filters[uncommented]"] = 1;
      }
      if (filters.value.status.includes("no_task")) {
        apiFilters["filters[no_tasks]"] = 1;
      }
      if (filters.value.status.includes("overdue")) {
        apiFilters["filters[overdue]"] = 1;
      }
      if (filters.value.status.includes("new")) {
        apiFilters["filters[new]"] = 1;
      }
      if (filters.value.status.includes("reclaimed")) {
        apiFilters["filters[reclaimed]"] = 1;
      }
    }

    // Add date filters
    if (filters.value.createdStart) {
      apiFilters["filters[created_at_start]"] = filters.value.createdStart;
    }
    if (filters.value.createdEnd) {
      apiFilters["filters[created_at_end]"] = filters.value.createdEnd;
    }
    if (filters.value.modifiedStart) {
      apiFilters["filters[updated_at_start]"] = filters.value.modifiedStart;
    }
    if (filters.value.modifiedEnd) {
      apiFilters["filters[updated_at_end]"] = filters.value.modifiedEnd;
    }

    // Add other filters
    if (filters.value.representative) {
      apiFilters["filters[user_id]"] = parseInt(filters.value.representative);
    }
    if (filters.value.package) {
      apiFilters["filters[package_id]"] = parseInt(filters.value.package);
    }

    console.log("API Filters:", apiFilters);
    console.log("API Request URL:", new URLSearchParams(apiFilters).toString());

    const response = await getDeals(apiFilters);
    console.log("API Response:", response);

    if (!response?.data?.data) {
      toast.info(t("noDealsFound"));
      rows.value = [];
      totalRows.value = 0;
      return;
    }

    // Make sure we have stages and sources loaded
    if (stages.value.length === 0 || sources.value.length === 0) {
      await fetchStagesAndSources();
    }

    rows.value = response.data.data.map((deal) => {
      const matchedStage = stages.value.find(
        (stage) => stage.id === deal.stage_id
      );
      const matchedSource = sources.value.find(
        (source) => source.id === deal.source_id
      );

      return {
        id: deal.id,
        name: deal.name || "Empty",
        phone: deal.phone,
        note: deal.note || "Empty",
        created_at: deal.created_at.split("T")[0],
        stage: matchedStage ? matchedStage.name : "Not set",
        responsible: deal.responsible_user?.name || "Not Assigned",
        source: matchedSource ? matchedSource.name : "Not set",
      };
    });

    totalRows.value = response.data.meta.total;
    toast.success(t("success.applyFilters"), { timeout: 3000 });
  } catch (error) {
    console.error("Filter Error:", error);
    toast.error(t("error.applyFilters"), { timeout: 3000 });
    rows.value = [];
    totalRows.value = 0;
  } finally {
    loading.value = false;
  }
};

// create New Deal Modal
const openDealModal = () => {
  const modalElement = document.getElementById("dealModal");
  const modal = new Modal(modalElement);
  modal.show();
};

const clearSearch = () => {
  searchInput.value = "";
  search.value = "";
  fetchData();
};

// Opening and closing modals
const resetFilter = () => {
  filters.value = {
    source: "",
    stage: "",
    supervisor: "",
    representative: "",
    package: "",
    created_at_start: "",
    created_at_end: "",
    updated_at_start: "",
    updated_at_end: "",
    status: [],
  };
  selectedStatuses.value = [];
  fetchData(); // Fetch data with default filters
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
      console.log("Fetching stages and sources...");
      const stage_res = await getStages();
      const source_res = await getSources();
      stages.value = stage_res.data.data;
      sources.value = source_res.data.data;
      console.log("Fetched stages and sources:", {
        stages: stages.value,
        sources: sources.value,
      });
    }
  } catch (error) {
    console.error("Error fetching stages and sources:", error);
  }
};

const fetchUsers = async () => {
  try {
    const response = await getAllUsers();
    if (response.status === 200) {
      users.value = response.data.data.map((user) => ({
        id: user.id,
        name: user.name,
        role: user.role,
      }));
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// const loadCarsLazy = async (event) => {
//   try {
//     const response = await getDeals({
//       page: event.page + 1,
//       per_page: event.rows,
//       sort_by: "created_at",
//       sort_order: "desc",
//     });
//     rows.value = response.data.data;
//     totalRows.value = response.data.meta.total;
//   } catch (error) {
//     console.error("Error fetching lazy data:", error);
//     toast.error(t("error.fetchFailed"));
//   }
// };

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
    const matchedStage = stages.value.find(
      (stage) => stage.id === newDeal.stage_id
    );
    const matchedSource = sources.value.find(
      (source) => source.id === newDeal.source_id
    );
    const formattedDeal = {
      id: newDeal.id,
      name: newDeal.name,
      phone: newDeal.phone,
      email: newDeal.email,
      note: newDeal.note,
      created_at: new Date().toISOString().split("T")[0],
      source: matchedSource ? matchedSource.name : "Not set",
      stage: matchedStage ? matchedStage.name : "Not set",
      responsible: newDeal.responsible_user?.name || "Not Assigned",
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
  fetchUsers();
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

:deep(.note-column) {
  max-width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 850px) {
  .fs-7 {
    font-size: 14px;
  }
}
.clear-icon {
  position: absolute;
  right: 70px;
  top: 50%;
  transform: translateY(-50%) translateX(50%);
  color: #6c757d;
  cursor: pointer;
  z-index: 2;
  transition: color 0.2s;
  font-size: 12px !important;
  z-index: 1000;
  transition: all 0.2s ease-in-out;
}

.clear-icon:hover {
  color: #fff;
  background: red;
}
</style>
