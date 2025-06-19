<template>
  <div
    class="modal fade"
    id="dealDataCard"
    tabindex="-1"
    aria-labelledby="dealDataCardLabel"
    aria-hidden="true"
    data-bs-backdrop="false"
  >
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <div
          class="modal-header py-0 d-flex justify-content-between align-items-center"
        >
          <div class="d-flex align-items-center gap-4">
            <h5 class="modal-title" id="dealDataCardLabel">
              {{ t("kanban-modal-edit-heading") }}
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
            <rating-stars v-model="customerData.rating" />
          </div>
          <div class="source">
            <i class="fa-solid fa-circle-exclamation me-1"></i>
            <span
              >{{ t("kanban-modal-edit-source-heading") }}:
              {{ sourceName }}</span
            >
          </div>
          <div class="d-flex justify-content-end align-items-center gap-2">
            <button class="btn border-none text-primary" @click="startCall">
              <i class="fa-solid fa-phone-volume fs-5"></i>
              {{ t("kanban-modal-edit-call-heading") }}
            </button>
            <button
              class="btn border-none text-primary"
              @click="openWhatsappModal(customerData.id)"
            >
              <i class="fab fa-whatsapp border-none text-primary fs-5"></i>
              {{ t("kanban-modal-edit-whatsapp") }}
            </button>
            <button class="btn border-none text-primary" @click="sendEmail">
              <i class="fas fa-envelope fs-5"></i>
              {{ t("kanban-modal-edit-sendemail") }}
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
                :style="{
                  backgroundColor: getStageClasses(stage.id).backgroundColor,
                  color: getStageClasses(stage.id).textColor || 'white',
                }"
              >
                {{ truncateText(stage.name) }}
              </button>
            </div>
          </div>

          <div class="row">
            <div class="col-12 col-md-6 border-end">
              <!-- Full Name -->
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-a"></i>
                    {{ t("kanban-modal-edit-label-fullname")
                    }}<span class="text-danger">*</span>
                  </label>
                </div>
                <div class="col-10">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control bg-light text-secondary py-2"
                      v-model="customerData.name"
                      :placeholder="t('kanban-modal-edit-placeholder-fullname')"
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
                    ><i class="fa-solid fa-a"></i>
                    {{ t("kanban-modal-edit-label-nickname")
                    }}<span class="text-danger">*</span>
                  </label>
                </div>
                <div class="col-10">
                  <input
                    type="text"
                    class="form-control bg-light text-secondary py-2"
                    v-model="customerData.nickName"
                    :placeholder="t('kanban-modal-edit-placeholder-nickname')"
                    :readonly="!isEditMode"
                  />
                </div>
              </div>

              <!-- Phone -->
              <div
                class="row mb-3"
                @dblclick="handleDoubleClick"
                v-if="customerData.phone"
              >
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-phone-volume"></i>
                    {{ t("kanban-modal-edit-label-phone")
                    }}<span class="text-danger">*</span>
                  </label>
                </div>
                <div class="col-10">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control bg-light text-secondary py-2"
                      v-model="customerData.phone"
                      :placeholder="t('kanban-modal-edit-placeholder-phone')"
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
                v-if="showPhone2 && customerData.phone"
              >
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-phone-volume"></i>
                    {{ t("kanban-modal-edit-label-phone")
                    }}<span class="text-danger">*</span>
                  </label>
                </div>
                <div class="col-10">
                  <input
                    type="text"
                    class="form-control bg-light text-secondary py-2"
                    v-model="customerData.phone2"
                    :placeholder="t('kanban-modal-edit-placeholder-phone')"
                    :readonly="!isEditMode"
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-envelope"></i>
                    {{ t("kanban-modal-edit-label-email")
                    }}<span class="text-danger">*</span>
                  </label>
                </div>
                <div class="col-10">
                  <input
                    type="text"
                    class="form-control bg-light text-secondary py-2"
                    v-model="customerData.email"
                    :placeholder="t('kanban-modal-edit-placeholder-email')"
                    :readonly="!isEditMode"
                  />
                </div>
              </div>
              <!-- Notes -->
              <div class="row mb-3" @dblclick="handleDoubleClick">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-note-sticky"></i>
                    {{ t("kanban-modal-edit-label-notes") }}</label
                  >
                </div>
                <div class="col-10">
                  <textarea
                    class="form-control bg-light"
                    rows="4"
                    v-model="customerData.note"
                    :readonly="!isEditMode"
                  ></textarea>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-2">
                  <label for=""
                    ><i class="fa-solid fa-circle-question"></i>
                    {{ t("kanban-modal-edit-label-questions") }}</label
                  >
                </div>
                <div class="col-10">
                  <button
                    class="btn btn-primary w-100"
                    @click="openQuestionsModal"
                  >
                    {{ t("kanban-modal-edit-button-reports") }}
                  </button>
                </div>
              </div>

              <div
                class="row mb-3"
                @dblclick="handleDoubleClick"
                v-if="permissionStore.hasPermission('add-assigned-to-deal')"
              >
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-users"></i>
                    {{ t("kanban-modal-edit-label-assignedto") }}</label
                  >
                </div>
                <div class="col-10">
                  <select
                    class="form-select bg-light text-secondary py-2"
                    v-model="customerData.assigned_to"
                    :readonly="!isEditMode"
                  >
                    <option value="" disabled>
                      {{ t("kanban-modal-edit-placeholder-representative") }}
                    </option>
                    <option
                      v-for="user in users"
                      :key="user.id"
                      :value="user.id"
                    >
                      {{ user.name }}
                    </option>
                  </select>
                </div>
              </div>
              <!-- Deal ticket upload -->
              <div class="row mb-3">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-list"></i>
                    {{ t("kanban-modal-edit-label-ticket") }}</label
                  >
                </div>
                <div class="col-10">
                  <input
                    v-if="!customerData.file"
                    type="file"
                    class="form-control"
                    @change="handleFileUpload"
                    @dblclick="handleDoubleClick"
                    :disabled="!isEditMode"
                  />
                  <div class="row" v-else>
                    <div class="col-6">
                      <button class="btn btn-primary w-100" @click="removeFile">
                        <i class="fa-solid fa-file"></i>
                        Remove File
                      </button>
                    </div>
                    <div class="col-6">
                      <button
                        class="btn btn-primary w-100"
                        @click="downloadFile"
                      >
                        <i class="fa-solid fa-file"></i>
                        Download File
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Deal Status -->
              <div class="row mb-3">
                <div class="col-2">
                  <label class="form-label"
                    ><i class="fa-solid fa-cubes"></i>
                    {{ t("dealStatus") }}</label
                  >
                </div>
                <div class="col-10">
                  <span class="fw-bolder" style="font-size: 14px">{{
                    currentStage.name
                  }}</span>
                </div>
              </div>
              <div class="row">
                <div class="col-6 pt-2">
                  <h5
                    v-if="permissionStore.hasPermission(PERMISSIONS.EDIT_STAGE)"
                  >
                    {{ t("kanban-modal-edit-history-heading") }}
                  </h5>
                </div>
                <div
                  class="col-6 d-flex justify-content-end align-items-center gap-2"
                  v-if="isEditMode"
                >
                  <button class="btn btn-primary px-4 py-2" @click="confirm">
                    {{ t("kanban-modal-edit-button-submit") }}
                  </button>
                  <button
                    class="btn btn-secondary px-4 py-2"
                    @click="closeEditMode"
                  >
                    {{ t("kanban-modal-edit-button-cancel") }}
                  </button>
                </div>
              </div>
              <div
                class="history ps-2 mt-2"
                v-if="
                  permissionStore.hasPermission(
                    PERMISSIONS.ADD_ASSIGNED_TO_DEAL
                  )
                "
              >
                <div
                  v-for="log in local_logs"
                  :key="log.id"
                  class="row bg-light pt-2 text-secondary border border-top"
                >
                  <div class="col-3">
                    <p>{{ new Date(log.created_at).toLocaleString() }}</p>
                  </div>
                  <div class="col-9">
                    <p>
                      {{
                        log.description.length > 200
                          ? log.description.substring(0, 200) + "..."
                          : log.description
                      }}
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
                  <div class="d-flex align-items-start">
                    <span
                      class="btn btn-light text-primary me-1 px-4 rounded-end-0"
                      style="background-color: #eee"
                    >
                      {{ t("kanban-modal-edit-comment-heading") }}
                    </span>
                    <textarea
                      ref="commentInput"
                      v-model="customerData.comment"
                      placeholder="اكتب تعليقك هنا..."
                      class="form-control comment-textarea bg-light text-secondary rounded-0 me-1"
                      rows="1"
                      style="
                        resize: none;
                        overflow-y: hidden;
                        min-height: 38px;
                        min-width: 50px;
                        width: 100%;
                      "
                      @input="autoResize($event.target)"
                      @keydown.enter="handleEnter"
                    ></textarea>
                    <button
                      class="btn btn-primary rounded-start-0 fixed-action-btn"
                      type="submit"
                      @click="handleAddComment"
                    >
                      {{ t("kanban-modal-edit-comment-button-submit") }}
                    </button>
                  </div>
                </div>
                <div class="col-12 mt-2 bg-light showComments py-2 rounded-3">
                  <div
                    v-for="comment in sortedComments"
                    :key="comment.id"
                    class="row mt-2"
                  >
                    <div class="col-1 pe-0">
                      <img
                        src="@/assets/default-user-image.jpg"
                        alt="Seals Image"
                        width="45"
                        height="45"
                      />
                      <!-- <span class="ms-2">{{ comment.username }}</span> -->
                    </div>
                    <div class="col-11 position-relative">
                      <div
                        :class="[
                          'rounded-3 p-2',
                          comment.isAdmin
                            ? 'adminComment'
                            : 'bg-primary text-white',
                        ]"
                        style="
                          word-break: break-word;
                          overflow-wrap: break-word;
                          min-width: 50px !important;
                          max-width: 100% !important;
                          width: fit-content !important;
                        "
                      >
                        <h6
                          class="mb-2"
                          style="font-size: 16px; font-weight: 600"
                        >
                          {{ comment.isAdmin ? "System" : comment.username }}
                        </h6>
                        <div v-if="editingCommentId === comment.id">
                          <textarea
                            :id="`edit-textarea-${comment.id}`"
                            v-model="editingCommentText"
                            class="form-control rounded-2 bg-white text-dark ps-2"
                            style="
                              resize: none;
                              overflow-y: hidden;
                              min-height: 30px;
                              height: fit-content !important;
                              min-width: 50px;
                              max-width: 100% !important;
                              width: fit-content !important;
                              font-size: 14px;
                              box-sizing: border-box;
                              display: inline-block;
                              overflow-x: auto;
                              width: auto !important;
                            "
                            @input="
                              autoResize($event.target);
                              autoResizeEditWidth($event.target);
                            "
                          ></textarea>
                          <div class="d-flex justify-content-end gap-2 mt-1">
                            <button
                              class="btn btn-success btn-sm"
                              @click="handleUpdateComment(comment)"
                              style="font-size: 10px"
                            >
                              <i class="fa fa-check"></i>
                            </button>
                            <button
                              class="btn btn-danger btn-sm"
                              @click="cancelEditComment"
                              style="font-size: 10px"
                            >
                              <i class="fa fa-times"></i>
                            </button>
                          </div>
                        </div>
                        <div v-else>
                          <span
                            :ref="`commentText-${comment.id}`"
                            style="
                              white-space: pre-line;
                              min-width: 50px;
                              word-break: break-word;
                              overflow-wrap: break-word;
                              display: inline-block;
                              box-sizing: border-box;
                              overflow-x: hidden;
                              width: auto !important;
                            "
                            :style="{ width: getCommentTextWidth(comment.id) }"
                            >{{ comment.text_body }}</span
                          >
                        </div>
                        <div
                          class="d-flex justify-content-end align-items-center gap-2 mt-2"
                        >
                          <!-- pin button -->
                          <button
                            class="btn btn-sm p-0"
                            @click="togglePin(comment)"
                            :title="comment.isPinned ? 'Unpin' : 'Pin'"
                            style="z-index: 2"
                          >
                            <i
                              :class="[
                                'fa-solid',
                                'fa-thumbtack',
                                comment.isPinned
                                  ? 'text-warning'
                                  : comment.isAdmin
                                  ? ''
                                  : 'text-white',
                              ]"
                              style="transform: rotate(-30deg); font-size: 12px"
                            ></i>
                          </button>
                          <button
                            v-if="editingCommentId !== comment.id"
                            class="btn btn-sm p-0"
                            @click="editComment(comment)"
                            :class="[
                              comment.isAdmin ? 'text-dark' : 'text-white',
                            ]"
                          >
                            <i
                              class="fa-solid fa-pencil"
                              style="font-size: 12px"
                            ></i>
                          </button>
                          <button
                            class="btn btn-sm p-0"
                            @click.prevent="copyComment(comment.text_body)"
                            :class="[
                              comment.isAdmin ? 'text-dark' : 'text-white',
                            ]"
                          >
                            <i
                              class="fa-solid fa-copy"
                              style="font-size: 12px"
                            ></i>
                          </button>
                          <span style="font-size: 10px">{{
                            formatDate(comment.created_at)
                          }}</span>

                          <!-- comment menu button -->
                          <!-- <button
                            class="btn btn-sm p-0 ms-2"
                            @click="toggleMenu(comment.id)"
                            style="z-index: 2"
                          >
                            <i class="fa-solid fa-ellipsis-vertical text-white"></i>
                          </button> -->
                          <!-- comment menu -->
                          <!-- <div
                            v-if="activeMenu === comment.id"
                            class="comment-menu bg-white border rounded shadow-sm d-flex ms-2"
                            style="top: 30px; right: 0; z-index: 10"
                          >
                            <a
                              href="#"
                              class="dropdown-item text-dark"
                              @click.prevent="copyComment(comment.text_body)"
                              >Copy</a
                            >
                            |
                            <a
                              href="#"
                              class="dropdown-item text-dark"
                              @click.prevent="editComment(comment)"
                              >Edit</a
                            >
                          </div> -->
                        </div>
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
                      {{ t("kanban-modal-edit-tasks-heading") }}
                    </span>
                    <input
                      type="text"
                      class="form-control bg-light text-secondary py-2 me-1"
                      v-model="customerData.task"
                      :placeholder="t('kanban-modal-edit-tasks-placeholder')"
                      @keyup.enter="handleAddTask"
                    />
                    <input
                      type="date"
                      class="form-control bg-light text-secondary py-2 me-1"
                      v-model="customerData.date"
                      :placeholder="t('modals.selectDate')"
                      @keyup.enter="handleAddTask"
                    />
                    <button
                      class="btn btn-primary py-1 px-4 fixed-action-btn"
                      type="submit"
                      @click="handleAddTask"
                    >
                      {{ t("kanban-modal-edit-tasks-button-add") }}
                    </button>
                  </div>
                </div>
                <div class="col-12 mt-2 bg-light p-3 showTasks rounded-3">
                  <div
                    class="row bg-light-subtle border-top border-bottom py-1"
                  >
                    <div class="col-5">
                      {{ t("kanban-modal-edit-tasks-table-description") }}
                    </div>
                    <div class="col-5">
                      {{ t("kanban-modal-edit-tasks-table-due-date") }}
                    </div>
                    <div class="col-2">
                      {{ t("kanban-modal-edit-tasks-table-status") }}
                    </div>
                  </div>
                  <!-- data Tasks -->
                  <div
                    v-for="task in activeTasks"
                    :key="task.id"
                    class="row text-secondary mt-2 align-items-center border-light-subtle pb-2 border-bottom"
                    :class="{ 'delete-animation': task.toDelete }"
                  >
                    <div class="col-5">
                      {{ task.description }}
                    </div>
                    <div class="col-5">
                      <input
                        type="date"
                        class="form-control bg-secondary-subtle text-secondary py-2 me-1"
                        v-model="task.duedate"
                        :placeholder="t('modals.selectDate')"
                      />
                    </div>
                    <div class="col-2">
                      <input
                        type="checkbox"
                        class="custom-checkbox"
                        v-model="task.status"
                        @change="() => handleTaskCompletion(task.id)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          class="btn trashCustm position-fixed bg-danger py-2 px-3 rounded-3"
          @click="openTrashDealModal"
        >
          <i class="fa-solid fa-trash text-white"></i>
        </button>
      </div>
    </div>
  </div>
  <view-report ref="questionsModalRef" :deal_id="deal?.id" />
  <trash-deal
    ref="trashDealModalRef"
    :dealId="deal?.id"
    @deal-trashed="handleStageUpdate"
  />
