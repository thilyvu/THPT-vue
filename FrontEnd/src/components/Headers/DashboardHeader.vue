<template>
  <div>
    <a-layout-header
      id="navbar"
      :style="{
        margin: '0px 0px 20px 0px',
        backgroundColor: '#e5bf29',
        borderRadius: '0px',
        padding: '12px',
      }"
      class="responsive-header-container"
      style="position: fixed; top: 0; width: 100vw !important; transition: top 0.3s;
      "
    >
    <template>
      
  <v-card
    class="mx-auto overflow-hidden"
    height="2000"
    width ="250"
    v-bind:style="[
          drawer
            ? {left : '0', top : '0'}
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
          <v-list-item>
            <v-list-item-title>  <router-link class="link" to="/dashboard" style="color :black">Class</router-link></v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title> <router-link class="link" to="/resources" style="color :black">Document</router-link></v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title> <router-link
              class="link"
              style="color :black"
              to="/questionBank"
              v-if="userProfile.role === 'teacher' || userProfile === 'admin'"
              >Question Bank</router-link
            ></v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>                       
              <router-link
              class="link"
              style="color :black"
              to="/test"
              v-if="userProfile.role === 'teacher' || userProfile === 'admin' || userProfile === 'testCT'"
              >Test</router-link
            ></v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>
      <nav  :style="[userProfile.role === 'teacher' ? { marginLeft: '2%', marginRight: '2%'}: { marginLeft: '5%', marginRight: '5%'}]">
        <div class="branding">
          <!-- <v-app-bar-nav-icon class="responsive-drawer" @click.stop="drawer = !drawer" style="color :white ; margin-left: -1rem; margin-right :0.5rem"></v-app-bar-nav-icon> -->
          <router-link class="header" to="/dashboard">
            
            <img class="responsive-header-logo-mobile" style="width: 160px;" src="https://tretrau.vn/wp-content/uploads/2020/02/logo-ko-vien-e1581114645289.png"/>
          </router-link>
          <a-input
          class="responsive-search-input"
            style="width: 500px; height: 2.3rem; margin-left: 1rem"
            v-if="
              userProfile.role === 'student' &&
              this.$route.path === '/dashboard'
            "
            placeholder="Search by class name or code"
            @change="handleChange"
            v-model="txtSearch"
          />
        </div>
     
        <nav class="nav-links responsive-notice-list-icon " >
          <ul class ="responsive-header">
            <router-link  v-if="userProfile.role === 'teacher' || userProfile.role === 'admin'" class="link" to="/dashboard">Class</router-link>
            <router-link  v-if="userProfile.role === 'teacher' || userProfile.role === 'admin'" class="link" to="/resources">Document</router-link>
            <router-link
              class="link"
              to="/questionBank"
              v-if="userProfile.role === 'teacher' || userProfile.role === 'admin'"
              >Question Bank</router-link
            >
            <router-link
              class="link"
              to="/quiz"
              v-if="userProfile.role === 'teacher' || userProfile.role === 'admin' || userProfile.role === 'testCT'"
              >Test</router-link
            >
       
          </ul>
          <a-dropdown  placement="bottomLeft" style="margin-right : 2rem; " overlayClassName="header-notifications-dropdown">
            <div style="background: #eae087; padding : 13px; border-radius: 50%; width: 45px; height: 45px;" class="responsive-header-notice-icon-mobile-container">
              <a-badge :count="unreadNoti" style="margin-right : 15px" class="responsive-header-badge-mobile-container">
                <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                  <img
                  
                    src="../../assets/icons/notify.svg"
                    class="notify_icon responsive-header-notice-icon-mobile"
                    alt=""
                    style="width :25px; margin-left: -3px;"
                  />
                </a>
              </a-badge>
            </div>
           
              <a-list
                item-layout="horizontal"
                class="header-notifications-list responsive-notice-list"
                :data-source="notiData"
                slot="overlay"
                style="height: fit-content; padding-top: 0.3rem;"
              >
                <a-list-item
                  style="padding: 5px 15px 0px 15px"
                  slot="renderItem"
                  slot-scope="item"
                  class="hover-item"
                >
                  <a-list-item-meta class="hover-item" 
                      @click="enterNotification(item)">
                    <template #description>
                      <div style="height : 50px">
                        <p style="margin-top : -4px ;margin-bottom: 0px; text-overflow: ellipsis; 
                              overflow: hidden; 
                                white-space: nowrap; word-break: break-all; cursor: pointer;">
                        {{ item.content }}
                      </p>
                      <div style="display :flex"> 
                        <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        style="margin-top: 2px"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM11 6C11 5.44772 10.5523 5 10 5C9.44772 5 9 5.44772 9 6V10C9 10.2652 9.10536 10.5196 9.29289 10.7071L12.1213 13.5355C12.5118 13.9261 13.145 13.9261 13.5355 13.5355C13.9261 13.145 13.9261 12.5118 13.5355 12.1213L11 9.58579V6Z"
                          fill="#111827"
                        />
                      </svg>
                      <p style="margin-top: 1px;margin-left: 5px; cursor: pointer;">{{ item.diffDate }}</p>
                      </div>

                      </div>
                   
                    </template>
                    <p
                      class="list-title"
                      slot="title"
                      style="margin: 0px !important"
                      :class="[item.isRead ? '' : 'unreadNoti']"
                    >
                      {{ item.title }}
                    </p>
                    <a-avatar
                    
                      style="margin-top: 1rem; width: 40px; height: 40px;border-radius: 50%;"
                      v-if="item.bannerImg"
                      slot="avatar"
                      shape="square"
                      :src="item.bannerImg"
                    />
                    <a-avatar
                      style="margin-top: 1rem; width: 40px; height: 40px;border-radius: 50%;"
                      v-else
                      shape="square"
                      slot="avatar"
                      v-html="item.svg"
                    />
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-dropdown>
            <a-dropdown  placement="bottomRight" > 
              <a-avatar class="responsive-header-avatar-mobile"   style=" width: 45px; height: 45px;" :src="userProfile.avatar" />
              <template #overlay>
              <div class="profile-menu" >
                <div class="info">
                  <p class="initials"><a-avatar :src="userProfile.avatar" /></p>
                  <div class="right">
                    <p style="color : white">{{ userProfile.name }}</p>
                    <p style="color : white">{{ userProfile.email }}</p>
                  </div>
                </div>
                <div class="options">
                  <div class="option">
                    <router-link class="option" to="/profile">
                      <a-icon type="user" />
                      <p>Profile</p>
                    </router-link>
                  </div>
                  <div @click="signOut" class="option">
                    <a-icon type="logout" />
                    <p>Log out</p>
                  </div>
                </div>
              </div>  
            </template>
            </a-dropdown>
          <!-- <div
            @click="profileMenu = !profileMenu"
            class="/profile"
            ref="profile"
          >

            <a-avatar class="responsive-header-avatar-mobile"   style=" width: 45px; height: 45px;" :src="userProfile.avatar" />
          </div> -->
        </nav>
      </nav>
    </a-layout-header>
    <div v-if="profileMenu" class="profile-menu">
      <div class="info">
        <p class="initials"><a-avatar :src="userProfile.avatar" /></p>
        <div class="right">
          <p>{{ userProfile.name }}</p>
          <p>{{ userProfile.email }}</p>
        </div>
      </div>
      <div class="options">
        <div class="option">
          <router-link class="option" to="/profile">
            <a-icon type="user" />
            <p>Profile</p>
          </router-link>
        </div>
        <div @click="signOut" class="option">
          <a-icon type="logout" />
          <p>Log out</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LocalStorageMixin } from "../../mixin/LocalStorage";
