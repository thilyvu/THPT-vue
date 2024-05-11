// import axios from "axios";
// import { BASE_URL, HEADERS } from "./Base.js";

// const apiClient = axios.create({
//   baseURL: BASE_URL + "/api",
//   withCredentials: false,
//   headers: HEADERS,
// });
import { api } from "./axios.js";
export default {
  createFile(payload) {
    return api.post("/file", payload);
  },
  createFolder(payload) {
    return api.post("/folder", payload);
  },
  updateFolder(id, payload) {
    return api.put("/folder/" + id, payload);
  },
  updateFile(id, payload) {
    return api.put("/file/" + id, payload);
  },
  deleteFileFolder(id) {
    return api.delete("/file/" + id);
  },
  getListClassFolder(id) {
    return api.get("/getListClassFolder/" + id);
  },
  getListUserFolder() {
    return api.get("/getListUserFolder");
  },
  getListSubFolderById(id) {
    return api.get("/getSubFolderById/" + id)
  },
};
