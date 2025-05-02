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
            <h4>Are you sure you want to give up on this deal?</h4>
            <span style="font-size: 14px"
              >Warning! You will not be able to recover it later by your
              own</span
            >
          </div>
          <div class="modal2" v-else>
            <i
              class="fa-solid fa-triangle-exclamation pb-4"
              style="font-size: 60px"
            ></i>
            <h4>
              Please provide an explanation for why you are discarding this
              ticket
            </h4>
            <textarea
              class="form-control"
              placeholder="Write a comment"
              rows="4"
              v-model="comment"
            ></textarea>
            <h4 class="mt-5">
              Please choose one of the stages below to discard the deal.
            </h4>
            <div class="btn-group mt-2">
              <button
                v-for="stage in trashStages"
                :key="stage.id"
                class="btn bg-white"
                @click="selectedStage = stage.id"
                :class="{ active: selectedStage === stage.id }"
              >
                {{ stage.name }}
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
            Cancel
          </button>
          <button
            v-if="!showModal2"
            type="button"
            class="btn bg-white py-2 px-4"
            style="color: red; font-size: 14px"
            @click="showModal2 = true"
          >
            Next
          </button>
          <button
            v-else
            type="button"
            class="btn bg-white py-2 px-4"
            style="color: red; font-size: 14px"
            @click="handleTrashDeal"
            :disabled="!selectedStage || !comment"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { updateDealStage, createComment } from "@/plugins/services/authService";

export default {
  name: "TrashDeal",
  props: {
    dealId: {
      type: [String, Number],
      required: true,
    },
  },
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    return { t, toast };
  },
  data() {
    return {
      showModal2: false,
      comment: "",
      selectedStage: null,
      trashStages: [
        { id: 12, name: "Medicines" },
        { id: 13, name: "Old Data" },
        { id: 14, name: "No Response" },
        { id: 16, name: "Trash" },
      ],
    };
  },
  methods: {
    resetModal() {
      this.showModal2 = false;
      this.comment = "";
      this.selectedStage = null;
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
        if (!this.selectedStage || !this.comment) {
          this.toast.error(this.t("error.requiredFields"), {
            timeout: 3000,
          });
          return;
        }
        const selectedStage = this.selectedStage;

        const commentResponse = await createComment({
          text_body: this.comment,
          deal_id: this.dealId,
        });
        if (commentResponse.data) {
          this.$emit("stage-updated", {
            dealId: this.dealId,
            newStage: selectedStage,
          });
        } else {
          this.toast.error(commentResponse.data.message, {
            timeout: 3000,
          });
        }
        // Update the deal stage
        const response = await updateDealStage(this.dealId, selectedStage);
        if (response.status !== 200) {
          this.toast.error(response.data.message, {
            timeout: 3000,
          });
          return;
        } else {
          this.closeTrashDealModal();
          this.toast.success(response.data.message, {
            timeout: 3000,
          });
        }
      } catch (error) {
        console.error("Error updating deal:", error);
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
