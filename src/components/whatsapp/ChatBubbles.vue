<template>
  <p
    class="date fs-6 text-center bg-secondary text-white py-1 px-3 rounded-3 position-sticky start-50 z-3"
  >
    <!-- {{ formatMessageDate(messages[0]?.created_at) }} -->
    {{ currentDate }}
  </p>
  <div
    class="msg position-relative w-100 d-flex my-1 pb-2"
    v-for="(message, index) in messages"
    :key="message.id"
    :class="message.type"
    ref="messageElements"
  >
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
        class="addNote border-0 position-absolute bottom-0 fs-6 rounded-2"
      >
        <i class="fa-solid fa-paste"></i>
      </button>
      <div v-if="message.isImage">
        <img
          :src="message.fileUrl"
          alt="صورة مرسلة"
          class="img-fluid rounded-2"
          @click="openFullScreenImage(message.fileUrl)"
        />
      </div>
      <div v-else-if="message.isVideo">
        <video
          :src="message.fileUrl"
          controls
          class="img-fluid rounded-2"
        ></video>
      </div>
      <div v-else-if="message.isAudio">
        <audio controls>
          <source :src="message.fileUrl" :type="message.fileMimeType" />
          Your browser does not support the audio element.
        </audio>
      </div>
      <div v-else-if="message.isDocument">
        <a
          :href="message.fileDownloadUrl"
          target="_blank"
          class="text-decoration-none text-primary"
        >
          <i class="fa-solid fa-file-lines"></i> {{ message.fileName }}
        </a>
      </div>
      <div
        v-if="isFullScreenImageOpen"
        class="full-screen-image-modal"
        @click="closeFullScreenImage"
      >
        <img
          :src="fullScreenImageUrl"
          alt="صورة كاملة الشاشة"
          class="full-screen-image"
        />
      </div>
      <div
        class="message-text"
        style="white-space: pre-line"
        v-if="message.status != 'error'"
      >
        {{ message.text }}
      </div>
      <div class="message-text" style="white-space: pre-line" v-else>
        {{ t(message.text) }}
      </div>
      <button
        class="buttonMenu border-0 bg-transparent position-absolute top-0 fs-6"
        @click.stop="toggleMenu(index)"
        v-click-outside="closeMenu"
      >
        <i
          class="fa-solid fa-ellipsis-vertical text-secondary"
          :class="message.status === 'message-error' ? 'text-white' : ''"
        ></i>
      </button>
      <span class="d-block mt-1 opacity-50 fst-normal">
        <div class="d-flex justify-content-between">
          <span class="me-2">{{ message.time }}</span>
          <!-- <button class="border-0 bg-white fs-6">
            <i class="fa-solid fa-paste text-secondary"></i>
          </button> -->
        </div>
        <!-- Message status -->
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
          <span
            v-else-if="message.status === 'undelivered'"
            class="status-icon"
          >
            <i class="fa-solid fa-xmark"></i> (Message not sent)
          </span>
          <span v-else-if="message.status === 'error'" class="status-icon">
            <i class="fa-solid fa-xmark"></i> (Message not sent)
          </span>
        </span>
      </span>
      <!-- menu list -->
      <div
        v-if="activeMenu === index"
        class="menu-list position-absolute bg-light border rounded shadow-sm z-3 bottom-100"
      >
        <ul class="list-unstyled mb-0 m-auto px-2 lh-lg">
          <li v-if="message.fileDownloadUrl">
            <a
              class="text-decoration-none text-primary"
              :href="message.fileDownloadUrl"
              :download="message.fileName"
              target="_blank"
              >Download</a
            >
          </li>
          <li>
            <a
              class="text-decoration-none text-primary"
              href="#"
              @click.prevent="copyMessage(message)"
              >Copy</a
            >
          </li>
          <li>
            <a
              class="text-decoration-none text-primary"
              href="#"
              @click.prevent="replyToMessage(message)"
              >Reply</a
            >
          </li>
          <li>
            <a
              class="text-decoration-none text-primary"
              href="#"
              @click.prevent="deleteMessage(index)"
              >Delete</a
            >
          </li>
        </ul>
      </div>
      <div
        v-if="message.isCopied"
        class="copy-message position-absolute bg-secondary-subtle py-1 px-2 rounded-1 bottom-100 text-center"
      >
        Message Copied!
      </div>
    </div>
  </div>
  <button
    v-if="showScrollButton"
    class="btn-scroll position-fixed m-3 px-2 py-1 text-white border-0 rounded-2"
    @click="scrollToBottom"
  >
    <i class="fa-solid fa-arrow-down"></i>
  </button>
