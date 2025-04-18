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
  props: {
    conversation: {
      type: Object,
      default: null,
    },
    new_message: {
      type: Object,
      default: null,
    },
    updated_message: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      selectedChat: null,
    };
  },
  methods: {
    loadConversations(conversations) {
      if (this.$refs.leftSidebar) {
        this.$refs.leftSidebar.chats = conversations;
      } else {
        console.warn("LeftSidebar ref not found");
      }
    },
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
            isDocument: msg.type === "document",
            isAudio: msg.type === "audio",
            isVideo: msg.type === "video",
            fileName: msg.file ? msg.file.name : null,
            fileUrl: msg.file ? msg.file.url : null,
            fileMimeType: msg.file ? msg.file.mime_type : null,
            status: msg.status,
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
    receiveNewMessage(new_message) {
      console.log("selectedChat id", this.selectedChat.id);
      console.log("new_message id", new_message.conversation_id);
      if (
        this.selectedChat &&
        this.selectedChat.id == new_message.conversation_id
      ) {
        console.log("chat opened", this.selectedChat, new_message);
        this.handleNewMessage({
          id: new_message.id || Date.now(),
          type: "msg-frnd",
          text: new_message.text_body,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          created_at: new_message.created_at,
          sender: new_message.sender_name || new_message.sender,
          isCopied: false,
          isImage: new_message.type === "image",
          isDocument: new_message.type === "document",
          isAudio: new_message.type === "audio",
          isVideo: new_message.type === "video",
          fileName: new_message.file ? new_message.file.name : null,
          fileUrl: new_message.file ? new_message.file.url : null,
          conversation_id: new_message.conversation_id,
          fileMimeType: new_message.file ? new_message.file.mime_type : null,
          status: new_message.status,
        });
      } else {
        console.log("chat not opened", this.selectedChat, new_message);
      }
    },

    updateMessage(data) {
      if (this.selectedChat) {
        const messageIndex = this.selectedChat.messages.findIndex(
          (msg) => msg.id == data.id
        );
        if (messageIndex !== -1) {
          const updated_data = {
            text: data.text_body,
            status: data.status,
          };
          this.selectedChat.messages[messageIndex] = {
            ...this.selectedChat.messages[messageIndex],
            ...updated_data,
          };
        }
      }
    },
  },
  watch: {
    conversation: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.$refs.leftSidebar.addNewChat(newVal);
          this.setSelectedChat({
            ...newVal,
            isActive: true,
            messages: [],
          });
        }
      },
    },
    new_message: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.receiveNewMessage(newVal);
        }
      },
    },
    updated_message: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.updateMessage(newVal);
        }
      },
    },
  },
};
</script>
<style scoped>
#whatsappModal {
  z-index: 9999 !important;
}
</style>
