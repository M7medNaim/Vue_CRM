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
              <option value="" disabled>Select Action</option>
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
              placeholder="ابحث..."
              v-model="search"
            />
            <button
              title="Fillter"
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
            <span>Create Deal</span>
          </button>
          <button class="btn btn-primary rounded-2" @click="openImportModal">
            <i class="fa-solid fa-upload me-2"></i>
            <span>Import</span>
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
      :row-height="60"
      :header-height="50"
      class="custom-table"
    >
      <template #item-actions="item">
        <div class="btns d-flex justify-content-start align-items-center gap-3">
          <button
            @click="openShowData(item)"
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
  <ShowData :formData="selectedUser" ref="showDataModalRef" />
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import EasyDataTable from "vue3-easy-data-table";
import FilterCrmList from "@/components/modals/FilterCrmList.vue";
import DealModal from "@/components/modals/CreateDeal.vue";
import ImportModal from "@/components/modals/ImportModal.vue";
import ShowData from "@/components/modals/ShowData.vue";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
  getDeals,
  showDeal,
  updateDealsStage,
  updateDealsSupervisor,
  updateDealsRepresentative,
  updateDealsSource,
  deleteDeals,
} from "@/plugins/services/authService";
import ActionsDeal from "@/components/modals/ActionsDeal.vue";

// Items data
const items = ref([
  {
    id: 1,
    user: {
      id: 1,
      name: "John Doe",
    },
    phone: "+1234567890",
    notes: "Test",
    lastUpdated: "2024-03-20",
    source: "Website",
    stage: "New Lead",
    responsible: "Sales Team A",
  },
]);

// Table headers
const headers = [
  // { text: "#", value: "id" },
  { text: "Name", value: "user.name" },
  { text: "Phone Number", value: "phone" },
  { text: "Notes", value: "notes" },
  { text: "Last Updated", value: "lastUpdated" },
  { text: "Source", value: "source" },
  { text: "Stage", value: "stage" },
  { text: "Responsable Person", value: "responsible" },
  { text: "Action", value: "actions", sortable: false },
];

const search = ref("");
const selectedRows = ref([]);
const itemsPerPage = ref(10);
const selectedAction = ref("");
const selectedStatuses = ref([]);
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
const selectedUser = ref(null);
const showDataModalRef = ref(null);
// Actions operations
const actions = ref([
  { value: "changeStage", label: "Change Stage" },
  { value: "assignSalesSupervisor", label: "Assign Sales Supervisor" },
  { value: "assignSalesRepresentative", label: "Assign Sales Representative" },
  { value: "changeSource", label: "Change Source" },
  { value: "delete", label: "Delete" },
]);
const deleteItem = (id) => {
  items.value = items.value.filter((item) => item.id !== id);
};

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

    case "assignSalesRepresentative":
      modalElement = document.getElementById("assignRepresentativeModal");
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
          `Are you sure you want to delete ${selectedRows.value.length} selected items?`
        )
      ) {
        handleDelete();
      }
      break;
  }
};

const fetchData = async () => {
  try {
    const dealsResponse = await getDeals();
    // Assuming the API returns deals with user data included
    items.value = dealsResponse.data.data.map((deal) => ({
      id: deal.id,
      name: deal.user?.name, // Access user name directly from the nested user object
      phone: deal.phone,
      notes: deal.notes,
      lastUpdated: deal.lastUpdated,
      source: deal.source,
      stage: deal.stage,
      responsible: deal.responsible,
    }));
  } catch (error) {
    console.error("Error fetching deals:", error);
  }
};
// Filtered items search and filters
const filteredItems = computed(() => {
  return items.value.filter((item) => {
    // Search filter
    const matchesSearch =
      !search.value ||
      (item.user?.name || "")
        .toLowerCase()
        .includes(search.value.toLowerCase()) ||
      (item.phone || "").toString().includes(search.value) ||
      (item.notes || "").toLowerCase().includes(search.value.toLowerCase()) ||
      (item.source || "").toLowerCase().includes(search.value.toLowerCase()) ||
      (item.stage || "").toLowerCase().includes(search.value.toLowerCase()) ||
      (item.responsible || "")
        .toLowerCase()
        .includes(search.value.toLowerCase());

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
        new Date(item.createdAt) >= new Date(filters.value.createdStart)) &&
      (!filters.value.createdEnd ||
        new Date(item.createdAt) <= new Date(filters.value.createdEnd));

    const matchesModifiedDate =
      (!filters.value.modifiedStart ||
        new Date(item.modifiedAt) >= new Date(filters.value.modifiedStart)) &&
      (!filters.value.modifiedEnd ||
        new Date(item.modifiedAt) <= new Date(filters.value.modifiedEnd));

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
const openShowData = async (item) => {
  if (!item || !item.id) {
    console.error("Invalid item data:", item);
    return;
  }

  try {
    const response = await showDeal(item.id);
    const deal = response.data.data;

    selectedUser.value = {
      name: deal.user?.name,
      phone: deal.phone,
      note: deal.notes,
      lastUpdated: deal.lastUpdated,
      source: deal.source,
      stage: deal.stage,
      responsablePerson: deal.responsible,
    };

    const modalElement = document.getElementById("showDataModal");
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  } catch (error) {
    console.error("Error fetching deal:", error);
  }
};
const applyFilters = (newFilters) => {
  filters.value = { ...newFilters };
};

const addNewDeal = async (newDeal) => {
  try {
    // const userResponse = await getUser({ id: newDeal.user_id });
    // const user = userResponse.data.data;

    const formattedDeal = {
      id: newDeal.id,
      name: newDeal.user_id.name,
      phone: newDeal.phone,
      notes: newDeal.notes,
      lastUpdated: newDeal.lastUpdated,
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

    // Update local data
    items.value = items.value.map((item) => {
      if (selectedIds.includes(item.id)) {
        return { ...item, stage: newStage };
      }
      return item;
    });

    // Reset selection
    selectedRows.value = [];
    selectedAction.value = "";

    alert("Stage updated successfully");
  } catch (error) {
    console.error("Error updating stage:", error);
    alert("Error updating stage");
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

    alert("Supervisor assigned successfully");
  } catch (error) {
    console.error("Error assigning supervisor:", error);
    alert("Error assigning supervisor");
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

    alert("Representative assigned successfully");
  } catch (error) {
    console.error("Error assigning representative:", error);
    alert("Error assigning representative");
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

    alert("Source updated successfully");
  } catch (error) {
    console.error("Error updating source:", error);
    alert("Error updating source");
  }
};

const handleDelete = async () => {
  try {
    const selectedIds = selectedRows.value.map((row) => row.id);
    console.log("Deleting IDs:", selectedIds); // Debug log

    // Call the API
    const response = await deleteDeals(selectedIds);

    if (response.data.success) {
      // Assuming your API returns a success flag
      // Update local data
      items.value = items.value.filter(
        (item) => !selectedIds.includes(item.id)
      );

      // Reset selections
      selectedRows.value = [];
      selectedAction.value = "";

      alert("Items deleted successfully");
    } else {
      throw new Error(response.data.message || "Delete operation failed");
    }
  } catch (error) {
    console.error("Delete Error:", error);
    alert(
      "Error deleting items: " +
        (error.response?.data?.message || error.message)
    );
  }
};

// upload data
onMounted(() => {
  fetchData();
  const modalElements = document.querySelectorAll(".modal");
  modalElements.forEach((element) => {
    new Modal(element, {
      backdrop: true,
      keyboard: true,
      focus: true,
    });
  });
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
</style>
