<template>
  <div>
    <v-file-input
      label="Ảnh bìa"
      prepend-icon="mdi-camera"
      accept="image/*"
      @change="chooseImg"
    ></v-file-input>
    <img v-if="picture || image" :src="picture || image" style="width: 100%" />
    <a-progress v-if="loading" :percent="uploadValue" />
  </div>
</template>

<script>
import { FirebaseStorageMixin } from "../../mixin/FirebaseStorage";

export default {
  mixins: [FirebaseStorageMixin],
  props: {
    classId: {
      type: String,
      default: "",
    },
    lectureId: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: null,
    },
  },
  data() {
    return {};
  },
  methods: {
    chooseImg(event) {
      this.handleImageFile(
        event,
        `class/${this.classId}/lecture/${this.lectureId}/banner`
      );
    },
    addFile() {
      this.$emit("clicked", `${this.lectureId}_${this.picture}`);
    },
    execute() {
      this.addFile();
    },
  },
  computed: {
    randomString() {
      return (Math.random() + 1).toString(36).substring(5);
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
<style></style>
