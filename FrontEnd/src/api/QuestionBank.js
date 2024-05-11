import { api } from "./axios.js";
export default {
  createQuestionBank(payload) {
    return api.post("/questionBank", payload);
  },
  updateQuestionBank(id, payload) {
    return api.put("/questionBank/" + id, payload);
  },
  getQuestionBankById(id) {
    return api.get("/questionBankById/" + id);
  },
  getListQuestionBank(params) {
    return api.get("/questionBank", { params });
  },
  deleteQuestionBank(id) {
    return api.delete("/questionBank/" + id);
  },
};
