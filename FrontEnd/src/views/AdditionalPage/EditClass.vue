<template>
  <div style="margin-bottom: 50px; padding : 30px">
    <a-row :gutter="30">
      <a-col :span="16">
        <a-space direction="vertical" style="width: 100%">
          <b>Class code</b>
          <a-input placeholder="Enter class code" v-model="data.classCode" />
          <b>Class name</b>
          <a-input placeholder="Enter class name" v-model="data.name" />
          <ClassBanner
            v-if="data.classCode != ''"
            :classCode="data.classCode"
            @clicked="changeImg"
            :image="data.bannerImg"
          />
          <b>Class description</b>
          <a-input placeholder="Enter class description" v-model="data.description" />
          <a-row type="flex" justify="space-between">
            <a-col>
              <b>Class security code</b>
            </a-col>
            <a-col>
              <a-switch
                @change="isProtected = !isProtected"
                :checked="isProtected"
              />
            </a-col>
          </a-row>
          <a-input
            placeholder="Enter class code "
            v-model="data.classCode"
            v-if="isProtected"
          />
          <a-row type="flex" justify="space-between">
            <a-col>
              <b>Approve student</b>
            </a-col>
            <a-col>
              <a-switch
                default-checked
                @change="onChange"
                v-model="data.approveMode"
              />
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
              <a-switch
                default-checked
                @change="onChange"
                v-model="data.bookMode"
              />
            </a-col>
          </a-row>
          <p>
            The tests in this class will follow the names in the book
          </p>
          <b>Subject</b>
          <a-select
            style="width: 100%"
            placeholder="Please select"
            @change="handleChange"
            v-model="data.subject"
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
            @change="handleChange"
            v-model="data.grade"
          >
            <a-select-option
              v-for="item in gradeData"
              :key="item._id"
              :value="item.name"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
          <b v-if="data && data.price">Class fee</b>
          <a-input
            v-if="data && data.price"
            placeholder="Enter class fee"
            v-model="data.price"
          />
        </a-space>
      </a-col>
      <a-col :span="8">
        <a-card>
          <a-space direction="vertical" size="large">
            <b>Step to do</b>
            <a-checkbox disabled :checked="data.name != ''" @change="onChange">
              Add class name <span style="color: red">Required</span>
            </a-checkbox>
            <a-checkbox disabled :checked="data.img" @change="onChange">
              Add class cover image
            </a-checkbox>
            <a-checkbox
              disabled
              :checked="data.classCode != ''"
              @change="onChange"
            >
              Add class security code
            </a-checkbox>
            <a-checkbox disabled :checked="data.approveMode" @change="onChange">
              Turn on student approval
            </a-checkbox>
            <a-checkbox
              disabled
              :checked="data.subject != ''"
              @change="onChange"
            >
              Choose subject <span style="color: red">Required</span>
            </a-checkbox>
            <a-checkbox disabled :checked="data.grade != ''" @change="onChange">
              Choose grade <span style="color: red">Required</span>
            </a-checkbox>
          </a-space>
        </a-card>
        <v-btn
          color="primary"
          dark
          @click="handleSubmit"
          style="width: 100%; margin-top: 10px"
          >Update
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
import MasterData from "../../api/MasterData";

import ClassBanner from "../../components/ImageStorage/ClassBanner.vue";

export default {
  mixins: [NotificationMixin],
  components: {
    ClassBanner,
  },
  data() {
    return {
      data: null,
      gradeData: [],
      subjectData: [],
    };
  },
  computed: {
    isProtected() {
      return this.data.classCode !== "";
    },
    classId() {
      return this.$route.params.id;
    },
    gradeList() {
      MasterData.getAllGrade()
        .then((response) => {
          return response.data.data;
        })
        .catch((e) => {
          console.log("e", e);
          return [];
        });
    },
    subjectList() {
      MasterData.getSubject()
        .then((response) => {
          return response.data.data;
        })
        .catch((e) => {
          console.log("e", e);
          return [];
        });
    },
  },
  methods: {
    handleSubmit() {
      const payload = {
        name: this.data.name,
        classCode: this.isProtected ? this.classCode : "",
        description: this.data.description,
        bannerImg: this.data.bannerImg,
        approveMode: this.data.approveMode,
        bookMode : this.data.bookMode,
        subject: this.data.subject,
        grade: this.data.grade,
        price: this.data.price,
      };
      Class.updateClass(this.data._id, payload)
        .then((response) => {
          this.openNotificationWithIcon("success", "Update class successfully");
          this.$router.go(-1);
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Fail to update class",
            error.response.data.message
          );
        });
    },
    changeImg(img) {
      this.data.bannerImg = img;
    },
    cancel() {
      this.openNotificationWithIcon("error", "Cancel update class");
      this.$router.go(-1);
    },
  },
  mounted() {
    Class.getClassById(this.classId)
      .then((response) => {
        this.data = response.data.data;
      })
      .catch((error) => {
        console.log("error", error);
      });
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
};
</script>

<style></style>
