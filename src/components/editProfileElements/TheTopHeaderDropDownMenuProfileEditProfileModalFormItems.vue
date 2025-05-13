<template>
  <div class="mb-3">
    <!-- <label for="profileImage" class="form-label">الصورة الشخصية</label> -->
    <div class="my-2 text-center">
      <img
        :src="localImage || require('@/assets/default-user-image.jpg')"
        class="img-fluid rounded"
        width="100"
        alt="Profile Image"
      />
    </div>
    <input
      type="file"
      class="form-control"
      id="profileImage"
      @change="updateImage"
    />
  </div>
  <div class="mb-3">
    <label for="name" class="form-label">{{ t("modals.name") }}</label>
    <input
      type="text"
      class="form-control"
      placeholder="User Name"
      id="name"
      v-model="localName"
    />
  </div>

  <div class="mb-3">
    <label for="email" class="form-label">{{ t("modals.email") }}</label>
    <input
      type="email"
      class="form-control"
      placeholder="Email"
      id="email"
      v-model="localEmail"
    />
  </div>

  <div v-if="errorMessage" class="alert alert-danger">
    {{ errorMessage }}
  </div>
  <div v-if="successMessage" class="alert alert-success">
    {{ successMessage }}
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
export default {
  name: "TheTopHeaderDropDownMenuProfileEditProfileModalFormItems",
  props: ["name", "email", "image"],
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      localName: this.name,
      localEmail: this.email,
      localImage: this.image,
    };
  },
  methods: {
    updateImage(event) {
      const file = event.target.files[0];
      if (file) {
        this.localImage = URL.createObjectURL(file);
      }
    },
  },
};
</script>

<style scoped>
select:focus,
input:focus {
  box-shadow: none;
  outline: none;
}
</style>
