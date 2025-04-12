<template>
  <div class="mt-2">
    <TopHeader2
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
  <KanbanBoard :stages="stages" defaultColor="#333" />
  <!-- <WhatsappModal ref="whatsappModalRef" /> -->
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import TopHeader2 from "@/components/headers/TopHeader2.vue";
import KanbanBoard from "@/components/kanban/KanbanBoard.vue";
// import { tasksStages } from "@/plugins/stages";
// import { Modal } from "bootstrap";
// import WhatsappModal from "@/components/modals/WhatsappModal.vue";
import { useI18n } from "vue-i18n";
import { getTasksKanban } from "@/plugins/services/authService";
import { useToast } from "vue-toastification";

export default {
  name: "CrmKanban",
  components: {
    TopHeader2,
    KanbanBoard,
    // WhatsappModal,
  },
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    const stages = ref();
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
        createdStart: "",
        createdEnd: "",
        modifiedStart: "",
        modifiedEnd: "",
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
        console.log(response.data);

        if (Array.isArray(response.data.data)) {
          stages.value = response.data.data.map((stage) => ({
            id: stage.id,
            name: stage.name,
            description: stage.description || null,
            color_code: stage.color_code,
            tasks: stage.tasks || [],
          }));
          toast.success(t("success.loadTasks"));
        } else {
          toast.error(t("error.loadTasks"));
        }
      } catch (error) {
        console.error("Error fetching stages:", error);
        toast.error(t("error.loadTasks"));
      }
    };

    // const openWhatsappModal = () => {
    //   const modal = new Modal(document.getElementById("whatsappModal"));
    //   modal.show();
    // };

    // upload data
    onMounted(async () => {
      await fetchStages();
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
