<template>
  <div class="col-12 col-md-4 chatResponsive px-0">
    <div class="left-side bg-secondary-subtle vh-100">
      <div
        class="inputSearch w-100 text-center position-relative d-flex justify-content-center align-items-center"
      >
        <div class="row d-flex justify-content-start align-items-center w-100">
          <div class="col-2 col-lg-1">
            <!-- <button
              class="bg-transparent border-0"
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i class="fa fa-window-restore fs-5 pt-2 ps-1 text-black-50"></i>
            </button> -->
          </div>
          <div class="col-12">
            <div class="input-group w-100">
              <div class="position-relative flex-grow-1">
                <input
                  type="text"
                  placeholder="Search Here.."
                  v-model="searchQuery"
                  style="outline: none"
                  class="border border-1 border-white py-2 pe-5 ps-5 rounded-2 bg-body text-secondary w-100"
                />
                <i
                  class="fa-solid fa-magnifying-glass searchIcon fs-6 text-secondary position-absolute"
                ></i>
                <button
                  v-if="searchQuery"
                  @click="clearSearch"
                  class="btnCloseSearch bg-transparent border-0 position-absolute text-danger d-flex justify-content-center align-items-center gap-1 fs-5"
                >
                  <span>Close</span>
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
              <button
                type="button"
                class="btn btn-primary py-2 flex-shrink-0"
                @click="openFilterModal"
              >
                <i class="fa-solid fa-filter text-white"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-list position-relative overflow-auto">
        <div
          class="chat d-flex justify-content-end align-items-center position-relative w-100 px-lg-3 pt-1 border-1 border-bottom border-secondary-subtle cursor-pointer"
          v-for="(chat, index) in chats"
          :key="index"
          @click="openChat(chat, index)"
          :class="{ active: chat.isActive }"
        >
          <div class="imgBx position-relative overflow-hidden h-25 me-2 mb-4">
            <img
              :src="
                chat.img ||
                require('@/assets/whatsappImage/default-userImage.jpg')
              "
              alt="user image"
              class="rounded-circle w-100 h-100"
            />
          </div>
          <div class="details position-relative w-100">
            <div class="rating mb-1" style="font-size: 12px">
              <template v-for="index in 7" :key="index">
                <i
                  class="fa-solid fa-star"
                  :class="
                    index <= (chat.rating || 0) ? 'text-gold' : 'text-lightgray'
                  "
                ></i>
              </template>
            </div>
            <div class="head pe-2 d-flex justify-content-between">
              <h4 class="name fs-6 fw-medium text-black">
                {{ chat.name }}
                <span class="text-muted ms-2">{{ chat.phone.phone }}</span>
              </h4>
              <span class="time text-success fst-normal">{{ chat.time }}</span>
            </div>
            <div
              class="msgs d-flex justify-content-between align-items-center text-secondary"
            >
              <p class="msg pe-2 text-truncate" :title="chat.message">
                <span
                  :class="{
                    'text-secondary': !chat.isRead,
                    'text-info': chat.isRead,
                  }"
                  class="pe-1"
                >
                  <i class="fa-solid fa-check fs-6"></i>
                </span>
                {{ truncatedMessage(chat.message) }}
              </p>
              <div class="d-flex align-items-center gap-3">
                <b
                  class="num"
                  :class="{ unread: chat.unread }"
                  v-if="chat.unread"
                >
                  {{ chat.unreadCount }}
                </b>
                <i
                  v-if="chat.pinned"
                  class="fa-solid fa-thumbtack pin-icon"
                  title="Pinned Chat"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <FilterModalConv @filter-by-rating="handleFilterByRating" />
</template>

