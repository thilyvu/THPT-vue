<!-- 
	This is the dashboard layout, used in dashboard, tables, billing and profile pages.
 -->

<template>
  <!-- Dashboard Layout -->
  <a-layout class="layout-dashboard">
    <DashboardHeader
      :sidebarCollapsed="sidebarCollapsed"
      :navbarFixed="navbarFixed"
      @toggleSettingsDrawer="toggleSettingsDrawer"
      @toggleSidebar="toggleSidebar"
      style="margin-bottom: 5rem"
    ></DashboardHeader>
    <!-- <a-layout> -->
    <a-layout-content>
      <router-view />
    </a-layout-content>
    <!-- </a-layout> -->

    <DashboardFooter />
  </a-layout>
</template>

<script>
import DashboardSidebar from "../components/Sidebars/DashboardSidebar";
import DashboardHeader from "../components/Headers/DashboardHeader";
import DashboardSettingsDrawer from "../components/Sidebars/DashboardSettingsDrawer";
import DashboardFooter from "../components/Footers/DashboardFooter.vue";

export default {
  components: {
    DashboardSidebar,
    DashboardHeader,
    DashboardSettingsDrawer,
    DashboardFooter,
  },
  data() {
    return {
      // Sidebar collapsed status.
      sidebarCollapsed: false,

      // Main sidebar color.
      sidebarColor: "primary",

      // Main sidebar theme : light, white, dark.
      sidebarTheme: "light",

      // Header fixed status.
      navbarFixed: false,

      // Settings drawer visiblility status.
      showSettingsDrawer: false,
    };
  },
  methods: {
    toggleSidebar(value) {
      this.sidebarCollapsed = value;
    },
    toggleSettingsDrawer(value) {
      this.showSettingsDrawer = value;
    },
    toggleNavbarPosition(value) {
      this.navbarFixed = value;
    },
    updateSidebarTheme(value) {
      this.sidebarTheme = value;
    },
    updateSidebarColor(value) {
      this.sidebarColor = value;
    },
  },
  computed: {
    // Sets layout's element's class based on route's meta data.
    layoutClass() {
      return this.$route.meta.layoutClass;
    },
  },
};
</script>
