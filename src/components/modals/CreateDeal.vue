<template>
  <div
    class="modal fade"
    id="dealModal"
    tabindex="-1"
    aria-labelledby="dealModalLabel"
    aria-hidden="true"
    ref="dealModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="dealModalLabel">Create Deal</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeDealModal"
          ></button>
        </div>
        <form @submit.prevent="submitDeals">
          <DealForm :formData="dealData" />
          <DealButtons @close-modal="closeDealModal" @submit="submitDeals" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { Modal } from "bootstrap";
import DealForm from "../CreateDealElements/DealForm.vue";
import DealButtons from "../CreateDealElements/DealButtons.vue";

export default {
  name: "DealModal",
  components: { DealForm, DealButtons },
  emits: ["add-deal"],

  setup(_, { emit }) {
    const dealModalRef = ref(null);
    let modalInstance = null;

    const dealData = ref({
      name: "",
      phone: "",
      notes: "",
      lastUpdated: new Date().toISOString().split("T")[0],
      source: "",
      stage: "",
      responsible: "",
    });

    const openDealModal = () => {
      if (dealModalRef.value) {
        modalInstance = new Modal(dealModalRef.value);
        modalInstance.show();
      }
    };

    const closeDealModal = () => {
      if (modalInstance) {
        modalInstance.hide();
      }
    };

    const submitDeals = () => {
      if (
        !dealData.value.name ||
        !dealData.value.phone ||
        !dealData.value.lastUpdated ||
        !dealData.value.source ||
        !dealData.value.responsible ||
        !dealData.value.notes
      ) {
        alert("Input Is required");
        return;
      }
      const newDeal = { ...dealData.value, id: Date.now() };
      emit("add-deal", newDeal);
      closeDealModal();
      dealData.value = {
        name: "",
        phone: "",
        notes: "",
        lastUpdated: new Date().toISOString().split("T")[0],
        source: "",
        stage: "",
        responsible: "",
      };
    };

    return {
      dealModalRef,
      dealData,
      openDealModal,
      closeDealModal,
      submitDeals,
    };
  },
};
</script>
