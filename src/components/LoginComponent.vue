<template>
  <div class="vh-100 w-100 overflow-hidden bg-light">
    <div class="row h-100">
      <div class="col-10 col-md-5 col-lg-4 m-auto">
        <div class="card text-start">
          <form class="card-body" @submit.prevent="handleLogin">
            <div class="mb-3 text-center">
              <img
                src="../../public/images/new-nokta-logo.png"
                class="img-fluid profile-image-pic"
                alt="logo"
              />
            </div>
            <div class="mb-3">
              <label>Email <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                v-model="email"
                placeholder="Enter Email"
                required
              />
            </div>
            <div class="mb-3">
              <div
                class="d-flex justify-content-between align-items-center pb-1"
              >
                <label>Password <span class="text-danger">*</span></label>
                <a href="#" class="text-decoration-none">Forgot Password?</a>
              </div>
              <input
                type="password"
                class="form-control"
                v-model="password"
                placeholder="Enter Password"
                required
              />
            </div>
            <div class="mb-3 text-start">
              <input
                type="checkbox"
                class="form-check-input shadow-none"
                id="rememberMe"
                v-model="rememberMe"
              />
              <label class="form-check-label text-start ms-2" for="rememberMe">
                Remember Me
              </label>
            </div>
            <div class="text-center mb-2">
              <button type="submit" class="btn w-100 bg-black text-white">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginComponent",
  data() {
    return {
      email: "",
      password: "",
      rememberMe: false,
    };
  },
  methods: {
    handleLogin() {
      if (this.email && this.password !== "") {
        this.$router.push("/home");
        if (this.rememberMe) {
          this.rememberMe = true;
        }
      } else {
        //errorMessage
      }
    },
  },
};
</script>

<style scoped>
.form-control:focus {
  box-shadow: none;
  border-color: #ced4da;
}

.profile-image-pic {
  height: 80px;
  width: 80px;
}
</style>
