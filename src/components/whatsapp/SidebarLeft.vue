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
            <input
              type="text"
              :placeholder="$t('whatsapp.searchConversation')"
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
              <span>{{ $t("whatsapp.closeSearch") }}</span>
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="chat-list position-relative overflow-auto h-100">
        <div
          class="chat d-flex justify-content-end align-items-center position-relative w-100 px-3 pt-2 pb-3 border-1 border-bottom border-secondary-subtle cursor-pointer"
          v-for="(chat, index) in filteredChats"
          :key="index"
          @click="openChat(chat, index)"
          :class="{ active: chat.isActive }"
        >
          <div class="imgBx position-relative overflow-hidden h-25 me-2">
            <img
              :src="chat.img"
              alt="user image"
              class="rounded-circle w-100 h-100"
            />
          </div>
          <div class="details position-relative w-100">
            <div class="head pe-2 d-flex justify-content-between">
              <h4 class="name fs-6 fw-medium text-black pt-2">
                {{ chat.name }}
              </h4>
              <span class="time text-success fst-normal">{{ chat.time }}</span>
            </div>
            <div
              class="msgs d-flex justify-content-between align-items-center text-secondary"
            >
              <p class="msg pe-2 overflow-hidden fst-normal text-truncate">
                {{ chat.message }}
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
      <div ref="labelModal" class="modal fade" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="row pt-2">
              <div class="col-6">
                <h5 class="modal-title text-end">Label Chat</h5>
              </div>
              <div class="col-6 text-start">
                <button
                  type="button"
                  class="btn-close border-0 bg-transparent"
                  @click="hideBootstrapModal"
                ></button>
              </div>
            </div>
            <div class="modal-body">
              <input
                v-model="newLabel"
                type="text"
                class="form-control"
                style="outline: none"
              />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary border-0"
                @click="hideBootstrapModal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-success border-0"
                @click="setLabel"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
export default {
  name: "SidebarLeft",
  data() {
    return {
      searchQuery: "",
      chats: [
        {
          img: require("@/assets/whatsappImage/img6.jpg"),
          name: "Ahmed Samy",
          time: "09:25",
          message: "مساء الخير",
          unread: true,
          unreadCount: 3,
          isActive: false,
          pinned: false,
          label: "",
          messages: [
            { type: "msg-me", text: "مرحباً!", time: "12:15", isCopied: false },
            {
              type: "msg-frnd",
              text: "أهلاً بك",
              time: "12:16",
              isCopied: false,
            },
            { type: "msg-me", text: "مرحباً!", time: "12:15", isCopied: false },
            {
              type: "msg-frnd",
              text: "أهلاً بك",
              time: "12:16",
              isCopied: false,
            },
            { type: "msg-me", text: "مرحباً!", time: "12:15", isCopied: false },
            {
              type: "msg-frnd",
              text: "أهلاً بك",
              time: "12:16",
              isCopied: false,
            },
            { type: "msg-me", text: "مرحباً!", time: "12:15", isCopied: false },
            {
              type: "msg-frnd",
              text: "أهلاً بك",
              time: "12:16",
              isCopied: false,
            },
            { type: "msg-me", text: "مرحباً!", time: "12:15", isCopied: false },
            {
              type: "msg-frnd",
              text: "أهلاً بك",
              time: "12:16",
              isCopied: false,
            },
            { type: "msg-me", text: "مرحباً!", time: "12:15", isCopied: false },
            {
              type: "msg-frnd",
              text: "أهلاً بك",
              time: "12:16",
              isCopied: false,
            },
            { type: "msg-me", text: "مرحباً!", time: "12:15", isCopied: false },
            {
              type: "msg-frnd",
              text: "أهلاً بك",
              time: "12:16",
              isCopied: false,
            },
          ],
          selectedChat: null,
          newLabel: "",
          modalInstance: null,
        },
        {
          img: require("@/assets/whatsappImage/img1.jpg"),
          name: "Ibrahem Ali",
          time: "10:00",
          message: "كيف حالك؟",
          unread: false,
          unreadCount: 0,
          isActive: false,
          pinned: false,
          label: "",
          messages: [
            {
              type: "msg-me",
              text: "كيف حالك؟",
              time: "10:30",
              isCopied: false,
            },
            {
              type: "msg-frnd",
              text: "أنا بخير",
              time: "10:31",
              isCopied: false,
            },
            {
              type: "msg-me",
              text: "كيف حالك؟",
              time: "10:30",
              isCopied: false,
            },
            {
              type: "msg-frnd",
              text: "أنا بخير",
              time: "10:31",
              isCopied: false,
            },
            {
              type: "msg-me",
              text: "كيف حالك؟",
              time: "10:30",
              isCopied: false,
            },
            {
              type: "msg-frnd",
              text: "أنا بخير",
              time: "10:31",
              isCopied: false,
            },
            {
              type: "msg-me",
              text: "كيف حالك؟",
              time: "10:30",
              isCopied: false,
            },
            {
              type: "msg-frnd",
              text: "أنا بخير",
              time: "10:31",
              isCopied: false,
            },
            {
              type: "msg-me",
              text: "كيف حالك؟",
              time: "10:30",
              isCopied: false,
            },
            {
              type: "msg-frnd",
              text: "أنا بخير",
              time: "10:31",
              isCopied: false,
            },
          ],
          selectedChat: null,
          newLabel: "",
          modalInstance: null,
        },
      ],
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
          return chat.name.toLowerCase().includes(lowerQuery);
        })
        .sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return 0;
        });
    },
  },
  methods: {
    openChat(chat, index) {
      if (index >= 0 && index < this.chats.length) {
        this.chats.forEach((item) => {
          item.isActive = false;
        });

        this.chats[index].isActive = true;

        this.selectedChat = this.chats[index];
        this.newLabel = this.selectedChat.name;

        this.chats[index].unread = false;
        this.chats[index].unreadCount = 0;

        this.$emit("select-chat", chat);
      } else {
        console.error("The chat does not exist");
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
    openLabelModal() {
      if (this.selectedChat) {
        this.newLabel = this.selectedChat.name;
        this.showBootstrapModal();
      }
    },
    setLabel() {
      if (this.selectedChat) {
        this.selectedChat.name = this.newLabel;
        this.hideBootstrapModal();
      }
    },
    showBootstrapModal() {
      const modalElement = this.$refs.labelModal;
      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
      }
    },
    hideBootstrapModal() {
      const modalElement = this.$refs.labelModal;
      if (modalElement) {
        const modal = Modal.getInstance(modalElement);
        modal.hide();
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
  },
  mounted() {
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
  left: 5%;
  top: 50%;
  transform: translate(0%, -50%);
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

.left-side .chat-list .chat.active {
  background: #ebebeb;
}

.left-side .chat-list .chat:hover {
  background: #f5f5f5;
}

.left-side .chat-list .chat .imgBx {
  width: 70px;
}

.left-side .chat-list .chat .details .msg {
  display: -webkit-box;
  -webkit-line-clamp: 1;
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
</style>
