<template>
  <div>
    <v-file-input
      truncate-length="15"
      label="Chọn file video bài giảng"
      @change="onFileChange"
    ></v-file-input>
    <a-progress :percent="uploadValue" />
  </div>
</template>

<script>
import firebase from "firebase/compat/app";

export default {
  props: {
    classId: {
      type: String,
      default: "",
    },
    randomLectureId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      imageData: null,
      uploadValue: 0,
      picture: null,
    };
  },
  methods: {
    onFileChange(event) {
      this.uploadValue = 0;
      this.picture = null;
      this.imageData = event;
      this.onUpload();
    },
    onUpload() {
      this.picture = null;
      const storageRef = firebase
        .storage()
        .ref(
          `class/${this.classId}/lecture/${this.randomLectureId}/${randomString}`
        )
        .put(this.imageData);
      storageRef.on(
        `state_changed`,
        (snapshot) => {
          this.uploadValue =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          this.uploadValue = 100;
          storageRef.snapshot.ref.getDownloadURL().then((url) => {
            this.picture = url;
            if (this.imageData === null) this.picture = null;
            this.$emit("clicked", `${this.randomLectureId}_${this.picture}`);
          });
        }
      );
    },
  },
  computed: {
    randomString() {
      return (Math.random() + 1).toString(36).substring(5);
    },
  },
};
</script>

<style></style>
