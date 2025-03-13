<template>
  <div
    class="modal fade"
    id="changeLangModal"
    tabindex="-1"
    aria-labelledby="changeLangModalLabel"
    aria-hidden="true"
    ref="changeLangModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t("changeLanguage") }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeChangeLang"
          ></button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body">
            <select v-model="selectedLang" class="form-select">
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="changeLang">
              {{ $t("save") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ref } from "vue";
import { changeLanguage } from "@/i18n";
import { useToast } from "vue-toastification";

export default {
  name: "ChangeLang",
  setup() {
    const toast = useToast();
    const selectedLang = ref(localStorage.getItem("locale") || "en");

    const openChangeLang = () => {
      try {
        const modal = document.getElementById("changeLangModal");
        const modalInstance = new Modal(modal);
        modalInstance.show();
      } catch (error) {
        toast.error("حدث خطأ أثناء فتح نافذة تغيير اللغة", {
          timeout: 3000,
          id: "change-lang-open-error",
          singleton: true,
        });
      }
    };

    const closeChangeLang = () => {
      try {
        const modal = document.getElementById("changeLangModal");
        const modalInstance = Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
          document.querySelector(".modal-backdrop")?.remove();
          document.body.classList.remove("modal-open");
        }
      } catch (error) {
        toast.error("حدث خطأ أثناء إغلاق النافذة", {
          timeout: 3000,
          id: "change-lang-close-error",
          singleton: true,
        });
      }
    };

    const submitForm = async () => {
      try {
        if (!selectedLang.value) {
          toast.error("الرجاء اختيار اللغة", {
            timeout: 3000,
            id: "change-lang-validation",
            singleton: true,
          });
          return;
        }

        changeLanguage(selectedLang.value);
        closeChangeLang();
      } catch (error) {
        toast.error("حدث خطأ أثناء تغيير اللغة", {
          timeout: 3000,
          id: "change-lang-submit-error",
          singleton: true,
        });
      }
    };

    const changeLang = () => {
      submitForm();
    };

    return {
      selectedLang,
      openChangeLang,
      closeChangeLang,
      submitForm,
      changeLang,
    };
  },
};
</script>
