<template>
  <div class="form-check">
    <input
      class="form-check-input bg-secondary-subtle p-2"
      type="checkbox"
      value="{{ choice.id }}"
      :checked="answer_included"
    />
    <label class="form-check-label" for="viagra25">{{ choice.value }}</label>
  </div>
</template>
<script>
export default {
  name: "CheckboxButton",
  props: {
    choice: {
      type: Object,
      required: true,
    },
    answers: {
      type: Array,
      required: true,
    },
  },
  computed: {
    answer_included() {
      if (this.answers) {
        return this.answers.some((answer) => answer.id == this.choice.id);
      }
      return false;
    },
  },
  data() {
    return {
      selectedValue: null,
      selectedViagraDosages: [],
    };
  },
};
</script>
