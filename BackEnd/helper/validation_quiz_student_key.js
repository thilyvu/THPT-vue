const Joi = require("joi");

const quizStudentKeyCreateSchema = Joi.object().keys({
  studentId: Joi.string(),
  listKeys: Joi.array(),
  quizId: Joi.string(),
  classId: Joi.string(),
  listTopics: Joi.array(),
  totalCorrect: Joi.string(),
  totalQuestions: Joi.number(),
  status: Joi.string(),
});

const quizStudentKeyUpdateSchema = Joi.object().keys({
  studentId: Joi.string(),
  listKeys: Joi.array(),
  quizId: Joi.string(),
  classId: Joi.string(),
  listTopics: Joi.array(),
  totalCorrect: Joi.string(),
  totalQuestions: Joi.number(),
  status: Joi.string(),
});
const quizStudentKeyGetByClassAndQuizSchema = Joi.object().keys({
  classId: Joi.string(),
  quizId: Joi.string(),
});
const quizStudentKeyGetByClassSchema = Joi.object().keys({
  classId: Joi.string(),
});
const quizStudentKeyGetByClassAndStudentIdSchema = Joi.object().keys({
  classId: Joi.string(),
  studentId: Joi.string(),
});
const quizStudentKeyGetByClassAndQuizAndStudentIdSchema = Joi.object().keys({
  classId: Joi.string(),
  quizId: Joi.string(),
  studentId: Joi.string(),
});
module.exports = {
  quizStudentKeyCreateSchema,
  quizStudentKeyUpdateSchema,
  quizStudentKeyGetByClassSchema,
  quizStudentKeyGetByClassAndStudentIdSchema,
  quizStudentKeyGetByClassAndQuizSchema,
  quizStudentKeyGetByClassAndQuizAndStudentIdSchema,
};