</template>
<script>
import { useI18n } from "vue-i18n";

export default {
  name: "ChatBubbles",
  props: {
    messages: {
      type: Array,
      required: true,
      default: () => [],
    },
    searchQuery: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      activeMenu: null,
      currentDate: "",
      observer: null,
      isFullScreenImageOpen: false,
      fullScreenImageUrl: "",
      showScrollButton: false,
    };
  },
  computed: {
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
    toggleMenu(index) {
      this.activeMenu = this.activeMenu === index ? null : index;
    },
    copyMessage(message) {
      navigator.clipboard.writeText(message.text).then(() => {
        message.isCopied = true;
        setTimeout(() => {
          message.isCopied = false;
        }, 2000);
      });
    },
    replyToMessage(message) {
      alert(`Reply : ${message.text}`);
    },
    deleteMessage(index) {
      this.$emit("delete-message", index);
    },
    closeMenu() {
      this.activeMenu = null;
    },
    formatMessageDate(dateString) {
      if (!dateString) return "";

      const messageDate = new Date(dateString);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      messageDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      yesterday.setHours(0, 0, 0, 0);

      if (messageDate.getTime() === today.getTime()) {
        return "Today";
      } else if (messageDate.getTime() === yesterday.getTime()) {
        return "Yesterday";
      } else {
        const day = messageDate.getDate().toString().padStart(2, "0");
        const month = (messageDate.getMonth() + 1).toString().padStart(2, "0");
        const year = messageDate.getFullYear();
        return `${day}/${month}/${year}`;
      }
    },
    setupIntersectionObserver() {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const messageIndex = this.$refs.messageElements.findIndex(
                (el) => el === entry.target
              );
              if (messageIndex !== -1) {
                this.currentDate = this.formatMessageDate(
                  this.messages[messageIndex].created_at
                );
              }
            }
          });
        },
        {
          threshold: 1.0,
          root: this.$parent.$refs.chatBox,
        }
      );

      this.$nextTick(() => {
        if (this.$refs.messageElements) {
          this.$refs.messageElements.forEach((element) => {
            this.observer.observe(element);
          });
        }
      });
    },
    scrollToBottom() {
      const chatBox = this.$parent.$refs.chatBox;
      chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: "smooth",
      });
    },
    handleScroll() {
      const chatBox = this.$parent.$refs.chatBox;
      const scrollTop = chatBox.scrollTop;
      const scrollHeight = chatBox.scrollHeight;
      const clientHeight = chatBox.clientHeight;

      this.showScrollButton = scrollTop + clientHeight < scrollHeight - 100;

      const scrollPercentage =
        (scrollTop / (scrollHeight - clientHeight)) * 100;

      const totalMessages = this.messages.length;
      let messageIndex;

      if (scrollTop === 0) {
        messageIndex = 0;
      } else if (scrollTop + clientHeight >= scrollHeight - 10) {
        messageIndex = totalMessages - 1;
      } else {
        messageIndex = Math.floor(
          (totalMessages - 1) * (scrollPercentage / 100)
        );
      }

      // Update the date
      if (this.messages[messageIndex]) {
        this.currentDate = this.formatMessageDate(
          this.messages[messageIndex].created_at
        );
      }
    },
    openFullScreenImage(imageUrl) {
      this.fullScreenImageUrl = imageUrl;
      this.isFullScreenImageOpen = true;
    },
    closeFullScreenImage() {
      this.isFullScreenImageOpen = false;
      this.fullScreenImageUrl = "";
    },
  },
  directives: {
    clickOutside: {
      beforeMount(el, binding) {
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value();
          }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
      },
      unmounted(el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      },
    },
  },
  mounted() {
    const chatBox = this.$parent.$refs.chatBox;
    chatBox.addEventListener("scroll", this.handleScroll);

    this.$nextTick(() => {
      if (this.messages.length > 0) {
        this.currentDate = this.formatMessageDate(
          this.messages[this.messages.length - 1].created_at
        );
      }
    });

    this.setupIntersectionObserver();
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
    const chatBox = this.$parent.$refs.chatBox;
    chatBox.removeEventListener("scroll", this.handleScroll);
  },
  watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          if (this.messages.length > 0) {
            this.handleScroll();
            this.setupIntersectionObserver();
          }
        });
      },
      immediate: true,
    },
  },

  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
};
</script>
<style scoped>
.right-side .chatBx p.date {
  top: -6%;
  width: fit-content;
}
@media (max-width: 850px) {
  .right-side .chatBx p.date {
    top: -4%;
    left: 50%;
    transform: translateX(-50%);
  }
}

