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
          <h5 class="modal-title" id="changeLangModalLabel">تغيير اللغة</h5>
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
            <changeLangForm v-model="lang" />
          </div>
          <changeLangButtons :loading="loading" @close="closeChangeLang" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import changeLangForm from "@/components/changeLang/changeLangForm.vue";
import changeLangButtons from "@/components/changeLang/changeLangButtons.vue";
import { ref } from "vue";

export default {
  name: "ChangeLang",
  components: { changeLangForm, changeLangButtons },
  setup() {
    const loading = ref(false);
    const lang = ref("");

    const openChangeLang = () => {
      const modal = document.getElementById("changeLangModal");
      const modalInstance = new Modal(modal);
      modalInstance.show();
    };

    const closeChangeLang = () => {
      const modal = document.getElementById("changeLangModal");
      const modalInstance = Modal.getInstance(modal);
      if (modalInstance) modalInstance.hide();
      document.querySelector(".modal-backdrop")?.remove();
      document.body.classList.remove("modal-open");
    };
    return {
      lang,
      loading,
      openChangeLang,
      closeChangeLang,
    };
  },
};
</script>
