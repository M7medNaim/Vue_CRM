<template>
  <div>
    <button @click="editItem" class="btn btn-link p-0">
      <i class="fas fa-edit text-primary"></i>
    </button>
    <button @click="removeItem" class="btn btn-link text-danger ps-2">
      <i class="fas fa-trash"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: "UserViewActionButtons",
  props: {
    item: Object,
  },
  emits: ["edit", "remove"],
  methods: {
    editItem() {
      this.$emit("edit", this.item);
    },
    removeItem() {
      this.$emit("remove", this.item.id);
    },
  },
};
</script>
