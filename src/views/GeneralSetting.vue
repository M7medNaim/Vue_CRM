<template>
  <div class="mt-4 me-2 bg-white p-4 rounded-3">
    <form>
      <div class="row g-4">
        <!-- App Name -->
        <div class="col-12 col-md-6">
          <div class="form-group">
            <label class="form-label">
              {{ t("settings.appName") }}<span class="text-danger">*</span>
            </label>
            <input
              type="text"
              class="form-control"
              v-model="settings.appName"
              placeholder="CRM Staging"
            />
          </div>
        </div>

        <!-- Plan Expire Notification -->
        <div class="col-12 col-md-6 col-lg-3">
          <div class="form-group">
            <label class="form-label">
              {{ t("settings.planExpireNotification") }}
              <span class="text-danger">*</span>
            </label>
            <input
              type="number"
              class="form-control"
              v-model="settings.planExpireDays"
              placeholder="6"
            />
          </div>
        </div>
        <!-- Default Country Code -->
        <div class="col-12 col-md-6 col-lg-3">
          <div class="form-group">
            <label class="form-label">
              {{ t("settings.defaultCountryCode") }}
              <span class="text-danger">*</span>
            </label>
            <div
              class="input-group d-flex align-items-stretch position-relative"
            >
              <div class="country-flag-container">
                <Multiselect
                  v-model="settings.defaultCountry"
                  :options="countries"
                  :searchable="false"
                  placeholder="Select Country"
                  label="label"
                  valueProp="value"
                  class="country-select"
                >
                  <template #option="{ option }">
                    <div class="d-flex align-items-center country-option">
                      <img :src="option.flag" class="country-flag me-2" />
                      <span>{{ option.label }}</span>
                      <span class="ms-1 text-muted"
                        >+{{ option.dialCode }}</span
                      >
                    </div>
                  </template>
                  <template #singleLabel="{ option }">
                    <div class="d-flex align-items-center selected-country">
                      <img :src="option.flag" class="country-flag me-2" />
                      <span>+{{ option.dialCode }}</span>
                    </div>
                  </template>
                </Multiselect>
              </div>
              <input
                type="text"
                class="form-control"
                :value="selectedCountryText"
                style="font-size: 14px !important"
              />
            </div>
          </div>
        </div>

        <!-- Current Currency -->
        <div class="col-12 col-md-6">
          <div class="form-group">
            <label class="form-label">
              {{ t("settings.currentCurrency") }}
              <span class="text-danger">*</span>
            </label>
            <Multiselect
              v-model="settings.currency"
              :options="currencies"
              :searchable="true"
              placeholder="Select Currency"
              label="label"
              valueProp="value"
              class="form-control p-0"
            >
              <template #option="{ option }">
                {{ option.symbol }} {{ option.label }}
              </template>
            </Multiselect>
          </div>
        </div>

        <!-- Enable Google reCAPTCHA -->
        <div class="col-12 col-md-6 col-lg-3">
          <div class="form-group">
            <label class="form-label d-block">
              {{ t("settings.enableGoogleRecaptcha") }}
            </label>
            <div class="form-check form-switch">
              <input
                class="form-check-input shadow-none custom-switch"
                type="checkbox"
                v-model="settings.enableRecaptcha"
              />
            </div>
          </div>
        </div>

        <!-- Language -->
        <div class="col-12 col-md-6 col-lg-3">
          <div class="form-group">
            <label class="form-label">
              {{ t("forms.language") }}
            </label>
            <Multiselect
              v-model="settings.language"
              :options="languages"
              :searchable="true"
              placeholder="Select Language"
              label="label"
              valueProp="value"
              class="form-control p-0"
            >
              <template #option="{ option }">
                {{ option.label }}
              </template>
            </Multiselect>
          </div>
        </div>

        <div class="googleCaptcha" v-if="settings.enableRecaptcha">
          <div class="row">
            <div class="col-12 col-md-6">
              <div class="form-group">
                <label class="form-label">
                  {{ t("settings.googleCaptchaKey") }}
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="settings.googleCaptchaKey"
                  placeholder="Google Captcha key"
                />
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-group">
                <label class="form-label">
                  {{ t("settings.googleCaptchaSecret") }}
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="settings.googleCaptchaSecret"
                  placeholder="Google Captcha Secret"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- Manual Instruction -->
        <div class="col-12 col-md-6">
          <div class="form-group">
            <label class="form-label">
              {{ t("settings.manualInstruction") }}
            </label>
            <textarea
              class="form-control"
              v-model="settings.manualInstruction"
              rows="4"
              placeholder="Manual Instruction"
            ></textarea>
          </div>
        </div>
        <!-- App Logo -->
        <div class="col-6 col-md-3">
          <div class="form-group">
            <label class="form-label">
              {{ t("settings.appLogo") }}
              <i class="fa-solid fa-pen" title="Upload your app logo here"></i>
            </label>
            <div class="image-upload-container">
              <div class="current-image">
                <img
                  :src="settings.appLogo || defaultImage"
                  alt="App Logo"
                  class="preview-image"
                />
                <label class="edit-icon">
                  <i class="bi bi-pencil-fill"></i>
                  <input
                    type="file"
                    class="d-none"
                    @change="handleLogoUpload"
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Favicon -->
        <div class="col-6 col-md-3">
          <div class="form-group">
            <label class="form-label">
              {{ t("settings.favicon") }} <span class="text-danger">*</span>
              <i class="fa-solid fa-pen" title="Upload your favicon here"></i>
            </label>
            <div class="image-upload-container position-relative">
              <div class="current-image">
                <img
                  :src="settings.favicon || defaultImage"
                  alt="Favicon"
                  class="preview-image"
                />
                <label class="edit-icon">
                  <i class="bi bi-pencil-fill"></i>
                  <input
                    type="file"
                    class="d-none"
                    @change="handleFaviconUpload"
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="col-12">
          <button
            type="submit"
            class="btn btn-primary"
            @click.prevent="saveSettings"
          >
            {{ t("buttons.saveChanges") }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import defaultImage from "@/assets/new-nokta-logo.png";
import { useI18n } from "vue-i18n";

export default {
  name: "GeneralSetting",
  components: {
    Multiselect,
  },
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    return { toast, t };
  },
  data() {
    return {
      settings: {
        appName: "CRM Staging",
        planExpireDays: 6,
        defaultCountry: {
          label: "Turkey (Türkiye)",
          value: "TR",
          flag: "https://flagcdn.com/w20/tr.png",
          dialCode: "90",
        },
        currency: { label: "United States Dollar", value: "USD", symbol: "$" },
        enableRecaptcha: false,
        googleCaptchaKey: "",
        googleCaptchaSecret: "",
        language: { label: "English", value: "en" },
        manualInstruction: "manual instruction",
        appLogo: defaultImage,
        favicon: defaultImage,
      },
      currencies: [
        { label: "United States Dollar", value: "USD", symbol: "$" },
        { label: "Euro", value: "EUR", symbol: "€" },
        { label: "British Pound", value: "GBP", symbol: "£" },
        { label: "Japanese Yen", value: "JPY", symbol: "¥" },
        { label: "Turkish Lira", value: "TRY", symbol: "₺" },
        { label: "Indian Rupee", value: "INR", symbol: "₹" },
        { label: "Chinese Yuan", value: "CNY", symbol: "¥" },
      ],
      languages: [
        { label: "English", value: "en" },
        { label: "Turkish", value: "tr" },
        { label: "Arabic", value: "ar" },
        { label: "French", value: "fr" },
        { label: "German", value: "de" },
        { label: "Spanish", value: "es" },
        { label: "Chinese", value: "zh" },
      ],
      countries: [
        {
          value: "TR",
          label: "Turkey (Türkiye)",
          flag: "https://flagcdn.com/w20/tr.png",
          dialCode: "90",
        },
        {
          value: "TO",
          label: "Tonga",
          flag: "https://flagcdn.com/w20/to.png",
          dialCode: "676",
        },
        {
          value: "TT",
          label: "Trinidad and Tobago",
          flag: "https://flagcdn.com/w20/tt.png",
          dialCode: "1",
        },
        {
          value: "TN",
          label: "Tunisia (تونس)",
          flag: "https://flagcdn.com/w20/tn.png",
          dialCode: "216",
        },
      ],
    };
  },
  methods: {
    saveSettings() {
      try {
        if (!this.settings.appName?.trim()) {
          this.toast.error(this.$t("error.required"), {
            timeout: 3000,
          });
          return;
        }

        if (!this.settings.planExpireDays) {
          this.toast.error(this.$t("error.requiredplanExpireDays"), {
            timeout: 3000,
          });
          return;
        }

        if (!this.settings.defaultCountry) {
          this.toast.error(this.$t("error.requiredDefaultCountry"), {
            timeout: 3000,
          });
          return;
        }

        if (!this.settings.currency) {
          this.toast.error(this.$t("error.requiredCurrency"), {
            timeout: 3000,
          });
          return;
        }

        if (this.settings.enableRecaptcha) {
          if (!this.settings.googleCaptchaKey?.trim()) {
            this.toast.error(this.$t("error.requiredGoogleCaptchaKey"), {
              timeout: 3000,
            });
            return;
          }
          if (!this.settings.googleCaptchaSecret?.trim()) {
            this.toast.error(this.$t("error.requiredGoogleCaptchaSecret"), {
              timeout: 3000,
            });
            return;
          }
        }

        console.log("Settings saved:", this.settings);
        this.toast.success(this.$t("success.saved"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error saving settings:", error);
        this.toast.error(this.$t("error.saveFailed"), {
          timeout: 3000,
        });
      }
    },
    handleLogoUpload(event) {
      try {
        const file = event.target.files[0];
        if (file) {
          if (!file.type.startsWith("image/")) {
            this.toast.error(this.$t("error.invalidFile"), {
              timeout: 3000,
            });
            return;
          }
          this.settings.appLogo = URL.createObjectURL(file);
          this.toast.success(this.$t("success.updatedAppLogo"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        console.error("Error uploading logo:", error);
        this.toast.error(this.$t("error.uploadFailed"), {
          timeout: 3000,
        });
      }
    },
    handleFaviconUpload(event) {
      try {
        const file = event.target.files[0];
        if (file) {
          if (!file.type.startsWith("image/")) {
            this.toast.error(this.$t("error.invalidFile"), {
              timeout: 3000,
            });
            return;
          }
          this.settings.favicon = URL.createObjectURL(file);
          this.toast.success(this.$t("success.updatedFavicon"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        console.error("Error uploading favicon:", error);
        this.toast.error(this.$t("error.uploadFaviconFailed"), {
          timeout: 3000,
        });
      }
    },
  },
  watch: {
    "settings.enableRecaptcha"(newValue) {
      if (!newValue) {
        this.settings.googleCaptchaKey = "";
        this.settings.googleCaptchaSecret = "";
        this.toast.info(this.$t("success.disabledRecaptcha"), {
          timeout: 3000,
        });
      } else {
        this.toast.info(this.$t("success.enabledRecaptcha"), {
          timeout: 3000,
        });
      }
    },
  },
  computed: {
    selectedCountryText() {
      if (!this.settings.defaultCountry) return "";

      if (typeof this.settings.defaultCountry === "object") {
        return `${this.settings.defaultCountry.label} +${this.settings.defaultCountry.dialCode}`;
      }

      const country = this.countries.find(
        (c) => c.value === this.settings.defaultCountry
      );
      if (!country) return "";
      return `${country.label} +${country.dialCode}`;
    },
  },
};
</script>

<style scoped>
.form-check-input:checked {
  background-color: #a23737 !important;
  border-color: #a23737 !important;
  box-shadow: none !important;
}
input:focus {
  box-shadow: none !important;
  border-color: #eee !important;
}

.country-flag {
  width: 20px;
  height: 15px;
  object-fit: cover;
}
.custom-switch {
  width: 2.5rem !important;
  height: 1.4rem !important;
}
.image-upload-container {
  position: relative;
  width: 100px;
  height: 100px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
}

.current-image {
  width: 100%;
  height: 100%;
  position: relative;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #f8f9fa;
}

.edit-icon {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s;
}

.current-image:hover .edit-icon {
  opacity: 1;
}

.country-flag-container {
  position: static;
  width: 100px;
  cursor: pointer;
}

.country-select {
  width: 100px !important;
  min-width: 100px !important;
}

.country-select:deep(.multiselect) {
  position: static !important;
}

.country-select:deep(.multiselect__tags) {
  border-right: 1px solid #ced4da !important;
  min-height: 38px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  background-color: #eee !important;
}

.country-select:deep(.multiselect__content-wrapper) {
  position: absolute;
  width: calc(100% + 200px) !important;
  left: 0;
  margin-top: 4px;
  z-index: 1000;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.country-select:deep(.multiselect__single) {
  background-color: #eee !important;
}
.selected-country {
  padding-right: 20px;
  font-size: 14px;
  height: 24px !important;
  max-height: 24px !important;
}

.country-select:deep(.multiselect__select) {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 0 8px;
}
</style>
