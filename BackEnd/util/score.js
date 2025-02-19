const Score = require("../models/score");
const User = require("../models/users");
const Exercise = require("../models/exercise");
const Class = require("../models/class");
const mongoose = require("mongoose");
const Notification = require("../models/notifications");
const {
  scoreCreateSchema,
  scoreUpdateSchema,
} = require("../helper/validation_score");
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
const createScore = async (req, res) => {
  try {
    const result = await scoreCreateSchema.validateAsync(req.body);
    const newScore = new Score({
      ...result,
      createBy: req.user._id,
    });
    const parentExercise = await Exercise.findById(
      mongoose.Types.ObjectId(result.exerciseId)
    );
    const oldClass = await Class.findById(
      mongoose.Types.ObjectId(parentExercise.classId)
    );
    const newNotification = new Notification({
      title: "Submit test",
      type: "create",
      content: `Student ${req.user.name} submitted for the assignment ${parentExercise.exerciseName}`,
      userId: oldClass.createBy,
      metadata: {
        ClassId: parentExercise.classId,
        StudentId: req.user._id,
        ExerciseId: result.exerciseId,
      },
      bannerImg: oldClass.bannerImg,
    });
    await newNotification.save();
    await newScore.save();
    return res.status(201).json({
      message: "New score create successful ",
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

const updateScore = async (req, res) => {
  try {
    const result = await scoreUpdateSchema.validateAsync(req.body);
    const oldScore = await Score.findById(req.params.id);
    const updateScore = {
      ...result,
      updateBy: req.user._id,
    };
    const parentExercise = await Exercise.findById(
      mongoose.Types.ObjectId(oldScore.exerciseId)
    );
    const oldClass = await Class.findById(
      mongoose.Types.ObjectId(parentExercise.classId)
    );
    if (result.scores || result.comment) {
      const newNotification = new Notification({
        title: "Mark the submission",
        type: "create",
        content: `Teacher ${req.user.name} scored for the post ${parentExercise.exerciseName}'s class`,
        userId: oldScore.studentId,
        metadata: {
          ClassId: parentExercise.classId,
          StudentId: req.user._id,
          ExerciseId: result.exerciseId,
        },
        bannerImg: oldClass.bannerImg,
      });
      await newNotification.save();
    } else {
      const newNotification = new Notification({
        title: "Update test",
        type: "update",
        content: `Student ${req.user.name} updated the submission for ${parentExercise.exerciseName}`,
        userId: oldClass.createBy,
        metadata: {
          ClassId: parentExercise.classId,
          StudentId: req.user._id,
          ExerciseId: result.exerciseId,
        },
        bannerImg: oldClass.bannerImg,
      });
      await newNotification.save();
    }
    const updatedScore = await Object.assign(oldScore, updateScore);
    if (!updatedScore) return null;
    await updatedScore.save();
    return res.status(201).json({
      message: "Score update successful ",
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

const getListScore = async (req, res) => {
  try {
    const features = new APIfeatures(Score.find(), req.query)
      .filtering()
      .sorting()
      .paginating();

    let listScore = await features.query;
    const ids = listScore.map((item) => mongoose.Types.ObjectId(item.createBy));
    let user = await User.find({ _id: { $in: ids } });
    listScore = listScore.map((item) => {
      item.createAvatar = user.find(
        (u) => u._id.toString() === item.createBy.toString()
      ).avatar;
      item.createName = user.find(
        (u) => u._id.toString() === item.createBy.toString()
      ).name;

      // item.exerciseName =
      //   exercises.find((u) => {
      //     if (u) {
      //       return u.exerciseId.toString() === item.exerciseId.toString();
      //     }
      //   }).exerciseName || "";
      return item;
    });
    const total = await Score.countDocuments({});
    return res.status(201).json({
      message: "Get list score successful",
      success: true,
      data: listScore,
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
const getListExerciseScore = async (req, res) => {
  try {
    if (!req.params.exerciseId) {
      return;
    }
    const features = new APIfeatures(
      Score.find({ exerciseId: req.params.exerciseId }),
      req.query
    )
      .filtering()
      .sorting()
      .paginating();

    let listScore = await features.query;
    const ids = listScore.map((item) => mongoose.Types.ObjectId(item.createBy));
    let user = await User.find({ _id: { $in: ids } });
    listScore = listScore.map((item) => {
      item.createAvatar = user.find(
        (u) => u._id.toString() === item.createBy.toString()
      ).avatar;
      item.createName = user.find(
        (u) => u._id.toString() === item.createBy.toString()
      ).name;
      return item;
    });
    return res.status(201).json({
      message: "Get list score successful",
      success: true,
      data: listScore,
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
const getScoreById = async (req, res) => {
  try {
    const likeScore = await Score.findById(req.params.id);
    if (!likeScore)
      return res.status(400).json({ msg: "Score does not exist." });
    res.json({
      status: "success",
      data: likeScore,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const deleteScore = async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);
    if (!score) {
      return res.status(404).json({
        message: "Score not found. Invalid id of score",
        success: false,
      });
    }
    await Score.remove(score);
    return res.status(201).json({
      message: "Score successfully deleted",
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
  createScore,
  updateScore,
  deleteScore,
  getListScore,
  getScoreById,
  getListExerciseScore,
};
