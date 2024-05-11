import axios from "axios";
// import { BASE_URL, HEADERS } from "./Base.js";

// const apiClient = axios.create({
//   baseURL: BASE_URL + "/api",
//   withCredentials: false,
//   headers: HEADERS,
// });
import { api } from "./axios.js";
export default {
  getAllGrade() {
    return api.get("/grade");
  },
  getSubject() {
    return api.get("/subject");
  },
  getProvince() {
    return axios.get("https://provinces.open-api.vn/api/?depth=1");
  },
};
