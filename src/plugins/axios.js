import Cookies from "js-cookie";

const axios = require("axios");
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMTE1MDEyN2RhZDk3Y2I1N2YxMjA1ZTU4ZmEyOWUzYjliYzM0NjQ5YzM2Mzg0MWQzNTRjZmEwYzRlOGQwMGViZDQ5YjI2NGVmYzUwYWNjMjUiLCJpYXQiOjE3MzkxODc3NjAuNTkzODA1LCJuYmYiOjE3MzkxODc3NjAuNTkzODA4LCJleHAiOjE3NzA3MjM3NjAuNTg2NTU3LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.neuTnn0Wadruketjbjb7LewhSspCNX7hhN6gh11ieq6038XB_WQ36MBq1DanhOHPCv-0H9AxOtx1ICSdm-DkyrjG5ecVu6cj3-Fx-0EALZlYXcw_wIIOFuay0bbFuadxPjQvb9kUSOfUw55keCPN-id00Q-zMo_3yUavhKUYkzVstdGSZkYkG3gopMJ1Po1oQIyAS6JsPvsxWukztUftHEU9miAjCIcQ3t8-n2heJ_7QBV59hM0N6ah1ohRzwi_7qbO8DDGfcmamT4C4JFKiknX_AeoHud9CpIY7upG-XibEkY6jTGjyRzys_mfIwbM6l6Y6COE7VL1VlkgMoHyx2NkPw4yvyLICeqOuejO0Y_djyzrVqxryYU32IvTtGKNircO8iFxm0nDLWR__kBFS6Dp0ZTHDhInUv3TGmrdsvVLKhX6ST1R4nG7s-FaE3SsKpwQMrAQ6jb9KcDFR11ZgNc0mSdqmyxaoqMX76T9z2jyzYZZGrh6H7oXcmqWAmdh6dcliXdQ01WOUNost1PQOUgpkV3pNrFUPvohltItjfGDHJIKvn6l5_ie3wazfGpeUt9RyFdExQEDOUlNw0YnEkeZyDculFmj92Yt7L02h8kXPCryq23rtHw41aRnqnkQGUJzWSov0q0lNPr8evsMRDL88y4LB-1QmVm2FLIlCuz0" +
      Cookies.get("authToken"),
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default axiosInstance;
