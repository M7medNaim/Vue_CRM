<template>
  <div class="mt-4 pe-3">
    <!-- حقل البحث -->
    <div class="row">
      <div class="col-6">
        <div class="mb-3 position-relative">
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
        <!-- زر فتح المودال -->
        <div class="text-end">
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#adminModal"
            @click="openModal"
          >
            New Sales Representative
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
            :src="item.image"
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
        <button
          @click="editItem(item)"
          class="btn btn-link p-0"
          data-bs-toggle="modal"
          data-bs-target="#editModal"
        >
          <i class="fas fa-edit text-primary"></i>
        </button>
      </template>
    </EasyDataTable>

    <AdminModal @add-user="addNewUser" />
    <EditModal ref="editModal" @update-user="updateUser" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import AdminModal from "@/components/modals/AdminForm.vue";
import EditModal from "@/components/modals/EditAdminModal.vue";
// import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import { getUser } from "@/plugins/services/authService";

export default {
  // name: "SuperAdmin",
  name: "UsersView",
  components: {
    EasyDataTable,
    AdminModal,
    EditModal,
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
          const name = item.name || "";
          return name.toLowerCase().includes(search.value.toLowerCase());
        });
      }
      return [];
    });

    const fetchUsers = async () => {
      try {
        const response = await getUser();
        console.log(items);
        items.value = response.data.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const toggleEmailVerified = (event, item) => {
      item.emailVerified = event.target.checked;
    };

    const toggleStatus = (event, item) => {
      const newStatus = event.target.checked ? "active" : "inactive";
      item.status = newStatus;
    };

    const addNewUser = (newUser) => {
      const imageUrl = newUser.image
        ? URL.createObjectURL(newUser.image)
        : "/images/default-user.png";

      items.value.push({
        id: items.value.length + 1,
        name: newUser.username,
        email: newUser.email,
        image: imageUrl,
        status: newUser.status,
        emailVerified: newUser.emailVerified,
      });
    };
    const editModal = ref(null);
    const editItem = (item) => {
      if (editModal.value) {
        editModal.value.openModal(item);
      }
    };

    // const updateUser = (updatedUser) => {
    //   const index = items.value.findIndex((item) => item.id === updatedUser.id);
    //   if (index !== -1) {
    //     items.value[index] = { ...updatedUser };
    //   }
    // };
    onMounted(() => {
      fetchUsers();
    });

    return {
      headers,
      items,
      search,
      filteredItems,
      toggleEmailVerified,
      toggleStatus,
      addNewUser,
      // updateUser,
      editItem,
    };
  },
};
</script>

<style scoped></style>
