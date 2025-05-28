<template>
  <div
    class="modal fade"
    id="filterStage"
    tabindex="-1"
    aria-labelledby="filterStageLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="filterStageLabel">Filter Stage Modal</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="">
            <div class="row ps-2">
              <div
                v-for="cb in checkboxes"
                :key="cb.value"
                class="form-check mb-2 col-6"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="cb.value"
                  v-model="selectedCheckboxes"
                  :value="cb.value"
                />
                <label class="form-check-label" :for="cb.value">
                  {{ cb.label }}
                </label>
              </div>
            </div>
          </form>
        </div>
        <div
          class="modal-footer d-flex justify-content-between align-items-center"
        >
          <button type="button" class="btn btn-primary" @click="filterStage">
            Apply Filter
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Reset Filter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
export default {
  name: "CrmDealKanbanBoardDealsFilterStageModal",
  props: {
    stage: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const toast = useToast();
    const { t } = useI18n();
    return { toast, t };
  },
  methods: {},
  computed: {
    checkboxes() {
      if (!this.stage) return [];
      if (this.stage.name === "Active" || this.stage.name === "نشط") {
        return [
          { label: "إنشاء في", value: "create_in" },
          { label: "تعديل في", value: "edit_in" },
        ];
      }
      if (
        this.stage.name === "Waiting For Response" ||
        this.stage.name === "بانتظار الرد"
      ) {
        return [
          { label: "No Response 1", value: "nr1" },
          { label: "No Response 2", value: "nr2" },
          { label: "No Response 3", value: "nr3" },
          { label: "No Response 4", value: "nr4" },
        ];
      }
      return [];
    },
  },
  data() {
    return {
      selectedCheckboxes: [],
    };
  },
};
</script>
