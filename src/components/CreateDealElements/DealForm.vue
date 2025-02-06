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
            v-model="localFormData.name"
          />
        </div>
        <div class="mb-3">
          <label for="phone" class="form-label">Phone Number</label>
          <input
            type="text"
            class="form-control"
            id="phone"
            v-model="localFormData.phone"
          />
        </div>
        <div class="mb-3">
          <label for="note" class="form-label">Notes</label>
          <input
            type="text"
            class="form-control"
            id="note"
            v-model="localFormData.notes"
          />
        </div>
        <div class="mb-3">
          <label for="lastUpdated" class="form-label">Last Updated</label>
          <input
            type="date"
            class="form-control"
            id="lastUpdated"
            v-model="localFormData.lastUpdated"
          />
        </div>
        <div class="mb-3">
          <label for="source" class="form-label">Source</label>
          <input
            type="text"
            class="form-control"
            id="source"
            v-model="localFormData.source"
          />
        </div>
        <div class="mb-3">
          <label for="stage" class="form-label">Stage</label>
          <input
            type="text"
            class="form-control"
            id="stage"
            v-model="localFormData.stage"
          />
        </div>
        <div class="mb-3">
          <label for="responsablePerson" class="form-label"
            >Responsable Person</label
          >
          <input
            type="text"
            class="form-control"
            id="responsablePerson"
            v-model="localFormData.responsible"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DealForm",
  props: {
    formData: Object,
  },
  computed: {
    localFormData: {
      get() {
        return this.formData;
      },
      set(value) {
        this.$emit("update:formData", value);
      },
    },
  },
};
</script>
