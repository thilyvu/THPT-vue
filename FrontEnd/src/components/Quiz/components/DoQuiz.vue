<template>
  <div id="container">
    <div>
      <TableLoading v-if="loading"></TableLoading>
      <a-card v-else>
        <div style="display: flex; align-items: center; height: 25px">
          <h6 v-html="testName"></h6>
          <div
            style="
              position: absolute;
              right: 10%;
              z-index: 100;
              top: 20%;
              display: flex;
              align-items: center;
            "
          >
            <b style="font-size: 13px">A</b>
            <input
              style="margin-left: 5px; margin-right: 5px"
              @change="(val) => handleChangeFontSize(val)"
              class="range-slider__range"
              type="range"
              value="14"
              min="8"
              max="25"
            />

            <b style="font-size: 20px">A</b>
          </div>
          <a-divider
            type="vertical"
            style="position: absolute; top: 10%; right: 8.5%; height: 39px"
          />
          <a-statistic-countdown
            class="responsive-countdown"
            v-if="countDown"
            :value="countDown"
            format="HH:mm:ss"
            @finish="onFinish"
            style="position: absolute; right: 0.5%; z-index: 100; top: 13%"
          />
        </div>
      </a-card>
    </div>
  </div>
</template>

<script >
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import CKEditor from "@ckeditor/ckeditor5-vue2";
import { NotificationMixin } from "../../../mixin/Notification";
import StudentKeys from "../../../api/studentKey";
import * as _ from "lodash";
import store from "../../../store/index";
import { cloneDeep } from "lodash";
import Quiz from "../../../api/Quiz";

