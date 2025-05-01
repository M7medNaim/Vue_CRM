<template>
  <div class="mt-4 pe-3 bg-white rounded-3 p-3 me-2">
    <EasyDataTable
      :headers="headers"
      :items="items"
      :rows-per-page="10"
      table-class-name="custom-table"
    >
      <!-- Id Column -->
      <template #item-id="item">
        <div class="text-muted fs-6">{{ item.id }}</div>
      </template>
      <!-- Role Name Column -->
      <template #item-description="item">
        <div class="fs-6">
          {{
            item.description.length > 50
              ? item.description.substring(0, 40) + "..."
              : item.description
          }}
        </div>
      </template>

      <!--  Create At Column -->
      <template #item-created_at="item">
        <div class="">
          <div class="fs-6">
            {{ new Date(item.created_at).toLocaleDateString() }}
          </div>
        </div>
      </template>

      <!-- Positions Column -->
      <template #item-positions="item">
        <div class="d-flex gap-2 my-1">
          <button
            class="btn btn-sm btn-success"
            v-show="!item.is_first"
            @click="updatePosition(item.id, -1)"
          >
            <i class="fas fa-arrow-up"></i>
          </button>
          <button
            class="btn btn-sm btn-warning"
            v-show="!item.is_last"
            @click="updatePosition(item.id, 1)"
          >
            <i class="fas fa-arrow-down"></i>
          </button>
        </div>
      </template>

      <!-- Actions Column -->
      <template #item-actions="item">
        <div class="d-flex gap-2 my-1">
          <button class="btn btn-sm btn-primary">
            <i class="fas fa-edit"></i>
          </button>
          <button
            class="btn btn-sm btn-danger"
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
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from "vue";
import EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import {
  getBroadcasts,
  updateBroadcastPosition,
} from "@/plugins/services/authService";

export default {
  name: "BroadcastSettings",
  components: {
    EasyDataTable,
  },
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    const items = ref([]);
    const headers = ref([
      { text: `#`, value: "id" },
      { text: t("settings-broadcast-table-description"), value: "description" },
      { text: t("settings-broadcast-table-createdat"), value: "created_at" },
      {
        text: t("settings-broadcast-table-actions"),
        value: "actions",
        sortable: false,
      },
      {
        text: t("settings-broadcast-table-positions"),
        value: "positions",
        sortable: false,
      },
    ]);
    const fetchBroadcasts = async () => {
      const response = await getBroadcasts();
      if (response.status === 200) {
        items.value = response.data.data;
        toast.success(response.data.message);
      } else {
        // Handle error response
        toast.error("Failed to fetch broadcasts");
      }
    };

    const updatePosition = async (id, direction) => {
      // Logic to update position
      const response = await updateBroadcastPosition(id, direction);
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchBroadcasts();
      } else {
        toast.error("Failed to update position");
      }
    };

    onMounted(() => {
      fetchBroadcasts();
    });

    onUnmounted(() => {
      // Clean up if necessary
    });

    return {
      t,
      items,
      fetchBroadcasts,
      headers,
      updatePosition,
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
