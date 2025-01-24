<template>
  <div class="app">
    <header>
      <nav class="nav-bar px-3 py-2 text-white">
        <div class="row">
          <div
            class="col-12 d-flex justify-content-start align-items-center flex-wrap"
          >
            <!-- buttons -->
            <div class="btns">
              <button class="btn btn-light me-2 px-4 py-2 fs-5 fw-bolder">
                إضافة
              </button>
              <button class="btn btn-light me-2 px-4 py-2 fs-5 fw-bolder">
                الرئيسية
              </button>
              <button class="btn btn-light me-2 px-4 py-2 fs-5 fw-bolder">
                المهام
              </button>
            </div>
            <!-- search input -->
            <div class="searchInput">
              <form
                action=""
                class="d-flex align-items-center justify-content-start"
              >
                <button
                  class="btn btn-light border-0 py-2 px-3 fs-5 fw-bolder rounded-start-2 rounded-end-0"
                >
                  <i class="fa-solid fa-magnifying-glass"></i>
                </button>
                <input
                  type="text"
                  class="form-control w-auto border-0 py-2 fs-5 rounded-0"
                  placeholder="اكتب لبدء عملية البحث ...."
                />
                <button
                  class="btn btn-light border-0 py-2 px-3 fs-5 fw-bolder rounded-end-2 rounded-start-0"
                  title="تطبيق فلترة"
                >
                  <i class="fa-solid fa-filter"></i>
                </button>
              </form>
            </div>
            <!-- taskes -->
            <div
              class="task text-black d-flex justify-content-center align-items-center bg-light mx-4 py-2 px-2 fs-5 rounded-3"
            >
              <div class="box me-2">
                <span
                  class="bg-secondary-subtle p-1 rounded-3 fs-6 text-danger fw-bold"
                  >99+</span
                >
                <span>متأخر</span>
              </div>
              <div class="box me-2">
                <span
                  class="bg-secondary-subtle p-1 rounded-3 fs-6 text-warning fw-bold"
                  >15</span
                >
                <span>اليوم</span>
              </div>
              <div class="box me-2">
                <span
                  class="bg-secondary-subtle p-1 rounded-3 fs-6 text-info fw-bold"
                  >4</span
                >
                <span>غداً</span>
              </div>
              <div class="box me-2">
                <span
                  class="bg-secondary-subtle p-1 rounded-3 fs-6 text-secondary fw-bold"
                  >99+</span
                >
                <span>بدون مهام</span>
              </div>
            </div>
            <div
              class="btnExIm d-flex justify-content-center align-items-center"
            >
              <button
                class="btn btn-light border-0 py-2 px-3 fs-5 fw-bolder rounded-start-2 rounded-3 me-2"
              >
                <span>استيراد</span>
                <i class="fa-solid fa-upload"></i>
              </button>
              <button
                class="btn btn-light border-0 py-2 px-3 fs-5 fw-bolder rounded-start-2 rounded-3"
              >
                <span>تصدير</span>
                <i class="fa-solid fa-download"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  </div>
</template>

<script>
export default {
  name: "HeaderComponent",
};
</script>

<style scoped>
.logo-img {
  height: 30px;
}
input {
  outline: none;
}
input:focus {
  border: none;
  box-shadow: none;
}
</style>
