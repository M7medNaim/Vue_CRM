<template>
  <div class="modal fade" id="roleModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEditing ? "تعديل الدور" : "إضافة دور جديد" }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">اسم الدور</label>
            <input type="text" class="form-control" v-model="role.name" />
          </div>
          <div class="mb-3">
            <label class="form-label">تم الإنشاء في</label>
            <input type="date" class="form-control" v-model="role.create_at" />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('close')"
          >
            إلغاء
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="save"
            :disabled="!role.name"
          >
            حفظ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { Modal } from "bootstrap";

export default {
  name: "RoleModal",
  props: {
    isEditing: {
      type: Boolean,
      default: false,
    },
    currentRole: {
      type: Object,
      default: () => ({
        name: "",
        create_at: new Date().toISOString().split("T")[0],
      }),
    },
  },
  emits: ["save", "close"],
  setup(props, { emit }) {
    const modal = ref(null);
    const role = ref({ ...props.currentRole });

    watch(
      () => props.currentRole,
      (newValue) => {
        role.value = { ...newValue };
      },
      { deep: true }
    );

    const save = () => {
      if (!role.value.name.trim()) return;

      if (!role.value.create_at) {
        role.value.create_at = new Date().toISOString().split("T")[0];
      }

      emit("save", { ...role.value });
      emit("close");
    };

    onMounted(() => {
      const modalElement = document.getElementById("roleModal");
      if (modalElement) {
        modal.value = new Modal(modalElement);
      }
    });

    return {
      role,
      save,
    };
  },
};
</script>
