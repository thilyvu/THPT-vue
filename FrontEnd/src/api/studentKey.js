import { api } from "./axios.js";
export default {
  createStudentKey(payload) {
    return api.post("/studentKey", payload);
  },
  updateStudentKey(id, payload) {
    return api.put("/studentKey/" + id, payload);
  },
  deleteStudentKey(id) {
    return api.delete("/studentKey" + id);
  },
  getListStudentKey() {
    return api.get("/studentKey");
  },
  getStudentKeyById(id) {
    return api.get("/studentKeyById" + id);
  },
  getStudentKeyByClassId(payload) {
    return api.post("/StudentKeyByClassId", payload);
  },
  getStudentKeyByClassAndStudentId(payload) {
    return api.post("/StudentKeyByClassIdAndStudentId", payload);
  },
  getStudentKeyByClassAndTestId(payload) {
    return api.post("/StudentKeyByClassAndTestId", payload);
  },
  getcurrentStudentKeyByClassAndTestId(payload) {
    return api.post("/currentStudentKeyByClassAndTestId", payload);
  },
  getCurrentStudentKeyByClassAndTestIdAndStudentId(payload) {
    return api.post("/studentKeyByClassAndTestIdAndStudentId", payload);
  },
};
