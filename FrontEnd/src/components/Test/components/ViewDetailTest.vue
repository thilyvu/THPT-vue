<template>
  <div>
    <TableLoading v-if="loading" />
    <a-row v-else :gutter="30">
      <a-col :span="8" style="position: fixed">
        <b style="font-size: 24px; text-transform: uppercase"
          >Test details</b
        >
        <a-card style="margin-top: 1rem">
          <a-space direction="vertical" style="width: 100%">
            <b>Test name</b>
            <a-input placeholder="Enter the test name" v-model="testName" />
            <b>Description</b>
            <a-input placeholder="Enter a description" v-model="testDescription" />
            <b>Time for the test</b>
            <a-range-picker
              style="width: 100%"
              :default-value="[
                moment(new Date(), dateFormat),
                moment(new Date(), dateFormat),
              ]"
              :format="dateFormat"
              v-model="testDate"
              v
            />
            <div style="display: flex; justify-content: space-between">
              <div style="display: grid; width: 40%">
                <b>Time to take the test</b>
                <a-time-picker
                  style="width: 150px; margin-top: 0.5rem"
                  :default-open-value="moment('00:00:00', 'HH:mm:ss')"
                  v-model="countDown"
                  value-format="HH:mm:ss"
                >
                </a-time-picker>
              </div>
              <div style="display: grid; width: 60%">
                <b>Subject</b>
                <a-select
                  style="width: 100%; margin-top: 0.5rem"
                  placeholder="Please select"
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
            <b>Choose the number of exercises</b>
            <a-select
              style="width: 100%"
              :disabled="true"
              placeholder="Choose the number of articles"
              v-model="totalTopics"
              @change="handleChangeNumberExercise"
            >
              <a-select-option v-for="item in 10" :key="item" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
            <div style="display: flex">
              <b>Show scores after submitting the test</b>
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
        <v-btn @click="cancel" style="width: 100%; margin-top: 10px"
          >Back to the exercise list
        </v-btn>
      </a-col>
      <a-col :span="8"></a-col>
      <a-col :span="16">
        <a-collapse
          :bordered="false"
          v-for="(topic, topicIndex) in listTopics"
          :key="topicIndex"
          :value="topic"
        >
          <template #expandIcon="props">
            <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
          </template>

          <a-collapse-panel
            :key="topicIndex + 1"
            :header="`Exercise ${topicIndex + 1}`"
            style="font-weight: 600"
          >
            <a-card>
              <b>Exercise name {{ topicIndex + 1 }} </b>
              <a-input
                style="margin-top: 0.5rem; margin-bottom: 0.5rem"
                placeholder="Enter the exercise name"
                v-model="topic.topicName"
              />
              <br />
              <b>Contents of exercises {{ topicIndex + 1 }}</b>
              <vue-editor
                :id="makeid(5)"
                style="margin-top: 0.5rem; margin-bottom: 0.5rem"
                v-model.trim="topic.content"
              ></vue-editor>
              <b>Choose the number of question groups</b>
              <a-select
                :disabled="true"
                style="width: 100%; margin-top: 0.5rem; margin-bottom: 0.5rem"
                placeholder="Choose the number of groups"
                v-model="topic.totalQuestionGroups"
                @change="handleChangeNumberOfQuestionGroup(topic)"
              >
                <a-select-option v-for="item in 10" :key="item" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-card>
            <div>
              <a-collapse
                :bordered="false"
                v-for="(
                  questionGroup, questionGroupIndex
                ) in topic.listQuestionGroups"
                :key="questionGroupIndex"
                :value="questionGroup"
              >
                <template #expandIcon="props">
                  <a-icon
                    type="caret-right"
                    :rotate="props.isActive ? 90 : 0"
                  />
                </template>
                <a-collapse-panel
                  :key="questionGroupIndex + 1"
                  :header="`Question group ${questionGroupIndex + 1}`"
                >
                  <a-card>
                    <b>
                      Instructions for the question group {{ questionGroupIndex + 1 }}</b
                    >
                    <vue-editor
                      :id="makeid(5)"
                      style="margin-top: 0.5rem; margin-bottom: 0.5rem"
                      v-model.trim="questionGroup.content"
                    ></vue-editor>
                    <div>
                      <a-collapse
                        :bordered="false"
                        v-for="(
                          question, questionIndex
                        ) in questionGroup.listQuestions"
                        :key="questionIndex"
                        :value="question"
                      >
                        <template #expandIcon="props">
                          <a-icon
                            type="caret-right"
                            :rotate="props.isActive ? 90 : 0"
                          />
                        </template>
                        <a-collapse-panel
                          :key="questionIndex + 1"
                          :header="`Question ${questionIndex + 1}`"
                        >
                          <a-card>
                            <div
                              style="
                                display: flex;
                                justify-content: space-between;
                              "
                            >
                              <div>
                                <b>Index </b>
                                <a-input
                                  style="width: 50px; margin-left: 10px"
                                  placeholder="Index"
                                  v-model="question.questionNumber"
                                />
                                <b style="margin-left: 1rem">Number of sentences </b>
                                <a-select
                                  :disabled="true"
                                  style="width: 60px; margin-left: 10px"
                                  placeholder="Choose number of questions"
                                  v-model="question.numberOfQuestion"
                                >
                                  <a-select-option
                                    v-for="item in 10"
                                    :key="item"
                                    :value="item"
                                  >
                                    {{ item }}
                                  </a-select-option>
                                </a-select>
                                <b style="margin-left: 1rem"> Type of question </b>
                                <a-select
                                  :disabled="true"
                                  style="width: 350px; margin-left: 15px"
                                  placeholder="Choose question type"
                                  v-model="question.questionType"
                                  @change="
                                    (val) => (question.questionType = val)
                                  "
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

                              <div></div>
                            </div>
                            <div>
                              <a-textarea
                                style="width: 100%; margin-top: 0.5rem"
                                placeholder="Enter a title for the question"
                                v-model="question.questionTitle"
                              />
                            </div>
                            <a-divider style="margin: 12px 12px 12px 0px" />
                            <!-- True/False/Not Given -->
                            <div
                              v-if="
                                question.questionType === 'True/False/Not Given'
                              "
                              style="margin-top: 0.5rem; width: 100%"
                            >
                              <b>Question</b>
                              <vue-editor
                                :id="makeid(5)"
                                style="margin-top: 0.5rem"
                                v-model.trim="question.questionContent"
                              ></vue-editor>
                              <a-radio-group
                                style="width: 100%"
                                v-model="question.valueForRadio"
                                @change="
                                  () => {
                                    question.valueForRadio === 0
                                      ? (question.listKeys = ['True'])
                                      : question.valueForRadio === 1
                                      ? (question.listKeys = ['False'])
                                      : (question.listKeys = ['Not Given']);
                                  }
                                "
                              >
                                <div
                                  style="
                                    display: flex;
                                    justify-content: space-between;
                                    background: #f5f5f5;
                                    border-radius: 5px;
                                    padding: 8px;
                                    margin-top: 0.5rem;
                                  "
                                >
                                  <b> True </b>
                                  <div>
                                    <b>Correct</b>
                                    <a-radio
                                      style="margin-left: 1rem"
                                      :value="0"
                                    >
                                    </a-radio>
                                  </div>
                                </div>

                                <div
                                  style="
                                    display: flex;
                                    justify-content: space-between;
                                    background: #f5f5f5;
                                    border-radius: 5px;
                                    padding: 8px;
                                    margin-top: 0.5rem;
                                  "
                                >
                                  <b> False </b>
                                  <div>
                                    <b>Correct</b>
                                    <a-radio
                                      style="margin-left: 1rem"
                                      :value="1"
                                    >
                                    </a-radio>
                                  </div>
                                </div>

                                <div
                                  style="
                                    display: flex;
                                    justify-content: space-between;
                                    background: #f5f5f5;
                                    border-radius: 5px;
                                    padding: 8px;
                                    margin-top: 0.5rem;
                                  "
                                >
                                  <b> Not Given </b>
                                  <div>
                                    <b>Correct</b>
                                    <a-radio
                                      style="margin-left: 1rem"
                                      :value="2"
                                    >
                                    </a-radio>
                                  </div>
                                </div>
                              </a-radio-group>
                            </div>
                            <!-- Yes/No/Not Given -->
                            <div
                              v-if="
                                question.questionType === 'Yes/No/Not Given'
                              "
                              style="margin-top: 0.5rem; width: 100%"
                            >
                              <b>Câu hỏi</b>
                              <vue-editor
                                :id="makeid(5)"
                                style="margin-top: 0.5rem"
                                v-model.trim="question.questionContent"
                              ></vue-editor>
                              <a-radio-group
                                style="width: 100%"
                                v-model="question.valueForRadio"
                                @change="
                                  () => {
                                    question.valueForRadio === 0
                                      ? (question.listKeys = ['Yes'])
                                      : question.valueForRadio === 1
                                      ? (question.listKeys = ['No'])
                                      : (question.listKeys = ['Not Given']);
                                  }
                                "
                              >
                                <div
                                  style="
                                    display: flex;
                                    justify-content: space-between;
                                    background: #f5f5f5;
                                    border-radius: 5px;
                                    padding: 8px;
                                    margin-top: 0.5rem;
                                  "
                                >
                                  <b> Yes </b>
                                  <div>
                                    <b>Correct</b>
                                    <a-radio
                                      style="margin-left: 1rem"
                                      :value="0"
                                    >
                                    </a-radio>
                                  </div>
                                </div>

                                <div
                                  style="
                                    display: flex;
                                    justify-content: space-between;
                                    background: #f5f5f5;
                                    border-radius: 5px;
                                    padding: 8px;
                                    margin-top: 0.5rem;
                                  "
                                >
                                  <b> No </b>
                                  <div>
                                    <b>Correct</b>
                                    <a-radio
                                      style="margin-left: 1rem"
                                      :value="1"
                                    >
                                    </a-radio>
                                  </div>
                                </div>

                                <div
                                  style="
                                    display: flex;
                                    justify-content: space-between;
                                    background: #f5f5f5;
                                    border-radius: 5px;
                                    padding: 8px;
                                    margin-top: 0.5rem;
                                  "
                                >
                                  <b> Not Given </b>
                                  <div>
                                    <b>Correct</b>
                                    <a-radio
                                      style="margin-left: 1rem"
                                      :value="2"
                                    >
                                    </a-radio>
                                  </div>
                                </div>
                              </a-radio-group>
                            </div>
                            <!-- Summary Completion -->
                            <div
                              v-if="
                                question.questionType === 'Summary Completion'
                              "
                              style="margin-top: 0.5rem"
                            >
                              <b>Question and answer content</b>
                              <br />
                              <vue-editor
                                :id="makeid(5)"
                                style="margin-top: 0.5rem"
                                v-model.trim="question.questionContent"
                              ></vue-editor>
                              <p style="margin-top: 0.5rem">
                                <b>Example:</b> Deborah was angry at her son. Her
                                son didn't <b>[Listen]</b> to her. Her son was
                                16 years old. Her son
                                <b>[thought]</b>
                                he knew everything. Her son <b>[yelled]</b> at
                                Deborah
                                <b></b>
                              </p>
                            </div>
                            <!-- Multiple choice with one answer -->
                            <div
                              v-if="
                                question.questionType ===
                                'Multiple choice with one answer'
                              "
                            >
                              <b>Question</b>
                              <vue-editor
                                :id="makeid(5)"
                                style="margin-top: 0.5rem"
                                v-model.trim="question.questionContent"
                              ></vue-editor>

                              <a-radio-group
                                v-model="question.valueForRadio"
                                v-for="(
                                  answer, answerIndex
                                ) in question.listAnswers"
                                :key="answerIndex"
                                :value="answer"
                                @change="
                                  (val) => {
                                    question.listKeys = [
                                      question.listAnswers[
                                        question.valueForRadio
                                      ],
                                    ];
                                  }
                                "
                                style="
                                  display: flex;
                                  justify-content: space-between;
                                  background: #f5f5f5;
                                  border-radius: 5px;
                                  padding: 8px;
                                  margin-top: 0.5rem;
                                "
                              >
                                <div style="padding: 10px; max-width: 80%">
                                  <b>
                                    {{ `${answerIndex + 1}. ` }}
                                  </b>
                                  <b>{{ answer }}</b>
                                </div>

                                <div style="padding: 10px">
                                  <b>Correct</b>

                                  <a-radio
                                    style="margin-left: 1rem"
                                    :value="answerIndex"
                                  >
                                  </a-radio>
                                </div>
                              </a-radio-group>
                              <!-- <div style="display: flex; margin-top: 0.5rem">
                                <a-input
                                  placeholder="Nhập câu trả lời mới"
                                  v-model="question.newAnswerText"
                                  style="width: 100%"
                                  @pressEnter="
                                    (val) =>
                                      handleAddAnswer(
                                        val,
                                        question,
                                        question.listAnswers
                                      )
                                  "
                                >
                                  <a-icon slot="prefix" type="plus"
                                /></a-input>
                              </div> -->
                            </div>
                            <!-- Multiple choice with more than one answer -->
                            <div
                              v-if="
                                question.questionType ===
                                'Multiple choice with more than one answer'
                              "
                            >
                              <b>Câu hỏi</b>
                              <vue-editor
                                :id="makeid(5)"
                                style="margin-top: 0.5rem"
                                v-model.trim="question.questionContent"
                              ></vue-editor>

                              <div
                                v-for="(
                                  answer, answerIndex
                                ) in question.listAnswers"
                                :key="answerIndex"
                                :value="answer"
                                style="
                                  display: flex;
                                  justify-content: space-between;
                                  background: #f5f5f5;
                                  border-radius: 5px;
                                  padding: 8px;
                                  margin-top: 0.5rem;
                                "
                              >
                                <div style="padding: 10px; max-width: 80%">
                                  <b>
                                    {{ `${answerIndex + 1}. ` }}
                                  </b>
                                  <b>{{ answer }}</b>
                                </div>
                                <div style="padding: 10px; display: flex">
                                  <b>Correct</b>
                                  <v-checkbox
                                    v-if="
                                      question.listKeys.indexOf(
                                        question.listAnswers[answerIndex]
                                      ) === -1
                                    "
                                    @change="
                                      (val) =>
                                        handleAddAnswerKeyCheckBox(
                                          val,
                                          question,
                                          answerIndex
                                        )
                                    "
                                    style="
                                      margin-left: 1rem;
                                      height: 10px;
                                      margin-top: -5px;
                                      margin-right: 0.5rem;
                                    "
                                  >
                                  </v-checkbox>
                                  <v-checkbox
                                    v-else
                                    @change="
                                      (val) =>
                                        handleAddAnswerKeyCheckBox(
                                          val,
                                          question,
                                          answerIndex
                                        )
                                    "
                                    style="
                                      margin-left: 1rem;
                                      height: 10px;
                                      margin-top: -5px;
                                      margin-right: 0.5rem;
                                    "
                                    v-model="checked"
                                  >
                                  </v-checkbox>
                                </div>
                              </div>
                              <!-- <div style="display: flex; margin-top: 0.5rem">
                                <a-input
                                  placeholder="Nhập câu trả lời mới"
                                  v-model="question.newAnswerText"
                                  style="width: 100%"
                                  @pressEnter="
                                    (val) =>
                                      handleAddAnswer(
                                        val,
                                        question,
                                        question.listAnswers
                                      )
                                  "
                                >
                                  <a-icon slot="prefix" type="plus"
                                /></a-input>
                              </div> -->
                            </div>
                            <!-- Flow-chart Completion -->
                            <div
                              v-if="
                                question.questionType ===
                                'Flow-chart Completion'
                              "
                            >
                              <b>Question</b>
                              <vue-editor
                                :id="makeid(5)"
                                style="margin-top: 0.5rem"
                                v-model.trim="question.questionContent"
                              ></vue-editor>

                              <div
                                v-for="(
                                  answer, answerIndex
                                ) in question.listAnswers"
                                :key="answerIndex"
                                :value="answer"
                                style="
                                  display: flex;
                                  justify-content: space-between;
                                  background: #f5f5f5;
                                  border-radius: 5px;
                                  padding: 8px;
                                  margin-top: 0.5rem;
                                "
                              >
                                <div style="padding: 10px; max-width: 80%">
                                  <b> {{ `${answerIndex + 1}. ` }} </b>
                                  <b>{{ answer }}</b>
                                </div>

                                <div style="padding: 10px"></div>
                              </div>
                              <!-- <div style="display: flex; margin-top: 0.5rem">
                                <a-input
                                  placeholder="Nhập câu trả lời mới"
                                  v-model="question.newAnswerText"
                                  style="width: 100%"
                                  @pressEnter="
                                    (val) =>
                                      handleAddAnswer(
                                        val,
                                        question,
                                        question.listAnswers
                                      )
                                  "
                                >
                                  <a-icon slot="prefix" type="plus"
                                /></a-input>
                              </div> -->
                              <!-- <p style="margin-top: 0.5rem">
                                <b>Ví dụ:</b> <b>[Listen]</b> Từ khóa cần điền
                                sẽ nằm bên trong ngoặc vuông
                              </p> -->
                            </div>
                            <!-- Sentence Completion -->
                            <div
                              v-if="
                                question.questionType === 'Sentence Completion'
                              "
                            >
                              <b>Question</b>
                              <vue-editor
                                :id="makeid(5)"
                                style="margin-top: 0.5rem"
                                v-model.trim="question.questionContent"
                              ></vue-editor>

                              <div
                                v-for="(
                                  answer, answerIndex
                                ) in question.listAnswers"
                                :key="answerIndex"
                                :value="answer"
                                style="
                                  display: flex;
                                  justify-content: space-between;
                                  background: #f5f5f5;
                                  border-radius: 5px;
                                  padding: 8px;
                                  margin-top: 0.5rem;
                                "
                              >
                                <div style="padding: 10px; max-width: 80%">
                                  <b> {{ `${answerIndex + 1}. ` }} </b>
                                  <b>{{ answer }}</b>
                                </div>

                                <div style="padding: 10px"></div>
                              </div>
                              <!-- <div style="display: flex; margin-top: 0.5rem">
                                <a-input
                                  placeholder="Nhập câu trả lời mới"
                                  v-model="question.newAnswerText"
                                  style="width: 100%"
                                  @pressEnter="
                                    (val) =>
                                      handleAddAnswer(
                                        val,
                                        question,
                                        question.listAnswers
                                      )
                                  "
                                >
                                  <a-icon slot="prefix" type="plus"
                                /></a-input>
                              </div>
                              <p style="margin-top: 0.5rem">
                                Đối với dạng câu hỏi này thì đề bài và đáp án sẽ
                                điền chung ở phần thêm câu hỏi
                                <br />
                                <b>Ví dụ:</b>
                                <br />
                                <b>Câu 1 :</b> Deborah was angry at her son. Her
                                son didn't <b>[Listen]</b>
                                <br />
                                Từ khóa cần điền sẽ nằm bên trong ngoặc vuông
                              </p> -->
                            </div>
                            <!-- Matching Headings -->
                            <div
                              v-if="
                                question.questionType === 'Matching Headings'
                              "
                            >
                              <b>Question</b>
                              <vue-editor
                                :id="makeid(5)"
                                style="margin-top: 0.5rem"
                                v-model.trim="question.questionContent"
                              ></vue-editor>

                              <div
                                v-for="(
                                  answer, answerIndex
                                ) in question.listAnswers"
                                :key="answerIndex"
                                :value="answer"
                                style="
                                  display: flex;
                                  justify-content: space-between;
                                  background: #f5f5f5;
                                  border-radius: 5px;
                                  padding: 8px;
                                  margin-top: 0.5rem;
                                "
                              >
                                <div style="padding: 10px; max-width: 80%">
                                  <b> {{ `${answerIndex + 1}. ` }} </b>
                                  <b>{{ answer }}</b>
                                </div>

                                <div style="padding: 10px"></div>
                              </div>
                              <!-- <div style="display: flex; margin-top: 0.5rem">
                                <a-input
                                  placeholder="Nhập câu trả lời mới"
                                  v-model="question.newAnswerText"
                                  style="width: 100%"
                                  @pressEnter="
                                    (val) =>
                                      handleAddAnswer(
                                        val,
                                        question,
                                        question.listAnswers
                                      )
                                  "
                                >
                                  <a-icon slot="prefix" type="plus"
                                /></a-input>
                              </div> -->
                              <!-- <p style="margin-top: 0.5rem">
                                Đối với dạng câu hỏi này thì các đáp án đúng cho
                                câu nào sẽ thêm vào [ ]
                                <br />
                                <b>Ví dụ:</b>
                                <br />
                                A lack of invesment in driver
                                <b>[training ]</b>
                                <br />
                                How a maths experiment actually reduced traffic
                                congestion
                              </p> -->
                            </div>
                            <!--  Matching Sentence Endings -->
                            <div
                              v-if="
                                question.questionType ===
                                'Matching Sentence Endings'
                              "
                            >
                              <b>Question</b>
                              <vue-editor
                                :id="makeid(5)"
                                style="margin-top: 0.5rem"
                                v-model.trim="question.questionContent"
                              ></vue-editor>

                              <div
                                v-for="(
                                  answer, answerIndex
                                ) in question.listAnswers"
                                :key="answerIndex"
                                :value="answer"
                                style="
                                  display: flex;
                                  justify-content: space-between;
                                  background: #f5f5f5;
                                  border-radius: 5px;
                                  padding: 8px;
                                  margin-top: 0.5rem;
                                "
                              >
                                <div style="padding: 10px; max-width: 80%">
                                  <b> {{ `${answerIndex + 1}. ` }} </b>
                                  <b>{{ answer }}</b>
                                </div>

                                <div style="padding: 10px"></div>
                              </div>
                              <!-- <div style="display: flex; margin-top: 0.5rem">
                                <a-input
                                  placeholder="Nhập câu trả lời mới"
                                  v-model="question.newAnswerText"
                                  style="width: 100%"
                                  @pressEnter="
                                    (val) =>
                                      handleAddAnswer(
                                        val,
                                        question,
                                        question.listAnswers
                                      )
                                  "
                                >
                                  <a-icon slot="prefix" type="plus"
                                /></a-input>
                              </div>
                              <p style="margin-top: 0.5rem">
                                Đối với dạng câu hỏi này thì những câu hỏi sẽ
                                được điền cùng với câu trả lời trong [ ] và
                                những lựa chọn thêm sẽ được điền và không có
                                ngoặc vuông
                                <br />
                                <b>Ví dụ:</b>
                                <br />
                                <b>Câu hỏi và đáp án :</b> Harkness’s research
                                method was different to that of other writers
                                because
                                <b
                                  >[She started by seeking to understand how
                                  basic term were used in the past]</b
                                >
                                <br />
                                <b>Lựa chọn thêm :</b> She has the greatest
                                knowledge of Elizabethan London
                                <br />
                              </p> -->
                            </div>
                            <!-- Summary Completion 2 -->
                            <div
                              v-if="
                                question.questionType === 'Summary Completion 2'
                              "
                              style="margin-top: 0.5rem"
                            >
                              <b>Question and answer content</b>
                              <br />
                              <vue-editor
                                :id="makeid(5)"
                                style="margin-top: 0.5rem"
                                v-model.trim="question.questionContent"
                              ></vue-editor>
                              <div
                                v-for="(
                                  answer, answerIndex
                                ) in question.listAnswers"
                                :key="answerIndex"
                                :value="answer"
                                style="
                                  display: flex;
                                  justify-content: space-between;
                                  background: #f5f5f5;
                                  border-radius: 5px;
                                  padding: 8px;
                                  margin-top: 0.5rem;
                                "
                              >
                                <div style="padding: 10px; max-width: 80%">
                                  <b> {{ `${answerIndex + 1}. ` }} </b>
                                  <b>{{ answer }}</b>
                                </div>

                                <div style="padding: 10px"></div>
                              </div>
                              <!-- <div style="display: flex; margin-top: 0.5rem">
                                <a-input
                                  placeholder="Nhập câu trả lời mới"
                                  v-model="question.newAnswerText"
                                  style="width: 100%"
                                  @pressEnter="
                                    (val) =>
                                      handleAddAnswer(
                                        val,
                                        question,
                                        question.listAnswers
                                      )
                                  "
                                >
                                  <a-icon slot="prefix" type="plus"
                                /></a-input>
                              </div> -->
                              <!-- <p style="margin-top: 0.5rem">
                                Đối với dạng đoạn văn thì đoạn văn và đáp án sẽ
                                điền vào phần nội dung như ví dụ bên dưới
                                <br />
                                <b
                                  >Những lựa chọn thêm sẽ được thêm ở phần thêm
                                  câu trả lời</b
                                >
                                <br />
                                <b>Ví dụ:</b> Deborah was angry at her son. Her
                                son didn't <b>[Listen]</b> to her. Her son was
                                16 years old. Her son
                                <b>[thought]</b>
                                he knew everything. Her son <b>[yelled]</b> at
                                Deborah
                              </p> -->
                            </div>
                            <!-- Note Completion -->
                            <div
                              v-if="question.questionType === 'Note Completion'"
                            >
                              <b>Question</b>
                              <vue-editor
                                :id="makeid(5)"
                                style="margin-top: 0.5rem"
                                v-model.trim="question.questionContent"
                              ></vue-editor>

                              <div
                                v-for="(
                                  answer, answerIndex
                                ) in question.listAnswers"
                                :key="answerIndex"
                                :value="answer"
                                style="
                                  display: flex;
                                  justify-content: space-between;
                                  background: #f5f5f5;
                                  border-radius: 5px;
                                  padding: 8px;
                                  margin-top: 0.5rem;
                                "
                              >
                                <div style="padding: 10px; max-width: 80%">
                                  <b> {{ `${answerIndex + 1}. ` }} </b>
                                  <b>{{ answer }}</b>
                                </div>

                                <div style="padding: 10px"></div>
                              </div>
                              <!-- <div style="display: flex; margin-top: 0.5rem">
                                <a-input
                                  placeholder="Nhập câu trả lời mới"
                                  v-model="question.newAnswerText"
                                  style="width: 100%"
                                  @pressEnter="
                                    (val) =>
                                      handleAddAnswer(
                                        val,
                                        question,
                                        question.listAnswers
                                      )
                                  "
                                >
                                  <a-icon slot="prefix" type="plus"
                                /></a-input>
                              </div>
                              <p style="margin-top: 0.5rem">
                                Đối với dạng câu hỏi này thì đề bài và đáp án sẽ
                                điền chung ở phần thêm câu hỏi
                                <br />
                                <b>Ví dụ:</b>
                                <br />
                                <b> câu 1:</b> Deborah was <b>[angry]</b> at her
                                son. Her son didn't Listen
                                <br />
                                Từ khóa cần điền sẽ nằm bên trong ngoặc vuông
                              </p> -->
                            </div>

                            <!-- Matching Information -->
                            <div
                              v-if="
                                question.questionType === 'Matching Information'
                              "
                            >
                              <b>Question</b>
                              <vue-editor
                                :id="makeid(5)"
                                style="margin-top: 0.5rem"
                                v-model.trim="question.questionContent"
                              ></vue-editor>
                              <div
                                style="
                                  margin-top: 0.5rem;
                                  margin-bottom: 0.5rem;
                                "
                              >
                                <b>Answers </b>
                                <a-select
                                  style="width: 60px; margin-left: 10px"
                                  @change="
                                    (val) => {
                                      question.listKeys = [
                                        formatStartOfQuestion(val - 1),
                                      ];
                                    }
                                  "
                                  v-model="question.listKeys[0]"
                                >
                                  <a-select-option
                                    v-for="(item, index) in 27"
                                    :key="item"
                                    :value="item"
                                    :disabled="true"
                                  >
                                    {{ formatStartOfQuestion(index) }}
                                  </a-select-option>
                                </a-select>
                              </div>
                              <!-- <b>
                                Dạng câu hỏi này câu hỏi sẽ điền ở trên và đáp
                                án sẽ chọn bên dưới
                              </b> -->
                            </div>
                          </a-card>
                        </a-collapse-panel>
                      </a-collapse>
                    </div>
                  </a-card>
                  <!-- <div style="text-align: end">
                    <v-btn
                      depressed
                      small
                      @click="handleAddQuestion(questionGroup)"
                      style="width: 200px; margin-top: 10px"
                      >+ Thêm câu hỏi
                    </v-btn>
                  </div> -->
                </a-collapse-panel>
              </a-collapse>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import MasterData from "../../../api/MasterData";
