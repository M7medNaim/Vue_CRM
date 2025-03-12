<template>
  <div
    class="modal fade"
    id="updateStage"
    tabindex="-1"
    aria-labelledby="updateStageLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="updateStageLabel">Edit Board Title</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateStage">
            <div class="stageTitile d-flex align-content-center gap-4">
              <div class="">
                <span>Stage Title</span>
                <span class="text-danger">*</span>
              </div>
              <input type="text" v-model="stageName" name="title" id="title" />
            </div>
            <div class="stageColor d-flex align-items-center gap-4 mt-3">
              <div class="">
                <span>Stage Color</span>
                <span class="text-danger">*</span>
              </div>
              <input
                type="color"
                v-model="stageColor"
                name="color"
                id="color"
              />
            </div>
          </form>
        </div>
        <div
          class="modal-footer d-flex justify-content-between align-items-center"
        >
          <button type="button" class="btn btn-primary" @click="updateStage">
            Update
          </button>
          <button type="button" class="btn btn-danger" @click="deleteStage">
            Delete Stage
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import { useToast } from "vue-toastification";

export default {
  name: "UpdateStage",
  props: {
    stage: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      stageName: "",
      stageColor: "#000000",
    };
  },
  watch: {
    stage: {
      immediate: true,
      handler(newStage) {
        try {
          if (newStage) {
            this.stageName = newStage.name;
            this.stageColor = this.getStageColor(newStage);
          }
        } catch (error) {
          console.error("Error updating stage data:", error);
          this.toast.error("حدث خطأ أثناء تحديث بيانات المرحلة", {
            timeout: 3000,
          });
        }
      },
    },
  },
  methods: {
    getStageColor(stage) {
      return stage.color || "#000";
    },
    updateStage() {
      try {
        if (!this.stageName.trim()) {
          this.toast.error("اسم المرحلة مطلوب", {
            timeout: 3000,
          });
          return;
        }

        this.$emit("update-stage", {
          id: this.stage.id,
          name: this.stageName,
          color: this.stageColor,
        });

        const modalElement = document.getElementById("updateStage");
        const modal = Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }

        this.toast.success("تم تحديث المرحلة بنجاح", {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error updating stage:", error);
        this.toast.error("حدث خطأ أثناء تحديث المرحلة", {
          timeout: 3000,
        });
      }
    },
    deleteStage() {
      try {
        this.$emit("delete-stage", this.stage.id);
        const modalElement = document.getElementById("updateStage");
        const modal = Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
        this.toast.success("تم حذف المرحلة بنجاح", {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error deleting stage:", error);
        this.toast.error("حدث خطأ أثناء حذف المرحلة", {
          timeout: 3000,
        });
      }
    },
  },
};
</script>
