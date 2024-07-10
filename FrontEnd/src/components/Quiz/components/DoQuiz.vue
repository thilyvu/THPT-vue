<template>
  <div id="container">
    <div>
      <TableLoading v-if="loading"></TableLoading>
      <a-card v-else   style="margin-top: 40px; height: 54px"
        class="remove-card-body-padding responsive-listening-site-header">
        <div style="display: flex; align-items: center; height: 54px"
        class="responsive-listening-site-header-item"
        >
          <h6 v-html="testName" style="margin: 20px;"></h6>
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
      <div v-if="!loading" class="listening-site listening-site-responsive">
        <div class="test-left" style="margin-top: 6.5rem">
          <div v-for="(quiz, quizIndex) in quizzes" :key="quizIndex">
            <div v-if="quiz.type !=='content'" style="max-width: 100%; width: 100%; max-height: 100%; ">
              <a-collapse :bordered="false" :key="quizIndex + 1" :value="quiz" :ghost="true">
                <template #expandIcon="{ isActive }">
                  <a-icon style="padding-bottom: 2px; display: none;" type="caret-right" :rotate="isActive ? 90 : 0" />
                </template>
                <a-collapse-panel   :class="`${quizIndex + 1}`" style="background: white" :key="quizIndex + 1" :forceRender="true">
                  <template v-slot:header>
                    <div style="display: flex; align-items: center;">
                      <b style="margin-right: 10px; display: flex; align-items: center;">{{ getQuizQuestionNumber(quiz.questionNumber) }}</b>
                      <span v-html="quiz.content"></span>
                    </div>
                  </template>
                  <a-card size="small" style="border: none; padding: 5px !important; margin-top: -10px;" class="set-margin-top">
                    <div v-if="quiz.choices && quiz.choices.length">
                      <a-radio-group v-model="quiz.valueForRadio" @change="(val) =>handleChangeStudentKey(val, quizIndex, indexedQuestions[quizIndex].typeIndex )" class="choice-container" :class="getFlexClass(quiz.choices)">
                        <div v-for="(answer, answerIndex) in quiz.choices" :key="answerIndex" class="flex-item">
                          <a-radio class="radio-style-multiple" :value="answerIndex">
                            <div class="choice-content">
                              <b>{{ `${formatStartOfQuestion(answerIndex)} ` }}</b>
                              <span style="margin-left: 10px" v-html="answer.choiceContent"></span>
                            </div>
                          </a-radio>
                        </div>
                      </a-radio-group>
                    </div>
                  </a-card>
                </a-collapse-panel>
              </a-collapse>
            </div>
            <div v-else style="margin-left: 16px;" v-html="quiz.content">
            </div>
          </div>
        </div>
        <div class="test-right">
          <h5 style="margin-top: 1.5rem; text-align: center; color: black">
            {{ this.testName }}
          </h5>
          <a-divider style="margin-left: -0.1rem" />
          <h6 style="margin-left: 1rem; color: black; margin-bottom: 12px">
            Question Palette
          </h6>
          <div style="width: 100%; display: flex">
            <div
              style="
                width: 96%;
                padding: 0px;
                margin-left: 0.5rem;
                height: fix-content;
              "
            >
              <div style="display: flex; flex-wrap: wrap">
                <div v-for="(item, index) in studentCheckedKeys" :key="index">
                  <div
                    style="margin-top: 0.5rem"
                    v-if="
                      studentCheckedKeys &&
                      studentCheckedKeys[index] &&
                      studentCheckedKeys[index].answer !== ''
                    "
                  >
                    <a-dropdown v-if="!item.isReview">
                      <a-button
                        size="default"
                        :class="
                          index > 8
                            ? 'resize-button-primary-number'
                            : 'normal-primary-button'
                        "
                        class="btn_style"
                        type="primary"
                        style="background: #000"
                        @click="handleReview(item.studentKeyIndex)"
                      >
                        {{ index + 1 }}
                      </a-button>
                      <template #overlay>
                        <a-menu>
                          <a-menu-item>
                            <a @click="handleCheckReviewForListening(index)">
                              {{
                                studentCheckedKeys[index].isReview
                                  ? "UnReview"
                                  : "Review"
                              }}
                            </a>
                          </a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>

                    <a-dropdown v-if="item.isReview">
                      <a-button
                        size="default"
                        :class="
                          index > 8
                            ? 'resize-button-primary-number'
                            : 'normal-primary-button'
                        "
                        type="primary"
                        style="background: #000"
                        shape="circle"
                        class="btn_style"
                        @click="handleReview(item.studentKeyIndex)"
                      >
                        {{ index + 1 }}
                      </a-button>

                      <template #overlay>
                        <a-menu>
                          <a-menu-item>
                            <a @click="handleCheckReviewForListening(index)">
                              {{
                                studentCheckedKeys[index].isReview
                                  ? "UnReview"
                                  : "Review"
                              }}
                            </a>
                          </a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </div>
                  <div style="margin-top: 0.5rem" v-else>
                    <a-dropdown v-if="item.isReview">
                      <a-button
                        size="default"
                        :class="
                          index > 8 ? 'resize-button-number' : 'normal-button'
                        "
                        shape="circle"
                        @click="handleReview(item.studentKeyIndex)"
                      >
                        {{ index + 1 }}
                      </a-button>

                      <template #overlay>
                        <a-menu>
                          <a-menu-item>
                            <a @click="handleCheckReviewForListening(index)">
                              {{
                                studentCheckedKeys[index].isReview
                                  ? "UnReview"
                                  : "Review"
                              }}
                            </a>
                          </a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>

                    <a-dropdown v-else>
                      <a-button
                        :class="
                          index > 8 ? 'resize-button-number' : 'normal-button'
                        "
                        @click="handleReview(item.studentKeyIndex)"
                        size="default"
                      >
                        {{ index + 1 }}
                      </a-button>

                      <template #overlay>
                        <a-menu>
                          <a-menu-item>
                            <a @click="handleCheckReviewForListening(index)">
                              {{
                                studentCheckedKeys[index].isReview
                                  ? "UnReview"
                                  : "Review"
                              }}
                            </a>
                          </a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class ="review-style">
            <a-checkbox
            style="display: flex; align-items: center"
            v-if="!studentCheckedKeys[currentButtonIndex].isReview"
            @change="handleCheckReview()"
          >
          <p style="color :aliceblue;margin-bottom: 0;"> Review</p>
          </a-checkbox>
          <a-checkbox
            style="display: flex; align-items: center"
            v-else
            @change="handleCheckReview()"
            :checked="true"
          >
          <p style="color :aliceblue ;margin-bottom: 0;"> Review</p>
          </a-checkbox>
          </div> -->
          <div class="type-of-answer">
            <div class="type-of-answer-item">
              <div class="need-review-answer-container">
                <div class="normal-answered"></div>
                <p class="need-review-answer-label">Answered</p>
              </div>
              <div
                style="margin-left: 3rem"
                class="need-review-answer-container"
              >
                <div class="need-review-answered"></div>
                <p class="need-review-answer-label">Answered need to review</p>
              </div>
            </div>
            <div class="type-of-answer-item">
              <div class="need-review-answer-container">
                <div class="normal-answer"></div>
                <p class="need-review-answer-label">Answer</p>
              </div>
              <div
                style="margin-left: 4rem"
                class="need-review-answer-container"
              >
                <div class="need-review-answer"></div>
                <p class="need-review-answer-label">Answer need to review</p>
              </div>
            </div>
          </div>
          <div class="submit-btn">
            <v-btn
              color="primary"
              dark
              style="margin-right: 10px"
              @click="handleSubmit"
            >
              <!-- <img style="width :20px; margin-right :1rem" src="../../../assets/send.png" /> -->
              Submit
              <v-icon dark right> mdi-send </v-icon>
            </v-btn>
          </div>
        </div>

        <div class="test-right-for-mobile">
          <a-collapse class="remove-collapse" style="color: white" expand-icon-position="right">
            <template #expandIcon="props">
              <a-icon
                style="padding-bottom: 2px; "
                type="caret-right"
                :rotate="props.isActive ? 90 : -90"
              />
            </template>

            <a-collapse-panel
              class="responsive-content-box"
              style="background: #edd31d !important; color: white"
              key="1"
            >
              <template slot="header">
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  "
                >
                  <b style="color: black; font-size: 18px">Question Palette </b>
                  <a-statistic-countdown
                    v-if="countDown"
                    :value="countDown"
                    class="responsive-coundown-mobile"
                    format="HH:mm:ss"
                    @finish="onFinish"
                    style="color: white !important  "
                  />
                </div>
              </template>
              <div
                class="responsive-content-collapse"
                style="background: #edd31d; margin:  -16px !important;"
              >
                <h5
                  style="
                    color: black;
                    font-size: 18px;
                    padding-top: 0.5rem;
                    text-align: center;
                  "
                >
                  {{ this.testName }}
                </h5>
                <div style="width: 100%; display: flex">
                  <div
                    style="
                      width: 96%;
                      padding: 0px;
                      margin-left: 0.5rem;
                      height: fix-content;
                    "
                  >
                    <div style="display: flex; flex-wrap: wrap">
                      <div
                        v-for="(item, index) in studentCheckedKeys"
                        :key="index"
                      >
                        <div
                          style="margin-top: 0.5rem"
                          v-if="
                            studentCheckedKeys &&
                            studentCheckedKeys[index] &&
                            studentCheckedKeys[index].answer !== ''
                          "
                        >
                          <a-dropdown v-if="!item.isReview">
                            <a-button
                              size="default"
                              :class="
                                index > 8
                                  ? 'resize-button-primary-number'
                                  : 'normal-primary-button'
                              "
                              class="btn_style"
                              type="primary"
                              style="background: #000"
                              @click="handleReview(item.studentKeyIndex)"
                            >
                              {{ index + 1 }}
                            </a-button>
                            <template #overlay>
                              <a-menu>
                                <a-menu-item>
                                  <a
                                    @click="
                                      handleCheckReviewForListening(index)
                                    "
                                  >
                                    {{
                                      studentCheckedKeys[index].isReview
                                        ? "UnReview"
                                        : "Review"
                                    }}
                                  </a>
                                </a-menu-item>
                              </a-menu>
                            </template>
                          </a-dropdown>

                          <a-dropdown v-if="item.isReview">
                            <a-button
                              size="default"
                              :class="
                                index > 8
                                  ? 'resize-button-primary-number'
                                  : 'normal-primary-button'
                              "
                              type="primary"
                              style="background: #000"
                              shape="circle"
                              class="btn_style"
                              @click="handleReview(item.studentKeyIndex)"
                            >
                              {{ index + 1 }}
                            </a-button>

                            <template #overlay>
                              <a-menu>
                                <a-menu-item>
                                  <a
                                    @click="
                                      handleCheckReviewForListening(index)
                                    "
                                  >
                                    {{
                                      studentCheckedKeys[index].isReview
                                        ? "UnReview"
                                        : "Review"
                                    }}
                                  </a>
                                </a-menu-item>
                              </a-menu>
                            </template>
                          </a-dropdown>
                        </div>
                        <div style="margin-top: 0.5rem" v-else>
                          <a-dropdown v-if="item.isReview">
                            <a-button
                              size="default"
                              :class="
                                index > 8
                                  ? 'resize-button-number'
                                  : 'normal-button'
                              "
                              shape="circle"
                              @click="handleReview(item.studentKeyIndex)"
                            >
                              {{ index + 1 }}
                            </a-button>

                            <template #overlay>
                              <a-menu>
                                <a-menu-item>
                                  <a
                                    @click="
                                      handleCheckReviewForListening(index)
                                    "
                                  >
                                    {{
                                      studentCheckedKeys[index].isReview
                                        ? "UnReview"
                                        : "Review"
                                    }}
                                  </a>
                                </a-menu-item>
                              </a-menu>
                            </template>
                          </a-dropdown>

                          <a-dropdown v-else>
                            <a-button
                              :class="
                                index > 8
                                  ? 'resize-button-number'
                                  : 'normal-button'
                              "
                              @click="handleReview(item.studentKeyIndex)"
                              size="default"
                            >
                              {{ index + 1 }}
                            </a-button>

                            <template #overlay>
                              <a-menu>
                                <a-menu-item>
                                  <a
                                    @click="
                                      handleCheckReviewForListening(index)
                                    "
                                  >
                                    {{
                                      studentCheckedKeys[index].isReview
                                        ? "UnReview"
                                        : "Review"
                                    }}
                                  </a>
                                </a-menu-item>
                              </a-menu>
                            </template>
                          </a-dropdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="type-of-answer">
                  <div class="type-of-answer-item">
                    <div class="need-review-answer-container">
                      <div class="normal-answered"></div>
                      <p class="need-review-answer-label">Answered</p>
                    </div>
                    <div
                      style="margin-left: 3rem"
                      class="need-review-answer-container"
                    >
                      <div class="need-review-answered"></div>
                      <p class="need-review-answer-label">
                        Answered need to review
                      </p>
                    </div>
                  </div>
                  <div class="type-of-answer-item">
                    <div class="need-review-answer-container">
                      <div class="normal-answer"></div>
                      <p class="need-review-answer-label">Answer</p>
                    </div>
                    <div
                      style="margin-left: 4rem"
                      class="need-review-answer-container"
                    >
                      <div class="need-review-answer"></div>
                      <p class="need-review-answer-label">
                        Answer need to review
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  style="
                    text-align: end;
                    margin-top: 0.5rem;
                    padding-bottom: 0.5rem;
                  "
                >
                  <v-btn
                    color="primary"
                    dark
                    style="margin-right: 10px"
                    @click="handleSubmit"
                  >
                    <!-- <img style="width :20px; margin-right :1rem" src="../../../assets/send.png" /> -->
                    Submit
                    <v-icon dark right> mdi-send </v-icon>
                  </v-btn>
                </div>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </div>
      <a-modal
      title="Xác nhận nộp bài"
      :visible="visibleSendKey"
      :confirm-loading="sendKeyLoading"
      ok-text="Xác nhận"
      cancel-text="Hủy"
      @ok="
        () => {
          handleSendKeyTest(false);
          this.isLeave = true;
        }
      "
      @cancel="() => (visibleSendKey = false)"
    >
      Bạn đã điền đầy đủ tất cả các câu hỏi?
    </a-modal>

    <a-modal
      title="Xác nhận thoát"
      :visible="visibleLeave"
      :confirm-loading="sendKeyLoading"
      ok-text="Xác nhận"
      cancel-text="Hủy"
      @ok="handleSendKeyTestAndRedirect(false)"
      @cancel="() => (visibleLeave = false)"
    >
      Bạn có chắn chắn là muốn kết thúc làm bài kiểm tra?
    </a-modal>
    <a-modal
      title="Kết quả bài kiểm tra"
      :visible="visibleBackToExercise"
      ok-text="Quay"
      width="1400px"
      cancel-text="Hủy"
      :closable="false"
      @cancel="
        () => {
          visibleBackToExercise = false;
          isLeave = true;
          handleBackToClassDetail();
        }
      "
    >
      <template slot="footer">
        <a-button key="back" @click="handleBackToClassDetail">
          Quay lại lớp học
        </a-button>
      </template>
      <b>Điểm số của bạn là : </b>
      <div>
        {{ studentResult.totalCorrect }} / {{ studentResult.totalQuestions }}
      </div>
      <a-table
        v-if="studentResult.data && studentResult.data.studentKeys"
        :rowKey="makeid(10)"
        style="height : 200px; overflow-y: scroll;margin-top: 1rem;"
        :pagination="false"
        :columns="innerStudentKeycolumns"
        :data-source="addIndex(studentResult.data.studentKeys)"
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
    </a-modal>
    </div>
   
  </div>
