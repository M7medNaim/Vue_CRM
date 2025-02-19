<template>
  <div class="mt-4 pe-3 bg-white rounded-3 p-3 me-2">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex align-items-center">
        <i class="fas fa-folder text-warning me-2"></i>
        <p class="fs-5 pt-1 mb-0">{{ folderName }}</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-primary" @click="openNewFolderModal">
          <i class="fas fa-folder-plus me-1"></i>
          مجلد جديد
        </button>
        <button
          class="btn btn-primary d-flex justify-content-center align-items-center gap-2"
          @click="$router.back()"
        >
          <i class="fas fa-arrow-right pt-1"></i>
          <span>رجوع</span>
        </button>
      </div>
    </div>

    <!-- Upload Area -->
    <div class="upload-area mb-4 border rounded-3 p-4 text-center">
      <div
        class="dropzone"
        @dragover.prevent
        @drop.prevent="handleDrop"
        @click="handleClick"
      >
        <i
          class="fas fa-cloud-upload-alt mb-3 text-primary"
          style="font-size: 48px"
        ></i>
        <p class="text-muted mb-3">
          اسحب وأفلت الملفات هنا أو انقر في أي مكان للتحميل
        </p>
        <input
          type="file"
          multiple
          class="d-none"
          ref="fileInput"
          @change="handleFileSelect"
        />
      </div>
    </div>

    <!-- Files and Folders List -->
    <div class="files-list">
      <!-- Folders Section -->
      <div
        v-for="folder in folders"
        :key="folder.id"
        class="file-item p-3 border-bottom"
      >
        <div
          class="d-flex justify-content-between align-items-center cursor-pointer"
          @click="navigateToFolder(folder.id)"
        >
          <div class="d-flex align-items-center">
            <i class="fas fa-folder text-warning me-2"></i>
            <span>{{ folder.name }}</span>
          </div>
          <div class="actions">
            <button
              class="btn btn-sm btn-primary me-2"
              @click.stop="editFolder(folder)"
              title="تعديل"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              class="btn btn-sm btn-success me-2"
              @click="downloadFolder(folder.id)"
              title="تحميل"
            >
              <i class="fas fa-download"></i>
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="deleteFolder(folder.id)"
              title="حذف"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Files Section -->
      <div
        v-for="file in files"
        :key="file.id"
        class="file-item p-3 border-bottom"
      >
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <i :class="getFileIcon(file.type)" class="me-2"></i>
            <span>{{ file.name }}</span>
          </div>
          <div class="actions">
            <button
              class="btn btn-sm text-bg-primary me-2"
              @click="viewFile(file)"
              title="عرض"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              class="btn btn-sm btn-success me-2"
              @click="downloadFile(file)"
              title="تحميل"
            >
              <i class="fas fa-download"></i>
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="deleteFile(file.id)"
              title="حذف"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="folders.length === 0 && files.length === 0"
        class="text-center py-5 text-muted"
      >
        <i class="fas fa-folder-open mb-3" style="font-size: 48px"></i>
        <p>لا توجد ملفات أو مجلدات</p>
      </div>
    </div>
  </div>
  <FolderForm :folder="selectedFolder" @submit="handleFolderSubmit" />
</template>

<script>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLoadingStore } from "@/plugins/loadingStore";
import FolderForm from "@/components/modals/FolderForm.vue";
import Modal from "bootstrap/js/dist/modal";

