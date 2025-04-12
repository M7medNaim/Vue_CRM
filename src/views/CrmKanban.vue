<template>
  <div class="mt-3">
    <TopHeader2
      :initial-filters="filters"
      @filter-applied="applyFilters"
      @reset-filter="resetFilter"
    />
  </div>
  <!-- <div class="watsappIcon position-absolute z-3">
    <button class="position-relative fs-5 rounded-2" @click="openWhatsappModal">
      <p class="position-absolute textWhats">
        {{ $t("kanban-modal-edit-whatsapp") }}
      </p>
      <div class="text-white">
        <i class="fa-brands fa-whatsapp"></i>
      </div>
    </button>
  </div> -->
  <KanbanBoard :stages="stages" defaultColor="#333" />
  <!-- <WhatsappModal ref="whatsappModalRef" /> -->
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import TopHeader2 from "@/components/headers/TopHeader2.vue";
import KanbanBoard from "@/components/kanban/KanbanBoard.vue";
// import { kanbanStages } from "@/plugins/stages";
// import { Modal } from "bootstrap";
// import WhatsappModal from "@/components/modals/WhatsappModal.vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
// import { closeWebSocket, initializeWebSocket } from "@/plugins/websocket";
import { getDealsKanban } from "@/plugins/services/authService";
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
    // const stages = ref(kanbanStages);
    const stages = ref([]);
    // const whatsappModalRef = ref(null);

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
    const fetchStages = async () => {
      try {
        const response = await getDealsKanban();
        console.log(response.data);

        if (Array.isArray(response.data.data)) {
          stages.value = response.data.data.map((stage) => ({
            id: stage.id,
            name: stage.name,
            description: stage.description || null,
            color_code: stage.color_code,
            deals: stage.deals || [],
          }));
          toast.success(t("success.loadKanban"));
        } else {
          toast.error(t("error.loadKanban"));
        }
      } catch (error) {
        console.error("Error fetching stages:", error);
        toast.error(t("error.loadKanban"));
      }
    };
    const applyFilters = async (newFilters) => {
      try {
        filters.value = { ...newFilters };
        // toast.success("تم تطبيق الفلتر بنجاح", {
        //   timeout: 3000,
        // });
      } catch (error) {
        console.error("Error applying filters:", error);
        toast.error(t("error.applyFilters"), {
          timeout: 3000,
        });
      }
    };

    const resetFilter = async () => {
      try {
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
        toast.success(t("success.resetFilters"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error resetting filters:", error);
        toast.error(t("error.resetFilters"), {
          timeout: 3000,
        });
      }
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

    // const openWhatsappModal = () => {
    //   try {
    //     const modal = new Modal(document.getElementById("whatsappModal"));
    //     modal.show();
    //     // toast.info("يمكنك إرسال رسالة واتساب", {
    //     //   timeout: 3000,
    //     // });
    //   } catch (error) {
    //     console.error("Error opening WhatsApp modal:", error);
    //     toast.error(t("error.openWhatsappModal"), {
    //       timeout: 3000,
    //     });
    //   }
    // };
    // const handleDealEvent = (event) => {
    //   const { action, data } = event;

    //   if (!data || !data.stage_id) return;

    //   const stageIndex = stages.value.findIndex(
    //     (stage) => stage.id === data.stage_id
    //   );

    //   if (stageIndex === -1) return;

    //   const stage = stages.value[stageIndex];

    //   if (action === "create") {
    //     stage.items.push(data);
    //   } else if (action === "update") {
    //     const itemIndex = stage.items.findIndex((item) => item.id === data.id);
    //     if (itemIndex !== -1) {
    //       stage.items[itemIndex] = { ...stage.items[itemIndex], ...data };
    //     } else {
    //       stage.items.push(data);
    //     }
    //   } else if (action === "delete") {
    //     stage.items = stage.items.filter((item) => item.id !== data.id);
    //   }
    // };
    // const handleTaskEvent = (event) => {
    //   console.log("TaskEvent received:", event);
    // };

    // const handleCommentEvent = (event) => {
    //   console.log("CommentEvent received:", event);
    // };

    // const handleLogEvent = (event) => {
    //   console.log("LogEvent received:", event);
    // };
    onMounted(async () => {
      try {
        await fetchStages();
        window.addEventListener("contextmenu", handleRightClick);
        // toast.success("تم تحميل لوحة كانبان بنجاح", {
        //   timeout: 3000,
        // });
        // initialize WebSocket connection
        // await initializeWebSocket();
        // // listen for WebSocket events
        // const userId = 1;
        // const userChannel = `sales-${userId}`;
        // window.Echo.channel(userChannel)
        //   .listen("DealEvent", (event) => {
        //     console.log("DealEvent received:", event);
        //     handleDealEvent(event);
        //   })
        //   .listen("TaskEvent", (event) => {
        //     console.log("TaskEvent received:", event);
        //     handleTaskEvent(event);
        //   })
        //   .listen("CommentEvent", (event) => {
        //     console.log("CommentEvent received:", event);
        //     handleCommentEvent(event);
        //   })
        //   .listen("LogEvent", (event) => {
        //     console.log("LogEvent received:", event);
        //     handleLogEvent(event);
        //   });

        // window.Echo.channel("super-admin").listen("DealEvent", (data) => {
        //   console.log(data.message);
        // });
      } catch (error) {
        // console.error("Error mounting component:", error);
        toast.error(t("error.loadKanban"), {
          timeout: 3000,
        });
      }
    });

    onUnmounted(() => {
      window.removeEventListener("contextmenu", handleRightClick);

      // // Leave the WebSocket channels
      // window.Echo.leave("super-admin");

      // // Close the WebSocket connection
      // closeWebSocket();
    });

    return {
      stages,
      filters,
      applyFilters,
      resetFilter,
      // openWhatsappModal,
      // whatsappModalRef,
    };
  },
};
</script>

<style scoped>
.watsappIcon {
  bottom: 3.7%;
  right: 3%;
}
.textWhats {
  font-size: 16px;
}
button {
  border: 2px solid #25d366;
  width: 6.8em;
  height: 2em;
  transition: 0.5s;
  background: #f6f5f5;
}

button p {
  top: 0.4em;
  left: 1.5em;
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
  left: 0.8em;
  color: #fff;
}

button:hover i {
  opacity: 1;
}

button:hover {
  background-color: #25d366;
}
</style>
