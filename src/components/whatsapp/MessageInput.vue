<template>
  <div class="chat-input w-100 position-relative">
    <div class="d-flex align-items-center gap-1">
      <div
        class="actions-group d-flex justify-content-center align-items-center gap-2 bg-success rounded-2 rounded-end-0"
      >
        <div class="emoje">
          <button
            type="submit"
            @click="toggleEmoji"
            v-click-outside="closeEmoji"
            class="btn bg-transparent p-1"
            aria-label="Emojis"
          >
            <i class="fa-regular fa-face-smile fs-6 text-white"></i>
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
        <div class="upload_file btn d-block position-relative p-0 pe-1">
          <form action="">
            <label for="file" class="upload-label">
              <i class="fa-solid fa-paperclip upload-icon fs-6 text-white"></i>
            </label>
            <input
              type="file"
              id="file"
              class="file-upload position-relative position-absolute end-0 top-0 h-100 w-100 opacity-0"
              autocomplete="off"
              aria-label="uploadFile"
              multiple
              accept="*/*"
              @change="handleFileUpload"
            />
          </form>
        </div>
        <!-- <div class="Clipboard">
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
        </div> -->
      </div>
      <div class="flex-grow-1 position-relative">
        <!-- message warning -->
        <div
          v-if="showWarning"
          class="message-warning bg-white text-dark position-absolute py-1 px-3 rounded-3 d-flex justify-content-between align-items-center"
        >
          <span class="me-2 w-100"
            >to send the message you must click on the send button
          </span>
          <button
            class="btn btn-sm text-end btnConfirm bg-success fw-bold text-white"
            @click="hideWarning"
          >
            Confirm
          </button>
        </div>
        <!-- <div
          v-if="attachedImage"
          class="attached-image-preview position-absolute"
        >
          <img
            :src="attachedImage"
            alt="Attached Image"
            class="preview-image"
          />
          <span class="image-name">{{ attachedFileName }}</span>
          <button @click="removeImage" class="remove-image-btn">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <div
          v-if="attachedFile"
          class="attached-image-preview position-absolute"
        >
          <i class="fa-solid fa-file fs-1 me-2"></i>
          <span class="image-name">{{ attachedFileName }}</span>
          <button @click="removeImage" class="remove-image-btn">
            <i class="fa-solid fa-times"></i>
          </button>
        </div> -->
        <div
          v-if="isModalOpen"
          class="modal-overlay"
          v-click-outside="closeModalImage"
        >
          <div class="modal-content rounded-3" @click.stop>
            <div class="modal-body">
              <div v-if="attachedFileType === 'image'">
                <img
                  :src="attachedFilePreview"
                  alt="Attached Image"
                  class="preview-image"
                />
              </div>
              <div v-else-if="attachedFileType === 'file'">
                <div class="file-preview">
                  <i class="fa-solid fa-file fs-1"></i>
                  <span class="file-name">{{ attachedFileName }}</span>
                </div>
              </div>
              <hr class="my-2" />
              <div class="input-group mt-2 w-100">
                <input
                  type="text"
                  v-model="newMessageImage"
                  placeholder="أضف وصفًا ..."
                  class="caption-input rounded-start-3 flex-grow-1"
                />
                <button
                  @click="sendMessage"
                  class="btn border-0 text-white btn-success"
                >
                  <i class="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="isProcessing"
          class="attached-image-preview position-absolute"
        >
          <i class="fa-solid fa-spinner fa-spin fs-1 me-2"></i>
          <span class="image-name">Processing voice message...</span>
        </div>
        <!-- <input
          type="text"
          ref="messageInput"
          placeholder="Start typing..."
          id="inputMassege"
          class="fs-6 border-0 py-2 px-2 w-100"
          style="outline: none; height: 42px"
          v-model="newMessage"
          @keyup.enter="sendMessage"
          v-if="!isRecording"
        /> -->
        <textarea
          ref="messageInput"
          placeholder="Start typing..."
          id="inputMassege"
          class="textarea-input fs-6 border-0 py-2 px-2 w-100 position-absolute"
          style="
            outline: none;
            height: 40px;
            max-height: 150px;
            overflow-y: auto;
            resize: none;
          "
          v-model="newMessage"
          @input="autoResize"
          @keydown.enter="handleEnter"
          v-if="!isRecording"
        />
        <!-- @keyup.enter="sendMessage" -->
        <span
          v-else
          class="recording-container rounded-5 fs-6 border-0 py-2 px-4 w-100 bg-light"
        >
          <div class="recording-lines">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
          </div>
          <span class="recording-duration">
            {{ formatDuration(recordingDuration) }}
          </span>
        </span>
      </div>
      <div class="send-button">
        <button
          type="button"
          class="submitMsg position-relative border-0 bg-success rounded-2 rounded-start-0"
          @click="StartRecordingVoice"
          aria-label="voiceMessage start"
          v-if="
            !attachedImage &&
            newMessage.trim() === '' &&
            !attachedFile &&
            !isRecording
          "
        >
          <i
            ref="voiceIcon"
            class="fa-solid fa-microphone d-block fs-6 text-white"
            id="voiceIcon"
          ></i>
        </button>
        <button
          type="button"
          class="submitMsg position-relative border-0 bg-danger rounded-2 rounded-start-0"
          @click="stopRecordingVoice"
          aria-label="voiceMessage stop"
          v-else-if="
            !attachedImage &&
            newMessage.trim() === '' &&
            isRecording &&
            !attachedFile
          "
        >
          <i
            ref="voiceIcon"
            class="fa-solid fa-stop d-block fs-6 text-white"
            id="voiceIcon"
          ></i>
        </button>
        <button
          type="submit"
          class="submitMsg position-relative border-0 bg-success rounded-2 rounded-start-0"
          @click="sendMessage"
          aria-label="sendMessage"
          v-else-if="
            (attachedImage || newMessage.trim() !== '' || attachedFile) &&
            !isRecording
          "
        >
          <i
            ref="sendIcon"
            class="fa-solid fa-paper-plane d-block position-relative fs-6 text-white"
            id="sendIcon"
          ></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { FFmpeg } from "@ffmpeg/ffmpeg";
