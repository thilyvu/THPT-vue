// import axios from 'axios'
// import {BASE_URL, HEADERS} from './Base.js'

// const apiClient = axios.create({
//     baseURL: BASE_URL + '/api',
//     withCredentials: false,
//     headers: HEADERS,
// })
import { api } from "./axios.js";
export default {
  createTest(payload) {
    return api.post("/test", payload);
  },
  updateTest(id, payload) {
    return api.put("/test/" + id, payload);
  },
  getTestById(id) {
    return api.get("/testById/" + id);
  },
  getTestByIdTeacherRole(id) {
    return api.get("/testByIdTeacherRole/" + id);
  },
  getListTest(params) {
    return api.get("/test", { params });
  },
  getAllTest(params) {
    return api.get("/allTest", { params });
  },
  getTestByClassId(classId, payload) {
    return api.get("/testByClassId/" + classId, payload);
  },
  deleteTest(id) {
    return api.delete("/test/" + id);
  },
  updateClassTest(id, payload) {
    return api.put("/testClass/" + id, payload);
  },
  removeTestFromClass(payload) {
    return api.put("/testByClassId", payload);
  },
};
