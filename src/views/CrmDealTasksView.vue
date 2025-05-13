<template>
  <div class="mt-2">
    <CrmKanbanHeader
      :initial-filters="filters"
      @filter-applied="applyFilters"
      @reset-filter="resetFilter"
    />
  </div>
  <!-- <div class="watsappIcon position-absolute z-3">
    <button class="position-relative fs-5 rounded-2" @click="openWhatsappModal">
      <p class="position-absolute">{{ $t("kanban-modal-edit-whatsapp") }}</p>
      <div class="text-white"><i class="fa-brands fa-whatsapp"></i></div>
    </button>
  </div> -->
  <CrmKanbanKanbanBoard
    :stages="stages"
    defaultColor="#333"
    @open-whatsapp-modal="openWhatsappModal"
    @receive-whatsapp-message="receiveWhatsappMessage"
  />
  <!-- <WhatsappModal ref="whatsappModalRef" /> -->
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import CrmKanbanHeader from "@/components/headers/CrmDealKanbanTopHeader.vue";
import CrmKanbanKanbanBoard from "@/components/kanban/CrmDealKanbanBoardDeals.vue";
import { getTasksKanban } from "@/plugins/services/authService";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

export default {
  name: "CrmDealTasksView",
  components: {
    CrmKanbanHeader,
    CrmKanbanKanbanBoard,
    // WhatsappModal,
  },
  setup() {
    const toast = useToast();
    const { t } = useI18n();
    const stages = ref([]);
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

    const applyFilters = async (newFilters) => {
      try {
        filters.value = { ...newFilters };
      } catch (error) {
        console.error("Error applying filters:", error);
      }
    };

    const resetFilter = async () => {
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
    const fetchStages = async () => {
      try {
        const response = await getTasksKanban();
        if (Array.isArray(response.data.data)) {
          stages.value = response.data.data.map((stage) => ({
            id: stage.id,
            name: stage.name,
            description: stage.description || null,
            color_code: stage.color_code,
            deals: stage.deals || [],
            deal_count: stage.deal_count,
          }));
          toast.success(t("success.loadKanban"));
        } else {
          toast.error(t("error.loadKanban"));
        }
        console.table(stages.value);
      } catch (error) {
        console.error("Error fetching stages:", error);
        toast.error(t("error.loadKanban"));
      }
    };
    // const openWhatsappModal = () => {
    //   const modal = new Modal(document.getElementById("whatsappModal"));
    //   modal.show();
    // };

    // upload data
    onMounted(async () => {
      fetchStages();
      window.addEventListener("contextmenu", handleRightClick);
    });
    onUnmounted(() => {
      window.removeEventListener("contextmenu", handleRightClick);
    });

    return {
      stages,
      filters,
      applyFilters,
      resetFilter,
      fetchStages,
      // openWhatsappModal,
    };
  },
};
</script>

<style scoped>
.watsappIcon {
  bottom: 4%;
  right: 3%;
}

button {
  border: 2px solid #25d366;
  width: 6.8em;
  height: 2em;
  transition: 0.5s;
  background: #f6f5f5;
}

button p {
  top: 0.2em;
  left: 1.15em;
  transition: 0.5s;
  color: #25d366;
}

button i {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  opacity: 0;
  transition: 0.5s;
  height: 1em;
}

button:hover p {
  left: 0.5em;
  color: #fff;
}

button:hover i {
  opacity: 1;
}

button:hover {
  background-color: #25d366;
}
</style>
