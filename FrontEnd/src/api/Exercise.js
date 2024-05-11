// import axios from "axios";
// import { BASE_URL, HEADERS } from "./Base.js";

// const apiClient = axios.create({
//   baseURL: BASE_URL + "/api",
//   withCredentials: false,
//   headers: HEADERS,
// });
import { api } from "./axios.js";
export default {
  getListExerciseByClass(id) {
    return api.get("/exerciseByClassId/" + id);
  },
  createExercise(payload) {
    return api.post("/exercise", payload);
  },
  updateExercise(id, payload) {
    return api.put("/exercise/" + id, payload);
  },
  deleteExercise(id) {
    return api.delete("/exercise/" + id);
  },
  getListExercise() {
    return api.get("/exercise");
  },
  getExerciseById(id) {
    return api.get("/exerciseById/" + id);
  },
};
