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
              placeholder="Search by question test id "
              v-model="txtSearch"
              style="width: 300px"
            />
            <div style="text-align: end; display: flex">
              <!-- <ButtonImportFile @addFile="addFile" style="margin-right: 1rem" /> -->
              <v-btn color="primary" dark @click="handleSubmit"
                >Create Question
              </v-btn>
            </div>
          </div>
        </a-row>
      </template>
      <a-table
        style="max-height: 85vh; overflow-y: scroll; padding: 10px"
        v-if="filterData"
        :columns="columns"
        :data-source="filterData"
        :pagination="{
          pageSize: 10,
          total: filterData.length,
        }"
      >
        <template slot="questionNumber" slot-scope="record">
          <h6>{{ record.questionNumber }}</h6>
          <!-- <p style="color: gray">{{ record.testDescription }}</p> -->
        </template>
        <template slot="quizName" slot-scope="record">
          <h6>{{ record.quizzes.map((item) => item.name).join(", ") }}</h6>
        </template>
        <template slot="key" slot-scope="record">
          <h6>{{ record.answer }}</h6>
        </template>
        <template slot="totalStudents" slot-scope="totalStudents">
          <h6>{{ totalStudents }}</h6>
        </template>
        <template slot="totalTopics" slot-scope="totalTopics">
          <h6>{{ totalTopics }}</h6>
        </template>
        <template slot="questionType" slot-scope="questionType">
          <div class="author-info">
            {{ questionType }}
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
              <!-- <a-menu-item @click="viewDetailTest(record)">
                <a-icon type="eye" /> View Detail
              </a-menu-item> -->
              <a-menu-item @click="editQuestion(record)">
                <a-icon type="edit" /> Edit question
              </a-menu-item>
              <!-- <a-menu-item
                v-if="userProfile.role !== 'testCT'"
                @click="addTestToClass(record)"
              >
                <a-icon type="usergroup-add" /> Add question To test
              </a-menu-item> -->
              <a-menu-item
                v-if="userProfile.role !== 'testCT'"
                @click="confirmDelete(record)"
                style="display: flex"
              >
                <a-icon type="delete" style="color: red; margin-top: 5px" />
                <p style="color: red; margin-bottom: unset">Delete question</p>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
        <template slot="expandedRowRender" slot-scope="record">
          <div>
            <div style="display: flex">
              <b style="margin-bottom: 0.5rem; margin-right: 0.5rem">
                Content :
              </b>
              <p v-html="record.content"></p>
            </div>
            <div style="margin-top: -0.5rem">
              <div
                v-for="(choice, choiceIndex) in record.choices"
                :key="choice.choiceContent"
                style="display: flex"
              >
                <b style="margin-right: 0.5rem">{{
                  formatStartOfQuestion(choiceIndex)
                }}</b>
                <div v-html="choice.choiceContent"></div>
              </div>
            </div>
          </div>
        </template>
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
      title="Delete question"
      :visible="visibleDeleteQuestion"
      :confirm-loading="deleteQuestionLoading"
      ok-text="Confirm"
      cancel-text="Cancel"
      @ok="handleDeleteTest"
      @cancel="() => (visibleDeleteQuestion = false)"
    >
      Are you sure you want to delete this question?
    </a-modal>

    <a-modal
      title="Edit question"
      :visible="visibleEditQuestion"
      :confirm-loading="editQuestionLoading"
      ok-text="Confirm"
      cancel-text="Cancel"
      :width="900"
      @ok="handleEditQuestion"
      @cancel="() => (visibleEditQuestion = false)"
    >
      <div v-if="currentQuestion">
        <b style="margin-bottom: 0.5rem"> Content</b>
        <ckeditor
          class="custom-editor"
          :editor="editor"
          @ready="onReady"
          :config="editorConfig"
          :id="makeid(5)"
          style="margin-top: 0.5rem; margin-bottom: 0.5rem"
          v-model="currentQuestion.content"
        ></ckeditor>
        <div style="width: 100%; display: grid">
          <b> Type </b>
          <a-select
            style="width: 350px; margin-top: 5px; margin-bottom: 5px"
            placeholder="Choose question type"
            v-model="currentQuestion.questionTypeName"
            show-search
            :option="listQuestionType"
            @change="(val) => (currentQuestion.questionTypeName = val)"
          >
            <a-select-option
              v-for="questionType in listQuestionType"
              :key="questionType._id"
              :value="questionType.questionTypeName"
            >
              {{ questionType.questionTypeName }}
            </a-select-option>
          </a-select>
        </div>
        <b style="margin-bottom: 0.5rem"> Choices</b>
        <div>
          <a-radio-group
            v-model="currentQuestion.valueForRadio"
            v-for="(choice, choiceIndex) in currentQuestion.choices"
            :key="choiceIndex"
            @change="
              (val) => {
                handleChangeKey(val);
              }
            "
            style="width: 100%"
          >
            <div
              v-if="
                currentQuestion.currentEditIndex === choiceIndex &&
                currentQuestion.isEditing
              "
              style="display: flex; justify-content: space-between"
            >
              <div style="width: 93%">
                <ckeditor
                  class="custom-editor"
                  :editor="editor"
                  @ready="() => {}"
                  :config="editorConfig"
                  :id="makeid(5)"
                  style="margin-top: 0.5rem; margin-bottom: 0.5rem"
                  v-model="currentQuestion.newAnswerText"
                ></ckeditor>
              </div>
              <div
                style="
                  width: 7%;
                  display: flex;
                  align-items: center;
                  text-align: end;
                  justify-content: space-around;
                "
              >
                <img
                  style="width: 14px; cursor: pointer"
                  @click="() => handleCancelEdit()"
                  src="../../assets/cancel.svg"
                />
                <img
                  @click="() => handleAddChoice(choiceIndex)"
                  style="width: 18px; cursor: pointer"
                  src="../../assets/check.svg"
                />
              </div>
            </div>
            <div
              v-else
              class="question-container"
              :class="`${
                currentQuestion.currentEditIndex !== choiceIndex
                  ? 'remove-tool-bar'
                  : ''
              }`"
            >
              <div
                style="
                  padding: 10px;
                  max-width: 80%;
                  display: flex;
                  align-items: center;
                "
              >
                <b>
                  {{ `${formatStartOfQuestion(choiceIndex)}. ` }}
                </b>
                <div
                  v-html="choice.choiceContent"
                  :style="{
                    marginLeft: '0.3rem',
                    marginBottom: choice.choiceContent.includes('<p>')
                      ? '-1em'
                      : 'inherit',
                  }"
                ></div>
              </div>
              <div style="padding: 10px; display: flex; align-items: center">
                <b>Correct</b>

                <a-radio style="margin-left: 1rem" :value="choiceIndex">
                </a-radio>
                <a-icon
                  height="2em"
                  width="2em"
                  type="edit"
                  theme="filled"
                  @click="() => handleEdit(choiceIndex)"
                  style="font-size: 16px; margin-left: 10px; margin-right: 10px"
                />
                <a-icon
                  @click="() => currentQuestion.choices.splice(choiceIndex, 1)"
                  height="2em"
                  width="2em"
                  type="delete"
                  theme="filled"
                  style="font-size: 16px; background: #f5f5f5"
                />
              </div>
            </div>
          </a-radio-group>

          <div>
            <v-btn
              depressed
              small
              @click="() => handleAddNewChoice()"
              style="width: 200px; margin-top: 10px"
              >+ Add new choice
            </v-btn>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { NotificationMixin } from "../../mixin/Notification";
import { LocalStorageMixin } from "../../mixin/LocalStorage";
import TableLoading from "../Base/TableLoading.vue";
import Test from "../../api/Test";
import QuestionType from "../../api/QuestionType";

import QuestionBank from "../../api/QuestionBank";
import CKEditor from "@ckeditor/ckeditor5-vue2";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import Class from "../../api/Class";
import ButtonImportFile from "./components/ButtonImportFile.vue";
export default {
  mixins: [NotificationMixin, LocalStorageMixin],
  components: {
    TableLoading,
    ButtonImportFile,
    ckeditor: CKEditor.component,
  },

  data() {
    return {
      authorsHeaderBtns: "all",
      editor: DecoupledEditor,
      editorConfig: {
        toolbar: {
          items: [
            "heading",
            "|",
            "alignment",
            "|",
            "fontColor",
            "fontBackgroundColor",
            "|",
            "bold",
            "italic",
            "strikethrough",
            "underline",
            "subscript",
            "superscript",
            "|",
            "link",
            "|",
            "outdent",
            "indent",
            "|",
            "bulletedList",
            "numberedList",
            "todoList",
            "|",
            "code",
            "codeBlock",
            "|",
            "insertTable",
            "uploadImage",
            "|",
            // "undo",
            // "redo",
            // "fontfamily",
            "fontsize",
            "|",
          ],
          shouldNotGroupWhenFull: true,
        },
      },
      isAdd: false,
      deleteData: null,
      visibleAddClass: false,
      editQuestionLoading: false,
      visibleEditQuestion: false,
      currentQuestion: null,
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
          key: "quizName",
          title: "Test name",
          scopedSlots: { customRender: "quizName" },
        },
        {
          dataIndex: "",
          key: "questionNumber",
          title: "Question Number",
          scopedSlots: { customRender: "questionNumber" },
        },
        {
          title: "Key",
          dataIndex: "",
          key: "key",
          scopedSlots: { customRender: "key" },
        },
        {
          title: "Question Type ",
          key: "questionType",
          dataIndex: "questionTypeName",
          scopedSlots: { customRender: "questionType" },
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
      visibleDeleteQuestion: false,
      deleteQuestionLoading: false,
    };
  },
  mounted() {
    QuestionBank.getListQuestionBank(
      new URLSearchParams([
        ["limit", 20],
        ["page", this.page],
      ])
    )
      .then((response) => {
        this.listTest = response.data.data;
      })
      .catch((e) => {
        console.log(e);
      });
    QuestionType.getListQuestionType()
      .then((response) => {
        this.listQuestionType = response.data.data;
      })
      .catch((e) => {
        console.log("e", e);
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
    onReady(editor) {
      editor.ui
        .getEditableElement()
        .parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
        );
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader);
      };
    },
    handleChangeKey(key) {
      this.currentQuestion.valueForRadio = key.target.value;
    },
    handleAddNewChoice() {
      this.currentQuestion.choices.push({ choiceContent: "" });
      this.currentQuestion.isEditing = true;
      this.currentQuestion.currentEditIndex =
        this.currentQuestion.choices.length - 1;
    },
    handleCancelEdit() {
      this.visibleEditQuestion = false;
      this.currentQuestion = null;
    },
    handleEdit(choiceIndex) {
      this.currentQuestion.isEditing = true;
      this.currentQuestion.currentEditIndex = choiceIndex;
      this.currentQuestion.newAnswerText =
        this.currentQuestion.choices[choiceIndex].choiceContent;
    },
    editQuestion(payload) {
      this.visibleEditQuestion = true;
      let answerText = ["A", "B", "C", "D", "E"];
      this.currentQuestion = {
        ...payload,
        valueForRadio: answerText.findIndex((item) => item === payload.answer),
        isEditing: false,
        currentEditIndex: 0,
        newAnswerText: "",
      };
    },
    addFile(file) {
      console.log(file);
    },
    handleAddChoice(choiceIndex) {
      this.currentQuestion.choices[choiceIndex].choiceContent =
        this.currentQuestion.newAnswerText;
      this.currentQuestion.isEditing = false;

      this.currentQuestion.newAnswerText = "";
      this.currentQuestion.currentEditIndex = null;
    },
    handleDeleteTest() {
      this.deleteQuestionLoading = true;
      QuestionBank.deleteQuestionBank(this.selectedId)
        .then((response) => {
          this.openNotificationWithIcon("success", "Delete successfully");
          this.deleteQuestionLoading = false;
          this.visibleDeleteQuestion = false;

          QuestionBank.getListQuestionBank(
            new URLSearchParams([
              ["limit", 20],
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
          this.deleteQuestionLoading = false;
          this.selectedId = null;
          this.visibleDeleteQuestion = false;
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
    handleEditQuestion() {
      let keys = ["A", "B", "C", "D", "E"];
      this.editQuestionLoading = true;
      QuestionBank.updateQuestionBank(this.currentQuestion._id, {
        content: this.currentQuestion.content,
        questionNumber: this.currentQuestion.questionNumber,
        choices: this.currentQuestion.choices,
        key: keys[this.currentQuestion.valueForRadio],
        questionType: this.listQuestionType.find(
          (item) =>
            item.questionTypeName === this.currentQuestion.questionTypeName
        )._id,
        questionTypeName: this.currentQuestion.questionTypeName,
      })
        .then(() => {
          QuestionBank.getListQuestionBank(
            new URLSearchParams([
              ["limit", 20],
              ["page", this.page],
            ])
          )
            .then((response) => {
              this.listTest = response.data.data;
            })
            .catch((e) => {
              console.log(e);
            });
          this.openNotificationWithIcon("success", "Edit successfully");
          this.visibleEditQuestion = false;
          this.editQuestionLoading = false;
        })
        .catch((err) => {
          this.openNotificationWithIcon("error", "Edit fail");
          this.editQuestionLoading = false;
          this.visibleEditQuestion = false;
        });
    },
    confirmDelete(payload) {
      this.visibleDeleteQuestion = true;
      this.selectedId = payload._id;
    },
    handleSubmit() {
      this.$router.push("/questionBank/add");
    },
  },
  computed: {
    classId() {
      return this.$route.params.id;
    },
    filterData() {
      var search = new RegExp(this.txtSearch, "i");
      return this.listTest
        ?.filter((item) => search.test(item.testName))
        .map((item) => ({ ...item, key: item._id, answer: item.key }));
    },
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
  },
};
</script>
<style scoped>
#editor {
  height: 200px;
}
.custom-editor {
  border: 0.5px solid #ccced1;
}
.question-container {
  display: flex;
  justify-content: space-between;
  background: #f5f5f5;
  border-radius: 5px;
  padding: 8px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.remove-p-mb-container p {
  margin-bottom: 0 !important;
}
</style>
