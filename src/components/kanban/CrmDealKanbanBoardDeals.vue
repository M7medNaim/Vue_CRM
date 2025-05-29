<template>
  <div class="position-relative">
    <div class="kanban-wrapper overflow-y-hidden mt-3" ref="dealsContainer">
      <div class="kanban-board d-flex">
        <template v-for="stage in stages" :key="stage.id">
          <div
            v-if="hiddenStages[stage.id]"
            class="kanban-stage"
            style="
              width: 30px;
              min-width: 30px;
              margin-right: 10px;
              display: flex;
              flex-direction: column;
              border-right: 2px dashed #eee;
              height: 100%;
              align-items: flex-start;
              justify-content: flex-start;
            "
          >
            <button
              class="btn btn-sm btn-light mt-2 d-flex justify-content-center align-items-center"
              @click.stop="hiddenStages[stage.id] = false"
              style="
                font-size: 14px;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                align-self: flex-start;
              "
            >
              <span>+</span>
            </button>
          </div>
          <div v-else class="kanban-stage">
            <!-- @click="
                permissionStore.hasPermission('edit-stage') &&
                  openFilterStage(stage)
              " -->
            <div
              class="stage-header position-relative"
              :title="stage.description || stage.name"
            >
              <div
                class="stageName p-0 d-flex justify-content-between align-items-center"
              >
                <!-- <button
                  v-if="permissionStore.hasPermission('edit-stage')"
                  class="btnPlusStage border-0 bg-transparent text-white position-absolute d-none"
                  style="right: -2%; top: -3%"
                > -->
                <!-- <span class="bg-primary px-2 py-2 fs-5">+</span> -->
                <!-- <i
                    class="fa-solid fa-filter bg-primary px-2 pe-3"
                    style="
                      font-size: 14px;
                      width: 35px;
                      height: 50px;
                      padding-top: 10px;
                    "
                  ></i>
                </button> -->
                <button
                  class="btn btn-sm h-100 rounded-0"
                  style="background-color: #cecfce"
                  @click.stop="hiddenStages[stage.id] = true"
                >
                  <i
                    class="fa-solid fa-minus text-white"
                    style="font-size: 12px"
                  ></i>
                </button>
                <div class="">
                  <span>
                    <i
                      :class="getStageIconById(stage.id)"
                      class="me-1"
                      :style="{ color: stage.color_code }"
                    ></i>
                  </span>
                  <span class="" :style="{ color: stage.color_code }">{{
                    stage.name
                  }}</span>
                  <span
                    class="badge ms-1 text-white"
                    style="font-size: 14px"
                    :style="{
                      backgroundColor: stage.color_code,
                    }"
                  >
                    {{ stage.deal_count ?? 0 }}
                  </span>
                </div>
                <button
                  class="btn btn-sm h-100 rounded-0 p-0"
                  style=""
                  @click="openFilterStage(stage)"
                >
                  <!-- background-color: #fffeff;  -->
                  <span
                    ><i
                      class="fa-solid fa-sliders fs-6"
                      style="color: #6e6f70; padding: 4px"
                    ></i
                  ></span>
                </button>
              </div>
            </div>
            <div class="stage-column">
              <draggable
                v-model="stage.deals"
                :group="{ name: 'deals' }"
                item-key="id"
                class="deal-list"
                @start="drag = true"
                @change="handleDragChange($event, stage.id)"
                @scroll="handleDealContainerScroll($event, stage.id)"
              >
                <template #item="{ element: deal }">
                  <ticket-card
                    :deal="deal"
                    @open-deal-data-card="openDealDataCard(deal.id, stage.id)"
                  />
                </template>
              </draggable>
            </div>
          </div>
        </template>
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
  <deal-data-card
    :key="selectedDeal?.id"
    :deal="selectedDeal"
    :logs="logs"
    :comments="comments"
    :tasks="tasks"
    @open-whatsapp-modal="openWhatsappModal"
    @stage-change="changeDealStage"
  />
  <!-- selectedDeal -->
  <div v-if="permissionStore.hasPermission('edit-stage')">
    <!-- <update-stage :stage="selectedStage" @update-stage="handleStageUpdate" /> -->
    <filter-stage-modal :stage="selectedStage" />
  </div>
</template>