export default {
  name: "MessageInput",
  data() {
    return {
      newMessage: "",
      isEmojiVisible: false,
      isClipboardVisible: false,
      currentLanguage: "en",
      attachedImage: null,
      attachedFile: null,
      attachedFileName: "",
      isRecording: false,
      mediaRecorder: null,
      recordingDuration: 0,
      isProcessing: false,
      recordingTimer: null,
      isModalOpen: false,
      caption: "",
    };
  },
  setup(_, { emit }) {
    const showWarning = ref(true);

    const hideWarning = () => {
      showWarning.value = false;
      emit("send-init-message");
    };

    return {
      showWarning,
      hideWarning,
    };
  },
  methods: {
    handleEnter(event) {
      if (!event.shiftKey) {
        event.preventDefault();
        this.sendMessage();
      }
    },
    autoResize() {
      const textarea = this.$refs.messageInput;
      textarea.style.height = "40px";
      const newHeight = textarea.scrollHeight;
      const maxRows = 7;
      const lineHeight = 22;
      textarea.style.height = Math.min(newHeight, maxRows * lineHeight) + "px";
    },
    resetTextareaSize() {
      const textarea = this.$refs.messageInput;
      textarea.style.height = "40px";
    },
    async sendMessage() {
      if (this.newMessage.trim() !== "" || this.attachedFile) {
        try {
          const messageData = {
            text_body: this.newMessage?.trim(),
            file: this.attachedFile,
          };

          if (this.$attrs.conversationId) {
            messageData.conversation_id = this.$attrs.conversationId;
          }

          await this.$emit("send-message", messageData);
          this.newMessage = "";
          this.resetTextareaSize();
          this.removeFile();
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
      console.log("File changed:", this.attachedFile);
      this.isProcessing = true;
      const files = event.target.files;
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          console.log("File Name:", file.name);
          console.log("File size:", file.size, "بايت");
          console.log("File Type:", file.type);

          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
              this.attachedFilePreview = e.target.result;
              this.attachedFile = file;
              this.attachedFileName = file.name;
              this.attachedFileType = "image";
              this.isModalOpen = true;
            };
            reader.readAsDataURL(file);
          } else {
            this.attachedFilePreview = URL.createObjectURL(file);
            this.attachedFile = file;
            this.attachedFileName = file.name;
            this.attachedFileType = "file";
            this.isModalOpen = true;
          }
        }
      } else {
        console.log("لم يتم تحديد أي ملفات.");
      }
      this.isProcessing = false;
    },
    removeFile() {
      this.attachedFile = null;
      this.attachedFileName = "";
      this.attachedFileType = "";
      this.isModalOpen = false;
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModalImage() {
      const modalContent = document.querySelector(".modal-content");
      modalContent.style.animation = "slideDown 0.3s ease-out forwards";
      setTimeout(() => {
        this.isModalOpen = false;
      }, 300);
    },
    StartRecordingVoice() {
      if (this.isRecording) {
        return;
      }
      this.isRecording = true;
      this.recordingDuration = 0;
      clearInterval(this.recordingTimer);
      this.recordingTimer = setInterval(() => {
        this.recordingDuration++;
      }, 1000);
      let audioChunks = [];

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("Audio recording is not supported in this browser.");
        return;
      }

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: "audio/webm",
          });
          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunks.push(event.data);
            }
          };

          this.mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            const formattedAudio = await this.formatAudio(audioBlob);
            this.attachedFile = formattedAudio;
            this.attachedFilePreview = URL.createObjectURL(formattedAudio);
            this.attachedFileType = "file";
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            this.attachedFileName = `voice_message_${timestamp}.ogg`;
            this.isModalOpen = true;
            audioChunks = [];
            this.isProcessing = false;
          };

          this.mediaRecorder.start();
          console.log("Recording started...");
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
    },
    stopRecordingVoice() {
      if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
        clearInterval(this.recordingTimer);
        this.isProcessing = true;
        this.mediaRecorder.stop();
        this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
        console.log("Recording stopped and media tracks closed.");
        this.isRecording = false;
      }
    },
    async formatAudio(blob) {
      try {
        const ffmpeg = new FFmpeg({
          log: true,
        });
        await ffmpeg.load();
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        await ffmpeg.writeFile("input.webm", uint8Array);
        await ffmpeg.exec([
          "-i",
          "input.webm",
          "-c:a",
          "libopus",
          "-b:a",
          "64k",
          "output.ogg",
        ]);
        const data = await ffmpeg.readFile("output.ogg");
        const oggBlob = new Blob([data.buffer], { type: "audio/ogg" });

        return oggBlob;
      } catch (error) {
        console.error("Conversion error:", error);
        throw error;
      }
    },
    formatDuration(duration) {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
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
  padding: 4px 10px !important;
}

