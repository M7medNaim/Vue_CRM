<template>
  <div class="position-relative">
    <div class="kanban-wrapper mt-3" ref="dealsContainer">
      <div class="kanban-board">
        <!-- Fixed Stages Header -->
        <div class="stages-header d-flex">
          <div
            v-for="stage in stages"
            :key="stage.id"
            class="stage-header position-relative"
            @click="openUpdateStage(stage)"
            :title="stage.description || stage.name"
          >
            <!-- :style="{ backgroundColor: stage.color || defaultColor }" -->
            <div
              class="stageName py-1 p-0 text-white"
              :style="{ backgroundColor: stage.color_code }"
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
              @change="handleDragChange($event, stage.id)"
            >
              <template #item="{ element: deal }">
                <CustomerCard
                  :deal="deal"
                  @open-deal-data-card="openDealDataCard(deal.id)"
                />
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
  <!-- :key="selectedDeal?.id" -->
  <DealDataCard
    :key="selectedDeal?.id"
    :deal="selectedDeal"
    :logs="logs"
    :comments="comments"
    :tasks="tasks"
  />
  <!-- selectedDeal -->
  <UpdateStage :stage="selectedStage" @update-stage="handleStageUpdate" />
</template>

<script>
import { ref, onMounted, onUnmounted, computed, nextTick } from "vue";
import draggable from "vuedraggable";
import CustomerCard from "./CustomerCard.vue";
import { Modal } from "bootstrap";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import { updateDealStage } from "@/plugins/services/authService";
import { useI18n } from "vue-i18n";
import Cookies from "js-cookie";
import { showDeal } from "@/plugins/services/authService";
import DealDataCard from "@/components/modals/DealDataCard.vue";
import UpdateStage from "@/components/modals/UpdateStage.vue";
import moveCardSound from "@/assets/move-card.wav";
import { closeWebSocket, initializeWebSocket } from "@/plugins/websocket";

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
    const logs = ref([]);
    const comments = ref([]);
    const tasks = ref([]);
    const toast = useToast();
    const { t } = useI18n();
    const selectedDeal = ref(null);
    const isTasksView = computed(() => route.path === "/crm-tasks");

    const moveSound = new Audio(moveCardSound);

    const handleDragChange = async (event, newStageId) => {
      if (event.added) {
        const deal = event.added.element;
        const oldStageId = deal.stage_id;

        try {
          await updateDealStage(deal.id, newStageId);

          deal.stage_id = newStageId;
          toast.success(t("success.dealMoved"));
        } catch (error) {
          console.error("Error updating deal stage:", error.response?.data);

          const oldStage = props.stages.find((s) => s.id === oldStageId);
          if (oldStage) {
            const currentStage = props.stages.find((s) => s.id === newStageId);
            if (currentStage) {
              const dealIndex = currentStage.deals.findIndex(
                (d) => d.id === deal.id
              );
              if (dealIndex !== -1) {
                const [removedDeal] = currentStage.deals.splice(dealIndex, 1);
                oldStage.deals.push(removedDeal);
              }
            }
          }

          toast.error(t("error.dealMoveFailed"));
        }
      }
    };

    const handleDragEnd = (evt) => {
      if (evt.from !== evt.to) {
        moveSound.currentTime = 0;
        moveSound
          .play()
          .catch((error) => console.log("Failed to play sound:", error));
      }
    };
    // open data deal modal
    // const openDealDataCard = async (dealId) => {
    //   try {
    //     const dealData = await showDeal(dealId);
    //     if (dealData.data) {
    //       selectedDeal.value = dealData.data.data;
    //       // const modal = new Modal(document.getElementById("dealDataCard"));
    //       // modal.show();
    //     } else {
    //       console.error("No matching deal found for ID:", dealId);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching deal data:", error);
    //   }
    // };
    const openDealDataCard = async (dealId) => {
      try {
        const dealData = await showDeal(dealId);
        if (dealData.data) {
          selectedDeal.value = dealData.data.data;
          await nextTick();

          const modalEl = document.getElementById("dealDataCard");
          const modal = new Modal(modalEl);
          modal.show();

          modalEl.addEventListener(
            "hidden.bs.modal",
            () => {
              const backdrop = document.querySelector(".modal-backdrop");
              if (backdrop) {
                backdrop.remove();
                document.body.classList.remove("modal-open");
                document.body.style.paddingRight = null;
              }
            },
            { once: true }
          );
        } else {
          console.error("No matching deal found for ID:", dealId);
        }
      } catch (error) {
        console.error("Error fetching deal data:", error);
      }
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

    const handleDealEvent = (event) => {
      const action = event.action;
      if (action === "create") {
        dealCreateEvent(event.data, event.message);
      } else if (action === "update") {
        dealUpdateEvent(event.data, event.message);
      } else if (action === "delete") {
        dealDeleteEvent(event.data, event.message);
      }
    };

    const dealCreateEvent = (data, message) => {
      const stageIndex = stages.value.findIndex(
        (stage) => stage.id == data.stage_id
      );
      if (stageIndex === -1) {
        console.error("Stage not found");
        return;
      }
      const deal = {
        id: data.id,
        name: data.name,
        description: data.description,
        stage_id: data.stage_id,
        responsible_user: data.responsible_user,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
      stages.value[stageIndex].deals.unshift(deal);
      console.log(message);
    };

    const dealUpdateEvent = (data, message) => {
      let stages = ref(props.stages);
      const id = data.id;
      const updatedData = data.updated_data;
      const stageIndex = stages.value.findIndex(
        (stage) => stage.id == data.stage_id
      );
      const dealIndex = stages.value[stageIndex].deals.findIndex(
        (deal) => deal.id == id
      );
      if (stageIndex === -1) {
        console.error("Stage not found");
        return;
      }
      if (dealIndex === -1) {
        const deal = {
          id: data.id,
          name: updatedData.name,
          phone: updatedData.phone,
          description: updatedData.description,
          stage_id: updatedData.stage_id,
          responsible_user: updatedData.responsible_user,
          created_at: updatedData.created_at,
          updated_at: updatedData.updated_at,
          source_id: updatedData.source_id,
        };
        stages.value[stageIndex].deals.unshift(deal);
        console.log("Deal not found in the new stage, creating one.");
        return;
      }

      let deal = stages.value[stageIndex].deals[dealIndex];
      deal.name = updatedData.name ?? deal.name;
      deal.description = updatedData.description ?? deal.description;
      deal.stage_id = updatedData.stage_id ?? deal.stage_id;
      deal.responsible_user =
        updatedData.responsible_user ?? deal.responsible_user;
      deal.updated_at = updatedData.updated_at;

      const newStageIndex = stages.value.findIndex(
        (stage) => stage.id == updatedData.stage_id
      );
      // Update the deal in the UI
      if (newStageIndex === stageIndex) {
        console.log("Deal is in the same stage");
        stages.value[stageIndex].deals[dealIndex] = deal;
      } else if (newStageIndex !== -1) {
        console.log("Deal moved to a new stage");
        stages.value[newStageIndex].deals.unshift(deal);
        stages.value[stageIndex].deals.splice(dealIndex, 1);
      } else {
        console.log("New stage not found");
        stages.value[stageIndex].deals.splice(dealIndex, 1);
      }
      console.log(message);
    };

    const dealDeleteEvent = (deal, message) => {
      let stages = ref(props.stages);
      const deal_id = deal.id;
      const stage_id = deal.stage_id;
      const stageIndex = stages.value.findIndex(
        (stage) => stage.id == stage_id
      );
      if (stageIndex == -1) {
        console.error("Stage not found");
        return;
      }
      const dealIndex = stages.value[stageIndex].deals.findIndex(
        (d) => d.id == deal_id
      );
      if (dealIndex != -1) {
        stages.value[stageIndex].deals.splice(dealIndex, 1);
      }
      console.log(message);
    };

    const handleTaskEvent = (event) => {
      const { action, data } = event;

      if (action === "create") {
        tasks.value.push(data);
        // tasks.value.push({
        //   id: data.id,
        //   text: data.note,
        //   date: new Date().toLocaleString(),
        // });
      } else if (action === "update") {
        const index = tasks.value.findIndex((t) => t.id === data.id);
        if (index !== -1) {
          tasks.value[index] = { ...tasks.value[index], ...data };
          // tasks.value[index].text = data.note;
        } else {
          tasks.value.push(data);
        }
      } else if (action === "delete") {
        tasks.value = tasks.value.filter((t) => t.id !== data.id);
      }
    };

    const handleCommentEvent = (event) => {
      const { action, data } = event;

      if (action === "create") {
        comments.value.push(data);
        // comments.value.push({
        //   id: data.id,
        //   text: data.note,
        //   date: new Date().toLocaleString(),
        // });
      } else if (action === "update") {
        const index = comments.value.findIndex((c) => c.id === data.id);
        if (index !== -1) {
          comments.value[index] = { ...comments.value[index], ...data };
          // comments.value[index].text = data.note;
        } else {
          comments.value.push(data);
        }
      } else if (action === "delete") {
        comments.value = comments.value.filter((c) => c.id !== data.id);
      }
    };

    const handleLogEvent = (event) => {
      const { action, data } = event;

      if (action === "create") {
        logs.value.push(data);
        // logs.value.push({
        //   id: data.id,
        //   text: data.note,
        //   date: new Date().toLocaleString(),
        // });
      } else if (action === "update") {
        const logIndex = logs.value.findIndex((log) => log.id === data.id);
        if (logIndex !== -1) {
          logs.value[logIndex] = { ...logs.value[logIndex], ...data };
          // logs.value[logIndex].text = data.note;
        } else {
          logs.value.push(data);
        }
      } else if (action === "delete") {
        logs.value = logs.value.filter((log) => log.id !== data.id);
      }
    };

    onMounted(async () => {
      dealsContainer.value.addEventListener("scroll", updateArrowVisibility);
      document.addEventListener("mouseup", stopScrolling);
      document.addEventListener("mouseleave", stopScrolling);
      updateArrowVisibility();

      try {
        // Initialize WebSocket connection
        await initializeWebSocket();
        // const user_id = 1;
        // const userRole = "sales";
        const userRole = Cookies.get("user_role");
        const user_id = Cookies.get("user_id");
        let userChannel;
        if (userRole === "super-admin") {
          userChannel = userRole;
        } else {
          userChannel = `${userRole}-${user_id}`;
        }

        // Listen to the appropriate channel
        if (window.Echo && userChannel) {
          window.Echo.channel(userChannel)
            .listen(".DealEvent", (event) => {
              console.log("DealEvent received:", event);
              handleDealEvent(event);
            })
            .listen(".TaskEvent", (event) => {
              console.log("TaskEvent received:", event);
              handleTaskEvent(event);
            })
            .listen(".CommentEvent", (event) => {
              console.log("CommentEvent received:", event);
              handleCommentEvent(event);
            })
            .listen(".LogEvent", (event) => {
              console.log("LogEvent received:", event);
              handleLogEvent(event);
            });
        } else {
          console.error(
            "WebSocket or userChannel is not initialized properly."
          );
        }
      } catch (error) {
        console.error("Error mounting component:", error);
      }
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

      const user_id = 1;
      const userRole = "sales";

      let userChannel =
        userRole === "super-admin" ? userRole : `${userRole}-${user_id}`;

      // Leave the WebSocket channel
      window.Echo.leave(userChannel);

      // Close the WebSocket connection
      closeWebSocket();
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
      logs,
      comments,
      tasks,
      handleDragChange,
      selectedDeal,
    };
  },
};
</script>

<style scoped>
.kanban-wrapper {
  width: 100%;
  height: calc(100vh - 127px);
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
  min-width: 285px;
  width: 285px;
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
  width: 295px;
  min-width: 295px;
  height: 100%;
  padding: 0.5rem 1rem 0 0;
  border-right: 2px dashed #eee;
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
@media (min-width: 1000px) and (max-width: 1200px) {
  .kanban-wrapper {
    height: calc(100vh - 130px);
  }
}
</style>
