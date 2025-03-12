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
    <!-- :loading="tableLoading" -->

    <EasyDataTable
      :headers="headers"
      :items="filteredItems"
      :rows-per-page="10"
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import { Modal } from "bootstrap";
import RoleModal from "@/components/modals/RoleSettings.vue";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
// import { useLoadingStore } from "@/plugins/loadingStore";
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
    const toast = useToast();
    const search = ref("");
    // const tableLoading = ref(false);
    const items = ref([]);
    // const loadingStore = useLoadingStore();
    const staticRoles = [
      {
        id: 1,
        name: "Admin",
        permissions: [
          "dashboard",
          "deals-kanban",
          "deals-list",
          "users",
          "contacts",
          "documents",
          "general-settings",
          "tasks-kanban",
          "roles-settings",
        ],
        create_at: "2024-03-20",
      },
      {
        id: 2,
        name: "User",
        permissions: [
          "dashboard",
          "deals-kanban",
          "deals-list",
          "users",
          "contacts",
          "documents",
          "general-settings",
          "tasks-kanban",
          "roles-settings",
        ],
        create_at: "2024-03-20",
      },
      {
        id: 3,
        name: "Sales",
        permissions: [
          "dashboard",
          "deals-kanban",
          "deals-list",
          "users",
          "contacts",
          "documents",
          "general-settings",
          "tasks-kanban",
          "roles-settings",
        ],
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
      "dashboard",
      "deals-kanban",
      "deals-list",
      "users",
      "contacts",
      "documents",
      "general-settings",
      "tasks-kanban",
      "roles-settings",
    ];

    const currentRole = ref({
      name: "",
      permissions: [],
      create_at: new Date().toISOString().split("T")[0],
    });

    const loadData = async () => {
      // tableLoading.value = true;
      try {
        // const response = await getRoles()
        // items.value = response.data

        items.value = staticRoles;
        // toast.success("تم تحميل الأدوار بنجاح", {
        //   timeout: 3000,
        // });
      } catch (error) {
        console.error("Error loading roles:", error);
        toast.error("حدث خطأ أثناء تحميل الأدوار", {
          timeout: 3000,
        });
        items.value = [];
      } finally {
        // tableLoading.value = false;
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

    const handleRightClick = (event) => {
      event.preventDefault();
      modal.value?.hide();
    };

    onMounted(async () => {
      // loadingStore.startLoading();
      await loadData();
      modal.value = new Modal(document.getElementById("roleModal"));
      // loadingStore.stopLoading();

      window.addEventListener("contextmenu", handleRightClick);
    });

    onUnmounted(() => {
      window.removeEventListener("contextmenu", handleRightClick);
    });

    const openModal = (role = null) => {
      try {
        if (role) {
          currentRole.value = {
            ...role,
            permissions: [...role.permissions],
          };
          isEditing.value = true;
          toast.info("يمكنك تعديل الدور الحالي", {
            timeout: 3000,
          });
        } else {
          currentRole.value = {
            name: "",
            permissions: [],
            create_at: new Date().toISOString().split("T")[0],
          };
          isEditing.value = false;
          toast.info("يمكنك إضافة دور جديد", {
            timeout: 3000,
          });
        }
        modal.value?.show();
      } catch (error) {
        console.error("Error opening modal:", error);
        toast.error("حدث خطأ أثناء فتح النافذة", {
          timeout: 3000,
        });
      }
    };

    const saveRole = async (role) => {
      try {
        if (!role.name?.trim()) {
          toast.error("اسم الدور مطلوب", {
            timeout: 3000,
          });
          return;
        }

        if (role.permissions.length === 0) {
          toast.error("يجب اختيار صلاحية واحدة على الأقل", {
            timeout: 3000,
          });
          return;
        }

        if (isEditing.value) {
          const index = items.value.findIndex((r) => r.id === role.id);
          if (index !== -1) {
            items.value[index] = {
              ...items.value[index],
              ...role,
              permissions: [...role.permissions],
            };
            toast.success("تم تحديث الدور بنجاح", {
              timeout: 3000,
            });
          }
        } else {
          const newId = Math.max(...items.value.map((r) => r.id), 0) + 1;
          items.value.push({
            id: newId,
            ...role,
            permissions: [...role.permissions],
          });
          toast.success("تم إضافة الدور بنجاح", {
            timeout: 3000,
          });
        }
        modal.value?.hide();
      } catch (error) {
        console.error("Error saving role:", error);
        toast.error("حدث خطأ أثناء حفظ الدور", {
          timeout: 3000,
        });
      }
    };

    const deleteRole = async (id) => {
      try {
        const result = await Swal.fire({
          title: "هل أنت متأكد؟",
          text: "لن تتمكن من استعادة هذا الدور بعد الحذف!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "نعم، قم بالحذف!",
          cancelButtonText: "إلغاء",
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          const index = items.value.findIndex((r) => r.id === id);
          if (index !== -1) {
            items.value.splice(index, 1);
            toast.success("تم حذف الدور بنجاح", {
              timeout: 3000,
            });
          }
        }
      } catch (error) {
        console.error("Error deleting role:", error);
        toast.error("حدث خطأ أثناء حذف الدور", {
          timeout: 3000,
        });
      }
    };

    const editRole = (role) => {
      if (role.name === "Admin") {
        toast.error("لا يمكن تعديل دور المسؤول", {
          timeout: 3000,
        });
        return;
      }
      openModal(role);
    };

    const closeModal = () => {
      modal.value?.hide();
    };

    return {
      search,
      headers,
      filteredItems,
      // tableLoading,
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
