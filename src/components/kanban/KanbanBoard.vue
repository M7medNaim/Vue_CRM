<template>
  <div class="position-relative">
    <div class="kanban-wrapper mt-4" ref="dealsContainer">
      <div class="kanban-board">
        <!-- Fixed Stages Header -->
        <div class="stages-header d-flex">
          <div
            v-for="stage in stages"
            :key="stage.id"
            class="stage-header position-relative"
            @click="openUpdateStage(stage)"
          >
            <div
              class="stageName py-1 p-0 text-white"
              :style="{ backgroundColor: stage.color || defaultColor }"
            >
              {{ stage.name }}
            </div>
            <button
              class="btnPlusStage border-0 bg-transparent text-white position-absolute d-none"
              style="right: -2%; top: 3%"
            >
              <span class="bg-primary px-2 py-2 fs-5">+</span>
            </button>
          </div>
        </div>
        <!-- Scrollable Deals Container -->
        <div class="deals-container d-flex">
          <div v-for="stage in stages" :key="stage.id" class="stage-column">
            <draggable
              v-model="stage.deals"
              :group="{ name: 'deals' }"
              item-key="id"
              class="deal-list"
              @start="drag = true"
              @end="handleDragEnd"
            >
              <template #item="{ element: deal }">
                <CustomerCard :deal="deal" @click="openDealDataCard" />
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </div>
    <div
      class="arrowsBoar w-100 position-absolute top-50 end-0"
      style="pointer-events: none"
    >
      <div
        v-if="showRight"
        class="rigthArrow text-white position-absolute bg-primary p-2 opacity-25 z-3"
        style="pointer-events: auto; width: fit-content"
        @mouseenter="scrollDeals(1)"
        @mouseleave="stopScrolling"
      >
        <i class="fa-solid fa-chevron-right fs-1 p-3"></i>
      </div>
      <div
        v-if="showLeft"
        class="leftArrow text-white position-absolute bg-primary p-2 opacity-25 z-3"
        style="pointer-events: auto; width: fit-content"
        @mouseenter="scrollDeals(-1)"
        @mouseleave="stopScrolling"
      >
        <i class="fa-solid fa-chevron-left fs-1 p-3"></i>
      </div>
    </div>
  </div>
  <DealDataCard :deal="selectedDeal" />
  <UpdateStage :stage="selectedStage" @update-stage="handleStageUpdate" />
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from "vue";
import draggable from "vuedraggable";
import CustomerCard from "./CustomerCard.vue";
import { Modal } from "bootstrap";
import { useRoute } from "vue-router";

import DealDataCard from "@/components/modals/DealDataCard.vue";
import UpdateStage from "@/components/modals/UpdateStage.vue";
import moveCardSound from "@/assets/move-card.wav";