</template>

<script>
import {
  ref,
  reactive,
  computed,
  onMounted,
  nextTick,
  watch,
  onBeforeUnmount,
} from "vue";
import RatingStars from "@/components/CreateDealElements/CrmDealKanbanDealDataModalRatingStars.vue";
import ViewReport from "@/components/kanban/CrmDealKanbanDealDataModalReportModal.vue";
import { Modal } from "bootstrap";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import TrashDeal from "@/components/modals/CrmDealKanbanDealDataModalTrashDealModal.vue";
import {
  fetchConversationByDealId,
  getSources,
  createComment,
  updateComments,
  createTask,
  updateTask,
  updateDealStage,
  updateDeal,
  createConversation,
  getLogsByDealId,
  getUser,
  getAvailableStages,
} from "@/plugins/services/authService";
import { PERMISSIONS, usePermissionStore } from "@/stores/permissionStore";
export default {
  name: "CrmDealKanbanDealDataModal",
  components: { RatingStars, ViewReport, TrashDeal },
  props: {
    deal: {
      type: Object,
      required: true,
    },
    comments: {
      type: Array,
      required: true,
    },
    tasks: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const permissionStore = usePermissionStore();
    const selected_conversation = ref(null);
    const { t } = useI18n();
    const toast = useToast();
    const sources = ref([]);
    const stages = ref([]);
    const currentStageId = ref(props.deal?.stage_id || "");
    const isEditMode = ref(false);
    const hoveredStage = ref(null);
    const stageColors = reactive({});
    const local_logs = ref([]);
    const users = ref([]);
    const commentInput = ref(null);

    const commentTextWidths = reactive({});

    const resizeDisplayedCommentWidth = (commentId) => {
      nextTick(() => {
        const span = document.querySelector(
          `span[ref="commentText-${commentId}"]`
        );
        if (span) {
          const tempSpan = document.createElement("span");
          tempSpan.style.visibility = "hidden";
          tempSpan.style.whiteSpace = "pre-line";
          const computedStyle = window.getComputedStyle(span);
          tempSpan.style.font = computedStyle.font;
          tempSpan.style.padding = computedStyle.padding;
          tempSpan.style.border = computedStyle.border;
          tempSpan.style.boxSizing = computedStyle.boxSizing;
          tempSpan.style.wordBreak = computedStyle.wordBreak;
          tempSpan.style.overflowWrap = computedStyle.overflowWrap;
          tempSpan.style.minWidth = computedStyle.minWidth;

          tempSpan.textContent = span.textContent || " ";

          document.body.appendChild(tempSpan);

          const contentWidth = tempSpan.offsetWidth;

          const minWidth = parseFloat(computedStyle.minWidth) || 50;

          commentTextWidths[commentId] = `${Math.max(
            minWidth,
            contentWidth + 5
          )}px`;

          document.body.removeChild(tempSpan);
        }
      });
    };

    const autoResizeEditWidth = (textarea) => {
      if (!textarea) return;

      const span = document.createElement("span");
      span.style.visibility = "hidden";
      span.style.whiteSpace = "pre";
      const computedStyle = window.getComputedStyle(textarea);
      span.style.font = computedStyle.font;
      span.style.padding = computedStyle.padding;
      span.style.border = computedStyle.border;
      span.style.boxSizing = computedStyle.boxSizing;
      span.style.wordBreak = computedStyle.wordBreak;
      span.style.overflowWrap = computedStyle.overflowWrap;
      span.style.minWidth = computedStyle.minWidth;

      span.textContent = textarea.value || textarea.placeholder || " ";

      document.body.appendChild(span);

      const contentWidth = span.offsetWidth;

      const minWidth = parseFloat(computedStyle.minWidth) || 50;

      textarea.style.width = Math.max(minWidth, contentWidth + 15) + "px";

      document.body.removeChild(span);
    };

    const getCommentTextWidth = computed(() => (commentId) => {
      return commentTextWidths[commentId] || "fit-content";
    });

    const customerData = reactive({
      id: props.deal?.id,
      name: props.deal?.contact.name || "Custome Name",
      nickname: props.deal?.contact.nickname || "Custome Name",
      phone: props.deal?.contact.phones[0]?.phone || "",
      phone2: props.deal?.contact.phones[1]?.phone || "",
      email: props.deal?.contact.email || "",
      note: props.deal?.note || "",
      rating: props.deal?.rating || 0,
      source_id: props.deal?.source_id || "",
      stage_id: props.deal?.stage_id || "",
      tasks: props.deal?.tasks || [],
      comments:
        props.deal?.comments.map((comment) => ({
          id: comment.id,
          text_body: comment.text_body || "No text",
          created_at: comment.created_at || "No date",
          username: comment.user.name || "No user",
          isAdmin:
            comment.user && comment.user.role === "super-admin" ? true : false,
          isPinned: comment.isPinned || false,
        })) || [],
      assigned_to: props.deal?.user_id || "",
      file: props.deal?.file || null,
    });
    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      const [day, month, year] = dateString.split("/");
      return `${year}-${month}-${day}`;
    };
    const formatDate = (dateString) => {
      return dateString ? dateString.split("T")[0] : "No date";
    };
    const fetchUsers = async () => {
      try {
        const response = await getUser();
        users.value = response.data.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    const fetchSources = async () => {
      try {
        const response = await getSources();
        sources.value = response.data.data;
      } catch (error) {
        console.error("Error fetching sources:", error);
      }
    };
    const sourceName = computed(() => {
      const source = sources.value.find((s) => s.id === props.deal?.source_id);
      return source ? source.name : "null";
    });
    const fetchStages = async () => {
      try {
        const response = await getAvailableStages();
        stages.value = response.data.data;
      } catch (error) {
        console.error("Error fetching stages:", error);
      }
    };
    const currentStage = computed(() => {
      return (
        stages.value.find((s) => s.id === currentStageId.value) || {
          id: "",
          name: "",
          color_code: "#333",
        }
      );
    });
    const stageColor = computed(() => {
      return currentStage.value.color_code;
    });
    const newComment = ref("");
    const newTask = ref("");
    const taskDate = ref("");
    const rating = ref(0);
    const showNickName = ref(false);
    const toggleNickName = () => {
      showNickName.value = !showNickName.value;
    };
    const showPhone2 = ref(false);
    const togglePhone2 = () => {
      showPhone2.value = !showPhone2.value;
    };
    const openTrashDealModal = () => {
      if (!props.deal?.id) {
        toast.error(t("error.dealNotFound"), {
          timeout: 3000,
        });
        return;
      }
      try {
        const openModals = document.querySelectorAll(".modal.show");
        openModals.forEach((modal) => {
          const modalInstance = Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
          }
        });
        const trashDealModal = new Modal(
          document.getElementById("trashDealModal")
        );
        trashDealModal.show();
        const modalBackdrop = document.createElement("div");
        modalBackdrop.className = "modal-backdrop fade show";
        document.body.appendChild(modalBackdrop);
      } catch (error) {
        console.error("Error opening trash modal:", error);
        toast.error(t("error.openTrashModal"), {
          timeout: 3000,
        });
      }
    };
    const handleStageHover = (stageId) => {
      hoveredStage.value = stageId;
    };

    const handleStageLeave = () => {
      hoveredStage.value = null;
    };

    const changeStage = async (stageId) => {
      try {
        currentStageId.value = stageId;
        const stageIndex = stages.value.findIndex((s) => s.id === stageId);
        const stageName = stages.value[stageIndex].name;

        stages.value.forEach((stage, index) => {
          if (index <= stageIndex) {
            stageColors[stage.id] = stages.value[stageIndex].color_code;
          } else {
            stageColors[stage.id] = "";
          }
        });

        const response = await updateDealStage(props.deal.id, stageId);
        if (response.data) {
          emit("stage-change", props.deal.id, stageId, props.deal.stage_id, 0);
          toast.success(`${t("success.stageChanged")} ${stageName}`, {
            timeout: 3000,
          });
        } else {
          toast.error(t("error.changingStage"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        console.error("Error changing stage:", error);
        toast.error(t("error.changingStage"), {
          timeout: 3000,
        });
      }
    };

    const getStageClasses = (stageId) => {
      const stageIndex = stages.value.findIndex((s) => s.id === stageId);
      const hoveredIndex = hoveredStage.value
        ? stages.value.findIndex((s) => s.id === hoveredStage.value)
        : -1;
      const currentIndex = stages.value.findIndex(
        (s) => s.id === currentStageId.value
      );

      const classes = { "": true };
      let backgroundColor = "";

      if (hoveredStage.value) {
        if (stageIndex <= hoveredIndex) {
          backgroundColor = stages.value[hoveredIndex].color_code;
        } else {
          classes["btn-secondary"] = true;
        }
      } else {
        if (stageIndex <= currentIndex) {
          backgroundColor = stages.value[currentIndex].color_code;
        } else {
          classes["btn-secondary"] = true;
        }
      }
      const textColor = getContrastColor(backgroundColor);
      return { classes, backgroundColor, textColor };
    };
    const getContrastColor = (hexColor) => {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 170 ? "#000000" : "#FFFFFF";
    };
    const startCall = () => {
      toast.info(t("success.startCall"), {
        timeout: 3000,
      });
    };

    const startWhatsapp = () => {
      const modal = new Modal(document.getElementById("whatsappModal"));
      modal.show();
    };

    const sendEmail = () => {
      toast.info(t("success.sendEmail"), {
        timeout: 3000,
      });
    };
    const confirm = async () => {
      try {
        const phones = [customerData.phone];
        if (customerData.phone2) {
          phones.push(customerData.phone2);
        }

        console.log("file", customerData.ticket);

        const formData = {
          name: customerData.name,
          nickname: customerData.nickname || "",
          phones: phones,
          email: customerData.email || "",
          note: customerData.note || "",
          rating: customerData.rating || 0,
          user_id: customerData.assigned_to || "",
          ticket: customerData.ticket || null,
        };

        const response = await updateDeal(props.deal.id, formData);
        if (response.data) {
          toast.success(t("success.saveChanges"), {
            timeout: 3000,
          });
          isEditMode.value = false;
        } else {
          toast.error(t("error.saveChanges"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        console.error("Error saving changes:", error);
        toast.error(t("error.saveChanges"), {
          timeout: 3000,
        });
      }
    };
    const closeEditMode = () => {
      isEditMode.value = false;
    };
    const updateRating = (newRating) => {
      try {
        rating.value = newRating;
        toast.success(t("success.updateRating"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error updating rating:", error);
        toast.error(t("error.updateRating"), {
          timeout: 3000,
        });
      }
    };

    const truncateText = (text) => {
      if (text.length > 20) {
        return text.substring(0, 20) + "...";
      }
      return text;
    };

    const packages = ref([]);

    const addNewPackage = () => {
      try {
        packages.value.push({
          serviceSelect: "",
          serviceInput: "",
        });
        toast.success(t("success.addPackage"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error adding package:", error);
        toast.error(t("error.addPackage"), {
          timeout: 3000,
        });
      }
    };

    const removePackage = (index) => {
      try {
        packages.value.splice(index, 1);
        toast.success(t("success.removePackage"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error removing package:", error);
        toast.error(t("error.removePackage"), {
          timeout: 3000,
        });
      }
    };

    const handleTaskCompletion = async (taskId) => {
      try {
        const task = customerData.tasks.find((t) => t.id === taskId);
        const formData = {
          status: "completed",
          duedate: task.duedate,
        };
        const response = await updateTask(task.id, formData);
        if (response.data) {
          task.status = "completed";
          toast.success(t("success.taskCompleted"), {
            timeout: 3000,
          });
        } else {
          toast.error(t("error.completingTask"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        console.error("Error completing task:", error);
        toast.error(t("error.completingTask"), {
          timeout: 3000,
        });
      }
    };
    const openQuestionsModal = () => {
      try {
        const modal = new Modal(document.getElementById("questionsModal"));
        modal.show();
      } catch (error) {
        console.error("Error opening questions modal:", error);
        toast.error(t("error.openQuestionsModal"), {
          timeout: 3000,
        });
      }
    };

    const toggleEditMode = () => {
      isEditMode.value = !isEditMode.value;
    };

    const handleDoubleClick = () => {
      isEditMode.value = true;
    };
    const openWhatsappModal = async (id) => {
      console.log("deal data modal emit start");
      try {
        let conversation = await fetchConversationByDealId(id);
        if (!conversation.data?.data) {
          conversation = await createConversation(id);
        }
        console.log("conversation", conversation);

        selected_conversation.value = conversation.data.data;
        console.log("selected_conversation.value", selected_conversation.value);
        await nextTick();

        const modalElement = document.getElementById("whatsappModal");
        if (modalElement) {
          const modal = new Modal(modalElement);
          modal.show();
        } else {
          console.warn("Modal element not found in DOM.");
        }
        // emit("open-whatsapp-modal", selected_conversation.value);
        emit(
          "open-whatsapp-modal",
          {
            ...selected_conversation.value,
            img:
              selected_conversation.value.img ||
              require("@/assets/whatsappImage/default-userImage.jpg"),
            phone:
              selected_conversation.value.phone?.phone ||
              selected_conversation.value.phone,
          },
          id
        );
      } catch (error) {
        console.error("Error opening WhatsApp modal:", error);
        toast.error(t("error.openWhatsappModal"), {
          timeout: 3000,
        });
      }
    };

    const autoResize = (textarea) => {
      if (!textarea) return;

      textarea.style.height = "30px";
      const newHeight = textarea.scrollHeight;
      const maxRows = 7;
      const lineHeight = 44;
      const maxHeight = maxRows * lineHeight;
      const calculatedHeight = Math.min(newHeight, maxHeight);

      textarea.style.height = calculatedHeight + "px";

      if (newHeight > maxHeight) {
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.overflowY = "hidden";
      }
    };

    const handleAddComment = async () => {
      try {
        const formData = {
          text_body: customerData.comment,
          deal_id: props.deal?.id,
        };
        console.log(formData);
        const response = await createComment(formData);
        if (response.data) {
          const newComment = {
            id: response.data.id,
            text_body: customerData.comment,
            created_at: new Date().toISOString(),
            username: response.data.data.user?.name || "No user",
            isAdmin: response.data.data.user?.role === "super-admin",
          };
          customerData.comments.unshift(newComment);

          toast.success(t("success.commentAdded"));
          customerData.comment = "";
          nextTick(() => {
            const textarea = document.querySelector(".comment-textarea");
            if (textarea) {
              autoResize(textarea);
            }
            resizeDisplayedCommentWidth(newComment.id);
          });
        } else {
          toast.error(t("error.addingComment"));
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        toast.error(t("error.addingComment"));
      }
    };
    const handleEnter = (event) => {
      if (!event.shiftKey) {
        event.preventDefault();
        handleAddComment();
        resetTextareaSize(event.target);
      }
    };
    const resetTextareaSize = (textarea) => {
      if (textarea) {
        textarea.style.height = "30px";
        textarea.style.overflowY = "hidden";
      }
    };
    const handleAddTask = async () => {
      try {
        const formData = {
          description: customerData.task,
          duedate: customerData.date,
          deal_id: props.deal?.id,
        };
        console.log(formData);
        const response = await createTask(formData);
        if (response.data) {
          customerData.tasks.unshift({
            id: response.data.id,
            description: customerData.task,
            duedate: customerData.date,
            status: "active",
          });
          toast.success(t("success.taskAdded"));
          customerData.task = "";
          customerData.date = "";
        } else {
          toast.error(t("error.addingTask"));
        }
      } catch (error) {
        console.error("Error adding task:", error);
        toast.error(t("error.addingTask"));
      }
    };
    const activeTasks = computed(() => {
      return customerData.tasks.filter((task) => task.status === "active");
    });
    const handleStageUpdate = (deal_id, new_stage_id) => {
      console.log("handleStageUpdate called with:", deal_id, new_stage_id);
      if (!props.deal?.id) {
        toast.error(t("error.dealNotFound"), {
          timeout: 3000,
        });
        return;
      }
      emit("stage-change", deal_id, new_stage_id, props.deal.stage_id, 0);
    };
    const fetchLogs = async () => {
      try {
        const response = await getLogsByDealId(props.deal?.id);
        if (response.data) {
          local_logs.value = response.data.data;
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };
    watch(
      () => props.deal,
      (newDeal) => {
        if (newDeal) {
          fetchLogs(newDeal.id);
          nextTick(() => {
            if (newDeal.comments) {
              newDeal.comments.forEach((comment) => {
                resizeDisplayedCommentWidth(comment.id);
              });
            }
          });
        }
      },
      { immediate: true }
    );
    const activeMenu = ref(null);
    const toggleMenu = (commentId) => {
      activeMenu.value = activeMenu.value === commentId ? null : commentId;
    };
    const copyComment = (text) => {
      navigator.clipboard.writeText(text);
      activeMenu.value = null;
      toast?.success?.("Copied!");
    };
    const editingCommentId = ref(null);
    const editingCommentText = ref("");
    const editComment = (comment) => {
      editingCommentId.value = comment.id;
      editingCommentText.value = comment.text_body;
      nextTick(() => {
        const textarea = document.getElementById(`edit-textarea-${comment.id}`);
        if (textarea) {
          autoResize(textarea);
          autoResizeEditWidth(textarea);
          textarea.focus();

          setTimeout(() => {
            autoResize(textarea);
          }, 0);
        }
      });
    };
    const handleUpdateComment = async (comment) => {
      try {
        const formData = {
          text_body: editingCommentText.value,
          comment_id: comment.id,
        };
        const response = await updateComments(comment.id, formData);
        if (response.data) {
          const idx = customerData.comments.findIndex(
            (c) => c.id === comment.id
          );
          if (idx !== -1) {
            customerData.comments[idx].text_body = editingCommentText.value;
          }
          toast.success(t("success.commentUpdated"));
          editingCommentId.value = null;
          editingCommentText.value = "";
          nextTick(() => {
            resizeDisplayedCommentWidth(comment.id);
          });
        } else {
          toast.error(t("error.updatingComment"));
        }
      } catch (error) {
        console.error("Error updating comment:", error);
        toast.error(t("error.updatingComment"));
      }
    };
    const togglePin = (comment) => {
      comment.isPinned = !comment.isPinned;
      toast.success(
        comment.isPinned ? t("تم تثبيت التعليق") : t("تم إلغاء التثبيت")
      );
    };
    const sortedComments = computed(() => {
      return customerData.comments.slice().sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.created_at) - new Date(a.created_at);
      });
    });
    const cancelEditComment = () => {
      editingCommentId.value = null;
      editingCommentText.value = "";
    };
    onMounted(() => {
      fetchSources();
      fetchStages();
      fetchUsers();
      document.addEventListener("click", handleClickOutside);

      if (commentInput.value) {
        autoResize(commentInput.value);
      }
      nextTick(() => {
        if (customerData.comments) {
          customerData.comments.forEach((comment) => {
            resizeDisplayedCommentWidth(comment.id);
          });
        }
      });
    });
    watch(
      () => customerData.comments,
      (newComments) => {
        nextTick(() => {
          newComments.forEach((comment) => {
            resizeDisplayedCommentWidth(comment.id);
          });
        });
      },
      { deep: true }
    );

    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
    });
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".comment-menu") &&
        !e.target.closest(".fa-ellipsis-vertical")
      ) {
        activeMenu.value = null;
      }
    };
    const handleFileUpload = (event) => {
      console.log("File upload event start");
      const file = event.target.files[0];
      if (file) {
        console.log("Selected file:", file);
        customerData.ticket = file;
        toast.success(t("success.fileUploaded"), {
          timeout: 3000,
        });
      }
    };
    return {
      stages,
      currentStage,
      customerData,
      newComment,
      newTask,
      taskDate,
      selected_conversation,
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
      toggleEditMode,
      handleDoubleClick,
      isEditMode,
      openWhatsappModal,
      t,
      sourceName,
      stageColor,
      handleAddComment,
      handleAddTask,
      activeTasks,
      formatDate,
      closeEditMode,
      formatDateForInput,
      openTrashDealModal,
      handleStageUpdate,
      permissionStore,
      PERMISSIONS,
      getContrastColor,
      local_logs,
      fetchLogs,
      handleEnter,
      autoResize,
      resetTextareaSize,
      activeMenu,
      toggleMenu,
      copyComment,
      handleClickOutside,
      editingCommentId,
      editingCommentText,
      editComment,
      handleUpdateComment,
      togglePin,
      sortedComments,
      cancelEditComment,
      users,
      commentInput,
      autoResizeEditWidth,
      resizeDisplayedCommentWidth,
      getCommentTextWidth,
      commentTextWidths,
      handleFileUpload,
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
  width: 250px;
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
  height: 220px;
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
  height: 302px;
  max-height: 302px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 14px;
}
.showTasks {
  height: 302px;
  max-height: 302px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 14px;
}
label {
  font-size: 13px;
  font-weight: 500;
}

.modal-dialog,
.modal-body,
.modal-content {
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

.text-gold {
  color: #ffd700;
}

.text-lightgray {
  color: #d3d3d3;
}

.comment-textarea {
  flex-grow: 1;
  padding: 6.5px 10px;
  font-size: 1rem;
  scrollbar-width: thin;
  min-width: 50px;
  width: 100% !important;
  box-sizing: border-box;
  resize: none;
  overflow-y: hidden;
  min-height: 30px;
  overflow-x: hidden;
}

.col position-relative > div > textarea,
.col position-relative > div > span {
  min-width: 50px;
  box-sizing: border-box;
  word-break: break-word;
  overflow-wrap: break-word;
}

.col position-relative > div > textarea {
  display: inline-block;
  overflow-x: auto;
}

.col position-relative > div > span {
  display: inline-block;
  overflow-x: hidden;
}

.fixed-action-btn {
  width: 150px !important;
  min-width: 150px !important;
  max-width: 150px !important;
  padding: 6px 0 !important;
  white-space: normal;
  text-align: center;
  font-size: 1rem;
}
.comment-textarea::-webkit-scrollbar {
  width: 6px;
}

.comment-textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.comment-textarea::-webkit-scrollbar-thumb {
  background: #888888cb;
  border-radius: 4px;
}

.comment-textarea::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.comment-menu {
  width: fit-content;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  font-size: 14px;
}
.comment-menu .dropdown-item {
  cursor: pointer;
  padding: 0px 7px !important;
}
.comment-menu .dropdown-item:hover {
  background: #f1f1f1;
  border-radius: 4px;
}
</style>
