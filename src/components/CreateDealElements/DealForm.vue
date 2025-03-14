<template>
  <div class="modal-body">
    <div class="row">
      <div class="col-12">
        <div class="mb-3">
          <label for="name" class="form-label">{{ t("modals.name") }}</label>
          <input
            type="text"
            class="form-control"
            id="userName"
            v-model="localFormData.contact.name"
            :placeholder="t('modals.name')"
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">{{ t("modals.email") }}</label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="localFormData.contact.email"
            :placeholder="t('modals.email')"
          />
        </div>
        <div class="mb-3">
          <label for="phone" class="form-label">{{ t("modals.phone") }}</label>
          <input
            type="text"
            class="form-control"
            id="phone"
            v-model="localFormData.contact.phones[0].phone"
            :placeholder="t('modals.phone')"
          />
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">{{
            t("modals.notes")
          }}</label>
          <input
            type="text"
            class="form-control"
            id="description"
            v-model="localFormData.description"
            :placeholder="t('modals.notes')"
          />
        </div>
        <div class="mb-3">
          <label for="source" class="form-label">{{
            t("modals.source")
          }}</label>
          <select
            class="form-select"
            id="source"
            v-model="localFormData.source"
          >
            <option value="" disabled selected>
              {{ t("modals.selectSource") }}
            </option>
            <option
              v-for="source in sources"
              :key="source.value"
              :value="source.value"
            >
              {{ source.label }}
            </option>
          </select>
        </div>
        <!-- <div class="mb-3">
          <label for="stage" class="form-label">Stage</label>
          <select
            class="form-select"
            id="stage"
            v-model="localFormData.stage_id"
          >
            <option value="" disabled selected>Select Stage</option>
            <option
              v-for="stage in stages"
              :key="stage.value"
              :value="stage.value"
            >
              {{ stage.label }}
            </option>
          </select>
        </div> -->
        <div class="mb-3">
          <label for="responsible" class="form-label">{{
            t("modals.responsiblePerson")
          }}</label>
          <select
            class="form-select"
            id="responsible"
            v-model="localFormData.responsible_id"
          >
            <option value="" disabled selected>
              {{ t("modals.selectResponsiblePerson") }}
            </option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <RatingStars v-model="localFormData.rating" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { getSources, getStages } from "@/plugins/services/authService";
import RatingStars from "@/components/CreateDealElements/RatingStars.vue";
import { useI18n } from "vue-i18n";
export default {
  name: "DealForm",
  components: {
    RatingStars,
  },
  props: {
    formData: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    // const users = ref([]);
    const localFormData = ref({
      ...props.formData,
      rating: props.formData.rating || 0,
    });
    const sources = ref([]);
    const stages = ref([]);
    const fetchSources = async () => {
      try {
        const response = await getSources();
        if (response.status === 200) {
          sources.value = response.data.data;
        } else {
          // alert("Failed to fetch sources");
        }
      } catch (error) {
        console.error("Error fetching sources:", error);
        // alert("Failed to fetch sources");
      }
    };

    const fetchStages = async () => {
      try {
        const response = await getStages();
        if (response.status === 200) {
          stages.value = response.data.data.map((stage) => ({
            value: stage.id,
            label: stage.name,
          }));
        }
      } catch (error) {
        console.error("Error fetching stages:", error);
      }
    };

    onMounted(() => {
      fetchSources();
      fetchStages();
    });
    watch(
      localFormData,
      (newValue) => {
        emit("update:formData", newValue);
      },
      { deep: true }
    );
    return {
      // users,
      localFormData,
      sources,
      stages,
      t,
    };
  },
};
</script>
