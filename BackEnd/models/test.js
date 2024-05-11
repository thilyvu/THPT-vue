const { Schema, model } = require("mongoose");
const testSchema = new Schema(
  {
    testName: {
      type: String,
      required: true,
    },
    bookTestName: {
      type: String
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
    disabled: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
    },
    subject: {
      type: String,
    },
    totalStudents: {
      type: String,
      default: 0,
    },
    totalQuestions: {
      type: String,
      default: 0,
    },
    totalTopics: {
      type: String,
      default: 0,
    },
    isHide: {
      type: Boolean,
      default: false,
    },
    classIds: {
      type: Array,
      default: [],
    },
    listTopics: {
      type: Array,
      default: [],
    },
    listQuestions: {
      type: Array,
      default: [],
    },
    listKeys: {
      type: Array,
      default: [],
    },
    listAnswers: {
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
    createBy: {
      type: String,
      default: null,
    },
    updateBy: {
      type: String,
      default: null,
    },
    createdUser: {
      type: Object,
    },
    fileListeningUrl: {
      type: String,
    },
    testType: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = model("test", testSchema);
