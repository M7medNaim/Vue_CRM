import Cookies from "js-cookie";

const axios = require("axios");
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiODczYjE4ZjgxMzMzZGYzYTE4NTg0YzQ0YmY3N2EwNmQ4ZWZhOTE1OGYyZTM3MTVlZDg4NzUzNjVmYWI5YjY0YWFiMzUwNTllZmU1ZWM3ZmYiLCJpYXQiOjE3MzgyMzcwNzIuMzU0OTYxLCJuYmYiOjE3MzgyMzcwNzIuMzU0OTY0LCJleHAiOjE3Njk3NzMwNzIuMzQ3Nzc5LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.Vvknf2jPJNHzhG-YzvIkJ9cXjeHzcB5lz9z5b5Nai2BgIelgVR_diE5630sSMWNbhmbKV3BIuYie1ohFN-i_Vqc754nUchRVTG23xBi0KWZgbsaQ6VIjmD2RwejbZkgkDQGZhQYyrPzUqOOrDTo6uMnflj5DM34OGqrRt1ETIbQso0fxBxDtm3w7UZZcI8Br5iQO3nhg29CKvRDjnjBUmWzb1caUs2xGo7MCINDHn-sdN6sKFXSbS0iCRr4H34HCSgGsJ8vJxIeRPV3CdM0Z_Z5ycB2qC4k1qEESvb9Jr1QsOZx1Okri8oI41gL9v0KZzUox305FzUx9EMiBFmLLErbzKWZWLaac40CFXyw6YzVNakY3FTzgcUYHgCgX4I4yokv5AWlj5T1gxiey1K1wjKGGIM7Al0bvwnSVB2vXk9A4OkkA2a7jD-5_5gblQgmMdomr_eF-HpCk7NJ5VpAzbkc5JcIBxyJQ3JX91FR6-LZOTqkC0lihTikj4V-JgIvivO3U2HRkmySgY1sxY8gE2dE4kCiLo0vlX2Wx0LpFF7vrh6_lG3MGn8Mmk1ZQavDt-lIG9oCsuCD_iU7Wx0O3wXNKCYdOynikmkCpyomg-aj4d84ioTR4yS47uErEr1OS7c9T-8bQXFDFPnqvO8TlyPkS7IOyeosHR014OO4EC4o" +
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
