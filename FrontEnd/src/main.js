import Vue from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import App from "./App.vue";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import DefaultLayout from "./layouts/Default.vue";
import DashboardLayout from "./layouts/Dashboard.vue";
import ClassroomLayout from "./layouts/Classroom.vue";
import LayoutWithoutSidebar from "./layouts/LayoutWithoutSidebar.vue";
import router from "./router";
import moment from "moment";
import Viewer from "v-viewer";
import store from "./store";

Vue.prototype.moment = moment;
import "./scss/app.scss";

import vuetify from "./plugins/vuetify";
import VueTextareaAutosize from "vue-textarea-autosize";
import Murmur from "@icij/murmur";
import CKEditor from "@ckeditor/ckeditor5-vue2";

Vue.use(Murmur);
Vue.use(Antd);
Vue.use(VueTextareaAutosize);
Vue.use(Viewer);
Vue.use(CKEditor);
Vue.config.productionTip = false;

firebase.initializeApp({
  apiKey: "AIzaSyC6Wmdzb698wNw3R7pHGBs-nSfNhcNVkxg",
  authDomain: "thpt-demo.firebaseapp.com",
  projectId: "thpt-demo",
  storageBucket: "thpt-demo.appspot.com",
  messagingSenderId: "554478564884",
  appId: "1:554478564884:web:c21fc36456db9e3c4bd901",
  measurementId: "G-DVZRDXC9P3",
});

export const db = firebase.firestore();

Vue.config.produpctionTip = false;

// Adding template layouts to the vue components.
Vue.component("layout-default", DefaultLayout);
Vue.component("layout-dashboard", DashboardLayout);
Vue.component("layout-classroom", ClassroomLayout);
Vue.component("layout-without-sidebar", LayoutWithoutSidebar);

new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");
