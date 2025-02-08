<template>
  <div
    class="modal fade"
    id="showDataModal"
    tabindex="-1"
    aria-labelledby="showDataModalLabel"
    aria-hidden="true"
    ref="showDataModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="showDataModalLabel">Show Data</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeShowDataModal"
          ></button>
        </div>
        <!-- <form @submit.prevent="submitShowData"> -->
        <ShowDataForm :formData="formData" />
        <!-- </form> -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { Modal } from "bootstrap";
import ShowDataForm from "../showDataElem/ShowDataForm.vue";

export default {
  name: "showDataModal",
  components: { ShowDataForm },
  props: {
    formData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const showDataModalRef = ref(null);
    const localFormData = ref({
      name: "",
      phone: "",
      note: "",
      lastUpdated: "",
      source: "",
      stage: "",
      responsablePerson: "",
    });
    watch(
      () => props.formData,
      (newData) => {
        if (newData) {
          localFormData.value = { ...newData };
        }
      },
      { deep: true, immediate: true }
    );
    const openShowData = () => {
      const modalElement = document.getElementById("showDataModal");
      const modal = new Modal(modalElement);
      modal.show();
    };

    const closeShowDataModal = () => {
      const modalElement = document.getElementById("showDataModal");
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    };

    return {
      openShowData,
      closeShowDataModal,
      showDataModalRef,
      localFormData,
    };
  },
};
</script>
