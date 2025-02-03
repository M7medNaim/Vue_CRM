import Cookies from "js-cookie";

const axios = require("axios");
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNTY2MWE5YmUwMDE0NjFmZjA1ZDM2YjlkOWU3ZjY1Y2Y4N2NlNjNkM2M0ODY5M2VhZDI0ZWFmODc2YTBmMDg2NTA4MjgwZDk3MTYzYjg4MmMiLCJpYXQiOjE3MzgzMzE3NDYuODAwNzM1LCJuYmYiOjE3MzgzMzE3NDYuODAwNzM4LCJleHAiOjE3Njk4Njc3NDYuNzkzNzU5LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.d_Ta1Z71319hjgacofrJvdUUDYv4U3jwxtmFSOPZ6_zXoNauhkmfrKTX5Q2WcaYfHdKNVLAVfqD6A3MG6ELVru3j_oJGw06GBZ3Kys1LkDnlqa2Y6zTh-jVUZXsEMvWVO2hbX8NaapyvVj_z-UAEdtQBJiYBWwjIYqrOfZK9CONFs4MkuH64OZCAVcc1DeaNpuHD3rw-HnXx_oPKKiYtqRnDTiKIUoCkGhZJTm4nossGx--m4sm_AYlbkLOQKA0XCbC3zje3G3g5Sbf26BlUPeAJDnaZWdShIXecPiunIpPvs0qMO-5oZieXoEBMB_DWHqzKnlVSr7HKZFhCE6KlPH-_xSXY2g4Rk6wgfiutAwdbqjOPBZZIHXsOsrfEZzWGXCW6Iu8WAahy3Qs39m0YuIya_Ll8i7kNlvXWLK5KrY7ze9EPblcAgpS7H8yAqea9t2r3NEaRlNuVNi1-T6Bidc_hbQA-HJLo-oPsKd_LQ8_1ao9eRJn3X4ORflzhbfhnmm_fua6X1BQ4H1B7V0mIQ2NRrLw8wGn4ewMf_1VR1So-vKRR4emfSZX-cNoZdfJmlA3E-Qr3ypdgoQBP1z9D7b5g3T9kaDcfudkiKHnvNyzeVLBijvc3UQh2VLN6ufATKImNep3uTKMKlGrfsTdKzk9vA14Vpm-jSrGv0VYvlOk" +
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
