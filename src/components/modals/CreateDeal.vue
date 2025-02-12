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
        <form @submit.prevent="submitForm">
          <DealForm :formData="formData" />
          <DealButtons @close-modal="closeDealModal" @submit="submitForm" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import DealForm from "../CreateDealElements/DealForm.vue";
import DealButtons from "../CreateDealElements/DealButtons.vue";
import { createDeal } from "@/plugins/services/authService";

export default {
  name: "DealModal",
  components: { DealForm, DealButtons },
  emits: ["add-deal"],
  data() {
    return {
      formData: {
        description: null,
        stage_id: "",
        source_id: null,
        contact: {
          name: "",
          email: "",
          phones: [
            {
              phone: "",
            },
          ],
        },
      },
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    openModal() {
      const modal = new Modal(document.getElementById("dealModal"));
      modal.show();
    },
    async submitForm() {
      try {
        this.successMessage = "";
        this.errorMessage = "";

        const dealData = {
          description: this.formData.description,
          stage_id: this.formData.stage_id,
          source_id: this.formData.source_id,
          contact: {
            name: this.formData.contact.name,
            email: this.formData.contact.email,
            phones: [
              {
                phone: this.formData.contact.phones[0].phone,
              },
            ],
          },
        };

        const response = await createDeal(dealData);

        if (response.data) {
          this.successMessage = "Deal Created Successfully";
          this.$emit("add-deal", response.data.data);
          setTimeout(() => {
            this.clearForm();
            this.closeDealModal();
          }, 1500);
        }
      } catch (error) {
        this.errorMessage = "An error occurred, try again";
        console.error("Error:", error);
      }
    },
    clearForm() {
      this.formData = {
        description: null,
        stage_id: "",
        source_id: null,
        contact: {
          name: "",
          email: "",
          phones: [
            {
              phone: "",
            },
          ],
        },
      };
    },
    closeDealModal() {
      const modal = Modal.getInstance(this.$refs.dealModal);
      modal.hide();
    },
  },
};
</script>
