import { api } from "./axios.js";
export default {
  createStudentKey(payload) {
    return api.post("/quizStudentKey", payload);
  },
  updateStudentKey(id, payload) {
    return api.put("/quizStudentKey/" + id, payload);
  },
  deleteQuizStudentKey(id) {
    return api.delete("/quizStudentKey/" + id);
  },
  getListStudentKey() {
    return api.get("/quizStudentKey");
  },
  getStudentKeyById(id) {
    return api.get("/quizStudentKeyById" + id);
  },
  getStudentKeyByClassId(payload) {
    return api.post("/quizStudentKeyByClassId", payload);
  },
  getQuizStudentKeyByClassAndStudentId(payload) {
    return api.post("/quizStudentKeyByClassIdAndStudentId", payload);
  },
  getQuizStudentKeyByClassAndQuizId(payload) {
    return api.post("/quizStudentKeyByClassAndQuizId", payload);
  },
  getCurrentQuizStudentKeyByClassAndQuizId(payload) {
    return api.post("/currentQuizStudentKeyByClassAndQuizId", payload);
  },
  getCurrentQuizStudentKeyByClassAndQuizIdAndStudentId(payload) {
    return api.post("/quizStudentKeyByClassAndQuizIdAndStudentId", payload);
  },
};
