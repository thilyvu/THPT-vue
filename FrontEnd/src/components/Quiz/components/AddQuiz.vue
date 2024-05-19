<template>
  <div style="padding: 10px" class="remove-p-mb-container">
    <a-row :gutter="30">
      <a-col :span="8" style="position: fixed">
        <b style="font-size: 24px; text-transform: uppercase"
          >{{quizId ? isViewDetail? 'View detail test' :'Edit test' :  'Create new test' }}</b
        >
        <a-card style="margin-top: 1rem">
          <a-space direction="vertical" style="width: 100%">
            <b>Test name</b>
            <a-input placeholder="Enter test name" v-model="testName" />
            <b>Book Test name</b>
            <a-input placeholder="Enter test name" v-model="bookTestName" />
            <b>Description</b>
            <a-input
              placeholder="Enter description"
              v-model="testDescription"
            />

            <div style="display: flex; justify-content: space-between">
              <div style="display: grid; width: 34%">
                <b>Questions</b>
                <a-select
                  placeholder="Choose the number of questions"
                  v-model="totalQuestions"
                  @change="handleChangeNumberExercise"
                >
                  <a-select-option v-for="item in 10" :key="item" :value="item">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </div>
              <div style="display: grid; width: 60%">
                <b>Choose exercise type</b>
                <a-select placeholder="Choose exercise type" v-model="testType">
                  <a-select-option
                    v-for="item in testTypeOptions"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between">
              <div style="display: grid; width: 40%">
                <b>Time to do the test</b>
                <a-time-picker
                  style="width: 150px; margin-top: 0.5rem"
                  :default-open-value="moment('00:00:00', 'HH:mm:ss')"
                  v-model="countDown"
                  value-format="HH:mm:ss"
                >
                </a-time-picker>
              </div>
              <div style="display: grid; width: 60%">
                <b>Subjects</b>
                <a-select
                  style="width: 100%; margin-top: 0.5rem"
                  placeholder="Please select"
                  show-search
                  :option="subjectData"
                  v-model="subject"
                >
                  <a-select-option
                    v-for="item in subjectData"
                    :key="item._id"
                    :value="item.name"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <div style="display: flex">
              <b>Show marks after submitting assignments</b>
              <v-checkbox
                style="
                  margin-left: 1rem;
                  height: 10px;
                  margin-top: -5px;
                  margin-right: 0.5rem;
                "
                v-model="isShowPoint"
              >
              </v-checkbox>
            </div>
          </a-space>
        </a-card>
        <input
          type="file"
          ref="file"
          style="display: none"
          @change="chooseFile"
        />
        <v-btn
          v-if="!isViewDetail"
          style="width: 100%; margin-top: 10px"
          color="blue-grey"
          class="ma-2 white--text responsive-document-item"
          @click="$refs.file.click()"
        >
          Upload file
          <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>
        <v-btn
          v-if="!isViewDetail"
          color="primary"
          dark
          :loading="createLoading"
          @click="handleSubmit"
          style="width: 100%; margin-top: 10px"
          >{{ quizId ? 'Edit' : 'Create' }} test
        </v-btn>
        <v-btn @click="cancel" style="width: 100%; margin-top: 10px"
          >Cancel
        </v-btn>
      </a-col>
      <a-col :span="8"></a-col>
      <a-col :span="16">
        <a-collapse
          :bordered="false"
          v-for="(question, questionIndex) in listQuestions"
          :key="questionIndex"
          :value="question"
        >
          <template #expandIcon="props">
            <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
          </template>
          <a-collapse-panel
            v-if="question.type === 'question'"
            :key="questionIndex + 1"
            :header="`Question ${indexedQuestions[questionIndex].typeIndex}`"
            style="font-weight: 600"
          >
            <template #extra>
              <div style="display: flex; align-items: center">
                <a-dropdown>
                  <a class="ant-dropdown-link" @click.prevent>
                    <img
                      @click="
                        (e) => {
                          e.stopPropagation();
                        }
                      "
                      style="width: 24px; cursor: pointer; margin-right: 0.5rem"
                      src="../../../assets/add.svg"
                    />
                  </a>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item
                        @click="
                          () => {
                            handleAddMoreQuestion(questionIndex, 'content');
                          }
                        "
                        key="0"
                      >
                        Add content before
                      </a-menu-item>
                      <a-menu-item
                        @click="
                          () =>
                            handleAddMoreQuestion(questionIndex + 1, 'content')
                        "
                        key="1"
                      >
                        Add content after
                      </a-menu-item>
                      <a-menu-item
                        @click="
                          () => handleAddMoreQuestion(questionIndex, 'question')
                        "
                        key="2"
                      >
                        Add question before
                      </a-menu-item>
                      <a-menu-item
                        @click="
                          () =>
                            handleAddMoreQuestion(questionIndex + 1, 'question')
                        "
                        key="3"
                      >
                        Add question after
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
                <a-icon
                  @click="(event) => handleDeleteQuestion(event, questionIndex)"
                  height="2em"
                  width="2em"
                  type="delete"
                  theme="filled"
                  style="font-size: 16px; background: #f5f5f5"
                /></div
            ></template>
            <a-card>
              <b style="margin-bottom: 0.5rem">
                Content </b
              >
              <ckeditor
                class="custom-editor"
                :editor="editor"
                @ready="onReady"
                :config="editorConfig"
                :id="makeid(5)"
                style="margin-top: 0.5rem; margin-bottom: 0.5rem"
                v-model="question.content"
              ></ckeditor>
              <div style="width: 100%; display: grid">
                <b> Type </b>
                <a-select
                  style="width: 350px; margin-top: 5px; margin-bottom: 5px"
                  placeholder="Choose question type"
                  v-model="question.questionTypeName"
                  show-search
                  :option="listQuestionType"
                  @change="(val) => (question.questionType = val)"
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
                  v-model="question.valueForRadio"
                  v-for="(choice, choiceIndex) in question.choices"
                  :key="choiceIndex"
                  @change="
                    (val) => {
                      handleChangeKey(questionIndex, val);
                    }
                  "
                  style="width: 100%"
                >
                  <div
                    v-if="
                      question.currentEditIndex === choiceIndex &&
                      question.isEditing
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
                        v-model="question.newAnswerText"
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
                        @click="() => handleCancelEdit(questionIndex)"
                        src="../../../assets/cancel.svg"
                      />
                      <img
                        @click="
                          () => handleAddChoice(questionIndex, choiceIndex)
                        "
                        style="width: 18px; cursor: pointer"
                        src="../../../assets/check.svg"
                      />
                    </div>
                  </div>
                  <div
                    v-else
                    class="question-container"
                    :class="`${
                      question.currentEditIndex !== choiceIndex
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
                            ? '0px'
                            : 'inherit',
                        }"
                      ></div>
                    </div>
                    <div
                      style="padding: 10px; display: flex; align-items: center"
                    >
                      <b>Correct</b>

                      <a-radio style="margin-left: 1rem" :value="choiceIndex">
                      </a-radio>
                      <a-icon
                        height="2em"
                        width="2em"
                        type="edit"
                        theme="filled"
                        @click="() => handleEdit(questionIndex, choiceIndex)"
                        style="
                          font-size: 16px;
                          margin-left: 10px;
                          margin-right: 10px;
                        "
                      />
                      <a-icon
                        @click="() => question.choices.splice(choiceIndex, 1)"
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
                    @click="() => handleAddNewChoice(questionIndex)"
                    style="width: 200px; margin-top: 10px"
                    >+ Add new choice
                  </v-btn>
                </div>
              </div>
            </a-card>
            <div></div>
          </a-collapse-panel>
          <a-collapse-panel
            v-else
            :key="indexedQuestions[questionIndex].typeIndex+ 100"
            :header="`Content`"
            style="font-weight: 600"
          >
            <template #extra>
              <div style="display: flex; align-items: center">
                <a-dropdown>
                  <a class="ant-dropdown-link" @click.prevent>
                    <img
                      @click="
                        (e) => {
                          e.stopPropagation();
                        }
                      "
                      style="width: 24px; cursor: pointer; margin-right: 0.5rem"
                      src="../../../assets/add.svg"
                    />
                  </a>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item
                        @click="
                          () => {
                            handleAddMoreQuestion(questionIndex, 'content');
                          }
                        "
                        key="0"
                      >
                        Add content before
                      </a-menu-item>
                      <a-menu-item
                        @click="
                          () =>
                            handleAddMoreQuestion(questionIndex + 1, 'content')
                        "
                        key="1"
                      >
                        Add content after
                      </a-menu-item>
                      <a-menu-item
                        @click="
                          () => handleAddMoreQuestion(questionIndex, 'question')
                        "
                        key="2"
                      >
                        Add question before
                      </a-menu-item>
                      <a-menu-item
                        @click="
                          () =>
                            handleAddMoreQuestion(questionIndex + 1, 'question')
                        "
                        key="3"
                      >
                        Add question after
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
                <a-icon
                  @click="(event) => handleDeleteQuestion(event, questionIndex)"
                  height="2em"
                  width="2em"
                  type="delete"
                  theme="filled"
                  style="font-size: 16px; background: #f5f5f5"
                /></div
            ></template>
            <a-card>
              <b style="margin-bottom: 0.5rem">
                Content {{ indexedQuestions[questionIndex].typeIndex + 1 }}</b
              >
              <ckeditor
                class="custom-editor"
                :editor="editor"
                @ready="onReady"
                :config="editorConfig"
                :id="makeid(5)"
                style="margin-top: 0.5rem; margin-bottom: 0.5rem"
                v-model="question.content"
              ></ckeditor>
            </a-card>
            <div></div>
          </a-collapse-panel>
        </a-collapse>
        <div>
          <a-dropdown>
            <v-btn depressed small style="width: 200px; margin-top: 10px"
              >+ Add new question
            </v-btn>
            <template #overlay>
              <a-menu>
                <a-menu-item
                  @click="
                    () => {
                      handleAddMoreQuestion(listQuestions.length, 'question');
                    }
                  "
                  key="0"
                >
                  Add new question
                </a-menu-item>
                <a-menu-item @click="() => handleAddNewQuestion()" key="1">
                  Add old question
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>

        <a-modal
          title="Chọn câu hỏi"
          :visible="visibleAddQuestion"
          ok-text="Xác nhận"
          width="1000px"
          cancel-text="Hủy"
          @ok="() => handleAddQuestion()"
          @cancel="() => (visibleAddQuestion = false)"
        >
          <SelectMultipleQuestion @changeQuestion="handleChangeQuestion" />
        </a-modal>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { VueEditor } from "vue2-quill-editor";
