<template>
  <div
    class="modal fade"
    id="questionsModal"
    tabindex="-1"
    aria-labelledby="questionsModalLabel"
    aria-hidden="true"
    ref="questionsModal"
    data-bs-backdrop="true"
  >
    <div
      class="modal-dialog modal-lg modal-dialog-scrollable position-fixed end-0"
    >
      <div class="modal-content ps-3">
        <div class="modal-header border-bottom-0">
          <h6 class="modal-title fw-semibold" id="questionsModalLabel">
            {{ t("modals.questionsList") }}
          </h6>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <!-- age -->
            <div class="question bg-light ps-2 py-2 mb-2">
              <p class="fw-medium">{{ t("modals.whatIsYourAge") }}</p>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="age"
                  id="35"
                />
                <label class="form-check-label" for="35">30 - 35</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="age"
                  id="45"
                />
                <label class="form-check-label" for="45">35 - 45</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="age"
                  id="55"
                />
                <label class="form-check-label" for="55">45 - 55</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="age"
                  id="60"
                />
                <label class="form-check-label" for="60">55 - 60+</label>
              </div>
            </div>
            <!-- weight -->
            <div class="question bg-light ps-2 py-2 mb-2">
              <p class="fw-medium">{{ t("modals.whatIsYourWeight") }}</p>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="weight"
                  id="Underweight"
                />
                <label class="form-check-label" for="Underweight">{{
                  t("modals.underweight")
                }}</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="weight"
                  id="normal"
                />
                <label class="form-check-label" for="normal">{{
                  t("modals.normal")
                }}</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="weight"
                  id="overweight"
                />
                <label class="form-check-label" for="overweight">{{
                  t("modals.overweight")
                }}</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="weight"
                  id="obese"
                />
                <label class="form-check-label" for="obese">{{
                  t("modals.obese")
                }}</label>
              </div>
            </div>
            <!-- height -->
            <div class="question bg-light ps-2 py-2 mb-2">
              <p class="fw-medium">{{ t("modals.whatIsYourHeight") }}</p>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="height"
                  id="short"
                />
                <label class="form-check-label" for="short">{{
                  t("modals.short")
                }}</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="height"
                  id="average"
                />
                <label class="form-check-label" for="average">{{
                  t("modals.average")
                }}</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="height"
                  id="tall"
                />
                <label class="form-check-label" for="tall">{{
                  t("modals.tall")
                }}</label>
              </div>
            </div>
            <!-- chronic diseases -->
            <div class="question bg-light ps-2 py-2 mb-2">
              <p class="fw-medium">
                {{ t("modals.doYouSufferFromAnyChronicDiseases") }}
              </p>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="chronic"
                  id="yesChronic"
                  v-model="showDiseases"
                  :value="true"
                />
                <label class="form-check-label" for="yesChronic">{{
                  t("modals.yes")
                }}</label>
              </div>
              <!-- showDiseases -->
              <div
                v-if="showDiseases"
                class="disease-options ms-4 my-1 ps-3"
                style="border-left: 1px dashed #333"
              >
                <span class="fw-semibold" style="font-size: 14px">{{
                  t("modals.pleaseListTheDiseases")
                }}</span>
                <div class="form-check">
                  <input
                    class="form-check-input bg-secondary-subtle p-2"
                    type="checkbox"
                    name="diseases"
                    id="diabetes"
                    v-model="selectedDiseases"
                    value="Diabetes"
                  />
                  <label class="form-check-label" for="diabetes">{{
                    t("modals.diabetes")
                  }}</label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input bg-secondary-subtle p-2"
                    type="checkbox"
                    name="diseases"
                    id="hypertension"
                    v-model="selectedDiseases"
                    value="Hypertension"
                  />
                  <label class="form-check-label" for="hypertension">{{
                    t("modals.hypertension")
                  }}</label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input bg-secondary-subtle p-2"
                    type="checkbox"
                    name="diseases"
                    id="heartDisease"
                    v-model="selectedDiseases"
                    value="Heart Disease"
                  />
                  <label class="form-check-label" for="heartDisease">{{
                    t("modals.heartDisease")
                  }}</label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input bg-secondary-subtle p-2"
                    type="checkbox"
                    name="diseases"
                    id="cholesterol"
                    v-model="selectedDiseases"
                    value="Cholesterol"
                  />
                  <label class="form-check-label" for="cholesterol">{{
                    t("modals.cholesterol")
                  }}</label>
                </div>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="chronic"
                  id="noChronic"
                  v-model="showDiseases"
                  :value="false"
                />
                <label class="form-check-label" for="noChronic">{{
                  t("modals.no")
                }}</label>
              </div>
            </div>
            <!-- surgeries -->
            <div class="question bg-light ps-2 py-2 mb-2">
              <p class="fw-medium">
                {{ t("modals.haveYouUndergoneAnyPreviousSurgeries") }}
              </p>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="surgeries"
                  id="yesSurgeries"
                  v-model="showSurgeriesInput"
                  :value="true"
                />
                <label class="form-check-label" for="yesSurgeries">{{
                  t("modals.yes")
                }}</label>
              </div>
              <div
                v-if="showSurgeriesInput"
                class="ms-4 mt-2 ps-4"
                style="border-left: 1px dashed #333"
              >
                <span class="fw-semibold mb-2" style="font-size: 14px">{{
                  t("modals.pleaseListTheSurgeries")
                }}</span>
                <input
                  type="text"
                  class="form-control mb-2 border-secondary-subtle"
                  :placeholder="t('modals.pleaseSpecifyTheSurgeries')"
                  v-model="surgeriesDetails"
                />
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="surgeries"
                  id="noSurgeries"
                  v-model="showSurgeriesInput"
                  :value="false"
                />
                <label class="form-check-label" for="noSurgeries">{{
                  t("modals.no")
                }}</label>
              </div>
            </div>

            <!-- smoking and alcohol -->
            <div class="question bg-light ps-2 py-2 mb-2">
              <p class="fw-medium">
                {{ t("modals.doYouSmokeOrDrinkAlcohol") }}
              </p>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="habits"
                  id="neither"
                />
                <label class="form-check-label" for="neither">{{
                  t("modals.iNeitherSmokeNorDrinkAlcohol")
                }}</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="habits"
                  id="smoke"
                />
                <label class="form-check-label" for="smoke">{{
                  t("modals.iSmoke")
                }}</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="habits"
                  id="drink"
                />
                <label class="form-check-label" for="drink">{{
                  t("modals.iDrink")
                }}</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="habits"
                  id="both"
                />
                <label class="form-check-label" for="both">{{
                  t("modals.iSmokeAndDrinkAlcohol")
                }}</label>
              </div>
            </div>

            <!-- erectile stimulants -->
            <div class="question bg-light ps-2 py-2 mb-2">
              <p class="fw-medium">
                {{ t("modals.doYouUseErectileStimulants") }}
              </p>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="stimulants"
                  id="yesStimulants"
                  v-model="showStimulantsDetails"
                  :value="true"
                />
                <label class="form-check-label" for="yesStimulants">{{
                  t("modals.yes")
                }}</label>
              </div>
              <!-- Stimulants Details -->
              <div
                v-if="showStimulantsDetails"
                class="question bg-light ms-4 ps-4 py-2"
                style="border-left: 1px dashed #333"
              >
                <div class="mb-3">
                  <span class="fw-semibold" style="font-size: 14px">{{
                    t("modals.pleaseSelectTheDosageOfViagra")
                  }}</span>
                  <div class="form-check">
                    <input
                      class="form-check-input bg-secondary-subtle p-2"
                      type="checkbox"
                      name="viagraDosage"
                      id="viagra25"
                      v-model="selectedViagraDosages"
                      value="25 mg"
                    />
                    <label class="form-check-label" for="viagra25"
                      >25 {{ t("modals.mg") }}</label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input bg-secondary-subtle p-2"
                      type="checkbox"
                      name="viagraDosage"
                      id="viagra50"
                      v-model="selectedViagraDosages"
                      value="50 mg"
                    />
                    <label class="form-check-label" for="viagra50"
                      >50 {{ t("modals.mg") }}</label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input bg-secondary-subtle p-2"
                      type="checkbox"
                      name="viagraDosage"
                      id="viagra100"
                      v-model="selectedViagraDosages"
                      value="100 mg"
                    />
                    <label class="form-check-label" for="viagra100"
                      >100 {{ t("modals.mg") }}</label
                    >
                  </div>
                </div>

                <div>
                  <span class="fw-semibold" style="font-size: 14px">{{
                    t("modals.pleaseSelectTheDosageOfCialis")
                  }}</span>
                  <div class="form-check">
                    <input
                      class="form-check-input bg-secondary-subtle p-2"
                      type="checkbox"
                      name="cialisDosage"
                      id="cialis2_5"
                      v-model="selectedCialisDosages"
                      value="2.5 mg"
                    />
                    <label class="form-check-label" for="cialis2_5"
                      >2.5 {{ t("modals.mg") }}</label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input bg-secondary-subtle p-2"
                      type="checkbox"
                      name="cialisDosage"
                      id="cialis5"
                      v-model="selectedCialisDosages"
                      value="5 mg"
                    />
                    <label class="form-check-label" for="cialis5"
                      >5 {{ t("modals.mg") }}</label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input bg-secondary-subtle p-2"
                      type="checkbox"
                      name="cialisDosage"
                      id="cialis10"
                      v-model="selectedCialisDosages"
                      value="10 mg"
                    />
                    <label class="form-check-label" for="cialis10"
                      >10 {{ t("modals.mg") }}</label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input bg-secondary-subtle p-2"
                      type="checkbox"
                      name="cialisDosage"
                      id="cialis20"
                      v-model="selectedCialisDosages"
                      value="20 mg"
                    />
                    <label class="form-check-label" for="cialis20"
                      >20 {{ t("modals.mg") }}</label
                    >
                  </div>
                </div>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="stimulants"
                  id="noStimulants"
                  v-model="showStimulantsDetails"
                  :value="false"
                />
                <label class="form-check-label" for="noStimulants">{{
                  t("modals.iDontUseThem")
                }}</label>
              </div>
            </div>
            <!-- erection level -->
            <div class="question bg-light ps-2 py-2 mb-2">
              <p class="fw-medium">
                {{
                  t(
                    "modals.howWouldYouRateYourErectionLevelWithoutUsingAnything"
                  )
                }}
              </p>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="erectionLevel"
                  id="veryWeak"
                />
                <label class="form-check-label" for="veryWeak">{{
                  t("modals.veryWeak")
                }}</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="erectionLevel"
                  id="weak"
                />
                <label class="form-check-label" for="weak">{{
                  t("modals.weak")
                }}</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="erectionLevel"
                  id="averageErection"
                />
                <label class="form-check-label" for="averageErection">{{
                  t("modals.average")
                }}</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="erectionLevel"
                  id="good"
                />
                <label class="form-check-label" for="good">{{
                  t("modals.good")
                }}</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="erectionLevel"
                  id="excellent"
                />
                <label class="form-check-label" for="excellent">{{
                  t("modals.excellent")
                }}</label>
              </div>
            </div>

            <!-- erection flexibility -->
            <div class="question bg-light ps-2 py-2 mb-2">
              <p class="fw-medium">
                {{
                  t(
                    "modals.doYouExperienceAnyFlexibilityOrSoftnessInTheErection"
                  )
                }}
              </p>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="flexibility"
                  id="yesFlexibility"
                />
                <label class="form-check-label" for="yesFlexibility">{{
                  t("modals.yes")
                }}</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="flexibility"
                  id="noFlexibility"
                />
                <label class="form-check-label" for="noFlexibility">{{
                  t("modals.no")
                }}</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="flexibility"
                  id="sometimesFlexibility"
                />
                <label class="form-check-label" for="sometimesFlexibility">{{
                  t("modals.sometimes")
                }}</label>
              </div>
            </div>

            <!-- premature ejaculation -->
            <div class="question bg-light ps-2 py-2 mb-2">
              <p class="fw-medium">
                {{ t("modals.doYouExperiencePrematureEjaculation") }}
              </p>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="ejaculation"
                  id="yesEjaculation"
                />
                <label class="form-check-label" for="yesEjaculation">{{
                  t("modals.yes")
                }}</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="ejaculation"
                  id="noEjaculation"
                />
                <label class="form-check-label" for="noEjaculation">{{
                  t("modals.no")
                }}</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="ejaculation"
                  id="sometimesEjaculation"
                />
                <label class="form-check-label" for="sometimesEjaculation">{{
                  t("modals.sometimes")
                }}</label>
              </div>
            </div>

            <!-- problem duration -->
            <div class="question bg-light ps-2 py-2 mb-2">
              <p class="fw-medium">
                {{ t("modals.whenDidYourSexualDysfunctionProblemStart") }}
              </p>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="problemDuration"
                  id="less6months"
                />
                <label class="form-check-label" for="less6months">{{
                  t("modals.lessThan6MonthsAgo")
                }}</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input p-2 bg-secondary-subtle"
                  type="radio"
                  name="problemDuration"
                  id="6to12months"
                />
                <label class="form-check-label" for="6to12months">{{
                  t("modals.lessThan1YearAgo")
                }}</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="problemDuration"
                  id="more1year"
                />
                <label class="form-check-label" for="more1year">{{
                  t("modals.moreThan1YearAgo")
                }}</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input bg-secondary-subtle p-2"
                  type="radio"
                  name="problemDuration"
                  id="longer"
                />
                <label class="form-check-label" for="longer">{{
                  t("modals.longerThanThat")
                }}</label>
              </div>
            </div>
            <!-- Additional Note: -->
            <div class="question bg-light px-2 py-2 mb-2">
              <p class="fw-medium">
                {{ t("modals.additionalNote") }}
              </p>
              <div class="form-text">
                <input
                  type="text"
                  :placeholder="t('modals.additionalNote')"
                  class="note w-100 rounded-3 p-2"
                />
              </div>
            </div>
            <div class="d-flex justify-content-end gap-2 mt-4">
              <button type="submit" class="btn btn-primary">
                {{ t("buttons.submit") }}
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                {{ t("buttons.close") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
export default {
  name: "questionsModal",
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      showDiseases: null,
      selectedDiseases: [],
      showSurgeriesInput: null,
      surgeriesDetails: "",
      showStimulantsDetails: null,
      selectedViagraDosages: [],
      selectedCialisDosages: [],
    };
  },
  methods: {
    submitForm() {
      // Handle form submission logic here
      console.log("Form submitted");
      console.log("Selected diseases:", this.selectedDiseases);
    },
  },
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.159);
}

.modal-dialog {
  bottom: -5%;
  width: 100%;
  height: 80vh;
}

.form-check-input:checked {
  background-color: black !important;
  border-color: black;
}

input:focus {
  box-shadow: none;
}
input.note {
  border: 1px solid #eee;
  height: 35px;
}
label {
  font-size: 14px;
}

.modal-body {
  scrollbar-width: thin;
  scrollbar-color: #eee #f0f0f000;
}

.modal-body::-webkit-scrollbar {
  width: 5px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background-color: #eee;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-button {
  display: none;
}
input::placeholder {
  font-size: 14px;
}
</style>
