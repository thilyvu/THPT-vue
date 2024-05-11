<template>
  <div style="margin-bottom: 50px">
    <a-row :gutter="30">
      <a-col :span="12">
        <a-space direction="vertical" style="width: 100%">
          <b>Tên bài tập</b>
          <a-input
          placeholder="Enter assignment name"
            v-model="exerciseData.exerciseName"
          />
          <b>Mô tả bài tập</b>
          <a-input
          placeholder="Enter assignment description"
            v-model="exerciseData.description"
          />
          <b>Thời gian nộp bài</b>
          <a-range-picker
            :show-time="{ format: 'HH:mm' }"
            style="width: 100%"
            :default-value="[exerciseData.startDate, exerciseData.endDate]"
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
            :placeholder="exerciseData.fileName"
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
            >Edit Exercises
          </v-btn>
          <v-btn @click="cancel" style="width: 100%; margin-top: 10px"
            >Cancel
          </v-btn>
        </a-space>
      </a-col>
      <a-col :span="12">
        <div>
          <b>Preview File</b>
        </div>
        <a-progress v-if="loading" :percent="uploadValue" />
        <DisplayFile
          v-if="uploadValue > 0 || picture !== null"
          :picture="picture"
          :fileName="fileName"
          :extensionFile="null"
        />
        <DisplayFile
          v-else
          :picture="exerciseData.examFileUrl.split('_')[1]"
          :fileName="exerciseData.fileName"
          :extensionFile="exerciseData.fileExtension"
        />
      </a-col>
    </a-row>
    <a-modal
    title="Repository"
      v-model="openResources"
      :footer="null"
      width="800px"
    >
      <Resources :isResource="true" @chooseFile="chooseFile"
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
    Resources,
    DisplayFile,
  },
  data() {
    return {
      exerciseData: null,
      fileName: null,
      randomString: (Math.random() + 1).toString(36).substring(5),
      openResources: false,
      isUseResources: false,
      thumbnailUrl: null,
      startDate: "",
      endDate: "",
    };
  },
  methods: {
    onChange(e) {
      this.startDate = e[0];
      this.endDate = e[1];
    },
    chooseImg(event) {
      if (event === null && this.uploadValue > 0) {
        this.deleteFirebase(
          `/class/${this.classId}/exercises/${this.randomString}/${this.fileName}`
        );
      }
      this.fileName = event?.name || "";
      this.handleImageFile(
        event,
        `/class/${this.classId}/exercises/${this.randomString}/${this.fileName}`
      );
    },
    handleSubmit() {
      const payload = {
        exerciseName: this.exerciseData.exerciseName,
        typeOfExams: "quiz",
        description: this.exerciseData.description,
        startDate: this.startDate || this.exerciseData.startDate,
        endDate: this.endDate || this.exerciseData.endDate,
        fileName: this.fileName || this.exerciseData.fileName,
        isHide: "true",
        examFileUrl: this.picture || this.exerciseData.examFileUrl,
      };
      Exercise.updateExercise(this.exerciseId, payload)
        .then((res) => {
          this.openNotificationWithIcon(
            "success",
            "Successful Exercise Editing"
          );
          this.$router.go(-1);
        })
        .catch((e) => {
          this.openNotificationWithIcon(
            "error",
            "Edit failed assignment",
            error.response.data.message
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
      this.openNotificationWithIcon("error", "Cancel assignment edit");
      this.$router.go(-1);
    },
    execute() {
      this.$emit("clicked", this.picture);
    },
    getExercise() {
      Exercise.getExerciseById(this.$route.params.exerciseId)
        .then((res) => {
          this.exerciseData = res.data.data;
        })
        .catch((e) => {
          console.log("e", e);
        });
    },
  },
  computed: {
    classId() {
      return this.$route.params.id;
    },
    exerciseId() {
      return this.$route.params.exerciseId;
    },
    loading() {
      if (this.picture === null && this.uploadValue > 0) return true;
      else if (this.picture !== null && this.uploadValue === 100) {
        return false;
      }
      return false;
    },
  },
  mounted() {
    this.getExercise();
  },
};
</script>

<style></style>
