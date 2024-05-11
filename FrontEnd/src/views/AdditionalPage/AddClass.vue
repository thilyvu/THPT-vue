<template>
  <div style="padding: 30px">
    <a-row :gutter="30" style="padding: 1rem 1% 2rem">
      <a-col :span="16">
        <a-space direction="vertical" style="width: 100%">
          <b>Class code</b>
          <a-input placeholder="Enter class code" v-model="classCode" />
          <b>Class name</b>
          <a-input placeholder="Enter class name" v-model="name" />
          <ClassBanner
            v-if="classCode != ''"
            :classCode="classCode"
            @clicked="changeImg"
            :image="null"
          />
          <b>Describe about class</b>
          <a-input
            placeholder="Enter class describtion"
            v-model="description"
          />
          <a-row type="flex" justify="space-between">
            <a-col>
              <b>Approve student</b>
            </a-col>
            <a-col>
              <a-switch default-checked v-model="isApprove" />
            </a-col>
          </a-row>
          <p>
            Approving students to avoid strangers entering the classroom without
            your permission
          </p>
          <a-row type="flex" justify="space-between">
            <a-col>
              <b>Class according to the book</b>
            </a-col>
            <a-col>
              <a-switch default-checked v-model="isBelongToBook" />
            </a-col>
          </a-row>
          <p>The tests in this class will follow the names in the book</p>
          <b>Subject</b>
          <a-select
            style="width: 100%"
            placeholder="Please select"
            v-model="subject"
          >
            <a-select-option
              v-for="item in subjectData"
              :key="item._id"
              :value="item.name"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
          <b>Grade</b>
          <a-select
            style="width: 100%"
            placeholder="Please select"
            v-model="grade"
          >
            <a-select-option
              v-for="item in gradeData"
              :key="item._id"
              :value="item.name"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
          <b>Class fee</b>
          <a-input placeholder="Enter class fee" v-model="price" />
        </a-space>
      </a-col>
      <a-col :span="8">
        <a-card>
          <a-space direction="vertical" size="large">
            <b>Steps to do</b>
            <a-checkbox disabled :checked="classCode != ''">
              Add class code <span style="color: red">Required</span>
            </a-checkbox>
            <a-checkbox disabled :checked="name != ''">
              Add class name <span style="color: red">Required</span>
            </a-checkbox>
            <a-checkbox disabled :checked="Boolean(img)">
              Add class corver
            </a-checkbox>
            <a-checkbox disabled :checked="isApprove">
              Turn on student approval
            </a-checkbox>
            <a-checkbox disabled :checked="isBelongToBook">
              Turn on class book
            </a-checkbox>
            <a-checkbox disabled :checked="subject != ''">
              Choose subject <span style="color: red">Required</span>
            </a-checkbox>
            <a-checkbox disabled :checked="grade != ''">
              Choose grade <span style="color: red">Required</span>
            </a-checkbox>
          </a-space>
        </a-card>
        <v-btn
          color="primary"
          dark
          @click="handleSubmit"
          style="width: 100%; margin-top: 10px"
          >Create new class
        </v-btn>
        <v-btn @click="cancel" style="width: 100%; margin-top: 10px"
          >Cancel
        </v-btn>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { NotificationMixin } from "../../mixin/Notification";
import Class from "../../api/Class";
import ClassBanner from "../../components/ImageStorage/ClassBanner.vue";
import MasterData from "../../api/MasterData";

export default {
  mixins: [NotificationMixin],
  components: {
    ClassBanner,
  },
  data() {
    return {
      name: "",
      classCode: "",
      description: "",
      img: "",
      isApprove: false,
      isBelongToBook: false,
      subject: "",
      grade: "",
      price: "",
      gradeData: [],
      subjectData: [],
    };
  },
  mounted() {
    MasterData.getAllGrade()
      .then((response) => {
        this.gradeData = response.data.data;
      })
      .catch((e) => {
        console.log("e", e);
      });
    MasterData.getSubject()
      .then((response) => {
        this.subjectData = response.data.data;
      })
      .catch((e) => {
        console.log("e", e);
      });
  },
  computed: {},
  methods: {
    handleSubmit() {
      const payload = {
        name: this.name,
        classCode: this.classCode,
        description: this.description,
        bannerImg: this.img,
        approveMode: this.isApprove,
        bookMode: this.isBelongToBook,
        subject: this.subject,
        grade: this.grade,
        price: this.price,
      };
      Class.createClass(payload)
        .then((response) => {
          this.openNotificationWithIcon(
            "success",
            "Create new class successfully"
          );
          this.$router.push("/dashboard");
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Fail to create new class",
            error.response.data.message
          );
        });
    },
    changeImg(img) {
      this.img = img;
    },
    cancel() {
      this.openNotificationWithIcon("error", "Cancel create new class");
      this.$router.go(-1);
    },
  },
};
</script>

<style></style>
