<template>
  <div>
    <a-card
      :bordered="false"
      class="header-solid h-full"
      style="padding: 10px"
      :bodyStyle="{ padding: 0 }"
    >
      <template #title>
        <a-row style="width: 100%; padding: 10px">
          <div style="display: flex; justify-content: space-between">
            <a-input-search
              placeholder="Search by exercise name"
              v-model="txtSearch"
              style="width: 300px"
            />
            <div style="text-align: end; display: flex">
              <ButtonImportFile @addFile="addFile" style="margin-right: 1rem" />
              <v-btn color="primary" dark @click="handleSubmit"
                >Create Test
              </v-btn>
            </div>
          </div>
        </a-row>
      </template>
      <a-table
        style="max-height : 85vh; overflow-y: scroll; padding :10px"
        v-if="filterData"
        :columns="columns"
        :data-source="filterData"
        :pagination="{
          pageSize: 10,
          total: filterData.length,
        }"
      >
        <template slot="testName" slot-scope="record">
          <h6>{{ record.testName }}</h6>
          <p style="color: gray">{{ record.testDescription }}</p>
        </template>
        <template slot="bookTestName" slot-scope="record">
          <h6>{{ record.bookTestName }}</h6>
        </template>
        <!-- <template slot="totalTests" slot-scope="record">
          <h6>
            {{
              record.listSubjectTest.length ? record.listSubjectTest.length : 0
            }}
          </h6>
        </template> -->
        <template slot="totalQuestions" slot-scope="totalQuestions">
          <h6>{{ totalQuestions }}</h6>
        </template>
        <template slot="totalStudents" slot-scope="totalStudents">
          <h6>{{ totalStudents }}</h6>
        </template>
        <!-- 
        <template slot="totalStudents" slot-scope="totalStudents">
          <h6>{{ totalStudents }}</h6>
        </template> -->

        <template slot="totalTopics" slot-scope="totalTopics">
          <h6>{{ totalTopics }}</h6>
        </template>
        <template slot="testType" slot-scope="testType">
          <div class="author-info">
            <a-tag
              class="tag-status"
              :class="
                testType === 'reading' ? 'ant-tag-danger' : 'ant-tag-primary'
              "
            >
              {{ testType === "reading" ? "Reading" : "Listening" }}
            </a-tag>
          </div>
        </template>
        <template slot="deadline" slot-scope="record">
          <div>
            <h6>
              {{ moment(record.createdAt).format("hh:mm, DD/MM/YYYY") }}
            </h6>
            <h6>
              {{ moment(record.updatedAt).format("hh:mm, DD/MM/YYYY") }}
            </h6>
          </div>
        </template>
        <template slot="createdUser" slot-scope="createdUser">
          <div class="table-avatar-info">
            <a-avatar shape="square" :src="createdUser.avatar" />
            <div class="avatar-info">
              <h6>{{ createdUser.name }}</h6>
              <p>{{ createdUser.email }}</p>
            </div>
          </div>
        </template>
        <template
          slot="action"
          slot-scope="record"
          v-if="
            userProfile.role === 'teacher' ||
            userProfile.role === 'admin' ||
            userProfile.role === 'testCT'
          "
        >
          <a-dropdown>
            <a class="icon-more" @click="(e) => e.preventDefault()">
              <a-icon
                type="more"
                style="font-size: 20px; transform: rotate(90deg)"
            /></a>
            <a-menu slot="overlay">
              <a-menu-item @click="viewDetailTest(record)">
                <a-icon type="eye" /> View Detail
              </a-menu-item>
              <a-menu-item @click="editTest(record)">
                <a-icon type="edit" /> Edit Test
              </a-menu-item>
              <a-menu-item
                v-if="userProfile.role !== 'testCT'"
                @click="addTestToClass(record)"
              >
                <a-icon type="usergroup-add" /> Add Test To Class
              </a-menu-item>
              <a-menu-item
                v-if="userProfile.role !== 'testCT'"
                @click="confirmDelete(record)"
                style="display: flex"
              >
                <a-icon type="delete" style="color: red; margin-top: 5px" />
                <p style="color: red">Delete Test</p>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
        <!-- <template slot="expandedRowRender" slot-scope="record">
          <a-table
            :columns="columns"
            :data-source="record.listSubjectTest ? record.listSubjectTest : []"
            :pagination="{
              pageSize: 5,
              total: record.listSubjectTest.length,
            }"
            rowKey="_id"
            style="background: white; margin-left: -5.4rem"
          >
            <template slot="testName" slot-scope="record">
              <h6>{{ record.testName }}</h6>
              <p style="color: gray">{{ record.testDescription }}</p>
            </template>

            <template slot="totalQuestions" slot-scope="totalQuestions">
              <h6>{{ totalQuestions }}</h6>
            </template>
            <template slot="totalStudents" slot-scope="totalStudents">
              <h6>{{ totalStudents }}</h6>
            </template>
            
        <template slot="totalStudents" slot-scope="totalStudents">
          <h6>{{ totalStudents }}</h6>
        </template>

            <template slot="totalTopics" slot-scope="totalTopics">
              <h6>{{ totalTopics }}</h6>
            </template>
            <template slot="status" slot-scope="isHide">
              <div class="author-info">
                <a-tag
                  class="tag-status"
                  :class="isHide ? 'ant-tag-muted' : 'ant-tag-primary'"
                >
                  {{ isHide ? "Đã ẩn" : "Chưa ẩn" }}
                </a-tag>
              </div>
            </template>
            <template slot="deadline" slot-scope="record">
              <div>
                <h6>
                  {{ moment(record.startDate).format("DD/MM/YYYY") }}
                </h6>
                <h6>
                  {{ moment(record.endDate).format("DD/MM/YYYY") }}
                </h6>
              </div>
            </template>
            <template slot="createdUser" slot-scope="createdUser">
              <div class="table-avatar-info">
                <a-avatar shape="square" :src="createdUser.avatar" />
                <div class="avatar-info">
                  <h6>{{ createdUser.name }}</h6>
                  <p>{{ createdUser.email }}</p>
                </div>
              </div>
            </template>
            <template
              slot="action"
              slot-scope="record"
              v-if="userProfile.role === 'teacher'"
            >
              <a-dropdown>
                <a class="icon-more" @click="(e) => e.preventDefault()">
                  <a-icon
                    type="more"
                    style="font-size: 20px; transform: rotate(90deg)"
                /></a>
                <a-menu slot="overlay">
                  <a-menu-item @click="viewDetailTest(record)">
                    <a-icon type="eye" /> Xem chi tiết
                  </a-menu-item>
                  <a-menu-item @click="editTest(record)">
                    <a-icon type="edit" /> Chỉnh sửa test
                  </a-menu-item>
                  <a-menu-item @click="addTestToClass(record)">
                    <a-icon type="usergroup-add" /> Thêm test vào lớp
                  </a-menu-item>
                  <a-menu-item
                    @click="confirmDelete(record)"
                    style="display: flex"
                  >
                    <a-icon type="delete" style="color: red; margin-top: 5px" />
                    <p style="color: red">Xóa test</p>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>
          </a-table>
        </template> -->
      </a-table>
      <TableLoading v-else />
    </a-card>
    <a-modal
      title="Add test to class"
      :visible="visibleAddClass"
      :confirm-loading="addClassLoading"
      @ok="handleAddTestToClass"
      @cancel="() => (visibleAddClass = false)"
    >
      <div style="padding: 10px">
        <b>Class List</b>
        <a-select
          mode="multiple"
          :size="size"
          placeholder="Choose classes to add test to  "
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
      title="Delete test"
      :visible="visibleDeleteTest"
      :confirm-loading="deleteTestLoading"
      ok-text="Xác nhận"
      cancel-text="Hủy"
      @ok="handleDeleteTest"
      @cancel="() => (visibleDeleteTest = false)"
    >
      Are you sure you want to delete this test?
    </a-modal>
  </div>
