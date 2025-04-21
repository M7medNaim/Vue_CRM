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
            ></textarea>
            <h4 class="mt-5">
              Please choose one of the stages below to discard the deal.
            </h4>
            <div class="btn-group mt-2">
              <button class="btn bg-white">Medicines</button>
              <button class="btn bg-white">No Response</button>
              <button class="btn bg-white">Trash</button>
              <button class="btn bg-white">Old Data</button>
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Modal } from "bootstrap";
export default {
  name: "TrashDeal",
  data() {
    return {
      showModal2: false,
    };
  },
  methods: {
    resetModal() {
      this.showModal2 = false;
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
textarea {
  width: 100% !important;
}
</style>
