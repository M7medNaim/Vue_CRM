import Cookies from "js-cookie";

const axios = require("axios");
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiM2I4ZTgyYjlhZmJmYjRlYmRiMWE1ZWY2MWI1YjQ1NTA0OWFkZWZhM2YzYzc2ZDk0NjFhNjA1MTQxZTE1OTYzNDg3ZWUyYjFiYjY2ZWVkNTEiLCJpYXQiOjE3MzgzMDcyNDIuODY0MTQxLCJuYmYiOjE3MzgzMDcyNDIuODY0MTQ0LCJleHAiOjE3Njk4NDMyNDIuODQ5NzM0LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.nLzpliCIJAvnMaDUc-pJMvPqeu0SiaKX8wK3QwODsMLTsNExbgG90fMnGCFPJyxwtrQcv12iNWFVcGEV4uENUcnY002Un8R51V-hFAQnT1F6HZMIP0hb5tnhC-fii9TfzJhpOujNd0frceCVHla8yl3NcNSRPpu9w1DtdKCp_W0xMPOfRK1pFaglWs5qGrUgy57qx3RSG2fhYhQU0jtpwQ5nE4eS8IUuJwRHruZ_VdfGDE-oET5PPR3dpwRnid4UjZ2sVowBGUikMMByrGgFJXCtegiqOz7onF9UEAuMJKXzhAoaUiNwVadhDA1ZkNkm4UzEDmF3OzW7jbTKyxgFX2QwTTjIfm9-V4w8zldE9CsWmThf6cOaqBCUDlNyI9oDaZd24rUvoQXVDs8ziFDA0QuqfuU6WQvoAyzzXIkOzUOdE4-DuA9vdoD6AjDc7woo_0m2rmAiVpchnIxWJBNSawm3eQESDGgmBxrzD-vLDxaKfFREm3agmor6Pl4w-SIGPNiKBxayeuqRSg8GFBeHB0uWKJ5fNySg8NyoWt1IAuNLYCFl_xl1B_tIQx5Z0ccxL10qfaHHdqfz3-XTEoYZ6qd6U50OV3H-5q6iojz0KKscw_dD4cMgVKxL2ik5nYgU4wJdgtU_YMHuGWclXjvVToOLwhNCVqx83MohkN5VhxQ" +
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
