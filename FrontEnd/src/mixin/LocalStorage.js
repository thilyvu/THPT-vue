import VueCookies from "vue-cookies";
export const LocalStorageMixin = {
  methods: {
    classLocalStorage(payload) {
      localStorage.setItem("class", JSON.stringify(payload));
    },
    getToken() {
      return VueCookies.get("token");
    },
    deleteLocalStorage() {
      localStorage.removeItem("token");
      localStorage.removeItem("userProfile");
    },
    deleteCookie() {
      VueCookies.remove("token");
    },
    setToken(token) {
      localStorage.setItem("token", token);
      VueCookies.set("token", token, "128 days");
    },
    setUserProfile(payload) {
      localStorage.setItem("userProfile", JSON.stringify(payload));
    },
  },
  computed: {
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
    classInfo() {
      return JSON.parse(localStorage.getItem("class"));
    },
  },
};
