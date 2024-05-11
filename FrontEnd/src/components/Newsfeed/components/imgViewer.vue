<template>
  <viewer
      :images="images"
      :options="options"
      class="viewer"
      ref="viewer"
      @inited="inited"
      v-if="images && images.length"
    >
      <!-- <img
        v-for="image in images"
        :src="image"
        :data-source="image"
        :key="image"
        class="image"
      > -->
       <v-row>
    <v-col
      v-for="image in images"
      :key="image"
      class="d-flex child-flex"
      :cols="images.length === 1 ? 12 : images.length %2 == 0 ? 6 : 4"
    >
     <img
     style="object-fit: contain;"
        :src="image"
        :data-source="image"
        :key="image"
        class="image grey lighten-2"
      > 
    </v-col>
  </v-row>
    </viewer>
</template>

<script>
import Vue from "vue";
import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";
Vue.use(Viewer);
export default {
  props: {
    images: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      options: {
        url: "data-source"
      },
      index: 0,
    };
  },
  methods: {
    inited (viewer) {
      this.$viewer = viewer;
      // this.$viewer.view(this.index);
    },
    view (index) {
      this.index = index
      this.$viewer.view(this.index);
    },
    show (images, index = 0) {
      if (this.images === images) {
        this.view(index)
        return
      }
      this.images = images
      this.index = index
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<style>
.viewer-loading > img {
  display: none;  /* hide big images when it is loading */
}
</style>