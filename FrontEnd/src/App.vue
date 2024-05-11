<template>
  <div>
    <!-- <v-app v-if="isCalendar">
      <v-app-bar app color="primary" dark> </v-app-bar>
      <v-main>
        <router-view />
      </v-main>
    </v-app>
    <div id="app" v-else> -->
    <div id="app" style="width : 100vw !important">
      <component :is="layout">
        <router-view />
      </component>
    </div>
  </div>
</template>
<script>
import { LocalStorageMixin } from "./mixin/LocalStorage";
export default {
  mixins: [LocalStorageMixin],
  name: "App",
  methods: {
    handleScroll() {
      var prevScrollpos = window.pageYOffset;
      window.onscroll = function () {
        var currentScrollPos = window.pageYOffset;
        if (prevScrollpos > currentScrollPos) {
          document.getElementById("navbar").style.top = "0";
        } else {
          // document.getElementById("navbar").style.top = "-100px";
        }
        prevScrollpos = currentScrollPos;
      };
    },
  },
  data: () => ({}),
  computed: {
    // Sets components name based on current route's specified layout, defaults to
    // <layout-default></layout-default> component.
    layout() {
      if (this.$route.name === null) return null;

      return "layout-" + (this.$route.meta.layout || "default").toLowerCase();
    },
    isCalendar() {
      return this.$route.name === "test" ? true : false;
    },
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>
