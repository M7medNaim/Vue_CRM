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
            </div>
            <!-- nickname Input -->
            <div class="mb-3">
              <label for="nickname" class="form-label">{{
                t("contacts-modal-add-label-nickname")
              }}</label>
              <input
                type="text"
                class="form-control"
                id="nickname"
                v-model="formData.nickname"
                :placeholder="t('contacts-modal-add-placeholder-nickname')"
                required
              />
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
            </div>
            <!-- Address Input -->
            <div class="mb-3">
              <label for="address" class="form-label">{{
                t("contacts-modal-add-label-address")
              }}</label>
              <input
                type="text"
                class="form-control"
                id="address"
                v-model="formData.address"
                :placeholder="t('contacts-modal-add-placeholder-address')"
                required
              />
            </div>
            <!-- country Input -->
            <div class="mb-3">
              <label for="country" class="form-label">{{
                t("contacts-modal-add-label-country")
              }}</label>
              <input
                type="text"
                class="form-control"
                id="country"
                v-model="formData.country"
                :placeholder="t('contacts-modal-add-placeholder-country')"
                required
              />
            </div>

            <!-- Phone Input -->
            <div
              class="mb-3"
              v-for="(phone, index) in formData.phones"
              :key="index"
            >
              <div class="d-flex align-items-center gap-2">
                <div class="flex-grow-1">
                  <label for="phone" class="form-label">
                    {{ t("contacts-modal-add-label-phone") }} {{ index + 1 }}
                  </label>
                  <div class="mb-3 d-flex align-items-center gap-2">
                    <input
                      type="text"
                      class="form-control"
                      :id="`phone${index}`"
                      v-model="phone.phone"
                      :placeholder="t('contacts-modal-add-placeholder-phone')"
                    />
                    <button
                      type="button"
                      class="btn btn-primary"
                      @click="addPhone"
                      v-if="formData.phones.length < 2"
                    >
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  class="btn btn-danger mt-3"
                  @click="removePhone(index)"
                  v-if="formData.phones.length > 1"
                >
                  <i class="fas fa-trash"></i>
                </button>
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
    const errors = ref([]);

    const formData = ref({
      name: "",
      nickname: "",
      email: "",
      address: "",
      country: "",
      phones: [{ phone: "" }],
    });

    const resetForm = () => {
      formData.value = {
        name: "",
        nickname: "",
        email: "",
        address: "",
        country: "",
        phones: [{ phone: "" }],
      };
      isEditing.value = false;
    };

    const openModal = (contact = null) => {
      try {
        if (contact) {
          formData.value = {
            id: contact.id,
            name: contact.name,
            nickname: contact.nickname,
            email: contact.email,
            address: contact.address || "",
            country: contact.country || "",
            phones:
              contact.phones?.length > 0
                ? contact.phones.map((phone) => ({ phone: phone.phone }))
                : [{ phone: "" }],
          };
          isEditing.value = true;
          toast.success(t("success.editContact"), {
            timeout: 3000,
          });
        } else {
          resetForm();
          // toast.success(t("success.addContact"), {
          //   timeout: 3000,
          // });
        }
        modalInstance.value.show();
      } catch (error) {
        toast.error(t("error.openModal"), {
          timeout: 3000,
        });
        console.error("Error opening modal:", error);
      }
    };

    const addPhone = () => {
      if (formData.value.phones.length < 2) {
        formData.value.phones.push({ phone: "" });
      } else {
        toast.error(t("error.maxPhonesReached"), {
          timeout: 3000,
        });
      }
    };

    const removePhone = (index) => {
      if (formData.value.phones.length > 1) {
        formData.value.phones.splice(index, 1);
      } else {
        toast.error(t("error.atLeastOnePhone"), {
          timeout: 3000,
        });
      }
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      try {
        isSubmitting.value = true;
        let response;

        const submitData = {
          name: formData.value.name,
          nickname: formData.value.nickname,
          email: formData.value.email,
          address: formData.value.address,
          country: formData.value.country,
          phones: formData.value.phones
            .filter((phone) => phone.phone)
            .map((phone) => phone.phone.toString()),
        };

        if (isEditing.value) {
          response = await updateContact(formData.value.id, submitData);
        } else {
          response = await createContact(submitData);
        }

        if (
          response.data.success ||
          response.status === 200 ||
          response.status === 201
        ) {
          emit("contact-updated", response.data.data);
          modalInstance.value.hide();
          resetForm();
          toast.success(
            t(
              isEditing.value
                ? "success.contactUpdated"
                : "success.contactAdded"
            ),
            {
              timeout: 3000,
            }
          );
        }
      } catch (error) {
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

    const validateForm = () => {
      return true;
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
        // console.error("Error initializing modal:", error);
      }
    });

    return {
      formData,
      isEditing,
      isSubmitting,
      openModal,
      handleSubmit,
      addPhone,
      removePhone,
      t,
      errors,
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
