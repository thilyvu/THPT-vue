<template>
  <a-col>
    <a-form-item>
      <v-btn depressed @click="isChange = true"> CHANGE PASSWORD </v-btn>
    </a-form-item>
    <a-modal
      v-model="isChange"
      title="Change password"
      ok-text="Confirm"
      cancel-text="Cancel"
      @ok="changePass"
    >
      <v-text-field
        v-model="oldPassword"
        type="password"
        label="Old password"
      ></v-text-field>
      <v-text-field
        v-model="newPassword"
        type="password"
        label="New password"
      ></v-text-field>
      <v-text-field
        v-model="reNewPassword"
        type="password"
        label="Re-enter new password"
      ></v-text-field>
    </a-modal>
  </a-col>
</template>

<script>
import { NotificationMixin } from "../../mixin/Notification";
import { LocalStorageMixin } from "../../mixin/LocalStorage";
import Author from "../../api/Author.js";

export default {
  mixins: [NotificationMixin, LocalStorageMixin],
  data() {
    return {
      isChange: false,
      oldPassword: "",
      newPassword: "",
      reNewPassword: "",
    };
  },
  computed: {
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
  },
  methods: {
    changePass() {
      if (this.newPassword !== this.reNewPassword) {
        this.openNotificationWithIcon(
          "error",
          "Change password fail",
          "New password and re-entered password must match"
        );
      } else {
        const payload = {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        };
        Author.updatePassword(this.userProfile.id, payload)
          .then((response) => {
            this.openNotificationWithIcon(
              "success",
              "Password update successful"
            );
            this.changePass = false;
          })
          .catch((e) => {
            this.openNotificationWithIcon(
              "error",
              "Password update failed",
              e.response.data.message
            );
          });
      }
    },
  },
};
</script>

<style>
</style>