const { Schema, model } = require("mongoose");
const quizSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    questions: {
      type: Array,
      default: [],
    },
    testName: {
      type: String,
    },
    bookTestName: {
      type: String,
    },
    testDescription: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    type: {
      type: String,
    },
    subject: {
      type: String,
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
    classIds: {
      type: Array,
      default: [],
    },
    isShowPoint: {
      type: Boolean,
      default: false,
    },
    countDownTime: {
      type: String,
    },
    classes: {
      type: Array,
    },
    quizzes: {
      type: Array,
    },
    createdUser: {
      type: Object,
    },
    createBy: {
      type: String,
      default: null,
    },
    updateBy: {
      type: String,
      default: null,
    },
    testType: {
      type: String,
    },
    totalStudents: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);
module.exports = model("quiz", quizSchema);
