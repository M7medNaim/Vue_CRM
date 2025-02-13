<template>
  <div class="modal fade" id="contactCreateModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEditing ? "تعديل جهة اتصال" : "إضافة جهة اتصال جديدة" }}
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
              <label for="name" class="form-label">الاسم</label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="formData.name"
                required
              />
              <div v-if="errors.name" class="text-danger">
                {{ errors.name }}
              </div>
            </div>

            <!-- Email Input -->
            <div class="mb-3">
              <label for="email" class="form-label">البريد الإلكتروني</label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="formData.email"
                required
              />
              <div v-if="errors.email" class="text-danger">
                {{ errors.email }}
              </div>
            </div>

            <!-- Phone Input -->
            <div class="mb-3">
              <label for="phone" class="form-label">رقم الهاتف</label>
              <input
                type="tel"
                class="form-control"
                id="phone"
                v-model="formData.phone"
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
              {{ isSubmitting ? "جاري الحفظ..." : "حفظ" }}
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              إلغاء
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

export default {
  name: "ContactForm",
  emits: ["contact-updated"],
  setup(props, { emit }) {
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
      if (contact) {
        formData.value = { ...contact };
        isEditing.value = true;
      } else {
        resetForm();
      }
      modalInstance.value.show();
    };

    const validateForm = () => {
      errors.value = {};
      let isValid = true;

      if (!formData.value.name) {
        errors.value.name = "الاسم مطلوب";
        isValid = false;
      }

      if (!formData.value.email) {
        errors.value.email = "البريد الإلكتروني مطلوب";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
        errors.value.email = "البريد الإلكتروني غير صالح";
        isValid = false;
      }

      if (!formData.value.phone) {
        errors.value.phone = "رقم الهاتف مطلوب";
        isValid = false;
      } else if (!/^\d{10,}$/.test(formData.value.phone)) {
        errors.value.phone = "رقم الهاتف غير صالح";
        isValid = false;
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
        } else {
          response = await createContact(formData.value);
        }

        if (response.status === 200 || response.status === 201) {
          emit("contact-updated", response.data.data);
          modalInstance.value.hide();
          resetForm();
        }
      } catch (error) {
        console.error("Error saving contact:", error);
        if (error.response?.data?.errors) {
          errors.value = error.response.data.errors;
        }
      } finally {
        isSubmitting.value = false;
      }
    };

    onMounted(() => {
      modalInstance.value = new Modal(
        document.getElementById("contactCreateModal")
      );
    });

    return {
      formData,
      errors,
      isEditing,
      isSubmitting,
      openModal,
      handleSubmit,
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
