<template>
  <div class="responsive-list-member">
    <a-card
      :bordered="false"
      class="header-solid h-full"
      :bodyStyle="{ padding: 0 }"
    >
      <template #title>
        <a-row type="flex" align="middle" justify="space-between">
          <a-col>
            <a-input-search
              placeholder="Search by name, phone or email"
              v-model="txtSearch"
            />
          </a-col>
          <AddMemberModal
            @add="addMember"
            v-if="userProfile.role === 'teacher'"
          />
        </a-row>
      </template>
      <a-table
        v-if="filterData"
        :columns="columns"
        :data-source="filterData"
        :pagination="true"
        rowKey="_id"
      >
        <template slot="author" slot-scope="author">
          <div class="table-avatar-info">
            <a-avatar shape="square" :src="author.avatar" />
            <div class="avatar-info">
              <h6>{{ author.name }}</h6>
              <p>{{ author.email }}</p>
            </div>
          </div>
        </template>

        <template slot="phone" slot-scope="phone">
          <div class="author-info">
            <h6 class="m-0">{{ phone }}</h6>
          </div>
        </template>

        <template slot="gender" slot-scope="gender">
          <a-tag
            class="tag-status"
            :class="gender === 'male' ? 'ant-tag-primary' : 'ant-tag-muted'"
          >
            {{ gender === "male" ? "Nam" : "Nữ" }}
          </a-tag>
        </template>

        <template
          slot="action"
          slot-scope="record"
          v-if="userProfile.role === 'teacher'"
        >
          <a-button
            type="dashed"
            icon="delete"
            @click="confirmDeleteMember(record._id)"
          />
        </template>
      </a-table>
      <TableLoading v-else />
    </a-card>
    <a-modal
      title="Xóa thành viên"
      v-model="isDelete"
      okText="Xóa"
      okType="danger"
      @ok="deleteMember"
      cancelText="Hủy"
      @cancel="isDelete = false"
      >Bạn có chắc muốn mời học sinh này ra khỏi lớp?</a-modal
    >
  </div>
</template>

<script>
import { LocalStorageMixin } from "../../mixin/LocalStorage";
import AddMemberModal from "./AddMemberModal.vue";
import TableLoading from "../Base/TableLoading.vue";

export default {
  mixins: [LocalStorageMixin],
  components: {
    AddMemberModal,
    TableLoading,
  },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    listStudent: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // Active button for the "Authors" table's card header radio button group.
      authorsHeaderBtns: "all",
      isAdd: false,
      isDelete: false,
      deleteData: null,
      txtSearch: "",
    };
  },
  methods: {
    addMember(payload) {
      this.$emit("add", payload);
    },
    confirmDeleteMember(id) {
      this.isDelete = true;
      this.deleteData = id;
    },
    deleteMember() {
      this.isDelete=false;
      const payload = {
        classId: this.classId,
        studentId: this.deleteData,
      };
      this.$emit("delete", payload);
    },
    removeVietnameseTones(str) {
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");
      str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
      str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
      str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
      str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
      str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
      str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
      str = str.replace(/Đ/g, "D");
      // Some system encode vietnamese combining accent as individual utf-8 characters
      // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
      str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
      str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
      // Remove extra spaces
      // Bỏ các khoảng trắng liền nhau
      str = str.replace(/ + /g, " ");
      str = str.trim();
      // Remove punctuations
      // Bỏ dấu câu, kí tự đặc biệt
      str = str.replace(
        /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
        " "
      );
      return str;
    },
  },
  computed: {
    classId() {
      return this.$route.params.id;
    },
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
    filterData() {
      return this.listStudent?.filter((row) => {
        const name = row && row.name ? row.name.toString().toLowerCase() : '';
        const phone = row && row.phone ? row.phone.toLowerCase() : '';
        const email = row && row.email ? row.email.toLowerCase() : '';
        var search = new RegExp(
        this.removeVietnameseTones(this.txtSearch),
        "i"
      );
        return (
          search.test(this.removeVietnameseTones(name))
        );
      });
    },
  },
};
</script>
<style scoped>
@media (max-width: 400px) { 
  .responsive-list-member {
   width: 100vw !important;
  }
}
</style>