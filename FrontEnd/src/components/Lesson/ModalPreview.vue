<template>
  <div
    style="display: grid; justify-content: center"
    v-if="file.extension === 'image/png' || file.extension === 'image/jpeg'"
  >
    <img :src="file.url" style="max-width: 1100px" />
  </div>

  <div v-else>
    <div
      v-if="file.extension === 'video/mp4'"
      style="display: grid; justify-content: center"
    >
      <video width="1100" height="600" controls>
        <source :src="file.url" type="video/mp4" />
      </video>
    </div>

    <div v-else style="display: grid; justify-content: center">
      <iframe
        id="1"
        :src="getUrlForPreview(file)"
        width="1100px"
        height="600px"
        frameborder="0"
        embedded="true"
      >
      </iframe>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    file: {
      type: Object,
      default: null,
    },
  },
  methods: {
    getUrlForPreview(file) {
      if (
        file.extension === "application/pdf" ||
        file.extension === "video/mp4"
      ) {
        return file.url;
      } else {
        return `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
          file.url
        )}`;
      }
    },
  },
};
</script>

<style></style>