.right-side .chatBx .msg .textMessage {
  max-width: 65%;
  background: #dcf8c6;
}
.right-side .chatBx .msg .textMessage img {
  max-width: 400px;
  object-fit: cover;
}
@media (max-width: 1200px) {
  .right-side .chatBx .msg .textMessage img {
    max-width: 100%;
  }
}

.right-side .chatBx .msg-me .textMessage::before {
  content: "";
  position: absolute;
  top: 0;
  left: -10px;
  border-top: 10px solid #dcf8c6;
  border-left: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid #dcf8c6;
}

.right-side .chatBx .msg-me {
  justify-content: flex-start;
}
/* icon menu */
.right-side .chatBx .msg-me .buttonMenu {
  right: 0 !important;
}
.right-side .chatBx .msg-frnd .buttonMenu {
  left: 0 !important;
}
/* menu list */
.right-side .chatBx .msg-me .menu-list {
  right: 0% !important;
}
.right-side .chatBx .msg-frnd .menu-list {
  left: 0% !important;
}
/* copy message */
.right-side .chatBx .msg .copy-message {
  min-width: fit-content;
  font-size: 12px;
  white-space: nowrap;
}
.right-side .chatBx .msg-frnd .copy-message {
  left: 0% !important;
}
.right-side .chatBx .msg-me .copy-message {
  right: 0% !important;
}

.right-side .chatBx .msg-frnd {
  justify-content: flex-end;
}

.right-side .chatBx .msg-frnd .textMessage {
  background: #fff;
  text-align: left;
}

.right-side .chatBx .msg-frnd .textMessage::before {
  content: "";
  position: absolute;
  top: 0;
  right: unset;
  right: -10px;
  border-top: 10px solid #fff;
  border-left: 10px solid #fff;
  border-bottom: 10px solid transparent;
  border-right: 10px solid transparent;
}
.full-screen-image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.078);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.full-screen-image {
  max-width: 90% !important;
  max-height: 90% !important;
  border-radius: 8px;
}
.text-gray {
  color: #6c757d;
}

.text-blue {
  color: #0d6efd;
}
.btn-scroll {
  bottom: 60px;
  right: -5px;
  background: #8a8686eb;
  width: 40px;
  height: 40px;
  z-index: 1000;
}
.right-side .chatBx .msg-frnd .buttonMenu {
  left: 0 !important;
}
.right-side .chatBx .msg-frnd .addNote {
  background: #ffffff60;
  left: -31px;
}
.right-side .chatBx .msg-me .addNote {
  background: #ffffff60;
  right: -31px;
}

.addNote i {
  color: #8d8a8a90;
  transition: 0.3s;
}
.addNote:hover i {
  color: #636262;
}
.message-error {
  background-color: #d40000 !important;
  color: #fff !important;
}

.right-side .chatBx .msg-me .message-error::before {
  border-top-color: #d40000 !important;
  border-right-color: #d40000 !important;
}

.right-side .chatBx .msg-frnd .message-error::before {
  border-top-color: #d40000 !important;
  border-left-color: #d40000 !important;
}
</style>