<script>
import { Modal } from "bootstrap";
import FilterModalConv from "@/components/whatsapp/FilterModalConv.vue";
import {
  getconversations,
  getMessageConv,
} from "@/plugins/services/authService";
export default {
  name: "SidebarLeft",
  components: {
    FilterModalConv,
  },
  data() {
    return {
      searchQuery: "",
      chats: [],
      selectedChat: null,
      newLabel: "",
      modalInstance: null,
    };
  },
  computed: {
    filteredChats() {
      if (!this.searchQuery) {
        return this.chats.slice().sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return 0;
        });
      }

      return this.chats
        .filter((chat) => {
          const lowerQuery = this.searchQuery.toLowerCase();
          return (
            chat.name.toLowerCase().includes(lowerQuery) ||
            chat.message.toLowerCase().includes(lowerQuery)
          );
        })
        .sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return 0;
        });
    },
  },
  methods: {
    async fetchConversations() {
      try {
        const response = await getconversations();

        this.chats = response.data.data.map((conversation) => {
          const lastMessage = conversation.last_message;
          return {
            id: conversation.id,
            created_at: conversation.created_at,
            img:
              conversation.img ||
              require("@/assets/whatsappImage/default-userImage.jpg"),
            name: conversation.name || conversation.contact?.name,
            phone: conversation.phone.phone,
            rating: conversation.rating,
            unread_count: conversation.unread_count,
            time: lastMessage
              ? new Date(lastMessage.created_at).toLocaleTimeString("ar-EG", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "UTC",
                })
              : "",
            created_at_last_message: lastMessage?.created_at || "",
            message: lastMessage?.text_body || "",
            sender: lastMessage?.conversation_member?.name || "",
            unread: false,
            unreadCount: 0,
            isActive: false,
            pinned: false,
            label: "",
            messages: [],
            conversation_id: conversation.id,
          };
        });
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    },
    async fetchMessages(conversationId, chatObj) {
      try {
        const response = await getMessageConv(conversationId);
        console.log("Messages response:", response.data);
        if (response.data && response.data.data) {
          chatObj.messages = response.data.data.map((msg) => ({
            id: msg.id,
            type: msg.status === "sent" ? "msg-me" : "msg-frnd",
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
            isImage: msg.type === "media",
          }));
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        chatObj.messages = [];
      }
    },

    async openChat(chat, index) {
      console.log("Open chat with chat and index:", chat, index);
      try {
        if (index >= 0 && index < this.chats.length) {
          console.log("Opening chat:", chat);
          console.log("Chat ID:", chat.id);
          this.chats.forEach((item) => {
            item.isActive = false;
          });

          this.chats[index].isActive = true;

          this.$emit("select-chat", {
            ...chat,
            id: chat.id,
            isActive: true,
            messages: [],
          });
        }
      } catch (error) {
        console.error("Error opening chat:", error);
      }
    },
    markAsUnread(chat) {
      chat.unread = true;
      chat.unreadCount = "";
    },
    pinChat(chat) {
      const activeChat = this.chats.find((c) => c.isActive);

      chat.pinned = !chat.pinned;

      this.chats = this.chats.slice().sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return 0;
      });

      if (!chat.pinned) {
        const pinnedChat = this.chats.find((c) => c.pinned);
        if (pinnedChat) {
          this.chats.forEach((c) => (c.isActive = false));
          pinnedChat.isActive = true;
        } else {
          if (activeChat) {
            const activeIndex = this.chats.findIndex(
              (c) => c.id === activeChat.id
            );
            if (activeIndex !== -1) {
              this.chats[activeIndex].isActive = true;
            }
          }
        }
      } else {
        this.chats.forEach((chat) => (chat.isActive = false));
        chat.isActive = true;
      }
    },
    deleteChat() {
      const activeChat = this.chats.find((chat) => chat.isActive);
      if (activeChat) {
        const index = this.chats.indexOf(activeChat);
        if (index !== -1) {
          this.chats.forEach((chat, idx) => {
            this.chats[idx].isActive = false;
          });
          this.chats.splice(index, 1);
        }
      }
    },
    clearSearch() {
      this.searchQuery = "";
    },
    truncatedMessage(message) {
      if (!message) return "";
      const maxLength = 40;
      if (message.length > maxLength) {
        return message.substring(0, maxLength) + "...";
      }
      return message;
    },

    addNewChat(chat) {
      let chatIndex = this.chats.findIndex((c) => c.id === chat.id);
      let processed_chat = null;
      if (chatIndex === -1) {
        const processed_chat = {
          id: chat.id,
          created_at: chat.created_at,
          img:
            chat.img || require("@/assets/whatsappImage/default-userImage.jpg"),
          name: chat.name || chat.contact?.name,
          time: chat.lastMessage
            ? new Date(chat.lastMessage.created_at).toLocaleTimeString(
                "ar-EG",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "UTC",
                }
              )
            : "",
          created_at_last_message: chat.lastMessage?.created_at || "",
          message: chat.lastMessage?.text_body || "",
          sender: chat.lastMessage?.conversation_member?.name || "",
          unread: false,
          unreadCount: 0,
          isActive: false,
          pinned: false,
          label: "",
          messages: [],
          conversation_id: chat.id,
        };
        console.log("Processed chat:", processed_chat);
        this.chats.push(processed_chat);
        chatIndex = this.chats.length - 1;
      } else {
        processed_chat = this.chats[chatIndex];
        console.log("Chat already exists:", processed_chat);
      }
      console.log("final processed chat and index", processed_chat, chatIndex);
      this.openChat(processed_chat, chatIndex);
    },
    openFilterModal() {
      const modalElement = document.getElementById("filterWhatsappModal");
      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
      } else {
        console.error("Modal element not found in DOM.");
      }
    },
  },
  mounted() {
    this.fetchConversations();
    if (this.$refs.labelModal) {
      this.modalInstance = new Modal(this.$refs.labelModal);
    }
  },
};
</script>

