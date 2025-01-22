import axios from "@/plugins/axios";

export const login = (credentials) => {
  return axios.post("/login", credentials);
};
export const logout = () => axios.post("/logout");
export const getUser = () => axios.get("/users");
