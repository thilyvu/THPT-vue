<template>
  <div style="margin-bottom: 50px">
    <a-row :gutter="30">
      <a-col :span="12">
        <a-space direction="vertical" style="width: 100%">
          <b>Tên bài tập</b>
          <a-input placeholder="Enter the exercise name" v-model="name" />
          <b>Mô tả bài tập</b>
          <a-input placeholder="Enter a description of the exercise" v-model="description" />
          <b>Thời gian nộp bài</b>
          <a-range-picker
            :show-time="{ format: 'HH:mm' }"
            style="width: 100%"
            format="DD/MM/YYYY HH:mm A"
            :placeholder="['Start Date', 'End Date']"
            @change="onChange"
            @ok="onChange"
          />
          <b>Select exercise file</b>
          <p>
            Hint: Use a pdf file to preview the file before uploading.
            File upload speed will depend on your internet connection speed
          </p>
          <a-button @click="openResources = true"
            >Select File from the corpus</a-button
          >
          <v-file-input
            truncate-length="15"
            placeholder="Upload file từ máy tính"
            chips
            @change="chooseImg"
          ></v-file-input>
        </a-space>
        <a-space direction="horizontal">
          <v-btn
            color="primary"
            dark
            @click="handleSubmit"
            :loading="loading"
            style="width: 100%; margin-top: 10px"
            >Add exercises
          </v-btn>
          <v-btn @click="cancel" style="width: 100%; margin-top: 10px"
            >Cancel
          </v-btn>
        </a-space>
      </a-col>
      <a-col :span="12">
        <div><b>Preview File</b></div>
        <a-progress v-if="loading" :percent="uploadValue" />
        <DisplayFile
          :picture="picture"
          :fileName="fileName"
          :extensionFile="null"
        />
      </a-col>
    </a-row>
    <a-modal
    title="Repository"
      v-model="openResources"
      :footer="null"
      width="800px"
    >
      <Resources @chooseFile="chooseFile"
    /></a-modal>
  </div>
</template>

<script>
import { NotificationMixin } from "../../mixin/Notification";
import { FirebaseStorageMixin } from "../../mixin/FirebaseStorage";
import Exercise from "../../api/Exercise";

import DisplayFile from "../../components/Excercises/DisplayFile.vue";
import Resources from "../Resources.vue";

export default {
  mixins: [NotificationMixin, FirebaseStorageMixin],
  components: {
    DisplayFile,
    Resources,
  },
  data() {
    return {
      name: "",
      classCode: "",
      description: "",
      startDate: "",
      endDate: "",
      fileName: "",
      randomString: (Math.random() + 1).toString(36).substring(5),
      openResources: false,
      isUseResources: false,
      thumbnailUrl: null,
    };
  },
  methods: {
    onChange(e) {
      this.startDate = e[0];
      this.endDate = e[1];
    },
    chooseImg(event) {
      this.fileName = event.name;
      this.handleImageFile(
        event,
        `/class/${this.classId}/exercises/${this.randomString}/${this.fileName}`
      );
    },
    handleSubmit() {
      const payload = {
        exerciseName: this.name,
        typeOfExams: "quiz",
        description: this.description,
        fileExtension: this.fileName.split(".")[1],
        classId: this.classId,
        examFileUrl: this.isUseResources
          ? this.thumbnailUrl
          : this.randomString + "_" + this.picture,
        startDate: this.startDate,
        endDate: this.endDate,
        fileName: this.fileName,
      };

      Exercise.createExercise(payload)
        .then((res) => {
          this.openNotificationWithIcon(
            "success",
            "Add new exercise successfully"
          );
          this.$router.go(-1);
        })
        .catch((e) => {
          this.openNotificationWithIcon(
            "error",
            "Add new exercise failed",
            e.response.data.message
          );
        });
    },
    chooseFile(item) {
      this.isUseResources = true;
      this.fileName = item.fileName;
      this.thumbnailUrl = item.thumbnailUrl;
      this.picture = item.thumbnailUrl.split("_")[1];
      this.openResources = false;
    },
    cancel() {
      this.openNotificationWithIcon("error", "Cancel assignment");
      this.$router.go(-1);
    },
    execute() {
      this.$emit("clicked", this.picture);
    },
  },
  computed: {
    classId() {
      return this.$route.params.id;
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
.modal-document {
  width: 800px;
}
</style>
