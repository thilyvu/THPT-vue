<template>
  <div id="container">
    <div v-if="testType === 'reading'">
      <TableLoading v-if="loading"></TableLoading>
      <div
        class="responsive-reading-container"
        v-else
        v-for="(topic, topicIndex) in listTopics"
        :key="topicIndex"
        v-bind:style="[topicIndex === currentIndex ? {} : { display: 'none' }]"
        style="padding: 10px; padding-bottom: 0px; height: 100vh"
      >
        <a-card
          v-bind:style="[
            topicIndex === currentIndex ? {} : { display: 'none' },
          ]"
          style="margin-bottom: 0.5rem; height: 3rem; padding: 5px"
        >
          <div style="margin-top: -0.6rem">
            <h5 v-html="topic.topicName" style="max-width: 93%"></h5>

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
              v-if="countDown"
              :value="countDown"
              format="HH:mm:ss"
              @finish="onFinish"
              style="position: absolute; right: 2%; z-index: 100; top: 13%"
            />
          </div>
        </a-card>
        <a-card
          class="responsive-card-container"
          v-bind:style="[
            topicIndex === currentIndex ? {} : { display: 'none' },
          ]"
          style="height: 87%; margin-bottom: 0.3rem"
        >
          <div style="display: flex" class="do_test responsive-reading">
            <div
              style="
                max-width: 50%;
                width: 50%;
                height: 83vh;
                max-height: 100%;
                padding: 5px 15px 5px 5px;
                overflow-y: scroll;
              "
              class="edu-editor responsive-reading-topic"
              v-html="topic.content"
            ></div>

            <a-divider
              class="responsive-divider"
              style="margin-left:-0.5rem; background; :black; display: none;"
            />
            <div
              style="padding: 10px
              max-width: 50%;
              width: 50%;
              height: 83vh;
              max-height: 100%;
              overflow-y: scroll;
            "
              class="responsive-reading-question"
            >
              <div class="edu-editor" v-html="topic.description"></div>
              <div
                v-for="(
                  questionGroup, questionGroupIndex
                ) in topic.listQuestionGroups"
                :key="questionGroupIndex"
              >
                <div>
                  <div
                    v-html="questionGroup.content"
                    style="margin-bottom: -0.5rem"
                  ></div>
                  <a-collapse
                    :bordered="false"
                    v-for="(
                      question, questionIndex
                    ) in questionGroup.listQuestions"
                    :class="`${
                      question.questionType === 'True/False/Not Given' ||
                      question.questionType === 'Yes/No/Not Given'
                        ? 'remove-collapse'
                        : ''
                    }`"
                    :key="questionIndex + 1"
                    :value="question"
                    @change="
                      handleCollapse(questionGroup, question, questionIndex)
                    "
                  >
                    <template #expandIcon="props">
                      <a-icon
                        style="padding-bottom: 2px"
                        type="caret-right"
                        :rotate="props.isActive ? 90 : 0"
                      />
                    </template>
                    <a-collapse-panel
                      :disabled="
                        question.questionType === 'Matching Information' ||
                        question.questionType === 'Map Labelling (dropdown)'
                      "
                      :class="
                        handleCreateClassName(
                          topicIndex,
                          questionGroupIndex,
                          question,
                          questionIndex
                        )
                      "
                      style="background: white"
                      :key="questionIndex + 1"
                      :forceRender="true"
                    >
                      <template slot="header">
                        <div
                          v-if="
                            question.questionType !== 'Matching Information' &&
                            question.questionType !== 'Map Labelling (dropdown)'
                          "
                          style="display: flex; padding-bottom: 0px"
                        >
                          <div style="display: flex; align-items: center">
                            <b
                              style="margin-right: 10px; max-width: 5rem"
                              v-bind:style="[
                                question.questionNumber.length > 2
                                  ? { width: '40px' }
                                  : {},
                              ]"
                              >{{ question.questionNumber }}</b
                            >
                          </div>

                          <span>{{ question.questionTitle }}</span>
                        </div>
                        <div v-else style="display: flex">
                          <b
                            style="
                              margin-right: 10px;
                              display: flex;
                              align-items: center;
                            "
                            >{{ question.questionNumber }}</b
                          >
                          <span
                            style="
                              width: 90%;
                              display: flex;
                              align-items: center;
                            "
                            >{{ question.questionTitle }}</span
                          >
                          <div>
                            <a-select
                              v-if="!question.isRomanNumber"
                              size="default"
                              style="width: 80px; height: 2rem"
                              @change="
                                (val) => {
                                  question.listKeys = [
                                    formatStartOfQuestion(val - 1),
                                  ];
                                  handleSendkeyWithDebounce();
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
                            <a-select
                              v-else
                              size="default"
                              style="width: 80px; height: 2rem"
                              @change="
                                (val) => {
                                  question.listKeys = [
                                    formatStartOfQuestionRoman(val - 1),
                                  ];
                                  handleSendkeyWithDebounce();
                                }
                              "
                            >
                              <a-select-option
                                v-for="(item, index) in 15"
                                :key="item"
                                :value="item"
                              >
                                {{ formatStartOfQuestionRoman(index) }}
                              </a-select-option>
                            </a-select>
                          </div>
                        </div>
                      </template>
                      <a-card
                        size="small"
                        style="border: none; padding-top: 0px !important"
                        :class="
                          question.questionContent === '' &&
                          (question.questionType === 'True/False/Not Given' ||
                            question.questionType === 'Yes/No/Not Given' ||
                            question.questionType ===
                              'Multiple choice with one answer' ||
                            question.questionType ===
                              'Multiple choice with more than one answer')
                            ? 'set-margin-top'
                            : 'set-small-margin-top'
                        "
                      >
                        <!-- True/False/Not Given -->
                        <div
                          v-if="
                            question.questionType === 'True/False/Not Given'
                          "
                          style="width: 100%"
                        >
                          <div
                            class="edu-editor"
                            v-if="question.questionContent !== ''"
                            v-html="question.questionContentWithoutKey"
                          ></div>
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
                                handleSendkeyWithDebounce();
                              }
                            "
                          >
                            <a-radio class="radio-style" :value="0">
                              <b> True </b>
                            </a-radio>

                            <a-radio class="radio-style" :value="1">
                              <b> False </b>
                            </a-radio>

                            <a-radio class="radio-style" :value="2">
                              <b> Not Given </b>
                            </a-radio>
                          </a-radio-group>
                        </div>
                        <!-- Yes/No/Not Given -->
                        <div
                          v-if="question.questionType === 'Yes/No/Not Given'"
                          style="width: 100%"
                        >
                          <div
                            v-if="question.questionContent !== ''"
                            class="edu-editor"
                            v-html="question.questionContentWithoutKey"
                          ></div>
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
                                handleSendkeyWithDebounce();
                              }
                            "
                          >
                            <a-radio class="radio-style" :value="0">
                              <b> Yes </b>
                            </a-radio>

                            <a-radio class="radio-style" :value="1">
                              <b> No </b>
                            </a-radio>

                            <a-radio class="radio-style" :value="2">
                              <b> Not Given </b>
                            </a-radio>
                          </a-radio-group>
                        </div>
                        <!-- Summary Completion -->
                        <div
                          v-if="question.questionType === 'Summary Completion'"
                          style="margin-top: 0.5rem"
                        >
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                        </div>
                        <!-- Multiple choice with one answer -->
                        <div
                          v-if="
                            question.questionType ===
                            'Multiple choice with one answer'
                          "
                        >
                          <div
                            class="edu-editor"
                            v-if="question.questionContent !== ''"
                            v-html="question.questionContentWithoutKey"
                          ></div>

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
                                  question.listAnswers[question.valueForRadio],
                                ];
                                handleSendkeyWithDebounce();
                              }
                            "
                            style="width: 100%"
                          >
                            <div>
                              <a-radio
                                class="radio-style-multiple"
                                :value="answerIndex"
                              >
                                <div style="display: flex; margin-top: -3px">
                                  <b>
                                    {{
                                      `${formatStartOfQuestion(answerIndex)} `
                                    }}
                                  </b>
                                  <span style="margin-left: 10px">{{
                                    answer
                                  }}</span>
                                </div>
                              </a-radio>
                            </div>
                          </a-radio-group>
                        </div>
                        <!-- Multiple choice with more than one answer -->
                        <div
                          v-if="
                            question.questionType ===
                            'Multiple choice with more than one answer'
                          "
                        >
                          <div
                            class="edu-editor"
                            v-if="question.questionContent !== ''"
                            v-html="question.questionContentWithoutKey"
                          ></div>

                          <div
                            v-for="(
                              answer, answerIndex
                            ) in question.listAnswers"
                            :key="answerIndex"
                            :value="answer"
                            style="
                              display: flex;
                              justify-content: start;
                              background: #f5f5f5;
                              border-radius: 5px;
                              margin-top: 0.5rem;
                            "
                          >
                            <div style="padding: 10px; display: flex">
                              <v-checkbox
                                @change="
                                (val) =>
                                  handleAddAnswerKeyCheckBox(
                                    val,
                                    question,
                                    answerIndex
                                  ), 
                              "
                                :disabled="
                                  question.listKeys.length ===
                                    question.totalKeys &&
                                  question.listKeys.indexOf(answer) === -1
                                "
                                style="height: 10px; margin-top: -5px"
                              >
                              </v-checkbox>
                            </div>
                            <div style="padding: 10px; max-width: 80%">
                              <b>
                                {{ `${formatStartOfQuestion(answerIndex)}. ` }}
                              </b>
                              <b>{{ answer }}</b>
                            </div>
                          </div>
                        </div>
                        <!-- Flow-chart Completion (image) -->
                        <div
                          v-if="
                            question.questionType ===
                            'Flow-chart Completion (image)'
                          "
                        >
                          <div
                            class="edu-editor"
                            v-html="question.questionContentWithoutKey"
                          ></div>

                          <div
                            v-for="(
                              answer, answerIndex
                            ) in question.listAnswers"
                            :key="answerIndex"
                            style="
                              display: flex;
                              justify-content: space-between;
                            "
                          >
                            <div
                              style="
                                padding: 10px;
                                max-width: 80%;
                                display: flex;
                              "
                            >
                              <b style="padding-top: 0.3rem"
                                >{{ answerIndex + 1 }}.</b
                              >
                              <a-input
                                style="
                                  border: solid 1px;
                                  height: 1.5rem;
                                  margin: 5px;
                                  padding: 2px;
                                "
                                @change="
                                  (val) => {
                                    handleAddKey(
                                      val.target.value,
                                      question,
                                      answerIndex
                                    );
                                    handleSendkeyWithDebounce();
                                  }
                                "
                              >
                              </a-input>
                            </div>
                          </div>
                        </div>
                        <!-- Flow-chart Completion -->
                        <div
                          v-if="
                            question.questionType === 'Flow-chart Completion'
                          "
                          style="margin-top: 0.5rem"
                        >
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                        </div>
                        <!-- Sentence Completion -->
                        <div
                          v-if="question.questionType === 'Sentence Completion'"
                        >
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                          <div
                            class="answer-list"
                            @dragover="
                              (event) => {
                                event.stopPropagation();
                                event.preventDefault();
                              }
                            "
                            @dragenter="
                              (event) => {
                                event.preventDefault();
                                handleChangeBorder();
                              }
                            "
                            @dragleave="
                              (event) => {
                                handleUnChangeBorder();
                              }
                            "
                            @drop="
                              (event) =>
                                dropToAnswersList(
                                  event,
                                  questionGroup,
                                  question
                                )
                            "
                          >
                            <div
                              v-for="(
                                answer, answerIndex
                              ) in question.listAnswersWithoutKey"
                              :key="answerIndex"
                              :value="answer"
                              style="
                                display: flex;
                                justify-content: space-between;
                                background: #f5f5f5;
                                border-radius: 5px;
                                margin-top: 0.5rem;
                              "
                              :draggable="true"
                              @dragstart="startDrag($event, answer)"
                              @dragend="
                                endDrag($event, questionGroup, question)
                              "
                            >
                              <div style="padding: 10px; max-width: 80%">
                                <b> {{ `${answerIndex + 1}. ` }} </b>
                                <b>{{
                                  answer
                                    ? answer
                                    : answer.replace("[", "").replace("]", "")
                                }}</b>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Flow-chart Completion (dragable) -->
                        <div
                          v-if="
                            question.questionType ===
                            'Flow-chart Completion (dragable)'
                          "
                          style="margin-top: 0.5rem"
                        >
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                          <div
                            class="answer-list"
                            @dragover="
                              (event) => {
                                event.stopPropagation();
                                event.preventDefault();
                              }
                            "
                            @dragenter="
                              (event) => {
                                event.preventDefault();
                                handleChangeBorder();
                              }
                            "
                            @dragleave="
                              (event) => {
                                handleUnChangeBorder();
                              }
                            "
                            @drop="
                              (event) =>
                                dropToAnswersList(
                                  event,
                                  questionGroup,
                                  question
                                )
                            "
                          >
                            <div
                              v-for="(
                                answer, answerIndex
                              ) in question.listAnswersWithoutKey"
                              :key="answerIndex"
                              :value="answer"
                              style="
                                display: flex;
                                justify-content: space-between;
                                background: #f5f5f5;
                                border-radius: 5px;
                                margin-top: 0.5rem;
                              "
                              :draggable="true"
                              @dragstart="startDrag($event, answer)"
                              @dragend="
                                endDrag($event, questionGroup, question)
                              "
                            >
                              <div
                                style="
                                  padding: 10px;
                                  max-width: 80%;
                                  display: flex;
                                "
                              >
                                <b> {{ `${answerIndex + 1}. ` }} </b>
                                <b>{{
                                  answer
                                    ? answer
                                    : answer.replace("[", "").replace("]", "")
                                }}</b>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Matching Headings -->
                        <div
                          v-if="question.questionType === 'Matching Headings'"
                        >
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                          <div
                            class="answer-list"
                            @dragover="
                              (event) => {
                                event.stopPropagation();
                                event.preventDefault();
                              }
                            "
                            @dragenter="
                              (event) => {
                                event.preventDefault();
                                handleChangeBorder();
                              }
                            "
                            @dragleave="
                              (event) => {
                                handleUnChangeBorder();
                              }
                            "
                            @drop="
                              (event) =>
                                dropToAnswersList(
                                  event,
                                  questionGroup,
                                  question
                                )
                            "
                          >
                            <div
                              v-for="(
                                answer, answerIndex
                              ) in question.listAnswersWithoutKey"
                              :key="answerIndex"
                              :value="answer"
                              style="
                                display: flex;
                                justify-content: space-between;
                                background: #f5f5f5;
                                border-radius: 5px;
                                margin-top: 0.5rem;
                              "
                              draggable="true"
                              @dragstart="startDrag($event, answer)"
                              @dragend="
                                endDrag($event, questionGroup, question)
                              "
                            >
                              <div
                                style="
                                  padding: 10px;
                                  max-width: 80%;
                                  display: flex;
                                "
                              >
                                <b> {{ `${answerIndex + 1}. ` }} </b>
                                <b>{{
                                  answer
                                    ? answer.replace("[", "").replace("]", "")
                                    : answer.replace("[", "").replace("]", "")
                                }}</b>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!--  Matching Sentence Endings -->
                        <div
                          v-if="
                            question.questionType ===
                            'Matching Sentence Endings'
                          "
                        >
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                          <div
                            class="answer-list"
                            @dragover="
                              (event) => {
                                event.stopPropagation();
                                event.preventDefault();
                              }
                            "
                            @dragenter="
                              (event) => {
                                event.preventDefault();
                                handleChangeBorder();
                              }
                            "
                            @dragleave="
                              (event) => {
                                handleUnChangeBorder();
                              }
                            "
                            @drop="
                              (event) =>
                                dropToAnswersList(
                                  event,
                                  questionGroup,
                                  question
                                )
                            "
                          >
                            <div
                              v-for="(
                                answer, answerIndex
                              ) in question.listAnswersWithoutKey"
                              :key="answerIndex"
                              :value="answer"
                              style="
                                display: flex;
                                justify-content: space-between;
                                background: #f5f5f5;
                                border-radius: 5px;
                                margin-top: 0.5rem;
                              "
                              :draggable="true"
                              @dragstart="startDrag($event, answer)"
                              @dragend="
                                endDrag($event, questionGroup, question)
                              "
                            >
                              <div
                                style="
                                  padding: 10px;
                                  max-width: 80%;
                                  display: flex;
                                "
                              >
                                <b> {{ `${answerIndex + 1}. ` }} </b>
                                <b>{{
                                  answer
                                    ? answer
                                    : answer.replace("[", "").replace("]", "")
                                }}</b>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Summary Completion (dragable) -->
                        <div
                          v-if="
                            question.questionType ===
                            'Summary Completion (dragable)'
                          "
                          style="margin-top: 0.5rem"
                        >
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                          <div
                            class="answer-list"
                            @dragover="
                              (event) => {
                                event.stopPropagation();
                                event.preventDefault();
                              }
                            "
                            @dragenter="
                              (event) => {
                                event.preventDefault();
                                handleChangeBorder();
                              }
                            "
                            @dragleave="
                              (event) => {
                                handleUnChangeBorder();
                              }
                            "
                            @drop="
                              (event) =>
                                dropToAnswersList(
                                  event,
                                  questionGroup,
                                  question
                                )
                            "
                          >
                            <div
                              v-for="(
                                answer, answerIndex
                              ) in question.listAnswersWithoutKey"
                              :key="answerIndex"
                              :value="answer"
                              style="
                                display: flex;
                                justify-content: space-between;
                                background: #f5f5f5;
                                border-radius: 5px;
                                margin-top: 0.5rem;
                              "
                              :draggable="true"
                              @dragstart="startDrag($event, answer)"
                              @dragend="
                                endDrag($event, questionGroup, question)
                              "
                            >
                              <div
                                style="
                                  padding: 10px;
                                  max-width: 80%;
                                  display: flex;
                                "
                              >
                                <b> {{ `${answerIndex + 1}. ` }} </b>
                                <b>{{
                                  answer
                                    ? answer
                                    : answer.replace("[", "").replace("]", "")
                                }}</b>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Map Labelling (dragable) -->
                        <div
                          v-if="
                            question.questionType === 'Map Labelling (dragable)'
                          "
                          style="margin-top: 0.5rem"
                        >
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                          <div
                            class="answer-list"
                            @dragover="
                              (event) => {
                                event.stopPropagation();
                                event.preventDefault();
                              }
                            "
                            @dragenter="
                              (event) => {
                                event.preventDefault();
                                handleChangeBorder();
                              }
                            "
                            @dragleave="
                              (event) => {
                                handleUnChangeBorder();
                              }
                            "
                            @drop="
                              (event) =>
                                dropToAnswersList(
                                  event,
                                  questionGroup,
                                  question
                                )
                            "
                          >
                            <div
                              v-for="(
                                answer, answerIndex
                              ) in question.listAnswersWithoutKey"
                              :key="answerIndex"
                              :value="answer"
                              style="
                                display: flex;
                                justify-content: space-between;
                                background: #f5f5f5;
                                border-radius: 5px;
                                margin-top: 0.5rem;
                              "
                              :draggable="true"
                              @dragstart="startDrag($event, answer)"
                              @dragend="
                                endDrag($event, questionGroup, question)
                              "
                            >
                              <div
                                style="
                                  padding: 10px;
                                  max-width: 80%;
                                  display: flex;
                                "
                              >
                                <b> {{ `${answerIndex + 1}. ` }} </b>
                                <b>{{
                                  answer
                                    ? answer
                                    : answer.replace("[", "").replace("]", "")
                                }}</b>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Table Completion -->
                        <div
                          v-if="question.questionType === 'Table Completion'"
                          style="margin-top: 0.5rem"
                        >
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                        </div>
                        <!-- Form Completion -->
                        <div
                          v-if="question.questionType === 'Form Completion'"
                          style="margin-top: 0.5rem"
                        >
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                        </div>
                        <!-- Note Completion -->

                        <div v-if="question.questionType === 'Note Completion'">
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                        </div>
                      </a-card>
                    </a-collapse-panel>
                  </a-collapse>
                </div>
              </div>
            </div>
          </div>
        </a-card>
        <div></div>
        <div
          v-bind:style="[
            topicIndex === currentIndex ? {} : { display: 'none' },
          ]"
          style="display: flex; width: 100%; height: 1.7rem"
        >
          <div style="width: 90%; display: flex">
            <a-checkbox
              style="display: flex; align-items: center"
              v-if="!studentCheckedKeys[currentButtonIndex].isReview"
              @change="handleCheckReview()"
            >
              review
            </a-checkbox>
            <a-checkbox
              style="display: flex; align-items: center"
              v-else
              @change="handleCheckReview()"
              :checked="true"
            >
              review
            </a-checkbox>
            <div
              style="
                width: 96%;
                padding: 0px;
                margin-left: 1rem;
                height: fix-content;
              "
            >
              <div v-if="studentCheckedKeys.length <= 40" style="display: flex">
                <div v-for="(item, index) in studentCheckedKeys" :key="index">
                  <div
                    v-if="
                      listStudentKeys &&
                      listStudentKeys[index] &&
                      listStudentKeys[index].key !== ''
                    "
                  >
                    <a-button
                      size="small"
                      style="margin-left: 4px; color: white; background: #000"
                      class="btn_style"
                      type="primary"
                      v-if="!item.isReview"
                      @click="handleReview(index)"
                    >
                      {{ index + 1 }}
                    </a-button>
                    <a-button
                      size="small"
                      style="margin-left: 4px; color: white; background: #000"
                      type="primary"
                      shape="circle"
                      class="btn_style"
                      v-if="item.isReview"
                      @click="handleReview(index)"
                    >
                      {{ index + 1 }}
                    </a-button>
                  </div>
                  <div v-else>
                    <a-button
                      size="small"
                      style="margin-left: 4px"
                      v-if="item.isReview"
                      shape="circle"
                      @click="handleReview(index)"
                    >
                      {{ index + 1 }}
                    </a-button>
                    <a-button
                      @click="handleReview(index)"
                      size="small"
                      style="margin-left: 4px"
                      v-else
                    >
                      {{ index + 1 }}
                    </a-button>
                  </div>
                </div>
              </div>
              <div v-else>
                <div style="display: flex">
                  <div v-for="(x, index) in 20" :key="x">
                    <div
                      v-if="
                        listStudentKeys &&
                        listStudentKeys[index] &&
                        listStudentKeys[index].key !== ''
                      "
                    >
                      <a-button
                        size="small"
                        style="margin-left: 4px; color: white"
                        type="primary"
                        shape="circle"
                        v-if="studentCheckedKeys[index].isReview"
                        @click="handleReview(index)"
                      >
                        {{ x }}
                      </a-button>
                      <a-button
                        size="small"
                        style="margin-left: 4px; color: white"
                        type="primary"
                        v-else
                        @click="handleReview(index)"
                      >
                        {{ x }}
                      </a-button>
                    </div>
                    <div v-else>
                      <a-button
                        size="small"
                        style="margin-left: 4px"
                        shape="circle"
                        v-if="studentCheckedKeys[index].isReview"
                        @click="handleReview(index)"
                      >
                        {{ x }}
                      </a-button>
                      <a-button
                        @click="handleReview(index)"
                        size="small"
                        style="margin-left: 4px"
                        v-else
                      >
                        {{ x }}
                      </a-button>
                    </div>
                  </div>
                </div>
                <div style="display: flex; margin-top: 0.5rem">
                  <div
                    v-for="(j, index) in studentCheckedKeys.length - 20"
                    :key="j"
                  >
                    <div
                      v-if="
                        listStudentKeys &&
                        listStudentKeys[index + 20] &&
                        listStudentKeys[index + 20].key !== ''
                      "
                    >
                      <a-button
                        size="small"
                        style="margin-left: 4px; color: white"
                        type="primary"
                        v-if="!studentCheckedKeys[index + 25].isReview"
                        @click="handleReview(index + 20)"
                      >
                        {{ j + 20 }}
                      </a-button>
                      <a-button
                        size="small"
                        style="margin-left: 4px; color: white"
                        shape="circle"
                        type="primary"
                        v-else
                        @click="handleReview(index + 20)"
                      >
                        {{ j + 20 }}
                      </a-button>
                    </div>
                    <div v-else>
                      <a-button
                        shape="circle"
                        size="small"
                        style="margin-left: 4px"
                        v-if="studentCheckedKeys[index + 20].isReview"
                        @click="handleReview(index + 20)"
                      >
                        {{ j + 20 }}
                      </a-button>
                      <a-button
                        @click="handleReview(index + 25)"
                        size="small"
                        style="margin-left: 4px"
                        v-else
                      >
                        {{ j + 20 }}
                      </a-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            style="
              display: flex;
              justify-content: end;
              position: absolute;
              right: 10px;
              bottom: 5px;
            "
            class="responsive-button-submit"
          >
            <a-button
              type="primary"
              v-if="currentIndex > 0 && currentIndex <= totalTopics"
              style="height: 2rem; background: #000"
              @click="handleChangePage(topicIndex - 1)"
            >
              <a-icon type="arrow-left" />
            </a-button>
            <a-button
              style="margin-left: 0.5rem; height: 2rem; background: #000"
              type="primary"
              v-if="currentIndex >= 0 && currentIndex < totalTopics"
              @click="handleChangePage(topicIndex + 1)"
            >
              <a-icon type="arrow-right" />
            </a-button>
            <!-- <a-button
              style="margin-left: 0.5rem; height: 2rem; color: white"
              v-if="currentIndex === totalTopics"
              type="primary"
              @click="handleSubmit"
            >
              Submit</a-button
            > -->
            <v-btn
              style="
                margin-left: 0.5rem;
                height: 2rem;
                color: white;
                background: black;
              "
              v-if="currentIndex === totalTopics"
              type="primary"
              @click="handleSubmit"
            >
              <!-- <img style="width :20px; margin-right :1rem" src="../../../assets/send.png" /> -->
              Submit
              <v-icon dark right> mdi-send </v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <TableLoading v-if="loading"></TableLoading>
      <a-card
        v-else
        style="margin-top: 40px"
        class="remove-card-body-padding responsive-listening-site-header"
      >
        <div
          style="display: flex; align-item: center"
          class="responsive-listening-site-header-item"
        >
          <audio
            type="audio/mpeg"
            id="audioMain"
            controls
            class="custom-audio"
            autoplay
            controlsList="nodownload noplaybackrate"
            :src="fileListeningUrl"
          >
            <!-- <source :src="fileListeningUrl" type="audio/mpeg" /> -->
          </audio>
          <div
            id="slider-main"
            class="slider-main"
            style="display: flex; width: 340px; align-items: center"
          >
            <label
              for="pbrate"
              style="margin: 0px !important; margin-right: 0.8rem"
              >Speed:</label
            >
            <input
              type="range"
              id="pbrate"
              min="0.5"
              max="3"
              value="1"
              step=".25"
            />
            <span style="margin-left: 0.8rem" id="spanMain"></span>
          </div>
          <!-- <h5 v-html="this.testName"></h5> -->

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
          <div v-for="(topic, topicIndex) in listTopics" :key="topicIndex">
            <div
              style="padding: 10px
                max-width: 100%;
                width: 100%;
                max-height: 100%;
                overflow-y: scroll;
              "
            >
              <h4 style="margin: unset">Part {{ topicIndex + 1 }}</h4>
              <div class="edu-editor" v-html="topic.description"></div>
              <a-button
                v-if="topic && topic.fileListening"
                size="default"
                class="btn_style"
                style="height: 1.5rem; margin: 0rem 0 1rem 0"
                @click="handleChangeAudioSource(topic.fileListening)"
              >
                <div style="display: flex; align-items: center">
                  <img
                    style="width: 10px; margin-right: 0.7rem"
                    src="../../../assets/icons/headphones.png"
                  />
                  <span>Listen from here </span>
                </div>
              </a-button>
              <div
                v-for="(
                  questionGroup, questionGroupIndex
                ) in topic.listQuestionGroups"
                :key="questionGroupIndex"
                style="margin-bottom: 1rem"
              >
                <div>
                  <div
                    v-if="!questionGroup.content.includes('<figure')"
                    v-html="questionGroup.content"
                    style="margin-bottom: -0.5rem"
                  ></div>
                  <ckeditor
                    v-else
                    :id="makeid(5)"
                    :editor="editor"
                    @ready="onReady"
                    :config="editorConfig"
                    v-model="questionGroup.content"
                  ></ckeditor>
                  <a-collapse
                    :bordered="false"
                    v-for="(
                      question, questionIndex
                    ) in questionGroup.listQuestions"
                    :key="questionIndex + 1"
                    :value="question"
                    @change="
                      handleCollapse(questionGroup, question, questionIndex)
                    "
                  >
                    <template #expandIcon="props">
                      <a-icon
                        style="padding-bottom: 2px"
                        type="caret-right"
                        :rotate="props.isActive ? 90 : 0"
                      />
                    </template>
                    <a-collapse-panel
                      :class="
                        handleCreateClassName(
                          topicIndex,
                          questionGroupIndex,
                          question,
                          questionIndex
                        )
                      "
                      style="background: white"
                      :key="questionIndex + 1"
                      :forceRender="true"
                      :disabled="
                        question.questionType === 'Matching Information' ||
                        question.questionType === 'Map Labelling (dropdown)'
                      "
                    >
                      <template slot="header">
                        <div
                          v-if="
                            question.questionType !== 'Matching Information' &&
                            question.questionType !== 'Map Labelling (dropdown)'
                          "
                          style="display: flex; padding-bottom: 0px"
                        >
                          <div style="display: flex; align-items: center">
                            <b
                              style="margin-right: 10px; max-width: 5rem"
                              v-bind:style="[
                                question.questionNumber.length > 2
                                  ? { width: '40px' }
                                  : {},
                              ]"
                              >{{ question.questionNumber }}</b
                            >
                          </div>

                          <span>{{ question.questionTitle }}</span>
                        </div>
                        <div v-else style="display: flex">
                          <b
                            style="
                              margin-right: 10px;
                              display: flex;
                              align-items: center;
                            "
                            >{{ question.questionNumber }}</b
                          >
                          <span
                            style="
                              width: 90%;
                              display: flex;
                              align-items: center;
                            "
                            >{{ question.questionTitle }}</span
                          >
                          <div>
                            <a-select
                              v-if="!question.isRomanNumber"
                              size="default"
                              style="width: 60px; height: 2rem"
                              @change="
                                (val) => {
                                  question.listKeys = [
                                    formatStartOfQuestion(val - 1),
                                  ];
                                  handleSendkeyWithDebounce();
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
                            <a-select
                              v-else
                              size="default"
                              style="width: 60px; height: 2rem"
                              @change="
                                (val) => {
                                  question.listKeys = [
                                    formatStartOfQuestionRoman(val - 1),
                                  ];
                                  handleSendkeyWithDebounce();
                                }
                              "
                            >
                              <a-select-option
                                v-for="(item, index) in 15"
                                :key="item"
                                :value="item"
                              >
                                {{ formatStartOfQuestionRoman(index) }}
                              </a-select-option>
                            </a-select>
                          </div>
                        </div>
                      </template>
                      <a-card
                        size="small"
                        style="border: none; padding-top: 0px !important"
                        :class="
                          question.questionContent === '' &&
                          (question.questionType === 'True/False/Not Given' ||
                            question.questionType === 'Yes/No/Not Given' ||
                            question.questionType ===
                              'Multiple choice with one answer' ||
                            question.questionType ===
                              'Multiple choice with more than one answer')
                            ? 'set-margin-top'
                            : 'set-small-margin-top'
                        "
                      >
                        <!-- True/False/Not Given -->
                        <div
                          v-if="
                            question.questionType === 'True/False/Not Given'
                          "
                          style="width: 100%"
                        >
                          <div
                            class="edu-editor"
                            v-if="question.questionContent !== ''"
                            v-html="question.questionContentWithoutKey"
                          ></div>
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
                                handleSendkeyWithDebounce();
                              }
                            "
                          >
                            <a-radio class="radio-style" :value="0">
                              <b> True </b>
                            </a-radio>

                            <a-radio class="radio-style" :value="1">
                              <b> False </b>
                            </a-radio>

                            <a-radio class="radio-style" :value="2">
                              <b> Not Given </b>
                            </a-radio>
                          </a-radio-group>
                        </div>
                        <!-- Yes/No/Not Given -->
                        <div
                          v-if="question.questionType === 'Yes/No/Not Given'"
                          style="width: 100%"
                        >
                          <div
                            v-if="question.questionContent !== ''"
                            class="edu-editor"
                            v-html="question.questionContentWithoutKey"
                          ></div>
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
                                handleSendkeyWithDebounce();
                              }
                            "
                          >
                            <a-radio class="radio-style" :value="0">
                              <b> Yes </b>
                            </a-radio>

                            <a-radio class="radio-style" :value="1">
                              <b> No </b>
                            </a-radio>
                            <a-radio class="radio-style" :value="2">
                              <b> Not Given </b>
                            </a-radio>
                          </a-radio-group>
                        </div>
                        <!-- Summary Completion -->
                        <div
                          v-if="question.questionType === 'Summary Completion'"
                          style="margin-top: 0.5rem"
                        >
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                        </div>
                        <!-- Multiple choice with one answer -->
                        <div
                          v-if="
                            question.questionType ===
                            'Multiple choice with one answer'
                          "
                        >
                          <div
                            class="edu-editor"
                            v-if="question.questionContent !== ''"
                            v-html="question.questionContentWithoutKey"
                          ></div>

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
                                  question.listAnswers[question.valueForRadio],
                                ];
                                handleSendkeyWithDebounce();
                              }
                            "
                            style="width: 100%"
                          >
                            <div>
                              <a-radio
                                class="radio-style-multiple"
                                :value="answerIndex"
                              >
                                <div style="display: flex; margin-top: -3px">
                                  <b>
                                    {{
                                      `${formatStartOfQuestion(answerIndex)} `
                                    }}
                                  </b>
                                  <span style="margin-left: 10px">{{
                                    answer
                                  }}</span>
                                </div>
                              </a-radio>
                            </div>
                          </a-radio-group>
                        </div>
                        <!-- Multiple choice with more than one answer -->
                        <div
                          v-if="
                            question.questionType ===
                            'Multiple choice with more than one answer'
                          "
                        >
                          <div
                            class="edu-editor"
                            v-if="question.questionContent !== ''"
                            v-html="question.questionContentWithoutKey"
                          ></div>

                          <div
                            v-for="(
                              answer, answerIndex
                            ) in question.listAnswers"
                            :key="answerIndex"
                            :value="answer"
                            style="
                              display: flex;
                              justify-content: start;
                              background: #f5f5f5;
                              border-radius: 5px;
                              margin-top: 0.5rem;
                            "
                          >
                            <div style="padding: 10px; display: flex">
                              <v-checkbox
                                @change="
                    (val) =>
                      handleAddAnswerKeyCheckBox(
                        val,
                        question,
                        answerIndex
                      ), 
                  "
                                :disabled="
                                  question.listKeys.length ===
                                    question.totalKeys &&
                                  question.listKeys.indexOf(answer) === -1
                                "
                                style="height: 10px; margin-top: -5px"
                              >
                              </v-checkbox>
                            </div>
                            <div style="padding: 10px; max-width: 80%">
                              <b>
                                {{ `${formatStartOfQuestion(answerIndex)}. ` }}
                              </b>
                              <b>{{ answer }}</b>
                            </div>
                          </div>
                        </div>
                        <!-- Flow-chart Completion (image) -->
                        <div
                          v-if="
                            question.questionType ===
                            'Flow-chart Completion (image)'
                          "
                        >
                          <div
                            class="edu-editor"
                            v-html="question.questionContentWithoutKey"
                          ></div>

                          <div
                            v-for="(
                              answer, answerIndex
                            ) in question.listAnswers"
                            :key="answerIndex"
                            style="
                              display: flex;
                              justify-content: space-between;
                            "
                          >
                            <div
                              style="
                                padding: 10px;
                                max-width: 80%;
                                display: flex;
                              "
                            >
                              <b style="padding-top: 0.3rem"
                                >{{ answerIndex + 1 }}.</b
                              >
                              <a-input
                                style="
                                  border: solid 1px;
                                  height: 1.5rem;
                                  margin: 5px;
                                  padding: 2px;
                                "
                                @change="
                                  (val) => {
                                    handleAddKey(
                                      val.target.value,
                                      question,
                                      answerIndex
                                    );
                                    handleSendkeyWithDebounce();
                                  }
                                "
                              >
                              </a-input>
                            </div>
                          </div>
                        </div>
                        <!-- Flow-chart Completion -->
                        <div
                          v-if="
                            question.questionType === 'Flow-chart Completion'
                          "
                          style="margin-top: 0.5rem"
                        >
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                        </div>
                        <!-- Sentence Completion -->
                        <div
                          v-if="question.questionType === 'Sentence Completion'"
                        >
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                          <div
                            class="answer-list"
                            @dragover="
                              (event) => {
                                event.stopPropagation();
                                event.preventDefault();
                              }
                            "
                            @dragenter="
                              (event) => {
                                event.preventDefault();
                                handleChangeBorder();
                              }
                            "
                            @dragleave="
                              (event) => {
                                handleUnChangeBorder();
                              }
                            "
                            @drop="
                              (event) =>
                                dropToAnswersList(
                                  event,
                                  questionGroup,
                                  question
                                )
                            "
                          >
                            <div
                              v-for="(
                                answer, answerIndex
                              ) in question.listAnswersWithoutKey"
                              :key="answerIndex"
                              :value="answer"
                              style="
                                display: flex;
                                justify-content: space-between;
                                background: #f5f5f5;
                                border-radius: 5px;
                                margin-top: 0.5rem;
                              "
                              :draggable="true"
                              @dragstart="startDrag($event, answer)"
                              @dragend="
                                endDrag($event, questionGroup, question)
                              "
                            >
                              <div style="padding: 10px; max-width: 80%">
                                <b> {{ `${answerIndex + 1}. ` }} </b>
                                <b>{{
                                  answer
                                    ? answer
                                    : answer.replace("[", "").replace("]", "")
                                }}</b>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Flow-chart Completion (dragable) -->
                        <div
                          v-if="
                            question.questionType ===
                            'Flow-chart Completion (dragable)'
                          "
                          style="margin-top: 0.5rem"
                        >
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                          <div
                            class="answer-list"
                            @dragover="
                              (event) => {
                                event.stopPropagation();
                                event.preventDefault();
                              }
                            "
                            @dragenter="
                              (event) => {
                                event.preventDefault();
                                handleChangeBorder();
                              }
                            "
                            @dragleave="
                              (event) => {
                                handleUnChangeBorder();
                              }
                            "
                            @drop="
                              (event) =>
                                dropToAnswersList(
                                  event,
                                  questionGroup,
                                  question
                                )
                            "
                          >
                            <div
                              v-for="(
                                answer, answerIndex
                              ) in question.listAnswersWithoutKey"
                              :key="answerIndex"
                              :value="answer"
                              style="
                                display: flex;
                                justify-content: space-between;
                                background: #f5f5f5;
                                border-radius: 5px;
                                margin-top: 0.5rem;
                              "
                              :draggable="true"
                              @dragstart="startDrag($event, answer)"
                              @dragend="
                                endDrag($event, questionGroup, question)
                              "
                            >
                              <div
                                style="
                                  padding: 10px;
                                  max-width: 80%;
                                  display: flex;
                                "
                              >
                                <b> {{ `${answerIndex + 1}. ` }} </b>
                                <b>{{
                                  answer
                                    ? answer
                                    : answer.replace("[", "").replace("]", "")
                                }}</b>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Matching Headings -->
                        <div
                          v-if="question.questionType === 'Matching Headings'"
                        >
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                          <div
                            class="answer-list"
                            @dragover="
                              (event) => {
                                event.stopPropagation();
                                event.preventDefault();
                              }
                            "
                            @dragenter="
                              (event) => {
                                event.preventDefault();
                                handleChangeBorder();
                              }
                            "
                            @dragleave="
                              (event) => {
                                handleUnChangeBorder();
                              }
                            "
                            @drop="
                              (event) =>
                                dropToAnswersList(
                                  event,
                                  questionGroup,
                                  question
                                )
                            "
                          >
                            <div
                              v-for="(
                                answer, answerIndex
                              ) in question.listAnswersWithoutKey"
                              :key="answerIndex"
                              :value="answer"
                              style="
                                display: flex;
                                justify-content: space-between;
                                background: #f5f5f5;
                                border-radius: 5px;
                                margin-top: 0.5rem;
                              "
                              draggable="true"
                              @dragstart="startDrag($event, answer)"
                              @dragend="
                                endDrag($event, questionGroup, question)
                              "
                            >
                              <div
                                style="
                                  padding: 10px;
                                  max-width: 80%;
                                  display: flex;
                                "
                              >
                                <b> {{ `${answerIndex + 1}. ` }} </b>
                                <b>{{
                                  answer
                                    ? answer.replace("[", "").replace("]", "")
                                    : answer.replace("[", "").replace("]", "")
                                }}</b>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!--  Matching Sentence Endings -->
                        <div
                          v-if="
                            question.questionType ===
                            'Matching Sentence Endings'
                          "
                        >
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                          <div
                            class="answer-list"
                            @dragover="
                              (event) => {
                                event.stopPropagation();
                                event.preventDefault();
                              }
                            "
                            @dragenter="
                              (event) => {
                                event.preventDefault();
                                handleChangeBorder();
                              }
                            "
                            @dragleave="
                              (event) => {
                                handleUnChangeBorder();
                              }
                            "
                            @drop="
                              (event) =>
                                dropToAnswersList(
                                  event,
                                  questionGroup,
                                  question
                                )
                            "
                          >
                            <div
                              v-for="(
                                answer, answerIndex
                              ) in question.listAnswersWithoutKey"
                              :key="answerIndex"
                              :value="answer"
                              style="
                                display: flex;
                                justify-content: space-between;
                                background: #f5f5f5;
                                border-radius: 5px;
                                margin-top: 0.5rem;
                              "
                              :draggable="true"
                              @dragstart="startDrag($event, answer)"
                              @dragend="
                                endDrag($event, questionGroup, question)
                              "
                            >
                              <div
                                style="
                                  padding: 10px;
                                  max-width: 80%;
                                  display: flex;
                                "
                              >
                                <b> {{ `${answerIndex + 1}. ` }} </b>
                                <b>{{
                                  answer
                                    ? answer
                                    : answer.replace("[", "").replace("]", "")
                                }}</b>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Summary Completion (dragable) -->
                        <div
                          v-if="
                            question.questionType ===
                            'Summary Completion (dragable)'
                          "
                          style="margin-top: 0.5rem"
                        >
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                          <div
                            class="answer-list"
                            @dragover="
                              (event) => {
                                event.stopPropagation();
                                event.preventDefault();
                              }
                            "
                            @dragenter="
                              (event) => {
                                event.preventDefault();
                                handleChangeBorder();
                              }
                            "
                            @dragleave="
                              (event) => {
                                handleUnChangeBorder();
                              }
                            "
                            @drop="
                              (event) =>
                                dropToAnswersList(
                                  event,
                                  questionGroup,
                                  question
                                )
                            "
                          >
                            <div
                              v-for="(
                                answer, answerIndex
                              ) in question.listAnswersWithoutKey"
                              :key="answerIndex"
                              :value="answer"
                              style="
                                display: flex;
                                justify-content: space-between;
                                background: #f5f5f5;
                                border-radius: 5px;
                                margin-top: 0.5rem;
                              "
                              :draggable="true"
                              @dragstart="startDrag($event, answer)"
                              @dragend="
                                endDrag($event, questionGroup, question)
                              "
                            >
                              <div
                                style="
                                  padding: 10px;
                                  max-width: 80%;
                                  display: flex;
                                "
                              >
                                <b> {{ `${answerIndex + 1}. ` }} </b>
                                <b>{{
                                  answer
                                    ? answer
                                    : answer.replace("[", "").replace("]", "")
                                }}</b>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Map Labelling (dragable) -->
                        <div
                          v-if="
                            question.questionType === 'Map Labelling (dragable)'
                          "
                          style="margin-top: 0.5rem"
                        >
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                          <div
                            class="answer-list"
                            @dragover="
                              (event) => {
                                event.stopPropagation();
                                event.preventDefault();
                              }
                            "
                            @dragenter="
                              (event) => {
                                event.preventDefault();
                                handleChangeBorder();
                              }
                            "
                            @dragleave="
                              (event) => {
                                handleUnChangeBorder();
                              }
                            "
                            @drop="
                              (event) =>
                                dropToAnswersList(
                                  event,
                                  questionGroup,
                                  question
                                )
                            "
                          >
                            <div
                              v-for="(
                                answer, answerIndex
                              ) in question.listAnswersWithoutKey"
                              :key="answerIndex"
                              :value="answer"
                              style="
                                display: flex;
                                justify-content: space-between;
                                background: #f5f5f5;
                                border-radius: 5px;
                                margin-top: 0.5rem;
                              "
                              :draggable="true"
                              @dragstart="startDrag($event, answer)"
                              @dragend="
                                endDrag($event, questionGroup, question)
                              "
                            >
                              <div
                                style="
                                  padding: 10px;
                                  max-width: 80%;
                                  display: flex;
                                "
                              >
                                <b> {{ `${answerIndex + 1}. ` }} </b>
                                <b>{{
                                  answer
                                    ? answer
                                    : answer.replace("[", "").replace("]", "")
                                }}</b>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Table Completion -->
                        <div
                          v-if="question.questionType === 'Table Completion'"
                          style="margin-top: 0.5rem"
                        >
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                        </div>
                        <!-- Form Completion -->
                        <div
                          v-if="question.questionType === 'Form Completion'"
                          style="margin-top: 0.5rem"
                        >
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                        </div>
                        <!-- Note Completion -->

                        <div v-if="question.questionType === 'Note Completion'">
                          <div
                            class="edu-editor"
                            v-html="
                              replaceBracketWithInput(
                                question.questionContentWithoutKey
                              )
                            "
                          ></div>
                        </div>
                      </a-card>
                    </a-collapse-panel>
                  </a-collapse>
                </div>
              </div>
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
                      listStudentKeys &&
                      listStudentKeys[index] &&
                      listStudentKeys[index].key !== ''
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
                        @click="handleReview(index)"
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
                        @click="handleReview(index)"
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
                        @click="handleReview(index)"
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
                        @click="handleReview(index)"
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
          <a-collapse style="color: white" expand-icon-position="right">
            <template #expandIcon="props">
              <a-icon
                style="padding-bottom: 2px; color: white"
                type="caret-right"
                :rotate="props.isActive ? 90 : -90"
              />
            </template>

            <a-collapse-panel
              class="responsive-content-box"
              style="background: #edd31d; color: white"
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
                    style="color: white"
                  />
                </div>
              </template>
              <div
                class="responsive-content-collapse"
                style="background: #edd31d"
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
                <div style="width: 90%; display: flex">
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
                            listStudentKeys &&
                            listStudentKeys[index] &&
                            listStudentKeys[index].key !== ''
                          "
                        >
                          <a-dropdown>
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
                              v-if="!item.isReview"
                              @click="handleReview(index)"
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

                          <a-dropdown>
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
                              v-if="item.isReview"
                              @click="handleReview(index)"
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
                              @click="handleReview(index)"
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
                              @click="handleReview(index)"
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
          handleStopAudio();
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
        style="height : 200px, overflow-y: scroll;margin-top: 1rem;"
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
</template>

<script >
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import { MyUploadAdapter } from "../../Lesson/AddLessonModal.vue";
import CKEditor from "@ckeditor/ckeditor5-vue2";
import { NotificationMixin } from "../../../mixin/Notification";
import StudentKeys from "../../../api/studentKey";
import * as _ from "lodash";
import store from "../../../store/index";
import { cloneDeep } from "lodash";
import Test from "../../../api/Test";
import TableLoading from "../../../components/Base/TableLoading.vue";
import QuestionType from "../../../api/QuestionType";
export default {
  mixins: [NotificationMixin],
  components: { TableLoading, ckeditor: CKEditor.component },
  data() {
    return {
      testName: "",
      visibleSendKey: false,
      sendKeyLoading: false,
      visibleLeave: false,
      isLeave: false,
      testDescription: "",
      totalQuestions: 0,
      listTopics: [],
      activeKey: 1,
      listStudentKeys: [],
      value1: 30,
      isShowPoint: false,
      fileListeningUrl: "",
      visibleBackToExercise: false,
      studentResult: {},
      currentIndex: 0,
      totalTopics: 0,
      countDown: null,
      loading: false,
      studentCheckedKeys: [],
      currentButtonIndex: 0,
      defaultCheckedValue: true,
      isEditing: false,
      currentTotalQuestion: 0,
      currentStudentKeyId: null,
      currentSubject: "",
      testType: "",
      listInputCloned: [],
      editor: DecoupledEditor,
      editorConfig: {
        toolbar: {},
        readOnly: true,
        contenteditable: false,
      },
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
      // console.log(document.getElementsByClassName("ant-collapse-header"))
      // console.log(document.getElementsByClassName("ant-collapse-content"));
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
    // setTimeout(()=> {
    //   const editors = document.getElementsByClassName('ck-content');
    //   editors.forEach((element)=> {
    //     console.log(element);

    //     element.style.setProperty('pointer-events', 'none', 'important');
    //   });
    //   const figures = document.getElementsByTagName('figure');
    //   const figuresArray = Array.from(figures); // or [...figures];
    //   figuresArray.forEach((figure) => {
    //     console.log(figure);
    //     figure.style.setProperty('pointer-events', 'none', 'important');
    //   });
    // }, 500);
    document.getElementById("container").addEventListener("keyup", (e) => {
      this.handleSendkeyWithDebounce();
    });
    document.getElementById("container").addEventListener("mouseup", (evt) => {
      console.log(evt);
      //  const editors = document.getElementsByClassName('ck-content');
      //   editors.forEach((element)=> {
      //     console.log(element);
      //     element.setAttribute('contenteditable', false)
      //   });
      // const figures = document.getElementsByTagName('figure');
      // const figuresArray = Array.from(figures); // or [...figures];
      // figuresArray.forEach((figure) => {
      //   console.log(figure);
      //   figure.style.setProperty('pointer-events', 'none', 'important');
      // });
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
    setTimeout(() => {
      this.listTopics.map((topic, topicIndex) => {
        topic.listQuestionGroups.map((questionGroup, questionGroupIndex) => {
          listInputs = document.getElementsByClassName("answerTextBox");
          if (listInputs) {
            questionGroup.listInputs = listInputs;
            questionGroup.listKeys = [];
            for (let i = 0; i < questionGroup.listInputs.length; i++) {
              questionGroup.listKeys.push("");
            }
            questionGroup.oldKey = "";
            for (let j = 0; j < listInputs.length; j++) {
              // listInputs[i].addEventListener("drop", this.onDrop(event, index));
              let listInputsClone = listInputs[j].cloneNode(true);
              listInputs[j].replaceWith(listInputsClone);
              listInputs[j].addEventListener("focus", function (val) {
                questionGroup.listKeys[j] = val.target.value;
                store.commit("SET_SEND_TEST_STATUS", true);
              });
              listInputs[j].addEventListener("change", function (val) {
                questionGroup.listKeys[j] = val.target.value;
                store.commit("SET_SEND_TEST_STATUS", true);
              });
              listInputs[j].addEventListener("dragenter", function () {
                event.preventDefault();
              });
              listInputs[j].addEventListener("dragover", function () {
                event.stopPropagation();
                event.preventDefault();
              });
              listInputs[j].addEventListener("drop", function () {
                event.stopPropagation();
                event.preventDefault();
                listInputs[j].value = "";
                const b = document.createElement("b");
                questionGroup.oldKey = "";
                b.innerText = event.dataTransfer.getData("answerContent");
                b.setAttribute("draggable", true);
                // b.setAttribute("class", "answerTextBox");
                b.addEventListener("dragstart", function () {
                  event.dataTransfer.dropEffect = "move";
                  event.dataTransfer.effectAllowed = "move";
                  questionGroup.oldKey = b.innerText;
                  event.dataTransfer.setData("answerContent", b.innerText);
                });
                b.addEventListener("dragend", function () {
                  console.log("in");
                  if (questionGroup.oldKey !== "") {
                    b.innerText = questionGroup.oldKey;
                    questionGroup.oldKey = "";
                  } else {
                    listInputs[j].value = "";
                    listInputs[j].style.display = "inherit";
                    questionGroup.listKeys[j] = "";
                    b.remove();
                  }
                  store.commit("SET_SEND_TEST_STATUS", true);
                });
                b.addEventListener("dragenter", function () {
                  event.preventDefault();
                });
                b.addEventListener("dragleave", function () {
                  event.preventDefault();
                });
                b.addEventListener("dragover", function () {
                  event.stopPropagation();
                  event.preventDefault();
                });
                b.addEventListener("drop", function () {
                  event.stopPropagation();
                  event.preventDefault();
                  b.innerText = event.dataTransfer.getData("answerContent");
                  if (
                    event.dataTransfer.getData("answerContent") !==
                    questionGroup.listKeys[j]
                  ) {
                    questionGroup.oldKey = questionGroup.listKeys[j];
                  }

                  questionGroup.listKeys[j] =
                    event.dataTransfer.getData("answerContent");
                  // event.dataTransfer.setData("answerContent", "");
                });
                listInputs[j].after(b);
                questionGroup.listKeys[j] =
                  event.dataTransfer.getData("answerContent");
                listInputs[j].value =
                  event.dataTransfer.getData("answerContent");
                listInputs[j].style.display = "none";
                // event.dataTransfer.setData("answerContent", "");
                // listInputs[i].value = event.dataTransfer.getData("answerContent");
              });
            }
          }
        });
      });
      let collapse = document.getElementsByClassName("ant-collapse-header");
      if (collapse && collapse.length && collapse.length > 0) {
        for (let i = 0; i < collapse.length; i++) {
          collapse[i].setAttribute("aria-expanded", "true");
        }
      }
      // console.log(document.getElementsByClassName("ant-collapse-header"))
      // console.log(document.getElementsByClassName("ant-collapse-content"));
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
    }, 500);
    setTimeout(() => {
      let audio = document.getElementById("audioMain");
      document.getElementById("pbrate").oninput = function () {
        var value = ((this.value - this.min) / (this.max - this.min)) * 100;
        this.style.background =
          "linear-gradient(to right, #000 0%, #000 " +
          value +
          "%, #ccc " +
          value +
          "%, #ccc 100%)";
      };
      let display = document.getElementById("spanMain");
      let displayvalue = (val) => {
        return parseFloat(val, 10) + "x ";
      };
      let playbackrate = document.getElementById("pbrate");
      display.innerText = displayvalue(audio.playbackRate);
      playbackrate.addEventListener("change", (e) => {
        audio.playbackRate = playbackrate.value;
        display.innerText = displayvalue(playbackrate.value);
      });
    }, 1000);

    Test.getTestById(this.$route.params.exerciseId)
      .then((response) => {
        const data = response.data.data;
        this.currentSubject = data.subject;
        data.listTopics.map((topic) => {
          topic.listQuestionGroups.map((questionGroup) => {
            questionGroup.listQuestions.map((question) => {
              question.valueForRadio = null;
            });
          });
        });
        this.fileListeningUrl = data.fileListeningUrl;
        this.testName = data.testName;
        this.testDescription = data.testDescription;
        this.listTopics = data.listTopics;
        this.totalTopics = data.listTopics.length - 1;
        this.totalQuestions = parseInt(data.totalQuestions);
        this.testType = data.testType;
        // below are code use to check whether question has done or not
        for (let i = 0; i < this.totalQuestions; i++) {
          this.studentCheckedKeys.push({
            content: "",
            isReview: false,
          });
        }
        this.isShowPoint = data.isShowPoint ? data.isShowPoint : false;
        // recalculate for show point
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
    // get data for test that are inprocess or has just started
    StudentKeys.getCurrentStudentKeyByClassAndTestIdAndStudentId({
      classId: this.classId,
      testId: this.$route.params.exerciseId,
      studentId: this.userProfile._id,
    })
      .then((response) => {
        if (
          response.data.data &&
          response.data.data[0] &&
          (response.data.data[0].status === "inProcess" ||
            response.data.data[0].status === "started")
        ) {
          this.currentStudentKeyId = response.data.data[0]._id;
          // this.listStudentKeys =  response.data.data[0].listKeys;
          // console.log(this.listStudentKeys);
          this.loading = false;
        } else {
          const studentKey = {
            classId: this.classId,
            testId: this.testId,
            listKeys: this.studentCheckedKeys,
            totalQuestions: this.listTopics.totalQuestions,
            status: "started",
          };
          // create student key if student hasn't started the test before
          StudentKeys.createStudentKey(studentKey)
            .then((response) => {
              this.currentStudentKeyId = response.data.newStudentKeyCreated._id;
              this.loading = false;
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
        console.log("e", e);
        this.loading = false;
      });
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
    startDrag(event, answer) {
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData(
        "answerContent",
        answer
          ? answer.replace("[", "").replace("]", "")
          : answer.replace("[", "")
      );
    },
    checkIfContain(content) {
      console.log(content);
      return false;
    },
    onReady(editor) {
      // Insert the toolbar before the editable area.
      editor.enableReadOnlyMode("my-feature-id");
      editor.ui.getEditableElement();
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader);
      };
    },
    handleStopAudio() {
      console.log("in");
      let audio = document.getElementById("audioMain");
      audio.pause();
    },
    handleChangeFontSize(val) {
      const fontSize = `${val.target.value}px`;
      if (this.testType === "listening") {
        console.log(document.getElementsByClassName("test-left"));
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
      } else {
        this.changeFont(
          document.getElementsByClassName("responsive-reading")[0],
          fontSize
        );
        this.changeFont(
          document.getElementsByClassName("responsive-reading")[1],
          fontSize
        );
        this.changeFont(
          document.getElementsByClassName("responsive-reading")[2],
          fontSize
        );
        this.changeFont(
          document.getElementsByClassName("responsive-reading")[3],
          fontSize
        );
      }
    },
    changeFont(element, fontSize) {
      element.style.fontSize = fontSize.toString();
      for (var i = 0; i < element.children.length; i++) {
        this.changeFont(element.children[i], fontSize);
      }
    },
    addIndex(arr) {
      let newArr = [];
      arr.forEach((element, index) => {
        newArr.push({ ...element, index: index + 1 });
      });
      return newArr;
    },
    highlightRange(range) {
      let newNode = document.createElement("div");
      newNode.setAttribute(
        "style",
        "background-color: yellow; display: inline;"
      );
      range.surroundContents(newNode);
    },
    highlightSelection() {
      let userSelection = window.getSelection().getRangeAt(0);
      this.highlightRange(userSelection);
    },
    dropToAnswersList(event, questionGroup, question) {
      for (let i = 0; i < questionGroup.listKeys.length; i++) {
        if (
          questionGroup.listKeys[i] ===
          event.dataTransfer.getData("answerContent")
        ) {
          questionGroup.listKeys[i] = "";
        }
      }
      if (
        question.listAnswersWithoutKey.indexOf(
          event.dataTransfer.getData("answerContent")
        ) === -1
      ) {
        question.listAnswersWithoutKey.push(
          event.dataTransfer.getData("answerContent")
        );
      }
      questionGroup.oldKey = "";
    },
    endDrag(event, questionGroup, question) {
      question.listAnswersWithoutKey = _.difference(
        question.listAnswersWithoutKey,
        questionGroup.listKeys
      );
      if (
        questionGroup.oldKey !== "" &&
        question.listAnswersWithoutKey.indexOf(questionGroup.oldKey) === -1
      ) {
        question.listAnswersWithoutKey.push(questionGroup.oldKey);
      }
      this.handleSendKeyTest(true);
    },
    handleChangePage(index) {
      this.currentIndex = index;
    },

    handleSendkeyWithDebounce: _.debounce(function () {
      this.handleSendKeyTest(true);
    }, 200),
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
      if (question.listKeys.length === question.totalKeys) {
      }
      this.handleSendKeyTest(true);
    },
    handleAddKey(val, question, answerIndex) {
      question.listKeys[answerIndex] = val;
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
    handleReview(index) {
      let totalQuestionBefore = 0;
      let totalQuestionAfter = 0;
      if (this.currentIndex === 0) {
        this.listTopics[0].listQuestionGroups.map((questionGroup) => {
          questionGroup.listQuestions.map((question) => {
            totalQuestionAfter += question.numberOfQuestion;
          });
        });
      } else {
        for (let i = 0; i < this.currentIndex; i++) {
          this.listTopics[i].listQuestionGroups.map((questionGroup) => {
            questionGroup.listQuestions.map((question) => {
              totalQuestionBefore += question.numberOfQuestion;
            });
          });
        }
        for (let i = 0; i < this.currentIndex + 1; i++) {
          this.listTopics[i].listQuestionGroups.map((questionGroup) => {
            questionGroup.listQuestions.map((question) => {
              totalQuestionAfter += question.numberOfQuestion;
            });
          });
        }
      }
      if (index < totalQuestionBefore) {
        if (this.currentIndex === 0) {
          this.currentIndex--;
        } else {
          let newTotalQuestionBefore = 0;
          for (let i = 0; i < this.currentIndex - 1; i++) {
            this.listTopics[i].listQuestionGroups.map((questionGroup) => {
              questionGroup.listQuestions.map((question) => {
                newTotalQuestionBefore += question.numberOfQuestion;
              });
            });
          }
          if (index < newTotalQuestionBefore) {
            this.currentIndex -= 2;
          } else {
            this.currentIndex--;
          }
        }
      }
      if (index >= totalQuestionAfter) {
        if (this.currentIndex === this.listTopics.length) {
          this.currentIndex++;
        } else {
          let newTotalQuestionAfter = 0;
          for (let i = 0; i < this.currentIndex + 2; i++) {
            this.listTopics[i].listQuestionGroups.map((questionGroup) => {
              questionGroup.listQuestions.map((question) => {
                newTotalQuestionAfter += question.numberOfQuestion;
              });
            });
          }
          if (index >= newTotalQuestionAfter) {
            this.currentIndex += 2;
          } else {
            this.currentIndex++;
          }
        }
      }
      setTimeout(() => {
        const collection = document.getElementsByClassName(`${index + 1}`);
        if (collection && collection[0]) {
          let position = collection[0].getBoundingClientRect();
          collection[0].scrollIntoView();
          // window.scrollTo(position.left, position.top + window.scrollY - 300);
          collection[0].style.background = "lightblue";
          setTimeout(() => {
            collection[0].style.background = "white";
          }, 2000);
        }
      }, 100);

      this.currentButtonIndex = index;
    },
    handleBackToClassDetail() {
      this.$router.push({
        name: "quizExercise",
        params: { id: this.classId },
      });
    },

    handleCollapse(questionGroup, question, questionIndex) {
      //
    },
    handleCheckReview() {
      this.studentCheckedKeys[this.currentButtonIndex].isReview =
        !this.studentCheckedKeys[this.currentButtonIndex].isReview;
    },
    handleCheckReviewForListening(index) {
      this.studentCheckedKeys[index].isReview =
        !this.studentCheckedKeys[index].isReview;
    },
    handleChangeAudioSource(fileListening) {
      this.fileListeningUrl = fileListening;
    },
    handleSendKeyTestAndRedirect() {
      this.handleSendKeyTest(false);
      this.isLeave = true;
    },
    handleSendKeyTest(isDoing) {
      let currentIndexOfListInput = 0;
      let listInputs;
      listInputs = document.getElementsByClassName("answerTextBox");
      let studentKeys = [];
      this.listTopics.length > 0
        ? this.listTopics.map((topic) => {
            topic.listQuestionGroups.map((questionGroup) => {
              questionGroup.listQuestions.map((question) => {
                if (
                  question.questionType === "True/False/Not Given" ||
                  question.questionType === "Yes/No/Not Given"
                ) {
                  studentKeys.push({
                    key: question.listKeys[0] ? question.listKeys[0] : "",
                    questionType: question.questionType,
                    numberOfQuestion: question.numberOfQuestion,
                  });
                } else if (
                  question.questionType === "Summary Completion" ||
                  question.questionType === "Flow-chart Completion" ||
                  question.questionType === "Form Completion" ||
                  question.questionType ===
                    "Flow-chart Completion (dragable)" ||
                  question.questionType === "Summary Completion (dragable)" ||
                  question.questionType === "Map Labelling (dragable)" ||
                  question.questionType === "Note Completion" ||
                  question.questionType === "Matching Headings" ||
                  question.questionType === "Table Completion"
                ) {
                  for (
                    let i = currentIndexOfListInput;
                    i < currentIndexOfListInput + question.numberOfQuestion;
                    i++
                  ) {
                    studentKeys.push({
                      key:
                        listInputs && listInputs[i] ? listInputs[i].value : "",
                      questionType: question.questionType,
                      numberOfQuestion: question.numberOfQuestion,
                    });
                  }
                  currentIndexOfListInput += question.numberOfQuestion;
                } else if (
                  question.questionType === "Multiple choice with one answer" ||
                  question.questionType ===
                    "Multiple choice with more than one answer" ||
                  question.questionType === "Matching Information" ||
                  question.questionType === "Map Labelling (dropdown)"
                ) {
                  if (
                    question.questionType ===
                      "Multiple choice with one answer" ||
                    question.questionType === "Matching Information" ||
                    question.questionType === "Map Labelling (dropdown)"
                  ) {
                    if (question.listKeys.length === 1) {
                      question.listKeys.map((keyel) => {
                        studentKeys.push({
                          key: keyel,
                          questionType: question.questionType,
                          numberOfQuestion: question.numberOfQuestion,
                        });
                      });
                    } else {
                      studentKeys.push({
                        key: "",
                        questionType: question.questionType,
                      });
                    }
                  } else {
                    if (question.listKeys.length !== question.totalKeys) {
                      for (let i = 0; i < question.listKeys.length; i++) {
                        studentKeys.push({
                          key: question.listKeys[i],
                          questionType: question.questionType,
                          numberOfQuestion: question.numberOfQuestion,
                        });
                      }
                      for (
                        let j = question.listKeys.length;
                        j < question.totalKeys;
                        j++
                      ) {
                        studentKeys.push({
                          key: "",
                          questionType: question.questionType,
                          numberOfQuestion: question.numberOfQuestion,
                        });
                      }
                    } else {
                      question.listKeys.map((keyel) => {
                        studentKeys.push({
                          key: keyel,
                          questionType: question.questionType,
                          numberOfQuestion: question.numberOfQuestion,
                        });
                      });
                    }
                  }
                } else if (
                  question.questionType === "Flow-chart Completion (image)"
                ) {
                  if (question.listKeys.length !== question.totalKeys) {
                    for (let i = 0; i < question.listKeys.length; i++) {
                      studentKeys.push({
                        key: question.listKeys[i],
                        questionType: question.questionType,
                        numberOfQuestion: question.numberOfQuestion,
                      });
                    }
                    for (
                      let j = question.listKeys.length;
                      j < question.totalKeys;
                      j++
                    ) {
                      studentKeys.push({
                        key: "",
                        questionType: question.questionType,
                        numberOfQuestion: question.numberOfQuestion,
                      });
                    }
                  } else {
                    question.listKeys.map((keyel) => {
                      studentKeys.push({
                        key: keyel,
                        questionType: question.questionType,
                        numberOfQuestion: question.numberOfQuestion,
                      });
                    });
                  }
                } else if (
                  question.questionType === "Sentence Completion" ||
                  question.questionType === "Short-answer Questions" ||
                  question.questionType === "Matching Sentence Endings"
                ) {
                  for (
                    let i = currentIndexOfListInput;
                    i < currentIndexOfListInput + question.numberOfQuestion;
                    i++
                  ) {
                    studentKeys.push({
                      key:
                        questionGroup && questionGroup.listKeys
                          ? questionGroup.listKeys[i]
                          : "",
                      questionType: question.questionType,
                      numberOfQuestion: question.numberOfQuestion,
                    });
                  }
                  currentIndexOfListInput += question.numberOfQuestion;
                }
              });
            });
          })
        : [];
      this.visibleSendKey = false;
      this.sendKeyLoading = false;

      const studentKey = {
        classId: this.classId,
        testId: this.testId,
        listKeys: studentKeys,
        totalQuestions: this.listTopics.totalQuestions,
      };
      this.listStudentKeys = studentKeys;
      if (!isDoing) {
        StudentKeys.updateStudentKey(this.currentStudentKeyId, {
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
        StudentKeys.updateStudentKey(this.currentStudentKeyId, {
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
    handleChangeBorder() {
      let listAnswerBoxs;
      listAnswerBoxs = document.getElementsByClassName("answer-list");
    },
    handleUnChangeBorder() {
      let listAnswerBoxs;
      listAnswerBoxs = document.getElementsByClassName("answer-list");
    },
    handleCheckRadio(question) {
      if (question.listKeys.length > 0) {
        setTimeout(function () {
          if (
            question.valueForRadio !== null &&
            question.listKeys.indexOf(
              question.listAnswers[question.valueForRadio]
            ) !== -1
          ) {
            question.listKeys = [];
            question.valueForRadio = -1;
          }
        }, 0);
      }
    },
    handleSubmit() {
      this.visibleSendKey = true;
    },
    onFinish() {
      this.handleSendKeyTestAndRedirect();
    },
    handleCreateClassName(
      topicIndex,
      questionGroupIndex,
      question,
      questionIndex
    ) {
      if (isNaN(question.questionNumber.trim())) {
        let result = "";
        let previousIndex = 0;
        this.listTopics.map((topic, index) => {
          if (index <= topicIndex) {
            topic.listQuestionGroups.map((questionGroup, qIndex) => {
              if (index !== topicIndex) {
                questionGroup.listQuestions.map((ques) => {
                  previousIndex += parseInt(ques.numberOfQuestion);
                });
              } else {
                if (
                  qIndex !== questionGroupIndex &&
                  qIndex < questionGroupIndex
                ) {
                  questionGroup.listQuestions.map((ques) => {
                    previousIndex += parseInt(ques.numberOfQuestion);
                  });
                } else {
                  questionGroup.listQuestions.map((ques, quesIndex) => {
                    if (quesIndex < questionIndex) {
                      previousIndex += parseInt(ques.numberOfQuestion);
                    }
                  });
                }
              }
            });
          }
        });
        for (let i = 0; i < question.numberOfQuestion; i++) {
          result = result.concat(" ", previousIndex + i + 1);
        }
        return result.toString();
      }
      return question.questionNumber.toString();
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
    formatStartOfQuestionRoman(index) {
      let character = "";
      switch (parseInt(index)) {
        case 0:
          character = "i";
          break;
        case 1:
          character = "ii";
          break;
        case 2:
          character = "iii";
          break;
        case 3:
          character = "iv";
          break;
        case 4:
          character = "v";
          break;
        case 5:
          character = "vi";
          break;
        case 6:
          character = "vii";
          break;
        case 7:
          character = "viii";
          break;
        case 8:
          character = "ix";
          break;
        case 9:
          character = "x";
          break;
        case 10:
          character = "xi";
          break;
        case 11:
          character = "xii";
          break;
        case 12:
          character = "xiii";
          break;
        case 13:
          character = "xiv";
          break;
        case 14:
          character = "xv";
          break;
      }
      return character;
    },
    replaceBracketWithInput(str) {
      const pieces = str.replaceAll(
        "[]",
        '<input class="answerTextBox" style="border: solid 1px; height: 1.8rem; margin:5px; padding: 2px;"/>'
      );
      return pieces;
    },
  },
};
</script>

<style lang="scss">
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
  .ant-collapse-content-box {
    padding: 0px !important;
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
