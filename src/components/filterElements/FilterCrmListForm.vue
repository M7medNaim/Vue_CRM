<template>
  <div class="modal-body">
    <div class="row">
      <div class="col-12">
        <!-- Status Filter -->
        <div class="row">
          <div class="col-3 pt-2">
            <span>{{ t("crmlist-modal-filter-label-status") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3 d-flex justify-content-center flex-nowrap gap-2">
              <button
                v-for="status in statuses"
                :key="status.value"
                type="button"
                class="p-2"
                @click.prevent="toggleStatus(status.value)"
                :class="[
                  'btn',
                  selectedStatuses.includes(status.value)
                    ? 'btn-dark'
                    : 'btn-outline-dark',
                ]"
                style="font-size: 14px"
              >
                {{ status.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Source Filter -->
        <div class="row">
          <div class="col-3 pt-2">
            <span>{{ t("crmlist-modal-filter-label-source") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localFilters.source_id"
                class="form-select text-secondary"
              >
                <option
                  v-for="source in sources"
                  :key="source.value"
                  :value="source.value"
                >
                  {{ source.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <!-- Stage Filter -->
        <div class="row">
          <div class="col-3 pt-2">
            <span>{{ t("crmlist-modal-filter-label-stage") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localFilters.stage_id"
                class="form-select text-secondary"
              >
                <option
                  v-for="stage in stages"
                  :key="stage.value"
                  :value="stage.value"
                >
                  {{ stage.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Supervisor Filter -->
        <div class="row">
          <div class="col-3 pt-2">
            <span>{{ t("modals.supervisor") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localFilters.user_id"
                class="form-select text-secondary"
              >
                <option
                  v-for="user in users"
                  :key="user.value"
                  :value="user.value"
                >
                  {{ user.label }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Package Filter -->
        <!-- <div class="row">
          <div class="col-3 pt-2">
            <span>{{ t("crmlist-modal-filter-label-packages") }}</span>
          </div>
          <div class="col-9">
            <div class="mb-3">
              <select
                v-model="localFilters.package"
                class="form-select text-secondary"
              >
                <option
                  v-for="pkg in packages"
                  :key="pkg.value"
                  :value="pkg.value"
                >
                  {{ pkg.label }}
                </option>
              </select>
            </div>
          </div>
        </div> -->

        <!-- Created Date Range -->
        <div class="row mb-3">
          <div class="col-3">
            <span>{{ t("crmlist-modal-filter-label-created-at") }}</span>
          </div>
          <div
            class="col-9 d-flex justify-content-center align-items-center gap-3"
          >
            <input
              type="date"
              class="form-control text-secondary"
              v-model="localFilters.created_at_start"
            />
            <input
              type="date"
              class="form-control text-secondary"
              v-model="localFilters.created_at_end"
            />
          </div>
        </div>

        <!-- Modified Date Range -->
        <div class="row mb-3">
          <div class="col-3">
            <span>{{ t("crmlist-modal-filter-label-updated-at") }}</span>
          </div>
          <div
            class="col-9 d-flex justify-content-center align-items-center gap-3"
          >
            <input
              type="date"
              class="form-control text-secondary"
              v-model="localFilters.updated_at_start"
            />
            <input
              type="date"
              class="form-control text-secondary"
              v-model="localFilters.updated_at_end"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

export default {
  name: "FilterCrmListFormVue",
  props: {
    filters: { type: Object, required: true },
    selectedStatuses: {
      type: Array,
      required: true,
    },
    stages: {
      type: Array,
      default: () => [],
    },
    sources: {
      type: Array,
      default: () => [],
    },
    users: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:filters", "update:selectedStatuses"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const localFilters = ref({
      source: "",
      stage: "",
      supervisor: "",
      representative: "",
      package: "",
      createdStart: "",
      createdEnd: "",
      modifiedStart: "",
      modifiedEnd: "",
      status: [],
      ...props.filters,
    });
    const local_stages = ref([]);
    const local_sources = ref([]);
    const local_company = ref([]);
    const local_supervisors = ref([]);
    const local_representatives = ref([]);
    const local_packages = ref([]);

    const statuses = ref([
      { value: "unassigned", label: "Unassigned" },
      { value: "no_comments", label: "No Comments" },
      { value: "no_task", label: "No Task" },
      { value: "overdue", label: "Overdue" },
      { value: "new", label: "New" },
      { value: "reclaimed", label: "Reclaimed" },
    ]);

    const toggleStatus = (status) => {
      let newSelectedStatuses;
      if (props.selectedStatuses.includes(status)) {
        newSelectedStatuses = props.selectedStatuses.filter(
          (s) => s !== status
        );
      } else {
        newSelectedStatuses = [...props.selectedStatuses, status];
      }
      emit("update:selectedStatuses", newSelectedStatuses);

      // Update local filters with status
      localFilters.value.status = newSelectedStatuses;
      emit("update:filters", localFilters.value);
    };

    // Watch for all filter changes
    watch(
      () => localFilters.value,
      (newFilters) => {
        console.log("Filters changed:", newFilters);
        emit("update:filters", newFilters);
      },
      { deep: true }
    );

    watch(
      () => props.stages,
      (newStages) => {
        local_stages.value = newStages;
        console.log("form local_stages", local_stages.value);
      },
      { deep: true }
    );

    watch(
      () => props.sources,
      (newSources) => {
        local_sources.value = newSources;
        console.log("form local_sources", local_sources.value);
      },
      { deep: true }
    );

    watch(
      () => props.users,
      (newUsers) => {
        console.log("form new users", newUsers);
        local_company.value = newUsers.filter(
          (user) => user.role === "company"
        );
        local_supervisors.value = newUsers.filter(
          (user) => user.role === "supervisor"
        );
        local_representatives.value = newUsers.filter(
          (user) => user.role === "sales"
        );
      },
      { deep: true }
    );

    watch(
      () => props.packages,
      (newPackages) => {
        local_packages.value = newPackages;
        console.log("form local_packages", local_packages.value);
      },
      { deep: true }
    );

    return {
      localFilters,
      statuses,
      local_stages,
      local_sources,
      toggleStatus,
      t,
      supervisors: [
        { value: "any", label: "Any" },
        { value: "eurasia", label: "Eurasia Admin" },
        { value: "sup", label: "Sup Sup" },
      ],
      representatives: [
        { value: "any", label: "Any" },
        { value: "bader", label: "Bader Rep" },
        { value: "reem", label: "Reem Rep" },
      ],
      packages: [
        { value: "any", label: "Any" },
        { value: "basic", label: "Basic Package" },
        { value: "premium", label: "Premium Package" },
      ],
    };
  },
};
</script>

<style scoped>
span {
  font-size: 14px;
}
</style>
