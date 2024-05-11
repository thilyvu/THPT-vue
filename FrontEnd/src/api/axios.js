import axios from "axios";
import VueCookies from "vue-cookies";
import { BASE_URL } from "./Base";
// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: `${BASE_URL}/api` });

api.interceptors.request.use((config) => {
  const accessToken = VueCookies.get("token");
  if (accessToken) {
    config.headers.common["Authorization"] = accessToken;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const accessToken = VueCookies.get("token");
    if (error.response.status === 401 && accessToken) {
      const refreshToken = VueCookies.get("refreshToken").replace(
        "Bearer ",
        ""
      );
      if (refreshToken) {
        axios
          .post(`${API_URL}/users/refresh-token`, {
            refreshToken,
          })
          .then((response) =>
            VueCookies.set("token", response.data.result.token, "1h")
          );
      } else {
        this.$router.push({ path: "/sign-in" });
      }
      if (newAccessToken) {
        error.config.headers["Authorization"] = refreshToken;
      }
      return axios(error.config);
    } else {
      return Promise.reject(error);
    }
  }
);
export { api };