</template>

<script>
import { NotificationMixin } from "../../mixin/Notification";
import { LocalStorageMixin } from "../../mixin/LocalStorage";
import TableLoading from "../Base/TableLoading.vue";
import Test from "../../api/Test";
import Class from "../../api/Class";
import ButtonImportFile from "./components/ButtonImportFile.vue";
export default {
  mixins: [NotificationMixin, LocalStorageMixin],
  components: {
    TableLoading,
    ButtonImportFile,
  },

  data() {
    return {
      // Active button for the "Authors" table's card header radio button group.
      authorsHeaderBtns: "all",
      isAdd: false,
      deleteData: null,
      visibleAddClass: false,
      confirmLoading: false,
      txtSearch: "",
      listTest: null,
      selectedClasses: [],
      selectedId: null,
      subjectColumns: [
        {
          title: "Tên môn học",
          key: "name",
          scopedSlots: { customRender: "subject" },
        },
        {
          title: "Số lượng bài kiểm tra",
          key: "totalTests",
          scopedSlots: { customRender: "totalTests" },
        },
      ],
      columns: [
        {
          dataIndex: "",
          key: "testName",
          title: "Test Name",
          scopedSlots: { customRender: "testName" },
        },
        {
          title: "Total Questions",
          dataIndex: "totalQuestions",
          key: "totalQuestions",
          scopedSlots: { customRender: "totalQuestions" },
        },
        {
          dataIndex: "",
          key: "bookTestName",
          title: "Book Test Name",
          scopedSlots: { customRender: "bookTestName" },
        },
        // {
        //   title: "Total Submit",
        //   dataIndex: "totalStudents",
        //   key: "totalStudents",
        //   scopedSlots: { customRender: "totalStudents" },
        // },
        {
          title: "Topic Topics",
          key: "totalTopics",
          dataIndex: "totalTopics",
          scopedSlots: { customRender: "totalTopics" },
        },
        {
          title: "Test Type ",
          key: "testType",
          dataIndex: "testType",
          scopedSlots: { customRender: "testType" },
        },
        {
          title: "Test Creation - Update",
          key: "deadline",
          dataIndex: "",
          scopedSlots: { customRender: "deadline" },
        },
        // {
        //   title: "Tạo bởi ",
        //   key: "createdUser",
        //   dataIndex: "createdUser",
        //   scopedSlots: { customRender: "createdUser" },
        // },
        {
          title: "",
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      size: "default",
      listClass: [],
      page: 1,
      addClassLoading: false,
      visibleDeleteTest: false,
      deleteTestLoading: false,
    };
  },
  mounted() {
    this.userProfile.role !== "admin" && this.userProfile.role !== "teacher"
      ? Test.getListTest(
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
          })
      : Test.getAllTest(
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
    Class.getListClass(
      new URLSearchParams([
        ["limit", 1000],
        ["page", this.page],
      ])
    )
      .then((response) => {
        this.listClass = response.data.data;
      })
      .catch((e) => {
        console.log(e);
      });
  },
  methods: {
    viewDetailTest(payload) {
      this.$router.push({ name: "detailTest", params: { id: payload._id } });
    },
    editTest(payload) {
      this.$router.push({ name: "editTest", params: { id: payload._id } });
    },
    addFile(file) {
      console.log(file);
    },
    handleDeleteTest() {
      this.deleteTestLoading = true;
      Test.deleteTest(this.selectedId)
        .then((response) => {
          this.openNotificationWithIcon("success", "Delete successfully");
          this.deleteTestLoading = false;
          this.visibleDeleteTest = false;
          this.userProfile.role !== "admin" &&
          this.userProfile.role !== "teacher"
            ? Test.getListTest(
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
                })
            : Test.getAllTest(
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
          this.openNotificationWithIcon("error", "Delete fail");
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
          this.openNotificationWithIcon(
            "success",
            "Add test to classes successfully"
          );
          this.visibleAddClass = false;
          this.selectedId = null;
          this.selectedClasses = [];
          this.addClassLoading = false;
          this.userProfile.role !== "admin" &&
          this.userProfile.role !== "teacher"
            ? Test.getListTest(
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
                })
            : Test.getAllTest(
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
  },
  computed: {
    classId() {
      return this.$route.params.id;
    },
    filterData() {
      var search = new RegExp(this.txtSearch, "i");
      return this.listTest?.filter((item) => search.test(item.testName));
    },
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
  },
};
</script>
