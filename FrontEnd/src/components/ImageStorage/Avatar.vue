<template>
  <a-dropdown>
    <a-avatar
      v-if="loading"
      :size="74"
      shape="square"
      src="https://img.idesign.vn/2018/10/23/id-loading-1.gif"
    />
    <a-avatar :size="74" shape="square" :src="picture" />

    <a-menu slot="overlay" v-if="isEdit">
      <a-menu-item @click="$refs.file.click()">
        <input
          type="file"
          ref="file"
          style="display: none"
          @change="chooseImg"
          accept="image/*"
        />
        <a-icon type="picture" /> Đổi ảnh đại diện
      </a-menu-item>
      <a-menu-item @click="removeAvatar" v-if="picture">
        <a-icon type="delete" /> Xóa ảnh đại diện
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import { FirebaseStorageMixin } from "../../mixin/FirebaseStorage";

export default {
  mixins: [FirebaseStorageMixin],
  props: {
    userId: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: null,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      imageData: null,
      uploadValue: 0,
      picture: this.avatar,
    };
  },
  methods: {
    chooseImg(event) {
      this.handleImageFile(event.target.files[0], `user/${this.userId}/avatar`);
    },
    removeAvatar() {
      this.picture = null;
      this.imageData = null;
      this.deleteFirebase(`user/${this.userId}/avatar`);
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