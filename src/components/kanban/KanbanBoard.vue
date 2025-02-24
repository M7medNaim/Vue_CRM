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
            @click="openUpdateStage"
          >
            <div
              class="stageName py-1 p-0 text-white"
              :class="getStageHeaderClass(stage.id)"
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
  <UpdateStage />
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import draggable from "vuedraggable";
import CustomerCard from "./CustomerCard.vue";
import { Modal } from "bootstrap";

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
  setup() {
    const dealsContainer = ref(null);
    let scrollInterval = null;
    const drag = ref(false);
    const showLeft = ref(false);
    const showRight = ref(true);

    const stages = ref([
      {
        id: 1,
        name: "New Deal (262)",
        deals: [
          {
            id: 1,
            name: "عباس",
            phone: "+96477095427796",
            country: "France",
            representative: "Bader Rep",
            created_at: "2025-02-05 01:17 PM",
            last_updated: "2025-02-18 04:37 PM",
          },
          {
            id: 2,
            name: "Mohammad",
            phone: "+17087126678",
            country: "Libya",
            representative: "Bader Rep",
            created_at: "2025-02-14 02:50 PM",
            last_updated: "2025-02-18 04:52 PM",
            attention: true,
          },
          {
            id: 3,
            name: "+1 (416) 858-5258",
            phone: "+1416858122",
            country: "USA",
            representative: "Iman Rep",
            created_at: "2025-02-05 01:17 PM",
            last_updated: "2025-02-19 12:04 PM",
          },
        ],
      },
      {
        id: 2,
        name: "Not Responding 1 (150)",
        deals: [
          {
            id: 4,
            name: "ali",
            phone: "+33634785780",
            country: "France",
            representative: "Iman Rep",
            created_at: "2024-12-11 11:43 AM",
            last_updated: "2025-02-19 12:06 PM",
          },
          {
            id: 5,
            name: "saaed",
            phone: "+96479012672246",
            country: "Iraq",
            representative: "Bader Rep",
            created_at: "2025-02-05 01:17 PM",
            last_updated: "2025-02-19 12:04 PM",
          },
        ],
      },
      {
        id: 3,
        name: "Not Responding 2 (143)",
        deals: [
          {
            id: 6,
            name: "ibraheem",
            phone: "+218925536769",
            country: "Libya",
            representative: "Bader Rep",
            created_at: "2024-12-26 03:46 PM",
            last_updated: "2025-02-19 11:44 AM",
            attention: true,
          },
          {
            id: 7,
            name: "libya",
            phone: "+31062856505",
            country: "Netherlands",
            representative: "Iman Rep",
            created_at: "2024-12-12 11:12 AM",
            last_updated: "2025-02-19 11:24 AM",
          },
        ],
      },
      {
        id: 4,
        name: "Not Responding 3 (191)",
        deals: [
          {
            id: 8,
            name: "حمزة العلي",
            phone: "+96477002881133",
            country: "Iraq",
            representative: "Reem Rep",
            created_at: "2025-02-10 02:37 PM",
            last_updated: "2025-02-19 10:14 AM",
          },
          {
            id: 9,
            name: "خالد محمود",
            phone: "+96477647784677",
            country: "Iraq",
            representative: "Reem Rep",
            created_at: "2025-02-11 12:52 PM",
            last_updated: "2025-02-19 10:10 AM",
            attention: true,
          },
        ],
      },
      {
        id: 5,
        name: "Not Responding 4 (761)",
        deals: [
          {
            id: 10,
            name: "محمد خالد",
            phone: "+33767803392",
            country: "France",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:42 AM",
            attention: true,
          },
          {
            id: 11,
            name: "علي الاحمد",
            phone: "+218925525626",
            country: "Libya",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:37 AM",
            attention: true,
          },
        ],
      },
      {
        id: 6,
        name: "Negotiation (761)",
        deals: [
          {
            id: 10,
            name: "محمد خالد",
            phone: "+33767803392",
            country: "France",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:42 AM",
            attention: true,
          },
          {
            id: 11,
            name: "علي الاحمد",
            phone: "+218925525626",
            country: "Libya",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:37 AM",
            attention: true,
          },
        ],
      },
      {
        id: 7,
        name: "Contact",
        deals: [
          {
            id: 10,
            name: "محمد خالد",
            phone: "+33767803392",
            country: "France",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:42 AM",
            attention: true,
          },
          {
            id: 11,
            name: "علي الاحمد",
            phone: "+218925525626",
            country: "Libya",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:37 AM",
            attention: true,
          },
        ],
      },
      {
        id: 8,
        name: "Will Send",
        deals: [
          {
            id: 10,
            name: "محمد خالد",
            phone: "+33767803392",
            country: "France",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:42 AM",
            attention: true,
          },
          {
            id: 11,
            name: "علي الاحمد",
            phone: "+218925525626",
            country: "Libya",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:37 AM",
            attention: true,
          },
        ],
      },
      {
        id: 9,
        name: "Ticket Sent",
        deals: [
          {
            id: 10,
            name: "محمد خالد",
            phone: "+33767803392",
            country: "France",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:42 AM",
            attention: true,
          },
          {
            id: 11,
            name: "علي الاحمد",
            phone: "+218925525626",
            country: "Libya",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:37 AM",
            attention: true,
          },
        ],
      },
      {
        id: 10,
        name: "Processing",
        deals: [
          {
            id: 10,
            name: "محمد خالد",
            phone: "+33767803392",
            country: "France",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:42 AM",
            attention: true,
          },
          {
            id: 11,
            name: "علي الاحمد",
            phone: "+218925525626",
            country: "Libya",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:37 AM",
            attention: true,
          },
        ],
      },
      {
        id: 11,
        name: "Done",
        deals: [
          {
            id: 10,
            name: "محمد خالد",
            phone: "+33767803392",
            country: "France",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:42 AM",
            attention: true,
          },
          {
            id: 11,
            name: "علي الاحمد",
            phone: "+218925525626",
            country: "Libya",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:37 AM",
            attention: true,
          },
        ],
      },
      {
        id: 12,
        name: "Medicine",
        deals: [
          {
            id: 10,
            name: "محمد خالد",
            phone: "+33767803392",
            country: "France",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:42 AM",
            attention: true,
          },
          {
            id: 11,
            name: "علي الاحمد",
            phone: "+218925525626",
            country: "Libya",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:37 AM",
            attention: true,
          },
        ],
      },
      {
        id: 13,
        name: "Old Data",
        deals: [
          {
            id: 10,
            name: "محمد خالد",
            phone: "+33767803392",
            country: "France",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:42 AM",
            attention: true,
          },
          {
            id: 11,
            name: "علي الاحمد",
            phone: "+218925525626",
            country: "Libya",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:37 AM",
            attention: true,
          },
        ],
      },
      {
        id: 14,
        name: "No Respone",
        deals: [
          {
            id: 10,
            name: "محمد خالد",
            phone: "+33767803392",
            country: "France",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:42 AM",
            attention: true,
          },
          {
            id: 11,
            name: "علي الاحمد",
            phone: "+218925525626",
            country: "Libya",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:37 AM",
            attention: true,
          },
        ],
      },
      {
        id: 15,
        name: "Trash",
        deals: [
          {
            id: 10,
            name: "محمد خالد",
            phone: "+33767803392",
            country: "France",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:42 AM",
            attention: true,
          },
          {
            id: 11,
            name: "علي الاحمد",
            phone: "+218925525626",
            country: "Libya",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:37 AM",
            attention: true,
          },
        ],
      },
      {
        id: 16,
        name: "Re-Contact",
        deals: [
          {
            id: 10,
            name: "محمد خالد",
            phone: "+33767803392",
            country: "France",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:42 AM",
            attention: true,
          },
          {
            id: 11,
            name: "علي الاحمد",
            phone: "+218925525626",
            country: "Libya",
            representative: "Bader Rep",
            created_at: "2024-12-27 03:50 PM",
            last_updated: "2025-02-19 11:37 AM",
            attention: true,
          },
        ],
      },
    ]);

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
    const openUpdateStage = () => {
      const modal = new Modal(document.getElementById("updateStage"));
      modal.show();
    };
    const getStageHeaderClass = (stageId) => {
      return `stage-color-${stageId}`;
    };
    const scrollDeals = (direction) => {
      if (!dealsContainer.value) return;
      stopScrolling();
      scrollInterval = setInterval(() => {
        dealsContainer.value.scrollLeft += direction * 20;
      }, 50);
    };

    const updateArrowVisibility = () => {
      if (!dealsContainer.value) return;
      const { scrollLeft, scrollWidth, clientWidth } = dealsContainer.value;
      showLeft.value = scrollLeft > 0;
      showRight.value = scrollLeft + clientWidth < scrollWidth - 1;
    };
    const stopScrolling = () => {
      clearInterval(scrollInterval);
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
      stages,
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
.stage-color-1 {
  background-color: #1b6dd9;
}
.stage-color-2 {
  background-color: rgb(153, 153, 153);
}
.stage-color-3 {
  background-color: rgb(119, 119, 119);
}
.stage-color-4 {
  background-color: rgb(86, 86, 86);
}
.stage-color-5 {
  background-color: rgb(51, 51, 51);
}
.stage-color-6 {
  background-color: rgb(167, 244, 50);
}
.stage-color-7 {
  background-color: rgb(124, 252, 0);
}
.stage-color-8 {
  background-color: rgb(41, 150, 23);
}
.stage-color-9 {
  background-color: rgb(4, 110, 81);
}
.stage-color-10 {
  background-color: rgb(240, 208, 48);
}
.stage-color-11 {
  background-color: rgb(233, 7, 7);
}
.stage-color-12 {
  background-color: rgb(214, 235, 30);
}
.stage-color-13 {
  background-color: rgb(235, 143, 30);
}
.stage-color-14 {
  background-color: rgb(48, 7, 7);
}
.stage-color-15 {
  background-color: rgb(181, 181, 181);
}
.stage-color-16 {
  background-color: rgb(255, 210, 168);
}
</style>
