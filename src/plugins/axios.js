import Cookies from "js-cookie";

const axios = require("axios");
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZWY4OGNjMWEwMTkwY2MzZjZkMzk0ZTNhYTBiNDQ3MTg4MjY3MTY3ZTRlMTdlMzE5NzYxYzQ3NzkzYzU2NDNhYzg4NmJkOGY1ZDRkYTE0ZDgiLCJpYXQiOjE3MzgxNjMwMjguMTM2NTUyLCJuYmYiOjE3MzgxNjMwMjguMTM2NTU1LCJleHAiOjE3Njk2OTkwMjguMTI5MzQsInN1YiI6IjIiLCJzY29wZXMiOltdfQ.Q6-njSwRZf_R9-mxDyNtNdP4Hp704Cy-uD-ic0Ucgf6fuoGdI6MWBDTKh0hDdqWq2Z7CeC_Elc9xRbol5g4-w4O8VdHuAd595_mTRWxVKMzeGe4B91nXcodYExNhGKtdSn2eJdp4SokVUc1XqwfrkOBIQVjRXNFeq03V48OQImAaMQbmobffmp0DnMnstej70s4Q_5wXYqkQq2zo6-43j-PJRHBtAW3pHr1kAyn5ur8WE3nxN_ddVSKKlHbqaV_qobo69n-OuKSCRkURBrtFZy1UdGThmeV05pD-Xs9aMTdy7pQ5NjZKCvtRS8o1Z1pCE9u1oM03ZwHLzMZYURSm2ws7TcMng2M0BKGrlYh3JTM74qgKIEy3K4HczVf3SkK8rbm-R8wmJGlE4VIpNHhY_IyvT2Z7v_FCIasIgTS8sXn1F6uc9Y17UGhZ6SvEOYKNUeP_vAObAD_fZfMaiJsMfNBbD9PgXkV_UIBnUSa531B1xw6dypYOEoZaaNuCuQG7Zqy-5JodeGPv4fALpkBv4ujf54G-1NiMin2uYIgdNlv7VmQVF_mAvEFDr3fKNdG4ci9Af_XG4gBAqGMKy_4QO2HV9_0ipC-cYoCo47Ep2AUm6y1KQaFbZb-mWKV_2qqM4ppCoCYZynxFNT0tC9OdJmqUrOm-XDocZySFlbACr_M" +
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
