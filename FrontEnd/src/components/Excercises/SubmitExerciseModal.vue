<template>
  <a-modal
    v-model="isShow"
    title="Nộp bài"
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
          :messages="['Vui lòng chỉ thay đổi tên file không thay đổi đuôi file']"
        ></v-text-field>
        <v-file-input
          label="Upload File"
          chips
          @change="chooseImg"
        ></v-file-input>
        <a-progress v-if="uploadValue" :percent="uploadValue" />
        <DisplayFile
          v-if="uploadValue > 0"
          :picture="picture"
          :fileName="fileName"
          :extensionFile="null"
        />
        <v-btn
          dark
          color="primary"
          class="mr-4"
          @click="submitExercise"
          :disabled="uploadValue < 100"
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
import DisplayFile from "./DisplayFile.vue";

export default {
  components: { DisplayFile },
  mixins: [FirebaseStorageMixin,LocalStorageMixin],
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
      fileName: "",
    };
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
    submitExercise() {
      const payload = {
        answerFile: this.picture,
        fileName: this.fileName,
        exerciseId: this.exerciseData._id,
        studentId: this.userProfile.id,
        fileExtension: this.extension,
      };
      this.$emit('submit', payload)
    },
  },
  computed: {
    extension() {
      if (this.extensionFile) return this.extensionFile;
      const temp = this.fileName.split(".")[1];
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
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
  }
};
</script>

<style>
</style>