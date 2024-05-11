<template>
  <div>
    <TableLoading v-if="loading" />
    <a-row v-else :gutter="30">
      <a-col :span="8" style="position: fixed">
        <b style="font-size: 24px; text-transform: uppercase">Edit test</b>
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
            <b>Time for test</b>
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
              <div style="display: grid; width: 34%">
                <b>Choose number of Excercises</b>
                <a-select
                  placeholder="Choose number of excercises"
                  v-model="totalTopics"
                  @change="handleChangeNumberExercise"
                >
                  <a-select-option v-for="item in 10" :key="item" :value="item">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </div>
              <div style="display: grid; width: 60%">
                <b>Choose question type</b>
                <a-select placeholder="Choose question type" v-model="testType">
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
                <b>Test time</b>
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
            <!-- <b>Chọn số lượng bài tập</b>
            <a-select
              style="width: 100%"
              placeholder="Chọn số lượng bài"
              v-model="totalTopics"
              @change="handleChangeNumberExercise"
            >
              <a-select-option v-for="item in 10" :key="item" :value="item">
                {{ item }}
              </a-select-option>
            </a-select> -->
            <div style="display: flex">
              <b>Show point after finish test</b>
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
        <v-btn
          color="primary"
          dark
          :loading="UpdateLoading"
          @click="handleSubmit"
          style="width: 100%; margin-top: 10px"
          >Edit test
        </v-btn>
        <v-btn @click="cancel" style="width: 100%; margin-top: 10px"
          >Cancel
        </v-btn>
      </a-col>
      <a-col :span="8"></a-col>
      <a-col :span="16">
        <b v-if="testType === 'listening'">File listening for test</b>
        <v-file-input
          v-if="testType === 'listening'"
          v-model="fileListening"
          placeholder="Upload File listening"
          label="File audio "
          truncate-length="32"
          accept="audio/*"
          prepend-icon="mdi-paperclip"
        >
          <template v-slot:selection="{ text }">
            <v-chip style="background: #434141" small label color="primary">
              {{ text }}
            </v-chip>
          </template>
        </v-file-input>
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
            :header="`Excercise ${topicIndex + 1}`"
            style="font-weight: 600"
          >
            <a-card>
              <b>Excercise name {{ topicIndex + 1 }} </b>
              <a-input
                style="margin-top: 0.5rem; margin-bottom: 0.5rem"
                placeholder="Enter excercise name"
                v-model="topic.topicName"
              />
              <br />
              <b v-if="testType !== 'listening'"
                >Excercise content {{ topicIndex + 1 }}</b
              >
              <ckeditor
                class="custom-editor"
                :editor="editor"
                @ready="onReady"
                :config="editorConfig"
                :id="makeid(5)"
                style="margin-top: 0.5rem; margin-bottom: 0.5rem"
                v-model="topic.content"
                v-if="testType !== 'listening'"
              ></ckeditor>
              <b v-if="testType === 'listening'"
                >File listening for excercise {{ topicIndex + 1 }}</b
              >
              <v-file-input
                v-if="testType === 'listening'"
                v-model="topic.fileListeningForRender"
                placeholder="Upload File listening"
                label="File audio "
                truncate-length="32"
                accept="audio/*"
                prepend-icon="mdi-paperclip"
              >
                <template v-slot:selection="{ text }">
                  <v-chip
                    style="background: #434141"
                    small
                    label
                    color="primary"
                  >
                    {{ text }}
                  </v-chip>
                </template>
              </v-file-input>
              <b>Choose number of question group</b>
              <a-select
                style="width: 100%; margin-top: 0.5rem; margin-bottom: 0.5rem"
                placeholder="Choose number of question"
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
                      Instruction for question group
                      {{ questionGroupIndex + 1 }}</b
                    >
                    <ckeditor
                      :editor="editor"
                      @ready="onReady"
                      :config="editorConfig"
                      class="custom-editor"
                      :id="makeid(5)"
                      style="margin-top: 0.5rem; margin-bottom: 0.5rem"
                      v-model="questionGroup.content"
                    ></ckeditor>
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
                                <b>No </b>
                                <a-input
                                  style="width: 50px; margin-left: 10px"
                                  placeholder="No"
                                  v-model="question.questionNumber"
                                />
                                <b style="margin-left: 1rem"
                                  >Number of question
                                </b>
                                <a-select
                                  style="width: 60px; margin-left: 10px"
                                  placeholder="Choose number of question"
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
                                <b style="margin-left: 1rem"> Question type </b>
                                <a-select
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

                              <div>
                                <v-btn
                                  depressed
                                  small
                                  @click="
                                    () =>
                                      questionGroup.listQuestions.splice(
                                        questionIndex,
                                        1
                                      )
                                  "
                                  style="
                                    width: 30px;
                                    padding: 10px;
                                    height: 40px;
                                    margin-bottom: 3px;
                                    margin-left: 15px;
                                  "
                                >
                                  <a-icon
                                    height="2em"
                                    width="2em"
                                    type="delete"
                                    theme="filled"
                                    style="font-size: 16px"
                                  />
                                </v-btn>
                              </div>
                            </div>
                            <div>
                              <a-textarea
                                style="width: 100%; margin-top: 0.5rem"
                                placeholder="Enter title for question"
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
                              <ckeditor
                                class="custom-editor"
                                :id="makeid(5)"
                                :editor="editor"
                                @ready="onReady"
                                :config="editorConfig"
                                style="margin-top: 0.5rem"
                                v-model="question.questionContent"
                              ></ckeditor>
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
                              <ckeditor
                                class="custom-editor"
                                :id="makeid(5)"
                                :editor="editor"
                                @ready="onReady"
                                :config="editorConfig"
                                style="margin-top: 0.5rem"
                                v-model="question.questionContent"
                              ></ckeditor>
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
                              <b>Question content and keys</b>
                              <br />
                              <ckeditor
                                :id="makeid(5)"
                                class="custom-editor"
                                :editor="editor"
                                @ready="onReady"
                                :config="editorConfig"
                                style="margin-top: 0.5rem"
                                v-model="question.questionContent"
                              ></ckeditor>
                              <p style="margin-top: 0.5rem">
                                <b>Example:</b> Deborah was angry at her son.
                                Her son didn't <b>[Listen]</b> to her. Her son
                                was 16 years old. Her son
                                <b>[thought]</b>
                                he knew everything. Her son <b>[yelled]</b> at
                                Deborah
                                <b></b>
                              </p>
                            </div>
                            <!-- Form Completion -->
                            <div
                              v-if="question.questionType === 'Form Completion'"
                              style="margin-top: 0.5rem"
                            >
                              <b>Question content and keys</b>
                              <br />
                              <ckeditor
                                :id="makeid(5)"
                                class="custom-editor"
                                :editor="editor"
                                @ready="onReady"
                                :config="editorConfig"
                                style="margin-top: 0.5rem"
                                v-model="question.questionContent"
                              ></ckeditor>
                              <div style="margin-top: 0.5rem">
                                <b>Example:</b>
                                <b> Items</b>
                                <br />
                                Dining table : - <b>[round]</b> shape
                                <p style="margin: 0 0 0 5.5rem">
                                  - medium size
                                </p>
                                <p style="margin: 0 0 0 5.5rem">
                                  - <b>[2]</b> old
                                </p>
                                <p style="margin: 0 0 0 5.5rem">- $25.00</p>
                                <br />
                                Dining chairs: - set of<b> [round]</b> chairs
                                <p style="margin: 0 0 0 5.5rem">
                                  - Seats covered in <b>[leather]</b> material
                                </p>
                                <p style="margin: 0 0 0 5.5rem">
                                  - in <b>[good]</b> condition
                                </p>
                                <p style="margin: 0 0 0 5.5rem">- $20.00</p>
                              </div>
                            </div>
                            <!-- Table Completion -->
                            <div
                              v-if="
                                question.questionType === 'Table Completion'
                              "
                              style="margin-top: 0.5rem"
                            >
                              <b>Question content and keys</b>
                              <br />
                              <ckeditor
                                :id="makeid(5)"
                                class="custom-editor"
                                :editor="editor"
                                @ready="onReady"
                                :config="editorConfig"
                                style="margin-top: 0.5rem"
                                v-model="question.questionContent"
                              ></ckeditor>
                              <div style="margin-top: 0.5rem">
                                <b>Example:</b>
                                <br />
                                <table
                                  class="table-example-style"
                                  style="width: 100%"
                                >
                                  <tr>
                                    <td style="width: 30%">Height</td>
                                    <td>
                                      <p>in <b>[good]</b> condition</p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="width: 30%">Build</td>
                                    <td>Slight</td>
                                  </tr>
                                  <tr>
                                    <td style="width: 30%">Hair</td>
                                    <td>Dark</td>
                                  </tr>
                                  <tr>
                                    <td style="width: 30%">Face</td>
                                    <td>Small moustache</td>
                                  </tr>
                                  <tr>
                                    <td style="width: 30%">Clothing</td>
                                    <td>
                                      <div>
                                        Blue jeans
                                        <br />
                                        White T-shirt
                                        <br />
                                        A <b>[Beautiful skirt]</b>
                                        <br />
                                        Motorbike helmet
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="width: 30%">Age</td>
                                    <td>Early 20s</td>
                                  </tr>
                                </table>
                              </div>
                            </div>
                            <!-- Multiple choice with one answer -->
                            <div
                              v-if="
                                question.questionType ===
                                'Multiple choice with one answer'
                              "
                            >
                              <b>Question</b>
                              <ckeditor
                                :id="makeid(5)"
                                :editor="editor"
                                @ready="onReady"
                                class="custom-editor"
                                :config="editorConfig"
                                style="margin-top: 0.5rem"
                                v-model="question.questionContent"
                              ></ckeditor>

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
                                  <v-btn
                                    depressed
                                    small
                                    @click="
                                      () =>
                                        question.listAnswers.splice(
                                          answerIndex,
                                          1
                                        )
                                    "
                                    style="
                                      width: 30px;
                                      padding: 10px;
                                      height: 20px;
                                      margin-bottom: 3px;

                                      background: #f5f5f5;
                                    "
                                  >
                                    <a-icon
                                      height="2em"
                                      width="2em"
                                      type="delete"
                                      theme="filled"
                                      style="
                                        font-size: 16px;
                                        background: #f5f5f5;
                                      "
                                    />
                                  </v-btn>
                                </div>
                              </a-radio-group>
                              <div style="display: flex; margin-top: 0.5rem">
                                <a-input
                                  placeholder="Enter new answer"
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
                            </div>
                            <!-- Multiple choice with more than one answer -->
                            <div
                              v-if="
                                question.questionType ===
                                'Multiple choice with more than one answer'
                              "
                            >
                              <b>Question</b>
                              <ckeditor
                                :id="makeid(5)"
                                style="margin-top: 0.5rem"
                                class="custom-editor"
                                :editor="editor"
                                @ready="onReady"
                                :config="editorConfig"
                                v-model="question.questionContent"
                              ></ckeditor>

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
                                  <v-btn
                                    depressed
                                    small
                                    @click="
                                      () =>
                                        question.listAnswers.splice(
                                          answerIndex,
                                          1
                                        )
                                    "
                                    style="
                                      width: 30px;
                                      padding: 10px;
                                      height: 20px;
                                      margin-bottom: 3px;

                                      background: #f5f5f5;
                                    "
                                  >
                                    <a-icon
                                      height="2em"
                                      width="2em"
                                      type="delete"
                                      theme="filled"
                                      style="
                                        font-size: 16px;
                                        background: #f5f5f5;
                                      "
                                    />
                                  </v-btn>
                                </div>
                              </div>
                              <div style="display: flex; margin-top: 0.5rem">
                                <a-input
                                  placeholder="Enter new answer"
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
                            </div>
                            <!-- Flow-chart Completion -->
                            <div
                              v-if="
                                question.questionType ===
                                'Flow-chart Completion'
                              "
                              style="margin-top: 0.5rem"
                            >
                              <b>Question content and keys</b>
                              <br />
                              <ckeditor
                                :id="makeid(5)"
                                class="custom-editor"
                                :editor="editor"
                                @ready="onReady"
                                :config="editorConfig"
                                style="margin-top: 0.5rem"
                                v-model="question.questionContent"
                              ></ckeditor>
                              <p style="margin-top: 0.5rem">
                                <b>Example:</b> Deborah was angry at her son.
                                Her son didn't <b>[Listen]</b> to her. Her son
                                was 16 years old. Her son
                                <b>[thought]</b>
                                he knew everything. Her son <b>[yelled]</b> at
                                Deborah
                                <b></b>
                              </p>
                            </div>
                            <!-- Flow-chart Completion (image) -->
                            <div
                              v-if="
                                question.questionType ===
                                'Flow-chart Completion (image)'
                              "
                            >
                              <b>Question</b>
                              <ckeditor
                                :editor="editor"
                                @ready="onReady"
                                class="custom-editor"
                                :config="editorConfig"
                                :id="makeid(5)"
                                style="margin-top: 0.5rem"
                                v-model="question.questionContent"
                              ></ckeditor>

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

                                <div style="padding: 10px">
                                  <v-btn
                                    depressed
                                    small
                                    @click="
                                      () =>
                                        question.listAnswers.splice(
                                          answerIndex,
                                          1
                                        )
                                    "
                                    style="
                                      width: 30px;
                                      padding: 10px;
                                      height: 20px;
                                      margin-bottom: 3px;

                                      background: #f5f5f5;
                                    "
                                  >
                                    <a-icon
                                      height="2em"
                                      width="2em"
                                      type="delete"
                                      theme="filled"
                                      style="
                                        font-size: 16px;
                                        background: #f5f5f5;
                                      "
                                    />
                                  </v-btn>
                                </div>
                              </div>
                              <div style="display: flex; margin-top: 0.5rem">
                                <a-input
                                  placeholder="Enter new answer"
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
                                <b>Example:</b> <b>[Listen]</b> Keywords to
                                enter will be inside square brackets
                              </p>
                            </div>
                            <!-- Flow-chart Completion (dragable) -->
                            <div
                              v-if="
                                question.questionType ===
                                'Flow-chart Completion (dragable)'
                              "
                            >
                              <b>Question</b>
                              <ckeditor
                                :editor="editor"
                                @ready="onReady"
                                class="custom-editor"
                                :config="editorConfig"
                                :id="makeid(5)"
                                style="margin-top: 0.5rem"
                                v-model="question.questionContent"
                              ></ckeditor>

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

                                <div style="padding: 10px">
                                  <v-btn
                                    depressed
                                    small
                                    @click="
                                      () =>
                                        question.listAnswers.splice(
                                          answerIndex,
                                          1
                                        )
                                    "
                                    style="
                                      width: 30px;
                                      padding: 10px;
                                      height: 20px;
                                      margin-bottom: 3px;

                                      background: #f5f5f5;
                                    "
                                  >
                                    <a-icon
                                      height="2em"
                                      width="2em"
                                      type="delete"
                                      theme="filled"
                                      style="
                                        font-size: 16px;
                                        background: #f5f5f5;
                                      "
                                    />
                                  </v-btn>
                                </div>
                              </div>
                              <div style="display: flex; margin-top: 0.5rem">
                                <a-input
                                  placeholder="Enter new answer"
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
                                <b>Example:</b> <b>[Listen]</b> Keywords to fill
                                in will be inside square brackets (This can be
                                enter more answers than answers)
                              </p>
                            </div>
                            <!-- Sentence Completion -->
                            <div
                              v-if="
                                question.questionType === 'Sentence Completion'
                              "
                            >
                              <b>Question</b>
                              <ckeditor
                                :id="makeid(5)"
                                :editor="editor"
                                @ready="onReady"
                                class="custom-editor"
                                :config="editorConfig"
                                style="margin-top: 0.5rem"
                                v-model="question.questionContent"
                              ></ckeditor>

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

                                <div style="padding: 10px">
                                  <v-btn
                                    depressed
                                    small
                                    @click="
                                      () =>
                                        question.listAnswers.splice(
                                          answerIndex,
                                          1
                                        )
                                    "
                                    style="
                                      width: 30px;
                                      padding: 10px;
                                      height: 20px;
                                      margin-bottom: 3px;

                                      background: #f5f5f5;
                                    "
                                  >
                                    <a-icon
                                      height="2em"
                                      width="2em"
                                      type="delete"
                                      theme="filled"
                                      style="
                                        font-size: 16px;
                                        background: #f5f5f5;
                                      "
                                    />
                                  </v-btn>
                                </div>
                              </div>
                              <div style="display: flex; margin-top: 0.5rem">
                                <a-input
                                  placeholder="Enter new question"
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
                                For this type of question, the question and
                                answer will be Please fill in the additional
                                questions section
                                <br />
                                <b>Example:</b>
                                <br />
                                <b>Question 1 :</b> Deborah was angry at her
                                son. Her son didn't <b>[Listen]</b>
                                <br />
                                Keywords to enter will be inside square brackets
                              </p>
                            </div>
                            <!-- Short-answer Questions -->
                            <div
                              v-if="
                                question.questionType ===
                                'Short-answer Questions'
                              "
                            >
                              <b>Question</b>
                              <ckeditor
                                :id="makeid(5)"
                                :editor="editor"
                                @ready="onReady"
                                class="custom-editor"
                                :config="editorConfig"
                                style="margin-top: 0.5rem"
                                v-model="question.questionContent"
                              ></ckeditor>

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

                                <div style="padding: 10px">
                                  <v-btn
                                    depressed
                                    small
                                    @click="
                                      () =>
                                        question.listAnswers.splice(
                                          answerIndex,
                                          1
                                        )
                                    "
                                    style="
                                      width: 30px;
                                      padding: 10px;
                                      height: 20px;
                                      margin-bottom: 3px;

                                      background: #f5f5f5;
                                    "
                                  >
                                    <a-icon
                                      height="2em"
                                      width="2em"
                                      type="delete"
                                      theme="filled"
                                      style="
                                        font-size: 16px;
                                        background: #f5f5f5;
                                      "
                                    />
                                  </v-btn>
                                </div>
                              </div>
                              <div style="display: flex; margin-top: 0.5rem">
                                <a-input
                                  placeholder="Enter new answer"
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
                                <br />
                                <b>Example:</b>
                                <br />
                                <b>Question 1 :</b> Deborah was angry at her
                                son. Her son didn't <b>[Listen]</b>
                                <b>Question 2 :</b> What number room will Mr
                                Griffin be at the Sunrise Hotel? <b>[22]</b>
                                <br />
                                Keywords to enter will be inside square brackets
                              </p>
                            </div>
                            <!-- Matching Headings -->
                            <div
                              v-if="
                                question.questionType === 'Matching Headings'
                              "
                            >
                              <b>Question</b>
                              <ckeditor
                                :id="makeid(5)"
                                :editor="editor"
                                class="custom-editor"
                                @ready="onReady"
                                :config="editorConfig"
                                style="margin-top: 0.5rem"
                                v-model="question.questionContent"
                              ></ckeditor>
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

                                <div style="padding: 10px">
                                  <v-btn
                                    depressed
                                    small
                                    @click="
                                      () =>
                                        question.listAnswers.splice(
                                          answerIndex,
                                          1
                                        )
                                    "
                                    style="
                                      width: 30px;
                                      padding: 10px;
                                      height: 20px;
                                      margin-bottom: 3px;

                                      background: #f5f5f5;
                                    "
                                  >
                                    <a-icon
                                      height="2em"
                                      width="2em"
                                      type="delete"
                                      theme="filled"
                                      style="
                                        font-size: 16px;
                                        background: #f5f5f5;
                                      "
                                    />
                                  </v-btn>
                                </div>
                              </div>
                              <div style="display: flex; margin-top: 0.5rem">
                                <a-input
                                  placeholder="Enter new answer"
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
                                For this type of question, the correct answers
                                for Which sentence will add [ ]
                                <br />
                                <b>Exanoke:</b>
                                <br />
                                A lack of invesment in driver
                                <b>[training ]</b>
                                <br />
                                How a maths experiment actually reduced traffic
                                congestion
                              </p>
                            </div>
                            <!--  Matching Sentence Endings -->
                            <div
                              v-if="
                                question.questionType ===
                                'Matching Sentence Endings'
                              "
                            >
                              <b>Question</b>
                              <ckeditor
                                :id="makeid(5)"
                                :editor="editor"
                                class="custom-editor"
                                @ready="onReady"
                                :config="editorConfig"
                                style="margin-top: 0.5rem"
                                v-model="question.questionContent"
                              ></ckeditor>

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

                                <div style="padding: 10px">
                                  <v-btn
                                    depressed
                                    small
                                    @click="
                                      () =>
                                        question.listAnswers.splice(
                                          answerIndex,
                                          1
                                        )
                                    "
                                    style="
                                      width: 30px;
                                      padding: 10px;
                                      height: 20px;
                                      margin-bottom: 3px;

                                      background: #f5f5f5;
                                    "
                                  >
                                    <a-icon
                                      height="2em"
                                      width="2em"
                                      type="delete"
                                      theme="filled"
                                      style="
                                        font-size: 16px;
                                        background: #f5f5f5;
                                      "
                                    />
                                  </v-btn>
                                </div>
                              </div>
                              <div style="display: flex; margin-top: 0.5rem">
                                <a-input
                                  placeholder="Enter new answer"
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
                                For this type of question, the questions will
                                filled in with the answers in [ ] and Additional
                                options will be filled in and not available
                                bracket
                                <br />
                                <b>Example:</b>
                                <br />
                                <b>Answer and key :</b> Harkness’s research
                                method was different to that of other writers
                                because
                                <b
                                  >[She started by seeking to understand how
                                  basic term were used in the past]</b
                                >
                                <br />
                                <b>Additional selection :</b> She has the
                                greatest knowledge of Elizabethan London
                                <br />
                              </p>
                            </div>
                            <!-- Summary Completion (dragable)  -->
                            <div
                              v-if="
                                question.questionType ===
                                'Summary Completion (dragable)'
                              "
                              style="margin-top: 0.5rem"
                            >
                              <b>Question content and keys</b>
                              <br />
                              <ckeditor
                                :id="makeid(5)"
                                :editor="editor"
                                class="custom-editor"
                                @ready="onReady"
                                :config="editorConfig"
                                style="margin-top: 0.5rem"
                                v-model="question.questionContent"
                              ></ckeditor>
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

                                <div style="padding: 10px">
                                  <v-btn
                                    depressed
                                    small
                                    @click="
                                      () =>
                                        question.listAnswers.splice(
                                          answerIndex,
                                          1
                                        )
                                    "
                                    style="
                                      width: 30px;
                                      padding: 10px;
                                      height: 20px;
                                      margin-bottom: 3px;

                                      background: #f5f5f5;
                                    "
                                  >
                                    <a-icon
                                      height="2em"
                                      width="2em"
                                      type="delete"
                                      theme="filled"
                                      style="
                                        font-size: 16px;
                                        background: #f5f5f5;
                                      "
                                    />
                                  </v-btn>
                                </div>
                              </div>
                              <div style="display: flex; margin-top: 0.5rem">
                                <a-input
                                  placeholder="Enter new answer"
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
                                For the paragraph question type, the passage and
                                the answer will Fill in the content like the
                                example below
                                <br />
                                <b
                                  >More options will be added in the extra
                                  section answer</b
                                >
                                <br />
                                <b>Example:</b> Deborah was angry at her son.
                                Her son didn't <b>[Listen]</b> to her. Her son
                                was 16 years old. Her son
                                <b>[thought]</b>
                                he knew everything. Her son <b>[yelled]</b> at
                                Deborah
                              </p>
                            </div>
                            <!-- Note Completion -->
                            <div
                              v-if="question.questionType === 'Note Completion'"
                            >
                              <b>Question</b>
                              <ckeditor
                                :editor="editor"
                                class="custom-editor"
                                @ready="onReady"
                                :config="editorConfig"
                                :id="makeid(5)"
                                style="margin-top: 0.5rem"
                                v-model="question.questionContent"
                              ></ckeditor>

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

                                <div style="padding: 10px">
                                  <v-btn
                                    depressed
                                    small
                                    @click="
                                      () =>
                                        question.listAnswers.splice(
                                          answerIndex,
                                          1
                                        )
                                    "
                                    style="
                                      width: 30px;
                                      padding: 10px;
                                      height: 20px;
                                      margin-bottom: 3px;

                                      background: #f5f5f5;
                                    "
                                  >
                                    <a-icon
                                      height="2em"
                                      width="2em"
                                      type="delete"
                                      theme="filled"
                                      style="
                                        font-size: 16px;
                                        background: #f5f5f5;
                                      "
                                    />
                                  </v-btn>
                                </div>
                              </div>
                              <div style="display: flex; margin-top: 0.5rem">
                                <a-input
                                  placeholder="Enter new answer"
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
                                For this type of question, the question and
                                answer will be Please fill in the additional
                                questions section
                                <br />
                                <b>Example:</b>
                                <br />
                                <b> Question 1:</b> Deborah was
                                <b>[angry]</b> at her son. Her son didn't Listen
                                <br />
                                Keywords to enter will be inside square brackets
                              </p>
                            </div>

                            <!-- Matching Information -->
                            <div
                              v-if="
                                question.questionType === 'Matching Information'
                              "
                            >
                              <b>Question</b>
                              <ckeditor
                                :id="makeid(5)"
                                class="custom-editor"
                                :editor="editor"
                                @ready="onReady"
                                :config="editorConfig"
                                style="margin-top: 0.5rem"
                                v-model="question.questionContent"
                              ></ckeditor>
                              <div
                                style="
                                  margin-top: 0.5rem;
                                  margin-bottom: 0.5rem;
                                "
                              >
                                <b>Keys </b>
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
                                  >
                                    {{ formatStartOfQuestion(index) }}
                                  </a-select-option>
                                </a-select>
                              </div>
                              <b>
                                In this type of question, the question will be
                                filled in and answered The project will choose
                                below
                              </b>
                            </div>
                            <!-- Map Labelling (dropdown) -->
                            <div
                              v-if="
                                question.questionType ===
                                'Map Labelling (dropdown)'
                              "
                            >
                              <b>Question</b>
                              <ckeditor
                                :id="makeid(5)"
                                class="custom-editor"
                                :editor="editor"
                                @ready="onReady"
                                :config="editorConfig"
                                style="margin-top: 0.5rem"
                                v-model="question.questionContent"
                              ></ckeditor>
                              <div
                                style="
                                  margin-top: 0.5rem;
                                  margin-bottom: 0.5rem;
                                "
                              >
                                <b>Keys </b>
                                <a-select
                                  style="width: 60px; margin-left: 10px"
                                  @change="
                                    (val) => {
                                      question.listKeys = [
                                        formatStartOfQuestion(val - 1),
                                      ];
                                    }
                                  "
                                >
                                  <a-select-option
                                    v-for="(item, index) in 27"
                                    :key="item"
                                    :value="item"
                                  >
                                    {{ formatStartOfQuestion(index) }}
                                  </a-select-option>
                                </a-select>
                              </div>
                              <b>
                                In this type of question, the question will be
                                filled in and answered The project will choose
                                below
                              </b>
                            </div>
                            <!-- Map Labelling (dragable) -->
                            <div
                              v-if="
                                question.questionType ===
                                'Map Labelling (dragable)'
                              "
                            >
                              <b>Question</b>
                              <ckeditor
                                :editor="editor"
                                @ready="onReady"
                                class="custom-editor"
                                :config="editorConfig"
                                :id="makeid(5)"
                                style="margin-top: 0.5rem"
                                v-model="question.questionContent"
                              ></ckeditor>

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

                                <div style="padding: 10px">
                                  <v-btn
                                    depressed
                                    small
                                    @click="
                                      () =>
                                        question.listAnswers.splice(
                                          answerIndex,
                                          1
                                        )
                                    "
                                    style="
                                      width: 30px;
                                      padding: 10px;
                                      height: 20px;
                                      margin-bottom: 3px;

                                      background: #f5f5f5;
                                    "
                                  >
                                    <a-icon
                                      height="2em"
                                      width="2em"
                                      type="delete"
                                      theme="filled"
                                      style="
                                        font-size: 16px;
                                        background: #f5f5f5;
                                      "
                                    />
                                  </v-btn>
                                </div>
                              </div>
                              <div style="display: flex; margin-top: 0.5rem">
                                <a-input
                                  placeholder="Enter new answer"
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
                                <b>Example:</b> <b>[Listen]</b> Keywords to fill
                                in will be inside square brackets (Note to add
                                correct number of answers for Flow Chart)
                              </p>
                            </div>
                          </a-card>
                        </a-collapse-panel>
                      </a-collapse>
                    </div>
                  </a-card>
                  <div style="text-align: end">
                    <v-btn
                      depressed
                      small
                      @click="handleAddQuestion(questionGroup)"
                      style="width: 200px; margin-top: 10px"
                      >+ Add question
                    </v-btn>
                  </div>
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
import { VueEditor } from "vue2-quill-editor";
import CKEditor from "@ckeditor/ckeditor5-vue2";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import { NotificationMixin } from "../../../mixin/Notification";
import { FirebaseStorageMixin } from "../../../mixin/FirebaseStorage";
import Test from "../../../api/Test";
import QuestionType from "../../../api/QuestionType";
import TableLoading from "../../../components/Base/TableLoading.vue";
import { cloneDeep } from "lodash";
import MasterData from "../../../api/MasterData";
import { MyUploadAdapter } from "../../Lesson/AddLessonModal.vue";
export default {
  mixins: [NotificationMixin, FirebaseStorageMixin],
  components: {
    VueEditor,
    TableLoading,
    ckeditor: CKEditor.component,
  },
  data() {
    return {
      testName: "",
      bookTestName: "",
      editor: DecoupledEditor,
      editorConfig: {
        toolbar: {
          // plugins : [Table],
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
            "image",
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
            "blockQuote",
            "|",
            "undo",
            "redo",

            "fontfamily",
            "fontsize",
            "|",
          ],
          shouldNotGroupWhenFull: true,
        },
        image: {
          toolbar: [
            "imageStyle:alignLeft",
            "imageStyle:alignCenter",
            "imageStyle:alignRight",
            "|",
            "imageTextAlternative",
          ],
        },
        outputType: "html",
      },
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
      oldFileListeningUrl: "",
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
      testType: "",
      testTypeOptions: [
        { value: "reading", label: "Reading" },
        { value: "listening", label: "Listening" },
      ],
      fileListening: null,
    };
  },
  beforeUpdate() {
    this.$nextTick(function () {
      let collapse = document.getElementsByClassName("ant-collapse-header");
      if (collapse && collapse.length && collapse.length > 0) {
        for (let i = 0; i < collapse.length; i++) {
          collapse[i].setAttribute("aria-expanded", "true");
        }
      }
      console.log(document.getElementsByClassName("ant-collapse-header"));
      console.log(document.getElementsByClassName("ant-collapse-content"));
      let collapseContent = document.getElementsByClassName(
        "ant-collapse-content"
      );
      if (
        collapseContent &&
        collapseContent.length &&
        collapseContent.length > 0
      ) {
        for (let j = 0; j < collapseContent.length; j++) {
          collapseContent[j].style.display = "grid";
        }
      }
    });
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
        this.listTopics = data.listTopics.map((topic) => {
          return {
            ...(topic.fileListening
              ? {
                  fileListeningForRender: new File(
                    [],
                    FirebaseStorageMixin.methods.getFileName(
                      topic.fileListening
                    )
                  ),
                }
              : {}),
            ...topic,
          };
        });
        this.isShowPoint = data.isShowPoint ? data.isShowPoint : false;
        this.countDown = data.countDownTime ? data.countDownTime : null;
        this.loading = false;
        this.subject = data.subject ? data.subject : "";
        this.testType = data.testType ? data.testType : "";
        this.oldFileListeningUrl = data.fileListeningUrl;
        this.fileListening =
          data && data.fileListeningUrl
            ? new File(
                [],
                FirebaseStorageMixin.methods.getFileName(data.fileListeningUrl)
              )
            : "";
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
    onReady(editor) {
      // Insert the toolbar before the editable area.
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
            ...(this.testType === "listening" ? { fileListening: null } : {}),
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

    handleAddQuestion(questionGroup) {
      const newQuestion = {
        questionTitle: "",
        questionContent: "",
        questionNumber: "",
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
      questionGroup.listQuestions.push(newQuestion);
    },
    handleAddAnswer(val, question, listAnswers) {
      listAnswers.push(question.newAnswerText);
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
    async handleSubmit() {
      // try {

      // } catch (e) {
      //   this.openNotificationWithIcon(
      //     "error",
      //     "Cập nhật bài kiểm tra thất bại",
      //     e.message
      //   );
      //   this.UpdateLoading = false;
      // }
      this.UpdateLoading = true;
      let totalQuestion = 0;
      let listKeys = [];
      let fileListeningUrl = this.fileListeningUrl;
      if (this.testType === "listening") {
        const fileName = `class/test/${(Math.random() + 1)
          .toString(36)
          .substring(5)}/${this.fileListening.name}`;
        fileListeningUrl =
          this.fileListening &&
          this.fileListening.name &&
          this.fileListening.size !== 0
            ? await FirebaseStorageMixin.methods.uploadToFireBase(
                this.fileListening,
                fileName
              )
            : this.oldFileListeningUrl;
        await Promise.all(
          this.listTopics.map(async (topic) => {
            //if file for render change , we have to upload the file again, else we use field fileListening
            if (
              topic &&
              topic.fileListeningForRender &&
              topic.fileListeningForRender.size > 0
            ) {
              const fileName = `class/test/topic/${(Math.random() + 1)
                .toString(36)
                .substring(5)}/${topic.fileListeningForRender.name}`;
              try {
                const url = topic.fileListeningForRender?.name
                  ? await FirebaseStorageMixin.methods.uploadToFireBase(
                      topic.fileListeningForRender,
                      fileName
                    )
                  : topic.fileListening;
                topic.fileListening = url;
                return topic;
              } catch (e) {
                console.log(e);
                this.uploadLoading = false;
              }
            } else {
              return topic;
            }
          })
        );
      }
      this.listTopics.length > 0
        ? this.listTopics.map((topic) => {
            topic.listKeys = [];
            topic.listQuestionGroups.map((questionGroup) => {
              questionGroup.listOldKeys = [];
              questionGroup.listQuestions.map((question) => {
                totalQuestion += question.numberOfQuestion;
                question.totalKeys = 0;
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
                    question.totalKeys = 1;
                  } else {
                    question.listAnswersWithoutKey = [];
                    question.listAnswers = [];
                    ["Yes", "No", "Not Given"].map((answer) => {
                      question.listAnswersWithoutKey.push(answer);
                      question.listAnswers.push(answer);
                    });
                    question.totalKeys = 1;
                  }
                } else if (
                  question.questionType === "Summary Completion" ||
                  question.questionType === "Flow-chart Completion" ||
                  question.questionType ===
                    "Flow-chart Completion (dragable)" ||
                  question.questionType === "Summary Completion (dragable)" ||
                  question.questionType === "Form Completion" ||
                  question.questionType === "Map Labelling (dragable)" ||
                  question.questionType === "Note Completion" ||
                  question.questionType === "Matching Headings" ||
                  question.questionType === "Table Completion"
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
                  question.totalKeys = question.listKeys.length;
                } else if (
                  question.questionType === "Multiple choice with one answer" ||
                  question.questionType ===
                    "Multiple choice with more than one answer" ||
                  question.questionType === "Matching Infomation" ||
                  question.questionType === "Map Labelling (dropdown)"
                ) {
                  question.questionContentWithoutKey = question.questionContent;
                  question.listAnswersWithoutKey = cloneDeep(
                    question.listAnswers
                  );

                  question.totalKeys = question.listKeys.length;
                } else if (
                  question.questionType === "Flow-chart Completion (image)"
                ) {
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

                  question.totalKeys = question.listKeys.length;
                } else if (
                  question.questionType === "Sentence Completion" ||
                  question.questionType === "Short-answer Questions" ||
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

                  question.totalKeys = question.listKeys.length;
                }
                questionGroup.listOldKeys = questionGroup.listOldKeys.concat(
                  question.listKeys
                );
              });
              topic.listKeys = topic.listKeys.concat(questionGroup.listOldKeys);
            });
            listKeys = listKeys.concat(topic.listKeys);
          })
        : [];
      const test = {
        startDate: this.testDate ? this.testDate[0]._d : new Date(),
        endDate: this.testDate ? this.testDate[1]._d : new Date(),
        isShowPoint: this.isShowPoint,
        testName: this.testName,
        ...(this.bookTestName !== ""
          ? { bookTestName: this.bookTestName }
          : {}),
        testDescription: this.testDescription,
        totalTopics: this.totalTopics ? this.totalTopics.toString() : 0,
        listTopics: this.listTopics,
        totalQuestions: totalQuestion.toString(),
        countDownTime: this.countDown,
        listKeys: listKeys,
        subject: this.subject,
        testType: this.testType,
        ...(this.testType === "listening"
          ? { fileListeningUrl: fileListeningUrl }
          : {}),
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
            "Update test failed",
            error.message
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
      this.openNotificationWithIcon("error", "Cancel update test");
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
#editor {
  height: 200px;
}
.table-example-style td {
  border: 0.5px solid;
  padding: 0.5rem;
}
.table-example-style tr {
  border: none !important;
}
.custom-editor {
  border: 1px solid #ccced1;
}
.edu-editor img {
  width: 100% !important;
}
.edu-editor table {
  width: 100% !important;
  border: 1px solid black !important;
}
.edu-editor table td {
  border: 0.5px solid black !important;
}
.edu-editor table tr {
  border: 1px solid black !important;
}
</style>
