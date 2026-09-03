import api from "./axios";

export const analysisAPI = {
  weekly: async () => {
    const response = await api.get("/analysis/weekly");
    return response.data;
  },
};