</template>

<script >
import CKEditor from "@ckeditor/ckeditor5-vue2";
import { NotificationMixin } from "../../../mixin/Notification";
import QuizStudentKeys from "../../../api/quizStudentKey";
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
      visibleSendKey : false,
      studentCheckedKeys: [],
      currentButtonIndex: 0,
      isShowPoint: false,
      visibleBackToExercise: false,
      visibleLeave: false,
      sendKeyLoading: false,
      studentResult: {},
      listStudentKeys: [],
      quizzes: [],
      canSendTest : false,
      isLeave : false,
      currentStudentKeyId: null,
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
      let collapseHeader = document.getElementsByClassName(
        "ant-collapse-header"
      );
      let collapseContent = document.getElementsByClassName(
        "ant-collapse-content"
      );
      let cardBody = document.getElementsByClassName(
        "ant-card-body"
      );
      if (
        cardBody &&
        cardBody.length &&
        cardBody.length > 0
      ) {
        for (let j = 0; j < cardBody.length; j++) {
          cardBody[j].setAttribute("style", "padding : 0px !important")
        }
      }
      let collapseItem = document.getElementsByClassName("ant-collapse-item");
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
            collapseContent[j].setAttribute("padding", 0)
          }
        }
      }
      if (
        collapseHeader &&
        collapseHeader.length &&
        collapseHeader.length > 0
      ) {
        for (let j = 0; j < collapseHeader.length; j++) {
          collapseHeader[j].setAttribute("style", "padding : 0px 32px !important")

        }
      }
      if (
        collapseItem &&
        collapseItem.length &&
        collapseItem.length > 0
      ) {
        for (let j = 0; j < collapseItem.length; j++) {
          collapseItem[j].setAttribute("style", "border-bottom : unset; background: white;")

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
    document.addEventListener('DOMContentLoaded', function() {
      removePStyles();
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
        this.quizzes = data.quizzes.map((quiz, quizIndex) => ({...quiz, index: quizIndex}));
        let counter = 0;
        for (let i = 0; i < data.quizzes.length; i++) {
          if(data.quizzes[i].type !== 'content' ){
            this.studentCheckedKeys.push({
            content: "",
            answer: "",
            isReview: false,
            quiz : data.quizzes[i],
            studentKeyIndex : i
          });
          }
        }
        this.isShowPoint = data && data.isShowPoint ? data.isShowPoint : false;
        let [hours, minutes, seconds] = data.countDownTime.split(":");
        this.countDown =
          Date.now() +
          parseInt(hours) * 60 * 60 * 1000 +
          parseInt(minutes, 0) * 60 * 1000 +
          parseInt(seconds, 0) * 1000;
          QuizStudentKeys.getCurrentQuizStudentKeyByClassAndQuizIdAndStudentId({
      classId: this.classId,
      quizId: this.$route.params.exerciseId,
      studentId: this.userProfile.id,
    })
      .then((response) => {
        const responseData = response.data.data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
        if (
          responseData &&
          responseData.length > 0 &&
          responseData[0] &&
            (responseData[0].status === "inProcess" ||
            responseData[0].status === "started")
        ) {
          this.currentStudentKeyId =responseData[0]._id;
          this.canSendTest = true;
          this.studentCheckedKeys = [];
          const keys = {
            "A" : 0,
            "B" : 1,
            "C" : 2,
            "D" : 3
          };

          const listQuestion = this.quizzes.filter((quiz) => quiz.type !== 'content')
          const oldStudentKeys = response.data.data[0].studentKeys;
          for (let i = 0; i < oldStudentKeys.length; i++) {
            this.studentCheckedKeys.push({
            content: "",
            answer: oldStudentKeys[i].answer,
            isReview: false,
            quiz : oldStudentKeys[i].quiz,
            studentKeyIndex : i
          });
          this.quizzes[listQuestion[i].index].valueForRadio = keys[oldStudentKeys[i].answer]
        }
          // this.listStudentKeys =  response.data.data[0].listKeys;
          this.loading = false;
        } else {
          const studentKey = {
            classId: this.classId,
            quizId: this.testId,
            listKeys: this.listStudentKeys,
            totalQuestions: this.listQuestionType.length,
            status: "started",
          };
          // create student key if student hasn't started the test before
          QuizStudentKeys.createStudentKey(studentKey)
            .then((response) => {
              this.currentStudentKeyId = response.data.newStudentKeyCreated._id;
              this.loading = false;
              this.canSendTest = true;
            })
            .catch((error) => {
              this.openNotificationWithIcon(
                "error",
                "Nộp bài thất bại",
                error.response.data.message
              );
              this.loading = false;
            });
        }
      })
      .catch((e) => {
        this.loading = false;
      });
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
    //get data for test that are inprocess or has just started
    
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
    indexedQuestions() {
      let questionCount = 0;
      let contentCount = 0;

      return this.quizzes.map((question, index) => ({
        ...question,
        typeIndex: question.type === 'content' ? contentCount++ : questionCount++
        }),
      );
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
      this.handleSendKeyTestAndRedirect();
    },
    handleChangeFontSize(val) {
      const fontSize = `${val.target.value}px`;
      this.changeFont(
          document.getElementsByClassName("test-left")[0],
          fontSize
        );
        this.changeFont(
          document.getElementsByClassName("test-left")[1],
          fontSize
        );
        this.changeFont(
          document.getElementsByClassName("test-left")[2],
          fontSize
        );
        this.changeFont(
          document.getElementsByClassName("test-left")[3],
          fontSize
        );
    },
    changeFont(element, fontSize) {
      element.style.fontSize = fontSize.toString();
      for (var i = 0; i < element.children.length; i++) {
        this.changeFont(element.children[i], fontSize);
      }
    },
    handleSubmit() {
      this.visibleSendKey = true;
    },
    handleSendkeyWithDebounce: _.debounce(function () {
      this.handleSendKeyTest(true);
    }, 200),
    handleCheckReview() {
      this.studentCheckedKeys[this.currentButtonIndex].isReview =
        !this.studentCheckedKeys[this.currentButtonIndex].isReview;
    },
    handleSendKeyTestAndRedirect() {
      this.handleSendKeyTest(false);
      this.isLeave = true;
    },
    getQuizQuestionNumber (questionNumber) {
      return questionNumber && questionNumber.match(/\d+$/) &&  questionNumber.match(/\d+$/).length > 0 ? questionNumber.match(/\d+$/)[0] : ''
    },
    handleSendKeyTest(isDoing) {
      if(! this.canSendTest) {
        return;
      }
      this.visibleSendKey = false;
      this.sendKeyLoading = false;

      const studentKey = {
        classId: this.classId,
        quizId: this.testId,
        listKeys: this.studentCheckedKeys,
        totalQuestions: this.studentCheckedKeys.length,
      };
      if (!isDoing) {
        QuizStudentKeys.updateStudentKey(this.currentStudentKeyId, {
          ...studentKey,
          status: "done",
        })
          .then((response) => {
            this.openNotificationWithIcon(
              "success",
              "Nộp bài kiểm tra thành công"
            );
            if (this.isShowPoint) {
              this.studentResult = response.data;
              this.visibleBackToExercise = true;
            } else {
              this.$router.push({
                name: "quizExercise",
                params: { id: this.classId },
              });
            }
            // this.$router.push({
            //     name: "quizExercise",
            //     params: { id: this.classId },
            //   });

            const elements = document.getElementsByClassName(
              "high-light-container"
            );
            const stickyElement = document.getElementsByClassName(
              "sticky-note-container"
            );
            elements.forEach((el) => el.remove());
            stickyElement.forEach((el) => el.remove());
          })
          .catch((error) => {
            this.openNotificationWithIcon(
              "error",
              "Nộp bài kiểm tra thất bại",
              error.response.data.message
            );
          });
      } else {
        QuizStudentKeys.updateStudentKey(this.currentStudentKeyId, {
          ...studentKey,
          status: "inProcess",
        })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            this.openNotificationWithIcon(
              "error",
              "Cập nhật bài kiểm tra thất bại",
              error.response.data.message
            );
          });
      }
    },
    removePStyles() {
      const pElements = document.querySelectorAll('p');

      pElements.forEach(p => {
        p.setAttribute('style' ,"margin: 0px !important");
      });
      const spanElements = document.querySelectorAll('span');
            spanElements.forEach(p => {
              spanElements.setAttribute('color' ,"#000 !important");
      });
    },
    handleCheckReviewForListening(index) {
      this.studentCheckedKeys[index].isReview =
        !this.studentCheckedKeys[index].isReview;
    },
    handleReview(index) {
      setTimeout(() => {
        const collection = document.getElementsByClassName(`${index + 1}`);
        if (collection && collection[0]) {
          let position = collection[0].getBoundingClientRect();
          collection[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.scrollTo({
          left: position.left,
          top: position.top + window.scrollY - 100,
          behavior: 'smooth'
        });
          collection[0].style.background = "lightblue";
          setTimeout(() => {
            collection[0].style.background = "white";
          }, 2000);
        }
      }, 100);
    },
    getFlexClass(choices) {
      const needsFullWidth = choices.some(choice => choice.choiceContent.length > 50);
      return needsFullWidth ? 'flex-100' : 'flex-auto';
    },
    handleBackToClassDetail() {
      this.$router.push({
        name: "quizExercise",
        params: { id: this.classId },
      });
    },
    addIndex(arr) {
      let newArr = [];
      arr.forEach((element, index) => {
        newArr.push({ ...element, index: index + 1 });
      });
      return newArr;
    },
    handleChangeStudentKey(val,quizIndex, answerIndex) {
      const keys = ["A", "B", "C", "D", "E"];
      const answerKey = val.target.value;
      this.quizzes[quizIndex].valueForRadio = answerKey;
      this.studentCheckedKeys[answerIndex].answer = keys[answerKey]
      this.handleSendkeyWithDebounce()
    }
  },
};
</script>

<style lang="scss" scoped>
span {
  color : black
}
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
.normal-answer {
  width: 15px;
  height: 15px;
  border: 1px solid white;
  background: white;
  border-radius: 20%;
}
.normal-answered {
  width: 15px;
  height: 15px;
  border: 1px solid #000;
  background: #000;
  border-radius: 20%;
}
.need-review-answer {
  width: 15px;
  height: 15px;
  border: 1px solid white;
  border-radius: 50%;
  background: white;
}
.need-review-answer-container {
  display: flex;
  align-items: center;
}
.need-review-answered {
  width: 15px;
  height: 15px;
  border: 1px solid #000;
  background: #000;
  border-radius: 50%;
}
.need-review-answer-label {
  color: black;
  margin-bottom: 1px;
  margin-left: 0.5rem;
}
.listening-site {
  height: 100%;
  background: #fff;
  margin-top: -2.5rem;
  padding: 0rem 0.5% 0rem 0.5%;
  display: flex;
}
.test-left {
  width: 75%;
  margin-top: 1rem;
}
.test-right {
  width: 22%;
  background: #edd31d;
  padding-left: 0.2rem;
  margin-top: 2.55rem;
  position: fixed;
  right: 0%;
  top: 2%;
  height: 100vh;
}
.sticky-note-container {
  height: 250px;
  width: 235px;
  background: #fff;
  position: absolute;
  border: 0.5px solid #000;
}
.sticky-note-header {
  height: 25px;
  justify-content: end;
  display: flex;
  background: #000;
}
.sticky-note-body {
  background: #fff;
}
.sticky-note-input {
  width: 100%;
  min-height: 219px;
}
.high-light-btn {
  padding: 1px;
  margin-left: 0.1rem;
  border-right: 1px solid #ccc;
}
.high-light-btn:hover {
  background: #5e5e5e;
}
.high-light-container {
  background: #000;
  width: fit-content;
  display: flex;
  justify-content: space-between;
  position: absolute;
  border-radius: 5px;
  user-select: none;
}
.type-of-answer {
  margin-left: 1rem;
  margin-top: 1.5rem;
}
.type-of-answer-item {
  display: flex;
}
.normal-primary-button {
  border-radius: 20%;
  margin-left: 10px;
  color: white;
  font-size: 13.5px;
  font-weight: 500;
  width: 40px !important;
}
.normal-button {
  border-radius: 20%;
  margin-left: 10px;
  font-size: 13.5px;
  font-weight: 500;
  width: 40px !important;
}
.resize-button-primary-number {
  border-radius: 20%;
  margin-left: 10px;
  color: white;
  font-size: 13.5px;
  font-weight: 500;
  width: 40px !important;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
}
.resize-button-number {
  margin-left: 10px;
  font-size: 13.5px;
  font-weight: 500;
  width: 40px !important;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  border-radius: 20%;
}
.resize-button-number span {
  margin-left: -5px;
}
.resize-button-primary-number span {
  margin-left: -5px;
}
.submit-btn {
  position: absolute;
  bottom: 15%;
  right: 10%;
}
.radio-style-multiple {
  display: flex;
  background: #f5f5f5;
  border-radius: 5px;
  margin-top: 0.5rem;
  padding: 10px;
}
.flex-25 { width: 25%; }
.flex-50 { width: 50%; }
.flex-100 { width: 100%; }

.flex-100 .flex-item { width: 100%;}
.flex-auto .flex-item { width: auto; min-width: 24%; } 
// .radio-style-multiple { margin-bottom: 16px; }
.choice-container {
  width: 100%; display: flex; flex-wrap: wrap; justify-content: space-between;
}
.choice-content {
  display: flex; align-items: center; margin-top: -3px
}
.remove-card-body-padding .ant-card-body {
  padding: 0px !important;
}
.ant-card-body {
  padding: 0px !important;
}
.remove-card-body-padding {
  position: fixed;
  width: 100%;
  padding: 0 1% 0 1%;
  z-index: 1000;
  .ant-card-body {
  padding: 0px !important;
}
}
.ant-collapse-header   {
  padding: unset !important;
}

.p-fix-content {
  width: fit-content;
}
::-webkit-scrollbar {
  width: 0px;
}
.radio-style {
  display: flex;
  justify-content: start;
  background: #f5f5f5;
  border-radius: 5px;
  margin-top: 0.5rem;
  padding: 10px;
  align-items: center;
}
.radio-style-multiple {
  display: flex;
  background: #f5f5f5;
  border-radius: 5px;
  margin-top: 0.5rem;
  padding: 10px;
}
.edu-editor img {
  width: 100% !important;
}
.edu-editor {
  p {
    color: black;
    font-weight: 400;
  }
}
div {
  color: black;
  font-weight: 400;
}
.ant-collapse-header {
  padding-bottom: 0px;
  cursor: pointer !important;
  color: black !important;
}
.set-margin-top {
  margin-top: -1.5rem;
}
.set-small-margin-top {
  margin-top: -1rem;
}
.answer-list {
  min-height: 150px;
}
.ant-btn-sm {
  height: 1.6rem;
  width: 1.6rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.edu-editor {
  overflow: scroll;
}
figure .table::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
figure .table::-webkit-scrollbar-track {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}
figure .table::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
}

.edu-editor img {
  width: 100% !important;
}
.edu-editor table {
  width: 100% !important;
  border: 0.5px solid black !important;
}
.edu-editor table td {
  border: 0.5px solid black !important;
}
.edu-editor table tr {
  border: 0.5px solid black !important;
}
.scc {
  max-width: 30em;
  display: block;
  padding: 10px;
  font-family: Sans-serif;
}
.scc audio {
  width: 100%;
  display: block;
  color: black;
}
.scc div {
  display: flex;
  padding: 0.5em 0;
  gap: 5px;
}
.scc label {
  flex: 1;
}
.scc input[type="range"] {
  flex: 5;
}
.scc span {
  flex: 1;
  text-align: center;
}
.custom-audio {
  margin-left: -1.2rem;
  width: 470px;
}
.review-style {
  display: flex;
  align-items: center;
  margin-left: 1.5rem;
  margin-top: 1rem;
}
audio::-webkit-media-controls-panel {
  background-color: #fff;
  /* border: 1px solid cadetblue */
}
#pbrate {
  border: solid 0.5px #ccc;
  background: linear-gradient(to right, #000 0%, #000 40%, #ccc 40%, #ccc 100%);
  border-radius: 8px;
  height: 4px;
  width: 400px;
  outline: none;
  transition: background 450ms ease-in;
  -webkit-appearance: none;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: none;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background: #5e5e5e;
}
.listening-site {
  height: 100%;
  background: #fff;
  margin-top: -2.5rem;
  padding: 0rem 0.5% 0rem 0.5%;
  display: flex;
}
.test-left {
  width: 75%;
  margin-top: 1rem;
}
.sticky-note-container {
  height: 250px;
  width: 235px;
  background: #fff;
  position: absolute;
  border: 0.5px solid #000;
}
.sticky-note-header {
  height: 25px;
  justify-content: end;
  display: flex;
  background: #000;
}
.sticky-note-body {
  background: #fff;
}
.sticky-note-input {
  width: 100%;
  min-height: 219px;
}
textarea:focus {
  outline: none !important;
}
.test-right {
  width: 22%;
  background: #edd31d;
  padding-left: 0.2rem;
  margin-top: 2.55rem;
  position: fixed;
  right: 0%;
  top: 2%;
  height: 100vh;
}
.test-left-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 22.8rem;
  margin: 2rem -1rem -1rem 0.5rem;
}
.normal-primary-button {
  border-radius: 20%;
  margin-left: 10px;
  color: white;
  font-size: 13.5px;
  font-weight: 500;
  width: 40px !important;
}
.normal-button {
  border-radius: 20%;
  margin-left: 10px;
  font-size: 13.5px;
  font-weight: 500;
  width: 40px !important;
}
.resize-button-primary-number {
  border-radius: 20%;
  margin-left: 10px;
  color: white;
  font-size: 13.5px;
  font-weight: 500;
  width: 40px !important;
}
.resize-button-number {
  margin-left: 10px;
  font-size: 13.5px;
  font-weight: 500;
  width: 40px !important;
  border-radius: 20%;
}
.resize-button-number span {
  margin-left: -5px;
}
.resize-button-primary-number span {
  margin-left: -5px;
}
.remove-card-body-padding .ant-card-body {
  padding: 0px !important;
}
.remove-card-body-padding {
  position: fixed;
  width: 100%;
  padding: 0 1% 0 1%;
  z-index: 1000;
}
.type-of-answer {
  margin-left: 1rem;
  margin-top: 1.5rem;
}
.type-of-answer-item {
  display: flex;
}
.need-review-answer {
  width: 15px;
  height: 15px;
  border: 1px solid white;
  border-radius: 50%;
  background: white;
}
.need-review-answer-container {
  display: flex;
  align-items: center;
}
.high-light-container {
  background: #000;
  width: fit-content;
  display: flex;
  justify-content: space-between;
  position: absolute;
  border-radius: 5px;
  user-select: none;
}
.high-light-btn {
  padding: 1px;
  margin-left: 0.1rem;
  border-right: 1px solid #ccc;
}
.high-light-btn:hover {
  background: #5e5e5e;
}
.need-review-answer-label {
  color: black;
  margin-bottom: 1px;
  margin-left: 0.5rem;
}
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
//  .range-slider__range::-webkit-slider-thumb:hover {
// 	 background: #1abc9c;
// }
//  .range-slider__range:active::-webkit-slider-thumb {
// 	 background: #1abc9c;
// }
.range-slider__range::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border: 0;
  border-radius: 50%;
  background: #2c3e50;
  cursor: pointer;
  transition: background 0.15s ease-in-out;
}
//  .range-slider__range::-moz-range-thumb:hover {
// 	 background: #1abc9c;
// }
//  .range-slider__range:active::-moz-range-thumb {
// 	 background: #1abc9c;
// }
//  .range-slider__range:focus::-webkit-slider-thumb {
// 	 box-shadow: 0 0 0 3px #fff, 0 0 0 6px #1abc9c;
// }
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
.btn_style {
  border: black;
}
.normal-answer {
  width: 15px;
  height: 15px;
  border: 1px solid white;
  background: white;
  border-radius: 20%;
}
.normal-answered {
  width: 15px;
  height: 15px;
  border: 1px solid #000;
  background: #000;
  border-radius: 20%;
}
.need-review-answered {
  width: 15px;
  height: 15px;
  border: 1px solid #000;
  background: #000;
  border-radius: 50%;
}
.submit-btn {
  position: absolute;
  bottom: 15%;
  right: 10%;
}
.test-right-for-mobile {
  position: fixed;
  bottom: -2px;
  width: 100vw;
  margin-left: -1%;
}
.responsive-content-box {
  background: #edd31d !important; 
  color: white;
  .ant-collapse-content-box {
    padding: 0px !important;
    background: #edd31d !important; 
  }
}
@media (max-width: 1200px) {
  .listening-site-responsive {
    padding: 0 1% 0 1% !important;
    height: 100vh;
  }
  .responsive-coundown-mobile {
    .ant-statistic-content-value {
      color: white;
    }
  }
  .responsive-listening-site-header {
    padding: 0 0% 0 1% !important;
  }
  .responsive-countdown {
    right: 1% !important;
  }
  .test-right {
    right: 1%;
    width: 34%;
  }
  .type-of-answer-item {
    display: grid;
  }
  .need-review-answer-container {
    margin-left: 0px !important;
  }
}
@media (max-width: 1050px) {
  .custom-audio {
    width: 50vw;
  }
  .slider-main {
    width: 35vw !important;
  }
  .slider-font-size {
    width: 35vw !important;
  }
}
.test-right-for-mobile {
  display: none;
}
@media (max-width: 1000px) {
  .test-right {
    display: none;
  }
  .test-left {
    width: 100%;
  }
  .responsive-reading-container {
    height: 100vh !important;
  }
  .responsive-reading-topic {
    height: 65vh !important;
  }
  .responsive-reading-question {
    height: 65vh !important;
  }
  .responsive-card-container {
    height: 74% !important;
  }
  .responsive-countdown {
    display: none !important;
  }
  .test-right-for-mobile {
    display: grid !important;
  }
  .responsive-content-collapse {
    height: 50vh !important;
    background: #edd31d !important;
    overflow: scroll;
  }
}

