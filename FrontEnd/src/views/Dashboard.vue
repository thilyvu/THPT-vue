<template>
  <div>
    <TableLoading v-if="loading"> </TableLoading>
    <div v-else>
      <a-row
        v-if="userProfile.role === 'teacher'"
        type="flex"
        :gutter="10"
        align="middle"
        v-bind:style="[
          userProfile.role === 'student'
            ? {}
            : { justifyContent: 'space-between' },
        ]"
        style="
          background: white;
          padding: 20px 25px 20px 25px;
          margin: -10px 0px 0px 0px;
          margin-bottom: 0.5rem;
        "
      >
        <a-col :span="12">
          <!-- <a-input
            v-if="userProfile.role === 'student'"
            v-model="txtSearch"
            placeholder="Tìm kiếm"
            size="large"
          /> -->
          <a-input
            v-if="userProfile.role !== 'student'"
            v-model="txtTeacherSearch"
            placeholder="Search by class name or code"
            size="large"
          />
        </a-col>
        <!-- <a-col v-if="userProfile.role === 'student'">
          <a-radio-group v-model="isName" button-style="solid">
            <a-radio-button :value="true"> Theo tên </a-radio-button>
            <a-radio-button :value="false"> Theo mã lớp </a-radio-button>
          </a-radio-group>
        </a-col> -->
        <a-col>
          <v-btn
            v-if="userProfile.role === 'teacher'"
            color="primary"
            dark
            @click="addClass"
          >
            Create new class
          </v-btn>
          <!-- <v-btn
            v-if="userProfile.role === 'teacher'"
            color="primary"
            dark
            @click="addFile"
          >
            Create new file
          </v-btn> -->
          <!-- <v-btn v-else color="primary" dark @click="searchClass">
            Tìm kiếm
          </v-btn> -->
        </a-col>
        <a-col v-if="isSearch">
          <v-btn @click="initData"> Back to class list </v-btn>
        </a-col>
      </a-row>
      <CardClass
        style="padding-bottom: 1.5rem; padding-left: 2%; padding-right: 2%"
        :listClass="filterData"
        :isSearch="isSearch"
        @delete="deleteClass"
        @join="joinClass"
        @leave="leaveClass"
      />
      <!-- <CardClassForMyCourse
        style="margin-top: 0.5rem"
        v-if="userProfile.role !== 'teacher' && !isSearch"
        @join="joinClass"
        :filterData="filterData"
      ></CardClassForMyCourse>
      <a-row v-if="userProfile.role !== 'teacher'" style=" background: white; padding-left: 7%;padding-right: 7%;padding-bottom: 1.5rem;">
        <b style="font-size: 20px">Recommended courses</b>
        <CardClassForAllCourse
          style="margin-top: 0.5rem; background: white;"
          :listClass="filterFullClassData"
          @delete="deleteClass"
          @join="joinClass"
          @leave="leaveClass"
        />
      </a-row> -->
    </div>
  </div>
</template>

<script>
import CardClass from "../components/Class/CardClass";
import CardClassForAllCourse from "../components/Class/CardClassForAllCourse";
import Class from "../api/Class";
import Test from "../api/Test";

