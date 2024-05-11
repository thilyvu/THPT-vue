import { api } from "./axios.js";
export default {
  createStudent(payload) {
    return api.post("/register-user", payload);
  },
  authFacebook(payload) {
    return api.post("/authFacebook", payload);
  },
  createTeacher(payload) {
    return api.post("/register-teacher", payload);
  },
  createSuperAdmin(payload) {
    return api.post("/register-super-admin", payload);
  },
  login(payload) {
    return api.post("/login-user", payload);
  },
  logout() {
    return api.post("/logout");
  },

  updateProfile(id, payload) {
    return api.put("/update-profile/" + id, payload);
  },
  updatePassword(id, payload) {
    return api.put("/updatePassword/" + id, payload);
  },

  getListUsers(email) {
    return api.get("/getListUsers?email=" + email);
  },
  getUserById(id) {
    return api.get("/getUser/" + id);
  },
  getUserByEmail(payload) {
    return api.get("/getUserEmail?email=" + payload);
  },
  getProfile(token) {
    return api.get("/profile");
  },
  getAdminProfile() {
    return api.get("/super-admin-profile");
  },
  getUserByEmail(email) {
    return api.get("/getUserByEmail/" + email);
  },
  verifyCode(payload) {
    return api.post("/verifyCode", payload);
  },
  resendMail(email) {
    return api.post("/resendMail/" + email);
  },
  resetPassword(id, payload) {
    return api.put("/resetPassword/" + id, payload);
  },
};
