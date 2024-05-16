const { Schema, model } = require("mongoose");
const quizStudentKeySchema = new Schema(
  {
    studentId: {
      type: String,
    },
    index: {
      type: String,
    },
    listKeys: {
      type: Array,
      default: [],
    },
    quizId: {
      type: String,
      required: true,
    },
    classId: {
      type: String,
      required: true,
    },
    totalCorrect: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    listTopics: {
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
    studentKeys: {
      type: Array,
      default: [],
    },
    createdUser: {
      type: Object,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = model("quizStudentKey", quizStudentKeySchema);
