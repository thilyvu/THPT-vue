<template>
  <div>
    <span
      @click="handleOpenPreview"
      style="cursor: pointer; font-weight: 500; color: blue"
      >{{ file.name }}</span
    >
    <a-modal
      max-width="1200"
      width="1200px"
      style="width: fit-content"
      v-model="visible"
      :title="file.name"
      :footer="null"
    >
      <ModelPreview :file="file"></ModelPreview>
    </a-modal>
  </div>
</template>

<script>
import ModelPreview from "./ModalPreview.vue";
export default {
  props: {
    file: {
      type: Object,
      default: null,
    },
  },
  components: { ModelPreview },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    handleOpenPreview() {
      this.visible = true;
    },
  },
};
</script>

<style></style>
