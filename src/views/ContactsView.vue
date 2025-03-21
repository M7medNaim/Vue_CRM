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
    <Vue3EasyDataTable
      :headers="headers"
      :items="tableData"
      :server-items-length="totalRows"
      :loading="loading"
      :items-per-page="perPage"
      :current-page="currentPage"
      :sort-by="sortBy"
      :sort-type="sortType"
      :pagination-options="{
        enabled: true,
        position: 'bottom',
      }"
      @update:options="handleOptionsUpdate"
      table-class-name="custom-table"
    >
      <!-- Id Column -->
      <template #item-id="item">
        <div class="text-muted fs-6">{{ item.id }}</div>
      </template>

      <template #item-name="item">
        {{ item.name }}
      </template>

      <template #item-nickname="item">
        {{ item.nickname }}
      </template>

      <template #item-email="item">
        {{ item.email }}
      </template>

      <template #item-address="item">
        {{ item.address }}
      </template>

      <template #item-country="item">
        {{ item.country }}
      </template>

      <template #item-phones="item">
        {{ item.phones?.[0]?.phone || "-" }}
      </template>

      <template #item-actions="item">
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-primary" @click="editItem(item)">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" @click="removeContact(item.id)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </template>

      <!-- Loading template -->
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
    </Vue3EasyDataTable>

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
import Vue3EasyDataTable from "vue3-easy-data-table";
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
    Vue3EasyDataTable,
    CreateContact,
    FilterContact,
  },
  setup() {
    const { t } = useI18n();
    const toast = useToast();

    // Table state
    const tableData = ref([]);
    const loading = ref(false);
    const totalRows = ref(0);
    const currentPage = ref(1);
    const perPage = ref(10);
    const sortBy = ref("id");
    const sortType = ref("asc");

    const headers = [
      { text: "#", value: "id", sortable: true },
      {
        text: t("contacts-table-header-fullname"),
        value: "name",
        sortable: true,
      },
      {
        text: t("contacts-table-header-nickname"),
        value: "nickname",
        sortable: true,
      },
      {
        text: t("contacts-table-header-email"),
        value: "email",
        sortable: true,
      },
      {
        text: t("contacts-table-header-address"),
        value: "address",
        sortable: true,
      },
      {
        text: t("contacts-table-header-country"),
        value: "country",
        sortable: true,
      },
      { text: t("contacts-table-header-phone"), value: "phones" },
      { text: t("contacts-table-header-actions"), value: "actions" },
    ];

    // const loadingStore = useLoadingStore();
    const search = ref("");
    const contactCreateModalRef = ref(null);
    const filterModalRef = ref(null);

    // تصفية العناصر حسب البحث
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

    // تعديل دالة جلب البيانات
    const fetchTableData = async () => {
      loading.value = true;
      try {
        const response = await getContacts({
          page: currentPage.value,
          per_page: perPage.value,
          sort_by: sortBy.value,
          sort_type: sortType.value,
        });

        if (response?.data?.data) {
          tableData.value = response.data.data;
          totalRows.value = response.data.meta.total;
          console.log("Table Data Updated:", {
            items: tableData.value.length,
            total: totalRows.value,
            page: currentPage.value,
          });
        }
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
        toast.error(t("error.fetchFailed"));
      } finally {
        loading.value = false;
      }
    };

    // دالة معالجة تغييرات الجدول
    const handleOptionsUpdate = async (options) => {
      currentPage.value = options.page;
      perPage.value = options.itemsPerPage;
      sortBy.value = options.sortBy;
      sortType.value = options.sortType;
      await fetchTableData();
    };

    // تحديث القائمة
    const updateContactList = async () => {
      await fetchTableData();
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
          await fetchTableData();
          toast.success(t("success.deleteSuccess"));
        }
      } catch (error) {
        toast.error(t("error.deleteFailed"));
        console.error("Delete Contact Failed:", error);
      }
    };

    // تطبيق الفلاتر
    const applyFilters = async (filters) => {
      try {
        loading.value = true;
        const response = await getContacts(filters);
        if (response?.data?.data) {
          tableData.value = response.data.data;
        }
        toast.success(t("success.filterSuccess"));
      } catch (error) {
        toast.error(t("error.filterFailed"));
        console.error("Filter application failed:", error);
      } finally {
        loading.value = false;
      }
    };

    // إعادة تعيين الفلاتر
    const resetFilters = async () => {
      try {
        loading.value = true;
        await fetchTableData();
        toast.success(t("success.filterReset"));
      } catch (error) {
        toast.error(t("error.filterFailed"));
        console.error("Reset filters failed:", error);
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
      console.log("Component mounted");
      fetchTableData(); // جلب البيانات الأولية
      window.addEventListener("contextmenu", handleRightClick);
    });

    onUnmounted(() => {
      window.removeEventListener("contextmenu", handleRightClick);
    });

    // في بداية الـ setup
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

    return {
      headers,
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
      fetchTableData,
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

/* Add styles for sorted columns */
:deep(.sorted-asc),
:deep(.sorted-desc) {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Add hover effect on sortable columns */
:deep(.sortable):hover {
  background-color: rgba(0, 0, 0, 0.02);
  cursor: pointer;
}

/* إضافة ستايل للترقيم */
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
</style>
