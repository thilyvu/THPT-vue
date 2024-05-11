<template>
  <div
    class="feedback-layout"
    :style="{ backgroundColor: color[feedback - 1] }"
  >
    <h5 class="feedback-text">
      How do you feel about <span>Eduhub</span> platform?
    </h5>
    <vue-feedback-reaction
      v-model="feedback"
      :labels="labels"
      @input="chooseEmoji"
      class="feedback-emoji"
    /><br />
    <v-textarea
      solo
      counter
      v-model="comment"
      name="input-7-4"
      label="Your comments will help us develop a better website in the future! "
      class="feedback-input"
    ></v-textarea>
    <v-btn color="primary" dark @click="sendMail"> Feedback </v-btn>
    <v-btn class="back-button" @click="back"> Back </v-btn>
    <!-- <input type="submit" value="Send" /> -->
  </div>
</template>

<script>
import { VueFeedbackReaction } from "vue-feedback-reaction";
import { NotificationMixin } from "../mixin/Notification";
import { LocalStorageMixin } from "../mixin/LocalStorage";
import { Brand } from "@icij/murmur";
import emailjs from "emailjs-com";

export default {
  mixins: [NotificationMixin, LocalStorageMixin],
  name: "demo",
  components: {
    VueFeedbackReaction,
    Brand,
  },
  data: () => ({
    feedback: "",
    labels: ["Hate", "Dislike", "Temporary", "Like", "Love"],
    color: ["#41436A", "#974063", "#E7694B", "#2A3950", "#F44667"],
    comment: "",
  }),
  methods: {
    sendMail() {
      let payload = {
        user_name: this.userProfile.name,
        user_id: this.userProfile.id,
        user_role: this.userProfile.role,
        vote: this.feedback.toString(),
        message: this.comment.toString(),
      };
      try {
        emailjs
          .send(
            "Eduhub_email",
            "Eduhub_template",
            payload,
            "user_ZWi7h26GTRcjK6V3suHNr"
          )
          .then((result) => {
            this.openNotificationWithIcon(
              "success",
              "Comment sent successfully",
              "Thank you for your comments!"
            );
            this.feedback = "";
            this.comment = "";
          });
      } catch (e) {
        this.openNotificationWithIcon(
          "error",
          "Submit feedback failed",
          "Please try again!"
        );
      }
    },
    back() {
      this.$router.push("/dashboard");
    },
  },
  computed: {
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
  },
};
</script>
<style lang='scss' scope>
.ant-layout-content {
  padding-top: 0px !important;
  .feedback-layout {
    padding-top: 10%;
    text-align: center;
    background-color: cadetblue;
    height: 100vh;

    .feedback-emoji {
      background: white;
      padding: 20px;
      border-radius: 20px;
    }
    .feedback-text {
      // text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
      color: white;
    }
    .feedback-input {
      margin: 15px 15%;
    }
    .back-button {
      margin-left: 10px;
    }
  }
}
@media (max-width: 400px) { 
  .feedback-emoji {
   width: 100% !important;
   .reaction {
    margin-left: -0.5rem;
   }
  }
}
</style>
