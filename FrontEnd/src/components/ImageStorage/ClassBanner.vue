<template>
  <div>
    <v-file-input
      label="Ảnh bìa"
      prepend-icon="mdi-camera"
      accept="image/*"
      @change="chooseImg"
    ></v-file-input>
    <a-progress v-if="loading" :percent="uploadValue" />
    <img v-if="picture || image" :src="picture || image" style="width: 100%" />
  </div>
</template>

<script>
import { FirebaseStorageMixin } from "../../mixin/FirebaseStorage";

export default {
  mixins: [FirebaseStorageMixin],
  props: {
    classCode: {
      type: String,
      default: "",
    },
    image: {
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
    chooseImg(event) {
      this.handleImageFile(event, `class/${this.classCode}/banner`);
    },
    execute() {
      this.$emit("clicked", this.picture);
    },
  },
  computed: {
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