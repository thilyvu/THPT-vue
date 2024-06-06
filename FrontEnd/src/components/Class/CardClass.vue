<template>
  <a-row type="flex" :gutter="20" v-if="listClass">
    <a-col :span="6" v-for="item in listClass" :key="item._id">
      <a-card
        :bordered="false"
        class="card-info card-class"
        style="margin-top: 10px; max-height: 245px; margin-top: 1.5rem"
        @click="isSearch ? blankMethod :  (userProfile.role === 'student' && checkIfIsInClass(item._id) || userProfile.role === 'teacher') ? enterClass(item) : blankMethod"
      >
        <div class="card-img-bg">
          <img :src="item.bannerImg" alt="" />
        </div>
        <div>
          <a-row>
            <a-col :span="22">
              <h6 class="class-name">
                {{ truncate(item.name, 25) }}
              </h6>
              <p class="class-code">
                <a-tag v-if="item.subject === 'Books'" color="#FFB699"  :class="`${item.subject === 'Collection' ? 'ant-tag-primary' :  'ant-tag-warning'}`">
                  <b>{{ truncate(item.subject, 30) }}</b>
                </a-tag>
                <a-tag v-else   :class="`${item.subject === 'Collection' ? 'ant-tag-primary' :  'ant-tag-warning'}`">
                  <b>{{ truncate(item.subject, 30) }}</b>
                </a-tag>
              </p>
              {{ truncate(item.description, 50) }}
            </a-col>
            <a-col :span="2" style="text-align: right">
              <a-dropdown>
                <a class="icon-more" @click="(e) => e.preventDefault()">
                  <a-icon type="more"
                /></a>
                <a-menu slot="overlay" v-if="!checkIfIsInClass(item._id) && userProfile.role !== 'teacher'">
                  <a-menu-item @click="joinClass(item)">
                    <a-icon type="form" /> Xin vào lớp
                  </a-menu-item>
                </a-menu>
                <a-menu slot="overlay" v-else>
                  <a-menu-item @click="enterClass(item)">
                    <a-icon type="enter" /> Go to class
                  </a-menu-item>
                  <a-menu-item
                    v-if="userProfile.role === 'student'"
                    @click="leaveClass(item)"
                  >
                    <a-icon type="logout" /> Leave class
                  </a-menu-item>
                  <a-menu-item v-if="userProfile.role === 'teacher'">
                    <router-link
                      :to="{
                        name: 'Chỉnh sửa Lớp',
                        params: { id: item._id },
                      }"
                    >
                      <a-icon type="setting" style="margin-right : 0.4rem"/> Edit class
                    </router-link>
                  </a-menu-item>
                  <a-menu-item
                    v-if="userProfile.role === 'teacher'"
                    @click="exportExcel(item)"
                  >
                    <a-icon type="download" /> Export transcript
                  </a-menu-item>
                  <a-menu-item
                    @click="confirmDelete(item)"
                    v-if="userProfile.role === 'teacher'"
                  >
                    <a-icon type="delete" /> Delete class
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-col>
          </a-row>
        </div>
      </a-card>
    </a-col>
    <a-modal
      v-model="isDelete"
      title="Delete class"
      @ok="deleteClass"
      okType="danger"
      ok-text="Confirm"
      cancel-text="Cancel"
    >
      Are you sure you want to delete this class?
    </a-modal>
    <a-modal
      v-model="dialog"
      :footer="null"
      :closable="false"
      :forceRender="true"
    >
      <TableLoading></TableLoading>
    </a-modal>
  </a-row>
</template>

<script>
import { LocalStorageMixin } from "../../mixin/LocalStorage";
import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import * as fs from "file-saver";
import Test from "../../api/Test";
import StudentKey from "../../api/studentKey";
import TableLoading from "../Base/TableLoading.vue";

