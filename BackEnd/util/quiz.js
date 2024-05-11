const Quiz = require("../models/quiz");
const {
  quizCreateSchema,
  quizUpdateSchema,
  quizRemoveClassSchema,
} = require("../helper/validation_quiz");
const mongoose = require("mongoose");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString }; //queryString = req.query

    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );

    //    gte = greater than or equal
    //    lte = lesser than or equal
    //    lt = lesser than
    //    gt = greater than
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
const createQuiz = async (req, res) => {
  try {
    const result = await quizCreateSchema.validateAsync(req.body);
    const newQuiz = new Quiz({
      ...result,
      createBy: req.user._id,
    });
    const quizSaved = await newQuiz.save();
    return res.status(201).json({
      message: "New quiz create successful ",
      success: true,
      quiz: quizSaved,
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
const updateQuiz = async (req, res) => {
  try {
    const result = await quizUpdateSchema.validateAsync(req.body);
    const oldQuiz = await Quiz.findById(req.params.id);
    const updateQuiz = {
      ...result,
      updateBy: req.user.id,
    };
    const updatedQuiz = await Object.assign(oldQuiz, updateQuiz);
    if (!updatedQuiz) return null;
    await updatedQuiz.save();
    return res.status(201).json({
      message: "Quiz update successful ",
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

const quizValidation = async (quizName) => {
  let oldQuiz = await Quiz.findOne({
    quizName: quizName,
  });
  return oldQuiz ? false : true;
};

const getListQuiz = async (req, res) => {
  try {
    const features = new APIfeatures(Quiz.find(), req.query)
      .filtering()
      .sorting()
      .paginating();

    const listQuiz = await features.query;
    return res.status(201).json({
      message: "Get list Quiz successful",
      success: true,
      data: listQuiz,
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
const getQuizById = async (req, res) => {
  try {
    const likeQuiz = await Quiz.findById(req.params.id);
    if (!likeQuiz) return res.status(400).json({ msg: "Quiz does not exist." });

    res.json({
      status: "success",
      data: likeQuiz,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found. Invalid id of Quiz",
        success: false,
      });
    }
    await Quiz.remove(quiz);
    return res.status(201).json({
      message: "Quiz successfully deleted",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};
const removeTestFromQuiz = async (req, res) => {
  try {
    const result = await quizRemoveClassSchema.validateAsync(req.body);
    const oldQuiz = await Quiz.findById(mongoose.Types.ObjectId(result.quizId));
    let oldClassIds = oldQuiz.classIds;
    const idOfOldClass = oldClassIds.findIndex(
      (item) => item === result.classId
    );
    if (idOfOldClass > -1) {
      const newClassIds = oldClassIds.filter((item) => item !== result.classId);
      const updateQuiz = {
        ...result,
        classIds: newClassIds,
        updateBy: req.user.id,
      };
      const updatedQuiz = await Object.assign(oldQuiz, updateQuiz);
      if (!updatedQuiz) return null;
      await updatedQuiz.save();
    }

    return res.status(201).json({
      message: "Quiz update successful ",
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
module.exports = {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getListQuiz,
  getQuizById,
  removeTestFromQuiz,
};
