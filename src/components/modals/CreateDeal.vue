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
          <h5 class="modal-title" id="dealModalLabel">
            {{ t("modals.createDeal") }}
          </h5>
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
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
export default {
  name: "DealModal",
  components: { DealForm, DealButtons },
  emits: ["add-deal"],
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    return { toast, t };
  },
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
    };
  },
  methods: {
    openModal() {
      const modal = new Modal(document.getElementById("dealModal"));
      modal.show();
    },
    async submitForm() {
      try {
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
          this.toast.success(this.t("success.createDeal"), {
            timeout: 3000,
          });
          this.$emit("add-deal", response.data.data);
          setTimeout(() => {
            this.clearForm();
            this.closeDealModal();
          }, 1000);
        }
      } catch (error) {
        this.toast.error(
          error.response?.data?.message || this.t("error.createDeal"),
          {
            timeout: 3000,
          }
        );
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
