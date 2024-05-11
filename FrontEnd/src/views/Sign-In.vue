<template>
  <div class="sign-in">
    <a-row style="max-width : 99vw" type="flex" :gutter="[24, 24]" justify="space-around" align="middle">
      <a-col
        :span="24"
        :md="12"
        :lg="{ span: 12, offset: 0 }"
        :xl="{ span: 6, offset: 2 }"
        class="responsive-for-ipad col-form"
      >
        <h1 class="mb-10 responsive-header">Login</h1>

        <a-form
          id="components-form-demo-normal-login"
          :form="form"
          class="login-form"
          @submit="handleSubmit"
          :hideRequiredMark="true"
        >
          <a-form-item class="mb-10" label="Account" :colon="false">
            <a-input
              v-decorator="[
                'email',
                {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your email!',
                    },
                  ],
                },
              ]"
              placeholder="Enter email"
            >
            </a-input>
          </a-form-item>
          <a-form-item class="mb-5" label="Password" :colon="false">
            <a-input
              v-decorator="[
                'password',
                {
                  rules: [
                    {
                      required: true,
                      message: 'Please enter your password',
                    },
                  ],
                },
              ]"
              type="password"
              placeholder="Enter password"
            />
          </a-form-item>
          <!-- <p class="forgot-password" @click="isShow = true">Forgot password?</p> -->
          <a-form-item>
            <a-button
              type="primary"
              block
              html-type="submit"
              class="login-form-button"
              style="color :white; font-size: 14px;"
              :loading="loading"
            >
              Sign in  
            </a-button>
          </a-form-item>
        </a-form>
        <!-- / Sign In Form -->
      <v-facebook-login @sdk-init="sdkLoaded" @login="onLogin" @logout="onLogout" style="width: 100%; margin-top:-0.5rem; margin-bottom :1rem" app-id="1059299974608843">
        <template slot="login"> Continue with facebook</template>
        <template slot="logout"> Log out</template>
        <template slot="working">'Please wait...'</template>
      </v-facebook-login>
        <!-- <p class="font-semibold text-muted">
          Don't have an account?
          <router-link to="/sign-up" class="font-bold text-dark"
            >Sign up</router-link
          >
        </p> -->
         <!-- <img style="width:20px; margin-right:0.5rem" src="../assets/facebook.png"> 
         <a-button  style="padding : 0px;margin-top :-1rem;color: #3b5998;font-size: 13px;" size="large"
            type="link" @click="handleLoginWithFacebook" > Tiếp tục với Facebook  </a-button> -->
      </a-col>
      <a-col :span="24" :md="12" :lg="12" :xl="12" class="col-img responsive-for-ipad-right">
        <img src="images/img-signin.png" alt="" />
      </a-col>
    </a-row>
    <LoginFooter />

    <a-modal
      v-model="isShow"
      title="Forgot password ?"
      max-width="500"
      :okText="isSuccess ? 'Confirm' : 'Send mail'"
      @ok="forgotPassword"
      @cancel="cancelForgotPass"
      cancelText="Cancel"
    >
      <v-container>
        <v-text-field
          v-model="emailForgot"
          type="email"
          label="Enter your email"
          :disabled="isSuccess"
        ></v-text-field>
        <div
          v-if="isSuccess"
          class="ma-auto position-relative"
          style="max-width: 300px"
        >
          <b>Enter the verify code that had been sent to your email </b>
          <v-otp-input
            v-model="otp"
            :disabled="loading"
            @finish="onFinish"
          ></v-otp-input>
          <v-overlay absolute :value="loading">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-overlay>
          <p v-if="!resendCode">
            Hadn't receive code?
            <b class="forgot-password" @click="resendEmail">Resend</b>
          </p>
        </div>
      </v-container>
    </a-modal>
  </div>
</template>

