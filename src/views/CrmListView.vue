<template>
  <div class="crm-container mt-3 me-2 bg-white rounded-3 p-3">
    <div class="controls mb-3">
      <div class="row">
        <div class="col-sm-6 col-lg-4">
          <div class="input-group">
            <select
              v-model="selectedAction"
              class="text-secondary form-control"
            >
              <option value="" disabled>{{ t("crmList.selectAction") }}</option>
              <option
                v-for="action in actions"
                :key="action.value"
                :value="action.value"
              >
                {{ action.label }}
              </option>
            </select>
            <button
              class="btn btn-primary input-group-text"
              @click="executeAction"
              :disabled="!selectedAction || !selectedRows.length"
            >
              <span>Submit</span> ({{ selectedRows.length }})
            </button>
          </div>
        </div>
        <div class="col-sm-6 col-lg-4">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              :placeholder="t('forms.search')"
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
        <div class="col-sm-6 col-lg-4 text-end">
          <button class="btn btn-primary rounded-2 me-2" @click="openDealModal">
            <span>{{ t("buttons.createDeal") }}</span>
          </button>
          <button class="btn btn-primary rounded-2" @click="openImportModal">
            <i class="fa-solid fa-upload me-2"></i>
            <span>{{ t("buttons.import") }}</span>
          </button>
        </div>
      </div>
    </div>

    <EasyDataTable
      v-model:items-selected="selectedRows"
      :headers="headers"
      :items="filteredItems"
      :search-field="search"
      :rows-per-page="itemsPerPage"
      alternating
      show-index
      show-select
      :loading="tableLoading"
      selection-type="multiple"
      :row-height="60"
      :header-height="50"
      class="custom-table"
      @click-row="handleRowClick"
    >
      <template #item-actions="item">
        <div class="btns d-flex justify-content-start align-items-center gap-3">
          <button
            @click="handleShowDeal(item.id)"
            class="text-white bg-primary px-2 py-1 rounded-2 border-0"
          >
            <i class="fa-regular fa-eye"></i>
          </button>
          <button
            @click="deleteItem(item.id)"
            class="text-white bg-danger me-2 px-2 py-1 rounded-2 border-0"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </template>
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
    </EasyDataTable>

    <ActionsDeal
      :selected-rows="selectedRows"
      @update-stage="handleUpdateStage"
      @update-supervisor="handleUpdateSupervisor"
      @update-representative="handleUpdateRepresentative"
      @update-source="handleUpdateSource"
    />
  </div>
  <!-- filter modal -->
  <FilterCrmList
    v-model:filters="filters"
    @apply-filters="applyFilters"
    @reset-filter="resetFilter"
    :selectedStatuses="selectedStatuses"
  />
  <DealModal @add-deal="addNewDeal" />
  <ImportModal />
  <ShowData :formData="dealData" ref="showDataModal" />
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import EasyDataTable from "vue3-easy-data-table";
import FilterCrmList from "@/components/modals/FilterCrmList.vue";
import DealModal from "@/components/modals/CreateDeal.vue";
import ImportModal from "@/components/modals/ImportModal.vue";
import ShowData from "@/components/modals/ShowData.vue";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n";
// import { useLoadingStore } from "@/plugins/loadingStore";

import {
  getDeals,
  showDeal,
  updateDealsStage,
  updateDealsSupervisor,
  updateDealsRepresentative,
  updateDealsSource,
  deleteDeals,
  getSources,
  getStages,
} from "@/plugins/services/authService";
import ActionsDeal from "@/components/modals/ActionsDeal.vue";
const { t } = useI18n();

// Items data
const items = ref([]);
// const loadingStore = useLoadingStore();
const tableLoading = ref(false);
// Table headers
const headers = [
  { text: t("tables.name"), value: "name" },
  { text: t("tables.phone"), value: "phone" },
  { text: t("tables.notes"), value: "description" },
  { text: t("tables.createdAt"), value: "created_at" },
  { text: t("tables.source"), value: "source" },
  { text: t("tables.stage"), value: "stage" },
  { text: t("tables.responsible"), value: "responsible" },
  { text: t("tables.actions"), value: "actions", sortable: false },
];
const search = ref("");
const selectedRows = ref([]);
const itemsPerPage = ref(10);
const selectedAction = ref("");
const selectedStatuses = ref([]);
const showDataModal = ref(null);
const dealData = ref(null);
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
// Actions operations
const actions = ref([
  { value: "changeStage", label: t("actions.changeStage") },
  // { value: "assignSalesSupervisor", label: "Assign Sales Supervisor" },
  { value: "assignUser", label: t("actions.assignUser") },
  { value: "changeSource", label: t("actions.changeSource") },
  { value: "delete", label: t("actions.delete") },
]);
const toast = useToast();

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
      items.value = items.value.filter((item) => item.id !== id);
      toast.success(t("success.deleteSuccess"), {
        timeout: 3000,
      });
    }
  } catch (error) {
    toast.error(t("error.deleteFailed"), {
      timeout: 3000,
    });
    console.error("Delete Error:", error);
  }
};
const sources = ref([]);
const stages = ref([]);

