<template>
  <div class="modal fade" id="filterModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">تصفية جهات الاتصال</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <form @submit.prevent="applyFilters">
          <div class="modal-body">
            <!-- Date Range Filter -->
            <div class="mb-3">
              <label class="form-label">تاريخ الإنشاء</label>
              <div class="row">
                <div class="col-6">
                  <input
                    type="date"
                    class="form-control"
                    v-model="filterData.startDate"
                    placeholder="من تاريخ"
                  />
                </div>
                <div class="col-6">
                  <input
                    type="date"
                    class="form-control"
                    v-model="filterData.endDate"
                    placeholder="إلى تاريخ"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            class="modal-footer d-flex justify-content-between align-items-center"
          >
            <button type="submit" class="btn btn-primary">تطبيق الفلتر</button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="resetFilters"
            >
              إعادة تعيين
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
import { useToast } from "vue-toastification";

export default {
  name: "FilterContact",
  emits: ["apply-filters", "reset-filters"],

  setup(props, { emit }) {
    const toast = useToast();
    const modalInstance = ref(null);

    const filterData = ref({
      startDate: "",
      endDate: "",
    });

    const openFilterModal = () => {
      try {
        modalInstance.value.show();
        toast.info("يمكنك تحديد معايير الفلترة", {
          timeout: 3000,
        });
      } catch (error) {
        toast.error("حدث خطأ في فتح نافذة الفلترة", {
          timeout: 3000,
        });
        console.error("Error opening modal:", error);
      }
    };

    const applyFilters = () => {
      try {
        const filters = {
          start_date: filterData.value.startDate,
          end_date: filterData.value.endDate,
        };

        emit("apply-filters", filters);
        modalInstance.value.hide();
        toast.success("تم تطبيق الفلتر بنجاح", {
          timeout: 3000,
        });
      } catch (error) {
        toast.error("فشل في تطبيق الفلتر", {
          timeout: 3000,
        });
        console.error("Error applying filters:", error);
      }
    };

    const resetFilters = () => {
      try {
        filterData.value = {
          startDate: "",
          endDate: "",
        };
        emit("reset-filters");
        modalInstance.value.hide();
        toast.success("تم إعادة تعيين الفلتر بنجاح", {
          timeout: 3000,
        });
      } catch (error) {
        toast.error("فشل في إعادة تعيين الفلتر", {
          timeout: 3000,
        });
        console.error("Error resetting filters:", error);
      }
    };

    onMounted(() => {
      try {
        modalInstance.value = new Modal(document.getElementById("filterModal"));
      } catch (error) {
        toast.error("حدث خطأ في تهيئة نافذة الفلترة", {
          timeout: 3000,
        });
        console.error("Error initializing modal:", error);
      }
    });

    return {
      filterData,
      openFilterModal,
      applyFilters,
      resetFilters,
    };
  },
};
</script>

<style scoped></style>