import { VueEditor } from "vue2-quill-editor";
import { NotificationMixin } from "../../../mixin/Notification";
import Test from "../../../api/Test";
import QuestionType from "../../../api/QuestionType";
import TableLoading from "../../../components/Base/TableLoading.vue";
import { cloneDeep } from "lodash";
export default {
  mixins: [NotificationMixin],
  components: {
    VueEditor,
    TableLoading,
  },
  data() {
    return {
      testName: "",
      testDescription: "",
      classCode: "",
      description: "",
      img: "",
      isApprove: false,
      subject: "",
      grade: "",
      gradeData: [],
      subjectData: [],
      dateFormat: "YYYY/MM/DD",
      totalTopics: undefined,
      activeKey: [1],
      testDate: null,
      listTopics: [],
      listQuestionType: [],
      answerText: "",
      randomString: Math.random()
        .toString(36)
        .replace(/[^#a-z]+/g, "")
        .substr(0, 5),
      valueForRadio: 0,
      oldTotalTopic: 0,
      isShowPoint: false,
      UpdateLoading: false,
      countDown: null,
      checked: true,
      loading: false,
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
    this.loading = true;
    Test.getTestByIdTeacherRole(this.$route.params.id)
      .then((response) => {
        const data = response.data.data;
        this.testName = data.testName;
        this.testDescription = data.testDescription;
        this.totalTopics = data.totalTopics;
        this.listTopics = data.listTopics;
        this.isShowPoint = data.isShowPoint ? data.isShowPoint : false;
        this.countDown = data.countDownTime ? data.countDownTime : null;
        this.loading = false;
        this.subject = data.subject ? data.subject : "";
      })
      .catch((e) => {
        console.log("e", e);
        this.loading = false;
      });
    QuestionType.getListQuestionType()
      .then((response) => {
        this.listQuestionType = response.data.data;
      })
      .catch((e) => {
        console.log("e", e);
      });
  },
  computed: {},
  methods: {
    handleChangeNumberExercise(val) {
      if (this.oldTotalTopic > 0 && this.oldTotalTopic < this.totalTopics) {
        for (let i = this.oldTotalTopic; i < val; i++) {
          const topic = {
            topicName: "",
            description: "",
            content: "",
            disabled: false,
            oldTotalQuestionGroups: 0,
            totalQuestionGroups: undefined,
            listQuestionGroups: [],
            listQuestions: [],
            listKeys: [],
          };
          this.listTopics.push(topic);
        }
      }
      if (this.oldTotalTopic > 0 && this.oldTotalTopic > this.totalTopics) {
        for (let j = val; j < this.oldTotalTopic; j++) {
          this.listTopics.splice(val, 1);
        }
      }
      if (this.oldTotalTopic === 0) {
        this.totalTopics = val;
        this.listTopics = [];
        for (let k = 0; k < val; k++) {
          const topic = {
            topicName: "",
            description: "",
            content: "",
            disabled: false,
            listQuestions: [],
            listKeys: [],
            oldTotalQuestionGroups: 0,
            totalQuestionGroups: undefined,
            listQuestionGroups: [],
          };
          this.listTopics.push(topic);
        }
      }

      this.oldTotalTopic = this.totalTopics;
    },
    handleChangeNumberOfQuestionGroup(topic) {
      if (
        topic.oldTotalQuestionGroups > 0 &&
        topic.oldTotalQuestionGroups < topic.totalQuestionGroups
      ) {
        for (
          let i = topic.oldTotalQuestionGroups;
          i < topic.totalQuestionGroups;
          i++
        ) {
          const questionGroup = {
            content: "",
            listQuestions: [],
          };
          topic.listQuestionGroups.push(questionGroup);
        }
      }
      if (
        topic.oldTotalQuestionGroups > 0 &&
        topic.oldTotalQuestionGroups > topic.totalQuestionGroups
      ) {
        for (
          let j = topic.totalQuestionGroups;
          j < topic.oldTotalQuestionGroups;
          j++
        ) {
          topic.listQuestionGroups.splice(topic.totalQuestionGroups, 1);
        }
      }
      if (topic.oldTotalQuestionGroups === 0) {
        topic.listQuestionGroups = [];
        for (let k = 0; k < topic.totalQuestionGroups; k++) {
          const questionGroup = {
            content: "",
            listQuestions: [],
          };
          topic.listQuestionGroups.push(questionGroup);
        }
      }
      topic.oldTotalQuestionGroups = topic.totalQuestionGroups;
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

    handleAddQuestion(index) {
      const newQuestion = {
        questionName: "Câu hỏi thứ",
        description: "",
        disabled: false,
        numberOfQuestion: 1,
        listAnswers: [],
        questionContent: "",
        questionContentWithoutKey: "",
        listAnswersWithoutKey: [],
        listKeys: [],
        questionType: undefined,
        valueForRadio: null,
        newAnswerText: "",
      };
      this.listTopics[index].listQuestions.push(newQuestion);
    },
    handleAddAnswer(val, question, listAnswers) {
      const newAnswer = {
        id: this.makeid(5),
        answerContent: question.newAnswerText,
      };
      listAnswers.push(newAnswer);
      question.newAnswerText = "";
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
          character = "xx";
          break;
        case 24:
          character = "xxi";
          break;
        case 25:
          character = "xxii";
          break;
        case 26:
          character = "xxiii";
          break;
        case 27:
          character = "xxiv";
          break;
        case 28:
          character = "xxv";
          break;
      }
      return character;
    },
    handleAddAnswerKeyCheckBox(val, question, answerIndex) {
      if (
        val &&
        question.listKeys.indexOf(question.listAnswers[answerIndex]) === -1
      ) {
        question.listKeys.push(question.listAnswers[answerIndex]);
      } else {
        if (
          question.listKeys.indexOf(question.listAnswers[answerIndex]) !== -1
        ) {
          question.listKeys.splice(
            question.listKeys.indexOf(question.listAnswers[answerIndex]),
            1
          );
        }
      }
      this.checked = true;
    },
    handleSubmit() {
      this.UpdateLoading = true;
      let totalQuestion = 0;
      this.listTopics.length > 0
        ? this.listTopics.map((topic) => {
            topic.listQuestionGroups.map((questionGroup) => {
              questionGroup.listQuestions.map((question) => {
                totalQuestion += question.numberOfQuestion;
                if (
                  question.questionType === "True/False/Not Given" ||
                  question.questionType === "Yes/No/Not Given"
                ) {
                  question.questionContentWithoutKey = question.questionContent;
                  if (question.questionType === "True/False/Not Given") {
                    question.listAnswersWithoutKey = [];
                    question.listAnswers = [];
                    ["True", "False", "Not Given"].map((answer) => {
                      question.listAnswersWithoutKey.push(answer);
                      question.listAnswers.push(answer);
                    });
                  } else {
                    question.listAnswersWithoutKey = [];
                    question.listAnswers = [];
                    ["Yes", "No", "Not Given"].map((answer) => {
                      question.listAnswersWithoutKey.push(answer);
                      question.listAnswers.push(answer);
                    });
                  }
                } else if (
                  question.questionType === "Summary Completion" ||
                  question.questionType === "Summary Completion 2" ||
                  question.questionType === "Note Completion"
                ) {
                  question.questionContentWithoutKey =
                    this.handleCropStringInBracket(
                      question.questionContent
                    ).replacedStr;
                  question.listAnswersWithoutKey = cloneDeep(
                    question.listAnswers
                  ); // get the answers but not with key
                  question.listKeys = [];
                  this.handleCropStringInBracket(
                    question.questionContent
                  ).listItem.map((key) => {
                    question.listKeys.push(key); // get the keys
                    question.listAnswersWithoutKey.push(key); //get the answer then add the key for rendering in test
                  });
                } else if (
                  question.questionType === "Multiple choice with one answer" ||
                  question.questionType ===
                    "Multiple choice with more than one answer"
                ) {
                  question.questionContentWithoutKey = question.questionContent;
                  question.listAnswersWithoutKey = cloneDeep(
                    question.listAnswers
                  );
                } else if (question.questionType === "Flow-chart Completion") {
                  question.questionContentWithoutKey = question.questionContent;
                  question.listKeys = [];
                  question.listAnswers.map((answer) => {
                    question.listKeys = question.listKeys.concat(
                      this.handleCropStringInBracket(answer).listItem
                    );
                  });
                  question.listAnswersWithoutKey = cloneDeep(
                    question.listAnswers
                  );
                } else if (
                  question.questionType === "Sentence Completion" ||
                  question.questionType === "Matching Sentence Endings"
                ) {
                  question.questionContentWithoutKey =
                    this.handleCropStringInBracket(
                      question.questionContent
                    ).replacedStr;
                  question.listAnswersWithoutKey = cloneDeep(
                    question.listAnswers
                  );
                  question.listKeys = [];
                  this.handleCropStringInBracket(
                    question.questionContent
                  ).listItem.map((key) => {
                    question.listKeys.push(key);
                    question.listAnswersWithoutKey.push(key);
                  });
                } else if (question.questionType === "Matching Headings") {
                  question.listKeys = [];
                  question.listAnswers.map((answer) => {
                    question.questionContentWithoutKey =
                      question.questionContent;
                    if (
                      this.handleCropStringInBracket(answer).listItem !== null
                    ) {
                      question.listKeys = question.listKeys.concat(
                        this.handleCropStringInBracket(answer).listItem
                      );
                    }
                  });
                  question.listAnswersWithoutKey = cloneDeep(
                    question.listAnswers
                  );
                }
              });
            });
          })
        : [];
      const test = {
        startDate: this.testDate ? this.testDate[0]._d : new Date(),
        endDate: this.testDate ? this.testDate[1]._d : new Date(),
        isShowPoint: this.isShowPoint,
        testName: this.testName,
        testDescription: this.testDescription,
        totalTopics: this.totalTopics ? this.totalTopics.toString() : 0,
        listTopics: this.listTopics,
        totalQuestions: totalQuestion.toString(),
        countDownTime: this.countDown,
      };
      Test.updateTest(this.$route.params.id, test)
        .then((response) => {
          this.openNotificationWithIcon("success", "Update test successfully");
          this.UpdateLoading = false;
          this.$router.push("/test");
        })
        .catch((error) => {
          this.openNotificationWithIcon(
            "error",
            "Update test fail",
            error.response.data.message
          );
          this.UpdateLoading = false;
        });
    },
    handleCropStringInBracket(str) {
      const matches = str.match(/\[.+?\]/g);
      let replaceStr = str;
      if (matches) {
        matches.map((item) => {
          replaceStr = replaceStr.replace(item.toString(), "[]");
        });
      }
      return {
        listItem: matches,
        replacedStr: replaceStr,
      };
    },
    cancel() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
#editor {
  height: 200px;
}
</style>
