<template>
  <div class="sidebar-container">
    <v-card
    class="mx-auto overflow-hidden"
    height="150"
    width ="150"
    v-bind:style="[
          drawer
            ? {left : '4%', top : '9%'}
            : { display: 'none' },
        ]"
    style="position:absolute; z-index: 1000;"
  >
  <v-app-bar-nav-icon @click.stop="drawer = !drawer" ></v-app-bar-nav-icon>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      style=" z-index: 1000;"
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
        >
          <v-list-item >
            <v-list-item-title > 
              <router-link style="display: flex; align-items: center;" to="newsfeed">
              <span class="icon">
                <img src="../../assets/icons/dashboard.svg" alt="" />
              </span>
              <p style="font-size : 14px; margin-top: 13px; margin-left: 0.5rem; color: black; font-weight: bold;">Newsfeed</p>
            </router-link>

          </v-list-item-title>
          </v-list-item>

          <v-list-item v-if="userProfile.role === 'teacher'">
            <v-list-item-title  >
              <router-link to="member" style="display: flex; align-items: center;">
              <span class="icon">
                <img src="../../assets/icons/member.svg" alt="" />
              </span>
              <p style="font-size : 14px; margin-top: 13px; margin-left: 0.5rem; color: black; font-weight: bold;">Member</p>
            </router-link>
            
         
              </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="userProfile.role === 'teacher'">
            <v-list-item-title >  <router-link style="display: flex; align-items: center;" to="lesson">
              <span class="icon">
                <img src="../../assets/icons/lesson.svg" alt="" />
              </span>
              <p style="font-size : 14px; margin-top: 13px; margin-left: 0.5rem; color: black; font-weight: bold;">Lecture</p>
            </router-link>
          
          </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="userProfile.role === 'teacher'">
            <v-list-item-title >                       
              <router-link style="display: flex;  align-items: center;" to="document">
              <span class="icon">
                <img src="../../assets/icons/document.svg" alt="" />
              </span>
              <p style="font-size : 14px; margin-top: 13px; margin-left: 0.5rem; color: black; font-weight: bold;">Document</p>
            </router-link>
         
          </v-list-item-title>
          </v-list-item>
          
          <v-list-item>
            <v-list-item-title >                       
              <router-link style="display: flex; align-items: center;" to="test" >
              <span class="icon">
                <img src="../../assets/icons/test.svg" alt="" />
              </span>
              <p style="font-size : 14px; margin-top: 13px; margin-left: 0.5rem; color: black; font-weight: bold;">Test</p>
            </router-link>
         
          </v-list-item-title>
          </v-list-item>
          <v-list-item >
            <v-list-item-title title="Material" >                       
              <router-link to="exercise" style="display: flex; align-items: center;">
              <span class="icon">
                <img src="../../assets/icons/exercise.svg" alt="" />

              </span>
              <p style="font-size : 14px; margin-top: 13px; margin-left: 0.5rem; color: black; font-weight: bold;">Material</p>
            </router-link>
           
          </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-card>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" style="color :black ; margin-left: 1rem; margin-right :0.5rem"></v-app-bar-nav-icon>
    <!-- Main Sidebar -->
    <!-- <a-layout-sider
      class="sider-primary"
      breakpoint="lg"8
      style="
        width: 100vw;
        min-width: 100vw;
        z-index: 1000;
        height: fit-content;
        position: fixed;
        padding: 0;
        margin-top: 0rem;
      "
      :trigger="null"
      theme="light"
    >
      <div> -->
        <!-- Sidebar Navigation Menu -->
        <!-- <a-menu
          theme="light"
          style="display: flex; width: 100vw !important"
          mode="horizontal"
        >
          <a-menu-item title="Newsfeed" style="width :62px">
            <router-link to="newsfeed">
              <span class="icon">
                <img src="../../assets/icons/dashboard.svg" alt="" />
              </span>
            </router-link>
          </a-menu-item>
          <a-menu-item v-if="userProfile.role === 'teacher'" title="Member" style="width :62px">
            <router-link to="member">
              <span class="icon">
                <img src="../../assets/icons/member.svg" alt="" />
              </span>
            </router-link>
          </a-menu-item>

          <a-menu-item v-if="userProfile.role === 'teacher'" title="Lesson" style="width :62px">
            <router-link to="lesson">
              <span class="icon">
                <img src="../../assets/icons/lesson.svg" alt="" />
              </span>
            </router-link>
          </a-menu-item>
          <a-menu-item v-if="userProfile.role === 'teacher'" title="Document" style="width :62px">
            <router-link to="document">
              <span class="icon">
                <img src="../../assets/icons/document.svg" alt="" />
              </span>
            </router-link>
          </a-menu-item>

          <a-menu-item title="Exercise" style="width :62px">
            <router-link to="exercise">
              <span class="icon">
                <img src="../../assets/icons/exercise.svg" alt="" />
              </span>
            </router-link>
          </a-menu-item>
          <a-menu-item title="Test" style="width :62px">
            <router-link to="test">
              <span class="icon">
                <img src="../../assets/icons/test.svg" alt="" />
              </span>
            </router-link>
          </a-menu-item>
        </a-menu> -->
        <!-- / Sidebar Navigation Menu -->
      <!-- </div>
    </a-layout-sider> -->
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
  watch: {
    group () {
        this.drawer = false
      },
  },
  data() {
    return {
      isCollapsed: true,
      drawer: false,
      group: null,
    };
  },
  computed: {
    collapseIcon() {
      return !this.isCollapsed
        ? "https://firebasestorage.googleapis.com/v0/b/tretrauquiz.appspot.com/o/image%2Fleft.png?alt=media&token=769dd058-0fd0-428e-98a5-3b82845d1227"
        : "https://firebasestorage.googleapis.com/v0/b/tretrauquiz.appspot.com/o/image%2Fnext.png?alt=media&token=f699e109-1fe9-4381-8d97-02fbfa8f5a23";
    },
  },
  methods: {
    editClass() {
      this.$router.push({
        name: "Chỉnh sửa Lớp",
        params: { id: this.classInfo.id },
      });
    },
    handleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
};
</script>
  <style lang="scss"  scoped>
</style>