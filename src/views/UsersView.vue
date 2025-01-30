<template>
  <div class="mt-4 pe-3">
    <!-- حقل البحث -->
    <div class="row">
      <div class="col-6">
        <div class="mb-3 position-relative inputSearch">
          <input
            type="text"
            class="form-control w-50 ps-5"
            placeholder="ابحث..."
            v-model="search"
          />
          <i
            class="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3"
          ></i>
        </div>
      </div>
      <div class="col-6 mb-3">
        <div class="text-end">
          <button type="button" class="btn btn-primary" @click="openModal">
            إضافة مستخدم جديد
          </button>
        </div>
      </div>
    </div>

    <!-- الجدول -->
    <EasyDataTable
      :headers="headers"
      :items="filteredItems"
      :rows-per-page="10"
    >
      <template #item-profile="item">
        <div class="d-flex align-items-center py-3">
          <img
            :src="userImage || require('@/assets/default-user-image.jpg')"
            alt="User Image"
            class="rounded-circle me-3"
            style="width: 45px; height: 45px"
          />
          <div>
            <div class="fw-semibold fs-6">{{ item.name }}</div>
            <div class="text-muted">{{ item.email }}</div>
          </div>
        </div>
      </template>

      <template #item-emailVerified="item">
        <div class="form-check form-switch">
          <input
            class="form-check-input shadow-none"
            type="checkbox"
            role="switch"
            :checked="item.emailVerified"
            @change="toggleEmailVerified($event, item)"
            :class="{
              'red-switch': item.emailVerified,
              'red-switch-inactive': !item.emailVerified,
            }"
            style="width: 2.5rem; height: 1.3rem"
          />
        </div>
      </template>

      <template #item-status="item">
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            :checked="item.status === 'active'"
            @change="toggleStatus($event, item)"
            style="width: 2.5rem; height: 1.3rem"
          />
        </div>
      </template>

      <template #item-actions="item">
        <button @click="editItem(item)" class="btn btn-link p-0">
          <i class="fas fa-edit text-primary"></i>
        </button>
        <button
          @click="removeUser(item.id)"
          class="btn btn-link text-danger ps-2"
        >
          <i class="fas fa-trash"></i>
        </button>
      </template>
    </EasyDataTable>

    <AdminModal ref="adminModalRef" @user-updated="updateUserList" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import AdminModal from "@/components/modals/AdminForm.vue";
import {
  getUser,
  deleteUser,
  updateUser,
} from "@/plugins/services/authService";

export default {
  name: "UsersView",
  components: {
    EasyDataTable,
    AdminModal,
  },
  setup() {
    const headers = [
      { text: "المستخدمون:", value: "profile" },
      { text: "تم التحقق من البريد الإلكتروني", value: "emailVerified" },
      { text: "الحالة", value: "status" },
      { text: "عمل", value: "actions" },
    ];
    const items = ref([]);
    const search = ref("");

    const filteredItems = computed(() => {
      if (Array.isArray(items.value)) {
        return items.value.filter((item) => {
          const name = item.username || "";
          return name.toLowerCase().includes(search.value.toLowerCase());
        });
      }
      return [];
    });

    const fetchUsers = async () => {
      try {
        const response = await getUser();
        items.value = response.data.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const updateUserList = (updatedUser) => {
      const index = items.value.findIndex((u) => u.id === updatedUser.id);
      if (index !== -1) {
        items.value[index] = updatedUser;
      } else {
        items.value.push(updatedUser);
      }
    };

    const toggleEmailVerified = async (event, item) => {
      try {
        const newValue = event.target.checked;
        await updateUser(item.id, { emailVerified: newValue });
        item.emailVerified = newValue;
      } catch (error) {
        console.error("Update Email Verification Is Failed:", error);
      }
    };

    const toggleStatus = async (event, item) => {
      try {
        const newStatus = event.target.checked ? "active" : "inactive";
        await updateUser(item.id, { status: newStatus });
        item.status = newStatus;
      } catch (error) {
        console.error("Update Status Is Failed:", error);
      }
    };
    const openModal = () => {
      if (adminModalRef.value) {
        adminModalRef.value.openModal();
      }
    };
    const adminModalRef = ref(null);
    const editItem = (item) => {
      if (adminModalRef.value) {
        adminModalRef.value.openModal(item);
      }
    };

    const removeUser = async (id) => {
      try {
        await deleteUser(id);
        items.value = items.value.filter((user) => user.id !== id);
      } catch (error) {
        console.error("Delete User Is Failed:", error);
      }
    };

    onMounted(() => {
      fetchUsers();
    });

    return {
      headers,
      items,
      search,
      filteredItems,
      adminModalRef,
      updateUserList,
      toggleEmailVerified,
      toggleStatus,
      editItem,
      removeUser,
      openModal,
    };
  },
};
</script>

<style scoped>
.inputSearch input:focus {
  box-shadow: none;
  border: none;
}
</style>