.send-button {
  width: 40px;
  height: 40px;
}
.message-warning {
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 80% !important;
}
.file-upload {
  cursor: pointer;
}
.btnConfirm {
  padding: 0px 10px;
}
.upload-icon:hover {
  cursor: pointer;
  border: 1px solid #000 !important;
}

.attached-image-preview {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  top: -72px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
}

.preview-image {
  width: 50px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px;
}

.image-name {
  flex-grow: 1;
  font-size: 14px;
  color: #333;
}

.remove-image-btn {
  background: none;
  border: none;
  color: #ff0000;
  cursor: pointer;
}

.remove-image-btn:hover {
  color: #cc0000;
}

.recording-container {
  display: flex;
  align-items: center;
  position: relative;
}

.recording-duration {
  margin-left: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #0f0f0fc4;
}

.recording-lines {
  display: flex;
  justify-content: space-between;
  width: 40px;
  height: 20px;
  margin-right: 10px;
  position: relative;
}

.line {
  width: 4px;
  height: 100%;
  background-color: #4caf50;
  animation: pulse 1s infinite ease-in-out;
}

.line:nth-child(1) {
  animation-delay: 0s;
}

.line:nth-child(2) {
  animation-delay: 0.2s;
}

.line:nth-child(3) {
  animation-delay: 0.4s;
}
.line:nth-child(4) {
  animation-delay: 0.6s;
}
.line:nth-child(5) {
  animation-delay: 0.8s;
}
/* modal style */
.modal-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 100%;
  max-width: 400px;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  transform: translateY(100%);
  animation: slideUp 0.3s ease-out forwards;
}
@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes slideDown {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}
.modal-body {
  padding: 10px;
}

.preview-image {
  width: 100%;
  max-height: 600px;
  border-radius: 8px;
}

.caption-input {
  padding: 8px;
  border: 1px solid #ddd;
}

.file-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.file-preview i {
  color: #007bff;
}

.file-name {
  margin-top: 10px;
  font-size: 16px;
  color: #333;
}
.textarea-input {
  bottom: -20px;
  color: #000000c6;
}
.textarea-input::-webkit-scrollbar {
  width: 8px;
}

.textarea-input::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.textarea-input::-webkit-scrollbar-thumb {
  background: #888888cb;
  border-radius: 4px;
}

.textarea-input::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
