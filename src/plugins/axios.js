import Cookies from "js-cookie";

const axios = require("axios");
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMThjZGNlZjdiNDE4MzcxOTJmZjY0MGE4Nzc0ZjA3MWY0ZDA4NWRiODY1ZmM2NjIxNzJjYzkwMjE5ZmRkZjdkMzdkZTA2YzAwNGYyZDhjY2EiLCJpYXQiOjE3MzgyMjc0MjguODk1ODY0LCJuYmYiOjE3MzgyMjc0MjguODk1ODY2LCJleHAiOjE3Njk3NjM0MjguODg2LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.n_fmWNJW8NCi3b7CH40iqPJEx4hdAkJi7-sD4fqIUeKd4eTsWS2thfUJdC0il14IHD7vh63CjrYw2jlsaojqEq92JGYpQi_5c5XQmc8rUqtWG4lQBXqpGyeuZE4xj7XL1JJFZu89eVR79P33RzexNev22T8Nv9wKyqCjNeI_OTfirsZRk3STMoNbIqcc2Tzux6q8Wed1_Y-o5IT3Sx1XxisjPmfojEgwPKr133FuvvE6axA-ZOC9gw3kZdkCRfDh4LtC351a0n1Px9bhl0QxSFThW-i5BLMyQ_Tp-PD2ikrZyMWn6JBH-ZOBcjCClQj1wFk9LaudlJizvIIdCEckOOJjPoE4_dPa5JNIiz2amFHR8iZLRNus61i5zjMH1joN7wyQBaxDN-Dgc45SblOIa6PHnnz_jwfmH5bwFIp2RYwJ74mz9l4I5OgI826SVC1b3dfHAgKge3opAUYBHKv6eR--uz5CtoUCcATwm5LY6_OnKDAKLW0Z11wa2wlUvgSmsIHUewU0YyY-E3F2BIuXJeg6PjQW_rsUfYazFW2nHcDAZS2mDAFoZhTP9bdQSPpSXoQlhCJ460blK8qVxO2GoDUlPDUtaP6sZuD3WQBr3LVME7w3EjepZxYL0Ql4n_99qTORNUgn6KziIVH-s87czqEXezer-6Iea8USMZL_OIM" +
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
