<template>
  <div class="w-100">
    <div
      class="toggle-button position-fixed arrowColor text-white p-1 cursor-pointer"
      :style="toggleButtonStyle"
      @click="toggleNewsBar"
    >
      <i :class="`fa-solid fa-chevron-${isNewsBarVisible ? 'down' : 'up'}`"></i>
    </div>
    <transition name="slide">
      <div
        v-if="isNewsBarVisible"
        class="marquee-container bg-body-secondary text-primary fw-bold position-fixed bottom-0 left-0 right-0 overflow-hidden w-100"
      >
        <div
          ref="marquee"
          class="messages-marquee d-inline-flex p-1"
          :style="{ transform: `translateX(${translateX}px)` }"
        >
          <span
            v-for="(news, index) in repeatedNews"
            :key="index"
            class="marquee_margin px-2"
            :class="{ important: news.important }"
          >
            {{ news.text }}
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from "vue";

export default {
  name: "NewsBar",
  setup() {
    const newsList = ref([
      {
        text: "يجب تقييم العميل بعد وصوله لمرحلة المفاوضات وإلا سيتم رفض الحركة من قبل النظام نفسه",
        important: true,
      },
      {
        text: "اللهم ارزقنا رزقا حلالاً طيباً مباركاً فيه كما تحب وترضى يا رب العالمين.",
        important: false,
      },
      {
        text: "الواتساب لا يعمل حالياً في نظامنا يرجى تفادي العمل به",
        important: true,
      },
      {
        text: "اللّهم إن كان رزقي في السّماء فأنزله، وإن كان في الأرض فأخرجه...",
        important: false,
      },
    ]);
    const marquee = ref(null);
    const translateX = ref(0);
    let animationFrame;
    let contentWidth = 0;
    const speed = 1;
    const isNewsBarVisible = ref(true);
    const toggleNewsBar = () => {
      isNewsBarVisible.value = !isNewsBarVisible.value;
    };

    const repeatedNews = computed(() => [...newsList.value, ...newsList.value]);

    const startAnimation = () => {
      if (!marquee.value) return;
      contentWidth = marquee.value.scrollWidth / 2;
      translateX.value = -contentWidth;
      const step = () => {
        translateX.value += speed;
        if (translateX.value >= 0) {
          translateX.value = -contentWidth;
        }
        animationFrame = requestAnimationFrame(step);
      };
      step();
    };

    onMounted(() => {
      startAnimation();
    });

    onUnmounted(() => {
      cancelAnimationFrame(animationFrame);
    });

    const toggleButtonStyle = computed(() => {
      return {
        bottom: isNewsBarVisible.value ? "29px" : "0",
        left: "0",
        transition: "bottom 0.5s ease",
      };
    });

    return {
      newsList,
      translateX,
      marquee,
      repeatedNews,
      isNewsBarVisible,
      toggleNewsBar,
      toggleButtonStyle,
    };
  },
};
</script>

<style scoped>
.marquee-container {
  z-index: 1000;
  white-space: nowrap;
}

.messages-marquee {
  white-space: nowrap;
}

.marquee_margin {
  margin-right: 20px;
  margin-left: 20px;
  font-size: 14px;
}

.important {
  background-color: #ed2424;
  color: white;
}
.toggle-button {
  z-index: 1001;
  cursor: pointer;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.toggle-button:hover {
  background-color: #0056b3;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
}
.arrowColor {
  background-color: rgba(128, 128, 128, 0.8) !important;
}
</style>