<script>
import { LocalStorageMixin } from "../mixin/LocalStorage";
import { NotificationMixin } from "../mixin/Notification";
import Author from "../api/Author.js";
import LoginFooter from "../components/Footers/LoginFooter.vue";
import VFacebookLogin from 'vue-facebook-login-component'
import facebookLogin from 'facebook-login-vuejs'
import store from '../store/index'
export default {
  mixins: [NotificationMixin, LocalStorageMixin],
  components : {facebookLogin,VFacebookLogin, LoginFooter},
  data() {
    return {
      rememberMe: true,
      email: "",
      password: "",
      isShow: false,
      emailForgot: "",
      isSuccess: false,
      otp: "",
      loading: false,
      resendCode: false,
      userId: "",
      loading: false,
      isConnected: false,
      name: '',
      email: '',
      personalID: '',
      picture: '',
      FB: undefined,
      loginLabel: 'Continue with Facebook'
    };
  },
  computed: {
    isLogin() {
      return store.state.isLogin
    }
  },
  watch: {
    isLogin(value) {
      if(!value) {
        this.onLogout()
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          const payload = {
            email: values.email,
            password: values.password,
          };
          this.loading=true
          Author.login(payload)
            .then((response) => {
              const payload = {
                role: response.data.role,
                name: response.data.name,
                email: response.data.email,
                avatar:
                  response.data.avatar === ""
                    ? "../assets/icons/default-avatar.png"
                    : response.data.avatar,
                id: response.data.id,
              };
              this.setToken(response.data.token);
              this.setUserProfile(payload);
              this.openNotificationWithIcon("success", "Login successfully");
              this.$router.push("/dashboard");
            })
            .catch((error) => {
              this.loading=false
              this.openNotificationWithIcon(
                "error",
                "Login failed",
                error.response.data.message
              );
            });
        } else {
          this.openNotificationWithIcon(
                "error",
                "Login failed",
                'Please enter email and password'
              );
        }
      });
    },
    forgotPassword() {
      Author.getUserByEmail(this.emailForgot)
        .then((res) => {
          this.openNotificationWithIcon(
            "success",
            "Sent verify code",
            "Verify code had been sent to your email"
          );
          this.isSuccess = true;
          this.userId = res.data.data._id;
        })
        .catch((e) => {
          this.openNotificationWithIcon(
            "error",
            "Sent verify code failed",
            "Email not valid or email not registered"
          );
        });
    },
    onFinish(rsp) {
      this.loading = true;
      const payload = {
        email: this.emailForgot,
        code: rsp,
      };
      Author.verifyCode(payload)
        .then((res) => {
          this.openNotificationWithIcon("success", "Verify code correct");
          this.loading = false;
          this.$router.push({
            name: "forgotPassword",
            params: { id: this.userId },
          });
        })
        .catch((e) => {
          this.openNotificationWithIcon("error", "Verify code not correct");
          this.loading = false;
        });
    },
    resendEmail() {
      Author.resendMail(this.emailForgot)
        .then((res) => {
          this.openNotificationWithIcon(
            "success",
            "Resent verify code",
            "Verify code had been sent to your email "
          );
          this.resendCode = true;
        })
        .catch((e) => {
          this.openNotificationWithIcon("error", "Resent verify code failed");
        });
    },
    cancelForgotPass() {
      this.isShow = false;
      this.isSuccess = false;
      this.emailForgot = "";
    },
    getUserData() {
    this.FB.api('/me', 'GET', { fields: 'id,name,email,picture' },
      user => {
        this.personalID = user.id;
        this.email = user.email;
        this.name = user.name;
        this.picture = user.picture.data.url;
      }
    )
  },
    sdkLoaded(payload) {
      this.isConnected = payload.isConnected
      this.FB = payload.FB
      if (this.isConnected) this.getUserData()
    },
    onLogin() {
      this.isConnected = true
      this.FB.api('/me', 'GET', { fields: 'id,name,email,picture' },
      user => {
        this.personalID = user.id;
        this.email = user.email;
        this.name = user.name;
        this.picture = user.picture.data.url;
        const payload ={
        authId : this.personalID,
        name : this.name,
        avatar :  this.picture,
        email : this.email,
        loginType : 'facebook'
      }
      console.log(user);
       Author.authFacebook(payload)
        .then((res) => {
          console.log(store.state.isLogin)
          if(store.state.isLogin === null) {
              this.setToken(res.data.token);
              this.setUserProfile(res.data);
              this.openNotificationWithIcon("success", "Login successfully");
              this.clearFbInfo();
              store.commit('SET_LOGIN',true);
              this.$router.push("/dashboard");
          } else {
            store.commit('SET_LOGIN',null);
          }
        })
        .catch((e) => {
                  this.openNotificationWithIcon(
          "error",
          "Login failed",
          error.response.data.message
        );

        });
      }
    )
    },
    clearFbInfo() {
      this.name= '';
      this.email= '',
      this.personalID= '';
      this.picture= '';
    },
    onLogout() {
      this.clearFbInfo();
      this.isConnected = false;
    }
  },
  
};
</script>

<style lang="scss">
body {
  background-color: #ffffff;
}
.forgot-password {
  text-align: end;
  margin-bottom: 0px;

  &:hover {
    color: #40a9ff;
    cursor: pointer;
  }
}
.button{
      font-size: 13px;
    border-radius: 5px;
    width: 100%;
}
@media only screen and (min-width: 1000px) {
  .sign-in {
    display : grid; 
    // margin-top :-1.5rem
  }
}
@media only screen and (max-width: 600px) {
  .responsive-header {
    text-align: center;
    margin-bottom: 0rem;
  }
}
@media only screen and (max-width: 412px) {
  .sign-in {
    display : grid
  }
}
@media only screen and (min-width: 720px) {
  .responsive-for-ipad {
    width: 90vw !important;
  }
  .responsive-for-ipad-right {
    // width: 30% !important;
    // display: none;
    z-index: 0;
  }
}
@media only screen and (min-width: 1300px) {
  // .sign-in {
  //   display : flex
  // }
  .responsive-for-ipad {
    width: 25vw !important;
  }
  .responsive-for-ipad-right {
    // width: 30% !important;
    // display: none;
    z-index: 0;
  }
}
</style>
