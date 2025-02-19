<template>
  <div>
    <a-card
      v-if="filterData"
      :bordered="false"
      class="header-solid h-full responsive-test"
      style="margin-top: 1rem"
      :bodyStyle="{ padding: 0 }"
    >
      <template #title>
        <a-row style="width: 100%">
          <div style="display: flex; justify-content: space-between">
            <a-input-search
              placeholder="Search by exercise name"
              v-model="txtSearch"
              style="width: 300px"
            />
            <div style="text-align: end">
              <!-- <v-btn color="primary" dark @click="handleSubmit"
                >Tạo bài tập
              </v-btn> -->
            </div>
          </div>
        </a-row>
      </template>
      <a-table
        :columns="columns"
        :data-source="filterData"
        :pagination="{
          pageSize: 10,
          total: this.listTest.length,
        }"
        rowKey="_id"
        style="padding: 10px"
      >
        <template slot="testName" slot-scope="record">
          <h6>{{ isBookMode ? record.bookTestName : record.testName }}</h6>
          <p v-if="!isBookMode" style="color: gray">
            {{ record.testDescription }}
          </p>
        </template>

        <template
          v-if="userProfile.role === 'teacher'"
          slot="totalStudents"
          slot-scope="totalStudents"
        >
          <h6>{{ Number(totalStudents) }}</h6>
        </template>
        <template
          v-if="userProfile.role === 'teacher'"
          slot="createdUser"
          slot-scope="createdUser"
        >
          <div class="table-avatar-info">
            <a-avatar shape="square" :src="createdUser.avatar" />
            <div class="avatar-info">
              <h6>{{ createdUser.name }}</h6>
            </div>
          </div>
        </template>
        <template slot="testType" slot-scope="record">
          <a-tag
            class="tag-status ant-tag-primary"
            v-if="record.testType === 'listening'"
          >
            Listening
          </a-tag>
          <a-tag class="tag-status ant-tag-danger" v-else> Reading </a-tag>
        </template>
        <template slot="totalAttempts" slot-scope="record">
          <h6>{{ record.listKeys.length }}</h6>
        </template>
        <template slot="latestScore" slot-scope="record">
          <h6>{{ record.lastScore }}</h6>
        </template>
        <template slot="action" slot-scope="record">
          <a-dropdown>
            <a class="icon-more" @click="(e) => e.preventDefault()">
              <a-icon
                type="more"
                style="font-size: 20px; transform: rotate(90deg)"
            /></a>
            <a-menu slot="overlay">
              <a-menu-item
                v-if="userProfile.role === 'teacher'"
                @click="viewListStudentAnswers(record)"
              >
                <a-icon type="eye" />
                View list submitted
              </a-menu-item>
              <a-menu-item
                v-if="userProfile.role === 'teacher'"
                @click="viewDetailTest(record)"
              >
                <a-icon type="eye" />
                See test
              </a-menu-item>
              <a-menu-item
                v-if="userProfile.role === 'teacher'"
                @click="editTest(record)"
              >
                <a-icon type="edit" />
                Edit test
              </a-menu-item>
              <a-menu-item
                v-if="userProfile.role === 'teacher'"
                @click="doTest(record)"
              >
                <a-icon type="form" /> Do test
              </a-menu-item>
              <a-menu-item
                v-if="userProfile.role === 'teacher'"
                @click="confirmDelete(record)"
              >
                <a-icon type="delete" style="color: red" />
                <span style="color: red">Delete test from class</span>
              </a-menu-item>

              <a-menu-item
                v-if="userProfile.role !== 'teacher'"
                @click="doTest(record)"
              >
                <a-icon type="form" /> Do test
              </a-menu-item>
              <a-menu-item
                v-if="userProfile.role !== 'teacher'"
                @click="viewCurrentStudentAnswers(record)"
              >
                <a-icon type="eye" /> View test results
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </a-table>
    </a-card>
    <TableLoading v-else />
    <a-modal
      title="Add test to class"
      :visible="visibleAddClass"
      :confirm-loading="addClassLoading"
      style="width: 90vw !important"
      @ok="handleAddTestToClass"
      @cancel="() => (visibleAddClass = false)"
    >
      <div style="padding: 10px">
        <b>List of classes</b>
        <a-select
          mode="multiple"
          :size="size"
          placeholder="Select a class to add assignments"
          style="width: 100%; margin-top: 1rem"
          v-model="selectedClasses"
        >
          <a-select-option v-for="item in listClass" :key="item._id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </div>
    </a-modal>
    <a-modal
      title="Remove test from class"
      :visible="visibleDeleteTest"
      :confirm-loading="deleteTestLoading"
      ok-text="Confirm"
      cancel-text="Cancel"
      @ok="handleDeleteTest"
      @cancel="() => (visibleDeleteTest = false)"
    >
      Are you sure to remove test from this class?
    </a-modal>
    <a-modal
      title="Your test results"
      :visible="visibleViewStudentKeys"
      class="responsive-implementer"
      :confirm-loading="deleteTestLoading"
      ok-text="Confirm"
      width="90vw"
      cancel-text="Cancel"
      @cancel="() => (visibleViewStudentKeys = false)"
    >
      <template slot="footer">
        <a-button key="back" @click="() => (visibleViewStudentKeys = false)">
          Back to class
        </a-button>
      </template>
      <TableLoading v-if="studentKeyLoading" />
      <a-table
        style="max-height : 85vh, overflow-y: scroll"
        v-else
        :columns="
          userProfile.role === 'teacher'
            ? studentKeycolumns.filter((item) => item.title !== 'Test attempt')
            : studentKeycolumns.filter((item) => item.title !== 'Creater')
        "
        :data-source="data"
      >
        <template slot="index" slot-scope="record">
          <h6>{{ record.index }}</h6>
        </template>
        <template
          v-if="userProfile.role === 'teacher'"
          slot="takerName"
          slot-scope="createdUser"
        >
          <h6>{{ createdUser.name }}</h6>
        </template>
        <template slot="createdAt" slot-scope="createdAt">
          <h6>{{ moment(createdAt).format("DD/MM/YYYY-HH:mm") }}</h6>
        </template>
        <template slot="totalCorrect" slot-scope="record">
          <h6>{{ record.totalCorrect }} / {{ record.totalQuestions }}</h6>
        </template>
        <p
          v-if="userProfile.role === 'teacher' || isShowPoint"
          slot="expandedRowRender"
          slot-scope="record"
          style="margin: 0;height : 200px, overflow-y: scroll"
        >
          <a-table
            :rowKey="makeid(10)"
            style="height : 200px, overflow-y: scroll"
            :pagination="false"
            :columns="innerStudentKeycolumns"
            :data-source="record.studentKeys ? record.studentKeys : []"
          >
            <template slot="index" slot-scope="record">
              <h6>{{ record.index }}</h6>
            </template>
            <template slot="testKey" slot-scope="record">
              <h6>{{ record.testKey }}</h6>
            </template>
            <template slot="key" slot-scope="record">
              <h6
                v-bind:style="[
                  record.isCorrect ? { color: 'green' } : { color: 'red' },
                ]"
              >
                {{ record.key }}
              </h6>
            </template>
            <template slot="questionType" slot-scope="record">
              <h6>{{ record.questionType }}</h6>
            </template>
          </a-table>
        </p>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { NotificationMixin } from "../../mixin/Notification";
