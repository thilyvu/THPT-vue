import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    notification: {
      visible: false,
      title: "",
      type: "success",
    },
    resetForm: false,
    listTopics: {},
    isLogin: null,
    sendTest: false,
    searchClass: "",
    isCollapsed : false
  },
  getters: {
    notificationInfo(state) {
      return state.notification;
    },
    resetForm(state) {
      return state.resetForm;
    },
    getSearchText(state) {
      return state.searchClass;
    },
    getIsCollapse(state) {
      return state.isCollapsed;
    },    
    getListTopics(state) {
      return state.listTopics;
    },
  },
  mutations: {
    PUSH_NOTIFICATION(state, newNotification) {
      state.notification = newNotification;
    },
    SET_LOGIN(state, isLogin) {
      state.isLogin = isLogin;
    },
    SET_SEND_TEST_STATUS(state, sendTest) {
      state.sendTest = sendTest;
    },
    SET_SEARCH_TEXT(state, newSearchText) {
      state.searchClass = newSearchText;
    },
    SET_COLLAPSE(state, isCollapsed) {
      state.isCollapsed = isCollapsed;
    },
    SET_LIST_TOPICS(state, listTopics) {
      state.listTopics = listTopics;
    },
  },
  actions: {},
  modules: {},
});
