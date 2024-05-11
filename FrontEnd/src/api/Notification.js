// import axios from "axios";
// import { BASE_URL, HEADERS } from "./Base.js";

// const apiClient = axios.create({
//   baseURL: BASE_URL + "/api",
//   headers: HEADERS,
// });
import { api } from "./axios.js";
export default {
  createNotification(payload) {
    return api.post("/notification", payload);
  },
  updateNotification(id, payload) {
    return api.put("/notification/" + id, payload);
  },
  deleteNotification(id) {
    return api.delete("/notification/" +id);
  },
  getListNotification() {
    return api.get("/notification");
  },
  getNotificationById(id) {
    return api.get("/notificationById/" + id);
  },
  personalNotification(limit) {
    return api.get("/personalNotification", { params: { limit: limit } });
  },
};
