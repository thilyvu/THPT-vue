import VueCookies from "vue-cookies";
export let TOKEN = VueCookies.get("token");
// export const BASE_URL = "https://be-eduhub.herokuapp.com";
// export const BASE_URL = "https://ieltsbe.tretrau.vn";
export const BASE_URL = "http://14.225.210.27:5001";
// export const BASE_URL = "http://localhost:5001";
export const HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: TOKEN,
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept",
};
