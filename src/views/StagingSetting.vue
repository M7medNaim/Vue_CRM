<template>
  <div class="mt-4 me-2 bg-white p-4 pb-0 rounded-3">
    <form>
      <h5 class="mb-4">Staging Settings</h5>
      <div class="row my-3 border-bottom pb-2 mb-4">
        <div class="col-4">Stage Name</div>
        <div class="col-4">Status</div>
        <div class="col-4">Days Counts</div>
      </div>
      <div v-for="(stage, index) in stages" :key="index" class="row mb-3">
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
                    v-model="stage.timer_status"
                    @change="changeStageStatus(stage.id)"
                  />
                </div>
              </div>
            </div>
            <div class="col-4">
              <input
                type="number"
                v-model="stage.timer_allowed"
                placeholder="Days Counts"
                class="form-control"
                @change="updateStageTimer(stage.id)"
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
import { getStageTimers, updateStage } from "@/plugins/services/authService";
import { ref, onMounted } from "vue";

export default {
  name: "StageingSettings",
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    const stages = ref([]);

    const getAllStages = async () => {
      try {
        const response = await getStageTimers();
        stages.value = response.data.data;
      } catch (error) {
        toast.error("Error loading stages");
      }
    };

    const changeStageStatus = async (id) => {
      try {
        const stage = stages.value.find((stage) => stage.id === id);
        if (stage) {
          stage.timer_status = !stage.timer_status;
          await updateStage(id, { timer_status: stage.timer_status });
          toast.success("Stage status updated successfully");
        }
      } catch (error) {
        toast.error("Error updating stage status");
      }
    };

    const updateStageTimer = async (id) => {
      try {
        const stage = stages.value.find((stage) => stage.id === id);
        if (stage) {
          await updateStage(id, { timer_allowed: stage.timer_allowed });
          toast.success("Stage timer updated successfully");
        }
      } catch (error) {
        toast.error("Error updating stage timer");
      }
    };

    onMounted(() => {
      getAllStages();
    });

    return {
      t,
      toast,
      stages,
      getAllStages,
      changeStageStatus,
      updateStageTimer,
    };
  },
};
</script>

<style scoped>
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
