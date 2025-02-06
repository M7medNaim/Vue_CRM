<template>
  <div class="crm-container mt-3 me-2 bg-white rounded-3 p-3">
    <div class="controls mb-3">
      <div class="row">
        <div class="col-sm-6 col-lg-4">
          <div
            class="selecedActions d-flex justify-content-start align-items-center"
          >
            <select
              v-model="selectedAction"
              class="text-secondary py-2 rounded-end-0"
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
              class="btn btn-primary rounded-start-0 submitAction"
              @click="executeAction"
            >
              <span>Submit</span> ({{ selectedRows.length }})
            </button>
          </div>
        </div>
        <div class="col-sm-6 col-lg-4">
          <div class="d-flex justify-content-start align-items-center">
            <input
              type="text"
              class="form-control rounded-end-0 w-75"
              placeholder="ابحث..."
              v-model="search"
            />
            <button
              title="Fillter"
              type="button"
              class="btn btn-primary rounded-start-0"
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
          <button class="btn btn-primary rounded-2">
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
      class="custom-table"
      :class="['easy-table']"
    >
      <template #item-actions="{ id }">
        <div class="btns d-flex justify-content-start align-items-center gap-3">
          <a href="#" class="text-white bg-primary px-2 py-1 rounded-2"
            ><i class="fa-solid fa-arrow-up-right-from-square"></i
          ></a>
          <button
            @click="deleteItem(id)"
            class="text-white bg-danger me-2 px-2 py-1 rounded-2 border-0"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </template>
    </EasyDataTable>
  </div>
  <!-- filter modal -->
  <FilterCrmList
    v-model:filters="filters"
    @apply-filters="applyFilters"
    @reset-filter="resetFilter"
  />
  <DealModal @add-deal="addNewDeal" />
</template>
<script setup>
import { ref, computed } from "vue";
import EasyDataTable from "vue3-easy-data-table";
import FilterCrmList from "@/components/modals/FilterCrmList.vue";
import DealModal from "@/components/modals/CreateDeal.vue";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";

// Items data
const items = ref([
  {
    id: 1,
    name: "Diab Ali",
    phone: "+31685463219",
    notes: "Diab Ali",
    lastUpdated: "03 فبراير 2025",
    source: "None",
    stage: "Re-Contact",
    responsible: "Unassigned",
  },
  {
    id: 2,
    name: "chouket",
    phone: "+33758776995",
    notes: "chouket",
    lastUpdated: "03 فبراير 2025",
    source: "None",
    stage: "New Deal",
    responsible: "Unassigned",
  },
  {
    id: 3,
    name: "??? ???? ????????",
    phone: "+9647807344841",
    notes: "??? ???? ????????",
    lastUpdated: "03 فبراير 2025",
    source: "None",
    stage: "New Deal",
    responsible: "Unassigned",
  },
  {
    id: 4,
    name: "??? ???? ????????",
    phone: "+9647807344841",
    notes: "??? ???? ????????",
    lastUpdated: "03 فبراير 2025",
    source: "None",
    stage: "New Deal",
    responsible: "Unassigned",
  },
]);

// Table headers
const headers = [
  //   { text: "#", value: "id" },
  { text: "Name", value: "name" },
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
const filters = ref({ name: "", stage: "", source: "" });

// Actions operations
const actions = ref([
  { value: "changeStage", label: "Change Stage" },
  { value: "assignSalesSupervisor", label: "Assign Sales Supervisor" },
  { value: "assignSalesRepresentaive", label: "Assign Sales Representaive" },
  { value: "unassignResponsiblePerson", label: "Unassign Responsible Person" },
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

  if (selectedAction.value === "delete") {
    items.value = items.value.filter(
      (item) =>
        !selectedRows.value.some((selectedItem) => selectedItem.id === item.id)
    );
    selectedRows.value = [];
  }

  alert(
    `Executed action: ${selectedAction.value} on ${selectedRows.value.length} items`
  );
};

// Filtered items based on search and filters
const filteredItems = computed(() => {
  return items.value.filter((item) => {
    const matchesSearch =
      !search.value ||
      item.name.toLowerCase().includes(search.value.toLowerCase()) ||
      item.phone.includes(search.value) ||
      item.notes.toLowerCase().includes(search.value.toLowerCase()) ||
      item.lastUpdated.toLowerCase().includes(search.value.toLowerCase()) ||
      item.source.toLowerCase().includes(search.value.toLowerCase()) ||
      item.stage.toLowerCase().includes(search.value.toLowerCase()) ||
      item.responsible.toLowerCase().includes(search.value.toLowerCase());

    const matchesFilters =
      (!filters.value.name ||
        item.name.toLowerCase().includes(filters.value.name.toLowerCase())) &&
      (!filters.value.stage ||
        item.stage.toLowerCase().includes(filters.value.stage.toLowerCase())) &&
      (!filters.value.source ||
        item.source
          .toLowerCase()
          .includes(filters.value.source.toLowerCase())) &&
      (!filters.value.supervisor ||
        item.supervisor
          .toLowerCase()
          .includes(filters.value.supervisor.toLowerCase())) &&
      (!filters.value.representative ||
        item.representative
          .toLowerCase()
          .includes(filters.value.representative.toLowerCase())) &&
      (!filters.value.package ||
        item.package
          .toLowerCase()
          .includes(filters.value.package.toLowerCase())) &&
      (!filters.value.createdStart ||
        new Date(item.createdAt) >= new Date(filters.value.createdStart)) &&
      (!filters.value.createdEnd ||
        new Date(item.createdAt) <= new Date(filters.value.createdEnd)) &&
      (!filters.value.modifiedStart ||
        new Date(item.modifiedAt) >= new Date(filters.value.modifiedStart)) &&
      (!filters.value.modifiedEnd ||
        new Date(item.modifiedAt) <= new Date(filters.value.modifiedEnd)) &&
      (!filters.value.status || filters.value.status.includes(item.status));

    return matchesSearch && matchesFilters;
  });
});

// Opening and closing modals
const resetFilter = () => {
  filters.value = { name: "", stage: "", source: "" };
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
const applyFilters = (appliedFilters) => {
  filters.value = appliedFilters;
};

const addNewDeal = (newDeal) => {
  items.value = [...items.value, newDeal];
};
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
/* .custom-table :deep(.easy-table td),
.custom-table :deep(.easy-table th) {
  font-size: 16px !important;
  padding: 12px 20px !important;
}

.custom-table :deep(.easy-table th) {
  font-size: 18px !important;
  font-weight: bold !important;
} */
</style>
