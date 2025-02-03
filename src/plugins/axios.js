import Cookies from "js-cookie";

const axios = require("axios");
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYmEwZTFiMWYxZDI2MmZjMzYwN2Q2ZTI4ZDUzZGVlNDBjMzg2ZmVjMWRhNDI2OTEzZDY5YWQyMGU4MmE2ZmYzMTkyNjU4YWVhODFiMDdkYjgiLCJpYXQiOjE3Mzg1NzU1MzguNjI4ODEsIm5iZiI6MTczODU3NTUzOC42Mjg4MTMsImV4cCI6MTc3MDExMTUzOC42MjA2OTIsInN1YiI6IjEiLCJzY29wZXMiOltdfQ.LVmELWdDbIGg2DwN0pm9rMIsP41q0YAe6-in_PvEAZF3SUigZAO0HHmp-qMJvkBNv-aOcqSdcFsTehbHzxfTZm62HMhUMIq9HDixkMph1UJ_uibk1e8hBDQVv0V3ElcPZbUvQVGy4R6Myysd86uKplWezQkgi-NrrZiZa3RrVmsKOOoh0ONf2sjYLLbIN0Wxmy8xX1RI_4vwYPz0HFyXVJfFs0NJKx_dnDRJC-UCsXjV7ZwZubZ3H6bhgfPxqQdSh3T8LdX8RH13UGDvVkqdTS47aAQGq_cguzhLvpWU7eQAJ27iWnHIMc7L8oTltf_G1J2r7SjjISmv4GGYDRtVEc5IrhO821Xz5CkKVU9syuv2BwpAgdjwtJHaVsd9vKAjz8iVNi7tALEpTtTiXv2cEuSnZNUGV0_uZLhcN2ijHhUuTopEeb7ekuIMF3Ltuiygs2XjG0NtzX4Zbudafu19cCnbClChgFCNQY5cB1Q4J51Rm3L5tbe_hsy343I_hctDkiG1cRDlOkNuKKpdKO8iRAgri2tTO0hWfMlziwlpfajbhlmo8WSvAd-gtiJ12n29WoZpQ764UXAITNjdI27wOuUJ-_dLqoFU_JqZDng3c9ZUt5zOSFaPHOBzgvetVNSzW88msjQESEHcpl2xNR-ZXjtcf1YhJh_z4siIdXcRH-g" +
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
