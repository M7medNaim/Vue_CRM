<template>
  <b-modal
    id="broadcastMessageCreateModal"
    ref="modal"
    title="My Modal"
    hide-footer
  >
    <p>This is a BootstrapVue modal!</p>
    <b-button variant="primary" @click="closeModal">Close</b-button>
  </b-modal>
</template>

<script>
export default {
  name: "BroadcastMessageCreateModal",
  data() {
    return {
      messageTitle: "",
      messageContent: "",
    };
  },
  methods: {
    sendMessage() {
      // Logic to send the message
      console.log("Message sent:", this.messageTitle, this.messageContent);
    },
  },
};
</script>
