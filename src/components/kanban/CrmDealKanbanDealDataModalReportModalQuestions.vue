<template>
  <div class="question bg-light ps-2 py-2 mb-2">
    <p class="fw-medium">{{ local_question.question }}</p>
    <span v-if="local_question.type == 'radio'">
      <RadioButton
        v-for="(choice, index) in local_question.choices"
        :key="index"
        :choice="choice"
        :answers="local_question.answers"
      />
    </span>
    <span v-else-if="local_question.type == 'checkbox'">
      <CheckboxButton
        v-for="(choice, index) in local_question.choices"
        :key="index"
        :choice="choice"
        :answers="local_question.answers"
      />
    </span>
    <span v-else-if="local_question.type == 'text'">
      <TextInput :answers="local_question.answers" :t="t" />
    </span>
  </div>
</template>

<script>
import RadioButton from "./CrmDealKanbanDealDataModalReportModalQuestionsRadioButton.vue";
import CheckboxButton from "./CrmDealKanbanDealDataModalReportModalQuestionsCheckbox.vue";
import TextInput from "./CrmDealKanbanDealDataModalReportModalQuestionsTextInput.vue";
// import TextArea from "./CrmDealKanbanDealDataModalReportModalQuestionsTextArea.vue";
// import DateInput from "./CrmDealKanbanDealDataModalReportModalQuestionsDateInput.vue";
// import NumberInput from "./CrmDealKanbanDealDataModalReportModalQuestionsNumberInput.vue";
// import SelectInput from "./CrmDealKanbanDealDataModalReportModalQuestionsSelectInput.vue";
export default {
  name: "QuestionsDiv",
  components: {
    RadioButton,
    CheckboxButton,
    TextInput,
    // TextArea,
    // DateInput,
    // NumberInput,
    // SelectInput,
  },
  props: {
    t: {
      type: Function,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      local_question: this.question,
    };
  },
  methods: {
    handleAgeChange(event) {
      this.selectedAge = event.target.value;
    },
  },
};
</script>
