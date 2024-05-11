<template>
  <div class="responsive-member">
    <TableLoading v-if="loading"></TableLoading>
    <a-row class="responsive-member" :gutter="20" v-else>
      <a-col :span="userProfile.role === 'teacher' ? 16 : 24">
        <ListMember
          v-if="listStudent.length > 0"
          :listStudent="listStudent"
          :columns="MemembersColumns"
          @delete="deleteMember"
          @add="addMember"
        />
        <div v-else style="display: grid; text-align: center">
          <div
            style="
              display: flex;
              text-align: center;
              align-items: center;
              justify-content: center;
            "
          >
            <img src="../../../public/images/ic_empty.png"   class ="responsive-image-nodata" />
          </div>

          <p style="font-size: 14px">No data</p>
        </div>
      </a-col>
      <a-col :span="8" v-if="userProfile.role === 'teacher'">
        <Request @approve="approveMember" :key="approve" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { NotificationMixin } from "../../mixin/Notification";
import { LocalStorageMixin } from "../../mixin/LocalStorage";
import Member from "../../api/Member";
import Class from "../../api/Class";
import TableLoading from "../../components/Base/TableLoading.vue";
import ListMember from "../../components/Members/ListMember.vue";
import Request from "../../components/Members/Request.vue";

export default {
  mixins: [NotificationMixin, LocalStorageMixin],
  components: {
    Request,
    ListMember,
    TableLoading,
  },
  data() {
    return {
      // Associating "Authors" table columns with its corresponding property.
      approve: 0,
      listStudent: null,
      loading: false,
    };
  },
  mounted() {
    this.loading = true;
    this.getListMember();
  },
  computed: {
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
    MemembersColumns() {
      return JSON.parse(localStorage.getItem("userProfile")) === "teacher"
        ? [
            {
              title: "Member name",
              dataIndex: "author",
              scopedSlots: { customRender: "author" },
            },
            {
              title: "Phone",
              dataIndex: "phone",
              scopedSlots: { customRender: "phone" },
            },
            {
              title: "Gender",
              dataIndex: "gender",
              scopedSlots: { customRender: "gender" },
            },
            {
              title: "",
              key: "action",
              scopedSlots: { customRender: "action" },
              width: 50,
            },
          ]
        : [
            {
              title: "Member name",
              dataIndex: "author",
              scopedSlots: { customRender: "author" },
            },
            {
              title: "Gender",
              dataIndex: "gender",
              scopedSlots: { customRender: "gender" },
            },
            {
              title: "",
              key: "action",
              scopedSlots: { customRender: "action" },
              width: 50,
            },
          ];
    },
  },
  methods: {
    deleteMember(payload) {
      Member.deleteStudentFromClass(payload)
        .then((res) => {
          this.openNotificationWithIcon(
            "success",
            "Delete student successfully"
          );
          this.getListMember();
        })
        .catch((e) => {
          this.openNotificationWithIcon(
            "error",
            "Delete student failed",
            error.response.data.message
          );
        });
    },
    addMember(payload) {
      Member.addStudentToClass(payload)
        .then((response) => {
          this.openNotificationWithIcon("success", "Add student successfully");
          this.getListMember();
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Add student failed",
            error.response.data.message
          );
        });
    },
    approveMember(payload) {
      Member.approveToClass(payload)
        .then((response) => {
          this.openNotificationWithIcon(
            "success",
            "Approve student to class successfully"
          );
          this.getListMember();
          this.approve++;
        })
        .catch((e) => {
          this.openNotificationWithIcon(
            "error",
            "Approve student to class failed",
            error.response.data.message
          );
        });
    },
    getListMember() {
      Class.getClassById(this.$route.params.id)
        .then((response) => {
          this.listStudent = response.data.data.students.map((obj) => {
            return {
              ...obj,
              author: {
                avatar: obj.avatar,
                name: obj.name,
                email: obj.email,
              },
            };
          });
          this.loading = false;
        })
        .catch((error) => {
          console.log("e", error);

          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss">
.responsive-image-nodata {
  width: 23%
}
@media only screen and (max-width: 400px) {
  .responsive-member {
    margin-top: -90% !important;
    width: 100vw !important;
  }
}
@media only screen and (max-width: 1000px) {
  .responsive-image-nodata {
        width: 45% !important
      }
  }
</style>
