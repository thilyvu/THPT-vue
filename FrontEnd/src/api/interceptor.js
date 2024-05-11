import camelcaseKeys from "camelcase-keys";
import VueCookies from "vue-cookies";
import { API_URL } from "./base";
import axios from "axios";
function setup(instance) {
  instance.interceptors.request.use(
    function(config) {
      const token = VueCookies.get("token");
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    function(err) {
      return Promise.reject(err);
    }
  );
}

async function checkToken(instance) {
  instance.interceptors.response.use(
    (response) => {
      if (response.headers["content-type"].startsWith("application/json")) {
        response.data = camelcaseKeys(response.data, { deep: true });
      }
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
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
          this.$router.push({ path: "/login" });
        }

        // window.location.href = window.location.origin + "/login";
      }
      return Promise.reject(error);
    }
  );
}

export default {
  setup,
  checkToken,
};
