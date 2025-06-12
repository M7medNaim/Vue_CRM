<template>
  <div
    class="modal fade"
    id="trashDealModal"
    tabindex="-1"
    aria-labelledby="trashDealModalLabel"
    aria-hidden="true"
    v-on:="{'hidden.bs.modal': resetModal}"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content pt-3" style="background-color: red">
        <div class="modal-body text-center text-white">
          <div class="modal1" v-if="!showModal2">
            <i
              class="fa-solid fa-triangle-exclamation pb-4"
              style="font-size: 60px"
            ></i>
            <h4>{{ $t("kanban-trash-heading") }}</h4>
            <span style="font-size: 14px">{{
              $t("kanban-trash-sub-heading")
            }}</span>
          </div>
          <div class="modal2" v-else>
            <i
              class="fa-solid fa-triangle-exclamation pb-4"
              style="font-size: 60px"
            ></i>
            <h4>
              {{ $t("kanban-trash-modal2-heading") }}
            </h4>
            <textarea
              class="form-control"
              :placeholder="$t('kanban-trash-comments-placeholder')"
              rows="4"
              v-model="comment"
            ></textarea>
            <h4 class="mt-5">
              {{ $t("kanban-trash-modal2-choosebutton-heading") }}
            </h4>
            <div class="btn-group mt-2">
              <button
                v-for="tag in trashTags"
                :key="tag.id"
                class="btn"
                @click="selectedTag = tag.id"
                :style="{
                  backgroundColor:
                    selectedTag === tag.id ? tag.color_code : 'white',
                  color:
                    selectedTag === tag.id
                      ? getContrastColor(tag.color_code)
                      : 'gray',
                }"
              >
                <i
                  :class="`fa-solid fa-${tag.icon}`"
                  :style="{
                    color:
                      selectedTag === tag.id
                        ? getContrastColor(tag.color_code)
                        : 'gray',
                  }"
                ></i>
                {{ tag.name }}
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer border-top-0 mt-5">
          <button
            type="button"
            class="btn bg-white py-2 px-4"
            style="color: red; font-size: 14px"
            @click="closeTrashDealModal"
          >
            {{ $t("kanban-trash-cancel-button") }}
          </button>
          <button
            v-if="!showModal2"
            type="button"
            class="btn bg-white py-2 px-4"
            style="color: red; font-size: 14px"
            @click="showModal2 = true"
          >
            {{ $t("kanban-trash-next-button") }}
          </button>
          <button
            v-else
            type="button"
            class="btn bg-white py-2 px-4"
            style="color: red; font-size: 14px"
            @click="handleTrashDeal"
            :disabled="!selectedTag || !comment"
          >
            {{ $t("kanban-trash-confin-button") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import { useToast } from "vue-toastification";
import {
  createComment,
  getTrashStages,
  addTagToDeal,
} from "@/plugins/services/authService";

export default {
  name: "CrmDealKanbanDealDataModalTrashDealModal",
  props: {
    dealId: {
      type: [String, Number],
      required: true,
    },
  },
  setup() {
    const toast = useToast();
    const getContrastColor = (color) => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 125 ? "#000000" : "#FFFFFF";
    };
    return { toast, getContrastColor };
  },
  data() {
    return {
      showModal2: false,
      comment: "",
      selectedTag: null,
      trashTags: [],
    };
  },
  mounted() {
    this.getStages();
    const modal = document.getElementById("trashDealModal");
    modal.addEventListener("hidden.bs.modal", () => {
      const modalBackdrop = document.querySelector(".modal-backdrop");
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
      this.resetModal();
    });
  },
  methods: {
    resetModal() {
      this.showModal2 = false;
      this.comment = "";
      this.selectedTag = null;
    },
    closeTrashDealModal() {
      const trashDealModal = Modal.getInstance(
        document.getElementById("trashDealModal")
      );
      if (trashDealModal) {
        trashDealModal.hide();
      }
      const modalBackdrop = document.querySelector(".modal-backdrop");
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
      this.resetModal();
    },
    async handleTrashDeal() {
      try {
        if (!this.selectedTag || !this.comment) {
          this.toast.error(this.t("error.requiredFields"), {
            timeout: 3000,
          });
          return;
        }
        const selectedTag = this.selectedTag;

        const commentResponse = await createComment({
          text_body: this.comment,
          deal_id: this.dealId,
        });
        if (commentResponse.data) {
          this.$emit("deal-trashed", {
            dealId: this.dealId,
            tagId: selectedTag,
          });
        } else {
          this.toast.error(commentResponse.data.message, {
            timeout: 3000,
          });
        }
        // Update the deal stage
        const response = await addTagToDeal(this.dealId, [selectedTag]);
        if (response.status !== 200) {
          this.toast.error(response.data.message, {
            timeout: 3000,
          });
          return;
        } else {
          this.closeTrashDealModal();
        }
      } catch (error) {
        console.error("Error updating deal:", error);
        this.toast.error(error.message, {
          timeout: 3000,
        });
      }
    },

    async getStages() {
      try {
        const response = await getTrashStages();
        if (response.status === 200) {
          this.trashTags = response.data?.data;
          if (this.trashTags.length < 1) {
            this.toast.info(response.data.message, {
              timeout: 3000,
            });
          }
        } else {
          this.toast.error(response.data.message, {
            timeout: 3000,
          });
        }
      } catch (error) {
        console.error("Error fetching trash stages:", error);
        this.toast.error(error.message, {
          timeout: 3000,
        });
      }
    },
  },
};
</script>

<style scoped>
.modal2 button {
  color: red;
  font-size: 14px;
  padding: 10px 20px;
}
.modal2 button:hover {
  background-color: #eee !important;
}
.modal2 button.active {
  background-color: #ddd !important;
  font-weight: bold;
}
textarea {
  width: 100% !important;
}
</style>
