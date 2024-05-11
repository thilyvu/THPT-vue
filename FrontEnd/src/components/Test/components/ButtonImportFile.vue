<template>
  <div style="text-align: end">
    <a-space direction="horizontal" align="center" class="responsive-document">
      <input type="file" ref="file" style="display: none" @change="chooseImg" />
      <v-btn
        :loading="loading"
        color="blue-grey"
        class="ma-2 white--text responsive-document-item"
        @click="$refs.file.click()"
      >
        Upload file
        <v-icon right dark> mdi-cloud-upload </v-icon>
      </v-btn>
    </a-space>
    <a-modal
      v-model="isAddFolder"
      title="Add new folder"
      ok-text="Add"
      cancel-text="Cancel"
      @ok="addFolder"
    >
      <v-text-field
        v-model="name"
        type="text"
        label="Folder name"
      ></v-text-field>
    </a-modal>
  </div>
</template>
  
  <script>
import { FirebaseStorageMixin } from "../../../mixin/FirebaseStorage";
import { LocalStorageMixin } from "../../../mixin/LocalStorage";
import mammoth from "mammoth";
import { chunk } from "lodash";

export default {
  mixins: [FirebaseStorageMixin, LocalStorageMixin],
  props: {
    root: {
      type: Array | Object,
      default: () => {
        return [];
      },
    },
    classId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      isAddFolder: false,
      name: "",
      fileName: "",
      randomString: (Math.random() + 1).toString(36).substring(5),
      fileSize: 0,
      convertedHtml: "",
    };
  },
  methods: {
    addFolder() {
      const payload = {
        fileName: this.name,
      };
      if (this.classId) payload.classId = this.classId;
      if (this.root.length > 1) {
        payload.parentId = this.root.at(-1).id;
      }
      this.$emit("addFolder", payload);
      this.name = "";
      this.isAddFolder = false;
    },
    removeHtmlTags(inputString) {
      const cleanText = inputString.replace(/<[^>]*>/g, "");
      return cleanText;
    },
    parseQuestionsText(fullText) {
      const questionNumberRegex = /^\d+/;
      const questionTextRegex = /^\d+:\s*(.*?)(?=\s*A\s)/;
      const questionNumber = fullText.match(questionNumberRegex)[0];
      const questionText = fullText.match(questionTextRegex)[1].trim();
      let questionObj = {
        number: questionNumber,
        text: questionText,
        choices: {},
      };
      const choiceRegex = /\b([A-D])\s+(.*?)(?=\s+[A-D]\s|$)/g;
      let match;

      while ((match = choiceRegex.exec(fullText)) !== null) {
        const choiceLetter = match[1];
        const choiceText = match[2].trim();
        questionObj.choices[choiceLetter] = choiceText;
      }
      console.log(questionObj);

      return questionObj;
    },
    isValidQuestionSegment(segment) {
      const labels = ["A", "B", "C", "D"];
      return labels.every((label) => segment.includes(label));
    },

    parseQuestions(html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const extractedQuestions = [
        {
          questionContent: "",
          choices: [],
        },
      ];
      let questions = [];
      doc.querySelectorAll("h4, p, h1, h2, h3").forEach((element) => {
        const latItem = extractedQuestions[extractedQuestions.length - 1];
        if (latItem.choices.length === 4)
          extractedQuestions.push({
            questionContent: "",
            choices: [],
            content: "",
          });
        let testTitle = "";
        if (
          element.tagName === "H1" ||
          element.tagName === "H2" ||
          element.tagName === "H3"
        ) {
          testTitle = this.removeHtmlTags(element.innerHTML);
        }
        if (element.tagName === "P" || element.tagName === "H4") {
          if (element.tagName === "H4") {
            latItem.content = element.textContent.trim();
          }
          if (
            element.tagName === "P" &&
            element.querySelector("strong") &&
            (!element.textContent.includes("(") ||
              !element.textContent.includes("__"))
          ) {
            console.log(element);
            const text = element.textContent.trim().replaceAll("\t", " ");
            questions.push(text);
          }
        }
      });
      let listStrings = "";
      const listQuestionObject = [];
      for (let i = 0; i < questions.length; i++) {
        if (this.isValidQuestionSegment(questions[i])) {
          listQuestionObject.push(this.parseQuestionsText(questions[i]));
        } else {
          let isValid = false;
          while (!isValid) {
            listStrings += questions[i];
            isValid = this.isValidQuestionSegment(listStrings);
            if (isValid) {
              listQuestionObject.push(this.parseQuestionsText(listStrings));
              listStrings = "";
            } else {
              i++;
            }
          }
        }
      }
      console.log(listQuestionObject);

      return extractedQuestions.filter((item) => item.choices.length);
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
    chooseImg(event) {
      const file = event.target.files[0];
      this.convertDocxToHtml(file)
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const paragraphs = doc.querySelectorAll("p");

          // Extract text content from each <p> element
          // paragraphs.forEach((paragraph) => {
          //   const line = paragraph.innerHTML.trim();
          //   console.log(this.isValidQuestionSegment(line));
          //   // if (this.isValidQuestionSegment(line)) {
          //   //   console.log(line, this.parseQuestionsText(line));
          //   // }
          // });
          let groupOfString = [];
          let stringConcat = "";
          for (let i = 0; i < paragraphs.length; i++) {
            stringConcat = stringConcat.concat(paragraphs[i].innerHTML);
            if (this.isValidQuestionSegment(stringConcat)) {
              groupOfString.push(stringConcat);
              stringConcat = ""; // Reset stringConcat for the next segment
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

            console.log("Question Number:", questionNumber);
            console.log("Question Content:", questionContent);
            console.log("Choices A:", choicesA);
            console.log("Choices B:", choicesB);
            console.log("Choices C:", choicesC);
            console.log("Choices D:", choicesD);
          });
        })
        .catch((error) => {
          console.error("Error converting DOCX to HTML:", error);
        });
      this.fileName = event.target.files[0].name;
      this.fileSize = event.target.files[0].size;
      //   if (this.classId) {
      //     this.handleImageFile(
      //       event.target.files[0],
      //       `class/${this.classId}/fileStorage/${this.randomString}/${this.fileName}`
      //     );
      //   } else {
      //     this.handleImageFile(
      //       event.target.files[0],
      //       `class/${this.userProfile.id}/fileStorage/${this.randomString}/${this.fileName}`
      //     );
      //   }
    },
    addFile(val) {
      console.log(val);
      const payload = {
        fileName: this.fileName,
        extension: this.extension,
        thumbnailUrl: this.randomString + "_" + this.picture,
        fileSize: this.fileSize,
      };
      if (this.classId) payload.classId = this.classId;

      if (this.root.length > 1) {
        payload.parentId = this.root.at(-1).id;
      }
      this.$emit("addFile", payload);
    },
    execute() {
      this.addFile();
    },
  },
  computed: {
    extension() {
      if (this.extensionFile) return this.extensionFile;
      const temp = this.fileName.split(".")[1];
      if (temp === "pdf") return "pdf";
      else if (temp === "png" || temp === "jpg") return "picture";
      else if (temp === "doc" || temp === "docx") {
        return "word";
      } else if (temp === "ppt" || temp === "pptx") {
        return "ppt";
      } else if (temp === "xlsx") {
        return "excel";
      }
    },
    loading() {
      if (this.picture === null && this.uploadValue > 0) return true;
      else if (this.picture !== null && this.uploadValue === 100) {
        return false;
      }
      return false;
    },
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
  },
};
</script>
  
  <style lang="scss">
@media (max-width: 1000px) {
  .responsive-document {
    padding: 10px 0px 20px 0px;
  }
}
@media (max-width: 400px) {
  .responsive-document {
    display: grid;
    padding: 10px 0px 20px 0px;
  }
  .responsive-document-item {
    margin-bottom: 0.5rem;
  }
}
</style>