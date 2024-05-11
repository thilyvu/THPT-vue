<template>
  <div>
    <!-- Sign Up Image And Headings -->
    <div
      class="sign-up-header"
      style="
        background-image: url('https://images.unsplash.com/photo-1497864149936-d3163f0c0f4b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80');
      "
    >
      <div class="content">
        <h1 class="mb-2">Đặt lại mật khẩu</h1>
      </div>
    </div>
    <!-- / Sign Up Image And Headings -->

    <!-- Sign Up Form -->
    <a-card
      :bordered="false"
      class="card-signup header-solid h-full"
      :bodyStyle="{ paddingTop: 0 }"
    >
      <a-form
        
        :form="form"
        class="login-form"
      >
        <b>New password</b>
        <a-form-item class="mb-10">
          <a-input type="password" v-model="password"/>
        </a-form-item>
        <b>Re-enter password</b>
        <a-form-item class="mb-10">
          <a-input type="password" v-model="repassword"/>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            block
            class="login-form-button"
            @click="resetPassword"
          >
            Reset password
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <!-- / Sign Up Form -->
  </div>
</template>


<script>
import { NotificationMixin } from "../mixin/Notification";
import Author from "../api/Author";
export default {
  mixins: [NotificationMixin],
  data() {
    return {
      password: "",
      repassword: "",
    };
  },
  methods: {
    resetPassword() {
      if (this.password !== this.repassword) {
        this.openNotificationWithIcon(
          "error",
          "Đặt lại mật khẩu thất bại",
          "Mật khẩu mới không trùng khớp"
        );
      } else {
        const payload = {
          password: this.password,
        };
        Author.resetPassword(this.$route.params.id, payload)
          .then((res) => {
            this.openNotificationWithIcon(
              "success",
              "Đặt lại mật khẩu thành công"
            );
            this.$router.push("/sign-in");
          })
          .catch((e) => {
            this.openNotificationWithIcon(
              "error",
              "Đặt lại mật khẩu thất bại",
              e.response.data.message
            );
          });
      }
    },
  },
};
</script>
<style scope>
.login-form {
  margin-top: 10px;
}
</style>
