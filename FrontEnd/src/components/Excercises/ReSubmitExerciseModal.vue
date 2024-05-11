<template>
  <a-modal
    v-model="isShow"
    title="Chỉnh sửa bài nộp"
    max-width="700"
    :footer="null"
    @cancel="handleCancel"
  >
    <v-container>
      <v-form>
        <h5>{{ exerciseData.exerciseName }}</h5>
        <p>{{ exerciseData.description }}</p>
        <v-text-field
          v-model="fileName"
          type="text"
          label="Tên file nộp bài"
          :messages="[
            'Vui lòng chỉ thay đổi tên file không thay đổi đuôi file',
          ]"
        ></v-text-field>
        <v-file-input
          label="Upload File"
          chips
          @change="chooseImg"
        ></v-file-input>
        <a-progress v-if="loading" :percent="uploadValue" />
        <DisplayFile
          v-if="uploadValue > 0 || picture !== null"
          :picture="picture"
          :fileName="fileName"
          :extensionFile="null"
        />
        <DisplayFile
          v-else
          :picture="answerFile"
          :fileName="fileName"
          :extensionFile="assignmentInfo&&assignmentInfo[0].fileExtension"
        />
        <v-btn
          dark
          color="primary"
          class="mr-4"
          :loading="loading"
          @click="submitExercise"
        >
          Nộp
        </v-btn>
      </v-form>
    </v-container>
  </a-modal>
</template>

<script>
import { FirebaseStorageMixin } from "../../mixin/FirebaseStorage";
import { LocalStorageMixin } from "../../mixin/LocalStorage";
import Score from "../../api/Score";
import DisplayFile from "./DisplayFile.vue";

export default {
  components: { DisplayFile },
  mixins: [FirebaseStorageMixin, LocalStorageMixin],
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    exerciseData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      assignmentInfo: null,
      fileName: "",
      fileExtension: null,
      answerFile: "",
    };
  },
  mounted() {
    this.getAssignmentInfo();
  },
  methods: {
    handleCancel() {
      this.$emit("close");
    },
    chooseImg(event) {
      this.fileName = event?.name;
      this.handleImageFile(
        event,
        `/class/${this.classId}/exercises/${this.exerciseData._id}/${this.fileName}`
      );
    },
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
    submitExercise() {
      const payload = {
        studentId: this.userProfile.id,
        fileName: this.fileName,
        answerFile: this.picture||this.answerFile,
        fileExtension: this.extension,
      };
      this.$emit("submit", this.assignmentInfo[0]?._id, payload);
    },
    getAssignmentInfo() {
      Score.getScoreByExerciseId(this.exerciseData._id, this.userProfile.id)
        .then((res) => {
          this.assignmentInfo = res.data.data;
          this.fileName = this.assignmentInfo[0].fileName;
          this.answerFile = this.assignmentInfo[0].answerFile;
        })
        .catch((e) => {
          console.log("e", e);
        });
    },
  },
  computed: {
    extension() {
      const temp = this.fileName?.split(".")[1];
      if (temp === "pdf") return "pdf";
      else if (temp === "png" || temp === "jpg") return "picture";
      else if (temp === "doc" || temp === "docx") {
        return "word";
      } else if (temp === "ppt" || temp === "pptx") {
        return "ppt";
      } else if (temp === "xlsx") {
        return "excel";
      }
    },
    loading() {
      if (this.picture === null && this.uploadValue > 0) return true;
      else if (this.picture !== null && this.uploadValue === 100) {
        return false;
      }
      return false;
    },
  },
};
</script>

<style>
</style>