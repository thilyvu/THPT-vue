<template>
  <!-- Dashboard Layout -->
  <a-layout class="layout-dashboard navbar-fixed">
    <DashboardHeader
      :sidebarCollapsed="sidebarCollapsed"
      :navbarFixed="navbarFixed"
      @toggleSettingsDrawer="toggleSettingsDrawer"
      style="margin-bottom: 5rem"
    ></DashboardHeader>
    <a-layout class="responsive-layout" style="margin-left :1%">
      <div class="responsive-layout-for-mobile-view" style="width : 260px"></div>
      <ClassSidebar
        class="responsive-side-bar"
        :sidebarColor="sidebarColor"
        :sidebarTheme="sidebarTheme"
      ></ClassSidebar>
      <ClassSidebarMobile
        class="responsive-side-bar-mobile"
        :sidebarCollapsed="sidebarCollapsed"
        :sidebarColor="sidebarColor"
        :sidebarTheme="sidebarTheme"
      ></ClassSidebarMobile>
      <a-layout-content class="responsive-layout-content">
        <router-view />
      </a-layout-content>
    </a-layout>
    <div
      class="sidebar-overlay"
      @click="sidebarCollapsed = true"
      v-show="!sidebarCollapsed"
    ></div>

    <!-- Settings Drawer -->
    <DashboardSettingsDrawer
      :showSettingsDrawer="showSettingsDrawer"
      :navbarFixed="navbarFixed"
      :sidebarTheme="sidebarTheme"
      @toggleSettingsDrawer="toggleSettingsDrawer"
      @toggleNavbarPosition="toggleNavbarPosition"
      @updateSidebarTheme="updateSidebarTheme"
      @updateSidebarColor="updateSidebarColor"
    ></DashboardSettingsDrawer>
    <!-- / Settings Drawer -->
  </a-layout>
  <!-- / Dashboard Layout -->
</template>

<script>
import ClassSidebar from "../components/Sidebars/ClassSidebar";
import ClassSidebarMobile from "../components/Sidebars/ClassSidebarMobile";
import DashboardHeader from "../components/Headers/DashboardHeader";
import DashboardSettingsDrawer from "../components/Sidebars/DashboardSettingsDrawer";

export default {
  components: {
    ClassSidebar,
    DashboardHeader,
    ClassSidebarMobile,
    DashboardSettingsDrawer,
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
<style lang="scss" scoped>
.responsive-layout {
  display: flex;
}
.responsive-side-bar {
  display: grid;
}
.responsive-side-bar-mobile {
  visibility: hidden;
}
.layout-dashboard {
      .sidebar-overlay {
        display: none !important;
      } 
    }
@media only screen and (max-width: 700px) {
    .responsive-side-bar-mobile {
      display: flex !important;
      visibility: visible;
      width: 100vw !important;
      height: fit-content !important;
      margin-bottom: 1rem;
    }
    .layout-dashboard {
      padding-right: 3%;
      .sidebar-overlay {
        display: none !important;
      } 
    }
    .responsive-side-bar {
      display: none !important;
    }
    .responsive-layout {
      display: contents !important;
    }
    .responsive-layout-content {
      width: 100vw;
      margin-left :0px
    }
  }
  
  @media only screen and (max-width: 500px) {
    .responsive-side-bar-mobile {
      margin-bottom: 0rem !important;
    }
  }
  @media only screen and (max-width: 400px) {
    .layout-dashboard {
      .icon {
        margin : 0px !important;
      }
      .ant-layout-sider.sider-primary {
        z-index: 0 !important;
        padding :0px !important;
        .ant-menu-item { 
          .icon  {
            margin-right: 0px !important;
          }
        }
        .ant-menu-item a{
          padding: 10px !important;
        }
        
    }
    .ant-menu-item {
      width: 50px !important;
    }
    }
   .responsive-layout-for-mobile-view {
    display: none;
   }
   .responsive-side-bar-mobile {
    width: 99vw !important;
   }
   .responsive-layout-content {
      width: 100vw;
      margin-left :-1vw !important
    }
  } 
  @media only screen and (max-width: 1000px) {
    .layout-dashboard {
      padding-right: 3%;
      .ant-layout-content {
        margin :0px
      }
    }
  }
</style>
