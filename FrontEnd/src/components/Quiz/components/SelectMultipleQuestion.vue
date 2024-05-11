<template>
  <a-row>
    <a-row :gutter="[8, 16]">
      <a-col :span="8">
        <div class="container">
          <b>Category</b>
          <div class="items-container">
            <a-checkbox-group
              @change="(val) => handleChangeCheckBox(val)"
              style="display: grid; padding: 10px 0px"
              v-model:value="questionTypeSelected"
              :options="
                listQuestionType.map((item) => ({
                  label: item.questionTypeName,
                  value: item._id,
                }))
              "
            />
          </div>

          <!-- <div style="margin-top: 1rem">
            <div
              v-for="questionType in listQuestionType"
              :key="questionType._id"
            >
              <v-checkbox
                @change="(val) => handleChangeCheckBox(val)"
                style="margin-top: -0.2rem"
                v-model="questionTypeSelected"
                :label="questionType.questionTypeName"
                :value="questionType._id"
              ></v-checkbox>
            </div>
          </div> -->
        </div>
      </a-col>
      <a-col :span="8">
        <div class="container">
          <b>Question</b>
          <a-input
            style="margin: 10px 0px"
            placeholder="Search question test id"
            v-model="searchText"
            @change="(val) => handleSearchQuestion(val)"
          />
          <div
            v-if="listQuestion.length === 0"
            class="items-container align-item-center"
          >
            <p>Không có câu hỏi nào</p>
          </div>
          <div
            class="items-container"
            style="margin-top: -0.1rem; overflow: scroll"
            v-else
          >
            <a-checkbox-group
              @change="(val) => handleChooseQuestion(val)"
              style="display: grid; padding: 10px 0px"
              v-model:value="questionSelected"
              :options="
                listQuestion.map((item) => ({
                  label: item.title,
                  value: item._id,
                }))
              "
            />
          </div></div
      ></a-col>
      <a-col :span="8">
        <div class="container" style="min-height: 330px !important">
          <b>Selected ({{ questionSelected.length }})</b>
          <div
            class="items-container"
            style="margin-top: 0.5rem; min-height: 280px; overflow: scroll"
          >
            <p
              v-for="question in questionSelected"
              :key="question"
              style="margin: 0"
            >
              {{ getQuestionName(question) }}
            </p>
          </div>
        </div>
      </a-col>
    </a-row>
  </a-row>
</template>

<script>
import QuestionType from "../../../api/QuestionType";
import QuestionBank from "../../../api/QuestionBank";

export default {
  data() {
    return {
      listQuestionType: [],
      questionTypeSelected: [],
      checked: true,
      page: 1,
      searchText: "",
      questionSelected: [],
      listQuestion: [],
      listFilterQuestion: [],
    };
  },
  mounted() {
    QuestionType.getListQuestionType()
      .then((response) => {
        this.listQuestionType = response.data.data;
      })
      .catch((e) => {
        console.log("e", e);
      });
  },
  methods: {
    handleChangeCheckBox(val) {
      QuestionBank.getListQuestionBank(
        new URLSearchParams([
          ["limit", 20],
          ["page", this.page],
          [
            "questionType",
            JSON.stringify({ in: val.map((item) => item.toString()) }),
          ],
        ])
      )
        .then((response) => {
          this.listQuestion = response.data.data.map((item) => ({
            ...item,
            title: `${item.quizzes.map((quiz) => quiz.name).join(", ")}-${
              item.questionNumber
            }`,
          }));
          this.listFilterQuestion = this.listQuestion;
        })
        .catch((e) => {
          console.log(e);
        });
      this.questionTypeSelected = val;
    },
    handleSearchQuestion(val) {
      const searchText = val.target.value;
      this.listQuestion =
        searchText === ""
          ? this.listFilterQuestion
          : this.listFilterQuestion?.filter((row) => {
              const title = row.title.toString().toLowerCase();

              return title.includes(searchText.toLowerCase());
            });
    },
    getQuestionName(id) {
      return this.listFilterQuestion.find((item) => item._id === id).title;
    },
    handleChooseQuestion(val) {
      this.questionSelected = val;
      this.$emit("changeQuestion", {
        questionIds: val,
        questions: this.listQuestion,
      });
    },
  },
};
</script>

<style>
.container {
  padding: 10px;
  border-radius: 8px;
  background: #f7f7f7;
  min-height: 300px;
}
.ant-checkbox-wrapper {
  margin-bottom: 5px;
}
.v-messages {
  display: none;
}
.v-label {
  margin: unset !important;
  margin-left: 0.5rem;
}
.ant-checkbox-checked .ant-checkbox-inner {
  background-color: #424242;
  border-color: #424242;
}
.items-container {
  background: white;
  margin-top: 1rem;
  border-radius: 8px;
  padding: 10px;
  min-height: 230px;
}
.align-item-center {
  margin-top: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>