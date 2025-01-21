const axios = require("axios");

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://test.crm.noktaclinic.com/api/v1/login?email=test@example.com&password=password",
  headers: {
    Authorization:
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZjZmOTBjNzU3YmZlZDc0NzI1MWFiMDBiNjgzZGIwYzNiNzc0NGU1M2RjMDk3YTUwNTA5MGM5NDE3NWU3NzY0MDdkOWI3ZjcxYzZkZTViNTIiLCJpYXQiOjE3Mzc0NjAwMDcuNTAwMiwibmJmIjoxNzM3NDYwMDA3LjUwMDIwMywiZXhwIjoxNzY4OTk2MDA3LjQ5MjcwMiwic3ViIjoiMSIsInNjb3BlcyI6W119.ZuIaRzvSAZ8Llm4kcJhWsHi1S04F7hdrYgb2waSI_RmxVVBWzfgpTonw-QbOkyh9Wd-jrLCDds5B4RXgjEp6ouy75ZYd5QojeG4Mj8jGd7ttu4HabQvfo6tLnU8g0zGOL2tJOGa1yM_vQJoudagie9FH_tH7_rphjktmzErmq03V0WT-ooWvzwKu2szZfSO3QB8kEV8-JkxjwdexAuabzBBGyD8hvjnvTh963jpGcOXW4tGsG_L8X-ADqIjgwqQU_y7bYXwk1e3ltOdD7Py5eE45_5vqewYgdFXuF2IgI41dDhmgy43PbRfaAVXsNaYmg9OguSVsjM0yjQO8UzFpeNJeiT6LLIaiqsA7LwHnukvFuTS1IT7D3hiEQ4wUxm4r2qJMUsdRPcOMV_0_xcYn9HnfwtMOXJG-WlChhuXXtSTr88xq-pcQH1LzgJIPbnMoNity7wEWHB6dLMMWHyOkLjbsPPv2cT28FlH5KDx3a1HHAiZAUfqJrEh-U-MBbHL1Bm3qi5EEi8p-M9wXbOPyR0YmGdn5RHegHwt6ZyaF-d-hyKmxjDhBoUAK9RX65dmW_hYUPVCFr9NJYNd-FwrxFEwewIZ0gQMGL_h4jsXs4Pq4jDmAYAoroR5KXqNy7znN0YpUMiUF1GfJoCODhf5GVhuk_fA_fYq-EQq8XUD2G5I",
  },
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
