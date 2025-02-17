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
            <label class="form-label">الصلاحيات</label>
            <div class="row">
              <div
                class="col-md-4 mb-2"
                v-for="perm in availablePermissions"
                :key="perm"
              >
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :value="perm"
                    v-model="role.permissions"
                  />
                  <label class="form-check-label">{{ perm }}</label>
                </div>
              </div>
            </div>
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
          <button type="button" class="btn btn-primary" @click="save">
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
        permissions: [],
      }),
    },
    availablePermissions: {
      type: Array,
      default: () => [],
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

    const show = () => {
      modal.value?.show();
    };

    const save = () => {
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
      show,
      save,
    };
  },
};
</script>
