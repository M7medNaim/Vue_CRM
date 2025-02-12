<template>
  <div class="modal-body">
    <div class="row">
      <div class="col-12">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input
            type="text"
            class="form-control"
            id="userName"
            v-model="localFormData.contact.name"
            placeholder="ادخل الاسم"
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="localFormData.contact.email"
            placeholder="Enter email"
          />
        </div>
        <div class="mb-3">
          <label for="phone" class="form-label">Phone Number</label>
          <input
            type="text"
            class="form-control"
            id="phone"
            v-model="localFormData.contact.phones[0].phone"
            placeholder="ادخل رقم الهاتف"
          />
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Notes</label>
          <input
            type="text"
            class="form-control"
            id="description"
            v-model="localFormData.description"
            placeholder="ادخل الملاحظات"
          />
        </div>
        <div class="mb-3">
          <label for="source" class="form-label">Source</label>
          <select
            class="form-select"
            id="source"
            v-model="localFormData.source"
          >
            <option value="" disabled selected>Select Source</option>
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
          <label for="responsible" class="form-label">Responsible Person</label>
          <select
            class="form-select"
            id="responsible"
            v-model="localFormData.responsible_id"
          >
            <option value="" disabled selected>
              Select Responsible Person
            </option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label for="rating" class="form-label">Rating</label>
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
    };
  },
};
</script>
