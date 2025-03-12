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
          <h5 class="modal-title" id="createDealModalLabel">Create New Deal</h5>
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
                  <i class="fas fa-a"></i> Full Name
                  <span class="text-danger">*</span>
                </label>
              </div>
              <div class="col-8 text-end">
                <input
                  type="text"
                  class="form-control"
                  required
                  placeholder="Example. Muhammad Sadek"
                />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-4">
                <label>
                  <i class="fas fa-phone"></i> Phone Number
                  <span class="text-danger">*</span>
                </label>
              </div>
              <div class="col-8 text-end">
                <input
                  type="text"
                  class="form-control"
                  required
                  placeholder="97155123456"
                />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-4">
                <label> <i class="fas fa-sticky-note"></i> Notes </label>
              </div>
              <div class="col-8 text-end">
                <textarea class="w-100" name="notes" id="note"></textarea>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-4">
                <label> <i class="fas fa-info-circle me-2"></i> Source </label>
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
                <label><i class="fa-solid fa-user"></i> Assign Company </label>
              </div>
              <div class="col-8 text-end">
                <select
                  class="form-select border-0 bg-light text-secondary"
                  v-model="form.company"
                >
                  <option value="any">Any</option>
                </select>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-4">
                <label
                  ><i class="fa-solid fa-users"></i> Assign Representative
                </label>
              </div>
              <div class="col-8 text-end">
                <select
                  class="form-select border-0 bg-light text-secondary"
                  v-model="form.representative"
                >
                  <option value="any">Any</option>
                </select>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-4">
                <label><i class="fa-solid fa-cubes"></i> Packages </label>
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
                      <option value="Choose a Service">Choose a Service</option>
                    </select>
                    <input
                      type="text"
                      class="form-control"
                      required
                      placeholder="Quantity / Type"
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
                      <option value="any">Choose a Service</option>
                    </select>
                    <input
                      type="text"
                      class="form-control"
                      required
                      placeholder="Quantity / Type"
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
                Close
              </button>
              <button type="submit" class="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";

export default {
  name: "createDealModal",
  setup() {
    const toast = useToast();
    return { toast };
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
          this.toast.error("الرجاء إدخال الاسم الكامل", { timeout: 3000 });
          return;
        }

        if (!this.form.phone.trim()) {
          this.toast.error("الرجاء إدخال رقم الهاتف", { timeout: 3000 });
          return;
        }

        console.log("Form Data:", this.form);
        this.showModal = false;
        this.toast.success("تم إنشاء الصفقة بنجاح", { timeout: 3000 });
        this.resetForm();
      } catch (error) {
        console.error("Error submitting form:", error);
        this.toast.error("حدث خطأ أثناء إنشاء الصفقة", { timeout: 3000 });
      }
    },
    addPackage() {
      try {
        if (this.form.packages.length >= 5) {
          this.toast.warning("لا يمكن إضافة أكثر من 5 باقات", {
            timeout: 3000,
          });
          return;
        }
        this.form.packages.push({
          package: "any",
          quantity: "",
          id: Date.now(),
        });
        this.toast.info("تم إضافة باقة جديدة", { timeout: 3000 });
      } catch (error) {
        console.error("Error adding package:", error);
        this.toast.error("حدث خطأ أثناء إضافة الباقة", { timeout: 3000 });
      }
    },
    removePackage(id) {
      try {
        this.form.packages = this.form.packages.filter((pkg) => pkg.id !== id);
        this.toast.success("تم حذف الباقة بنجاح", { timeout: 3000 });
      } catch (error) {
        console.error("Error removing package:", error);
        this.toast.error("حدث خطأ أثناء حذف الباقة", { timeout: 3000 });
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
