const Joi = require("joi");

const quizCreateSchema = Joi.object().keys({
  content: Joi.string().trim(),
  name: Joi.string(),
  bookTestName: Joi.string(),
  testDescription: Joi.string(),
  startDate: Joi.string(),
  endDate: Joi.string(),
  isShowPoint: Joi.boolean(),
  questions: Joi.array(),
  type: Joi.string(),
  isBlock: Joi.boolean(),
  classIds: Joi.array(),
  subject: Joi.string(),
  countDownTime: Joi.string(),
  fileListeningUrl: Joi.string(),
  testType: Joi.string(),
  quizzes: Joi.array(),
});

const quizUpdateSchema = Joi.object().keys({
  content: Joi.string().trim(),
  name: Joi.string(),
  bookTestName: Joi.string(),
  testDescription: Joi.string(),
  startDate: Joi.string(),
  endDate: Joi.string(),
  isShowPoint: Joi.boolean(),
  questions: Joi.array(),
  type: Joi.string(),
  isBlock: Joi.boolean(),
  classIds: Joi.array(),
  subject: Joi.string(),
  countDownTime: Joi.string(),
  fileListeningUrl: Joi.string(),
  testType: Joi.string(),
  quizzes: Joi.array(),
});

const quizRemoveClassSchema = Joi.object().keys({
  classId: Joi.string().required(),
  quizId: Joi.string().required(),
});
module.exports = {
  quizCreateSchema,
  quizUpdateSchema,
  quizRemoveClassSchema,
};
