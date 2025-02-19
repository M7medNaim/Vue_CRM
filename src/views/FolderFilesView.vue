<template>
  <div class="mt-4 pe-3 bg-white rounded-3 p-3 me-2">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <p class="fs-5 pt-1">{{ folderName }}</p>
      <div>
        <button
          class="btn btn-primary d-flex justify-content-center align-items-center gap-2"
          @click="$router.back()"
        >
          <i class="fas fa-arrow-right pt-1"></i>
          <span> رجوع</span>
        </button>
      </div>
      <!-- <div>
        <button class="btn btn-primary" @click="openUploadModal">
          <i class="fas fa-upload me-1"></i>
          رفع ملفات
        </button>
      </div> -->
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

    <!-- Files List -->
    <div class="files-list">
      <div
        v-for="file in files"
        :key="file.id"
        class="file-item p-3 border-bottom"
      >
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <i :class="getFileIcon(file.type)" class="me-2"></i>
            <span>{{ file.name }}</span>
            <!-- <small class="text-muted"
              >{{ file.size }} • {{ file.created_at }}</small
            > -->
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
      <div v-if="files.length === 0" class="text-center py-5 text-muted">
        <i class="fas fa-file mb-3" style="font-size: 48px"></i>
        <p>لا توجد ملفات في هذا المجلد</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useLoadingStore } from "@/plugins/loadingStore";

export default {
  name: "FolderFilesView",
  setup() {
    const route = useRoute();
    const loadingStore = useLoadingStore();
    const files = ref([]);
    const folderName = ref("");
    const fileInput = ref(null);

    const mockFoldersData = {
      1: {
        name: "صور المنتجات",
        files: [
          {
            id: 1,
            name: "شرح حقنة البلازما.pdf",
            type: "pdf",
            size: "2.5 MB",
            created_at: "2024-03-20",
            url: "/path/to/file1.pdf",
          },
          {
            id: 2,
            name: "صورة حقنة البلازما.jpg",
            type: "image",
            size: "1.8 MB",
            created_at: "2024-03-20",
            url: "/path/to/file2.jpg",
          },
        ],
      },
      2: {
        name: "فيديوهات المنتجات",
        files: [
          {
            id: 3,
            name: " تقرير مريض.xlsx",
            type: "excel",
            size: "500 KB",
            created_at: "2024-03-19",
            url: "/path/to/file3.xlsx",
          },
        ],
      },
    };

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

    const deleteFile = async (fileId) => {
      if (confirm("هل أنت متأكد من حذف هذا الملف؟")) {
        files.value = files.value.filter((file) => file.id !== fileId);
      }
    };

    const fetchFolderFiles = async () => {
      const folderId = route.params.folderId;
      try {
        loadingStore.startLoading();
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const folderData = mockFoldersData[folderId];
        if (folderData) {
          folderName.value = folderData.name;
          files.value = folderData.files;
        }
      } finally {
        loadingStore.stopLoading();
      }
    };

    onMounted(() => {
      fetchFolderFiles();
    });

    return {
      files,
      folderName,
      fileInput,
      handleClick,
      handleDrop,
      handleFileSelect,
      getFileIcon,
      viewFile,
      downloadFile,
      deleteFile,
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
</style>
