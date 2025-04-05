<template>
  <p
    class="date fs-6 text-center bg-secondary text-white py-1 px-3 rounded-3 position-sticky start-50 z-3"
  >
    {{ $t("whatsapp.date") }}
  </p>
  <div
    class="msg position-relative w-100 d-flex my-1 pb-2"
    v-for="(message, index) in filteredMessages"
    :key="index"
    :class="message.type"
  >
    <div
      class="textMessage position-relative py-2 text-start px-3 start-0 rounded-2 fst-normal text-break text-wrap lh-base"
    >
      <div v-if="message.isImage">
        <img :src="message.text" alt="صورة مرسلة" class="img-fluid" />
      </div>
      <div class="" v-else>
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
    },
    searchQuery: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      activeMenu: null,
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
};
</script>
<style scoped>
.right-side .chatBx p.date {
  top: -8%;
  width: fit-content;
}

.right-side .chatBx .msg .textMessage {
  max-width: 65%;
  background: #dcf8c6;
}
.right-side .chatBx .msg .textMessage img {
  max-width: 300px;
  height: 300px;
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
</style>
