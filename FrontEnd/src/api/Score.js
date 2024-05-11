// import axios from "axios";
// import { BASE_URL, HEADERS } from "./Base.js";

// const apiClient = axios.create({
//   baseURL: BASE_URL + "/api",
//   withCredentials: false,
//   headers: HEADERS,
// });
import { api } from "./axios.js";
export default {
  createScore(payload) {
    return api.post("/score", payload);
  },
  updateScore(id, payload) {
    return api.put("/score/" + id, payload);
  },
  deleteScore(id) {
    return api.delete("/score/" + id);
  },
  getListScore() {
    return api.get("/score");
  },
  getScoreById(id) {
    return api.get("/scoreById/" + id);
  },
  getScoreByExerciseId(id, studentId) {
    return api.get("/scoreByExerciseId/" + id, { params: { studentId: studentId } });
  },
};