export default {
  name: "FolderFilesView",
  components: {
    FolderForm,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const loadingStore = useLoadingStore();
    const files = ref([]);
    const folders = ref([]);
    const folderName = ref("");
    const fileInput = ref(null);
    const selectedFolder = ref(null);
    const folderFormModal = ref(null);

    const getFileIcon = (type) => {
      const icons = {
        pdf: "fas fa-file-pdf text-danger",
        image: "fas fa-file-image text-primary",
        excel: "fas fa-file-excel text-success",
        powerpoint: "fas fa-file-powerpoint text-warning",
        default: "fas fa-file text-secondary",
      };
      return icons[type] || icons.default;
    };

    const handleClick = (event) => {
      if (event.target.tagName !== "BUTTON") {
        fileInput.value.click();
      }
    };

    const handleDrop = (event) => {
      const droppedFiles = Array.from(event.dataTransfer.files);
      uploadFiles(droppedFiles);
    };

    const handleFileSelect = (event) => {
      const selectedFiles = Array.from(event.target.files);
      uploadFiles(selectedFiles);
    };

    const uploadFiles = async (newFiles) => {
      try {
        loadingStore.startLoading();
        const uploadedFiles = newFiles.map((file, index) => ({
          id: Date.now() + index,
          name: file.name,
          type: file.name.split(".").pop().toLowerCase(),
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          created_at: new Date().toLocaleDateString("ar-EG"),
          url: URL.createObjectURL(file),
        }));

        files.value = [...files.value, ...uploadedFiles];
      } finally {
        loadingStore.stopLoading();
      }
    };

    const viewFile = (file) => {
      window.open(file.url, "_blank");
    };

    const downloadFile = async (file) => {
      try {
        loadingStore.startLoading();

        const response = await fetch(file.url);
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading file:", error);
        alert("حدث خطأ أثناء تحميل الملف");
      } finally {
        loadingStore.stopLoading();
      }
    };
    const editFolder = (folder) => {
      selectedFolder.value = { ...folder };
      folderFormModal.value = new Modal(
        document.getElementById("folderFormModal")
      );
      folderFormModal.value.show();
    };
    const deleteFile = async (fileId) => {
      if (confirm("هل أنت متأكد من حذف هذا الملف؟")) {
        files.value = files.value.filter((file) => file.id !== fileId);
      }
    };

    const handleFolderSubmit = async (folderData) => {
      if (!folderData.name?.trim()) {
        alert("الرجاء إدخال اسم المجلد");
        return;
      }
      try {
        loadingStore.startLoading();
        const currentFolderId = route.params.folderId;

        if (selectedFolder.value) {
          const folderIndex = folders.value.findIndex(
            (f) => f.id === selectedFolder.value.id
          );
          if (folderIndex !== -1) {
            folders.value[folderIndex] = {
              ...folders.value[folderIndex],
              name: folderData.name,
              updated_at: new Date().toLocaleDateString("ar-EG"),
            };
          }
        } else {
          const newFolder = {
            id: Date.now(),
            name: folderData.name,
            parentId: currentFolderId,
            created_at: new Date().toLocaleDateString("ar-EG"),
            files: [],
          };
          folders.value.unshift(newFolder);
        }

        folderFormModal.value.hide();
        selectedFolder.value = null;
      } catch (error) {
        console.error("Error handling folder:", error);
        alert("حدث خطأ أثناء معالجة المجلد");
      } finally {
        loadingStore.stopLoading();
      }
    };

    const fetchFolderContents = async () => {
      try {
        loadingStore.startLoading();
        const currentFolderId = route.params.folderId;

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockFoldersData = {
          1: {
            id: 1,
            name: "المجلد الأول",
            files: [
              { id: 1, name: "ملف 1.pdf", type: "pdf" },
              { id: 2, name: "ملف 2.jpg", type: "image" },
            ],
            subFolders: [
              { id: 11, name: "مجلد فرعي 1", parentId: 1 },
              { id: 12, name: "مجلد فرعي 2", parentId: 1 },
            ],
          },
          11: {
            id: 11,
            name: "مجلد فرعي 1-1",
            files: [{ id: 3, name: "ملف 3.pdf", type: "pdf" }],
            subFolders: [{ id: 13, name: "مجلد فرعي 1-1", parentId: 11 }],
          },
        };

        const currentFolder = mockFoldersData[currentFolderId] || {
          id: currentFolderId,
          name: "مجلد جديد",
          files: [],
          subFolders: [],
        };

        folderName.value = currentFolder.name;
        files.value = currentFolder.files || [];
        folders.value = currentFolder.subFolders || [];

        console.log("Loaded folder:", currentFolder.name);
        console.log("Files:", files.value.length);
        console.log("Subfolders:", folders.value.length);
      } catch (error) {
        console.error("Error fetching folder contents:", error);
        alert("حدث خطأ أثناء تحميل محتويات المجلد");
      } finally {
        loadingStore.stopLoading();
      }
    };

    const openNewFolderModal = () => {
      selectedFolder.value = null;
      folderFormModal.value = new Modal(
        document.getElementById("folderFormModal")
      );
      folderFormModal.value.show();
    };
    const downloadFolder = async (folderId) => {
      try {
        loadingStore.startLoading();
        console.log("Downloading folder:", folderId);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert("تم بدء تحميل المجلد");
      } catch (error) {
        console.error("Error downloading folder:", error);
        alert("حدث خطأ أثناء تحميل المجلد");
      } finally {
        loadingStore.stopLoading();
      }
    };
    const deleteFolder = async (folderId) => {
      if (confirm("هل أنت متأكد من حذف هذا المجلد؟")) {
        folders.value = folders.value.filter((f) => f.id !== folderId);
      }
    };

    const navigateToFolder = (folderId, event) => {
      if (event?.target?.closest("button")) {
        return;
      }
      router.push({
        name: "FolderFiles",
        params: { folderId: folderId.toString() },
      });
    };

    watch(
      () => route.params.folderId,
      (newFolderId) => {
        if (newFolderId) {
          fetchFolderContents();
        }
      },
      { immediate: true }
    );

    return {
      files,
      folders,
      folderName,
      fileInput,
      selectedFolder,
      openNewFolderModal,
      handleFolderSubmit,
      deleteFolder,
      getFileIcon,
      viewFile,
      downloadFile,
      handleFileSelect,
      handleDrop,
      handleClick,
      deleteFile,
      editFolder,
      navigateToFolder,
      downloadFolder,
    };
  },
};
</script>

<style scoped>
.dropzone {
  border: 2px dashed #ccc;
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.dropzone:hover {
  border-color: #0d6efd;
  background: #f1f8ff;
}

.dropzone * {
  pointer-events: none;
}

.file-item {
  transition: background-color 0.2s ease;
}

.file-item:hover {
  background-color: #f8f9fa;
}

.actions button {
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.actions button:hover {
  opacity: 1;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  text-decoration: underline;
}
</style>
