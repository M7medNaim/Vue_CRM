<template>
  <div class="mt-4 pe-3 bg-white rounded-3 p-3 me-2">
    <!-- Search and Filter Section -->
    <div class="row">
      <div class="col-6 col-md-4">
        <div class="mb-3 position-relative inputSearch d-flex">
          <input
            type="text"
            class="form-control ps-5 rounded-end-0"
            :placeholder="t('contacts-placeholder-search')"
            v-model="search"
          />
          <i
            class="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3"
          ></i>
          <button
            :title="t('buttons.filter')"
            type="button"
            class="btn btn-primary me-2 rounded-start-0"
            @click="openFilterModal"
          >
            <i class="fas fa-filter"></i>
          </button>
        </div>
      </div>
      <div class="col-6 col-md-8 mb-3">
        <div class="text-end">
          <button type="button" class="btn btn-primary" @click="openModal">
            <span>{{ t("contacts-button-add") }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Contacts Table -->

    <EasyDataTable
      :headers="headers"
      :items="filteredItems"
      :rows-per-page="selectedPerPage"
      :loading="tableLoading"
      table-class-name="custom-table"
    >
      <!-- Contact Info Column -->
      <template #item-name="item">
        <div class="fs-6">{{ item.name }}</div>
      </template>
      <template #item-nickname="item">
        <div class="fs-6">{{ item.nickname }}</div>
      </template>

      <!-- Email Column -->
      <template #item-email="item">
        <div class="text-primary fs-6">{{ item.email }}</div>
      </template>
      <!-- Address Column -->
      <template #item-address="item">
        <div class="text-primary fs-6">{{ item.address }}</div>
      </template>
      <!-- Country Column -->
      <template #item-country="item">
        <div class="text-primary fs-6">{{ item.country }}</div>
      </template>

      <!-- Phone Column -->
      <template #item-phones="item">
        <div class="text-primary fs-6">
          {{
            item.phones && item.phones.length > 0 ? item.phones[0].phone : "-"
          }}
        </div>
      </template>

      <!-- Actions Column -->
      <template #item-actions="item">
        <div class="d-flex gap-2 my-1">
          <button class="btn btn-sm btn-primary" @click="editItem(item)">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" @click="removeContact(item.id)">
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
          <div class="mt-2 text-primary">{{ t("tables.loading") }}</div>
        </div>
      </template>
    </EasyDataTable>

    <!-- Modals -->
    <CreateContact
      ref="contactCreateModalRef"
      @contact-updated="updateContactList"
    />
    <FilterContact
      ref="filterModalRef"
      @apply-filters="applyFilters"
      @reset-filters="resetFilters"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import { getContacts, deleteContact } from "@/plugins/services/authService";
import CreateContact from "@/components/ContactModals/CreateContact.vue";
import FilterContact from "@/components/ContactModals/FilterContact.vue";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n";
// import { useLoadingStore } from "@/plugins/loadingStore";

export default {
  name: "ContactsView",
  components: {
    EasyDataTable,
    CreateContact,
    FilterContact,
  },
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    const headers = [
      { text: t("contacts-table-header-fullname"), value: "name" },
      { text: t("contacts-table-header-nickname"), value: "nickname" },
      { text: t("contacts-table-header-address"), value: "address" },
      { text: t("contacts-table-header-country"), value: "country" },
      { text: t("contacts-table-header-email"), value: "email" },
      { text: t("contacts-table-header-phone"), value: "phones" },
      { text: t("contacts-table-header-actions"), value: "actions" },
    ];
    // const loadingStore = useLoadingStore();
    const tableLoading = ref(false);
    const items = ref([]);
    const search = ref("");
    const selectedPerPage = ref("10");
    const contactCreateModalRef = ref(null);
    const filterModalRef = ref(null);

    // Filtered Items
    const filteredItems = computed(() => {
      const result = items.value.filter((item) => {
        const phoneNumber =
          item.phones && item.phones.length > 0 ? item.phones[0].phone : "";

        return (
          item.name.toLowerCase().includes(search.value.toLowerCase()) ||
          item.email.toLowerCase().includes(search.value.toLowerCase()) ||
          phoneNumber.includes(search.value)
        );
      });
      return result;
    });

    // Fetch Contacts
    const fetchContacts = async () => {
      try {
        tableLoading.value = true;
        const response = await getContacts();
        items.value = response.data.data;
        // toast.success("تم جلب جهات الاتصال بنجاح", {
        //   timeout: 3000,
        // });
      } catch (error) {
        // toast.error("فشل في جلب جهات الاتصال", {
        //   timeout: 3000,
        // });
        console.error("Error fetching contacts:", error);
      } finally {
        tableLoading.value = false;
      }
    };

    // Modal Functions
    const openModal = () => {
      if (contactCreateModalRef.value) {
        contactCreateModalRef.value.openModal();
      }
    };
    // open filter modal
    const openFilterModal = () => {
      if (filterModalRef.value) {
        filterModalRef.value.openFilterModal();
      }
    };
    // open edit modal
    const editItem = (item) => {
      if (contactCreateModalRef.value) {
        contactCreateModalRef.value.openModal(item);
      }
    };

    // Update Operations
    const updateContactList = (newContact) => {
      items.value = [...items.value, newContact];
    };

    // Delete Operations
    const removeContact = async (id) => {
      try {
        const result = await Swal.fire({
          title: t("contacts-alert-delete-title"),
          text: t("contacts-alert-delete-description"),
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: t("contacts-alert-delete-confirm"),
          cancelButtonText: t("contacts-alert-delete-cancel"),
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          await deleteContact(id);
          items.value = items.value.filter((contact) => contact.id !== id);
          toast.success(t("success.deleteSuccess"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        toast.error(t("error.deleteFailed"), {
          timeout: 3000,
        });
        console.error("Delete Contact Failed:", error);
      }
    };

    // Filter Functions
    const applyFilters = async (filters) => {
      try {
        // tableLoading.value = true;
        const formattedFilters = {
          ...filters,
          startDate: filters.startDate
            ? new Date(filters.startDate).toISOString()
            : "",
          endDate: filters.endDate
            ? new Date(filters.endDate).toISOString()
            : "",
        };
        const response = await getContacts(formattedFilters);
        if (response.data.success) {
          items.value = response.data.data;
          toast.success(t("success.filterSuccess"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        toast.error(t("error.filterFailed"), {
          timeout: 3000,
        });
        console.error("Filter application failed:", error);
      } finally {
        // tableLoading.value = false;
      }
    };

    // Reset Filters
    const resetFilters = async () => {
      try {
        // tableLoading.value = true;
        const response = await getContacts();
        if (response.data.success) {
          items.value = response.data.data;
          toast.success(t("success.filterReset"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        toast.error(t("error.filterFailed"), {
          timeout: 3000,
        });
        console.error("Reset filters failed:", error);
      } finally {
        // tableLoading.value = false;
      }
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

    onMounted(async () => {
      // loadingStore.startLoading();
      await fetchContacts();
      // loadingStore.stopLoading();

      window.addEventListener("contextmenu", handleRightClick);
    });

    onUnmounted(() => {
      window.removeEventListener("contextmenu", handleRightClick);
    });

    return {
      headers,
      items,
      search,
      selectedPerPage,
      filteredItems,
      contactCreateModalRef,
      filterModalRef,
      openModal,
      openFilterModal,
      editItem,
      removeContact,
      updateContactList,
      applyFilters,
      resetFilters,
      tableLoading,
      t,
    };
  },
};
</script>

<style scoped>
.inputSearch input:focus {
  box-shadow: none;
  border: 1px solid #333;
}
.fs-6 {
  font-size: 14px !important;
}
:deep(.custom-table) {
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
