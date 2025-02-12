<template>
  <div class="modal-body">
    <div class="row">
      <div class="col-12">
        <div class="mb-3">
          <label for="file" class="form-label">File</label>
          <input
            type="file"
            class="form-control"
            id="file"
            @change="handleFileChange"
            accept=".xlsx,.xls,.csv"
          />
          <small class="text-muted">
            Allowed file types: .xlsx, .xls, .csv
          </small>
          <div v-if="fileError" class="text-danger mt-1">
            {{ fileError }}
          </div>
        </div>
      </div>
      <div v-if="isFileValid" class="chooseHeader">
        <div class="col-12">
          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <select v-model="description" class="text-secondary form-select">
              <option value="" disabled selected>Select a header</option>
              <option
                v-for="option in options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-12">
          <div class="mb-3">
            <label for="source" class="form-label">Source</label>
            <select v-model="source" class="text-secondary form-select">
              <option value="" disabled selected>Any</option>
              <option
                v-for="source in sources"
                :key="source.id"
                :value="source.id"
              >
                {{ source.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-12">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <select v-model="name" class="text-secondary form-select">
              <option value="" disabled selected>Select a header</option>
              <option
                v-for="option in options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-12">
          <div class="mb-3">
            <label for="date_of_birth" class="form-label">Date of Birth</label>
            <select v-model="dateOfBirth" class="text-secondary form-select">
              <option value="" disabled selected>Select a header</option>
              <!-- <option
                v-for="option in options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option> -->
            </select>
          </div>
        </div>
        <div class="col-12">
          <div class="mb-3">
            <label for="phone" class="form-label">Phone</label>
            <select v-model="phone" class="text-secondary form-select">
              <option value="" disabled selected>Select a header</option>
              <option
                v-for="option in options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-12">
          <div class="mb-3">
            <label for="comment" class="form-label">Comments</label>
            <select v-model="comment" class="text-secondary form-select">
              <option value="" disabled selected>Select a header</option>
              <option
                v-for="option in options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-12">
          <div class="mb-3">
            <label for="address" class="form-label">Address</label>
            <select v-model="address" class="text-secondary form-select">
              <option value="" disabled selected>Select a header</option>
              <option
                v-for="option in options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-12">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <select v-model="email" class="text-secondary form-select">
              <option value="" disabled selected>Select a header</option>
              <option
                v-for="option in options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getSources } from "@/plugins/services/authService";

export default {
  name: "ImportForm",
  setup() {
    const fileError = ref("");
    const isFileValid = ref(false);
    const sources = ref([]);
    const source = ref("");
    const name = ref("");
    const description = ref("");
    const dateOfBirth = ref("");
    const phone = ref("");
    const comment = ref("");
    const address = ref("");
    const email = ref("");
    const options = [
      { value: "date", label: "التاريخ" },
      { value: "product", label: "المنتج" },
      { value: "quantity", label: "الكمية" },
      { value: "unit_price", label: "سعر الوحدة" },
      { value: "total_price", label: "التكلفة" },
      { value: "total_sales", label: "إجمالي المبيعات" },
      { value: "total_cost", label: "إجمالي التكلفة" },
      { value: "net_profit", label: "صافي الربح" },
    ];
    const fetchSources = async () => {
      try {
        const response = await getSources();
        if (response.status === 200) {
          sources.value = response.data.data;
        }
      } catch (error) {
        console.error("Error fetching sources:", error);
      }
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const allowedTypes = [
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/csv",
        ];

        if (!allowedTypes.includes(file.type)) {
          fileError.value = "Please select only Excel or CSV files";
          event.target.value = "";
          isFileValid.value = false;
          return;
        }

        const fileName = file.name.toLowerCase();
        if (
          !fileName.endsWith(".xlsx") &&
          !fileName.endsWith(".xls") &&
          !fileName.endsWith(".csv")
        ) {
          fileError.value = "Please select only Excel or CSV files";
          event.target.value = "";
          isFileValid.value = false;
          return;
        }

        fileError.value = "";
        isFileValid.value = true;
      }
    };

    onMounted(() => {
      fetchSources();
    });

    return {
      fileError,
      isFileValid,
      sources,
      options,
      source,
      name,
      description,
      dateOfBirth,
      phone,
      comment,
      address,
      email,
      handleFileChange,
    };
  },
};
</script>

<style scoped>
.chooseHeader {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
