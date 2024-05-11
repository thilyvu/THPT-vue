<template>
  <a v-if="picture" :href="picture" download target="_blank">
    <img
      v-if="extension === 'pdf'"
      src="./FileIcon/file-pdf-icon.png"
      style="width: 100px"
    />
    <img
      v-else-if="extension === 'picture'"
      :src="picture"
      style="width: 100%"
    />
    <img
      v-if="extension === 'word'"
      src="./FileIcon/file-word-icon.png"
      style="width: 100px"
    />
    <img
      v-else-if="extension === 'excel'"
      src="./FileIcon/file-excel-icon.png"
      style="width: 100px"
    />
    <img
      v-else-if="extension === 'ppt'"
      src="./FileIcon/file-ppt-icon.png"
      style="width: 100px"
    />
    <p>{{ fileName }}</p>
  </a>
</template>

<script>
export default {
  props: {
    picture: {
      type: String,
      default: "",
    },
    fileName: {
      type: String,
      default: "",
    },
    extensionFile: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      isShow: false,
    };
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
  },
};
</script>

<style>
</style>