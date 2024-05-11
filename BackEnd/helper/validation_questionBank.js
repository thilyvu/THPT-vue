const Joi = require("joi");

const questionBankCreateSchema = Joi.object().keys({
  content: Joi.string(),
  choices: Joi.array(),
  questionType: Joi.string(),
  questionNumber: Joi.string(),
  questionTestId: Joi.string(),
  testId: Joi.string(),
  key: Joi.string(),
  questionTypeName: Joi.string(),
});

const questionBankUpdateSchema = Joi.object().keys({
  content: Joi.string(),
  questionType: Joi.string(),
  choices: Joi.array(),
  questionNumber: Joi.string(),
  key: Joi.string(),
  testId: Joi.string(),
  questionTypeName: Joi.string(),
});
module.exports = {
  questionBankCreateSchema,
  questionBankUpdateSchema,
};
