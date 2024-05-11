// import axios from 'axios'
// import {BASE_URL, HEADERS} from './Base.js'

// const apiClient = axios.create({
//     baseURL: BASE_URL + '/api',
//     withCredentials: false,
//     headers: HEADERS,
// })
import { api } from "./axios.js";
export default {
  createQuestionType(payload) {
    return api.post("/questionType", payload);
  },
  importQuestion(payload) {
    return api.post("/importQuestion", payload);
  },
  updateQuestionType(id, payload) {
    return api.put("/questionType/" + id, payload);
  },
  getQuestionTypeById(id) {
    return api.get("/questionTypeById/" + id);
  },
  getListQuestionType() {
    return api.get("/questionType");
  },
  deleteQuestionType(id) {
    return api.delete("/questionType/" + id);
  },
};
