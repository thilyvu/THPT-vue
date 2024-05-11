<template>
  <a-col>
    <v-btn @click="isShow=true" color="primary" dark style="margin-right: 10px">
      More members
    </v-btn>
    <a-modal
      v-model="isShow"
      title="Thêm học sinh"
      max-width="500"
      okText="Thêm"
      @ok="handleOk"
      cancelText="Hủy"
      @cancel="handleCancel"
    >
      <v-container>
        Students added to the class by the teacher will not need to enter the security code and approve
        <v-text-field
          v-model="phone"
          type="text"
          label="Student phone number"
        ></v-text-field>
      </v-container>
    </a-modal>
  </a-col>
</template>

<script>

export default {
  props: {
  },
  data() {
    return {
      isShow: false,
      phone: ""
    };
  },
  methods: {
    handleOk(e) {
      const payload = {
        classId: this.classId,
        phone: this.phone,
      };
      this.$emit("add", payload);
      this.isShow=false
    },
    handleCancel(e) {
      this.phone=""
      this.isShow=false
    },
  },
  computed: {
    classId() {
      return this.$route.params.id;
    },
  },
};
</script>

<style></style>