// Action execution
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

    case "assignSalesSupervisor":
      modalElement = document.getElementById("assignSupervisorModal");
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
      if (
        confirm(
          `${t("error.deleteTitle")} ${selectedRows.value.length} ${t(
            "error.deleteText"
          )}`
        )
      ) {
        handleDelete();
      }
      break;
  }
};

const fetchData = async () => {
  try {
    tableLoading.value = true;
    const stagesRes = await getStages();
    stages.value = stagesRes.data.data;
    // const sourcesRes = await getSources();
    // stages.value = sourcesRes.data.data;

    const dealsRes = await getDeals();

    items.value = dealsRes.data.data.map((deal) => {
      const matchedStage = stages.value.find(
        (stage) => stage.id === deal.stage_id
      );
      // const matchedSource = sources.value.find(
      //   (source) => source.id === deal.source_id
      // );
      return {
        id: deal.id,
        name: deal.contact?.name || "unassigned",
        phone: deal.contact?.phones?.[0]?.phone || "unassigned",
        description: deal.description || "unassigned",
        created_at: deal.created_at.split("T")[0],
        stage: matchedStage ? matchedStage.name : "unassigned",
        responsible: "unassigned",
        source: "null",
        // source: matchedSource ? matchedSource.name : "unassigned",
      };
    });
  } catch (error) {
    console.error("Error in fetchData:", error);
  } finally {
    tableLoading.value = false;
  }
};

