<template>
  <div class="chat-input w-100 position-relative">
    <div class="d-flex align-items-center gap-3 p-2">
      <div
        class="actions-group d-flex justify-content-center align-items-center gap-2 bg-secondary-subtle mt-1 rounded-5"
      >
        <div class="emoje">
          <button
            type="submit"
            @click="toggleEmoji"
            v-click-outside="closeEmoji"
            class="border-0 bg-transparent"
            aria-label="Emojis"
          >
            <i class="fa-regular fa-face-smile fs-6 text-dark"></i>
          </button>
          <!-- all Emojis -->
          <div
            v-if="isEmojiVisible"
            class="emoji-picker bg-white rounded-2 border border-1 border-dark-subtle p-1 d-flex flex-wrap gap-2 w-25 position-absolute fs-5 text-center start-0 bottom-100"
          >
            <div class="row">
              <div class="col-1 ms-1">
                <span @click="addEmoji('😀')">😀</span>
              </div>
              <div class="col-1 ms-1">
                <span @click="addEmoji('😍')">😍</span>
              </div>
              <div class="col-1 ms-1">
                <span @click="addEmoji('😅')">😅</span>
              </div>
              <div class="col-1 ms-1">
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
          <form action="">
            <label for="file" class="upload-label">
              <i class="fa-solid fa-paperclip upload-icon fs-6 text-dark"></i>
            </label>
            <input
              type="file"
              id="file"
              class="file-upload position-relative position-absolute end-0 top-0 h-100 w-100 opacity-0"
              autocomplete="off"
              aria-label="uploadFile"
              multiple
              accept="image/*, .pdf, .doc, .txt"
              @change="handleFileUpload"
            />
          </form>
        </div>
        <div class="Clipboard">
          <button
            @click="toggleClipboard"
            v-click-outside="closeClipboard"
            aria-label="Clipboard"
            class="border-0 bg-transparent fs-6 text-dark pb-1"
          >
            <i class="fa-regular fa-clipboard"></i>
          </button>
          <div
            v-if="isClipboardVisible"
            :class="{
              'text-end': currentLanguage === 'ar',
              'text-start': currentLanguage === 'en',
            }"
            :dir="currentLanguage === 'ar' ? 'rtl' : 'ltr'"
            class="listClipboard row bg-body-tertiary border border-1 border-dark-subtle text-start w-25 position-absolute fs-6 bottom-100 text-break text-wrap"
          >
            <div
              class="col-12 border-bottom border-secondary-subtle w-100 d-flex justify-content-between align-items-center py-2 bg-secondary-subtle"
            >
              <i class="fa-solid fa-xmark fs-5"></i>
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="toggleLanguage"
              >
                {{ currentLanguage === "ar" ? "AR" : "EN" }}
              </button>
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
      <div class="flex-grow-1 position-relative">
        <!-- message warning -->
        <div
          v-if="showWarning"
          class="message-warning text-white position-absolute py-1 px-3 rounded-3 d-flex justify-content-between align-items-center"
        >
          <span class="me-2"
            >to send the message you must click on the send button
          </span>
          <button class="btn btn-sm text-end btnConfirm" @click="hideWarning">
            Confirm
          </button>
        </div>
        <input
          type="text"
          ref="messageInput"
          :placeholder="$t('whatsapp.typeOfMessage')"
          id="inputMassege"
          class="rounded-5 fs-6 border-0 py-2 px-4 w-100"
          style="outline: none; height: 45px"
          v-model="newMessage"
        />
      </div>
      <div class="send-button">
        <button
          type="submit"
          class="submitMsg position-relative border-0 bg-success rounded-5"
          @click="sendMessage"
          aria-label="sendMessage && voiceMessage"
        >
          <i
            ref="voiceIcon"
            class="fa-solid fa-microphone d-block fs-6 text-white"
            id="voiceIcon"
            v-if="newMessage.trim() === ''"
          ></i>
          <i
            ref="sendIcon"
            class="fa-solid fa-paper-plane d-block position-relative fs-6 text-white"
            id="sendIcon"
            v-if="newMessage.trim() !== ''"
          ></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "MessageInput",
  data() {
    return {
      newMessage: "",
      isEmojiVisible: false,
      isClipboardVisible: false,
      currentLanguage: "en",
    };
  },
  setup() {
    const showWarning = ref(true);

    const hideWarning = () => {
      showWarning.value = false;
    };

    return {
      showWarning,
      hideWarning,
    };
  },
  methods: {
    // sendMessage() {
    //   if (this.newMessage.trim() !== "") {
    //     this.$emit("send-message", this.newMessage);
    //     this.newMessage = "";
    //     this.$emit("scroll-to-bottom");
    //   }
    // },
    async sendMessage() {
      if (this.newMessage.trim() !== "") {
        try {
          const messageData = {
            text_body: this.newMessage.trim(),
          };

          if (this.$attrs.conversationId) {
            messageData.conversation_id = this.$attrs.conversationId;
          }

          await this.$emit("send-message", messageData);
          this.newMessage = "";
          this.$emit("scroll-to-bottom");
        } catch (error) {
          console.error("Error preparing message:", error);
        }
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
    toggleLanguage() {
      this.currentLanguage = this.currentLanguage === "en" ? "ar" : "en";
      this.isClipboardVisible = false;
    },
    addClipboard(Clipboard) {
      this.newMessage += Clipboard;
      this.isEmojiVisible = false;
    },
    closeClipboard() {
      this.isClipboardVisible = false;
    },
    handleFileUpload(event) {
      const files = event.target.files;
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          console.log("تم اختيار الملف:", file.name);
          console.log("حجم الملف:", file.size, "بايت");
          console.log("نوع الملف:", file.type);

          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const imagePreview = e.target.result;
              console.log(
                "تم رفع الصورة بنجاح. المعاينة Base64:",
                imagePreview
              );
            };
            reader.readAsDataURL(file);
          } else {
            console.log("تم رفع ملف غير صورة:", file.name);
          }
        }
      } else {
        console.log("لم يتم تحديد أي ملفات.");
      }
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
  height: 100%;
}
.right-side .listClipboard {
  cursor: pointer;
  left: 1%;
}
.submitMsg {
  width: 40px;
  height: 40px;
}

.actions-group {
  min-width: fit-content;
  padding: 6px 10px !important;
}

.send-button {
  width: 40px;
  height: 40px;
}
.message-warning {
  background-color: rgba(128, 128, 128, 0.961);
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
}
.file-upload {
  cursor: pointer;
}
.btnConfirm {
  background-color: #cec5c5f5;
  padding: 0px 10px;
  color: #000;
}
.btnConfirm:hover {
  background-color: #2c2727;
  padding: 0px 10px;
  color: #fff;
}
</style>