import { LocalStorageMixin } from "../../mixin/LocalStorage";
import TableLoading from "../../components/Base/TableLoading.vue";
import Test from "../../api/Test";
import Quiz from "../../api/Quiz";

import StudentKeys from "../../api/studentKey";
import Class from "../../api/Class";
import StudentKey from "../../api/studentKey";
export default {
  mixins: [NotificationMixin, LocalStorageMixin],
  components: {
    TableLoading,
  },

  data() {
    return {
      // Active button for the "Authors" table's card header radio button group.
      authorsHeaderBtns: "all",
      studentKeys: [],
      isBookMode: false,
      isAdd: false,
      isShowPoint: true,
      deleteData: null,
      visibleAddClass: false,
      confirmLoading: false,
      txtSearch: "",
      studentKeyLoading: false,
      listTest: null,
      selectedClasses: [],
      selectedId: null,
      studentKeycolumns: [
        {
          title: "Test attempt",
          dataIndex: "",
          key: "index",
          scopedSlots: { customRender: "index" },
        },
        {
          title: "Creater",
          dataIndex: "createdUser",
          key: "name",
          scopedSlots: { customRender: "takerName" },
        },
        {
          title: "Date",
          dataIndex: "createdAt",
          key: "createdAt",
          scopedSlots: { customRender: "createdAt" },
        },
        {
          title: "Correct answer",
          dataIndex: "",
          key: "totalCorrect",
          scopedSlots: { customRender: "totalCorrect" },
        },
      ],
      data: [],
      innerStudentKeycolumns: [
        {
          title: "Question",
          dataIndex: "",
          key: "index",
          scopedSlots: { customRender: "index" },
        },

        {
          title: "Your Answer",
          dataIndex: "",
          key: "key",
          scopedSlots: { customRender: "key" },
        },
        {
          title: "Key",
          dataIndex: "",
          key: "testKey",
          scopedSlots: { customRender: "testKey" },
        },
        {
          title: "Question Type",
          dataIndex: "",
          key: "questionType",
          scopedSlots: { customRender: "questionType" },
        },
      ],
      size: "default",
      listClass: [],
      page: 1,
      addClassLoading: false,
      visibleDeleteTest: false,
      deleteTestLoading: false,
      visibleViewStudentKeys: false,
    };
  },
  computed: {
    classId() {
      return this.$route.params.id;
    },
  },
  mounted() {
    Class.getClassById(this.$route.params.id)
      .then((response) => {
        this.loading = false;
        this.isBookMode = response.data.data.bookMode;
      })
      .catch((e) => {
        console.log("e", e);
        this.loading = false;
      });
    Test.getTestByClassId(
      this.classId,
      new URLSearchParams([
        ["limit", 100],
        ["page", this.page],
      ])
    )
      .then((response) => {
        this.listTest = response.data.data.sort((a, b) => {
          const numA = parseInt(a.testName.split(" ")[1]);
          const numB = parseInt(b.testName.split(" ")[1]);
          const charA = a.testName[a.testName.indexOf("-") - 2];
          const charB = b.testName[b.testName.indexOf("-") - 2];
          // If the numeric part is the same, then compare by characters.
          if (numA === numB) {
            return charA.localeCompare(charB);
          }
          // Comp
          // Comparing the numbers for sorting in descending order
          return numB - numA;
        });
      })
      .catch((e) => {
        console.log(e);
      });
    this.userProfile.role === "teacher" || this.userProfile.role === "admin"
      ? StudentKeys.getStudentKeyByClassId({
          classId: this.classId,
        }).then((res) => {
          this.studentKeys = res.data.data;
          this.listTest = this.listTest.map((item) => {
            return {
              ...item,
              totalStudents: this.studentKeys.filter(
                (key) => key.testId === item._id
              ).length,
            };
          });
        })
      : StudentKeys.getStudentKeyByClassAndStudentId({
          classId: this.classId,
          studentId: this.userProfile.id,
        }).then((res) => {
          this.studentKeys = res.data.data;
          this.listTest = this.listTest.map((item) => {
            const studentKeysByTestId = this.studentKeys.filter(
              (key) => key.testId === item._id
            );
            const sortedStudentKey = this.studentKeys
              .filter((key) => key.testId === item._id)
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            return {
              ...item,
              listKeys: studentKeysByTestId,
              lastScore:
                sortedStudentKey && sortedStudentKey.length > 0
                  ? `${sortedStudentKey[0].totalCorrect} /
          ${sortedStudentKey[0].totalQuestions}`
                  : "--",
            };
          });
          console.log(res.data.data);
        });

    Class.getListClass(
      new URLSearchParams([
        ["limit", 1000],
        ["page", this.page],
      ])
    )
      .then((response) => {
        this.listClass = response.data.data.sort((a, b) => {
          return a.testName
            .toLowerCase()
            .localeCompare(b.testName.toLowerCase());
        });
      })
      .catch((e) => {
        console.log(e);
      });
  },
  methods: {
    viewListStudentAnswers(record) {
      this.visibleViewStudentKeys = true;
      this.studentKeyLoading = true;
      const payload = {
        classId: this.classId,
        testId: record._id,
      };
      StudentKey.getStudentKeyByClassAndTestId(payload)
        .then((response) => {
          this.data = response.data.data;
          this.studentKeyLoading = false;
          this.isShowPoint = response.data.test.isShowPoint;
        })
        .catch((e) => {
          this.studentKeyLoading = false;
          console.log(e);
        });
    },
    viewDetailTest(record) {
      this.$router.push({ name: "detailTest", params: { id: record._id } });
    },
    viewCurrentStudentAnswers(record) {
      this.visibleViewStudentKeys = true;
      this.studentKeyLoading = true;
      const payload = {
        classId: this.classId,
        testId: record._id,
      };
      StudentKey.getcurrentStudentKeyByClassAndTestId(payload)
        .then((response) => {
          this.data = response.data.data;
          this.studentKeyLoading = false;
          console.log(response);
          this.isShowPoint = response.data.test.isShowPoint;
        })
        .catch((e) => {
          this.studentKeyLoading = false;
          console.log(e);
        });
    },
    getTotalStudent(id) {
      console.log(id);
      console.log(this.classId);
    },
    editTest(payload) {
      this.$router.push({ name: "editTest", params: { id: payload._id } });
    },
    handleDeleteTest() {
      this.deleteTestLoading = true;
      Quiz.removeTestFromQuiz({
        classId: this.classId,
        quizId: this.selectedId,
      })
        .then((response) => {
          this.openNotificationWithIcon(
            "success",
            "Delete test from class successfully"
          );
          this.deleteTestLoading = false;
          this.visibleDeleteTest = false;
          Test.getTestByClassId(
            this.classId,
            new URLSearchParams([
              ["limit", 100],
              ["page", this.page],
            ])
          )
            .then((response) => {
              this.listTest = response.data.data;
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((err) => {
          this.openNotificationWithIcon(
            "error",
            "Remove test from failed class"
          );
          this.deleteTestLoading = false;
          this.selectedId = null;
          this.visibleDeleteTest = false;
        });
    },
    addTestToClass(payload) {
      this.visibleAddClass = true;
      this.selectedClasses = payload.classIds;
      this.selectedId = payload._id;
    },
    handleAddTestToClass() {
      this.addClassLoading = true;
      Test.updateClassTest(this.selectedId, { classIds: this.selectedClasses })
        .then((response) => {
          this.openNotificationWithIcon("success", "Test update successful");
          this.visibleAddClass = false;
          this.selectedId = null;
          this.selectedClasses = [];
          this.addClassLoading = false;
          Test.getListTest()
            .then((response) => {
              this.listTest = response.data.data.sort((a, b) => {
                const numA = parseInt(a.testName.split(" ")[1]);
                const numB = parseInt(b.testName.split(" ")[1]);
                const charA = a.testName[a.testName.indexOf("-") - 2];
                const charB = b.testName[b.testName.indexOf("-") - 2];
                if (numA === numB) {
                  return charA.localeCompare(charB);
                }
                return numB - numA;
              });
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((err) => {
          this.visibleAddClass = false;
          this.selectedId = null;
          this.selectedClasses = [];
          this.addClassLoading = false;
        });
    },
    confirmDelete(payload) {
      this.visibleDeleteTest = true;
      this.selectedId = payload._id;
    },
    handleSubmit() {
      this.$router.push("/test/add");
    },
    doTest(record) {
      this.$router.push({
        name: "doTest",
        params: { id: this.classId, exerciseId: record._id },
      });
    },
    makeid(length) {
      var result = "";
      var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },
  },
  computed: {
    classId() {
      return this.$route.params.id;
    },
    filterData() {
      return this.listTest?.filter((row) => {
        const testName = row.name.toString().toLowerCase();

        return testName.includes(this.txtSearch.toLowerCase());
      });
    },
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
    columns() {
      return this.userProfile.role === "teacher"
        ? [
            {
              dataIndex: "",
              key: "testName",
              title: "Test",
              scopedSlots: { customRender: "testName" },
            },
            {
              title: "Total submitted",
              dataIndex: "totalStudents",
              key: "totalStudents",
              scopedSlots: { customRender: "totalStudents" },
            },
            {
              title: "Test Type",
              key: "testType",
              dataIndex: "",
              scopedSlots: { customRender: "testType" },
            },
            {
              title: "Created By",
              key: "createdUser",
              dataIndex: "createdUser",
              scopedSlots: { customRender: "createdUser" },
            },
            {
              title: "",
              key: "action",
              scopedSlots: { customRender: "action" },
            },
          ]
        : [
            {
              dataIndex: "",
              key: "testName",
              title: "Test",
              scopedSlots: { customRender: "testName" },
            },
            {
              title: "Latest Score",
              key: "latestScore",
              dataIndex: "",
              scopedSlots: { customRender: "latestScore" },
            },
            {
              title: "Total Attempts",
              key: "totalAttempts",
              dataIndex: "",
              scopedSlots: { customRender: "totalAttempts" },
            },
            {
              title: "Skill(s)",
              key: "testType",
              dataIndex: "",
              scopedSlots: { customRender: "testType" },
            },
            {
              title: "",
              key: "action",
              scopedSlots: { customRender: "action" },
            },
          ];
    },
  },
};
</script>
<style lang="scss"  scoped>
.responsive-implementer {
  width: 1400px;
}
@media only screen and (max-width: 1000px) {
  .responsive-test {
    margin-left: 5%;
  }
  .responsive-implementer {
    width: 100vw;
  }
}
@media only screen and (max-width: 400px) {
  .responsive-test {
    margin-left: 0% !important;
  }
}
@media only screen and (max-width: 500px) and (orientation: portrait) {
}
</style>