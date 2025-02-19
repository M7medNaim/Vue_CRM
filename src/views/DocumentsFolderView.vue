<template>
  <div class="mt-4 pe-3 bg-white rounded-3 p-3 me-2">
    <!-- Buttons Section -->
    <div class="row mb-3">
      <div class="col-12 text-end">
        <button class="btn btn-primary me-2" @click="openImportModal">
          استيراد مجلد
          <i class="fas fa-file-import me-1"></i>
        </button>
        <button class="btn btn-primary" @click="openNewFolderModal">
          مجلد جديد
          <i class="fas fa-folder-plus me-1"></i>
        </button>
      </div>
    </div>

    <!-- Folders Table -->
    <EasyDataTable
      :headers="headers"
      :items="filteredItems"
      :loading="tableLoading"
      @click-row="handleRowClick"
      table-class-name="custom-table"
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
            title="تعديل"
          >
            <i class="fas fa-edit"></i>
          </button>
          <button
            class="btn btn-sm btn-success"
            @click="downloadFolder(item.id)"
            title="تحميل"
          >
            <i class="fas fa-download"></i>
          </button>
          <button
            class="btn btn-sm btn-danger"
            @click="deleteFolder(item.id)"
            title="حذف"
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
          <div class="mt-2 text-primary">جاري التحميل...</div>
        </div>
      </template>

      <!-- Empty State -->
      <template #empty>
        <div class="text-center py-5 text-muted">
          <i class="fas fa-folder-open mb-3" style="font-size: 48px"></i>
          <p>لا توجد مجلدات</p>
        </div>
      </template>
    </EasyDataTable>
  </div>
  <!-- Add Modals -->
  <FolderForm :folder="selectedFolder" @submit="handleFolderSubmit" />

  <ImportFolder @import="handleFolderImport" />
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import EasyDataTable from "vue3-easy-data-table";
import { useLoadingStore } from "@/plugins/loadingStore";
import FolderForm from "@/components/modals/FolderForm.vue";
import ImportFolder from "@/components/modals/ImportFolder.vue";
import Modal from "bootstrap/js/dist/modal";

export default {
  name: "DocumentsFolderView",
  components: {
    EasyDataTable,
    FolderForm,
    ImportFolder,
  },
  setup() {
    const router = useRouter();
    const loadingStore = useLoadingStore();
    const tableLoading = ref(false);
    const items = ref([]);
    const folderFormModal = ref(null);
    const importFolderModal = ref(null);
    const selectedFolder = ref(null);

    const headers = [
      { text: "اسم المجلد", value: "name" },
      { text: "تاريخ الإنشاء", value: "created_at" },
      { text: "عدد الملفات", value: "files_count" },
      { text: "الإجراءات", value: "actions" },
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
        tableLoading.value = true;
        if (folderData.id) {
          const index = items.value.findIndex((f) => f.id === folderData.id);
          if (index !== -1) {
            items.value[index] = { ...items.value[index], ...folderData };
          }
        } else {
          const newFolder = {
            id: Date.now(),
            name: folderData.name,
            created_at: new Date().toLocaleDateString("ar-EG"),
            files_count: 0,
          };
          items.value.unshift(newFolder);
        }
        folderFormModal.value.hide();
      } finally {
        tableLoading.value = false;
      }
    };

    const handleFolderImport = async (files) => {
      try {
        tableLoading.value = true;
        console.log("Importing files:", files);
        importFolderModal.value.hide();
      } finally {
        tableLoading.value = false;
      }
    };

    const deleteFolder = async (id) => {
      if (confirm("هل أنت متأكد من حذف هذا المجلد؟")) {
        try {
          tableLoading.value = true;
          await new Promise((resolve) => setTimeout(resolve, 500));
          items.value = items.value.filter((folder) => folder.id !== id);
        } catch (error) {
          console.error("Error deleting folder:", error);
        } finally {
          tableLoading.value = false;
        }
      }
    };

    const downloadFolder = async (folderId) => {
      try {
        tableLoading.value = true;
        console.log("Downloading folder:", folderId);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert("تم بدء تحميل المجلد");
      } catch (error) {
        console.error("Error downloading folder:", error);
        alert("حدث خطأ أثناء تحميل المجلد");
      } finally {
        tableLoading.value = false;
      }
    };

    const fetchFolders = async () => {
      try {
        tableLoading.value = true;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        items.value = mockFolders;
      } catch (error) {
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

    onMounted(async () => {
      loadingStore.startLoading();
      await fetchFolders();
      loadingStore.stopLoading();

      folderFormModal.value = new Modal(
        document.getElementById("folderFormModal")
      );
      importFolderModal.value = new Modal(
        document.getElementById("importFolderModal")
      );
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
