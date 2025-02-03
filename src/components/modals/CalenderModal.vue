<template>
  <div
    class="modal fade"
    id="calenderModal"
    tabindex="-1"
    aria-labelledby="calenderModalLabel"
    aria-hidden="true"
    ref="calenderModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="calenderModalLabel">تغيير التاريخ</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeCalenderModal"
          ></button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body">
            <CalenderForm v-model="calender" />
          </div>
          <CalenderButtons :loading="loading" @close="closeCalenderModal" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import CalenderForm from "@/components/calenderElements/CalenderForm.vue";
import CalenderButtons from "@/components/calenderElements/CalenderButtons.vue";
import { ref } from "vue";

export default {
  name: "CalenderModal",
  components: { CalenderForm, CalenderButtons },
  setup() {
    const loading = ref(false);
    const calender = ref("");

    const openCalenderModal = () => {
      const modal = document.getElementById("calenderModal");
      const modalInstance = new Modal(modal);
      modalInstance.show();
    };

    const closeCalenderModal = () => {
      const modal = document.getElementById("calenderModal");
      const modalInstance = Modal.getInstance(modal);
      if (modalInstance) modalInstance.hide();
      document.querySelector(".modal-backdrop")?.remove();
      document.body.classList.remove("modal-open");
    };

    const submitForm = () => {
      closeCalenderModal();
    };

    return {
      calender,
      loading,
      openCalenderModal,
      closeCalenderModal,
      submitForm,
    };
  },
};
</script>
