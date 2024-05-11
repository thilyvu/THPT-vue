<!-- 
	This is the sign up page, it uses the dashboard layout in: 
	"./layouts/Default.vue" .
 -->

<template>
  <div>
    <!-- Sign Up Image And Headings -->
    <div
      class="sign-up-header"
      style="background-image: url('images/bg-signup.jpg')"
    >
      <div class="content">
        <h1 class="mb-5">Register</h1>
      </div>
    </div>
    <!-- / Sign Up Image And Headings -->

    <!-- Sign Up Form -->
    <a-card
      :bordered="false"
      class="card-signup header-solid h-full"
      :bodyStyle="{ paddingTop: 0 }"
    >
      <div v-if="!isSuccess">
        <a-form
          id="components-form-demo-normal-login"
          :form="form"
          class="login-form"
          @submit="handleSubmit"
        >
          <a-form-item class="mb-10">
            <a-radio-group
              name="radioGroup"
              :default-value="1"
              v-decorator="['role']"
            >
              <a-radio :value="1"> Teacher </a-radio>
              <a-radio :value="2"> Student </a-radio>
            </a-radio-group>
          </a-form-item>
          <p class="text">Personal profile</p>
          <a-row :gutter="20">
            <a-col :span="12">
              <a-form-item class="mb-10">
                <a-input
                  v-decorator="[
                    'name',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter your first and last name!',
                        },
                      ],
                    },
                  ]"
                  placeholder="First and last name"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item class="mb-10">
                <a-date-picker
                  format="DD/MM/YYYY"
                  v-decorator="[
                    'birthday',
                    {
                      rules: [
                        { required: true, message: 'Please enter your date of birth!' },
                      ],
                    },
                  ]"
                  placeholder="DOB"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item class="mb-10">
                <a-select
                  default-value="female"
                  v-decorator="[
                    'gender',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'Please choose your gender!',
                        },
                      ],
                    },
                  ]"
                  placeholder="Gender"
                >
                  <a-select-option value="female"> Female </a-select-option>
                  <a-select-option value="male"> Male </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item class="mb-10">
                <a-input v-decorator="['school']" placeholder="School">
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item class="mb-10">
                <a-select
                  show-search
                  v-decorator="[
                    'province',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'Please select your province!',
                        },
                      ],
                    },
                  ]"
                  placeholder="Choose province"
                >
                  <a-select-option
                    v-for="(item, index) in listProvince"
                    :key="index"
                    :value="item.name"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <p class="text">Account Information</p>
          <a-row :gutter="20">
            <a-col :span="12">
              <a-form-item class="mb-10">
                <a-input
                  v-decorator="[
                    'username',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter your account name!',
                        },
                      ],
                    },
                  ]"
                  placeholder="Account name"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item class="mb-10">
                <a-input
                  v-decorator="[
                    'email',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter your email!',
                        },
                      ],
                    },
                  ]"
                  placeholder="Email"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item class="mb-10">
                <a-input
                  v-decorator="[
                    'phone',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter your phone number!',
                        },
                      ],
                    },
                  ]"
                  placeholder="Phone number"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item class="mb-10">
                <a-input
                  v-model="password"
                  v-decorator="[
                    'password',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter your password!',
                        },
                      ],
                    },
                  ]"
                  type="password"
                  placeholder="Password"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                class="mb-10"
                :validate-status="checkRepass ? 'success' : 'error'"
              >
                <a-input
                  v-model="repassword"
                  v-decorator="[
                    'rePass',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'Please confirm your password!',
                        },
                      ],
                    },
                  ]"
                  type="password"
                  placeholder="Confirm password"
                >
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item class="mb-10">
            <a-checkbox v-model="checked">
              I agree the
              <a href="#" class="font-bold text-dark">Terms and Conditions</a>
            </a-checkbox>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              block
              html-type="submit"
              class="login-form-button"
              :disabled="!checked"
            >
              SIGN UP
            </a-button>
          </a-form-item>
        </a-form>
        <p class="font-semibold text-muted text-center">
          Already have an account?
          <router-link to="/sign-in" class="font-bold text-dark"
            >Sign In</router-link
          >
        </p>
      </div>
      <div v-else>
        <b>Enter the confirmation code sent to your email</b>
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
          Haven't received the code?
          <b class="forgot-password" @click="resendEmail">Resend code</b>
        </p>
      </div>
    </a-card>
    <!-- / Sign Up Form -->
  </div>
</template>

<script>
import Author from "../api/Author.js";
import MasterData from "../api/MasterData";
import { NotificationMixin } from "../mixin/Notification";
export default {
  mixins: [NotificationMixin],
  data() {
    return {
      listProvince: null,
      password: "",
      repassword: "",
      checked: false,
      email: "",
      isSuccess: false,
      otp: "",
      loading: false,
      resendCode: false,
    };
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
            gender: values.gender,
            name: values.name,
            province: values.province,
            username: values.username,
            phone: values.phone,
            school: values.school,
            DOB: values.birthday,
          };
          this.email = values.email;
          values.role === 2
            ? this.registerStudent(payload)
            : this.registerTeacher(payload);
        }
      });
    },
    registerStudent(payload) {
      Author.createStudent(payload)
        .then((response) => {
          this.openNotificationWithIcon(
            "success",
            "Confirmation code sent",
            "Verification code has been sent to your email"
          );
          this.isSuccess = true;
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Send verification code failed",
            error.response.data.message
          );
        });
    },
    registerTeacher(payload) {
      Author.createTeacher(payload)
        .then((response) => {
          this.openNotificationWithIcon(
            "success",
            "Confirmation code sent",
            "Verification code has been sent to your email"
          );
          this.isSuccess = true;
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Send verification code failed",
            error.response.data.message
          );
        });
    },
    onFinish(rsp) {
      this.loading = true;
      const payload = {
        email: this.email,
        code: rsp,
      };
      Author.verifyCode(payload)
        .then((res) => {
          this.openNotificationWithIcon("success", "Correct code");
          this.loading = false;
          this.$router.push("/sign-in");
        })
        .catch((e) => {
          this.openNotificationWithIcon("error", "Confirmation code is incorrect");
          this.loading = false;
        });
    },
    resendEmail() {
      Author.resendMail(this.email)
        .then((res) => {
          this.openNotificationWithIcon(
            "success",
            "Confirmation code sent again",
            "Verification code has been sent to your email"
          );
          this.resendCode = true;
        })
        .catch((e) => {
          this.openNotificationWithIcon("error", "Send verification code failed");
        });
    },
  },
  mounted() {
    MasterData.getProvince()
      .then((response) => {
        this.listProvince = response.data;
      })
      .catch((e) => {
        console.log("e", e.response);
      });
  },
  computed: {
    checkRepass() {
      return this.password === this.repassword;
    },
  },
};
</script>

<style lang="scss"></style>
