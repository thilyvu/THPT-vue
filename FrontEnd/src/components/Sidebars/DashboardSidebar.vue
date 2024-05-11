<template>
  <!-- Main Sidebar -->
  <a-layout-sider
    collapsible
    class="sider-primary"
    breakpoint="lg"
    collapsed-width="0"
    width="250px"
    :collapsed="sidebarCollapsed"
    @collapse="$emit('toggleSidebar', !sidebarCollapsed)"
    :trigger="null"
    :class="[
      'ant-layout-sider-' + sidebarColor,
      'ant-layout-sider-' + sidebarTheme,
    ]"
    theme="light"
    :style="{ backgroundColor: 'transparent' }"
  >
    <div class="brand">
      <img :src="userProfile.avatar" alt="" />
      <span>{{ userProfile.name }}</span>
    </div>
    <hr />

    <!-- Sidebar Navigation Menu -->
    <a-menu theme="light" mode="inline">
      <a-menu-item>
        <router-link to="dashboard">
          <span class="icon">
            <img src="../../assets/icons/dashboard.svg" alt="" />
          </span>
          <span class="label">Trang chủ</span>
        </router-link>
      </a-menu-item>
      <a-menu-item>
        <router-link to="resources">
          <span class="icon">
            <img src="../../assets/icons/resources.svg" alt="" />
          </span>
          <span class="label">Document</span>
        </router-link>
      </a-menu-item>
      <a-menu-item>
        <router-link to="calendar">
          <span class="icon">
            <img src="../../assets/icons/calendar.svg" alt="" />
          </span>
          <span class="label">Thời khóa biểu</span>
        </router-link>
      </a-menu-item>
      <a-menu-item class="menu-item-header"> Quản lý tài khoản </a-menu-item>
      <a-menu-item>
        <router-link to="/profile">
          <span class="icon">
            <img src="../../assets/icons/profile.svg" alt="" />
          </span>
          <span class="label">Trang cá nhân</span>
        </router-link>
      </a-menu-item>
      <a-menu-item>
        <router-link to="sign-in" v-on:click.native="SignOut">
          <span class="icon">
            <img src="../../assets/icons/signup.svg" alt="" />
          </span>
          <span class="label">Đăng xuất</span>
        </router-link>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import { LocalStorageMixin } from "../../mixin/LocalStorage";
import VueCookies from "vue-cookies";
export default {
  mixins: [LocalStorageMixin],
  components: {},
  props: {
    // Sidebar collapsed status.
    sidebarCollapsed: {
      type: Boolean,
      default: false,
    },

    // Main sidebar color.
    sidebarColor: {
      type: String,
      default: "primary",
    },

    // Main sidebar theme : light, white, dark.
    sidebarTheme: {
      type: String,
      default: "light",
    },
  },
  data() {
    return {
      // sidebarCollapsedModel: this.sidebarCollapsed,
    };
  },
  methods: {
    SignOut() {
      VueCookies.remove("token");
      localStorage.removeItem("token");
      localStorage.removeItem("userProfile");
      this.openNotificationWithIcon("success");
      this.$router.push("/sign-in");
    },
    openNotificationWithIcon(type, text) {
      this.$notification[type]({
        message:
          type === "success" ? "Đăng xuất thành công" : "Đăng xuất thất bại",
        description: text,
      });
    },
  },
  computed: {
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
  },
};
</script>
