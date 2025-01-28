import Cookies from "js-cookie";

const axios = require("axios");
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYjYzZjc4OTc4MDZjZjZjMDM0NDkxMjkyNDY5ZWFjYzU0NWJmMWQ2MGEzZGFmNzUzMDJmOTVlMmQ3MzFiYTM4MmI3NWQ2NWVlZWQ4OTg4ZTciLCJpYXQiOjE3MzgwNjA2ODEuMDQ0NTMsIm5iZiI6MTczODA2MDY4MS4wNDQ1MzMsImV4cCI6MTc2OTU5NjY4MS4wMzc3NCwic3ViIjoiMSIsInNjb3BlcyI6W119.WGFCRkOoxe2ML8FDSCP_K4FFWeWfJkBkVIeA5GdKlKs9F65RKqNfI417t9Lq4GiepdbJqUb4tZHgnreBkVVIqXjUR3uKxN0aapcGPrPRVxvInuRqIM37DwrIfb-WXhXUp_6gOfVUaztsRlSRX-PfopYLsIDxi2N4cOWqAA6iaaFw3EC1v6zeInh3EirQxyK7NNW555KAOD5tM6YtvmLTeI88nHGYrtVLs95ylQ9p3ew-Ktf7Zt2Aq15fGDrC8AAI0gMEBVLpU2bL8Xy06uJ5wmyz-Fx99s8ZJ-9L_D6inTbSkg1UyDyNA6g1ombHwAb3Ov-0VNEWmXBtXzW8HxXT9WHj24zTjv8iLlAAmoES2vic1iyEQy99IhTM-LD7VfCaCI75sXF22lSmRhbFDUU3nymjIeti6GZGx4a__nwa2KTptrFxBUn34lW7OSpMboTUVoQdZhdn1IHdsIsMh5ngFNl0VbAn8KJAmtSsnaBahcdW_OkuAuBVqE4DDKVPXkW6tkCy6DGL2b-T9jpAKMizX72_WTEmA9y3sxiBuDNDq-gOjzghEh0o4bWZB6JaYMCgXcDSIUwTyalr2LY9nekgfcqox0G438LBDOnc-oQJlY779t49lcyl20KTY6yr8ztryyIdD5VlO4ujltPHJF891SDKKkwhO4AFeqqgqo6gPJQ" +
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
