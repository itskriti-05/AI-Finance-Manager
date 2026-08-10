import api from "./axios";

export const budgetAPI = {
  get: async (income) => {
    const query = income ? `?income=${income}` : "";
    const response = await api.get(`/budget${query}`);
    return response.data;
  },
};