<style scoped>
.left-side .inputSearch {
  height: 8vh;
}
.left-side .inputSearch .searchIcon {
  left: 4%;
  top: 50%;
  transform: translate(0%, -50%);
}
@media (max-width: 850px) {
  .left-side .inputSearch .searchIcon {
    left: 8%;
    top: 50%;
    transform: translate(0%, -50%);
  }
}
.left-side .inputSearch .btnCloseSearch {
  right: 5%;
  top: 50%;
  transform: translate(0%, -50%);
}
.left-side .inputSearch .btnCloseSearch span {
  font-size: 12px;
}
.left-side .inputSearch input::placeholder {
  font-size: 14px;
}
.left-side .inputSearch input:focus {
  border: 1px solid #a28484ab;
}

/* left sidebar  */
/* scroll style */
.left-side .chat-list::-webkit-scrollbar {
  width: 10px;
}

.left-side .chat-list::-webkit-scrollbar-track {
  background: #edebeb97;
}

.left-side .chat-list::-webkit-scrollbar-thumb {
  background: #6d6c6ca7;
  border-radius: 8px;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  -ms-border-radius: 8px;
  -o-border-radius: 8px;
}
/* end scroll style */
.left-side .chat-list {
  height: 92vh;
}
.left-side .chat-list .chat {
  cursor: pointer;
}
.left-side .chat-list .chat.active {
  background: #ebebeb;
}

.left-side .chat-list .chat:hover {
  background: #f5f5f5;
}

.left-side .chat-list .chat .imgBx {
  width: 70px;
}

@media (max-width: 850px) {
  .left-side .chat-list .chat .details .head h4.name {
    font-size: 12px !important;
  }
}
.left-side .chat-list .chat .details .msg {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}

.left-side .chat-list .chat .details .num.unread {
  background-color: #06d755;
  color: #fff;
  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
}
.message-truncate {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}

.message-truncate-multiline {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  line-height: 1.2em;
  max-height: 2.4em;
}

.message-truncate:hover {
  cursor: pointer;
}
.text-gold {
  color: #ffd700;
}

.text-lightgray {
  color: #d3d3d3;
}
.text-gray {
  color: #6c757d;
}

.text-blue {
  color: #0d6efd;
}
</style>
