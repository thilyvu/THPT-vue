<template>
  <a-row class="responsive-list-exercise" :gutter="20" style="padding : 0 15px 0px 1rem">
    <a-col :span="detail ? 18 : 24">
      <a-row type="flex" :gutter="10" align="middle" justify="space-between">
        <a-col :span="12">
          <a-input v-model="txtSearch" placeholder="Tìm kiếm" size="large" />
        </a-col>
        <a-col v-if="userProfile.role === 'teacher'">
          <router-link to="exercise/add">
            <v-btn color="primary" dark> Create Marterial </v-btn>
          </router-link>
        </a-col>
      </a-row>
      <a-table
        v-if="listExercise"
        :columns="columns"
        :data-source="filterData"
        :pagination="false"
        rowKey="_id"
        style="height: 80vh; overflow: scroll"
      >
        <template slot="info" slot-scope="record">
          <div class="table-avatar-info">
            <div class="avatar-info">
              <h6>{{ record.exerciseName }}</h6>
              <p>{{ record.description }}</p>
            </div>
          </div>
        </template>

        <template slot="status" slot-scope="record">
          <div class="author-info">
            <a-tag
              class="tag-status"
              v-if="userProfile.role === 'student'"
              :class="statusStudent(record)"
            >
              {{ record.status === "Not done" ? "Chưa làm" : "Đã làm" }}
            </a-tag>
            <a-tag
              class="tag-status"
              v-if="userProfile.role === 'teacher'"
              :class="record.isHide ? 'ant-tag-muted' : 'ant-tag-primary'"
            >
              {{ record.isHide ? "Đã ẩn" : "Chưa ẩn" }}
            </a-tag>
            <a-tag class="tag-status ant-tag-danger" v-if="record.disabled">
              Timeout
            </a-tag>
          </div>
        </template>

        <template slot="deadline" slot-scope="record">
          <div class="author-info">
            <span>From:</span>
            <h6>
              {{ formatDateTime(record.startDate) }}
            </h6>
            <span>To:</span>
            <h6>
              {{ formatDateTime(record.endDate) }}
            </h6>
          </div>
        </template>

        <template slot="editBtn" slot-scope="record">
          <a-dropdown>
            <a class="icon" @click="(e) => e.preventDefault()">
              <a-icon type="dash"
            /></a>
            <a-menu v-if="userProfile.role === 'teacher'" slot="overlay">
              <a-menu-item @click="detailExercise(record)">
                <a-icon type="enter" /> View detail
              </a-menu-item>
              <a-menu-item @click="scoreExercise(record)">
                <a-icon type="check" /> Mark
              </a-menu-item>
              <a-menu-item v-if="record.isHide" @click="showExercise(record)">
                <a-icon type="plus-circle" /> Show
              </a-menu-item>
              <a-menu-item v-else @click="hideExercise(record)">
                <a-icon type="minus-circle" /> Hide
              </a-menu-item>
              <a-menu-item>
                <router-link
                  :to="{
                    name: 'Edit material',
                    params: { id: classInfo.id, exerciseId: record._id },
                  }"
                >
                  <a-icon type="edit" /> Edit
                </router-link>
              </a-menu-item>
              <a-menu-item @click="showDeleteConfirm(record)">
                <a-icon type="delete" /> Delete
              </a-menu-item>
            </a-menu>
            <a-menu v-if="userProfile.role === 'student'" slot="overlay">
              <a-menu-item @click="detailExercise(record)">
                <a-icon type="enter" /> View detail
              </a-menu-item>
              <a-menu-item
                @click="submitExercise(record)"
                v-if="record.status === 'Not done' && !record.disabled"
              >
                <a-icon type="edit" /> Submit
              </a-menu-item>
              <a-menu-item
                @click="resubmitExercise(record)"
                v-if="!record.disabled"
              >
                <a-icon type="edit" /> Edit submitted work
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
        <div slot="expandedRowRender" slot-scope="record">
          <DisplayFile
            :picture="record.examFileUrl.split('_')[1]"
            :extensionFile="record.fileExtension"
            :fileName="record.fileName"
          />
        </div>
      </a-table>
      <TableLoading v-else />
      <a-modal
        title="Delete Material"
        v-model="isDelete"
        okText="Xóa"
        okType="danger"
        @ok="deleteExercise"
        cancelText="Hủy"
        @cancel="isDelete = false"
        >Are you sure you want to delete?</a-modal
      >
    </a-col>
    <a-col :span="6" v-if="detail">
      <ExcerciseInfo :info="detail" @close="detail = null" />
    </a-col>
    <SubmitExerciseModal
      v-if="isSubmit"
      :isShow="isSubmit"
      :exerciseData="recordData"
      @close="isSubmit = false"
      @submit="createScore"
    />
    <ReSubmitExerciseModal
      v-if="isResubmit"
      :isShow="isResubmit"
      :exerciseData="resubmitData"
      @close="isResubmit = false"
      @submit="updateScore"
    />
  </a-row>
</template>

<script>
import { DatetimeMixin } from "../../mixin/Datetime";
import { LocalStorageMixin } from "../../mixin/LocalStorage";

import DisplayFile from "../../components/Excercises/DisplayFile.vue";
import TableLoading from "../../components/Base/TableLoading.vue";
import ExcerciseInfo from "../../components/Excercises/ExcerciseInfo.vue";
import SubmitExerciseModal from "./SubmitExerciseModal.vue";
import ReSubmitExerciseModal from "./ReSubmitExerciseModal.vue";

export default {
  mixins: [DatetimeMixin, LocalStorageMixin],
  components: {
    DisplayFile,
    TableLoading,
    ExcerciseInfo,
    ReSubmitExerciseModal,
    SubmitExerciseModal,
  },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    listExercise: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      txtSearch: "",
      isDelete: false,
      deleteData: null,
      detail: null,
      isSubmit: false,
      isResubmit: false,
      recordData: null,
      resubmitData: null,
    };
  },
  mounted() {},
  computed: {
    filterData() {
      return this.listExercise.filter((row) => {
        const name = row.exerciseName.toString().toLowerCase();
        const description = row.description.toLowerCase();

        return (
          name.includes(this.txtSearch) || description.includes(this.txtSearch)
        );
      });
    },
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
  },
  methods: {
    showDeleteConfirm(record) {
      this.isDelete = true;
      this.deleteData = record;
    },
    deleteExercise() {
      this.$emit("delete", this.deleteData._id);
      this.isDelete = false;
    },
    detailExercise(record) {
      this.detail = record;
    },
    scoreExercise(record) {
      this.$emit("score", record);
    },
    submitExercise(record) {
      this.recordData = record;
      this.isSubmit = true;
    },
    resubmitExercise(record) {
      this.resubmitData = record;
      this.isResubmit = true;
    },
    createScore(payload) {
      this.$emit("submit", payload);
      this.isSubmit = false;
    },
    updateScore(id, payload) {
      this.$emit("updateScore", id, payload);
      this.isResubmit = false;
    },
    statusStudent(record) {
      return record.status === "Not done" ? "ant-tag-muted" : "ant-tag-primary";
    },
    hideExercise(record) {
      const payload = {
        isHide: "true",
      };
      this.$emit("hide", true, record._id, payload);
    },
    showExercise(record) {
      const payload = {
        isHide: "false",
      };
      this.$emit("hide", false, record._id, payload);
    },
  },
};
</script>

<style lang="scss">
.responsive-list-exercise {
  .ant-tabs-tab-active {
    display: none !important;
  }
}
</style>
