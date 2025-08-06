<template>
  <div class="mt-2">
    <crm-kanban-header
      :initialFilters="filters"
      @filter-applied="applyFilters"
      @reset-filter="resetFilter"
      @search-deals="HandleSearch"
      :selected_conversation="selected_conversation"
      :new_message="new_message"
      :update_message="update_message"
    />
  </div>
  <crm-kanban-kanban-board
    :stages="stages"
    defaultColor="#333"
    @open-whatsapp-modal="openWhatsappModal"
    @receive-whatsapp-message="receiveWhatsappMessage"
    @update-whatsapp-message="updateWhatsappMessage"
    @change-deal-stage="changeDealStage"
  />
</template>

<script>
import { ref } from "vue";
import CrmKanbanHeader from "@/components/headers/CrmDealKanbanTopHeader.vue";
import CrmKanbanKanbanBoard from "@/components/kanban/CrmDealKanbanBoardDeals.vue";
export default {
  name: "AfterSalesDealKanbanView",
  components: {
    CrmKanbanHeader,
    CrmKanbanKanbanBoard,
  },
  setup() {
    const stages = ref([
      {
        id: 1,
        name: "جديد المتابعة",
        color_code: "#007bff",
        icon: "user-clock",
        deal_count: 0,
        deals: [
          {
            id: 101,
            name: "Abo Rayan",
            stage_id: 1,
            tags: [],
            phone: "*970598778345",
          },
        ],
        filterable_tags: [],
        parent_id: null,
        has_children: false,
      },
      {
        id: 2,
        name: "قيد المتابعة",
        color_code: "#ffc107",
        icon: "user-edit",
        deal_count: 0,
        deals: [],
        filterable_tags: [],
        parent_id: null,
        has_children: false,
      },
      {
        id: 3,
        name: "تمت المتابعة",
        color_code: "#28a745",
        icon: "user-check",
        deal_count: 0,
        deals: [],
        filterable_tags: [],
        parent_id: null,
        has_children: false,
      },
    ]);
    const selected_conversation = ref(null);
    const filters = ref({
      source_id: "",
      stage_id: "",
      supervisor_id: "",
      representative_id: "",
      package_id: "",
      created_at_start: "",
      created_at_end: "",
      updated_at_start: "",
      updated_at_end: "",
      status: [],
      sort_by: "",
      sort_order: "",
    });
    const new_message = ref(null);
    const update_message = ref(null);
    const applyFilters = async (newFilters) => {
      filters.value = { ...newFilters };
    };
    const resetFilter = async () => {
      filters.value = {
        source_id: "",
        stage_id: "",
        supervisor_id: "",
        representative_id: "",
        package_id: "",
        created_at_start: "",
        created_at_end: "",
        updated_at_start: "",
        updated_at_end: "",
        status: [],
        sort_by: "",
        sort_order: "",
      };
    };
    const openWhatsappModal = (conversation) => {
      selected_conversation.value = conversation;
    };
    const receiveWhatsappMessage = (message) => {
      new_message.value = message;
    };
    const updateWhatsappMessage = (data) => {
      update_message.value = data;
    };
    const HandleSearch = async () => {};
    const changeDealStage = async () => {};
    return {
      stages,
      filters,
      applyFilters,
      resetFilter,
      openWhatsappModal,
      selected_conversation,
      receiveWhatsappMessage,
      updateWhatsappMessage,
      new_message,
      update_message,
      HandleSearch,
      changeDealStage,
    };
  },
};
</script>

<style scoped>
.kanban-container {
  width: 100vw;
  min-height: 100vh;
  padding: 0;
  margin: 0;
  background: #f7f7f7;
}
</style>
