<template>
  <!-- Profile Information Card -->
  <a-card
    :bordered="false"
    class="header-solid h-full card-profile-information"
    :bodyStyle="{ paddingTop: 0, paddingBottom: '16px' }"
    :headStyle="{ paddingRight: 0 }"
  >
    <a-button icon="close" size="small" @click="closeInfo" class="close-exercise-info"/>
    <h6 class="font-semibold mt-10">{{ info.exerciseName }}</h6>
    <a-descriptions :column="1">
      <a-descriptions-item label="Mô tả">
        {{ info.description }}
      </a-descriptions-item>
      <a-descriptions-item
        label="Trạng thái"
        v-if="userProfile.role === 'student'"
      >
        {{ info.status === "Not done" ? "Chưa làm" : "Đã làm" }}
      </a-descriptions-item>
      <a-descriptions-item label="Trạng thái" v-else>
        {{ info.isHide ? "Đã ẩn" : "Đang hiện" }}
      </a-descriptions-item>
      <a-descriptions-item
        label="Điểm của bạn"
        v-if="info.score && userProfile.role === 'student'"
      >
        {{ info.score }}
      </a-descriptions-item>
      <a-descriptions-item
        label="Nhận xét cho bài tập"
        v-if="info.comment && userProfile.role === 'student'"
      >
        {{ info.comment }}
      </a-descriptions-item>
      <a-descriptions-item
        label="Tiến độ"
        v-if="userProfile.role === 'teacher'"
      >
        {{ info.totalAnswers }} / {{ info.totalStudents }}
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
  <!-- / Profile Information Card -->
</template>

<script>
import { LocalStorageMixin } from "../../mixin/LocalStorage";

export default {
  mixins: [LocalStorageMixin],
  props: {
    info: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {};
  },
  methods: {
    closeInfo() {
      this.$emit("close");
    },
  },
  computed: {
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
  },
};
</script>

<style lang="scss" scoped>
.close-exercise-info {
  position: absolute;
  right: 0;
}
</style>