import { NotificationMixin } from "../../mixin/Notification";
import { DatetimeMixin } from "../../mixin/Datetime";
import Notification from "../../api/Notification";
import VueCookies from "vue-cookies";
import store from "../../store/index";
export default {
  mixins: [LocalStorageMixin, NotificationMixin, DatetimeMixin],
  props: {
    // Header fixed status.
    navbarFixed: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    group () {
        this.drawer = false
      },
  },
  data() {
    return {
      top: 0,
      searchLoading: false,
      wrapper: document.body,
      profileMenu: false,
      notiData: null,
      limit: 5,
      txtSearch: "",
      drawer: false,
      group: null,
    };
  },
  methods: {
    resizeEventHandler() {
      this.top = this.top ? 0 : -0.01;
    },
    signOut() {
      this.openNotificationWithIcon("success", "Đăng xuất thành công");
      this.deleteLocalStorage();
      this.deleteCookie();
      VueCookies.remove("token");
      localStorage.removeItem("token");
      localStorage.removeItem("userProfile");
      this.$router.push("/sign-in");
      store.commit("SET_LOGIN", false);
    },
    handleChange() {
      store.commit("SET_SEARCH_TEXT", this.txtSearch);
    },
    getNotification() {
      Notification.personalNotification(this.limit)
        .then((res) => {
          this.notiData = res.data.data.map((obj) => {
            return {
              ...obj,
              diffDate: this.diffDateFromNow(obj.createdAt),
            };
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    enterNotification(item) {
      const payload = {
        isRead: "true",
      };
      Notification.updateNotification(item._id, payload);
      if (
        this.$route.params.id &&
        this.$route.params.id === item.metadata.ClassId
      ) {
        this.openNotificationWithIcon("error", "You are in the class which this notice belong to ");
      } else {
        this.$router.push({
          name: "quizExercise",
          params: { id: item.metadata.ClassId },
        });
      }
      this.getNotification();
    },
  },
  computed: {
    unreadNoti() {
      return this.notiData?.filter((item) => !item.isRead).length;
    },
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
  },
  mounted: function () {
    // Set the wrapper to the proper element, layout wrapper.
    this.wrapper = document.getElementById("layout-dashboard");
    this.getNotification();
  },
  created() {
    // Registering window resize event listener to fix affix elements size
    // error while resizing.
    window.addEventListener("resize", this.resizeEventHandler);
  },
  destroyed() {
    // Removing window resize event listener.
    window.removeEventListener("resize", this.resizeEventHandler);
  },
};
</script>
<style lang="scss" scoped>
header {
  background-color: #fff;
  color: white;
  padding: 0 25px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 99;
  &:hover {
    color: #007bff;
  }
  .link {
    font-weight: 500;
    padding: 15px 0px 8px 8px;
    transition: 0.3s color ease;
    color: white;
    &:hover {
      color: #007bff;
    }
  }
  nav {
    display: flex;
    // padding: 25px 0;
    .branding {
      display: flex;
      align-items: center;
      .header {
        font-weight: 600;
        font-size: 24px;
        color: white;
        text-decoration: none;
      }
    }
    .nav-links {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end;
      ul {
        margin-right: 32px;
        margin-bottom: 0px;
        .link {
          margin-right: 32px;
        }
        .link:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .menu-icon {
    cursor: pointer;
    position: absolute;
    top: 32px;
    right: 25px;
    height: 25px;
    width: auto;
  }
  .responsive-search-input {
    width: 50vw !important;
  }
  .profile {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #fff;
    background-color: #303030;
    span {
      pointer-events: none;
    }
  }
}
.profile-menu {
  // z-index: 1000;
  // position: fixed;
  // top: 70px;
  // left :80%;
  // right: 100px;
  width: 250px;
  background-color: #303030;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  .info {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #fff;
    .initials {
      position: initial;
      width: 40px;
      height: 40px;
      background-color: #fff;
      color: #303030;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    .right {
      flex: 1;
      margin-left: 24px;
      p:nth-child(1) {
        font-size: 14px;
      }
      p:nth-child(2),
      p:nth-child(3) {
        font-size: 12px;
      }
    }
  }
  .options {
    padding: 15px;
    .option {
      text-decoration: none;
      color: #fff;
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      &:hover {
        color: #007bff;
        cursor: pointer;
      }
      .icon {
        width: 18px;
        height: auto;
      }
      p {
        font-size: 14px;
        margin-left: 12px;
        margin-bottom: 0px;
      }
      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
}
.notify_icon {
  filter: brightness(0) invert(1);
}
.header-notifications-list {
  padding: 0px 0px;
  overflow: auto;
  height: 300px;
}
.list-title {
  cursor: pointer;
  margin: 0px !important;
}
.hover-item {
  margin-bottom: 0.5rem;
  &:hover {
    background: lightgrey;
  }
}
.unreadNoti {
  color: black;
}
@media (max-width: 800px) { 
  .responsive-search-input {
    display: none;
  }
}
@media (max-width: 1000px) { 
  .responsive-header-logo-mobile {
      width: 120px !important;
  }
  .responsive-header-container {
    padding : 6px !important
  }
  .responsive-header-avatar-mobile {
    width: 35px !important;
    height:35px !important;
  }
  .responsive-header-notice-icon-mobile-container {
    width: 35px !important;
    height: 35px !important;
  }
  .responsive-header-notice-icon-mobile {
    width: 20px !important;
    margin-left:  0px !important;
  }
  .responsive-header-badge-mobile-container {
    margin-top: -0.5rem !important;
    
    margin-left: -0.2rem !important;
    margin-top: -1rem !important;
  }
  .responsive-header-notice-icon-mobile-container {
    padding : 10px !important
  }
}
@media (max-width: 600px) {
  .responsive-header {
    display: none;
  }
  .responsive-header-container {
    padding : 6px !important
  }
  .responsive-notice-list{
    width: 390px;
  }
  .responsive-item {
    width: 100vw;
  }
  .responsive-notice-list-icon {
    .ant-dropdown {
    position: fixed !important;
    top : 60px !important
  }
  }
}
@media (min-width: 600px) {
  .responsive-drawer {
    display: none;
  }
}
</style>
