<template>
  <div style="padding: 10px" class="remove-p-mb-container">
    <a-row :gutter="30">
      <a-col :span="8" style="position: fixed">
        <b style="font-size: 24px; text-transform: uppercase"
          >Create new questions</b
        >
        <a-card style="margin-top: 1rem">
          <a-space direction="vertical" style="width: 100%">
            <b>Test</b>
            <!-- <a-input placeholder="Enter test name" v-model="testName" /> -->
            <a-select
              :value="testName"
              show-search
              placeholder="Choose quiz"
              style="width: 100%"
              @change="handleChange"
              @search="(val) => handleChangeQuizSelect(val)"
            >
              <a-select-option
                v-for="quiz in listQuiz"
                :value="quiz.name"
                :key="quiz._id"
              >
                {{ quiz.name }}
              </a-select-option>
              <template #notFoundContent>
                <span @click="() => addNewQuiz()" style="cursor: pointer">{{
                  newTestName
                }}</span>
              </template>
            </a-select>
            <div style="display: flex; justify-content: space-between">
              <div style="display: grid; width: 100%">
                <b style="margin-bottom: 0.5rem"
                  >Choose the number of questions</b
                >
                <a-select
                  placeholder="Choose the number of questions"
                  v-model="totalQuestions"
                  show-search
                  @search="handleSearch"
                  @change="handleChangeNumberExercise"
                  :filter-option="false"
                >
                  <a-select-option
                    v-for="item in numberOfQuestions"
                    :key="item + 1"
                    :value="item + 1"
                  >
                    {{ item + 1 }}
                  </a-select-option>
                </a-select>
              </div>
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
          style="width: 100%; margin-top: 10px"
          color="blue-grey"
          class="ma-2 white--text responsive-document-item"
          @click="$refs.file.click()"
        >
          Upload file
          <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>
        <v-btn
          color="primary"
          dark
          :loading="createLoading"
          @click="handleSubmit"
          style="width: 100%; margin-top: 10px"
          >Create questions
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
            :key="questionIndex + 1"
            :header="`Question ${questionIndex + 1}`"
            style="font-weight: 600"
          >
            <template #extra>
              <div style="display: flex; align-items: center">
                <img
                  style="width: 24px; cursor: pointer; margin-right: 0.5rem"
                  @click="
                    (event) => handleAddMoreQuestion(event, questionIndex + 1)
                  "
                  src="../../../assets/add.svg"
                />
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
                Content {{ questionIndex + 1 }}</b
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
                  v-model="question.questionType"
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
                            ? '-1em'
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
        </a-collapse>
        <div>
          <v-btn
            depressed
            small
            @click="() => handleAddNewQuestion(questionIndex)"
            style="width: 200px; margin-top: 10px"
            >+ Add new question
          </v-btn>
        </div>
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
export default {
  mixins: [NotificationMixin, FirebaseStorageMixin],
  components: {
    VueEditor,
    ckeditor: CKEditor.component,
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
      listQuestions: [],
      listQuestionType: [],
      listQuiz: [],
      answerText: "",
      randomString: Math.random()
        .toString(36)
        .replace(/[^#a-z]+/g, "")
        .substr(0, 5),
      valueForRadio: 0,
      totalQuestions: null,
      oldTotalQuestion: null,
      isShowPoint: false,
      createLoading: false,
      numberOfQuestions: Array.from(Array(100).keys()),
      newTestName: "",
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
        this.listQuiz = response.data.data;
      })
      .catch((e) => {
        console.log("e", e);
      });
  },
  computed: {},
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
    handleAddMoreQuestion(event, questionIndex) {
      event.stopPropagation();
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
      };
      this.listQuestions.splice(questionIndex, 0, question);
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
      question.newAnswerText = "";
    },

    async createMultipleQuestion(testId) {
      const keys = ["A", "B", "C", "D", "E"];

      await Promise.all(
        this.listQuestions.map(async (question) => {
          try {
            const questionForInsert = {
              ...(question.content !== ""
                ? {
                    content: question.content,
                  }
                : {}),
              questionNumber: question.questionNumber,
              choices: question.choices,
              key: keys[question.valueForRadio],
              questionType: this.listQuestionType.find(
                (item) => item.questionTypeName === question.questionType
              )._id,
              questionTypeName: question.questionType,
              testId: testId,
            };
            QuestionBank.createQuestionBank(questionForInsert)
              .then((response) => {
                // this.openNotificationWithIcon(
                //   "success",
                //   "Create question successfully"
                // );
                // this.createLoading = false;
              })
              .catch((error) => {
                this.createLoading = false;
                this.openNotificationWithIcon(
                  "error",
                  "Create question failed",
                  error.response.data.message
                );
              });
          } catch (e) {
            console.log(e);
            this.uploadLoading = false;
          }
        })
      );
      this.createLoading = false;

      this.openNotificationWithIcon(
        "success",
        "All questions created successfully!"
      );
      this.$router.push("/questionBank");
    },
    async handleSubmit() {
      this.createLoading = true;
      let testId = "";
      if (!this.testName) {
        return;
      } else {
        testId = this.listQuiz.find((quiz) => quiz.name === this.testName)._id;
        if (!testId) {
          Quiz.createQuiz({
            name: this.testName,
          }).then((val) => {
            this.createMultipleQuestion(testId);
          });
        } else {
          this.createMultipleQuestion(testId);
        }
      }
    },
    formatStartOfQuestion(index) {
      let character = "";
      switch (parseInt(index)) {
        case 0:
          character = "A";
          break;
        case 1:
          character = "B";
          break;
        case 2:
          character = "C";
          break;
        case 3:
          character = "D";
          break;
        case 4:
          character = "E";
          break;
        case 5:
          character = "F";
          break;
        case 6:
          character = "G";
          break;
        case 7:
          character = "H";
          break;
        case 8:
          character = "I";
          break;
        case 9:
          character = "J";
          break;
        case 10:
          character = "K";
          break;
        case 11:
          character = "L";
          break;
        case 12:
          character = "M";
          break;
        case 13:
          character = "N";
          break;
        case 14:
          character = "i";
          break;
        case 15:
          character = "ii";
          break;
        case 16:
          character = "iii";
          break;
        case 17:
          character = "iv";
          break;
        case 18:
          character = "v";
          break;
        case 19:
          character = "vi";
          break;
        case 20:
          character = "vii";
          break;
        case 21:
          character = "viii";
          break;
        case 22:
          character = "ix";
          break;
        case 23:
          character = "x";
          break;
        case 24:
          character = "xi";
          break;
        case 25:
          character = "xii";
          break;
        case 26:
          character = "xiii";
          break;
        case 27:
          character = "xiv";
          break;
        case 28:
          character = "xv";
          break;
      }
      return character;
    },

    handleAddNewQuestion() {
      this.listQuestions.push({
        content: "",
        questionNumber: "",
        choices: [{ choiceContent: "" }],
        key: "",
        newAnswerText: "",
        valueForRadio: 0,
        isEditing: true,
        questionType: "",
        currentEditIndex: 0,
      });
      this.totalQuestions = this.listQuestions.length;
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
    cancel() {
      this.openNotificationWithIcon("error", "Cancel create new test");
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