@media (max-width: 660px) {
  .responsive-card-container {
    height: 90% !important;
  }
  .responsive-reading {
    display: grid !important;
  }
  .responsive-divider {
    display: grid !important;
  }
  .responsive-reading-topic {
    width: 95vw !important;
    max-width: 100vw !important;
    height: 41vh !important;
    max-height: 45vh !important;
  }
  .responsive-reading-question {
    width: 95vw !important;
    max-width: 100vw !important;
    height: 40vh !important;
    max-height: 45vh !important;
  }
  .responsive-button-submit {
    bottom: 2px !important;
  }
}
@media only screen and (max-width: 1050px) and (orientation: portrait) {
  .responsive-card-container {
    height: 90% !important;
  }
  .responsive-divider {
    display: grid !important;
  }
  .responsive-reading {
    display: grid !important;
    height: 90%;
  }
  .responsive-reading-topic {
    width: 95vw !important;
    max-width: 100vw !important;
    height: 42vh !important;
    max-height: 45vh !important;
  }
  .responsive-reading-question {
    width: 95vw !important;
    max-width: 100vw !important;
    height: 40vh !important;
    max-height: 45vh !important;
  }
}
@media (max-width: 500px) {
  .responsive-listening-site-header-item {
    display: grid !important;
    margin-left: 0.5rem;
  }
  .custom-audio {
    width: 100vw;
  }
  .slider-main {
    width: 92vw !important;
    padding-bottom: 1rem;
  }
  .test-left {
    margin-top: 8.5rem !important;
    margin-bottom: 4rem !important;
  }
  .ant-collapse-content-box {
    padding: 0px !important;
    background: #edd31d !important

  }
  .responsive-card-container {
    height: 74% !important;
  }
  @media only screen and (max-width: 500px) and (orientation: landscape) {
  }
}
@media only screen and (max-width: 500px) and (orientation: portrait) {
  .responsive-card-container {
    height: 88% !important;
  }
  .responsive-reading-topic {
    width: 90vw !important;
    height: 39vh !important;
  }
  .responsive-reading-question {
    width: 90vw !important;
    height: 39vh !important;
  }
}
</style>
