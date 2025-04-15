<template>
  <div
    class="modal fade"
    id="createDealModal"
    tabindex="-1"
    aria-labelledby="createDealModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createDealModalLabel">
            {{ t("kanban-modal-create-heading") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handlecreateDeal">
            <div class="row mb-3">
              <div class="col-4">
                <label>
                  <i class="fas fa-user"></i>
                  {{ t("kanban-modal-create-label-fullname") }}
                  <span class="text-danger">*</span>
                </label>
              </div>
              <div class="col-8 text-end">
                <input
                  type="text"
                  class="form-control"
                  required
                  :placeholder="t('kanban-modal-create-placeholder-fullname')"
                />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-4">
                <label>
                  <i class="fas fa-phone"></i>
                  {{ t("kanban-modal-create-label-phone") }}
                  <span class="text-danger">*</span>
                </label>
              </div>
              <div class="col-8 text-end">
                <input
                  type="text"
                  class="form-control"
                  required
                  :placeholder="t('kanban-modal-create-placeholder-phone')"
                />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-4">
                <label>
                  <i class="fas fa-sticky-note"></i>
                  {{ t("kanban-modal-create-label-notes") }}
                </label>
              </div>
              <div class="col-8 text-end">
                <textarea
                  class="w-100"
                  name="notes"
                  id="note"
                  :placeholder="t('kanban-modal-create-placeholder-notes')"
                ></textarea>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-4">
                <label>
                  <i class="fas fa-info-circle me-2"></i>
                  {{ t("kanban-modal-create-label-source") }}
                </label>
              </div>
              <div class="col-8 text-end">
                <div class="d-flex flex-wrap gap-2">
                  <button
                    v-for="src in sources"
                    :key="src.id"
                    @click.prevent="form.source = src.name"
                    :class="{
                      'btn-primary text-white': form.source === src.name,
                    }"
                    class="btn btn-light"
                  >
                    <i :class="src.icon" class="fs-6"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-4">
                <label>
                  <i class="fa-solid fa-users"></i>
                  {{ t("kanban-modal-create-label-assignedto") }}
                </label>
              </div>
              <div class="col-8 text-end">
                <select
                  class="form-select border-0 bg-light text-secondary"
                  v-model="form.representative"
                >
                  <option value="any">
                    {{ t("kanban-modal-create-placeholder-representative") }}
                  </option>
                </select>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-4">
                <label>
                  <i class="fa-solid fa-cubes"></i>
                  {{ t("kanban-modal-create-label-packages") }}
                </label>
              </div>
              <div class="col-8">
                <div class="border border-secondary-subtle p-2 rounded-3">
                  <div
                    class="pkg d-flex justify-content-start gap-2 align-items-center mb-2"
                  >
                    <select
                      class="form-select border-0 bg-light text-secondary"
                      v-model="form.package"
                    >
                      <option value="Choose a Service">
                        {{ t("kanban-modal-create-placeholder-packages-name") }}
                      </option>
                    </select>
                    <input
                      type="text"
                      class="form-control"
                      required
                      :placeholder="
                        t('kanban-modal-create-placeholder-packages-quantity')
                      "
                    />
                    <button
                      type="button"
                      class="btn bg-transparent border-1 border-black p-1 px-2"
                      @click="addPackage"
                    >
                      <i class="fa fa-plus"></i>
                    </button>
                  </div>

                  <div
                    v-for="pkg in form.packages"
                    :key="pkg.id"
                    class="pkg d-flex justify-content-start gap-2 align-items-center mb-2"
                  >
                    <select
                      class="form-select border-0 bg-light text-secondary"
                      v-model="pkg.package"
                    >
                      <option value="any">choose a service</option>
                    </select>
                    <input
                      type="text"
                      class="form-control"
                      required
                      :placeholder="
                        t('kanban-modal-create-placeholder-packages-quantity')
                      "
                      v-model="pkg.quantity"
                    />
                    <button
                      class="btn bg-transparent border-1 border-danger p-1 px-2"
                      @click="removePackage(pkg.id)"
                    >
                      <i class="fas fa-times text-danger fs-5"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer d-flex justify-content-between">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                {{ t("kanban-modal-create-button-close") }}
              </button>
              <button type="submit" class="btn btn-primary">
                {{ t("kanban-modal-create-button-submit") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

export default {
  name: "createDealModal",
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    return { t, toast };
  },
  data() {
    return {
      showModal: false,
      form: {
        name: "",
        phone: "",
        notes: "",
        source: "",
        company: "any",
        representative: "any",
        package: "Choose a Service",
        packages: [],
      },
      sources: [
        { id: 1, name: "Facebook", icon: "fab fa-facebook" },
        { id: 2, name: "Whatsapp", icon: "fab fa-whatsapp" },
        { id: 3, name: "Google", icon: "fab fa-google" },
        { id: 4, name: "Instagram", icon: "fab fa-instagram" },
        { id: 5, name: "Twitter", icon: "fab fa-twitter" },
        { id: 6, name: "TikTok", icon: "fab fa-tiktok" },
        { id: 7, name: "Snapchat", icon: "fab fa-snapchat" },
        { id: 8, name: "WeChat", icon: "fa-brands fa-vk" },
        { id: 9, name: "Telegram", icon: "fab fa-telegram" },
        { id: 10, name: "Other", icon: "fa-brands fa-microsoft" },
      ],
    };
  },
  methods: {
    submitForm() {
      try {
        if (!this.form.name.trim()) {
          this.toast.error(this.t("error.please_enter_full_name"), {
            timeout: 3000,
          });
          return;
        }

        if (!this.form.phone.trim()) {
          this.toast.error(this.t("error.please_enter_phone"), {
            timeout: 3000,
          });
          return;
        }

        console.log("Form Data:", this.form);
        this.showModal = false;
        this.toast.success(this.t("success.deal_created"), { timeout: 3000 });
        this.resetForm();
      } catch (error) {
        console.error("Error submitting form:", error);
        this.toast.error(this.t("error.deal_creation_failed"), {
          timeout: 3000,
        });
      }
    },
    addPackage() {
      try {
        if (this.form.packages.length >= 5) {
          this.toast.warning(this.t("error.cannot_add_more_than_5_packages"), {
            timeout: 3000,
          });
          return;
        }
        this.form.packages.push({
          package: "any",
          quantity: "",
          id: Date.now(),
        });
        this.toast.info(this.t("success.package_added"), { timeout: 3000 });
      } catch (error) {
        console.error("Error adding package:", error);
        this.toast.error(this.t("error.error_adding_package"), {
          timeout: 3000,
        });
      }
    },
    removePackage(id) {
      try {
        this.form.packages = this.form.packages.filter((pkg) => pkg.id !== id);
        this.toast.success(this.t("success.package_removed"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error removing package:", error);
        this.toast.error(this.t("error.removing_package"), {
          timeout: 3000,
        });
      }
    },
    resetForm() {
      this.form = {
        name: "",
        phone: "",
        notes: "",
        source: "",
        company: "any",
        representative: "any",
        package: "Choose a Service",
        packages: [],
      };
    },
  },
};
</script>
<style scoped>
input,
textarea {
  color: #777575 !important;
}
select:focus,
input:focus {
  box-shadow: none;
  border: 1px solid #eee;
}
textarea {
  border: 1px solid #eee;
}
</style>
