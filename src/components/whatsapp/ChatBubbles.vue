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
  >
    <div
      class="textMessage position-relative py-2 text-start px-3 start-0 rounded-2 fst-normal text-break text-wrap lh-base"
    >
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
        <audio controls class="img-fluid rounded-2">
          <source :src="message.fileUrl" :type="message.fileMimeType" />
          Your browser does not support the audio element.
        </audio>
      </div>
      <div v-else-if="message.isDocument">
        <a
          :href="message.fileUrl"
          target="_blank"
          class="text-decoration-none text-primary"
          >Download Document</a
        >
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
      <div class="">
        {{ message.text }}
      </div>
      <button
        class="buttonMenu border-0 bg-transparent position-absolute top-0 fs-6"
        @click.stop="toggleMenu(index)"
        v-click-outside="closeMenu"
      >
        <i class="fa-solid fa-ellipsis-vertical text-secondary"></i>
      </button>
      <span class="d-block mt-1 opacity-50 fst-normal">{{ message.time }}</span>
      <!-- menu list -->
      <div
        v-if="activeMenu === index"
        class="menu-list position-absolute bg-light border rounded shadow-sm z-3 bottom-100"
      >
        <ul class="list-unstyled mb-0 m-auto px-2 lh-lg">
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
              >Replay</a
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
</template>
<script>
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

      const date = new Date(dateString);
      return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });
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
    handleScroll() {
      if (this.$refs.messageElements && this.$refs.messageElements.length) {
        const chatBox = this.$parent.$refs.chatBox;
        const scrollTop = chatBox.scrollTop;
        const elements = this.$refs.messageElements;

        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          const elementTop = element.offsetTop;

          if (elementTop >= scrollTop) {
            this.currentDate = this.formatMessageDate(
              this.messages[i].created_at
            );
            break;
          }
        }
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
    if (this.messages.length > 0) {
      this.currentDate = this.formatMessageDate(this.messages[0].created_at);
    }

    this.$parent.$refs.chatBox.addEventListener("scroll", this.handleScroll);

    this.setupIntersectionObserver();
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.$parent.$refs.chatBox.removeEventListener("scroll", this.handleScroll);
  },
  watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          if (this.messages.length > 0) {
            this.currentDate = this.formatMessageDate(
              this.messages[0].created_at
            );
            this.setupIntersectionObserver();
          }
        });
      },
      immediate: true,
    },
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
</style>
