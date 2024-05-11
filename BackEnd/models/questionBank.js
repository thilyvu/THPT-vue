const { Schema, model } = require("mongoose");
const questionBankSchema = new Schema(
  {
    questionType: {
      type: String,
    },
    questionTypeName: {
      type: String,
    },
    content: {
      type: String,
    },
    choices: {
      type: Array,
      default: false,
    },
    questionNumber: {
      type: String,
    },
    questionTestIds: {
      type: Array,
    },
    quizzes: {
      type: Array,
    },
    createBy: {
      type: String,
      default: null,
    },
    updateBy: {
      type: String,
      default: null,
    },
    key: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = model("questionBank", questionBankSchema);
