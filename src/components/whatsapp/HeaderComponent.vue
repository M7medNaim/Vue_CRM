<template>
  <header class="w-100 bg-white">
    <div class="row h-100">
      <div class="col-12 close h-100">
        <button
          aria-label="close button"
          class="border-0 bg-transparent h-100 m-auto"
        >
          <i class="fa-solid fa-x pe-3 text-secondary fs-6"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "HeaderComponent",
};
</script>

<style scoped>
header {
  height: 5vh;
}
</style>
