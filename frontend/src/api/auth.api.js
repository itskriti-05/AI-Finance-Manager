import api from "./axios";

export const authAPI = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  me: async () => {
  const response = await api.get("/auth/me");
  return response.data;
},
};