export default {
  name: "KanbanBoard",
  components: {
    draggable,
    CustomerCard,
    DealDataCard,
    UpdateStage,
  },
  props: {
    stages: {
      type: Array,
      required: true,
    },
    defaultColor: {
      type: String,
      default: "#333",
    },
  },
  setup(props) {
    const route = useRoute();
    const dealsContainer = ref(null);
    let scrollInterval = null;
    const drag = ref(false);
    const showLeft = ref(false);
    const showRight = ref(true);
    const selectedStage = ref(null);

    const isTasksView = computed(() => route.path === "/crm-tasks");

    const moveSound = new Audio(moveCardSound);

    const handleDragEnd = (evt) => {
      if (evt.from !== evt.to) {
        moveSound.currentTime = 0;
        moveSound
          .play()
          .catch((error) => console.log("Failed to play sound:", error));
      }
    };
    // open data deal modal
    const openDealDataCard = () => {
      const modal = new Modal(document.getElementById("dealDataCard"));
      modal.show();
    };
    const openUpdateStage = (stage) => {
      selectedStage.value = stage;
      const modal = new Modal(document.getElementById("updateStage"));
      modal.show();
    };
    const getStageHeaderClass = (stageId) => {
      return `stage-color-${stageId}`;
    };
    const scrollDeals = (direction) => {
      if (!dealsContainer.value) return;
      stopScrolling();

      let lastTimestamp = null;
      const speed = 1.2;

      const animate = (timestamp) => {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const elapsed = timestamp - lastTimestamp;

        dealsContainer.value.scrollLeft += direction * speed * elapsed;
        lastTimestamp = timestamp;

        scrollInterval = requestAnimationFrame(animate);
      };

      scrollInterval = requestAnimationFrame(animate);
    };

    const updateArrowVisibility = () => {
      if (!dealsContainer.value) return;
      const { scrollLeft, scrollWidth, clientWidth } = dealsContainer.value;
      showLeft.value = scrollLeft > 0;
      showRight.value = scrollLeft + clientWidth < scrollWidth - 1;
    };
    const stopScrolling = () => {
      if (scrollInterval) {
        cancelAnimationFrame(scrollInterval);
        scrollInterval = null;
      }
    };
    const stages = ref(props.stages);
    // update Stage Color and Name
    const handleStageUpdate = (updatedStage) => {
      const stageIndex = stages.value.findIndex(
        (stage) => stage.id === updatedStage.id
      );
      if (stageIndex !== -1) {
        stages.value[stageIndex].name = updatedStage.name;
        stages.value[stageIndex].color = updatedStage.color;
      }
    };
    onMounted(() => {
      dealsContainer.value.addEventListener("scroll", updateArrowVisibility);
      document.addEventListener("mouseup", stopScrolling);
      document.addEventListener("mouseleave", stopScrolling);
      updateArrowVisibility();
    });

    onUnmounted(() => {
      if (dealsContainer.value) {
        dealsContainer.value.removeEventListener(
          "scroll",
          updateArrowVisibility
        );
      }
      document.removeEventListener("mouseup", stopScrolling);
      document.removeEventListener("mouseleave", stopScrolling);
    });
    return {
      // stages,
      drag,
      handleDragEnd,
      getStageHeaderClass,
      dealsContainer,
      scrollDeals,
      stopScrolling,
      showLeft,
      showRight,
      openDealDataCard,
      openUpdateStage,
      isTasksView,
      selectedStage,
      handleStageUpdate,
    };
  },
};
</script>

<style scoped>
.kanban-wrapper {
  width: 100%;
  height: calc(100vh - 160px);
  overflow-x: auto;
}
.kanban-board {
  display: inline-flex;
  flex-direction: column;
  min-width: 300px;
  width: 300px;
  height: 100%;
}

.stages-header {
  display: flex;
  position: sticky;
  top: 0;
  z-index: 10;
}

.stage-header {
  min-width: 290px;
  width: 290px;
  margin-right: 10px;
  text-align: start;
  font-weight: 600;
  padding-left: 3px;
  transition: all 0.5s;
  cursor: pointer;
  clip-path: polygon(
    0 0,
    calc(100% - 15px) 0,
    100% 50%,
    calc(100% - 15px) 100%,
    0 100%
  );
}
.stageName {
  padding-left: 10px !important;
}
.stage-header:hover .btnPlusStage {
  display: block !important;
}

.deals-container {
  display: flex;
  flex: 1;
  height: calc(100% - 37px);
}

.stage-column {
  width: 300px;
  min-width: 300px;
  height: 100%;
  padding: 1rem 1rem 0 0;
}

.deal-list {
  width: 290px;
  min-width: 290px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 3px;
}

/* Scrollbar Styling */
.kanban-wrapper::-webkit-scrollbar,
.deal-list::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.kanban-wrapper::-webkit-scrollbar-track,
.deal-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.kanban-wrapper::-webkit-scrollbar-thumb,
.deal-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.kanban-wrapper::-webkit-scrollbar-thumb:hover,
.deal-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.rigthArrow,
.leftArrow {
  transform: translateY(-50%);
  cursor: pointer;
  transition: all 0.5s;
}
.rigthArrow:hover,
.leftArrow:hover {
  cursor: pointer;
  opacity: 0.8 !important;
}
.rigthArrow {
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
  right: 0%;
  z-index: 9999;
}
.leftArrow {
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  left: 0%;
  z-index: 9999;
}
</style>
