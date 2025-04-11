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
              @open-label="handleOpenLabel"
              @delete-chat="handleDeleteChat"
              @new-message="handleNewMessage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <LabelModal
    ref="labelModal"
    :chat-name="selectedChat?.name"
    @save-label="handleSaveLabel"
  />
</template>

<script>
import SidebarLeft from "@/components/whatsapp/SidebarLeft.vue";
import SidebarRight from "@/components/whatsapp/SidebarRight.vue";
import { getMessageConv } from "@/plugins/services/authService";
import LabelModal from "@/components/whatsapp/labelWhatsapp.vue";
import Cookies from "js-cookie";
export default {
  name: "WhatsappModal",
  components: { SidebarLeft, SidebarRight, LabelModal },
  data() {
    return {
      selectedChat: null,
    };
  },
  methods: {
    handleNewMessage(newMessage) {
      if (this.selectedChat) {
        this.selectedChat = {
          ...this.selectedChat,
          messages: [...(this.selectedChat.messages || []), newMessage],
        };
      }
    },
    async setSelectedChat(chat) {
      try {
        console.log("Selected chat:", chat);
        const chatId = chat.id || chat.conversation_id;

        if (!chatId) {
          console.error("No chat ID found!");
          return;
        }

        console.log("Fetching messages for chat ID:", chatId);
        const response = await getMessageConv(chatId);

        if (response.data && response.data.data) {
          const messages = response.data.data.map((msg) => ({
            id: msg.id,
            type:
              msg.conversation_member.type === "User" &&
              msg.conversation_member.id == Cookies.get("user_id")
                ? "msg-me"
                : "msg-frnd",
            text: msg.text_body,
            time: new Date(msg.created_at).toLocaleTimeString("ar-EG", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              timeZone: "UTC",
            }),
            created_at: msg.created_at,
            sender: msg.conversation_member?.name || "",
            isCopied: false,
            isImage: msg.type === "image",
            imageUrl: msg.file ? msg.file.url : null,
          }));

          this.selectedChat = {
            ...chat,
            id: chatId,
            messages,
          };

          console.log("Updated selectedChat:", this.selectedChat);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        this.selectedChat = chat;
      }
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

    handleDeleteChat() {
      this.$refs.leftSidebar.deleteChat();
      this.selectedChat = null;
    },
    handleOpenLabel() {
      this.$refs.labelModal.showModal();
    },
    handleSaveLabel(newName) {
      if (this.selectedChat) {
        this.selectedChat.name = newName;
      }
    },
  },
};
</script>
