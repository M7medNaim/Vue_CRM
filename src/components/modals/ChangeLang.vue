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
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="changeLang"
            >
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
import { ref, onMounted } from "vue";
import { changeLanguage } from "@/i18n";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { useLoadingStore } from "@/plugins/loadingStore";

export default {
  name: "ChangeLang",
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    const loadingStore = useLoadingStore();
    const selectedLang = ref(localStorage.getItem("locale") || "en");
    const modalInstance = ref(null);

    onMounted(() => {
      const modal = document.getElementById("changeLangModal");
      modalInstance.value = new Modal(modal);
    });

    const openChangeLang = () => {
      try {
        modalInstance.value.show();
      } catch (error) {
        toast.error(t("error.openModal"), {
          timeout: 3000,
          id: "change-lang-open-error",
          singleton: true,
        });
      }
    };

    const submitForm = async () => {
      try {
        if (!selectedLang.value) {
          toast.error(t("error.selectLang"), {
            timeout: 3000,
            id: "change-lang-validation",
            singleton: true,
          });
          return;
        }

        // تأكد من إزالة خلفية المودال وتنظيف DOM
        document.querySelector(".modal-backdrop")?.remove();
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";

        // بدء التحميل
        loadingStore.startLoading();

        await changeLanguage(selectedLang.value);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        toast.error(t("error.changeLang"), {
          timeout: 3000,
          id: "change-lang-submit-error",
          singleton: true,
        });
      } finally {
        loadingStore.stopLoading();
      }
    };

    const changeLang = () => {
      submitForm();
    };

    return {
      selectedLang,
      openChangeLang,
      submitForm,
      changeLang,
      t,
    };
  },
};
</script>
