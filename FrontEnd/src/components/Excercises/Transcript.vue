<template>
  <div>
    <a-input
      v-model="txtSearch"
      placeholder="Search by submitter's name"
      size="large"
    />
    <a-table
      v-if="listScore"
      :columns="columns"
      :data-source="filterData||listScore"
      :pagination="false"
      rowKey="_id"
    >
      <template slot="info" slot-scope="record">
        <div class="table-avatar-info">
          <a-avatar shape="square" :src="record.createAvatar" />
          <div class="avatar-info">
            <h6>{{ record.createName }}</h6>
          </div>
        </div>
      </template>

      <template slot="score" slot-scope="record">
        <div class="author-info">
          <h5>{{ record.scores ? record.scores : "" }}</h5>
        </div>
      </template>

      <template slot="editBtn" slot-scope="record">
        <a-dropdown>
          <a class="icon" @click="(e) => e.preventDefault()">
            <a-icon type="dash"
          /></a>
          <a-menu slot="overlay">
            <a-menu-item @click="markExercise(record)">
              <a-icon type="edit" /> Chấm điểm
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </template>
      <div slot="expandedRowRender" slot-scope="record">
        <DisplayFile
          :picture="record.answerFile"
          :extensionFile="record.fileExtension"
          :fileName="record.fileName"
        />
      </div>
    </a-table>
    <TableLoading v-else />
    <a-modal
      v-model="isMark"
      title="Chấm điểm"
      ok-text="Xác nhận"
      cancel-text="Hủy"
      @ok="scoreExercise"
    >
      <v-text-field v-model="score" type="text" label="Điểm"></v-text-field>
      <v-text-field v-model="comment" type="text" label="Nhận xét bài làm"></v-text-field>
    </a-modal>
  </div>
</template>

<script>
import Score from "../../api/Score";
import TableLoading from "../../components/Base/TableLoading.vue";
import DisplayFile from "../../components/Excercises/DisplayFile.vue";

export default {
  components: {
    TableLoading,
    DisplayFile,
  },
  props: {
    item: {
      type: Object,
      default: null,
    },
    columns: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      listScore: null,
      isMark: false,
      score: "",
      comment: "",
      record: null,
      txtSearch: "",
    };
  },
  mounted() {
    Score.getScoreByExerciseId(this.item.key)
      .then((res) => {
        this.listScore = res.data.data;
      })
      .catch((e) => {
        console.log("e", e);
      });
  },
  methods: {
    scoreExercise() {
      const payload = {
        studentId: this.record.createBy,
        scores: this.score,
        comment: this.comment
      };
      this.$emit("score", this.record._id, payload);
      this.score = "";
      this.isMark = false;
    },
    markExercise(record) {
      this.isMark = true;
      this.record = record;
      this.score = record.scores || "";
    },
  },
  computed: {
    filterData() {
      return this.listScore.filter((row) => {
        const name = row.createName.toString().toLowerCase();

        return name.includes(this.txtSearch);
      });
    },
  },
};
</script>

<style></style>
