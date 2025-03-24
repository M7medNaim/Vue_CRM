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

    <!-- Updated Table Component -->
    <DataTable
      :value="rows"
      :paginator="true"
      :rows="rowsPerPage"
      :rowsPerPageOptions="[10, 25, 50]"
      :total-records="totalRows"
      :lazy="true"
      :onLazyLoad="loadCarsLazy"
      :loading="loading"
      @page="onPageChange"
    >
      <Column field="id" :header="'#'"></Column>
      <Column
        field="name"
        :header="t('contacts-table-header-fullname')"
      ></Column>
      <Column
        field="nickname"
        :header="t('contacts-table-header-nickname')"
      ></Column>
      <Column field="email" :header="t('contacts-table-header-email')"></Column>
      <Column
        field="address"
        :header="t('contacts-table-header-address')"
      ></Column>
      <Column
        field="country"
        :header="t('contacts-table-header-country')"
      ></Column>

      <!-- تخصيص عرض رقم الهاتف -->
      <Column :header="t('contacts-table-header-phone')">
        <template #body="slotProps">
          {{
            Array.isArray(slotProps.data.phones) && slotProps.data.phones.length
              ? slotProps.data.phones[0].phone
              : "N/A"
          }}
        </template>
      </Column>
      <Column :header="t('contacts-table-header-actions')">
        <template #body="slotProps">
          <div class="d-flex gap-2">
            <button
              class="btn btn-sm btn-primary"
              @click="editItem(slotProps.data)"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="removeContact(slotProps.data.id)"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </template>
      </Column>

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
    </DataTable>

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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
// import Vue3EasyDataTable from "vue3-easy-data-table";
// import "vue3-easy-data-table/dist/style.css";
import { getContacts, deleteContact } from "@/plugins/services/authService";
import CreateContact from "@/components/ContactModals/CreateContact.vue";
import FilterContact from "@/components/ContactModals/FilterContact.vue";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
// import { useLoadingStore } from "@/plugins/loadingStore";

