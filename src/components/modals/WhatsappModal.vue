<template>
  <div
    class="modal fade"
    id="whatsappModal"
    tabindex="-1"
    aria-labelledby="whatsappModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-fullscreen">
      <div
        class="modal-content"
        style="
          background-image: url('img/updated_pattern.png');
          background-size: contain;
          background-position: center;
          background-color: #eee;
          font-family: 'Open Sans', sans-serif;
          background-blend-mode: color;
        "
      >
        <!-- b75f3f2c -->
        <div class="modal-body p-0 overflow-hidden">
          <div class="row mx-0">
            <SidebarLeft @select-chat="setSelectedChat" ref="leftSidebar" />
            <SidebarRight
              :selectedChat="selectedChat"
              v-if="selectedChat"
              @mark-as-unread="handleMarkAsUnread"
              @pin-chat="pinActiveChat"
              :chats="chats"
              @open-label="handleOpenLabel"
              @delete-chat="handleDeleteChat"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarLeft from "@/components/whatsapp/SidebarLeft.vue";
import SidebarRight from "@/components/whatsapp/SidebarRight.vue";
export default {
  name: "WhatsappModal",
  components: { SidebarLeft, SidebarRight },
  data() {
    return {
      selectedChat: null,
    };
  },
  methods: {
    setSelectedChat(chat) {
      this.selectedChat = chat;
    },
    handleMarkAsUnread() {
      const activeChat = this.$refs.leftSidebar.chats.find(
        (chat) => chat.isActive
      );
      if (activeChat) {
        this.$refs.leftSidebar.markAsUnread(activeChat);
      }
    },
    pinActiveChat() {
      const activeChat = this.$refs.leftSidebar.chats.find(
        (chat) => chat.isActive
      );
      if (activeChat) {
        this.$refs.leftSidebar.pinChat(activeChat);
      }
    },
    handleOpenLabel() {
      this.$refs.leftSidebar.openLabelModal();
    },
    handleDeleteChat() {
      this.$refs.leftSidebar.deleteChat();
      this.selectedChat = null;
    },
  },
};
</script>
