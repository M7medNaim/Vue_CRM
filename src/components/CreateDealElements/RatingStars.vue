<template>
  <div class="rating-container d-flex align-items-center gap-1">
    <div class="stars d-flex justify-content-center align-items-center">
      <span class="fs-6 me-2">Rating:</span>
      <span
        v-for="index in 7"
        :key="index"
        class="star"
        :class="{ filled: index <= modelValue, hovered: index <= hoveredStar }"
        @mouseover="handleHover(index)"
        @mouseleave="handleLeave"
        @click="handleClick(index)"
        :title="calculateAmount(index)"
      >
        <i class="fa-star" :class="[index <= modelValue ? 'fas' : 'far']"></i>
      </span>
    </div>
    <div v-if="hoveredStar" class="rating-amount">
      {{ calculateAmount(hoveredStar) }}
    </div>
    <div v-else class="rating-amount">
      {{ calculateAmount(modelValue || 0) }}
    </div>
  </div>
</template>

<script>
export default {
  name: "RatingStars",
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      hoveredStar: 0,
    };
  },
  methods: {
    handleHover(index) {
      this.hoveredStar = index;
    },
    handleLeave() {
      this.hoveredStar = 0;
    },
    handleClick(index) {
      this.$emit("update:modelValue", index);
    },
    calculateAmount(stars) {
      const baseAmount = 1500;
      return `${baseAmount * (stars || 0)}$`;
    },
  },
};
</script>

<style scoped>
.stars {
  gap: 0.35rem;
}

.star {
  cursor: pointer;
  font-size: 1.3rem;
  color: #ddd;
  transition: all 0.2s ease;
}

.star.filled {
  color: #ffd700;
}

.star.hovered {
  color: #ffd700;
  transform: scale(1.1);
}

.rating-amount {
  font-size: 1rem;
  font-weight: bold;
  color: #666;
  min-width: 60px; /* لضمان ثبات العرض */
}
</style>
