<template>
  <div class="mt-4">
    <TopHeader2
      :initial-filters="filters"
      @filter-applied="applyFilters"
      @reset-filter="resetFilter"
    />
  </div>
  <div class="watsappIcon position-absolute z-3">
    <button class="position-relative fs-5 rounded-2">
      <p class="position-absolute">Watsapp</p>
      <div class="text-white"><i class="fa-brands fa-whatsapp"></i></div>
    </button>
  </div>
  <KanbanBoard :stages="stages" defaultColor="#333" />
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import TopHeader2 from "@/components/headers/TopHeader2.vue";
import KanbanBoard from "@/components/kanban/KanbanBoard.vue";
import { kanbanStages } from "@/plugins/stages";

export default {
  name: "CrmKanban",
  components: {
    TopHeader2,
    KanbanBoard,
  },
  setup() {
    const stages = ref(kanbanStages);

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

    // upload data
    onMounted(async () => {
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