import TableLoading from "../../Base/TableLoading.vue";
import QuestionType from "../../../api/QuestionType";
export default {
  mixins: [NotificationMixin],
  components: { TableLoading, ckeditor: CKEditor.component },
  data() {
    return {
      testName: "",
      countDown: null,
      testDescription: "",
      testType: "",
      loading: false,
    };
  },
  beforeUpdate() {
    this.$nextTick(function () {
      let collapse = document.getElementsByClassName("ant-collapse-header");
      if (collapse && collapse.length && collapse.length > 0) {
        for (let i = 0; i < collapse.length; i++) {
          if (
            !Array.from(collapse[i].parentNode.parentNode.classList).includes(
              "remove-collapse"
            )
          ) {
            collapse[i].setAttribute("aria-expanded", "true");
          }
        }
      }
      let collapseContent = document.getElementsByClassName(
        "ant-collapse-content"
      );
      if (
        collapseContent &&
        collapseContent.length &&
        collapseContent.length > 0
      ) {
        for (let j = 0; j < collapseContent.length; j++) {
          //auto collapse remove with questionType TRUE/FALSE/NOTGIVEN + YES/NO/NOTGIVEN
          if (
            !Array.from(
              collapseContent[j].parentNode.parentNode.classList
            ).includes("remove-collapse")
          ) {
            collapseContent[j].style.display = "grid";
          }
        }
      }
    });
  },
  beforeRouteLeave: function (to, from, next) {
    this.visibleLeave = true;
    if (this.isLeave || this.visibleBackToExercise) {
      this.isLeave = false;
      next();
    } else {
      window.history.forward();
    }
  },
  beforeDestroy() {
    const elements = document.getElementsByClassName("high-light-container");
    const stickyElement = document.getElementsByClassName(
      "sticky-note-container"
    );
    elements.forEach((el) => el.remove());
    stickyElement.forEach((el) => el.remove());
  },
  mounted() {
    window.addEventListener("beforeunload", function (event) {
      event.preventDefault(); // Prevents the default browser action
      event.returnValue = "Are you sure you want to leave?";
    });
    document.getElementById("container").addEventListener("keyup", (e) => {
      this.handleSendkeyWithDebounce();
    });
    document.getElementById("container").addEventListener("mouseup", (evt) => {
      const el = evt.currentTarget;
      const selObj = window.getSelection();
      let range = window.getSelection().getRangeAt(0);
      const currentHighlight = document.getElementById("high-light-div");
      if (currentHighlight) {
        currentHighlight.remove();
      }
      const selectedContent = selObj.toString();
      if (selectedContent.trim() !== "") {
        let rect = selObj.getRangeAt(0).getBoundingClientRect();
        let div = document.createElement("div");
        div.style.top = `calc(${rect.top}px - 48px)`;
        div.style.left = `calc(${rect.left}px + calc(${rect.width}px / 2) - 40px)`;
        div.setAttribute("class", "high-light-container");
        div.setAttribute("id", "high-light-div");
        let fill1 = document.createElement("img");
        fill1.setAttribute(
          "src",
          "https://firebasestorage.googleapis.com/v0/b/tretrauquiz.appspot.com/o/image%2Ffill1.png?alt=media&token=a5a06a94-0f70-4135-8f82-8e8f5e3b5511"
        );
        fill1.setAttribute("style", "width : 36px !important");
        fill1.setAttribute("class", "high-light-btn");
        fill1.addEventListener("click", () => {
          var hightlightDiv = document.createElement("div");
          hightlightDiv.setAttribute(
            "style",
            "background-color: #c76478; display: inline;"
          );
          // #c76478
          range.surroundContents(hightlightDiv);
          selObj.removeAllRanges();
        });
        let fill2 = document.createElement("img");
        fill2.setAttribute(
          "src",
          "https://firebasestorage.googleapis.com/v0/b/tretrauquiz.appspot.com/o/image%2Ffill2.png?alt=media&token=1de5c0e4-e194-432a-bf0c-0b730b003c82"
        );
        fill2.setAttribute("style", "width : 36px !important");
        fill2.setAttribute("class", "high-light-btn");
        fill2.addEventListener("click", () => {
          var hightlightDiv = document.createElement("div");
          hightlightDiv.setAttribute(
            "style",
            "background-color: #57b972; display: inline;"
          );
          // #57b972
          range.surroundContents(hightlightDiv);
          selObj.removeAllRanges();
        });
        let fill3 = document.createElement("img");
        fill3.setAttribute(
          "src",
          "https://firebasestorage.googleapis.com/v0/b/tretrauquiz.appspot.com/o/image%2Ffill3.png?alt=media&token=0e74ea5f-2797-4c96-9f74-93ed00915787"
        );
        fill3.setAttribute("style", "width : 36px !important");
        fill3.setAttribute("class", "high-light-btn");
        fill3.addEventListener("click", () => {
          var hightlightDiv = document.createElement("div");
          hightlightDiv.setAttribute(
            "style",
            "background-color: #32b4c7; display: inline;"
          );
          // #32b4c7
          range.surroundContents(hightlightDiv);
          selObj.removeAllRanges();
          // #32b4c7
        });
        let filldelete = document.createElement("img");
        filldelete.setAttribute(
          "src",
          "https://firebasestorage.googleapis.com/v0/b/tretrauquiz.appspot.com/o/image%2Ffill_delete.png?alt=media&token=97050f29-2351-4346-8d16-b4d25168e72b"
        );
        filldelete.setAttribute("style", "width : 36px !important");
        filldelete.setAttribute("class", "high-light-btn");
        filldelete.addEventListener("click", () => {
          // #32b4c7
          var hightlightDiv = document.createElement("div");
          hightlightDiv.setAttribute(
            "style",
            "background-color: #fff; display: inline;"
          );
          // #32b4c7
          range.surroundContents(hightlightDiv);
          selObj.removeAllRanges();
        });
        let fillAddnote = document.createElement("img");
        fillAddnote.setAttribute(
          "src",
          "https://firebasestorage.googleapis.com/v0/b/tretrauquiz.appspot.com/o/image%2Ficons8-notepad-50%20(1).png?alt=media&token=870fdffc-45d7-4777-b710-925a7c880aac"
        );
        fillAddnote.setAttribute("style", "width : 36px !important");
        fillAddnote.style.padding = "4px";
        fillAddnote.setAttribute("class", "high-light-btn");
        fillAddnote.addEventListener("click", () => {
          // #32b4c7
          let rect = window
            .getSelection()
            .getRangeAt(0)
            .getBoundingClientRect();
          var hightlightDiv = document.createElement("div");
          hightlightDiv.setAttribute(
            "style",
            "background-color: 	#fdff32; display: inline;"
          );
          hightlightDiv.addEventListener("click", () => {
            const oldNode = document.getElementById(
              `${rect.top}-${rect.left}-${rect.width}`
            );
            if (oldNode) {
              oldNode.style.display = "grid";
            }
          });

          const oldNode = document.getElementById(
            `${rect.top}-${rect.left}-${rect.width}`
          );
          if (!oldNode) {
            range.surroundContents(hightlightDiv);
            const currentHighlight = document.getElementById("high-light-div");
            if (currentHighlight) {
              currentHighlight.remove();
            }
            let stickyNoteContainer = document.createElement("div");
            stickyNoteContainer.setAttribute(
              "id",
              `${rect.top}-${rect.left}-${rect.width}`
            );
            stickyNoteContainer.setAttribute("class", "sticky-note-container");
            let stickyNoteHeader = document.createElement("div");
            stickyNoteHeader.setAttribute("class", "sticky-note-header");
            let stickyNoteHeaderBtn = document.createElement("img");
            stickyNoteHeaderBtn.setAttribute(
              "src",
              "https://firebasestorage.googleapis.com/v0/b/tretrauquiz.appspot.com/o/image%2Ficons8-close-30.png?alt=media&token=4c2d46f9-03c5-4393-897b-a15131221bb9"
            );
            stickyNoteHeaderBtn.setAttribute(
              "style",
              "width : 24px !important"
            );
            stickyNoteHeaderBtn.style.padding = "4px";
            stickyNoteHeaderBtn.setAttribute("class", "sticky-note-button");
            stickyNoteHeaderBtn.addEventListener("click", () => {
              const currentNode = document.getElementById(
                `${rect.top}-${rect.left}-${rect.width}`
              );
              currentNode.style.display = "none";
            });
            let stickyNoteBody = document.createElement("div");
            stickyNoteBody.setAttribute("class", "sticky-note-body");
            let stickyNoteInput = document.createElement("textarea");
            stickyNoteInput.setAttribute("class", "sticky-note-input");
            stickyNoteHeader.appendChild(stickyNoteHeaderBtn);
            stickyNoteBody.appendChild(stickyNoteInput);
            stickyNoteContainer.appendChild(stickyNoteHeader);
            stickyNoteContainer.appendChild(stickyNoteBody);
            stickyNoteContainer.style.top = `calc(${rect.top}px + 24px)`;
            stickyNoteContainer.style.left = `calc(${rect.left}px + calc(${rect.width}px / 2) - 40px)`;
            document.body.appendChild(stickyNoteContainer);
          } else {
            oldNode.style.display = "grid";
          }

          // #32b4c7
          // range.surroundContents(hightlightDiv);
          selObj.removeAllRanges();
        });

        div.appendChild(fill1);
        div.appendChild(fill2);
        div.appendChild(fill3);
        div.appendChild(filldelete);
        div.appendChild(fillAddnote);

        document.body.appendChild(div);
      }
    });

    const drapDropTouch = document.createElement("script");
    drapDropTouch.setAttribute("src", "DragDropTouch.js");
    document.head.appendChild(drapDropTouch);
    this.loading = true;
    let listInputs;
    this.listInputCloned = cloneDeep(listInputs);
    Quiz.getQuizById(this.$route.params.exerciseId)
      .then((response) => {
        const data = response.data.data;
        this.currentSubject = data.subject;
        this.testName = data.name;
        this.testDescription = data.testDescription;
        this.testType = data.testType;
        for (let i = 0; i < this.totalQuestions; i++) {
          this.studentCheckedKeys.push({
            content: "",
            isReview: false,
          });
        }
        this.isShowPoint = data.isShowPoint ? data.isShowPoint : false;
        let [hours, minutes, seconds] = data.countDownTime.split(":");
        this.countDown =
          Date.now() +
          parseInt(hours) * 60 * 60 * 1000 +
          parseInt(minutes, 0) * 60 * 1000 +
          parseInt(seconds, 0) * 1000;
      })
      .catch((e) => {
        console.log("e", e);
      });
    // get list question type
    QuestionType.getListQuestionType()
      .then((response) => {
        this.listQuestionType = response.data.data;
      })
      .catch((e) => {
        console.log("e", e);
      });
    this.loading = false;

    // get data for test that are inprocess or has just started
    // StudentKeys.getCurrentStudentKeyByClassAndTestIdAndStudentId({
    //   classId: this.classId,
    //   testId: this.$route.params.exerciseId,
    //   studentId: this.userProfile._id,
    // })
    //   .then((response) => {
    //     if (
    //       response.data.data &&
    //       response.data.data[0] &&
    //       (response.data.data[0].status === "inProcess" ||
    //         response.data.data[0].status === "started")
    //     ) {
    //       this.currentStudentKeyId = response.data.data[0]._id;
    //       // this.listStudentKeys =  response.data.data[0].listKeys;
    //       // console.log(this.listStudentKeys);
    //       this.loading = false;
    //     } else {
    //       const studentKey = {
    //         classId: this.classId,
    //         testId: this.testId,
    //         listKeys: this.studentCheckedKeys,
    //         totalQuestions: this.listTopics.totalQuestions,
    //         status: "started",
    //       };
    //       // create student key if student hasn't started the test before
    //       StudentKeys.createStudentKey(studentKey)
    //         .then((response) => {
    //           this.currentStudentKeyId = response.data.newStudentKeyCreated._id;
    //           this.loading = false;
    //         })
    //         .catch((error) => {
    //           this.openNotificationWithIcon(
    //             "error",
    //             "Nộp bài thất bại",
    //             error.response.data.message
    //           );
    //           this.loading = false;
    //         });
    //     }
    //   })
    //   .catch((e) => {
    //     console.log("e", e);
    //     this.loading = false;
    //   });
  },
  watch: {
    sendTest(value) {
      if (value) {
        this.handleSendKeyTest(true);
        store.commit("SET_SEND_TEST_STATUS", !value);
      }
    },
  },
  computed: {
    sendTest() {
      return store.state.sendTest;
    },
    selection() {
      return window.getSelection();
    },
    userProfile() {
      return JSON.parse(localStorage.getItem("userProfile"));
    },
    classId() {
      return this.$route.params.id;
    },
    testId() {
      return this.$route.params.exerciseId;
    },
    _() {
      return _;
    },
  },
  methods: {
    onFinish() {
      // this.handleSendKeyTestAndRedirect();
    },
  },
};
</script>

<style lang="scss">
.range-slider__range {
  -webkit-appearance: none;
  width: 75px;
  height: 3px;
  border-radius: 5px;
  background: #d7dcdf;
  outline: none;
  padding: 0;
  margin: 0;
}
.range-slider__range::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2c3e50;
  cursor: pointer;
  transition: background 0.15s ease-in-out;
}
.range-slider__range::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border: 0;
  border-radius: 50%;
  background: #2c3e50;
  cursor: pointer;
  transition: background 0.15s ease-in-out;
}
.range-slider__value {
  display: inline-block;
  position: relative;
  width: 60px;
  color: #fff;
  line-height: 20px;
  text-align: center;
  border-radius: 3px;
  background: #2c3e50;
  padding: 5px 10px;
  margin-left: 8px;
}
</style>
