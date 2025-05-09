<template>
  <div class="mt-4 me-2 bg-white pb-0 pt-4 rounded-3 tableStage">
    <form>
      <h5 class="mb-4 ps-4">Staging Settings</h5>
      <div class="row my-3 border-bottom pb-2 mb-4 headerStage p-4">
        <div class="col-4">Stage Name</div>
        <div class="col-4">Status</div>
        <div class="col-4">Days Counts</div>
      </div>
      <div v-for="(stage, index) in stages" :key="index" class="row mb-3 p-4">
        <div class="col-12">
          <div
            class="row align-items-center mb-3 border-bottom pb-2"
            :style="{
              borderLeft: `4px solid ${stage.color_code}`,
            }"
          >
            <div class="col-4 text-start">
              <span class="py-2 pe-4 ps-1 text-start">{{ stage.name }}</span>
            </div>
            <div class="col-4">
              <div class="form-group">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input shadow-none custom-switch"
                    type="checkbox"
                    v-model="stage.status"
                  />
                </div>
              </div>
            </div>
            <div class="col-4">
              <input
                type="number"
                v-model="stage.number"
                placeholder="Days Counts"
                class="form-control"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import { getStages } from "@/plugins/services/authService";
import { ref, onMounted } from "vue";

export default {
  name: "StageingSettings",
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    const stages = ref([]);

    const getAllStages = async () => {
      try {
        const response = await getStages();
        stages.value = response.data.data;
      } catch (error) {
        toast.error("Error loading stages");
      }
    };

    onMounted(() => {
      getAllStages();
    });

    return { t, toast, stages, getAllStages };
  },
};
</script>

<style scoped>
.tableStage {
  height: 88vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.headerStage {
  position: sticky;
  top: -4%;
  background-color: #fff;
  width: 100% !important;
  z-index: 999;
}
.form-check-input:checked {
  background-color: #09b103 !important;
  border-color: #09b103 !important;
  box-shadow: none !important;
}
.custom-switch {
  width: 2.5rem !important;
  height: 1.4rem !important;
  cursor: pointer;
}
input {
  background-color: #f8f9fa !important;
}
input:focus {
  background-color: #f8f9fa !important;
  box-shadow: none !important;
  border-color: #b9b9b9 !important;
}
</style>