export default {
  name: "ContactsView",
  components: {
    // Vue3EasyDataTable,
    CreateContact,
    FilterContact,
    DataTable,
    Column,
  },
  setup() {
    const { t } = useI18n();
    const toast = useToast();

    // Table state
    const tableData = ref([]);
    const loading = ref(false);
    const totalRows = ref(0);
    const currentPage = ref(1);
    const rowsPerPage = ref(10);
    const perPage = ref(10);
    const sortBy = ref("id");
    const sortType = ref("asc");
    const rows = ref([]);

    // const columns = [
    //   {
    //     title: "#",
    //     data: "id",
    //   },
    //   {
    //     title: t("contacts-table-header-fullname"),
    //     data: "name",
    //   },
    //   {
    //     title: t("contacts-table-header-nickname"),
    //     data: "nickname",
    //   },
    //   {
    //     title: t("contacts-table-header-email"),
    //     data: "email",
    //   },
    //   {
    //     title: t("contacts-table-header-address"),
    //     data: "address",
    //   },
    //   {
    //     title: t("contacts-table-header-country"),
    //     data: "country",
    //   },
    //   {
    //     title: t("contacts-table-header-phone"),
    //     data: "phones",
    //     body: (rowData) =>
    //       Array.isArray(rowData.phones) && rowData.phones.length
    //         ? rowData.phones[0].phone
    //         : "N/A",
    //   },
    // ];

    // Handle page change event
    const onPageChange = (event) => {
      currentPage.value = event.page;
      rowsPerPage.value = event.rows;
      fetchData(currentPage.value, rowsPerPage.value);
    };
    // const loadingStore = useLoadingStore();
    const search = ref("");
    const contactCreateModalRef = ref(null);
    const filterModalRef = ref(null);

    const filteredItems = computed(() => {
      if (!tableData.value || !Array.isArray(tableData.value)) return [];

      return tableData.value.filter((item) => {
        if (!item) return false;
        const searchLower = (search.value || "").toLowerCase();
        return (
          (item.name || "").toLowerCase().includes(searchLower) ||
          (item.email || "").toLowerCase().includes(searchLower) ||
          (item.nickname || "").toLowerCase().includes(searchLower)
        );
      });
    });

    // Fetch data from the server
    const fetchData = async (page, perPage) => {
      try {
        loading.value = true;
        const response = await getContacts({
          page: page + 1,
          per_page: perPage,
        });
        const data = response.data;
        console.log(data);
        // Update reactive variables with server data
        rows.value = data.data;
        totalRows.value = data.meta.total;
        loading.value = false;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        loading.value = false;
      }
    };

    // تعديل معالج تغييرات الجدول
    const handleOptionsUpdate = async (options) => {
      if (options.sortBy) {
        sortBy.value = options.sortBy;
        sortType.value = options.sortType;
        await fetchData();
      }
    };

    // تحديث القائمة
    const updateContactList = async () => {
      await refreshTable();
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
    const editItem = async (item) => {
      if (contactCreateModalRef.value) {
        contactCreateModalRef.value.openModal(item);
        await refreshTable();
      }
    };

    // حذف جهة اتصال
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
          await refreshTable();
          toast.success(t("success.deleteSuccess"));
        }
      } catch (error) {
        toast.error(t("error.deleteFailed"));
        console.error("Delete Contact Failed:", error);
      }
    };
    const refreshTable = async () => {
      loading.value = true;
      await fetchData(currentPage.value, rowsPerPage.value);
      loading.value = false;
    };
    // تطبيق الفلاتر
    const applyFilters = async (filters) => {
      try {
        loading.value = true;

        // التحقق من صحة التواريخ
        if (filters.created_at_from > filters.created_at_to) {
          toast.error(t("error.invalidDateRange"));
          return;
        }

        await fetchData(filters);
        toast.success(t("success.filterSuccess"));
      } catch (error) {
        console.error("Filter application failed:", error);
        toast.error(t("error.filterFailed"));
        tableData.value = [];
      } finally {
        loading.value = false;
      }
    };

    // إعادة تعيين الفلاتر
    const resetFilters = async () => {
      try {
        loading.value = true;
        tableData.value = [];
        await fetchData();
        toast.success(t("success.filterReset"));
      } catch (error) {
        console.error("Reset filters failed:", error);
        toast.error(t("error.filterFailed"));
      } finally {
        loading.value = false;
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

    onMounted(() => {
      fetchData(currentPage.value, rowsPerPage.value);
      window.addEventListener("contextmenu", handleRightClick);
    });
    onUnmounted(() => {
      window.removeEventListener("contextmenu", handleRightClick);
    });

    watch(
      tableData,
      (newValue) => {
        console.log("Items changed:", newValue);
      },
      { immediate: true, deep: true }
    );

    watch(
      filteredItems,
      (newFilteredItems) => {
        console.log("Filtered items:", {
          length: newFilteredItems?.length,
          items: newFilteredItems,
        });
      },
      { deep: true, immediate: true }
    );

    watch(search, () => {
      fetchData();
    });

    return {
      // headers,
      tableData,
      loading,
      search,
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
      t,
      totalRows,
      currentPage,
      perPage,
      sortBy,
      sortType,
      handleOptionsUpdate,
      fetchData,
      rows,
      rowsPerPage,
      // columns,
      onPageChange,
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

:deep(.sorted-asc),
:deep(.sorted-desc) {
  background-color: rgba(0, 0, 0, 0.05);
}

:deep(.sortable):hover {
  background-color: rgba(0, 0, 0, 0.02);
  cursor: pointer;
}

:deep(.pagination-container) {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.page-info) {
  font-size: 0.9rem;
  color: #666;
}

:deep(.p-datatable) {
  font-size: 14px;
}

:deep(.p-datatable th),
:deep(.p-datatable td) {
  padding: 8px;
}

:deep(.p-datatable thead th) {
  font-weight: bold;
  text-align: center;
}

:deep(.p-datatable tbody td) {
  text-align: left;
}
</style>
