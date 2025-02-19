const QuizExercise = require("../models/quizExercise");
const Class = require("../models/class");
const {
  quizExerciseCreateSchema,
  quizExerciseUpdateSchema,
} = require("../helper/validation_quiz_exercise");
const mongoose = require("mongoose");
const User = require("../models/users");
const Score = require("../models/score");
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
const createQuizExercise = async (req, res) => {
  try {
    const result = await quizExerciseCreateSchema.validateAsync(req.body);
    const newQuizExecise = new QuizExercise({
      ...result,
      createBy: req.user._id,
    });
    let quizExerciseNameNotTaken = await quizExerciseNameValidation(
      result.exerciseName
    );
    if (!quizExerciseNameNotTaken) {
      return res.status(400).json({
        message: `quizExerciseName have already taken`,
        success: false,
      });
    }
    const newQuizExerciseCreated = await newQuizExecise.save();
    return res.status(201).json({
      message: "New quiz exercise create successful ",
      success: true,
      data: newQuizExerciseCreated,
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
const updateQuizExercise = async (req, res) => {
  try {
    const result = await quizExerciseUpdateSchema.validateAsync(req.body);
    const oldQuizExercise = await QuizExercise.findById(req.params.id);
    if (!oldQuizExercise) {
      return res.status(400).json({
        message: `Quiz Exercise id not exist`,
        success: false,
      });
    }
    if (
      result &&
      oldQuizExercise &&
      result.exerciseName !== oldQuizExercise.exerciseName
    ) {
      let exerciseNameNotTaken = await quizExerciseNameValidation(
        result.exerciseName
      );
      if (!exerciseNameNotTaken) {
        return res.status(400).json({
          message: ` Quiz Exercise name have already taken`,
          success: false,
        });
      }
    }
    const updateExercise = {
      ...result,
      updateBy: req.user.id,
    };
    const updatedExercise = await Object.assign(oldExercise, updateExercise);
    if (!updatedExercise) return null;
    await updatedExercise.save();
    // const lectureId = updatedLecture._id;
    // const updateClass = await Class.findOneAndUpdate(
    //   { _id: oldLecture.classId, "lectures._id": lectureId },
    //   {
    //     $set: {
    //       "lectures.$": updatedLecture,
    //     },
    //   }
    // );

    return res.status(201).json({
      message: "Exercise update successful ",
      success: true,
      data: updatedExercise,
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

const quizExerciseNameValidation = async (quizExerciseName) => {
  let oldQuizExercise = await QuizExercise.findOne({
    exerciseName: quizExerciseName,
  });
  return oldQuizExercise ? false : true;
};

const getListQuizExercise = async (req, res) => {
  try {
    const features = new APIfeatures(QuizExercise.find(), req.query)
      .filtering()
      .sorting()
      .paginating();
    const total = await QuizExercise.countDocuments({});
    const listExercise = await features.query;
    return res.status(201).json({
      message: "Get list exercise successful",
      success: true,
      data: listExercise,
      total: total,
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

const getQuizExerciseByClassId = async (req, res) => {
  try {
    const oldClass = await Class.findById(req.params.classId);
    const total = oldClass.students.length;
    const features = new APIfeatures(
      QuizExercise.find({ classId: req.params.classId }),
      req.query
    )
      .filtering()
      .sorting()
      .paginating();

    let listExercise = await features.query;
    const ids = listExercise.map((item) => mongoose.Types.ObjectId(item._id));

    let scores = await Score.find({
      $and: [
        { studentId: { $eq: mongoose.Types.ObjectId(req.user._id) } },
        { exerciseId: { $in: ids } },
      ],
    });
    let totalScores = await Score.find({ exerciseId: { $in: ids } });
    listExercise = listExercise.map((item) => {
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);
      const currentTime = Date.now();
      const currentDate = new Date(currentTime);
      if (startDate && endDate) {
        item.disabled =
          currentDate > startDate && currentDate < endDate ? false : true;
      } else {
        item.disabled = true;
      }
      return item;
    });
    listExercise = listExercise.map((item) => {
      item.totalStudents = total;
      const findedScore = scores.find(
        (u) => u.exerciseId.toString() === item._id.toString()
      );
      const totalAnswer = totalScores.filter(
        (u) => u.exerciseId.toString() === item._id.toString()
      );
      item.status = "Not done";
      item.totalAnswers = totalAnswer ? totalAnswer.length : "0";
      if (findedScore) {
        item.status = "Done";
        item.score = findedScore.scores ? findedScore.scores : null;
        item.comment = findedScore.comment ? findedScore.comment : "";
      }
      return item;
    });
    return res.status(201).json({
      message: "Get list exercise successful",
      success: true,
      data: listExercise,
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
const getQuizExerciseById = async (req, res) => {
  try {
    const likeExercise = await QuizExercise.findById(req.params.id);
    if (!likeExercise)
      return res.status(400).json({ msg: "Exercise does not exist." });

    res.json({
      status: "success",
      data: likeExercise,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const deleteQuizExercise = async (req, res) => {
  try {
    const exercise = await QuizExercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({
        message: "Exercise not found. Invalid id of exercise",
        success: false,
      });
    }
    await Exercise.remove(exercise);
    return res.status(201).json({
      message: "Exercise successfully deleted",
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
  createQuizExercise,
  updateQuizExercise,
  deleteQuizExercise,
  getListQuizExercise,
  getQuizExerciseByClassId,
  getQuizExerciseById,
};
