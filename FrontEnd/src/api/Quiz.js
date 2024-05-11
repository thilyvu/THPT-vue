import { api } from "./axios.js";
export default {
  createQuiz(payload) {
    return api.post("/quiz", payload);
  },
  updateQuiz(id, payload) {
    return api.put("/quiz/" + id, payload);
  },
  getQuizById(id) {
    return api.get("/quizById/" + id);
  },
  getListQuiz() {
    return api.get("/quiz");
  },
  deleteQuiz(id) {
    return api.delete("/quiz/" + id);
  },
  removeTestFromQuiz(payload) {
    return api.put("/quizByClassId", payload);
  },
};
