<template>
  <!-- Layout Footer -->
  <a-layout-footer class="responsive-footer-container" style="background : #6a6e79">
    <a-row type="flex" class="responsive-footer-container-row" style="align-items : center; justify-content : end">
      <a-menu mode="horizontal" class="responsive-footer">
          <a-menu-item style="color : lightgray"  >About us</a-menu-item>
          <a-menu-item style="color : lightgray" @click="feedback">Feedback</a-menu-item>
        </a-menu>
    </a-row>
  </a-layout-footer>
  <!-- / Layout Footer -->
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    feedback() {
      this.$router.push("/feedback");
    },
    info() {
      this.$router.push("/");
    },
  },
};
</script>
<style lang="scss" scoped>
  .responsive-footer-container-row {
    width: 100vw;
  }
.responsive-footer-container {
    padding-top: 0.5rem;
  }
  .responsive-footer {
    margin-top: 0.5rem !important ;
  }
@media (max-width: 1000px) { 
  .responsive-footer {
    margin-top:10px !important;
    line-height: 1.5 !important;
    text-align: end !important;
  }

}
@media (max-width: 1200px) { 
  .responsive-footer {
    margin-top: 0.5rem !important ;
  }
}
</style>