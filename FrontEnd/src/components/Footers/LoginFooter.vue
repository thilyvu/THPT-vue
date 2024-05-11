<template>
    <!-- Layout Footer -->
    <a-layout-footer style="background : #6a6e79; position: absolute; bottom: 0; height : 40px ; width: 100vw;    padding: 2px 50px !important;">
      <a-row type="flex"  style="align-items : center; justify-content : end;height : 40px !important">
        <a-menu mode="horizontal" class="responsive-footer" style="">
            <a-menu-item style="color : lightgray" @click="privacy">Privacy Statement</a-menu-item>
            <a-menu-item style="color : lightgray" @click="deleteAccount">Delete Account</a-menu-item>
            <a-menu-item style="color : lightgray" @click="tos">Term Of Service</a-menu-item>
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
      privacy() {
        this.$router.push("/policy");
      },
      deleteAccount() {
        this.$router.push("/deleteaccount");
      },
      tos() {
        this.$router.push("/TOS");
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