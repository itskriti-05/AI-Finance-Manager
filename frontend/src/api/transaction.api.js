import api from "./axios";

export const transactionAPI = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append("statement", file);
    const response = await api.post("/transactions/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  list: async (limit = 10) => {
    const response = await api.get(`/transactions?limit=${limit}`);
    return response.data;
  },
};