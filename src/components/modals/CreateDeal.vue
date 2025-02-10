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
import { createDeal, getUser } from "@/plugins/services/authService";

export default {
  name: "DealModal",
  components: { DealForm, DealButtons },
  emits: ["add-deal"],
  data() {
    return {
      formData: {
        id: null,
        user_id: "",
        phone: "",
        notes: "",
        created_at: "",
        source: "",
        stage: "",
        responsible: "",
      },
      users: [],
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await getUser();
        this.users = response.data.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    openModal() {
      this.fetchUsers();
      const modal = new Modal(document.getElementById("dealModal"));
      modal.show();
    },
    async submitForm() {
      try {
        this.successMessage = "";
        this.errorMessage = "";

        const formData = new FormData();
        formData.append("user_id", this.formData.user_id.id); // Get ID from selected user object
        formData.append("phone", this.formData.phone);
        formData.append("notes", this.formData.notes);
        formData.append("source", this.formData.source);
        formData.append("created_at", this.formData.created_at);
        formData.append("stage", this.formData.stage);
        formData.append("responsible", this.formData.responsible);

        const response = await createDeal(formData);

        if (response.data) {
          this.successMessage = "Created User Is Successfully";
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
        // id: null,
        user_id: "",
        phone: "",
        notes: "",
        created_at: "",
        source: "",
        stage: "",
        responsible: "",
      };
    },
  },
};
</script>
