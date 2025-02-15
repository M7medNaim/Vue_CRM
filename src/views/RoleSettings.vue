<template>
  <div class="mt-4 pe-3 bg-white rounded-3 p-3 me-2">
    <!-- Search and Add Role Section -->
    <div class="row mb-3">
      <div class="col-6 col-md-4">
        <div class="position-relative inputSearch d-flex">
          <input
            type="text"
            class="form-control ps-5"
            placeholder="ابحث..."
            v-model="search"
          />
          <i
            class="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3"
          ></i>
        </div>
      </div>
      <div class="col-6 col-md-8">
        <div class="text-end">
          <button type="button" class="btn btn-primary" @click="openModal()">
            <span>إضافة دور جديد</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Roles Table -->
    <EasyDataTable
      :headers="headers"
      :items="filteredItems"
      :rows-per-page="10"
      :loading="isLoading"
      table-class-name="custom-table"
    >
      <!-- Role Name Column -->
      <template #item-name="item">
        <div class="fs-6">{{ item.name }}</div>
      </template>

      <!-- Permissions Column -->
      <template #item-permissions="item">
        <div class="d-flex flex-wrap gap-2">
          <span
            v-for="permission in item.permissions"
            :key="permission"
            class="badge bg-primary"
          >
            {{ permission }}
          </span>
        </div>
      </template>

      <!-- Actions Column -->
      <template #item-actions="item">
        <div class="d-flex gap-2 my-1">
          <button class="btn btn-sm btn-primary" @click="editRole(item)">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" @click="deleteRole(item.id)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </template>
    </EasyDataTable>

    <!-- استخدام كومبوننت المودال -->
    <RoleModal
      ref="roleModal"
      :is-editing="isEditing"
      :current-role="currentRole"
      :available-permissions="availablePermissions"
      @save="saveRole"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import { Modal } from "bootstrap";
import RoleModal from "@/components/modals/RoleSettings.vue";
// import {
//   updateRole,
//   createRole,
//   deleteRoleAPI,
//   getRoles,
// } from "@/plugins/services/authService";

export default {
  name: "RoleSettings",
  components: {
    EasyDataTable,
    RoleModal,
  },
  setup() {
    const search = ref("");
    const isLoading = ref(true);
    const items = ref([]);

    const staticRoles = [
      {
        id: 1,
        name: "Admin",
        permissions: [
          "إدارة المستخدمين",
          "إدارة الأدوار",
          "إدارة المحتوى",
          "إدارة الإعدادات",
          "إدارة المالية",
          "عرض التقارير",
        ],
      },
      {
        id: 4,
        name: "User",
        permissions: ["عرض المحتوى"],
      },
      {
        id: 5,
        name: "Sales",
        permissions: ["إدارة المالية", "عرض التقارير"],
      },
    ];

    const headers = [
      { text: "الدور", value: "name" },
      { text: "الصلاحيات", value: "permissions" },
      { text: "الإجراءات", value: "actions" },
    ];

    const loadData = async () => {
      isLoading.value = true;
      try {
        // const response = await getRoles()
        // items.value = response.data

        items.value = staticRoles;
      } catch (error) {
        console.error("Error loading roles:", error);
        items.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    const filteredItems = computed(() => {
      return items.value.filter((role) =>
        role.name.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    const isEditing = ref(false);
    const roleModal = ref(null);
    const currentRole = ref({
      name: "",
      permissions: [],
    });

    const availablePermissions = [
      "إدارة المستخدمين",
      "إدارة الأدوار",
      "إدارة الإعدادات",
      "إدارة المالية",
      "عرض المحتوى",
      "عرض التقارير",
    ];

    onMounted(() => {
      loadData();
      const modalElement = document.getElementById("roleModal");
      if (modalElement) {
        roleModal.value = new Modal(modalElement);
      }
    });

    const openModal = (role = null) => {
      if (role) {
        currentRole.value = { ...role };
        isEditing.value = true;
      } else {
        currentRole.value = { name: "", permissions: [] };
        isEditing.value = false;
      }
      roleModal.value?.show();
    };

    const saveRole = (role) => {
      if (isEditing.value) {
        const index = items.value.findIndex((r) => r.id === role.id);
        if (index !== -1) {
          items.value[index] = { ...role };
        }
      } else {
        const newId = Math.max(...items.value.map((r) => r.id), 0) + 1;
        items.value.push({
          id: newId,
          ...role,
        });
      }
    };

    const deleteRole = async (id) => {
      if (confirm("هل أنت متأكد من حذف هذا الدور؟")) {
        try {
          // await deleteRoleAPI(id)

          const index = items.value.findIndex((r) => r.id === id);
          if (index !== -1) {
            items.value.splice(index, 1);
          }
        } catch (error) {
          console.error("Error deleting role:", error);
        }
      }
    };

    const editRole = (role) => {
      openModal(role);
    };

    return {
      search,
      headers,
      filteredItems,
      isLoading,
      currentRole,
      isEditing,
      availablePermissions,
      openModal,
      saveRole,
      deleteRole,
      editRole,
      roleModal,
    };
  },
};
</script>

<style scoped>
.custom-table {
  border-radius: 10px;
  overflow: hidden;
}

.badge {
  font-size: 12px;
  padding: 5px 10px;
}

.hover-opacity-100:hover {
  opacity: 1 !important;
}

.transition {
  transition: opacity 0.3s;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
