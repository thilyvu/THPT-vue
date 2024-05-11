<template>
  <a-space direction="vertical" style="width: 100%, border-radius: 20px;">
    <h6 style="margin-top: 10px; margin-bottom: 0px">
      Pending Approval ({{ listStudentLength }})
    </h6>
    <a-list
      class="conversations-list"
      item-layout="horizontal"
      :split="false"
      :data-source="listAwaitStudent"
    >
      <a-list-item slot="renderItem" slot-scope="item">
        <a-button
          @click="approveMember(item)"
          slot="actions"
          type="link"
          style="color: #1890ff"
        >
          Approve
        </a-button>
        <a-list-item-meta :title="item.name" :description="item.email">
          <a-avatar
            slot="avatar"
            :size="48"
            shape="square"
            :src="item.avatar"
          />
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </a-space>
</template>

<script>
import Class from "../../api/Class";

export default {
  data() {
    return {
      // Active button for the "Authors" table's card header radio button group.
      authorsHeaderBtns: "all",
      listAwaitStudent: [],
    };
  },
  mounted() {
    Class.getClassById(this.$route.params.id)
      .then((response) => {
        const listStudents = response.data.data.students.map((item)=> item._id);
        this.listAwaitStudent = response.data.data.awaitStudents.filter((item) => !listStudents.includes(item._id));
      })
      .catch((error) => {
        console.log("e", error);
      });
  },
  computed: {
    listStudentLength() {
      return this.listAwaitStudent?.length || 0;
    },
  },
  methods: {
    approveMember(item) {
      const payload = {
        classId: this.$route.params.id,
        studentId: item._id,
      };
      this.$emit("approve", payload);
    },
  },
};
</script>

<style></style>
