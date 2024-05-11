<template>
  <div>
    <ListExercise
      v-if="!loading"
      :columns="ExerciseColumns"
      @delete="deleteExercise"
      @score="scoreExercise"
      @submit="submitExercise"
      @hide="hideExercise"
      @updateScore="updateExercise"
      :listExercise="listExercise"
    />
    <!-- <a-tabs
      v-if="!loading"
      v-model="activeKey"
      hide-add
      type="editable-card"
      @edit="onEdit"
    >
      <a-tab-pane key="1" tab="List" :closable="false">
        <ListExercise
          :columns="ExerciseColumns"
          @delete="deleteExercise"
          @score="scoreExercise"
          @submit="submitExercise"
          @hide="hideExercise"
          @updateScore="updateExercise"
          :listExercise="listExercise"
        />
      </a-tab-pane>
      <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title">
        <Transcript
          :columns="TranscriptColumns"
          :item="pane"
          @score="markExercise"
          :key="update"
        />
      </a-tab-pane>
    </a-tabs> -->
    <TableLoading v-else> </TableLoading>
  </div>
</template>

<script>
const TranscriptColumns = [
  {
    title: "Submitor",
    scopedSlots: { customRender: "info" },
  },
  {
    title: "Score",
    scopedSlots: { customRender: "score" },
  },
  {
    title: "",
    scopedSlots: { customRender: "editBtn" },
    width: 50,
  },
];
import TableLoading from "../../components/Base/TableLoading.vue";
import { NotificationMixin } from "../../mixin/Notification";
import { LocalStorageMixin } from "../../mixin/LocalStorage";

import Exercise from "../../api/Exercise";
import Score from "../../api/Score";
import Folder from "../../components/Excercises/Folder.vue";
import ListExercise from "../../components/Excercises/ListExercise.vue";
import Transcript from "../../components/Excercises/Transcript.vue";

export default {
  mixins: [NotificationMixin, LocalStorageMixin],
  components: {
    Transcript,
    ListExercise,
    Folder,
    TableLoading,
  },
  data() {
    return {
      searchType: "name",
      TranscriptColumns: TranscriptColumns,
      listExercise: null,
      panes: [],
      activeKey: "1",
      newTabIndex: 0,
      update: 0,
      loading: false,
    };
  },
  mounted() {
    this.loading = true;
    this.getExercise();
  },
  computed: {
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
    ExerciseColumns() {
      return JSON.parse(localStorage.getItem("userProfile")) === "teacher"
        ? [
            {
              title: "Exercise name",
              scopedSlots: { customRender: "info" },
            },
            {
              title: "Status ",
              scopedSlots: { customRender: "status" },
            },
            {
              title: "Deadline",
              scopedSlots: { customRender: "deadline" },
            },
            {
              title: "",
              scopedSlots: { customRender: "editBtn" },
              width: 50,
            },
          ]
        : [
            {
              title: "Exercise name",
              scopedSlots: { customRender: "info" },
            },
            // {
            //   title: "Status ",
            //   scopedSlots: { customRender: "status" },
            // },
            // {
            //   title: "",
            //   scopedSlots: { customRender: "editBtn" },
            //   width: 50,
            // },
          ];
    },
  },
  methods: {
    deleteExercise(id) {
      Exercise.deleteExercise(id)
        .then((res) => {
          this.openNotificationWithIcon(
            "success",
            "Delete exercise successfully"
          );
          this.getExercise();
        })
        .catch((e) => {
          this.openNotificationWithIcon(
            "success",
            "Delete failed assignment",
            error.response.data.message
          );
        });
    },
    scoreExercise(record) {
      this.activeKey = record._id;
      this.panes.push({
        title: record.exerciseName,
        key: this.activeKey,
      });
    },
    onEdit(targetKey, action) {
      this[action](targetKey);
    },
    add() {
      const panes = this.panes;
      const activeKey = `newTab${this.newTabIndex++}`;
      panes.push({
        title: `New Tab ${activeKey}`,
        content: `Content of new Tab ${activeKey}`,
        key: activeKey,
      });
      this.panes = panes;
      this.activeKey = activeKey;
    },
    remove(targetKey) {
      let activeKey = this.activeKey;
      let lastIndex;
      this.panes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      const panes = this.panes.filter((pane) => pane.key !== targetKey);
      if (panes.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = panes[lastIndex].key;
        } else {
          activeKey = panes[0].key;
        }
      }
      this.panes = panes;
      this.activeKey = activeKey;
    },
    markExercise(id, payload) {
      Score.updateScore(id, payload)
        .then((res) => {
          this.openNotificationWithIcon(
            "success",
            "Grading for successful assignments"
          );
          this.getExercise();
          this.update++;
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "success",
            "Grading failed assignments",
            error.response.data.message
          );
        });
    },
    submitExercise(payload) {
      Score.createScore(payload)
        .then((res) => {
          this.openNotificationWithIcon(
            "success",
            "Successful assignment submission"
          );
          this.getExercise();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "success",
            "Failed assignment submission",
            error.response.data.message
          );
        });
    },
    updateExercise(id, payload) {
      Score.updateScore(id, payload)
        .then((res) => {
          this.openNotificationWithIcon(
            "success",
            "Successful assignment submission"
          );
          this.getExercise();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "success",
            "Failed assignment submission",
            error.response.data.message
          );
        });
    },
    hideExercise(isHide, id, payload) {
      Exercise.updateExercise(id, payload)
        .then((res) => {
          this.openNotificationWithIcon(
            "success",
            isHide
              ? "Hide successful assignments"
              : "Show successful assignments"
          );
          this.getExercise();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "success",
            isHide ? "Hide failed assignments" : "Show failed assignments",
            error.response.data.message
          );
        });
    },
    getExercise() {
      Exercise.getListExerciseByClass(this.classInfo.id)
        .then((res) => {
          this.listExercise = res.data.data;
          this.loading = false;
        })
        .catch((e) => {
          console.log("e", e);
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss"></style>
