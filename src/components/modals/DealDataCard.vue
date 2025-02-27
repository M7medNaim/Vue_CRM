<template>
  <div
    class="modal fade"
    id="dealDataCard"
    tabindex="-1"
    aria-labelledby="dealDataCardLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <div
          class="modal-header py-0 d-flex justify-content-between align-items-center"
        >
          <div class="d-flex align-items-center gap-4">
            <h5 class="modal-title" id="dealDataCardLabel">
              Edit Deal
              <button
                type="button"
                @click="toggleEditMode"
                class="border-0 p-0 bg-transparent"
                v-if="!isEditMode"
              >
                <i class="fa-solid fa-pencil"></i>
              </button>
            </h5>
          </div>
          <div class="rating">
            <RatingStars v-model="rating" />
          </div>
          <div class="source">
            <i class="fa-solid fa-circle-exclamation me-1"></i>
            <span>Source: Whatsapp</span>
          </div>
          <div class="d-flex justify-content-end align-items-center gap-2">
            <button class="btn border-none text-primary" @click="startCall">
              <i class="fa-solid fa-phone-volume fs-5"></i> Start a Call
            </button>
            <button class="btn border-none text-primary" @click="startWhatsapp">
              <i class="fab fa-whatsapp border-none text-primary fs-5"></i> Chat
              via Whatsapp
            </button>
            <button class="btn border-none text-primary" @click="sendEmail">
              <i class="fas fa-envelope fs-5"></i> Send an E-mail
            </button>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
        </div>
        <div class="modal-body">
          <!-- Stages -->
          <div class="stages-container mb-4" @dblclick="handleDoubleClick">
            <div class="d-flex stages-wrapper">
              <button
                v-for="stage in stages"
                :key="stage.id"
                class="btn stage-btn border-0"
                :class="getStageClasses(stage.id).classes"
                @mouseover="handleStageHover(stage.id)"
                @mouseleave="handleStageLeave"
                @click="changeStage(stage.id)"
                :title="stage.name"
                :disabled="!isEditMode"
                :style="{
                  backgroundColor: getStageClasses(stage.id).backgroundColor,
                }"
              >
                {{ truncateText(stage.name) }}
              </button>
            </div>
          </div>

          <!-- Customer Details Form -->
          <div class="row">
            <div class="col-12 col-md-6 border-end">
              <!-- Full Name -->
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-a"></i> Full Name<span
                      class="text-danger"
                      >*</span
                    >
                  </label>
                </div>
                <div class="col-10">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control bg-light text-secondary py-2"
                      v-model="customerData.fullName"
                      placeholder="Full Name"
                      :readonly="!isEditMode"
                    />
                    <button
                      class="btn btn-primary px-3 fs-5"
                      @click="toggleNickName"
                    >
                      {{ showNickName ? "-" : "+" }}
                    </button>
                  </div>
                </div>
              </div>
              <!-- Nick Name -->
              <div
                class="row mb-3"
                @dblclick="handleDoubleClick"
                v-if="showNickName"
              >
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-a"></i> Nick Name<span
                      class="text-danger"
                      >*</span
                    >
                  </label>
                </div>
                <div class="col-10">
                  <input
                    type="text"
                    class="form-control bg-light text-secondary py-2"
                    v-model="customerData.nickName"
                    placeholder="Nick Name"
                    :readonly="!isEditMode"
                  />
                </div>
              </div>

              <!-- Phone -->
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-phone-volume"></i> Phone<span
                      class="text-danger"
                      >*</span
                    >
                  </label>
                </div>
                <div class="col-10">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control bg-light text-secondary py-2"
                      v-model="customerData.phone"
                      placeholder="Full Name"
                      :readonly="!isEditMode"
                    />
                    <button
                      class="btn btn-primary px-3 fs-5"
                      @click="togglePhone2"
                    >
                      {{ showPhone2 ? "-" : "+" }}
                    </button>
                  </div>
                </div>
              </div>
              <!-- phone2 -->
              <div
                class="row mb-3"
                @dblclick="handleDoubleClick"
                v-if="showPhone2"
              >
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-phone-volume"></i> Phone 2<span
                      class="text-danger"
                      >*</span
                    >
                  </label>
                </div>
                <div class="col-10">
                  <input
                    type="text"
                    class="form-control bg-light text-secondary py-2"
                    v-model="customerData.phone2"
                    placeholder="Phone 2"
                    :readonly="!isEditMode"
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-envelope"></i> Email<span
                      class="text-danger"
                      >*</span
                    >
                  </label>
                </div>
                <div class="col-10">
                  <input
                    type="text"
                    class="form-control bg-light text-secondary py-2"
                    v-model="customerData.email"
                    placeholder="Email"
                    :readonly="!isEditMode"
                  />
                </div>
              </div>
              <!-- Notes -->
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-note-sticky"></i> Notes</label
                  >
                </div>
                <div class="col-10">
                  <textarea
                    class="form-control bg-light"
                    rows="4"
                    v-model="customerData.notes"
                    :readonly="!isEditMode"
                  ></textarea>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-2">
                  <label for=""
                    ><i class="fa-solid fa-circle-question"></i>
                    Questions</label
                  >
                </div>
                <div class="col-10">
                  <button
                    class="btn btn-primary w-100"
                    @click="openQuestionsModal"
                  >
                    View Report
                  </button>
                </div>
              </div>

              <!-- Company and Representative -->
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-user"></i> Assign Company</label
                  >
                </div>
                <div class="col-10">
                  <select
                    class="form-select bg-light text-secondary py-2"
                    v-model="customerData.company"
                    :readonly="!isEditMode"
                  >
                    <option value="Eurasia Admin">Eurasia Admin</option>
                    <option value="none">none</option>
                  </select>
                </div>
              </div>

              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-users"></i> Assign
                    Representative</label
                  >
                </div>
                <div class="col-10">
                  <select
                    class="form-select bg-light text-secondary py-2"
                    v-model="customerData.representative"
                    :readonly="!isEditMode"
                  >
                    <option value="">Select Representative</option>
                  </select>
                </div>
              </div>

              <!-- Packages -->
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-cubes"></i> Packages</label
                  >
                </div>
                <div class="col-10">
                  <div class="" v-if="packages.length > 0">
                    <div
                      v-for="(item, index) in packages"
                      :key="index"
                      class="packages d-flex align-items-center gap-3 mb-2"
                    >
                      <select
                        class="form-select bg-light"
                        v-model="item.serviceSelect"
                      >
                        <option value="" disabled>Select a service</option>
                      </select>
                      <input
                        type="text"
                        class="bg-light text-secondary p-2"
                        v-model="item.serviceInput"
                        placeholder="service"
                      />
                      <button
                        class="btn btn-secondary"
                        @click="removePackage(index)"
                      >
                        x
                      </button>
                    </div>
                  </div>
                  <button
                    class="btn btn-primary mt-2 fs-5 px-3"
                    @click="addNewPackage"
                    :disabled="!isEditMode"
                  >
                    +
                  </button>
                </div>
              </div>
              <!-- Deal Status -->
              <div class="row mb-3">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-cubes"></i> Deal Status
                  </label>
                </div>
                <div class="col-10">
                  <span class="fw-bolder" style="font-size: 14px"
                    >Not Responding 2</span
                  >
                </div>
              </div>
              <div class="row">
                <div class="col-6 pt-2">
                  <h5>History</h5>
                </div>
                <div
                  class="col-6 d-flex justify-content-end align-items-center gap-2"
                  v-if="isEditMode"
                >
                  <button class="btn btn-primary px-4 py-2" @click="confirm">
                    Confirm
                  </button>
                  <button
                    class="btn btn-secondary px-4 py-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div class="history ps-2 mt-2">
                <div class="row bg-light pt-2 text-secondary border border-top">
                  <div class="col-3">
                    <p>Wed Feb 19 2025 10:14 ص</p>
                  </div>
                  <div class="col-9">
                    <p>
                      Super Admin moved the deal from "Processing" to "Not
                      Responding 2" stage.
                    </p>
                  </div>
                </div>
                <div class="row bg-light text-secondary border border-top">
                  <div class="col-3">
                    <p>Wed Feb 19 2025 10:14 ص</p>
                  </div>
                  <div class="col-9">
                    <p>
                      Super Admin moved the deal from "Processing" to "Not
                      Responding 2" stage.
                    </p>
                  </div>
                </div>
                <div class="row bg-light text-secondary border border-top">
                  <div class="col-3">
                    <p>Wed Feb 19 2025 10:14 ص</p>
                  </div>
                  <div class="col-9">
                    <p>
                      Super Admin moved the deal from "Processing" to "Not
                      Responding 2" stage.
                    </p>
                  </div>
                </div>
                <div class="row bg-light text-secondary border border-top">
                  <div class="col-3">
                    <p>Wed Feb 19 2025 10:14 ص</p>
                  </div>
                  <div class="col-9">
                    <p>
                      Super Admin moved the deal from "Processing" to "Not
                      Responding 2" stage.
                    </p>
                  </div>
                </div>
                <div class="row bg-light text-secondary border border-top">
                  <div class="col-3">
                    <p>Wed Feb 19 2025 10:14 ص</p>
                  </div>
                  <div class="col-9">
                    <p>
                      Super Admin moved the deal from "Processing" to "Not
                      Responding 2" stage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <!-- right section Comments And Tasks -->
            <div class="col-12 col-md-6 px-4">
              <!-- Comments Section -->
              <div class="row">
                <div class="col-12 px-0">
                  <div class="input-group">
                    <span
                      class="btn btn-light text-primary me-1"
                      style="background-color: #eee"
                    >
                      Comment
                    </span>
                    <input
                      type="text"
                      class="form-control bg-light text-secondary py-2 me-1"
                      v-model="customerData.comment"
                      placeholder="Add a New Task"
                    />
                    <button class="btn btn-primary py-1 px-4" type="submit">
                      Submit
                    </button>
                  </div>
                </div>
                <div class="col-12 mt-2 bg-light showComments py-2 rounded-3">
                  <div
                    v-for="(comment, index) in comments"
                    :key="index"
                    class="row mt-2"
                  >
                    <div class="col-3">
                      <img
                        src="../../assets/default-user-image.jpg"
                        alt="Seals Image"
                        width="45"
                        height="45"
                      />
                      <span class="ms-2">{{ comment.user }}</span>
                    </div>
                    <div class="col-9">
                      <div
                        :class="[
                          'rounded-3 p-2',
                          comment.isAdmin
                            ? 'adminComment'
                            : 'bg-primary text-white',
                        ]"
                        style="width: fit-content"
                      >
                        <span>{{ comment.text }}</span
                        ><br />
                        <span>{{ comment.date }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- task Section -->
              <div class="row mt-4">
                <div class="col-12 p-0">
                  <div class="input-group">
                    <span
                      class="btn btn-light text-primary me-1 px-4"
                      style="background-color: #eee"
                    >
                      Tasks
                    </span>
                    <input
                      type="text"
                      class="form-control bg-light text-secondary py-2 me-1"
                      v-model="customerData.task"
                      placeholder="Add a New Task"
                    />
                    <input
                      type="date"
                      class="form-control bg-light text-secondary py-2 me-1"
                      v-model="customerData.date"
                      placeholder="Select a Date"
                    />
                    <button class="btn btn-primary py-1 px-4" type="submit">
                      Submit
                    </button>
                  </div>
                </div>
                <div class="col-12 mt-2 bg-light p-3 showTasks rounded-3">
                  <div
                    class="row bg-light-subtle border-top border-bottom py-1"
                  >
                    <div class="col-5">Description</div>
                    <div class="col-5">DATE</div>
                    <div class="col-2">STATUS</div>
                  </div>
                  <!-- data Tasks -->
                  <div
                    v-for="(task, index) in tasks"
                    :key="task.id"
                    class="row text-secondary mt-2 align-items-center border-light-subtle pb-2 border-bottom"
                    :class="{ 'delete-animation': task.toDelete }"
                  >
                    <div class="col-5">{{ task.description }}</div>
                    <div class="col-5">
                      <input
                        type="date"
                        class="form-control bg-secondary-subtle text-secondary py-2 me-1"
                        v-model="task.date"
                        placeholder="Select a Date"
                      />
                    </div>
                    <div class="col-2">
                      <input
                        type="checkbox"
                        class="custom-checkbox"
                        v-model="task.status"
                        @change="() => handleTaskCompletion(index)"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- watsapp Chat -->
              <!-- <div class="row">
                <div class="col-6 m-auto my-4">
                  <button class="btn btn-success px-4 py-3">
                    <i class="fa-brands fa-whatsapp me-2 fs-5"></i>
                    <span>Start Whatsapp Chat</span>
                  </button>
                </div>
                <div class="col-12">
                  <div class="input-group">
                    <button class="btn btn-light text-secondary" type="submit">
                      <i class="fa-solid fa-face-smile"></i>
                    </button>
                    <button
                      class="btn btn-light text-secondary border-start"
                      type="submit"
                    >
                      <i class="fa-solid fa-paperclip"></i>
                    </button>
                    <button
                      class="btn btn-light text-secondary border-start"
                      type="submit"
                    >
                      <i class="fa-solid fa-microphone"></i>
                    </button>
                    <input
                      type="input"
                      class="form-control bg-secondary-subtle text-secondary py-2"
                      v-model="customerData.date"
                      placeholder="Type Your Message Here"
                    />
                    <button class="btn btn-secondary px-4" type="submit">
                      <i class="fa-solid fa-paper-plane me-2"></i>
                      Send
                    </button>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </div>
        <div
          class="trashCustm position-fixed bg-danger py-2 px-3 text-white rounded-3"
        >
          <i class="fa-solid fa-trash"></i>
        </div>
      </div>
    </div>
  </div>
  <ViewReport ref="questionsModalRef" />
</template>

<script>
import { ref, reactive } from "vue";
import RatingStars from "../CreateDealElements/RatingStars.vue";
import ViewReport from "../kanban/ViewReport.vue";
import { Modal } from "bootstrap";

export default {
  name: "DealDataCard",
  components: { RatingStars, ViewReport },
  setup() {
    const stages = [
      { id: "new", name: "New Deal", color: "#4CAF50" },
      { id: "notResponding1", name: "Not Responding 1", color: "#FF5722" },
      { id: "notResponding2", name: "Not Responding 2", color: "#F44336" },
      { id: "notResponding3", name: "Not Responding 3", color: "#E91E63" },
      { id: "notResponding4", name: "Not Responding 4", color: "#9C27B0" },
      { id: "negotiation", name: "Negotiation", color: "#673AB7" },
      { id: "contact", name: "Contact", color: "#3F51B5" },
      { id: "willSend", name: "Will Send", color: "#2196F3" },
      { id: "ticketSent", name: "Ticket Sent", color: "#03A9F4" },
      { id: "processing", name: "Processing", color: "#00BCD4" },
      { id: "done", name: "Done", color: "#009688" },
      { id: "medicine", name: "Medicine", color: "#4CAF50" },
      { id: "oldData", name: "Old Data", color: "#8BC34A" },
      { id: "noResponse", name: "No Response", color: "#CDDC39" },
      { id: "trash", name: "Trash", color: "#f00" },
      { id: "reContact", name: "Re-Contact", color: "#607D8B" },
    ];
    const isEditMode = ref(false);
    const currentStage = ref("notResponding3");
    const hoveredStage = ref(null);
    const stageColors = reactive({});
    const customerData = reactive({
      fullName: "Custome Name",
      phone: "+964770028133",
      email: "",
      notes: "",
      company: "Eurasia Admin",
      representative: "",
    });

    const newComment = ref("");
    const newTask = ref("");
    const taskDate = ref("");
    const tasks = ref([
      {
        id: 1,
        description: "Description",
        date: "2025-02-22",
        status: "Pending",
      },
      {
        id: 1,
        description: "Description",
        date: "2025-02-22",
        status: "Pending",
      },
      {
        id: 1,
        description: "Description",
        date: "2025-02-22",
        status: "Pending",
      },
      {
        id: 1,
        description: "Description",
        date: "2025-02-22",
        status: "Pending",
      },
      {
        id: 1,
        description: "Description",
        date: "2025-02-22",
        status: "Pending",
      },
      {
        id: 1,
        description: "Description",
        date: "2025-02-22",
        status: "Pending",
      },
      {
        id: 1,
        description: "Description",
        date: "2025-02-22",
        status: "Pending",
      },
      {
        id: 1,
        description: "Description",
        date: "2025-02-22",
        status: "Pending",
      },
      {
        id: 1,
        description: "Description",
        date: "2025-02-22",
        status: "Pending",
      },
    ]);
    const rating = ref(0);
    const showNickName = ref(false);
    const toggleNickName = () => {
      showNickName.value = !showNickName.value;
    };
    const showPhone2 = ref(false);
    const togglePhone2 = () => {
      showPhone2.value = !showPhone2.value;
    };

    const handleStageHover = (stageId) => {
      hoveredStage.value = stageId;
    };

    const handleStageLeave = () => {
      hoveredStage.value = null;
    };

    const changeStage = (stageId) => {
      currentStage.value = stageId;
      const stageIndex = stages.findIndex((s) => s.id === stageId);

      stages.forEach((stage, index) => {
        if (index <= stageIndex) {
          stageColors[stage.id] = stages[stageIndex].color;
        } else {
          stageColors[stage.id] = "";
        }
      });
    };

    const getStageClasses = (stageId) => {
      const stageIndex = stages.findIndex((s) => s.id === stageId);
      const hoveredIndex = hoveredStage.value
        ? stages.findIndex((s) => s.id === hoveredStage.value)
        : -1;
      const currentIndex = stages.findIndex((s) => s.id === currentStage.value);

      const classes = { "text-white": true };
      let backgroundColor = "";

      if (hoveredStage.value) {
        if (stageIndex <= hoveredIndex) {
          backgroundColor = stages[hoveredIndex].color;
        } else {
          classes["btn-secondary"] = true;
        }
      } else {
        if (stageIndex <= currentIndex) {
          backgroundColor = stages[currentIndex].color;
        } else {
          classes["btn-secondary"] = true;
        }
      }

      return { classes, backgroundColor };
    };

    const startCall = () => {
      // Implement call functionality
    };

    const startWhatsapp = () => {
      // Implement WhatsApp chat functionality
    };

    const sendEmail = () => {
      // Implement email functionality
    };

    const confirm = () => {
      // Implement save functionality
    };

    const updateRating = (newRating) => {
      rating.value = newRating;
    };

    const truncateText = (text) => {
      if (text.length > 20) {
        return text.substring(0, 20) + "...";
      }
      return text;
    };

    const packages = ref([]);

    const addNewPackage = () => {
      packages.value.push({
        serviceSelect: "",
        serviceInput: "",
      });
    };

    const removePackage = (index) => {
      packages.value.splice(index, 1);
    };

    const handleTaskCompletion = (index) => {
      if (tasks.value[index].status) {
        tasks.value[index].toDelete = true;

        setTimeout(() => {
          tasks.value.splice(index, 1);
        }, 500);
      }
    };
    const openQuestionsModal = () => {
      const modal = new Modal(document.getElementById("questionsModal"));
      modal.show();
    };

    const comments = ref([
      {
        user: "Admin",
        text: "اتصال + فويس",
        date: "19/2/2025 11:44 ص",
        isAdmin: true,
      },
      {
        user: "Sales Name",
        text: "اتصال + فويس",
        date: "19/2/2025 11:44 ص",
        isAdmin: false,
      },
      {
        user: "Sales Name",
        text: "اتصال + فويس",
        date: "19/2/2025 11:44 ص",
        isAdmin: false,
      },
      {
        user: "Sales Name",
        text: "اتصال + فويس",
        date: "19/2/2025 11:44 ص",
        isAdmin: false,
      },
      {
        user: "Admin",
        text: "اتصال + فويس",
        date: "19/2/2025 11:44 ص",
        isAdmin: true,
      },
      {
        user: "Admin",
        text: "اتصال + فويس",
        date: "19/2/2025 11:44 ص",
        isAdmin: true,
      },
    ]);

    const toggleEditMode = () => {
      isEditMode.value = !isEditMode.value;
    };

    const handleDoubleClick = () => {
      isEditMode.value = true;
    };
    return {
      stages,
      currentStage,
      customerData,
      newComment,
      newTask,
      taskDate,
      tasks,
      changeStage,
      startCall,
      startWhatsapp,
      sendEmail,
      confirm,
      rating,
      updateRating,
      truncateText,
      toggleNickName,
      showNickName,
      togglePhone2,
      showPhone2,
      packages,
      addNewPackage,
      removePackage,
      handleTaskCompletion,
      handleStageHover,
      handleStageLeave,
      getStageClasses,
      openQuestionsModal,
      comments,
      toggleEditMode,
      handleDoubleClick,
      isEditMode,
    };
  },
};
</script>

<style scoped>
input {
  border: none;
  font-size: 16px;
}
input:focus {
  border: none !important;
  box-shadow: none;
}
select {
  border: none;
  font-size: 16px;
}
select:focus {
  border: none;
  box-shadow: none;
}
textarea {
  border: none;
  font-size: 16px;
}
textarea:focus {
  border: none;
  box-shadow: none;
}
.stages-container {
  padding: 0.5rem;
}

.stages-wrapper {
  display: flex;
  gap: 2px;
  align-items: center;
  height: 35px;
}

.stage-btn {
  font-size: 0.8rem;
  padding: 0.5rem 0.8rem;
  white-space: nowrap;
  transition: all 0.3s ease;
  position: relative;
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  z-index: 1;
  text-align: start;
  clip-path: polygon(
    0 0,
    calc(100% - 15px) 0,
    100% 50%,
    calc(100% - 15px) 100%,
    0 100%
  );
}

.stage-btn:hover {
  width: 350px;
  min-width: 120px;
  z-index: 2;
}

.stage-btn.selected {
  font-weight: bold;
}

/* تخصيص شريط التمرير */
.stages-container::-webkit-scrollbar {
  height: 4px;
}

.stages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.stages-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.stages-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.history {
  height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 14px;
  scrollbar-width: thin;
  scrollbar-color: #888 transparent;
}

.history::-webkit-scrollbar {
  width: 4px;
}

.history::-webkit-scrollbar-track {
  background: transparent;
}

.history::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.history::-webkit-scrollbar-button {
  display: none;
}
.showComments {
  min-height: 200px;
  max-height: 365px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 14px;
}
.showTasks {
  min-height: 200px;
  max-height: 365px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 14px;
}
label {
  font-size: 13px;
  font-weight: 500;
}

.modal-dialog {
  scrollbar-width: thin;
  scrollbar-color: #888 transparent;
}

.modal-dialog::-webkit-scrollbar,
.modal-body::-webkit-scrollbar,
.modal-content::-webkit-scrollbar {
  width: 4px;
}

.modal-dialog::-webkit-scrollbar-track,
.modal-body::-webkit-scrollbar-track,
.modal-content::-webkit-scrollbar-track {
  background: transparent;
}

.modal-dialog::-webkit-scrollbar-thumb,
.modal-body::-webkit-scrollbar-thumb,
.modal-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.modal-dialog::-webkit-scrollbar-button,
.modal-body::-webkit-scrollbar-button,
.modal-content::-webkit-scrollbar-button {
  display: none;
}

/* تطبيق نفس التنسيق على جميع العناصر التي تحتوي على سكرول */
.showComments,
.showTasks {
  scrollbar-width: thin;
  scrollbar-color: #888 transparent;
}

.showComments::-webkit-scrollbar,
.showTasks::-webkit-scrollbar {
  width: 4px;
}

.showComments::-webkit-scrollbar-track,
.showTasks::-webkit-scrollbar-track {
  background: transparent;
}

.showComments::-webkit-scrollbar-thumb,
.showTasks::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.showComments::-webkit-scrollbar-button,
.showTasks::-webkit-scrollbar-button {
  display: none;
}

.custom-checkbox {
  width: 24px;
  height: 24px;
  cursor: pointer;
  accent-color: #0d6efd;
}

.custom-checkbox:checked {
  animation: fadeOut 0.5s forwards;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.delete-animation {
  background-color: red;
  transition: background-color 0.5s ease;
}

@keyframes fadeOut {
  from {
    opacity: 1;
    background-color: #ff000040;
  }
  to {
    opacity: 0;
    background-color: #ff000040;
  }
}
.trashCustm {
  right: 2%;
  bottom: 3%;
  z-index: 9999;
}
.adminComment {
  background: linear-gradient(45deg, #e5c086, #f1d65e, #e5c086, #f1d65e);
  color: #000;
  width: fit-content;
  background-size: 400% 400%;
  animation: adminComment 4s ease infinite;
}
@keyframes adminComment {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
