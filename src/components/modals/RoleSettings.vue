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
            @click="$emit('close')"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label required">اسم الدور</label>
            <input
              type="text"
              class="form-control"
              v-model="role.name"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label">تم الإنشاء في</label>
            <input type="date" class="form-control" v-model="role.create_at" />
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
        permissions: [],
        create_at: new Date().toISOString().split("T")[0],
      }),
    },
    availablePermissions: {
      type: Array,
      required: true,
      default: () => [
        "إدارة المستخدمين",
        "إدارة الأدوار",
        "إدارة المحتوى",
        "إدارة الإعدادات",
        "عرض التقارير",
        "عرض المحتوى",
      ],
    },
  },
  emits: ["save", "close"],
  setup(props, { emit }) {
    const modal = ref(null);
    const role = ref({ ...props.currentRole });

    watch(
      () => props.currentRole,
      (newValue) => {
        role.value = {
          ...newValue,
          permissions: newValue.permissions || [],
        };
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

<style scoped></style>
