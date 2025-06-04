<template>
  <div
    :class="`textMessage position-relative py-2 text-start px-3 start-0 rounded-2 fst-normal text-break text-wrap lh-base ${
      message.status === 'undelivered'
        ? 'text-danger'
        : message.status === 'error'
        ? 'message-error'
        : ''
    }`"
  >
    <button
      class="addNote border-0 position-absolute bottom-0 end-0 fs-6 rounded-2"
    >
      <i class="fa-solid fa-paste"></i>
    </button>

    <component
      :is="messageComponent"
      :message="message"
      @open-fullscreen="() => $emit('open-fullscreen', message.fileUrl)"
    />

    <button
      class="buttonMenu border-0 bg-transparent position-absolute top-0 end-0 fs-6"
      @click.stop="$emit('toggle-menu', index)"
      v-click-outside="$emit('close-menu')"
    >
      <i
        class="fa-solid fa-ellipsis-vertical text-secondary"
        :class="message.status === 'message-error' ? 'text-white' : ''"
      ></i>
    </button>

    <span class="d-block mt-1 opacity-50 fst-normal">
      <div class="d-flex justify-content-between">
        <span class="me-2">{{ message.time }}</span>
      </div>
      <span v-if="message.type === 'msg-me'">
        <span
          v-if="message.status === 'sent'"
          class="status-icon text-secondary"
        >
          <i class="fa-solid fa-check fs-6"></i>
        </span>
        <span
          v-else-if="message.status === 'delivered'"
          class="status-icon text-secondary"
        >
          <i class="fa-solid fa-check fs-6"></i>
          <i class="fa-solid fa-check fs-6"></i>
        </span>
        <span
          v-else-if="message.status === 'read'"
          class="status-icon text-info"
        >
          <i class="fa-solid fa-check fs-6"></i>
          <i class="fa-solid fa-check fs-6"></i>
        </span>
        <span v-else-if="message.status === 'undelivered'" class="status-icon">
          <i class="fa-solid fa-xmark"></i> (Message not sent)
        </span>
        <span v-else-if="message.status === 'error'" class="status-icon">
          <i class="fa-solid fa-xmark"></i> (Message not sent)
        </span>
      </span>
    </span>

    <ChatMessageMenu
      v-if="activeMenu === index"
      :message="message"
      :index="index"
      @copy="() => $emit('copy-message', message)"
      @reply="() => $emit('reply-message', message)"
      @delete="() => $emit('delete-message', index)"
    />

    <div
      v-if="message.isCopied"
      class="copy-message position-absolute bg-secondary-subtle py-1 px-2 rounded-1 bottom-100 text-center"
    >
      Message Copied!
    </div>
  </div>
</template>

<script>
import ChatMessageText from "@/components/whatsapp/WhatsAppModalSidebarRightChatMessageContainerMessagesText.vue";
import ChatMessageImage from "@/components/whatsapp/WhatsAppModalSidebarRightChatMessageContainerMessagesImage.vue";
import ChatMessageVideo from "@/components/whatsapp/WhatsAppModalSidebarRightChatMessageContainerMessagesVideo.vue";
import ChatMessageAudio from "@/components/whatsapp/WhatsAppModalSidebarRightChatMessageContainerMessagesAudio.vue";
import ChatMessageDocument from "@/components/whatsapp/WhatsAppModalSidebarRightChatMessageContainerMessagesDocument.vue";
import ChatMessageMenu from "@/components/whatsapp/WhatsAppModalSidebarRightChatMessageContainerMessagesMenu.vue";

export default {
  name: "WhatsAppModalSidebarRightChatMessageContainerMessages",
  components: {
    ChatMessageText,
    ChatMessageImage,
    ChatMessageVideo,
    ChatMessageAudio,
    ChatMessageDocument,
    ChatMessageMenu,
  },
  props: {
    message: Object,
    index: Number,
    activeMenu: Number,
  },
  computed: {
    messageComponent() {
      if (this.message.isImage) return "ChatMessageImage";
      if (this.message.isVideo) return "ChatMessageVideo";
      if (this.message.isAudio) return "ChatMessageAudio";
      if (this.message.isDocument) return "ChatMessageDocument";
      return "ChatMessageText";
    },
  },
};
</script>
