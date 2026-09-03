import api from "./axios";

export const categoryAPI = {
  update: async (transactionId, category, saveAsRule = false) => {
    const response = await api.patch(`/categories/${transactionId}`, {
      category,
      saveAsRule,
    });

    return response.data;
  },
};