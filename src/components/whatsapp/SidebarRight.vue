<template>
  <div class="col-0 col-md-8 boxChat px-0" v-if="selectedChat">
    <div class="right-side position-relative pt-2" style="height: 100vh">
      <div
        class="header position-relative px-2 border-1 border-end bg-success rounded-3"
      >
        <div class="row h-100">
          <div class="col-4 h-100 pe-4">
            <div
              class="user-details d-flex justify-content-start align-items-center gap-2 h-100"
            >
              <div class="user-imgBx">
                <img
                  :src="selectedChat.img"
                  alt="user image"
                  class="img-fluid rounded-circle"
                />
              </div>
              <h6 class="my-auto text-white">{{ selectedChat.name }} <br /></h6>
            </div>
          </div>
          <div
            class="col-8 search_list d-flex justify-content-end align-items-center ps-4 gap-2 fs-6 h-100"
          >
            <div id="bxSearch" class="d-flex">
              <div
                class="searchInput align-items-center"
                :class="{ 'show-search': isSearchBarVisible }"
              >
                <input
                  type="text"
                  name="searchChat"
                  id="searchChat"
                  class="ms-3 border-0 text-white py-1 px-2 fs-6 w-100 ms-5 bg-transparent border-1 border-bottom border-white"
                  v-model="searchQuery"
                  :placeholder="$t('whatsapp.searchChat')"
                  style="outline: none"
                />
              </div>
              <button
                @click="toggleSearchInput()"
                aria-label="search in chat"
                class="border-0 bg-transparent"
              >
                <i
                  class="fa-solid fa-magnifying-glass searchIcon fs-6 text-white cursor-pointer"
                ></i>
              </button>
            </div>
            <button
              @click.stop="showList()"
              aria-label="list chat (menu)"
              class="border-0 bg-transparent"
            >
              <i class="fa-solid fa-ellipsis-vertical fs-6 text-white"></i>
            </button>
            <button
              class="bg-transparent border-0"
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i class="fa fa-window-restore fs-6 pt-2 ps-1 text-white"></i>
            </button>
          </div>
        </div>
      </div>

      <div
        class="chatBx position-relative w-100 overflow-auto px-5 pt-5 pb-5"
        ref="chatBox"
      >
        <ChatBubbles
          :messages="filteredMessages"
          :searchQuery="searchQuery"
          @delete-message="handleDeleteMessage"
        />
        <div
          ref="menu"
          v-click-outside="closeMenu"
          class="menu align-items-center text-end bg-secondary-subtle shadow-lg rounded-2 lh-base position-fixed z-3"
          :class="{ 'show-list': showListVisible }"
        >
          <ul class="list-unstyled p-0">
            <li>
              <a
                class="text-primary text-decoration-none"
                href="#"
                @click="handleArchiveChat"
                >{{ $t("whatsapp.archiveChat") }}</a
              >
            </li>
            <li>
              <a
                class="text-primary text-decoration-none"
                href="#"
                @click="handlePinChat"
                >{{ $t("whatsapp.pinChat") }}</a
              >
            </li>
            <li>
              <a
                class="text-primary text-decoration-none"
                href="#"
                @click="handleLabelClick"
                >{{ $t("whatsapp.labelChat") }}</a
              >
            </li>
            <li>
              <a
                class="text-primary text-decoration-none"
                href="#"
                @click="$emit('mark-as-unread', chat)"
                >{{ $t("whatsapp.markAsUnread") }}</a
              >
            </li>
            <li>
              <a
                class="text-primary text-decoration-none"
                href="#"
                @click="handleDeleteChat"
                >{{ $t("whatsapp.deleteChat") }}</a
              >
            </li>
          </ul>
        </div>
      </div>

      <div class="message-input m-auto">
        <MessageInput
          @send-message="receiveMessage"
          @scroll-to-bottom="scrollToBottom"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MessageInput from "@/components/whatsapp/MessageInput.vue";
