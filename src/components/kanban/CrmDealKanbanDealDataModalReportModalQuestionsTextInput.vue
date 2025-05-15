<template>
  <div class="form-text">
    <input
      type="text"
      :placeholder="t('modals.additionalNote')"
      class="note w-100 rounded-3 p-2"
      :value="local_answer"
    />
  </div>
</template>

<script>
export default {
  name: "TextInput",
  props: {
    t: {
      type: Function,
      required: true,
    },
    answers: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    local_answer() {
      return this.answers[0] || "";
    },
  },
  setup() {
    return {
      //   t,
    };
  },
};
</script>
