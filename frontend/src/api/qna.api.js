import api from "./axios";

export const qnaAPI = {
  ask: async (question) => {
    const response = await api.post("/qna", { question });
    return response.data;
  },
};