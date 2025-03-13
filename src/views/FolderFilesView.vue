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
          {{ t("buttons.newFolder") }}
        </button>
        <button
          class="btn btn-primary d-flex justify-content-center align-items-center gap-2"
          @click="$router.back()"
        >
          <i class="fas fa-arrow-right pt-1"></i>
          <span>{{ t("buttons.back") }}</span>
        </button>
      </div>
    </div>
    <!-- Breadcrumbs -->
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li
          class="breadcrumb-item"
          v-for="(crumb, index) in breadcrumbs"
          :key="index"
        >
          <a
            v-if="index < breadcrumbs.length - 1"
            @click="navigateToCrumb(crumb.path)"
          >
            {{ crumb.name }}
          </a>
          <span v-else>{{ crumb.name }}</span>
        </li>
      </ol>
    </nav>
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
          {{ t("upload.dragAndDrop") }}
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
              title="Edit"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              class="btn btn-sm btn-success me-2"
              @click="downloadFolder(folder.id)"
              title="Download"
            >
              <i class="fas fa-download"></i>
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="deleteFolder(folder.id)"
              title="Delete"
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
              title="View"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              class="btn btn-sm btn-success me-2"
              @click="downloadFile(file)"
              title="Download"
            >
              <i class="fas fa-download"></i>
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="deleteFile(file.id)"
              title="Delete"
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
        <p>{{ t("tables.noFiles") }}</p>
      </div>
    </div>
  </div>
  <FolderForm :folder="selectedFolder" @submit="handleFolderSubmit" />
</template>

<script>
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import FolderForm from "@/components/modals/FolderForm.vue";
import Modal from "bootstrap/js/dist/modal";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n";
export default {
  name: "FolderFilesView",
  components: {
    FolderForm,
  },
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    const route = useRoute();
    const router = useRouter();
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
        const uploadedFiles = newFiles.map((file, index) => ({
          id: Date.now() + index,
          name: file.name,
          type: file.name.split(".").pop().toLowerCase(),
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          created_at: new Date().toLocaleDateString("ar-EG"),
          url: URL.createObjectURL(file),
        }));

        files.value = [...files.value, ...uploadedFiles];
        toast.success(t("success.uploaded"), {
          timeout: 3000,
        });
      } catch (error) {
        toast.error(t("error.uploadFailed"), {
          timeout: 3000,
        });
        console.error("Error uploading files:", error);
      }
    };

    const viewFile = (file) => {
      window.open(file.url, "_blank");
    };

    const downloadFile = async (file) => {
      try {
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

        toast.success(t("success.downloadStarted"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error downloading file:", error);
        toast.error(t("error.downloadFailed"), {
          timeout: 3000,
        });
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
          files.value = files.value.filter((file) => file.id !== fileId);
          toast.success(t("success.deleteSuccess"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        toast.error(t("error.deleteFailed"), {
          timeout: 3000,
        });
        console.error("Error deleting file:", error);
      }
    };

    const handleFolderSubmit = async (folderData) => {
      if (!folderData.name?.trim()) {
        toast.error(t("error.required"), {
          timeout: 3000,
        });
        return;
      }
      try {
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
            toast.success(t("success.updated"), {
              timeout: 3000,
            });
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
          toast.success(t("success.saved"), {
            timeout: 3000,
          });
        }

        folderFormModal.value.hide();
        selectedFolder.value = null;
      } catch (error) {
        console.error("Error handling folder:", error);
        toast.error(t("error.saveFailed"), {
          timeout: 3000,
        });
      }
    };

    const fetchFolderContents = async () => {
      try {
        const currentFolderId = route.params.folderId;

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockFoldersData = {
          1: {
            id: 1,
            name: "First Folder",
            files: [
              { id: 1, name: "File 1.pdf", type: "pdf" },
              { id: 2, name: "File 2.jpg", type: "image" },
            ],
            subFolders: [
              { id: 11, name: "Sub Folder 1", parentId: 1 },
              { id: 12, name: "Sub Folder 2", parentId: 1 },
            ],
          },
          11: {
            id: 11,
            name: "Sub Folder 1-1",
            files: [{ id: 3, name: "File 3.pdf", type: "pdf" }],
            subFolders: [{ id: 13, name: "Sub Folder 1-1", parentId: 11 }],
          },
        };

        const currentFolder = mockFoldersData[currentFolderId] || {
          id: currentFolderId,
          name: "New Folder",
          files: [],
          subFolders: [],
        };

        folderName.value = currentFolder.name;
        files.value = currentFolder.files || [];
        folders.value = currentFolder.subFolders || [];

        // toast.success("تم تحميل محتويات المجلد بنجاح", {
        //   timeout: 3000,
        // });
      } catch (error) {
        console.error("Error fetching folder contents:", error);
        toast.error(t("error.fetchFailed"), {
          timeout: 3000,
        });
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
        console.log("Downloading folder:", folderId);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success(t("success.downloadStarted"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error downloading folder:", error);
        toast.error(t("error.downloadFailed"), {
          timeout: 3000,
        });
      }
    };
    const deleteFolder = async (folderId) => {
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
          folders.value = folders.value.filter((f) => f.id !== folderId);
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

    const navigateToFolder = (folderId, event) => {
      if (event?.target?.closest("button")) {
        return;
      }
      router.push({
        name: "FolderFiles",
        params: { folderId: folderId.toString() },
      });
    };

    const breadcrumbs = computed(() => {
      const paths = route.path.split("/").filter(Boolean);
      return paths.map((path, index) => ({
        name: path.charAt(0).toUpperCase() + path.slice(1),
        path: "/" + paths.slice(0, index + 1).join("/"),
      }));
    });

    const navigateToCrumb = (path) => {
      router.push(path);
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

    // upload data
    onMounted(async () => {
      window.addEventListener("contextmenu", handleRightClick);
    });
    onUnmounted(() => {
      window.removeEventListener("contextmenu", handleRightClick);
    });

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
      breadcrumbs,
      navigateToCrumb,
      t,
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
