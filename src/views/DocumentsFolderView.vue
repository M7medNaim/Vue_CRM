<template>
  <div class="mt-4 pe-3 bg-white rounded-3 p-3 me-2">
    <!-- Buttons Section -->
    <div class="row mb-3">
      <div class="col-12 text-end">
        <button class="btn btn-primary me-2" @click="openImportModal">
          {{ t("buttons.importFolder") }}
          <i class="fas fa-file-import me-1"></i>
        </button>
        <button class="btn btn-primary" @click="openNewFolderModal">
          {{ t("buttons.newFolder") }}
          <i class="fas fa-folder-plus me-1"></i>
        </button>
      </div>
    </div>

    <!-- Folders Table -->
    <!--  -->

    <EasyDataTable
      :headers="headers"
      :items="filteredItems"
      @click-row="handleRowClick"
      table-class-name="custom-table"
      :loading="tableLoading"
      :per-page="10"
    >
      <!-- Folder Name Column -->
      <template #item-name="item">
        <div class="d-flex align-items-center">
          <i class="fas fa-folder text-warning me-2"></i>
          <span class="text-decoration-none text-dark">
            {{ item.name }}
          </span>
        </div>
      </template>

      <!-- Created Date Column -->
      <template #item-created_at="item">
        <div class="text-muted">{{ item.created_at }}</div>
      </template>
      <template #item-files_count="item">
        <div class="text-muted fs-6 ps-3">{{ item.files_count }}</div>
      </template>

      <!-- Actions Column -->
      <template #item-actions="item">
        <div class="d-flex gap-2">
          <button
            class="btn btn-sm btn-primary"
            @click="editFolder(item)"
            title="Edit"
          >
            <i class="fas fa-edit"></i>
          </button>
          <button
            class="btn btn-sm btn-success"
            @click="downloadFolder(item.id)"
            title="Download"
          >
            <i class="fas fa-download"></i>
          </button>
          <button
            class="btn btn-sm btn-danger"
            @click="deleteFolder(item.id)"
            title="Delete"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </template>

      <!-- Loading Template -->
      <template #loading>
        <div class="text-center loading-container py-5">
          <div class="position-relative d-inline-block">
            <img
              src="../assets/new-nokta-logo.png"
              class="loading-logo"
              style="width: 50px; height: 50px"
            />
          </div>
          <div class="mt-2 text-primary">{{ t("tables.loading") }}</div>
        </div>
      </template>

      <!-- Empty State -->
      <template #empty>
        <div class="text-center py-5 text-muted">
          <i class="fas fa-folder-open mb-3" style="font-size: 48px"></i>
          <p>{{ t("tables.noFolders") }}</p>
        </div>
      </template>
    </EasyDataTable>
  </div>
  <!-- Add Modals -->
  <FolderForm :folder="selectedFolder" @submit="handleFolderSubmit" />

  <ImportFolder @import="handleFolderImport" />
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import EasyDataTable from "vue3-easy-data-table";
import FolderForm from "@/components/modals/FolderForm.vue";
import ImportFolder from "@/components/modals/ImportFolder.vue";
import Modal from "bootstrap/js/dist/modal";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n";
export default {
  name: "DocumentsFolderView",
  components: {
    EasyDataTable,
    FolderForm,
    ImportFolder,
  },
  setup() {
    const toast = useToast();
    const router = useRouter();
    const tableLoading = ref(false);
    const items = ref([]);
    const folderFormModal = ref(null);
    const importFolderModal = ref(null);
    const selectedFolder = ref(null);
    const { t } = useI18n();
    const headers = [
      { text: t("tables.name"), value: "name" },
      { text: t("tables.createdAt"), value: "created_at" },
      { text: t("tables.filesCount"), value: "files_count" },
      { text: t("tables.actions"), value: "actions" },
    ];

    const mockFolders = [
      {
        id: 1,
        name: "صور المنتجات",
        created_at: "2024-03-20",
        files_count: 4,
      },
      {
        id: 2,
        name: "فيديوهات المنتجات",
        created_at: "2024-03-19",
        files_count: 0,
      },
      {
        id: 3,
        name: "تقارير",
        created_at: "2024-03-18",
        files_count: 0,
      },
    ];

    const filteredItems = computed(() => items.value);

    const openNewFolderModal = () => {
      selectedFolder.value = null;
      folderFormModal.value.show();
    };

    const openImportModal = () => {
      importFolderModal.value.show();
    };

    const editFolder = (folder) => {
      selectedFolder.value = folder;
      folderFormModal.value.show();
    };

    const handleFolderSubmit = async (folderData) => {
      try {
        if (folderData.id) {
          const index = items.value.findIndex((f) => f.id === folderData.id);
          if (index !== -1) {
            items.value[index] = { ...items.value[index], ...folderData };
            toast.success(t("success.updated"), {
              timeout: 3000,
            });
          }
        } else {
          const newFolder = {
            id: Date.now(),
            name: folderData.name,
            created_at: new Date().toLocaleDateString("ar-EG"),
            files_count: 0,
          };
          items.value.unshift(newFolder);
          toast.success(t("success.saved"), {
            timeout: 3000,
          });
        }
        folderFormModal.value.hide();
      } catch (error) {
        toast.error(t("error.saveFailed"), {
          timeout: 3000,
        });
        console.error("Error submitting folder:", error);
      }
    };

    const handleFolderImport = async (files) => {
      try {
        console.log("Importing files:", files);
        importFolderModal.value.hide();
        toast.success(t("success.imported"), {
          timeout: 3000,
        });
      } catch (error) {
        toast.error(t("error.importFailed"), {
          timeout: 3000,
        });
        console.error("Error importing files:", error);
      }
    };

    const deleteFolder = async (id) => {
      try {
        const result = await Swal.fire({
          title: t("error.deleteTitle"),
          text: t("error.deleteText"),
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: t("success.deleteConfirm"),
          cancelButtonText: t("error.deleteCancel"),
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          items.value = items.value.filter((folder) => folder.id !== id);
          toast.success(t("success.deleteSuccess"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        toast.error(t("error.deleteFailed"), {
          timeout: 3000,
        });
        console.error("Error deleting folder:", error);
      }
    };

    const downloadFolder = async (folderId) => {
      try {
        console.log("Downloading folder:", folderId);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success(t("success.downloadStarted"), {
          timeout: 3000,
        });
      } catch (error) {
        toast.error(t("error.downloadFailed"), {
          timeout: 3000,
        });
        console.error("Error downloading folder:", error);
      }
    };

    const fetchFolders = async () => {
      try {
        tableLoading.value = true;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        items.value = mockFolders;
        //toast.success("تم تحميل المجلدات بنجاح", {
        //   timeout: 3000,
        //});
      } catch (error) {
        toast.error(t("error.fetchFailed"), {
          timeout: 3000,
        });
        console.error("Error fetching folders:", error);
      } finally {
        tableLoading.value = false;
      }
    };
    const handleRowClick = (item, event) => {
      if (event?.target?.closest("button")) {
        return;
      }
      router.push({
        name: "FolderFiles",
        params: { folderId: item.id },
      });
    };

    const handleRightClick = (event) => {
      event.preventDefault();
      const modalElements = document.querySelectorAll(".modal");
      modalElements.forEach((modal) => {
        if (modal.classList.contains("show")) {
          const closeButton = modal.querySelector('[data-bs-dismiss="modal"]');
          if (closeButton) {
            closeButton.click();
          }
        }
      });
    };

    onUnmounted(() => {
      window.removeEventListener("contextmenu", handleRightClick);
    });

    onMounted(async () => {
      await fetchFolders();
      folderFormModal.value = new Modal(
        document.getElementById("folderFormModal")
      );
      importFolderModal.value = new Modal(
        document.getElementById("importFolderModal")
      );
      window.addEventListener("contextmenu", handleRightClick);
    });

    return {
      headers,
      filteredItems,
      tableLoading,
      selectedFolder,
      openNewFolderModal,
      openImportModal,
      editFolder,
      deleteFolder,
      handleFolderSubmit,
      handleFolderImport,
      handleRowClick,
      downloadFolder,
      t,
    };
  },
};
</script>

<style scoped>
.loading-logo {
  animation: smooth-spin 2s infinite linear;
}

@keyframes smooth-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

:deep(.custom-table) {
  --easy-table-border: 1px solid #eff2f7;
  --easy-table-row-border: 1px solid #eff2f7;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.custom-table tbody tr) {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

:deep(.custom-table tbody tr:hover) {
  background-color: #f8f9fa;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
}

.actions button {
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.actions button:hover {
  opacity: 1;
}
</style>
