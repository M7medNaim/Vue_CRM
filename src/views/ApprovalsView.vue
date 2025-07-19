<template>
  <div class="mt-4 me-2 bg-white p-4 rounded-3 allSetting">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link text-secondary-emphasis active"
          id="deal-reassignment-tab"
          data-bs-toggle="tab"
          data-bs-target="#deal_reassignment"
          type="button"
          role="tab"
          aria-controls="deal_reassignment"
          aria-selected="true"
        >
          {{ t("approvals-tab-label-deal-reassignment") }}
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link text-secondary-emphasis"
          id="idle-deal-assignment-tab"
          data-bs-toggle="tab"
          data-bs-target="#idle_deal_assignment"
          type="button"
          role="tab"
          aria-controls="idle_deal_assignment"
        >
          {{ t("approvals-tab-label-idle-deal-assignment") }}
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link text-secondary-emphasis"
          id="new-deal-creation-tab"
          data-bs-toggle="tab"
          data-bs-target="#new_deal_creation"
          type="button"
          role="tab"
          aria-controls="new_deal_creation"
        >
          {{ t("approvals-tab-label-new-deal-creation") }}
        </button>
      </li>
    </ul>
    <div class="tab-content mt-3" id="myTabContent">
      <div
        class="tab-pane fade show active"
        id="deal_reassignment"
        role="tabpanel"
        aria-labelledby="deal-reassignment-tab"
      >
        <approval-deal-reassignment-table />
      </div>
      <div
        class="tab-pane fade"
        id="idle_deal_assignment"
        role="tabpanel"
        aria-labelledby="idle_deal_assignment_tab"
      ></div>
      <div
        class="tab-pane fade"
        id="new_deal_creation"
        role="tabpanel"
        aria-labelledby="new_deal_creation_tab"
      ></div>
    </div>
  </div>
</template>
<script>
import { useI18n } from "vue-i18n";
import ApprovalDealReassignmentTable from "@/components/ApprovalDealReassignmentTable.vue";
export default {
  name: "ApprovalsView",
  components: {
    ApprovalDealReassignmentTable,
  },
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
};
</script>
