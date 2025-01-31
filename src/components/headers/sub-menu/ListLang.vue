<template>
  <div class="dropdown-menu my-2 d-block border-0 position-absolute z-3">
    <ul class="list-unstyled mb-0 lh-lg">
      <li>
        <a class="dropdown-item ps-3">
          <span class="dropdown-icon me-4 text-secondary flageImage">
            <img src="@/assets/flag-usa.png" alt="" />
          </span>
          <span>English</span>
        </a>
      </li>
      <li>
        <a class="dropdown-item ps-3">
          <span class="dropdown-icon me-4 text-secondary flageImage">
            <img src="@/assets/Flag_of_Saudi_Arabia.svg" alt="" />
          </span>
          <span>العربية</span>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "ListLang",
};
</script>
<style scoped>
.dropdown-menu {
  top: 35px;
  left: 0;
  width: fit-content !important;
}
.flageImage img {
  width: 30px;
  height: 20px;
}
</style>
