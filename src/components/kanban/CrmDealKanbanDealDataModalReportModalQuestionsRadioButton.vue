<template>
  <div class="form-check">
    <input
      class="form-check-input bg-secondary-subtle p-2"
      type="radio"
      :value="choice.id"
      :selected="choice.id == answer_id"
    />
    <label class="form-check-label" for="35">{{ choice.value }}</label>
  </div>
</template>

<script>
export default {
  name: "RadioButton",
  props: {
    choice: {
      type: Object,
      required: true,
    },
    answers: {
      type: String,
      required: false,
    },
  },
  computed: {
    answer_id() {
      if (this.answers) {
        const answer = JSON.parse(this.answers);
        return answer[0].id;
      }
      return null;
    },
  },
  data() {
    return {
      selectedValue: null,
    };
  },
  methods: {
    // handleAgeChange(event)
  },
};
</script>
