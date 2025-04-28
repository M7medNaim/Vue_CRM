<template>
  <div class="mt-4 pe-3 bg-white rounded-3 p-3 me-2">
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
          <div class="mt-2 text-primary">{{ $t("tables.loading") }}</div>
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
import { computed, onMounted, onUnmounted, ref } from "vue";
import EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import RoleModal from "@/components/modals/RoleSettings.vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { getBroadcasts } from "@/plugins/services/authService";

export default {
  name: "BroadcasrSettings",
  components: {
    EasyDataTable,
    RoleModal,
  },
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    const items = ref([]);
    const fetchBroadcasts = async () => {
      const response = await getBroadcasts();
      if (response.status === 200) {
        items.value = response.data.data;
        toast.success("Broadcasts fetched successfully");
      } else {
        // Handle error response
        toast.error("Failed to fetch broadcasts");
      }
      toast.info("Loading");
    };
    onMounted(() => {
      // Fetch roles when the component is mounted
      toast.info("Loading");
    });

    onUnmounted(() => {
      // Clean up if necessary
    });

    computed(() => {
      // Define the headers for the EasyDataTable
      return [
        { text: t("tables.id"), value: "id" },
        { text: t("tables.name"), value: "name" },
        { text: t("tables.create_at"), value: "create_at" },
        { text: t("tables.actions"), value: "actions", sortable: false },
      ];
    });

    return {
      t,
      items,
      fetchBroadcasts,
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