import { NotificationMixin } from "../mixin/Notification";
import { LocalStorageMixin } from "../mixin/LocalStorage";
import TableLoading from "../components/Base/TableLoading.vue";
import { DatetimeMixin } from "../mixin/Datetime";
import CreateStudentEvent from "../components/Calendars/CreateStudentEvent.vue";
import CreateEvent from "../components/Calendars/CreateEvent.vue";
import FullCalendar from "../components/Calendars/FullCalendar.vue";
import CardClassForMyCourse from "../components/Class/CardClassForMyCourse.vue";
import store from "../store/index";
import * as _ from "lodash";
export default {
  mixins: [NotificationMixin, LocalStorageMixin, DatetimeMixin],
  components: {
    CardClass,
    TableLoading,
    FullCalendar,
    CreateEvent,
    CardClassForAllCourse,
    CreateStudentEvent,
    CardClassForMyCourse,
  },
  data() {
    return {
      searchType: "name",
      txtSearch: "",
      isName: false,
      sort: "new",
      listClass: [],
      txtTeacherSearch: "",
      isSearch: false,
      bakClass: null,
      loading: false,
      listCalendar: null,
      update: 0,
      listFullClass: null,
    };
  },
  mounted() {
    if (!this.getToken()) this.$router.push("/sign-in");
    this.loading = true;
    Class.getListPersonalClass(this.getToken())
      .then((response) => {
        this.bakClass = response.data.data;
        response.data.data.map((item, index) => {
          Test.getTestByClassId(item._id).then((response) => {
            this.listClass.push({
              ...item,
              tests: response.data.data.length || 0,
            });
          });
        });
        this.loading = false;
      })
      .catch((e) => {
        this.loading = false;
      });
    Class.getListClass().then((response) => {
      this.listFullClass = response.data.data;
    });
  },
  watch: {
    searchText(value) {
      this.handleSearchWithDebounce(value);
    },
  },
  methods: {
    addClass() {
      this.$router.push("/class/add");
    },
    addFile() {
      const OAUTH_TOKEN =
        "ya29.a0AfB_byDSEpbLvbY5Aw16RuDGGsOeIKIFhGchdWct4w4C7XJQ4cxl3NyFe4EcEcXsnaiIBR6O6iQNhr5DDMSpnWqsOZEM1MwxDgIK2-ba8pYXsQ3oKuILayEwDml3f3SzVp6GkikPdhMwAhXqIlVAYD8KQ31FVzw9Zm05aCgYKATsSARESFQGOcNnC_XAbWvnUmeCqK1JRMe7v5Q0171"; // This should be obtained via OAuth2 process

      const createGoogleDocFromHTML = async (htmlContent) => {
        const boundary = "boudaryString"; // Can be any string
        const multipartRequestBody =
          `--${boundary}\r\n` +
          "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
          JSON.stringify({
            name: "My Document",
            mimeType: "application/vnd.google-apps.document",
          }) +
          `\r\n--${boundary}\r\n` +
          "Content-Type: text/html\r\n\r\n" +
          htmlContent +
          `\r\n--${boundary}--`;

        const response = await fetch(
          "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${OAUTH_TOKEN}`,
              "Content-Type": `multipart/related; boundary=${boundary}`,
            },
            body: multipartRequestBody,
          }
        );

        const data = await response.json();
        return data.id; // This will be the Google Doc ID
      };

      const myHTML =
        "<h1>Hello World</h1><p>This is a Google Doc created from HTML.</p>";
      createGoogleDocFromHTML(myHTML).then((docId) => {
        console.log(`Google Doc created with ID: ${docId}`);
      });
    },
    handleSearchWithDebounce: _.debounce(function (value) {
      this.txtSearch = value;
      value === "" ? (this.isSearch = false) : (this.isSearch = true);
    }, 500),
    joinClass(id) {
      Class.joinClass(id)
        .then((response) => {
          this.openNotificationWithIcon(
            "success",
            "Send request to join class successfully",
            "Please wait until teacher approve your request"
          );
          this.getClass();
          this.isSearch = false;
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Send request to join class failed",
            error.response.data.message
          );
        });
    },
    leaveClass(id) {
      Class.leaveClass(id)
        .then((response) => {
          this.openNotificationWithIcon("success", "Leave class successfully ");
          this.getClass();
          // this.listClass = null;
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Leave class failed",
            error.response.data.message
          );
        });
    },
    deleteClass(id) {
      Class.deleteClass(id)
        .then((response) => {
          this.openNotificationWithIcon("success", "Delete class successfully");
          this.getClass();
        })
        .catch((e) => {
          this.openNotificationWithIcon(
            "error",
            "Delete class failed",
            error.response.data.message
          );
        });
    },
    searchClass() {
      const payload = {};
      this.isName
        ? (payload.name = this.txtSearch)
        : (payload.classCode = this.txtSearch);
      if (this.sort === "Cũ nhất") payload.sort = "-createdAt";
      Class.getListClass(payload)
        .then((response) => {
          // this.openNotificationWithIcon("success", "Tìm lớp thành công");
          this.listFullClass = response.data.data;
          this.isSearch = true;
        })
        .catch((e) => {
          this.openNotificationWithIcon(
            "error",
            "Find class failed",
            error.response.data.message
          );
        });
    },
    getClass() {
      Class.getListPersonalClass(this.getToken())
        .then((response) => {
          this.listClass = response.data.data;
        })
        .catch((e) => {});
    },
    initData() {
      this.listClass = this.bakClass;
      this.isSearch = false;
      this.txtTeacherSearch = "";
      this.txtSearch = "";
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
    filterData() {
      // if (this.sort === "old") this.listClass?.reverse();
      // else this.getClass()
      var search = new RegExp(
        this.removeVietnameseTones(this.txtTeacherSearch),
        "i"
      );
      return this.listClass?.filter(
        (item) =>
          search.test(this.removeVietnameseTones(item.name)) ||
          search.test(item.classCode)
      );
    },
    filterFullClassData() {
      // if (this.sort === "old") this.listClass?.reverse();
      // else this.getClass()
      var search = new RegExp(this.removeVietnameseTones(this.txtSearch), "i");
      const studentClassIds = this.listClass?.map((item) => item._id);
      return this.listFullClass?.filter(
        (item) =>
          !studentClassIds.includes(item._id) &&
          (search.test(this.removeVietnameseTones(item.name)) ||
            search.test(item.classCode))
      );
    },
    searchText() {
      return store.state.searchClass;
    },
    _() {
      return _;
    },
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
  },
};
</script>

<style lang="scss">
::-webkit-scrollbar {
  width: 0px;
}
.info {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #fff;
  .initials {
    position: initial;
    width: 40px;
    height: 40px;
    background-color: #fff;
    color: #303030;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  .right {
    flex: 1;
    margin-left: 24px;
    p:nth-child(1) {
      font-size: 14px;
    }
    p:nth-child(2),
    p:nth-child(3) {
      font-size: 12px;
    }
  }
}
.v-window {
  &__next {
    position: absolute;
    right: 0%;
  }
}
</style>