<script>
import {
  ref,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  computed,
  nextTick,
} from "vue";
import draggable from "vuedraggable";
import TicketCard from "@/components/kanban/CrmDealKanbanBoardDealsTicketCard.vue";
import { Modal } from "bootstrap";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import {
  updateDealStage,
  showDeal,
  fetchAdditionalDealsByStageId,
  addViewCount,
} from "@/plugins/services/authService";
import { useI18n } from "vue-i18n";
import Cookies from "js-cookie";
import DealDataCard from "@/components/modals/CrmDealKanbanDealDataModal.vue";
// import UpdateStage from "@/components/modals/CrmDealKanbanBoardDealsUpdateStageModal.vue";
import FilterStageModal from "@/components/modals/CrmDealKanbanBoardDealsFilterStageModal.vue";
import moveCardSound from "@/assets/move-card.wav";
import { closeWebSocket, initializeWebSocket } from "@/plugins/websocket";
import { usePermissionStore, PERMISSIONS } from "@/stores/permissionStore";
import { useKanbanStore } from "@/stores/kanbanStore";
export default {
  name: "CrmDealKanbanBoardDeals",
  components: {
    draggable,
    TicketCard,
    DealDataCard,
    // UpdateStage,
    FilterStageModal,
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
  setup(props, { emit }) {
    const isIdle = ref(false);
    const route = useRoute();
    const dealsContainer = ref(null);
    let scrollInterval = null;
    const drag = ref(false);
    const showLeft = ref(false);
    const showRight = ref(true);
    const selectedStage = ref(null);
    const logs = ref([]);
    const comments = ref([]);
    const isTasksView = computed(() => route.path === "/crm-tasks");
    const tasks = ref([]);
    const toast = useToast();
    const { t } = useI18n();
    const selectedDeal = ref(null);
    const reachedBottom = ref(false);
    const moveSound = new Audio(moveCardSound);
    const permissionStore = usePermissionStore();
    const kanbanStore = useKanbanStore();
    let idleTimer = null;
    const idleTimeLimit = 5 * 60 * 1000;
    const hiddenStages = ref({});

    const handleDragChange = async (event, newStageId) => {
      if (event.added) {
        const deal = event.added.element;
        console.log("deal", deal);
        changeDealStage(deal.id, newStageId, event.added.element.stage_id);
      }
    };

    const playSound = () => {
      moveSound.currentTime = 0;
      moveSound
        .play()
        .catch((error) => console.error("Failed to play sound:", error));
    };

    // Removed duplicate definition of openDealDataCard
    const openDealDataCard = async (dealId, currentStageId = null) => {
      try {
        addViewCount(dealId);
        const dealData = await showDeal(dealId);
        if (dealData.data) {
          const deal = dealData.data.data;
          const checkStageLoaded = () => {
            if (isTasksView.value) {
              return props.stages.find((stage) => stage.id === currentStageId);
            } else {
              return props.stages.some((stage) => stage.id === deal.stage_id);
            }
          };
          const waitForStage = () => {
            return new Promise((resolve) => {
              if (checkStageLoaded()) {
                resolve();
              }
            });
          };

          await waitForStage();

          selectedDeal.value = deal;
          await nextTick();
          setTimeout(() => {
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
          }, 300);
        } else {
          console.error("No matching deal found for ID:", dealId);
        }
      } catch (error) {
        console.error("Error fetching deal data:", error);
      }
    };

    const openFilterStage = (stage) => {
      selectedStage.value = stage;
      const modal = new Modal(document.getElementById("filterStage"));
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

    let firstLoad = true;
    const updateArrowVisibility = () => {
      if (!dealsContainer.value) return;

      const { scrollLeft, scrollWidth, clientWidth } = dealsContainer.value;

      showLeft.value = scrollLeft > 0;

      if (firstLoad) {
        showRight.value = true;
        firstLoad = false;
      } else {
        showRight.value = scrollLeft + clientWidth < scrollWidth - 1;
      }
    };

    const stopScrolling = () => {
      if (scrollInterval) {
        cancelAnimationFrame(scrollInterval);
        scrollInterval = null;
      }
    };
    // update Stage Color and Name
    const handleStageUpdate = (updatedStage) => {
      const stages = ref(props.stages);
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

    const handleWhatsappEvent = (event) => {
      const action = event.action;
      if (action === "create") {
        handleWhatsappMessageCreateEvent(event.data);
      } else if (action == "update") {
        handleWhatsappMessageUpdateEvent(event.data);
      }
    };

    const dealCreateEvent = (data, message) => {
      let stages = ref(props.stages);
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
        phone: data.phone,
      };
      stages.value[stageIndex].deals.unshift(deal);
      toast.success(message);
    };

    const dealUpdateEvent = (data, message) => {
      let stages = ref(props.stages);
      const newStageIndex = stages.value.findIndex(
        (stage) => stage.id == data.updated_data?.stage_id
      );
      const id = data.id;
      const oldStageIndex = stages.value.findIndex(
        (stage) => stage.id == data.stage_id
      );

      const deal = {
        id: id,
        name: data.updated_data.name,
        phone: data.updated_data.phone,
        description: data.updated_data.description,
        stage_id: data.updated_data.stage_id,
        responsible_user: data.updated_data.responsible_user,
        created_at: data.updated_data.created_at,
        updated_at: data.updated_data.updated_at,
        source_id: data.updated_data.source_id,
        view_count: data.updated_data.view_count,
        unread_count: data.updated_data.unread_count,
      };
      console.log("updated data", deal);

      if (oldStageIndex === -1) {
        console.log("old stage not exists");
        if (newStageIndex === -1) {
          console.error(
            "New stage not found, unrelated or something went wrong"
          );
          return;
        }
        stages.value[newStageIndex].deals.unshift(deal);
        stages.value[newStageIndex].deal_count += 1;
      } else {
        console.log("old stage exists");
        const dealIndex = stages.value[oldStageIndex].deals.findIndex(
          (deal) => deal.id == id
        );

        if (dealIndex === -1) {
          console.log("Deal not found in view, unshifting deal to new stage");
          stages.value[newStageIndex].deals.unshift(deal);
          stages.value[oldStageIndex].deal_count = Math.max(
            0,
            stages.value[oldStageIndex].deal_count - 1
          );
          stages.value[newStageIndex].deal_count += 1;
          return;
        } else {
          console.log("deal exists in old stage, moving deal");
          if (newStageIndex === oldStageIndex) {
            stages.value[oldStageIndex].deals[dealIndex] = deal;
          } else if (newStageIndex !== -1) {
            console.log("moving deal to new stage");
            stages.value[newStageIndex].deals.unshift(deal);
            stages.value[newStageIndex].deal_count += 1;
            stages.value[oldStageIndex].deals.splice(dealIndex, 1);
            stages.value[oldStageIndex].deal_count = Math.max(
              0,
              stages.value[oldStageIndex].deal_count - 1
            );
          } else {
            console.log("new stage not exists, trash deal");
            stages.value[oldStageIndex].deals.splice(dealIndex, 1);
            stages.value[oldStageIndex].deal_count = Math.max(
              0,
              stages.value[oldStageIndex].deal_count - 1
            );
          }
        }
      }
      toast.success(message);
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
      toast.success(message);
    };

    const handleTaskEvent = (event) => {
      const { action, data } = event;
      if (action === "create") {
        tasks.value.push(data);
      } else if (action === "update") {
        const index = tasks.value.findIndex((t) => t.id === data.id);
        if (index !== -1) {
          tasks.value[index] = { ...tasks.value[index], ...data };
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
      } else if (action === "update") {
        const index = comments.value.findIndex((c) => c.id === data.id);
        if (index !== -1) {
          comments.value[index] = { ...comments.value[index], ...data };
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
      } else if (action === "update") {
        const logIndex = logs.value.findIndex((log) => log.id === data.id);
        if (logIndex !== -1) {
          logs.value[logIndex] = { ...logs.value[logIndex], ...data };
        } else {
          logs.value.push(data);
        }
      } else if (action === "delete") {
        logs.value = logs.value.filter((log) => log.id !== data.id);
      }
    };

    const handleWhatsappMessageCreateEvent = (data) => {
      console.log("handleWhatsappMessageCreateEvent", data);
      if (data.status == "sent") {
        IncreaseUnreadCount(data.deal_id);
      }
      emit("receive-whatsapp-message", data);
    };

    const handleWhatsappMessageUpdateEvent = (data) => {
      emit("update-whatsapp-message", data);
    };

    const openWhatsappModal = (conversation, id) => {
      console.log("openWhatsappModal in kanban comp", conversation);
      emit("open-whatsapp-modal", conversation);
      DecreaseUnreadCount(id);
    };
    const getContrastColor = (hexColor) => {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 170 ? "#000000" : "#FFFFFF";
    };

    const handleDealContainerScroll = async (event, id) => {
      if (reachedBottom.value) return;
      const scrollTop = event.target.scrollTop;
      const scrollHeight = event.target.scrollHeight;
      const clientHeight = event.target.clientHeight;
      const stages = ref(props.stages);
      const stageIndex = stages.value.findIndex((s) => s.id === id);
      if (
        stages.value[stageIndex].deals.length ===
        stages.value[stageIndex].deal_count
      )
        return;
      if (scrollTop + clientHeight >= scrollHeight - 1) {
        reachedBottom.value = true;
        fetchAdditionalDealsByStageId(
          id,
          10,
          stages.value[stageIndex].deals.length,
          []
        )
          .then((additional_deals) => {
            if (additional_deals.data) {
              if (stageIndex !== -1) {
                stages.value[stageIndex].deals.push(
                  ...additional_deals.data.data
                );
              }
            }
          })
          .finally(() => {
            reachedBottom.value = false;
          });
      }
    };

    const IncreaseUnreadCount = (dealId) => {
      console.log("IncreaseUnreadCount", dealId);
      const stages = ref(props.stages);
      for (let i = 0; i < stages.value.length; i++) {
        const stage = stages.value[i];
        const dealIndex = stage.deals.findIndex((d) => d.id === dealId);
        if (dealIndex !== -1) {
          console.log("dealIndex", dealIndex);
          stage.deals[dealIndex].unread_count += 1;
          break;
        }
      }
    };

    const DecreaseUnreadCount = (dealId) => {
      const stages = ref(props.stages);
      for (let i = 0; i < stages.value.length; i++) {
        const stage = stages.value[i];
        const dealIndex = stage.deals.findIndex((d) => d.id === dealId);
        if (dealIndex !== -1) {
          stage.deals[dealIndex].unread_count = 0;
          break;
        }
      }
    };

    const changeDealStage = async (
      dealId,
      newStageId,
      oldStageId,
      kanban = 1
    ) => {
      const stages = ref(props.stages);
      const newStage = ref(
        stages.value.find((stage) => stage.id == newStageId)
      );
      const oldStage = ref(
        stages.value.find((stage) => stage.id == oldStageId)
      );
      console.log("newStage", newStage.value);
      const deal =
        newStage?.value?.deals.find((d) => d.id == dealId) ??
        oldStage.value.deals.find((d) => d.id == dealId);
      console.log("deal", deal);
      try {
        await updateDealStage(dealId, newStageId);
        deal.stage_id = newStageId;
        if (oldStage.value)
          oldStage.value.deal_count = Math.max(
            0,
            oldStage.value.deal_count - 1
          );
        if (newStage.value) newStage.value.deal_count += 1;
        if (!kanban) {
          oldStage.value.deals.splice(
            oldStage.value.deals.findIndex((d) => d.id == dealId),
            1
          );
          if (newStage.value) newStage.value.deals.unshift(deal);
        }
        toast.success(t("success.dealMoved"));
        playSound();
      } catch (error) {
        console.error("Error updating deal stage:", error);

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
    };
    const refreshPage = () => {
      window.location.reload();
    };
    const startIdleTimer = () => {
      clearIdleTimer();
      idleTimer = setTimeout(setIdle, idleTimeLimit);
    };

    const clearIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
    };

    const setupUserActivityListeners = () => {
      ["mousemove", "keydown", "mousedown", "touchstart"].forEach((event) => {
        window.addEventListener(event, resetIdleTimer);
      });
    };

    const removeUserActivityListeners = () => {
      ["mousemove", "keydown", "mousedown", "touchstart"].forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };

    const resetIdleTimer = () => {
      if (isIdle.value) {
        isIdle.value = false;
        reconnectWebSocket();
      }
      startIdleTimer();
    };

    const setIdle = () => {
      isIdle.value = true;
      disconnectWebSocket();
    };

    const disconnectWebSocket = () => {
      window.Echo.disconnect();
      console.log("WebSocket disconnected due to inactivity");
    };

    const reconnectWebSocket = () => {
      window.Echo.connect();
      const userRole = Cookies.get("user_role");
      const user_id = Cookies.get("user_id");
      let userChannel;

      if (userRole === "super-admin") {
        userChannel = userRole;
      } else {
        userChannel = `${userRole}-${user_id}`;
      }

      if (window.Echo && userChannel) {
        window.Echo.channel(userChannel).listen(
          ".DealEvent",
          ".TaskEvent",
          ".CommentEvent",
          ".LogEvent",
          ".WhatsappEvent"
        );
        // window.Echo.channel(userChannel)
        //   .listen(".DealEvent", (event) => {
        //     console.log("DealEvent received:", event);
        //     handleDealEvent(event);
        //   })
        //   .listen(".TaskEvent", (event) => {
        //     console.log("TaskEvent received:", event);
        //     handleTaskEvent(event);
        //   })
        //   .listen(".CommentEvent", (event) => {
        //     console.log("CommentEvent received:", event);
        //     handleCommentEvent(event);
        //   })
        //   .listen(".LogEvent", (event) => {
        //     console.log("LogEvent received:", event);
        //     handleLogEvent(event);
        //   })
        //   .listen(".WhatsappEvent", (event) => {
        //     console.log("WhatsappEvent received:", event);
        //     handleWhatsappEvent(event);
        //   });
      }

      console.log("WebSocket reconnected on user activity");
      kanbanStore.setHasNewChanges(true);
    };

    const getStageIconById = (stageId) => {
      const iconMap = {
        1: "fa-solid fa-user-plus",
        2: "fa-solid fa-hourglass",
        3: "fa-solid fa-hourglass-end",
        4: "fa-solid fa-phone-volume",
        5: "fa-solid fa-message",
        6: "fa-solid fa-comments",
        7: "fa-solid fa-people-arrows",
        8: "fa-solid fa-calendar-plus",
        9: "fa-solid fa-calendar-check",
        10: "fa-solid fa-spinner",
        11: "fa-solid fa-circle-check",
        12: "fa-solid fa-capsules",
        13: "fa-solid fa-moon",
        14: "fa-solid fa-phone-slash",
        15: "fa-solid fa-repeat",
        16: "fa-solid fa-trash-can",
      };
      return iconMap[stageId] || "fa-solid fa-circle";
    };
    // SORT DEALS BY CREATED AT
    // function sortDealsByCreatedAt(stageId) {
    //   const stage = stages.value.find((s) => s.id === stageId);
    //   if (!stage) return;

    //   const currentDirection = sortDirections.value[stageId] || "desc";

    //   const newDirection = currentDirection === "asc" ? "desc" : "asc";
    //   sortDirections.value[stageId] = newDirection;

    //   stage.deals.sort((a, b) => {
    //     const dateA = new Date(a.created_at);
    //     const dateB = new Date(b.created_at);
    //     console.log("", newDirection, stage.id, sortDirections.value[stageId]);
    //     return newDirection === "asc" ? dateA - dateB : dateB - dateA;
    //   });
    // }

    onMounted(async () => {
      dealsContainer.value.addEventListener("scroll", updateArrowVisibility);
      document.addEventListener("mouseup", stopScrolling);
      document.addEventListener("mouseleave", stopScrolling);
      updateArrowVisibility();
      startIdleTimer();
      setupUserActivityListeners();

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
            })
            .listen(".WhatsappEvent", (event) => {
              console.log("WhatsappEvent received:", event);
              handleWhatsappEvent(event);
            });
        } else {
          console.error(
            "WebSocket or userChannel is not initialized properly."
          );
        }
      } catch (error) {
        console.error("Error mounting component:", error);
      }

      props.stages.forEach((stage) => {
        hiddenStages.value[stage.id] = false;
      });
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

    onBeforeUnmount(() => {
      clearIdleTimer();
      removeUserActivityListeners();
    });

    return {
      // stages,
      drag,
      getStageHeaderClass,
      dealsContainer,
      scrollDeals,
      stopScrolling,
      showLeft,
      showRight,
      openDealDataCard,
      // openUpdateStage,
      openFilterStage,
      isTasksView,
      selectedStage,
      handleStageUpdate,
      logs,
      comments,
      tasks,
      handleDragChange,
      selectedDeal,
      openWhatsappModal,
      getContrastColor,
      handleDealContainerScroll,
      reachedBottom,
      changeDealStage,
      permissionStore,
      PERMISSIONS,
      getStageIconById,
      isIdle,

      // Methods
      refreshPage,
      startIdleTimer,
      clearIdleTimer,
      setupUserActivityListeners,
      removeUserActivityListeners,
      resetIdleTimer,
      setIdle,
      disconnectWebSocket,
      reconnectWebSocket,
      hiddenStages,
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
  display: flex;
  flex-direction: row;
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
  min-width: 265px;
  width: 265px;
  margin-right: 10px;
  text-align: start;
  padding-left: 3px;
  transition: all 0.5s;
  cursor: pointer;
  /* clip-path: polygon(
    0 0,
    calc(100% - 15px) 0,
    100% 50%,
    calc(100% - 15px) 100%,
    0 100%
  ); */
}
.stageName {
  background-color: #f4f4f4;
  border: 2px solid #d2d5d6;
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
  width: 273px;
  min-width: 273px;
  height: 100%;
  padding: 0.5rem 1rem 0 0;
  border-right: 2px dashed #eee;
}

.deal-list {
  width: 270px;
  min-width: 270px;
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