import ChatBubbles from "@/components/whatsapp/ChatBubbles.vue";
export default {
  emits: ["mark-as-unread", "pin-chat", "open-label", "delete-chat"],
  components: {
    MessageInput,
    ChatBubbles,
  },
  name: "SidebarRight",
  props: {
    selectedChat: Object,
  },
  data() {
    return {
      isSearchBarVisible: false,
      showListVisible: false,
      newMessage: "",
      searchQuery: "",
      localSelectedChat: { ...this.selectedChat },
    };
  },
  watch: {
    selectedChat: {
      handler(newVal) {
        this.localSelectedChat = { ...newVal };
      },
      immediate: true,
    },
  },
  computed: {
    messages() {
      return this.localSelectedChat?.messages || [];
    },
    filteredMessages() {
      if (!this.searchQuery) {
        return this.messages;
      }

      return this.messages.filter((message) => {
        return message.text
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
      });
    },
  },
  methods: {
    receiveMessage(message) {
      const newMessage = {
        type: "msg-me",
        text: message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      this.localSelectedChat.messages.push(newMessage);
      this.scrollToBottom();
    },
    scrollToBottom() {
      // this.$nextTick(() => {
      //   const chatMessages = this.$refs.chatBox.querySelectorAll(".msg");
      //   const lastMessage = chatMessages[chatMessages.length - 1];
      //   if (lastMessage) {
      //     lastMessage.scrollIntoView({ behavior: "smooth", block: "end" });
      //   }
      // });
      this.$nextTick(() => {
        const chatBox = this.$refs.chatBox;
        chatBox.scrollTo({
          top: chatBox.scrollHeight,
          behavior: "smooth",
        });
      });
    },

    toggleSearchInput() {
      this.isSearchBarVisible = !this.isSearchBarVisible;
    },
    showList() {
      this.showListVisible = !this.showListVisible;
    },
    closeMenu() {
      this.showListVisible = false;
    },

    setActiveChat(index) {
      this.activeChat = index;
      const chat = this.chats[index];
      if (chat.unread) {
        chat.unread = false;
        chat.unreadCount = 0;
      }
    },
    handlePinChat() {
      this.$emit("pin-chat");
    },
    handleLabelClick() {
      this.$emit("open-label");
    },
    handleDeleteChat() {
      this.$emit("delete-chat");
    },
    handleDeleteMessage(index) {
      this.localSelectedChat.messages.splice(index, 1);
    },
  },
  directives: {
    clickOutside: {
      beforeMount(el, binding) {
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event);
          }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
      },
      unmounted(el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      },
    },
  },
};
</script>

<style scoped>
.right-side {
  position: relative;
  background-image: url(../../assets/whatsappImage/background.jpg);
  background-size: contain;
  background-position: center;
}

.right-side::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 110px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.6) 30%,
    rgba(0, 0, 0, 0.2) 70%,
    rgba(0, 0, 0, 0) 100%
  );
  pointer-events: none;
  z-index: 1;
}

.right-side .message-input {
  position: sticky;
  bottom: 2%;
  width: 98%;
  z-index: 999;
}

.right-side .header {
  height: 7vh;
  width: 98%;
  margin: 0 auto;
}

.right-side .header .user-details .user-imgBx {
  width: 40px;
  height: 40px;
}
input::placeholder {
  color: white;
}

.searchInput {
  opacity: 0;
  visibility: hidden;
  transition: all 0.5s;
}
.searchInput.show-search {
  opacity: 1;
  visibility: visible;
}

/* chat box */

.right-side .chatBx {
  height: 90vh;
}
.right-side .chatBx .menu {
  top: 8vh;
  right: 1%;
  opacity: 0;
  visibility: hidden;
  transition: all 0.5s;
}

.right-side .chatBx .menu.show-list {
  opacity: 1;
  visibility: visible;
}
.right-side .chatBx .menu ul li {
  padding: 10px 10px 10px 20px;
  transition: all 0.2s;
}
.right-side .chatBx .menu ul li:hover {
  background-color: #fff;
}
.right-side .chat-input {
  position: sticky;
  bottom: 0;
}
/* scroll style */
.right-side .chatBx::-webkit-scrollbar {
  width: 8px;
}

.right-side .chatBx::-webkit-scrollbar-track {
  background: #edebeb97;
}

.right-side .chatBx::-webkit-scrollbar-thumb {
  background: #6d6c6ca7;
  border-radius: 8px;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  -ms-border-radius: 8px;
  -o-border-radius: 8px;
}
</style>
