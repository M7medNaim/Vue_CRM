import axios from "@/plugins/axios";

export const login = (credentials) => {
  return axios.post("/login", credentials);
};
export const logout = () => axios.post("/logout");
export const getUser = () => axios.get("/users");

export const createUser = (formData) => {
  return axios.post("/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateUser = (userId, userData) =>
  axios.put(`/users/${userId}`, userData);

export const deleteUser = (userId) => axios.delete(`/users/${userId}`);