// Filtered items search and filters
const filteredItems = computed(() => {
  return items.value.filter((item) => {
    const searchLower = search.value.toLowerCase();

    const matchesSearch =
      !search.value ||
      item.contact?.name?.toLowerCase().includes(searchLower) ||
      item.phone?.includes(search.value) ||
      item.description?.toLowerCase().includes(searchLower) ||
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

const openDealModal = () => {
  const modalElement = document.getElementById("dealModal");
  const modal = new Modal(modalElement);
  modal.show();
};
const openImportModal = () => {
  const modalElement = document.getElementById("importModal");
  const modal = new Modal(modalElement);
  modal.show();
};
const fetchStagesAndSources = async () => {
  try {
    // tableLoading.value = true;
    const [stagesRes, sourcesRes] = await Promise.all([
      getStages(),
      getSources(),
    ]);
    stages.value = stagesRes.data.data;
    sources.value = sourcesRes.data.data;
  } catch (error) {
    console.error("Error fetching stages and sources:", error);
  } finally {
    // tableLoading.value = false;
  }
};
const handleShowDeal = async (dealId) => {
  try {
    // tableLoading.value = true;
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
      description: deal.description || "unassigned",
      rating: deal.rating || "unassigned",
      created_at: deal.created_at
        ? new Date(deal.created_at).toISOString().split("T")[0]
        : "",
      updated_at: deal.updated_at
        ? new Date(deal.updated_at).toISOString().split("T")[0]
        : "",
      stage_name: matchedStage?.name || "Unassigned",
      source_name: matchedSource?.name || "Unassigned",
      responsablePerson: deal.user || "unassigned",
    };

    showDataModal.value?.openShowData();
  } catch (error) {
    console.error("Error fetching deal data:", error);
  } finally {
    // tableLoading.value = false;
  }
};

const applyFilters = async (newFilters) => {
  try {
    // tableLoading.value = true;
    filters.value = { ...newFilters };

    const response = await getDeals(filters.value);
    items.value = response.data.data;
  } catch (error) {
    console.error("Filter Error:", error);
  } finally {
    // tableLoading.value = false;
  }
};

const addNewDeal = async (newDeal) => {
  try {
    // const userResponse = await getUser({ id: newDeal.user_id });
    // const user = userResponse.data.data;

    const formattedDeal = {
      id: newDeal.id,
      name: newDeal.user_id.name,
      phone: newDeal.phone,
      description: newDeal.description,
      createdAt: newDeal.createdAt,
      source: newDeal.source,
      stage: newDeal.stage,
      responsible: newDeal.responsible,
    };

    items.value = [...items.value, formattedDeal];
  } catch (error) {
    console.error("Error fetching user data for new deal:", error);
  }
};

// Handle updates from modals
const handleUpdateStage = async (newStage) => {
  try {
    const selectedIds = selectedRows.value.map((row) => row.id);
    await updateDealsStage(selectedIds, newStage);

    items.value = items.value.map((item) => {
      if (selectedIds.includes(item.id)) {
        return { ...item, stage: newStage };
      }
      return item;
    });

    // Reset selection
    selectedRows.value = [];
    selectedAction.value = "";

    toast.success(t("success.updated"), {
      timeout: 3000,
    });
  } catch (error) {
    toast.error(t("error.updateFailed"), {
      timeout: 3000,
    });
    console.error("Error updating stage:", error);
  }
};

const handleUpdateSupervisor = async (newSupervisor) => {
  try {
    const selectedIds = selectedRows.value.map((row) => row.id);
    await updateDealsSupervisor(selectedIds, newSupervisor);

    items.value = items.value.map((item) => {
      if (selectedIds.includes(item.id)) {
        return { ...item, supervisor: newSupervisor };
      }
      return item;
    });

    selectedRows.value = [];
    selectedAction.value = "";

    toast.success(t("success.updated"), {
      timeout: 3000,
    });
  } catch (error) {
    toast.error(t("error.updateFailed"), {
      timeout: 3000,
    });
    console.error("Error assigning supervisor:", error);
  }
};

const handleUpdateRepresentative = async (newRepresentative) => {
  try {
    const selectedIds = selectedRows.value.map((row) => row.id);
    await updateDealsRepresentative(selectedIds, newRepresentative);

    items.value = items.value.map((item) => {
      if (selectedIds.includes(item.id)) {
        return { ...item, representative: newRepresentative };
      }
      return item;
    });

    selectedRows.value = [];
    selectedAction.value = "";

    toast.success(t("success.updated"), {
      timeout: 3000,
    });
  } catch (error) {
    toast.error(t("error.updateFailed"), {
      timeout: 3000,
    });
    console.error("Error assigning representative:", error);
  }
};

const handleUpdateSource = async (newSource) => {
  try {
    const selectedIds = selectedRows.value.map((row) => row.id);
    await updateDealsSource(selectedIds, newSource);

    items.value = items.value.map((item) => {
      if (selectedIds.includes(item.id)) {
        return { ...item, source: newSource };
      }
      return item;
    });

    selectedRows.value = [];
    selectedAction.value = "";

    toast.success(t("success.updated"), {
      timeout: 3000,
    });
  } catch (error) {
    toast.error(t("error.updateFailed"), {
      timeout: 3000,
    });
    console.error("Error updating source:", error);
  }
};

const handleDelete = async () => {
  try {
    const selectedIds = selectedRows.value.map((row) => row.id);

    const result = await Swal.fire({
      title: t("error.deleteTitle"),
      text: t("error.deleteText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("success.deleteConfirm"),
      cancelButtonText: t("error.deleteCancel"),
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const response = await deleteDeals(selectedIds);

      if (response.data.success) {
        items.value = items.value.filter(
          (item) => !selectedIds.includes(item.id)
        );
        selectedRows.value = [];
        selectedAction.value = "";

        toast.success(t("success.deleteSuccess"), {
          timeout: 3000,
        });
      } else {
        throw new Error(response.data.message || t("error.deleteFailed"));
      }
    }
  } catch (error) {
    toast.error(error.response?.data?.message || t("error.deleteFailed"), {
      timeout: 3000,
    });
    console.error("Delete Error:", error);
  }
};

const handleRowClick = (item, event) => {
  if (event?.target?.closest("button")) {
    return;
  }

  const checkbox = event.currentTarget.querySelector('input[type="checkbox"]');
  const isSelected = selectedRows.value.some((row) => row.id === item.id);

  if (isSelected) {
    selectedRows.value = selectedRows.value.filter((row) => row.id !== item.id);
    if (checkbox) {
      checkbox.checked = false;
    }
  } else {
    selectedRows.value = [...selectedRows.value, item];
    if (checkbox) {
      checkbox.checked = true;
    }
  }
};
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

// upload data
onMounted(async () => {
  // loadingStore.startLoading();
  await fetchData();
  await fetchStagesAndSources();
  // loadingStore.stopLoading();
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
input:focus {
  box-shadow: none;
  border: 1px solid #333;
}
select {
  border: 2px solid #eee;
}
select:focus {
  box-shadow: none;
  border: 2px solid #eee;
}
:deep(.custom-table) {
  --easy-table-row-height: 45px;
  --easy-table-header-height: 30px;
  --easy-table-body-row-font-size: 15px;
  --easy-table-header-font-size: 13px;
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
</style>
