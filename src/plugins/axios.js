import Cookies from "js-cookie";

const axios = require("axios");
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZTM1M2I3MDFlNTc0YTNlNWZhZTNkODRhYmQxMzZhNWNkMTRjODJlOGU2YjJmODM3OTFlNjUwM2ViZDc2NjI3NWMyNThjYzljYTA0NDFhM2MiLCJpYXQiOjE3MzgyMzE0NDQuMjgwODcyLCJuYmYiOjE3MzgyMzE0NDQuMjgwODc1LCJleHAiOjE3Njk3Njc0NDQuMjc0MDExLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.pZYGXf6Jt07lU4lgMKzgS1TiaWc3mp_pJsCHBrFmtJEx5NvUaZOXGS0nDZbo8nO6dWZvwgegGJv3MyrLp7zJJX0b2wfjyMGOn1m6U99pt3BjFqtXzteyKvLOsW4sWrqwekk2BdARRUUWDkWHI-bwSQuKBmxWTY_3-SmKFpomncqwXdni5iziTyV9CzhHD33th0ZV8Ivb5WPqvGf_DK0P-tuyWaMajlaMEZAl2sT8ExF2iiFXWwON05ytv-7UnAyEKqt0nk4dit0_ZL8-YSjz_RjZnuuTuUYwVegomlb010xCMrLwwTRlXL1kKQXndfb-3KX0H9XFCpVDzkJuUZqezWIonntcWaMxY-FhAdkIEHi6dq0aAGu7vTOpHumCCqsqJCJAYj0ePJ7kKoLNAWH7NRUhKG57M_tbPmF0sSdVx6INGsa5tpND8fIeVQqxJJCiunrDD_i1Qy-3OdezrS6M82tURgRurqUdTDOr8CbnuAS_fBxDSXq1vk83r41uRTd4VG4_5UApewXjfVy8f1TCK_L-HePD0AyaZUHILnUS7fKqHSUUSrY67RiCfNz1oQYByQhm8Y_Pwfi8no3fIfwsP2I0V-3Q02KJjXy3L7pqBEtmFV-fk6cg5cbgf26-Su_sHviU4Pa9iYuk3FlHw2jOdBDVOLJRSVAJnizkiOwbQxo" +
      Cookies.get("authToken"),
  },
});

axios
  .request(axiosInstance)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
export default axiosInstance;
