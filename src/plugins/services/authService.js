import axios from "@/plugins/axios";
import Cookies from "js-cookie";

export const login = (credentials) => {
  return axios.post("/login", credentials);
};
export const logout = () => axios.post("/logout");
export const getUser = () => {
  const token = Cookies.get("authToken");
  return axios.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getRoles = () => axios.get("/roles");

export const createUser = (formData) => {
  return axios.post("/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateUser = (userId, userData) =>
  axios.put(`/users/${userId}`, userData);

export const deleteUser = (userId) => {
  const token = Cookies.get("authToken");
  return axios.delete(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
