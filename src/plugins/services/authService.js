import axios from "@/plugins/axios";

export const login = (credentials) => axios.post("/login", credentials);
export const logout = () => axios.post("/logout");
export const getUser = () => axios.get("/users");
