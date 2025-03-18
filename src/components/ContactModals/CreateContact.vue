<template>
  <div class="modal fade" id="contactCreateModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{
              isEditing
                ? t("contacts-modal-edit-heading")
                : t("contacts-modal-add-heading")
            }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <!-- Name Input -->
            <div class="mb-3">
              <label for="name" class="form-label">{{
                t("contacts-modal-add-label-fullname")
              }}</label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="formData.name"
                :placeholder="t('contacts-modal-add-placeholder-fullname')"
                required
              />
              <div v-if="errors.name" class="text-danger">
                {{ errors.name }}
              </div>
            </div>

            <!-- Email Input -->
            <div class="mb-3">
              <label for="email" class="form-label">{{
                t("contacts-modal-add-label-email")
              }}</label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="formData.email"
                :placeholder="t('contacts-modal-add-placeholder-email')"
                required
              />
              <div v-if="errors.email" class="text-danger">
                {{ errors.email }}
              </div>
            </div>

            <!-- Phone Input -->
            <div class="mb-3">
              <label for="phone" class="form-label">{{
                t("contacts-modal-add-label-phone")
              }}</label>
              <input
                type="tel"
                class="form-control"
                id="phone"
                v-model="formData.phone"
                :placeholder="t('contacts-modal-add-placeholder-phone')"
                required
              />
              <div v-if="errors.phone" class="text-danger">
                {{ errors.phone }}
              </div>
            </div>
          </div>
          <div
            class="modal-footer d-flex justify-content-between align-items-center"
          >
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              {{
                isSubmitting
                  ? t("contacts-modal-edit-button-submit")
                  : t("contacts-modal-edit-button-submit")
              }}
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {{ t("contacts-modal-edit-button-cancel") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { Modal } from "bootstrap";
import { createContact, updateContact } from "@/plugins/services/authService";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
export default {
  name: "ContactForm",
  emits: ["contact-updated"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const toast = useToast();
    const modalInstance = ref(null);
    const isEditing = ref(false);
    const isSubmitting = ref(false);
    const errors = ref({});

    const formData = ref({
      name: "",
      email: "",
      phone: "",
    });

    const resetForm = () => {
      formData.value = {
        name: "",
        email: "",
        phone: "",
      };
      errors.value = {};
      isEditing.value = false;
    };

    const openModal = (contact = null) => {
      try {
        if (contact) {
          formData.value = { ...contact };
          isEditing.value = true;
          toast.info(t("success.editContact"), {
            timeout: 3000,
          });
        } else {
          resetForm();
          toast.info(t("success.addContact"), {
            timeout: 3000,
          });
        }
        modalInstance.value.show();
      } catch (error) {
        toast.error(t("error.openModal"), {
          timeout: 3000,
        });
        console.error("Error opening modal:", error);
      }
    };

    const validateForm = () => {
      errors.value = {};
      let isValid = true;

      if (!formData.value.name) {
        errors.value.name = t("error.nameRequired");
        isValid = false;
      }

      if (!formData.value.email) {
        errors.value.email = t("error.emailRequired");
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
        errors.value.email = t("error.invalidEmail");
        isValid = false;
      }

      if (!formData.value.phone) {
        errors.value.phone = t("error.phoneRequired");
        isValid = false;
      } else if (
        !/^[+]?\d{8,}$/.test(formData.value.phone.replace(/\s/g, ""))
      ) {
        errors.value.phone = t("error.invalidPhoneNumber");
        isValid = false;
      }

      if (!isValid) {
        toast.error(t("error.formErrors"), {
          timeout: 3000,
        });
      }

      return isValid;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      try {
        isSubmitting.value = true;
        let response;

        if (isEditing.value) {
          response = await updateContact(formData.value.id, formData.value);
          if (response.data.success || response.status === 200) {
            emit("contact-updated", response.data.data || formData.value);
            modalInstance.value.hide();
            resetForm();
            toast.success(t("success.contactUpdated"), {
              timeout: 3000,
            });
          }
        } else {
          response = await createContact(formData.value);
          if (response.data.success || response.status === 201) {
            emit("contact-updated", response.data.data || formData.value);
            modalInstance.value.hide();
            resetForm();
            toast.success(t("success.contactAdded"), {
              timeout: 3000,
            });
          }
        }
      } catch (error) {
        console.error("Error saving contact:", error);
        if (error.response?.data?.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response?.data?.message || t("error.saveContact"), {
          timeout: 3000,
        });
      } finally {
        isSubmitting.value = false;
      }
    };

    onMounted(() => {
      try {
        modalInstance.value = new Modal(
          document.getElementById("contactCreateModal")
        );
      } catch (error) {
        toast.error(t("error.closeModal"), {
          timeout: 3000,
        });
        console.error("Error initializing modal:", error);
      }
    });

    return {
      formData,
      errors,
      isEditing,
      isSubmitting,
      openModal,
      handleSubmit,
      t,
    };
  },
};
</script>

<style scoped>
.form-control:focus {
  border-color: #333;
  box-shadow: 0 0 0 0.01rem #333;
}
</style>
