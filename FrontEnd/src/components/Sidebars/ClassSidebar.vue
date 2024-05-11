<template>
  <div>
      <!-- Main Sidebar -->
  <a-layout-sider
    collapsible
    class="sider-primary"
    :collapsed="isCollapsed"
    breakpoint="lg"
    collapsed-width="0"
    width="250px"
    style="min-height : 505px; position: fixed;"
    @collapse="$emit('toggleSidebar', !sidebarCollapsed)"
    :trigger="null"
    :class="[
      'ant-layout-sider-' + sidebarColor,
      'ant-layout-sider-' + sidebarTheme,
    ]"
    theme="light"
    :style="isCollapsed ? { background: 'transparent !important ', minWidth : '10px', width : '60px'} :{ background: 'transparent !important', minWidth : '250px'} "
  >
  <div style="min-height : 88px" :style="userProfile.role === 'teacher' ? { minHeight: '88px'} :{ minHeight: '40px' } ">
    <h5 :style="isCollapsed ? { display: 'none'} :{ } ">{{ classInfo.name }}</h5>
    <!-- <h6 :style="isCollapsed ? { display: 'none'} :{ } ">{{ classInfo.classCode }}</h6> -->
    <a-row :style="isCollapsed ? { display: 'none'} :{ } " type="flex" justify="space-between" align="bottom">
      <a-col :span="16" v-if="userProfile.role === 'teacher'"
        ><img :src="classInfo.banner" alt="" style="width: 40px"
      /></a-col>
      <a-col :span="8" v-if="userProfile.role === 'teacher'"
        ><a-button shape="circle" icon="setting" @click="editClass"
      /></a-col>
    </a-row>
  </div>
   
    <hr />
    <div style="display :flex; align-items : center; min-height: 150px;" class=" responsive-layout-sider">
    <!-- Sidebar Navigation Menu -->
    <a-menu :style="isCollapsed ? { display: 'none'} :{ } " theme="light" mode="inline">
      <a-menu-item>
        <router-link to="test">
          <span class="icon">
            <img src="../../assets/icons/test.svg" alt="" />
          </span>
          <span class="label">Test</span>
        </router-link>
      </a-menu-item>
      <a-menu-item>
        <router-link to="newsfeed">
          <span class="icon">
            <img src="../../assets/icons/dashboard.svg" alt="" />
          </span>
          <span class="label">Newsfeed</span>
        </router-link>
      </a-menu-item>
      <a-menu-item>
        <router-link v-if="userProfile.role === 'teacher'" to="member">
          <span class="icon">
            <img src="../../assets/icons/member.svg" alt="" />
          </span>
          <span class="label">Member</span>
        </router-link>
      </a-menu-item>
      <a-menu-item>
        <router-link v-if="userProfile.role === 'teacher'" to="lesson">
          <span class="icon">
            <img src="../../assets/icons/lesson.svg" alt="" />
          </span>
          <span class="label">Lecture</span>
        </router-link>
      </a-menu-item>
      <a-menu-item>
        <router-link to="exercise">
          <span class="icon">
            <img src="../../assets/icons/exercise.svg" alt="" />
          </span>
          <span class="label">Material</span>
        </router-link>
      </a-menu-item>
      <a-menu-item>
        <router-link v-if="userProfile.role === 'teacher'" to="document">
          <span class="icon">
            <img src="../../assets/icons/document.svg" alt="" />
          </span>
          <span class="label">Document</span>
        </router-link>
      </a-menu-item>
    </a-menu>
    <!-- <a-button @click="handleCollapse" class="btn-expand" shape="circle">
        <img style="width :24px" :src="collapseIcon" alt="" />
      </a-button> -->
    <!-- / Sidebar Navigation Menu -->
    </div>

  </a-layout-sider>
  <!-- <div style="width :250px">

  </div> -->
  <!-- / Main Sidebar -->
  </div>

</template>

<script>
import { LocalStorageMixin } from "../../mixin/LocalStorage";

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

    sidebarTheme: {
      type: String,
      default: "light",
    },
  },
  data() {
    return {
      isCollapsed : false
    };
  },
  computed: {
    collapseIcon() {
      return !this.isCollapsed ? 'https://firebasestorage.googleapis.com/v0/b/tretrauquiz.appspot.com/o/image%2Fleft.png?alt=media&token=769dd058-0fd0-428e-98a5-3b82845d1227': "https://firebasestorage.googleapis.com/v0/b/tretrauquiz.appspot.com/o/image%2Fnext.png?alt=media&token=f699e109-1fe9-4381-8d97-02fbfa8f5a23"
    },
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
  },
  methods: {
    editClass() {
      this.$router.push({
        name: "Chỉnh sửa Lớp",
        params: { id: this.classInfo.id },
      });
    },
    handleCollapse () {
      this.isCollapsed = !this.isCollapsed
    }
  },
};
</script>
<style lang="scss"  scoped>
@media only screen and (max-width: 1000px) {
  .responsive-layout-sider {
    min-height: 75px !important;  
    height: 30vh !important;
    overflow: scroll;
    background: transparent;
    padding-top: 50px;
  }
  .btn-expand {
    display: none;
  }
}
</style>