import { NotificationMixin } from "../../../mixin/Notification";
import { FirebaseStorageMixin } from "../../../mixin/FirebaseStorage";
import QuestionType from "../../../api/QuestionType";
import Quiz from "../../../api/Quiz";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import mammoth from "mammoth";
import QuestionBank from "../../../api/QuestionBank";

import MasterData from "../../../api/MasterData";
import CKEditor from "@ckeditor/ckeditor5-vue2";

import { MyUploadAdapter } from "../../Lesson/AddLessonModal.vue";
import SelectMultipleQuestion from "./SelectMultipleQuestion.vue";

export default {
  mixins: [NotificationMixin, FirebaseStorageMixin],
  components: {
    VueEditor,
    ckeditor: CKEditor.component,
    SelectMultipleQuestion,
  },
  data() {
    return {
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
      testName: "",
      bookTestName: "",
      testDescription: "",
      listQuestions: [],
      listQuestionType: [],
      listQuestionAdded: [],
      listQuiz: [],
      answerText: "",
      listSelectedQuestion: [],
      randomString: Math.random()
        .toString(36)
        .replace(/[^#a-z]+/g, "")
        .substr(0, 5),
      valueForRadio: 0,
      totalQuestions: null,
      subject: "",
      oldTotalQuestion: null,
      isShowPoint: false,
      subjectData: [],
      visibleAddQuestion: false,
      createLoading: false,
      numberOfQuestions: Array.from(Array(100).keys()),
      newTestName: "",
      isShowPoint: false,
      createLoading: false,
      countDown: null,
      testType: "",
      testTypeOptions: [
        { value: "practice", label: "Practice" },
        { value: "mockTest", label: "Mock Test" },
      ],
    };
  },
  mounted() {
    MasterData.getSubject()
      .then((response) => {
        this.subjectData = response.data.data;
      })
      .catch((e) => {
        console.log("e", e);
      });
    QuestionType.getListQuestionType()
      .then((response) => {
        this.listQuestionType = response.data.data;
      })
      .catch((e) => {
        console.log("e", e);
      });
    Quiz.getListQuiz()
      .then((response) => {
        this.listQuiz = response.data.data
      })
      .catch((e) => {
        console.log("e", e);
      });
      const labels = ["A", "B", "C", "D"];

      Quiz.getQuizById(this.$route.params.id)
      .then((response) => {
        const data = response.data.data;
        this.testName = data.name;
        this.bookTestName = data.bookTestName;
        this.testDescription = data.testDescription;
        this.totalQuestions = data.quizzes.length;
        this.listQuestions = data.quizzes.map((item) => ({
          ...item,
          type : item.type || "question",
          valueForRadio: labels.findIndex((label) => label === item.key)
        }));
        this.subject =  data.subject;
        this.isShowPoint = data.isShowPoint ? data.isShowPoint : false;
        this.countDown = data.countDownTime ? data.countDownTime : null;
        this.loading = false;
        this.subject = data.subject ? data.subject : "";
        this.testType = data.testType ? data.testType : "";
      
      })
      .catch((e) => {
        console.log("e", e);
        this.loading = false;
      });
  },
  computed: {
    isViewDetail() {
      return this.$route.params.id && window.location.href.includes('detail');
    },
    quizId() {
      console.log(this.$route.params.id)

      return this.$route.params.id;
    },
    indexedQuestions() {
      let questionCount = 0;
      let contentCount = 0;
      return this.listQuestions.map((question, index) => ({
        ...question,
        typeIndex: question.type === 'question' ? ++questionCount : contentCount++
        }),
      );
    },
  },
  methods: {
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
    handleDeleteQuestion(event, questionIndex) {
      event.stopPropagation();

      this.listQuestions.splice(questionIndex, 1);
      this.totalQuestions = this.listQuestions.length;
      this.oldTotalQuestion = this.listQuestions.length;
    },
    isValidQuestionSegment(segment) {
      const labels = ["A", "B", "C", "D"];
      return labels.every((label) => segment.includes(label));
    },

    convertDocxToHtml(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const style_map = "u => em";
        reader.onload = () => {
          const arrayBuffer = reader.result;
          mammoth
            .convertToHtml(
              { arrayBuffer: arrayBuffer },
              { styleMap: style_map }
            )
            .then((result) => {
              resolve(result.value);
            })
            .catch((error) => {
              reject(error);
            });
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsArrayBuffer(file);
      });
    },
    handleAddMoreQuestion(questionIndex, type) {
      const question = {
        content: "",
        questionNumber: "",
        choices: [{ choiceContent: "" }],
        key: "",
        newAnswerText: "",
        valueForRadio: 0,
        isEditing: true,
        currentEditIndex: 0,
        questionType: "",
        type,
      };
      this.listQuestions.splice(questionIndex, 0, question);
    },
    handleChangeQuestion(val) {
      this.listSelectedQuestion = val.questionIds.map((item) => ({
        ...val.questions.find((question) => question._id === item),
        type: "question",
      }));
    },
    chooseFile(event) {
      const file = event.target.files[0];
      this.convertDocxToHtml(file)
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const paragraphs = doc.querySelectorAll("p");
          let groupOfString = [];
          let stringConcat = "";
          for (let i = 0; i < paragraphs.length; i++) {
            stringConcat = stringConcat.concat(paragraphs[i].innerHTML);
            if (this.isValidQuestionSegment(stringConcat)) {
              groupOfString.push(stringConcat);
              stringConcat = "";
            }
          }
          groupOfString.map((item) => {
            const string = item
              .replaceAll("<strong>", "<b>")
              .replaceAll("</strong>", "</b>");
            const questionNumber = string
              .substring(3, string.indexOf(":"))
              .trim();

            const questionContentStartIndex = string.indexOf(":") + 1;
            const questionContentEndIndex = string.indexOf("A");
            const questionContent = string
              .substring(questionContentStartIndex, questionContentEndIndex)
              .trim();

            const choicesStartIndex = questionContentEndIndex + 1;
            const choicesEndIndexA = string.indexOf("B");
            const choicesA = string
              .substring(choicesStartIndex, choicesEndIndexA)
              .trim();
            const choicesStartIndexB = choicesEndIndexA + 1;
            const choicesEndIndexB = string.indexOf("C");
            const choicesB = string
              .substring(choicesStartIndexB, choicesEndIndexB)
              .trim();

            const choicesStartIndexC = choicesEndIndexB + 1;
            const choicesEndIndexC = string.indexOf("D");
            const choicesC = string
              .substring(choicesStartIndexC, choicesEndIndexC)
              .trim();

            const choicesStartIndexD = choicesEndIndexC + 1;
            const choicesD = string.substring(choicesStartIndexD).trim();
            this.listQuestions.push({
              content: questionContent,
              questionNumber: questionNumber,
              choices: [
                {
                  choiceContent: choicesA,
                },
                {
                  choiceContent: choicesB,
                },
                {
                  choiceContent: choicesC,
                },
                {
                  choiceContent: choicesD,
                },
              ],
              key: "",
              type: "question",
              newAnswerText: "",
              isEditing: false,
              valueForRadio: 0,
              currentEditIndex: null,
              questionType: "",
            });
            this.totalQuestions = this.listQuestions.length;
            this.oldTotalQuestion = this.listQuestions.length;
          });
        })
        .catch((error) => {
          console.error("Error converting DOCX to HTML:", error);
        });
      this.fileName = event.target.files[0].name;
      this.fileSize = event.target.files[0].size;
    },
    handleAddNewChoice(questionIndex) {
      this.listQuestions[questionIndex].choices.push({ choiceContent: "" });
      this.listQuestions[questionIndex].isEditing = true;
      this.listQuestions[questionIndex].currentEditIndex =
        this.listQuestions[questionIndex].choices.length - 1;
    },
    handleSearch(val) {
      this.numberOfQuestions = Array.from(Array(100).keys());
      this.numberOfQuestions = this.numberOfQuestions.filter((item) =>
        (item + 1).toString().includes(val)
      );
    },
    getEditorConfig(showToolbar) {
      if (showToolbar) {
        return this.editorConfig;
      } else {
        return { toolbar: null }; // Hide toolbar when container is hidden
      }
    },
    addNewQuiz() {
      this.listQuiz.push({
        key: this.newTestName,
        value: this.newTestName,
      });
      this.testName = this.newTestName;
      this.newTestName = "";
    },
    handleChangeQuizSelect(val) {
      this.newTestName = val;
      return this.listQuiz.filter((item) =>
        item.name.toLowerCase().includes(val.toLowerCase())
      );
    },
    handleChangeNumberExercise(val) {
      if (val < 0) return;
      const diff = val - this.oldTotalQuestion;
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          const question = {
            content: "",
            questionNumber: "",
            choices: [{ choiceContent: "" }],
            key: "",
            newAnswerText: "",
            valueForRadio: 0,
            isEditing: true,
            currentEditIndex: 0,
            questionType: "",
            type: "question",
          };
          this.listQuestions.push(question);
        }
      } else if (diff < 0) {
        this.listQuestions.splice(val, -diff);
      }

      this.oldTotalQuestion = val;
    },
    handleEdit(questionIndex, choiceIndex) {
      this.listQuestions[questionIndex].isEditing = true;
      this.listQuestions[questionIndex].currentEditIndex = choiceIndex;
      this.listQuestions[questionIndex].newAnswerText =
        this.listQuestions[questionIndex].choices[choiceIndex].choiceContent;
    },
    handleAddQuestion() {
      this.visibleAddQuestion = false;
      this.listQuestions = this.listSelectedQuestion;
    },
    handleAddChoice(questionIndex, choiceIndex) {
      this.listQuestions[questionIndex].choices[choiceIndex].choiceContent =
        this.listQuestions[questionIndex].newAnswerText;
      this.listQuestions[questionIndex].isEditing = false;

      this.listQuestions[questionIndex].newAnswerText = "";
      this.listQuestions[questionIndex].currentEditIndex = null;
    },
    handleCancelEdit(questionIndex) {
      this.listQuestions[questionIndex].isEditing = false;
      this.listQuestions[questionIndex].newAnswerText = "";
    },
    handleAddAnswer(val, question, listAnswers) {
      listAnswers.push(question.newAnswerText);
      this.totalQuestions = this.listQuestions.filter((item) => item.type)
      question.newAnswerText = "";
    },

    async createMultipleQuestion(testId) {
      const keys = ["A", "B", "C", "D", "E"];
      this.createLoading = true;

      const buildQuestionObject = (question, index) => ({
        ...(question.content ? { content: question.content } : {}),
        questionNumber: question.questionNumber || (index + 1).toString(),
        choices: question.choices,
        key: keys[question.valueForRadio],
        ...(question.questionType ? { questionType: question.questionType } : {}),
        testId: testId,
      });

      try {
        const addedQuestions = await Promise.all(
          this.listQuestions.map(async (question, index) => {
            if (question.type !== 'content') {
              const questionObj = buildQuestionObject(question, index);
              try {
                const response = question._id ? 
                  await QuestionBank.updateQuestionBank(question._id, questionObj) :
                  await QuestionBank.createQuestionBank(questionObj);
                return { ...response.data.questionBank, originalIndex: index };
              } catch (error) {
                console.error("Error processing question:", error.response?.data?.message || error);
                throw new Error(error.response?.data?.message || "Failed to process question");
              }
            } else {
              return { ...question, originalIndex: index };
            }
          })
        );
        console.log(addedQuestions);
        addedQuestions.sort((a, b) => a.originalIndex - b.originalIndex);
        await Quiz.updateQuiz(testId, { quizzes: addedQuestions });
        this.openNotificationWithIcon("success", "All questions created successfully!");
        this.$router.push("/quiz");
      } catch (error) {
        console.error("Error in creating/updating questions:", error.message);
        this.openNotificationWithIcon("error", "Error in operation", error.message);
      } finally {
        this.createLoading = false;
      }
    },

    async handleSubmit() {
      this.createLoading = true;
      let testId = "";
      if (!this.testName) {
        return;
      } else {
        testId = this.listQuiz && this.listQuiz.find((quiz) => quiz.name === this.testName)
          ? this.listQuiz  && this.listQuiz.find((quiz) => quiz.name === this.testName)._id
          : null;
        if (!testId) {
          Quiz.createQuiz({
            name: this.testName,
            ...(this.bookTestName !== ""
              ? {
                  bookTestName: this.bookTestName,
                }
              : {}),
            ...(this.testDescription !== ""
              ? {
                  testDescription: this.testDescription,
                }
              : {}),
            ...(this.countDown
              ? {
                  countDownTime: this.countDown,
                }
              : {}),
            startDate: this.testDate ? this.testDate[0]._d : new Date(),
            endDate: this.testDate ? this.testDate[1]._d : new Date(),
            testType: this.testType,
            isShowPoint: this.isShowPoint,
            ...(this.subject !== ""
              ? {
                subject: this.subject,
                }
              : {}),
          }).then((val) => {
            console.log(val.data);
            const testId = val.data.quiz._id;
            this.createMultipleQuestion(testId);
          });
        } else {
          this.createMultipleQuestion(testId);
        }
      }
    },
    handleAddNewQuestion() {
      this.visibleAddQuestion = true;
      // this.listQuestions.push({
      //   content: "",
      //   questionNumber: "",
      //   choices: [{ choiceContent: "" }],
      //   key: "",
      //   newAnswerText: "",
      //   valueForRadio: 0,
      //   isEditing: true,
      //   questionType: "",
      //   currentEditIndex: 0,
      //   type: "question",
      // });
      // this.totalQuestions = this.listQuestions.length;
    },
    filterOption(input, option) {
      console.log(input, option);
      return this.listQuiz.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    handleChangeKey(questionIndex, key) {
      this.listQuestions[questionIndex].valueForRadio = key.target.value;
    },
    handleChange(val) {
      this.testName = val;
    },
    cancel() {
      // this.openNotificationWithIcon("error", "Cancel create new test");
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped >
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
