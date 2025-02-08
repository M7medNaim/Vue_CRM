<template>
  <!-- Change Stage Modal -->
  <div class="modal fade" id="changeStageModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Change Stage ({{ props.selectedRows.length }} items)
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <select v-model="newStage" class="form-select">
            <option value="">Select Stage</option>
            <option
              v-for="option in stageOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="confirmChangeStage"
            :disabled="isLoading || !newStage"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            Apply
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Assign Supervisor Modal -->
  <div class="modal fade" id="assignSupervisorModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Assign Supervisor ({{ props.selectedRows.length }} items)
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <select v-model="newSupervisor" class="form-select">
            <option value="">Select Supervisor</option>
            <option
              v-for="option in supervisorOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="confirmAssignSupervisor"
            :disabled="isLoading || !newSupervisor"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            Apply
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Assign Representative Modal -->
  <div class="modal fade" id="assignRepresentativeModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Assign Representative ({{ selectedRows.length }} items)
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <select v-model="newRepresentative" class="form-select">
            <option value="">Select Representative</option>
            <option
              v-for="option in representativeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="confirmAssignRepresentative"
            :disabled="isLoading || !newRepresentative"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            Apply
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Change Source Modal -->
  <div class="modal fade" id="changeSourceModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Change Source ({{ selectedRows.length }} items)
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <select v-model="newSource" class="form-select">
            <option value="">Select Source</option>
            <option
              v-for="option in sourceOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="confirmChangeSource"
            :disabled="isLoading || !newSource"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            Apply
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { Modal } from "bootstrap";

const props = defineProps({
  selectedRows: {
    type: Array,
    required: true,
  },
});

// Define emits properly
const emits = defineEmits([
  "update-stage",
  "update-supervisor",
  "update-representative",
  "update-source",
]);

// State
const isLoading = ref(false);
const newStage = ref("");
const newSupervisor = ref("");
const newRepresentative = ref("");
const newSource = ref("");

// Options for dropdowns
const stageOptions = [
  { value: "newDeal", label: "New Deal" },
  { value: "inProgress", label: "In Progress" },
  { value: "qualified", label: "Qualified" },
  { value: "closed", label: "Closed" },
];

const supervisorOptions = [
  { value: "supervisor1", label: "Supervisor 1" },
  { value: "supervisor2", label: "Supervisor 2" },
  { value: "eurasia", label: "Eurasia Admin" },
  { value: "sup", label: "Sup Sup" },
];

const representativeOptions = [
  { value: "rep1", label: "Representative 1" },
  { value: "rep2", label: "Representative 2" },
  { value: "rep3", label: "Representative 3" },
];

const sourceOptions = [
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "referral", label: "Referral" },
];

// Methods
const closeModal = (modalId) => {
  const modal = Modal.getInstance(document.getElementById(modalId));
  if (modal) {
    modal.hide();
    document.querySelector(".modal-backdrop")?.remove();
    document.body.classList.remove("modal-open");
  }
};

const confirmChangeStage = async () => {
  try {
    isLoading.value = true;
    await emits("update-stage", newStage.value);
    closeModal("changeStageModal");
    newStage.value = "";
  } catch (error) {
    console.error("Error changing stage:", error);
  } finally {
    isLoading.value = false;
  }
};

const confirmAssignSupervisor = async () => {
  try {
    isLoading.value = true;
    await emits("update-supervisor", newSupervisor.value);
    closeModal("assignSupervisorModal");
    newSupervisor.value = "";
  } catch (error) {
    console.error("Error assigning supervisor:", error);
  } finally {
    isLoading.value = false;
  }
};

const confirmAssignRepresentative = async () => {
  try {
    isLoading.value = true;
    await emits("update-representative", newRepresentative.value);
    closeModal("assignRepresentativeModal");
    newRepresentative.value = "";
  } catch (error) {
    console.error("Error assigning representative:", error);
  } finally {
    isLoading.value = false;
  }
};

const confirmChangeSource = async () => {
  try {
    isLoading.value = true;
    await emits("update-source", newSource.value);
    closeModal("changeSourceModal");
    newSource.value = "";
  } catch (error) {
    console.error("Error changing source:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.modal-body select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.modal-footer {
  border-top: 1px solid #ddd;
  padding: 1rem;
}
</style>
