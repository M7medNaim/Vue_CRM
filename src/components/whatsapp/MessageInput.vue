<template>
  <div class="chat-input w-100 position-relative bg-body-secondary p-2">
    <div class="row m-0 p-0 justify-content-between align-items-center">
      <div
        class="col-3 col-lg-2 d-flex justify-content-start align-items-center gap-3 pt-1"
      >
        <div class="emoje">
          <button
            type="submit"
            @click="toggleEmoji"
            v-click-outside="closeEmoji"
            class="border-0 bg-transparent"
            aria-label="Emojis"
          >
            <i class="fa-regular fa-face-smile fs-4 text-body-secondary"></i>
          </button>
          <!-- all Emojis -->
          <div
            v-if="isEmojiVisible"
            class="emoji-picker bg-white rounded-2 border border-1 border-dark-subtle py-1 ps-3 pe-1 d-flex flex-wrap gap-3 w-25 position-absolute fs-5 text-center start-0 bottom-100"
          >
            <div class="row">
              <div class="col-1 ms-2">
                <span @click="addEmoji('😀')">😀</span>
              </div>
              <div class="col-1 ms-2">
                <span @click="addEmoji('😍')">😍</span>
              </div>
              <div class="col-1 ms-2">
                <span @click="addEmoji('😅')">😅</span>
              </div>
              <div class="col-1 ms-2">
                <span @click="addEmoji('😊')">😊</span>
              </div>
              <div class="col-1 ms-2">
                <span @click="addEmoji('😂')">😂</span>
              </div>
              <div class="col-1 ms-2">
                <span @click="addEmoji('😄')">😄</span>
              </div>
              <div class="col-1 ms-2">
                <span @click="addEmoji('😂')">😂</span>
              </div>
              <div class="col-1 ms-2">
                <span @click="addEmoji('😢')">😢</span>
              </div>
              <div class="col-1 ms-2">
                <span @click="addEmoji('😇')">😇</span>
              </div>
              <div class="col-1 ms-2">
                <span @click="addEmoji('😢')">😢</span>
              </div>
              <div class="col-1 ms-2">
                <span @click="addEmoji('😡')">😡</span>
              </div>
              <div class="col-1 ms-2">
                <span @click="addEmoji('😁')">😁</span>
              </div>
              <div class="col-1 ms-2">
                <span @click="addEmoji('😡')">😡</span>
              </div>
            </div>
          </div>
        </div>
        <!-- upload_file Icon -->
        <div class="upload_file cursor-pointer d-block position-relative">
          <label for="file" class="upload-label">
            <i
              class="fa-solid fa-paperclip upload-icon fs-4 text-body-secondary"
            ></i>
          </label>
          <form action="" autocomplete="off">
            <input
              type="file"
              id="file"
              class="file-upload position-relative d-none"
              autocomplete="off"
              aria-label="uploadFile"
            />
          </form>
        </div>
        <div class="Clipboard">
          <button
            @click="toggleClipboard"
            v-click-outside="closeClipboard"
            aria-label="Clipboard"
            class="border-0 bg-transparent fs-4 text-body-secondary pb-1"
          >
            <i class="fa-regular fa-clipboard"></i>
          </button>
          <div
            v-if="isClipboardVisible"
            class="listClipboard row bg-body-tertiary border border-1 border-dark-subtle text-start w-25 position-absolute fs-6 bottom-100 text-break text-wrap"
          >
            <div
              class="col-12 border-bottom border-secondary-subtle w-100 d-flex justify-content-between align-items-center py-2 bg-secondary-subtle"
            >
              <i class="fa-solid fa-xmark fs-5"></i>
              <!-- <span>Close</span> -->
              <i class="fa-regular fa-clipboard fs-5"></i>
            </div>
            <div
              class="col-12 border-bottom border-secondary-subtle"
              @click="addClipboard('Hi')"
            >
              <span>Hi</span>
            </div>
            <div
              class="col-12 border-bottom border-light-subtle"
              @click="addClipboard('hi')"
            >
              <span>hi</span>
            </div>
          </div>
        </div>
      </div>
      <!-- input send message -->
      <div class="col-8 col-lg-9">
        <input
          type="text"
          ref="messageInput"
          placeholder="Type a message"
          id="inputMassege"
          class="rounded-2 fs-6 border-0 py-2 px-4 shadow-lg w-100"
          style="outline: none"
          v-model="newMessage"
        />
      </div>
      <!-- icon send & voice Message -->
      <div class="col-1 d-flex justify-content-center align-items-center">
        <button
          type="submit"
          class="submitMsg position-relative border-0 bg-transparent"
          @click="sendMessage"
          aria-label="sendMessage && voiceMessage"
        >
          <i
            ref="voiceIcon"
            class="fa-solid fa-microphone d-block fs-4 text-body-secondary"
            id="voiceIcon"
            v-if="newMessage.trim() === ''"
          ></i>
          <i
            ref="sendIcon"
            class="fa-solid fa-paper-plane d-block position-relative fs-4 text-body-secondary"
            id="sendIcon"
            v-if="newMessage.trim() !== ''"
          ></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageInput",
  data() {
    return {
      newMessage: "",
      isEmojiVisible: false,
      isClipboardVisible: false,
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() !== "") {
        this.$emit("send-message", this.newMessage);
        this.newMessage = "";
      }
    },
    toggleEmoji() {
      this.isEmojiVisible = !this.isEmojiVisible;
    },
    addEmoji(emoji) {
      this.newMessage += emoji;
      this.isEmojiVisible = false;
    },
    closeEmoji() {
      this.isEmojiVisible = false;
    },
    toggleClipboard() {
      this.isClipboardVisible = !this.isClipboardVisible;
    },
    addClipboard(Clipboard) {
      this.newMessage += Clipboard;
      this.isEmojiVisible = false;
    },
    closeClipboard() {
      this.isClipboardVisible = false;
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
/* list emoji style */

.emoji-picker span {
  cursor: pointer;
  transition: transform 0.2s;
}
.emoji-picker .col-1:hover {
  transform: scale(1.2) !important;
  transition: transform 0.2s;
}

/* chat input */
.right-side .chat-input {
  height: 60px;
}
.right-side .listClipboard {
  cursor: pointer;
  left: 1%;
}
</style>
