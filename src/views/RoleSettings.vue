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
      :loading="tableLoading"
      table-class-name="custom-table"
    >
      <!-- Id Column -->
      <template #item-id="item">
        <div class="text-muted fs-6">{{ item.id }}</div>
      </template>
      <!-- Role Name Column -->
      <template #item-name="item">
        <div class="fs-6">{{ item.name }}</div>
      </template>

      <!--  Create At Column -->
      <template #item-create_at="item">
        <div class="">
          <div class="fs-6">{{ item.create_at }}</div>
        </div>
      </template>

      <!-- Actions Column -->
      <template #item-actions="item">
        <div class="d-flex gap-2 my-1">
          <button class="btn btn-sm btn-primary" @click="editRole(item)">
            <i class="fas fa-edit"></i>
          </button>
          <button
            class="btn btn-sm btn-danger"
            @click="deleteRole(item.id)"
            :disabled="item.name === 'Admin'"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </template>
      <!-- Loading -->
      <template #loading>
        <div class="text-center loading-container">
          <div class="position-relative d-inline-block">
            <img
              src="../assets/new-nokta-logo.png"
              class="loading-logo"
              style="width: 50px; height: 50px"
            />
          </div>
          <div class="mt-2 text-primary">جاري التحميل...</div>
        </div>
      </template>
    </EasyDataTable>

    <RoleModal
      ref="roleModal"
      :is-editing="isEditing"
      :current-role="currentRole"
      :available-permissions="availablePermissions"
      @save="saveRole"
      @close="closeModal"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import { Modal } from "bootstrap";
import RoleModal from "@/components/modals/RoleSettings.vue";
import { useLoadingStore } from "@/plugins/loadingStore";
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
    const tableLoading = ref(false);
    const items = ref([]);
    const loadingStore = useLoadingStore();
    const staticRoles = [
      {
        id: 1,
        name: "Admin",
        permissions: [
          "إدارة المستخدمين",
          "إدارة الأدوار",
          "إدارة المحتوى",
          "إدارة الإعدادات",
          "عرض التقارير",
          "عرض المحتوى",
        ],
        create_at: "2024-03-20",
      },
      {
        id: 2,
        name: "User",
        permissions: ["إدارة المستخدمين"],
        create_at: "2024-03-20",
      },
      {
        id: 3,
        name: "Sales",
        permissions: ["عرض المحتوى"],
        create_at: "2024-03-20",
      },
    ];

    const headers = [
      { text: "#", value: "id" },
      { text: "الدور", value: "name" },
      { text: "تم الإنشاء في", value: "create_at" },
      { text: "الإجراءات", value: "actions" },
    ];

    const availablePermissions = [
      "إدارة المستخدمين",
      "إدارة الأدوار",
      "إدارة المحتوى",
      "إدارة الإعدادات",
      "عرض التقارير",
      "عرض المحتوى",
    ];

    const currentRole = ref({
      name: "",
      permissions: [],
      create_at: new Date().toISOString().split("T")[0],
    });

    const loadData = async () => {
      tableLoading.value = true;
      try {
        // const response = await getRoles()
        // items.value = response.data

        items.value = staticRoles;
      } catch (error) {
        console.error("Error loading roles:", error);
        items.value = [];
      } finally {
        tableLoading.value = false;
      }
    };

    const filteredItems = computed(() => {
      return items.value.filter((role) =>
        role.name.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    const isEditing = ref(false);
    const roleModal = ref(null);
    const modal = ref(null);

    onMounted(async () => {
      loadingStore.startLoading();
      await loadData();
      modal.value = new Modal(document.getElementById("roleModal"));
      loadingStore.stopLoading();
    });

    const openModal = (role = null) => {
      if (role) {
        currentRole.value = {
          ...role,
          permissions: [...role.permissions],
        };
        isEditing.value = true;
      } else {
        currentRole.value = {
          name: "",
          permissions: [],
          create_at: new Date().toISOString().split("T")[0],
        };
        isEditing.value = false;
      }
      modal.value?.show();
    };

    const saveRole = async (role) => {
      tableLoading.value = true;
      try {
        if (isEditing.value) {
          // await updateRole(role.id, role);
          const index = items.value.findIndex((r) => r.id === role.id);
          if (index !== -1) {
            items.value[index] = {
              ...items.value[index],
              ...role,
              permissions: [...role.permissions],
            };
          }
        } else {
          // const response = await createRole(role);
          const newId = Math.max(...items.value.map((r) => r.id), 0) + 1;
          items.value.push({
            id: newId,
            ...role,
            permissions: [...role.permissions],
          });
        }
        modal.value?.hide();
      } finally {
        tableLoading.value = false;
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

    const closeModal = () => {
      modal.value?.hide();
    };

    return {
      search,
      headers,
      filteredItems,
      tableLoading,
      currentRole,
      isEditing,
      availablePermissions,
      roleModal,
      openModal,
      saveRole,
      deleteRole,
      editRole,
      closeModal,
      loadData,
    };
  },
};
</script>

<style scoped>
.custom-table {
  border-radius: 10px;
  overflow: hidden;
}

.loading-logo {
  animation: pulse-and-spin 2s infinite linear;
  z-index: 2;
}

@keyframes pulse-and-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
