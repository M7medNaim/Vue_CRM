<template>
  <div class="modal fade" id="folderFormModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{
              isEdit
                ? t("documents-modal-edit-heading")
                : t("documents-modal-createfolder-heading")
            }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="folderName" class="form-label">
                {{ t("documents-modal-createfolder-label-name") }}
              </label>
              <input
                type="text"
                class="form-control"
                id="folderName"
                v-model="folderName"
                :placeholder="
                  t('documents-modal-createfolder-placeholder-name')
                "
                required
              />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            {{ t("documents-modal-createfolder-button-close") }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="handleSubmit"
            :disabled="!folderName"
          >
            {{
              isEdit
                ? t("documents-modal-createfolder-button-submit")
                : t("documents-modal-createfolder-button-submit")
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

export default {
  name: "FolderFormModal",
  props: {
    folder: {
      type: Object,
      default: null,
    },
  },
  emits: ["submit"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const folderName = ref("");
    const isEdit = ref(false);

    watch(
      () => props.folder,
      (newFolder) => {
        if (newFolder) {
          folderName.value = newFolder.name;
          isEdit.value = true;
        } else {
          folderName.value = "";
          isEdit.value = false;
        }
      },
      { immediate: true }
    );

    const handleSubmit = () => {
      if (!folderName.value) return;

      const folderData = {
        name: folderName.value,
        ...(isEdit.value && props.folder ? { id: props.folder.id } : {}),
      };

      emit("submit", folderData);
      folderName.value = "";
    };

    return {
      folderName,
      isEdit,
      handleSubmit,
      t,
    };
  },
};
</script>
