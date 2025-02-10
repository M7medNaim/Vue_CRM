import axios from "@/plugins/axios";
import Cookies from "js-cookie";
// login
export const login = (credentials) => {
  return axios.post("/login", credentials);
};
// logout
export const logout = () => axios.post("/logout");
// get All users
export const getUser = (filters) => {
  const token = Cookies.get("authToken");
  return axios.get("/users", {
    params: filters,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// Create New User
export const createUser = (formData) => {
  return axios.post("/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
// Update User
export const updateUser = (userId, userData) =>
  axios.put(`/users/${userId}`, userData);
// Delete User
export const deleteUser = (userId) => {
  const token = Cookies.get("authToken");
  return axios.delete(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// Get All Roles
export const getRoles = () => axios.get("/roles");
// Get All Deals
export const getDeals = () => axios.get("/deals");
// Show Deal id
export const showDeal = (dealId) => axios.get(`/deals/${dealId}`);
// Create New Deal
export const createDeal = (formData) => {
  return axios.post("/deals", formData);
};

// Add these functions to your service file
export const updateDealsStage = async (ids, stage) => {
  return await axios.post("/api/deals/update-stage", { ids, stage });
};

export const updateDealsSupervisor = async (ids, supervisor) => {
  return await axios.post("/api/deals/update-supervisor", { ids, supervisor });
};

export const updateDealsRepresentative = async (ids, representative) => {
  return await axios.post("/api/deals/update-representative", {
    ids,
    representative,
  });
};

export const updateDealsSource = async (ids, source) => {
  return await axios.post("/api/deals/update-source", { ids, source });
};

export const deleteDeals = async (ids) => {
  try {
    const response = await axios.delete("/api/deals/delete", {
      data: { ids },
    });
    return response.data;
  } catch (error) {
    console.error("Delete API Error:", error);
    throw error;
  }
};

// Get All Sources
export const getSources = () => axios.get("/sources");

// Get All Stages
export const getStages = () => axios.get("/stages");
