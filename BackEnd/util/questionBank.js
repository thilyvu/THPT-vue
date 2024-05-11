const QuestionBank = require("../models/questionBank");
const Quiz = require("../models/quiz");
const mongoose = require("mongoose");

const {
  questionBankCreateSchema,
  questionBankUpdateSchema,
} = require("../helper/validation_questionBank");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString }; //queryString = req.query

    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);
    if (queryObj.questionType && JSON.parse(queryObj.questionType).in) {
      queryObj.questionType = {
        $in: JSON.parse(queryObj.questionType).in.map((id) =>
          mongoose.Types.ObjectId(id)
        ),
      };
    }
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr
      .replace(/\b(gte|gt|lt|lte|regex)\b/g, (match) => "$" + match)
      .replace(`'{`, `{`);
    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
const createQuestionBank = async (req, res) => {
  try {
    const result = await questionBankCreateSchema.validateAsync(req.body);
    const newQuestionBank = new QuestionBank({
      content: result.content,
      questionNumber: result.questionNumber,
      choices: result.choices,
      questionType: result.questionType,
      questionTypeName: result.questionTypeName,
      questionTestIds: [result.testId],
      key: result.key,
      createBy: req.user._id,
    });
    // let questionTestIdNotTaken = await questionBankValidation(
    //   result.questionTestId
    // );
    // if (!questionTestIdNotTaken) {
    //   return res.status(400).json({
    //     message: `Question Bank id have already been taken`,
    //     success: false,
    //   });
    // }
    const savedQuestion = await newQuestionBank.save();
    return res.status(201).json({
      message: "New question bank create successful ",
      success: true,
      questionBank: savedQuestion,
    });
  } catch (err) {
    if (err.isJoi === true) {
      return res.status(444).json({
        message: err.message,
        success: false,
      });
    }
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};
const updateQuestionBank = async (req, res) => {
  try {
    const result = await questionBankUpdateSchema.validateAsync(req.body);
    const oldQuestionBank = await QuestionBank.findById(req.params.id);

    const updateQuestionBank = {
      ...result,
      updateBy: req.user.id,
    };
    const updatedQuestionBank = await Object.assign(
      oldQuestionBank,
      updateQuestionBank
    );
    if (!updatedQuestionBank) return null;
    await updatedQuestionBank.save();
    return res.status(201).json({
      message: "Question Bank update successful ",
      success: true,
    });
  } catch (err) {
    if (err.isJoi === true) {
      return res.status(444).json({
        message: err.message,
        success: false,
      });
    }
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const questionBankValidation = async (questionTestId) => {
  let oldQuestionBank = await QuestionBank.findOne({
    questionTestId: questionTestId,
  });
  return oldQuestionBank ? false : true;
};

const getListQuestionBank = async (req, res) => {
  try {
    const features = new APIfeatures(QuestionBank.find(), req.query)
      .filtering()
      .sorting()
      .paginating();

    const listQuestionBank = await features.query;
    const quizIds = listQuestionBank.flatMap((item) => item.questionTestIds);
    let quizzes = await Quiz.find({ _id: { $in: quizIds } });
    let listResult = listQuestionBank.map((item) => {
      item.quizzes = quizzes.filter((quiz) =>
        item.questionTestIds.includes(quiz._id)
      );

      return item;
    });

    // listClass.map((item) => {
    //   item.createdUser = createdUsers.find(
    //     (u) => u._id.toString() === item.createBy
    //   );
    //   return item;
    // });
    return res.status(201).json({
      message: "Get list question bank successful",
      success: true,
      data: listResult,
    });
  } catch (err) {
    if (err.isJoi === true) {
      return res.status(444).json({
        message: err.message,
        success: false,
      });
    }
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};
const getQuestionBankById = async (req, res) => {
  try {
    const likeQuestionBank = await QuestionBank.findById(req.params.id);
    if (!likeQuestionBank)
      return res.status(400).json({ msg: "Question Bank does not exist." });

    res.json({
      status: "success",
      data: likeQuestionBank,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const deleteQuestionBank = async (req, res) => {
  try {
    const questionBank = await QuestionBank.findById(req.params.id);
    if (!questionBank) {
      return res.status(404).json({
        message: "Question bank not found. Invalid id of Question",
        success: false,
      });
    }
    await QuestionBank.remove(questionBank);
    return res.status(201).json({
      message: "Question bank successfully deleted",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};
module.exports = {
  createQuestionBank,
  updateQuestionBank,
  deleteQuestionBank,
  getListQuestionBank,
  getQuestionBankById,
};