import { NotificationMixin } from "../../mixin/Notification";
export default {
  mixins: [LocalStorageMixin, NotificationMixin],
  props: {
    listClass: {
      type: Array,
      default: null,
    },
    listPersonalClass: {
      type: Array,
      default: null,
    },
    isSearch: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
  },
  components: { TableLoading },
  data() {
    return {
      isDelete: false,
      deleteData: null,
      listTest: [],
      dialog: false,
    };
  },
  
  methods: {
    confirmDelete(item) {
      this.deleteData = item;
      this.isDelete = true;
    },
    checkIfIsInClass(id) {
      return this.listPersonalClass.findIndex((item) => item._id.toString() === id) > -1 
    },
    deleteClass() {
      this.$emit("delete", this.deleteData._id);
      this.isDelete = false;
    },
    joinClass(item) {
      this.$emit("join", item._id);
    },
    leaveClass(item) {
      this.$emit("leave", item._id);
    },
    truncate(str, n) {
      return str.length > n ? str.substr(0, n - 1) + "&hellip;" : str;
    },
    async exportExcel(item) {
      this.dialog = true;
      const options = {
        filename: "./streamed-workbook.xlsx",
        useStyles: true,
        useSharedStrings: true,
      };
      let rowIndex = 1;
      const workbook = new ExcelJS.Workbook(options);
      workbook.creator = "LAB";
      workbook.lastModifiedBy = "LAB";
      workbook.created = new Date(1985, 8, 30);
      workbook.modified = new Date();
      workbook.lastPrinted = new Date(2016, 9, 27);
      const worksheet = workbook.addWorksheet();
      let columns = [
        { header: "STT", key: "name", width: 10 },
        { header: "Họ và tên\ BKT", key: "workName", width: 32 },
      ];

      await Test.getTestByClassId(
        item._id,
        new URLSearchParams([
          ["limit", 100],
          ["page", this.page],
        ])
      )
        .then((response) => {
          this.listTest = response.data.data;
          this.listTest.map((test) => {
            columns.push({
              header: test.testName,
              key: test.testName,
              width: 50,
            });
          });
          worksheet.columns = columns;
        })
        .catch((e) => {
          console.log(e);
        });
      if (item.students.length === 0) {
        this.dialog = false;
        this.openNotificationWithIcon(
          "error",
          "Không có học sinh nào trong lớp này"
        );
      }
      if (this.listTest.length === 0) {
        this.openNotificationWithIcon(
          "error",
          "Không có bài kiểm tra nào trong lớp này"
        );
      }
      await item.students.map(async (student) => {
        let row = [student.name];
        Promise.all(
          await this.listTest.map(async (test) => {
            const payload = {
              classId: item._id,
              testId: test._id,
              studentId: student._id,
            };

            const response =
              await StudentKey.getcurrentStudentKeyByClassAndTestIdAndStudentId(
                payload
              );
            if (response.data.data.length === 0) {
              return 0;
            } else {
              const score = response.data.data[response.data.data.length - 1];
              return score.totalCorrect;
            }
          })
        ).then((result) => {
          row = [rowIndex, ...row, ...result];
          worksheet.addRow(row);
          if (rowIndex === item.students.length) {
            this.dialog = false;
            workbook.xlsx
              .writeBuffer()
              .then((data) => {
                let blob = new Blob([data], {
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                fs.saveAs(blob, `${item.name}.xlsx`);
                this.openNotificationWithIcon(
                  "success",
                  "Xuất bảng điểm thành công"
                );
              })

              .catch((error) => {
                this.dialog = false;
                this.openNotificationWithIcon(
                  "error",
                  "Xuất bảng điểm thất bại",
                  error
                );
              });
          }
          rowIndex++;
        });
      });
    },
    enterClass(item) {
      const payload = {
        id: item._id,
        classCode: item.classCode,
        name: item.name,
        banner: item.bannerImg,
      };
      this.classLocalStorage(payload);
      this.$router.push({
        name: "quizExercise",
        params: { id: item._id },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.icon-more {
  padding-right: 0px;
  font-size: 24px;
  color: black;
}
.class-name {
  margin-top: 10px;
  color: black !important;
}
.class-code {
  margin-bottom: 5px;
}
.card-class {
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
}
</style>
