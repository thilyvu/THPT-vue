const StudentKey = require("../models/studentKey");
const Class = require("../models/class");
const Test = require("../models/test");
var _ = require("lodash");
const {
  studentKeyCreateSchema,
  studentKeyUpdateSchema,
  studentKeyGetByClassAndTestSchema,
  studentKeyGetByClassSchema,
  studentKeyGetByClassAndTestAndStudentIdSchema,
  studentKeyGetByClassAndStudentIdSchema
} = require("../helper/validation_student_key");
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
const createStudentKey = async (req, res) => {
  try {
    const result = await studentKeyCreateSchema.validateAsync(req.body);
    var studentKeys = _.cloneDeep(result.listKeys);
    studentKeys = studentKeys.map((studentKey) => {
      return { isCorrect: false, ...studentKey };
    });
    const likeTest = await Test.findById(result.testId).select([
      "-listQuestions",
      "-listAnswers",
    ]);

    let listTopics = _.cloneDeep(likeTest.listTopics);
    var totalCorrect = likeTest.totalQuestions;
    var totalQuestions = likeTest.totalQuestions;
    if (result.status === "started") {
      const newStudentKey = new StudentKey({
        ...result,
        listTopics: listTopics,
        studentId: req.user._id,
        totalCorrect: 0,
        totalQuestions: totalQuestions,
        createBy: req.user._id,
        studentKeys: studentKeys,
      });
      const newStudentKeyCreated = await newStudentKey.save();
      return res.status(201).json({
        message: "New student key create successful ",
        success: true,
        totalQuestions: totalQuestions,
        totalCorrect: 0,
        newStudentKeyCreated: newStudentKeyCreated,
      });
    } else {
      likeTest.listKeys.map((key, keyIndex) => {
        if (
          key.replace("[", "").replace("]", "").trim().toLowerCase() !==
          studentKeys[keyIndex].key.trim().toLowerCase()
        ) {
          totalCorrect--;
          studentKeys[keyIndex].isCorrect = false;
        }
      });
      const newStudentKey = new StudentKey({
        ...result,
        listTopics: listTopics,
        studentId: req.user._id,
        totalCorrect: 0,
        totalQuestions: totalQuestions,
        createBy: req.user._id,
        studentKeys: studentKeys,
      });
      const newStudentKeyCreated = await newStudentKey.save();
      return res.status(201).json({
        message: "New student key create successful ",
        success: true,
        totalQuestions: 0,
        totalCorrect: 0,
      });
    }
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
const handleFormatKey = (key) => {
  const removedSquareBrackets =  key.replace("[", "").replace("]", "").trim().toLowerCase();
  return removedSquareBrackets.split("|");
}
const updateStudentKey = async (req, res) => {
  try {
    const result = await studentKeyUpdateSchema.validateAsync(req.body);
    var studentKeys = _.cloneDeep(result.listKeys);
    studentKeys = studentKeys.map((studentKey) => {
      return { isCorrect: true, testKey: "", ...studentKey };
    });
    const likeTest = await Test.findById(result.testId).select([
      "-listQuestions",
      "-listAnswers",
    ]);
    let listTopics = _.cloneDeep(likeTest.listTopics);
    let multipleChoiceList =[];
    var totalCorrect = likeTest.totalQuestions;
    var totalQuestions = likeTest.totalQuestions;
    if (result.status !== "started") {

      likeTest.listKeys.map((key, keyIndex) => {
        const studentKey = studentKeys[keyIndex].key.trim().toLowerCase();
        const testKeys =  handleFormatKey(key);
        if (
          studentKeys[keyIndex].questionType !== 'Multiple choice with more than one answer' && 
          !testKeys.includes(studentKey)
        ) {
          totalCorrect--;
          studentKeys[keyIndex].isCorrect = false;
          studentKeys[keyIndex].testKey = key
            .replace("[", "")
            .replace("]", "")
            .trim();
        } else if (studentKeys[keyIndex].questionType === 'Multiple choice with more than one answer') {
          multipleChoiceList =[key.trim().toLowerCase()];
          for(let i = 1; i <= studentKeys[keyIndex].numberOfQuestion ; i++ ) {
            const subtractIndex = keyIndex - i;
            const addIndex = keyIndex + i ;
            if(subtractIndex >= 0  && subtractIndex < likeTest.listKeys.length && studentKeys[subtractIndex].questionType === 'Multiple choice with more than one answer' ) {
              multipleChoiceList.push(likeTest.listKeys[subtractIndex].trim().toLowerCase());
            }
            if(addIndex >= 0  && addIndex < likeTest.listKeys.length && studentKeys[addIndex].questionType === 'Multiple choice with more than one answer') {
              multipleChoiceList.push(likeTest.listKeys[addIndex].trim().toLowerCase());
            }
          }
          if(!multipleChoiceList.includes(studentKeys[keyIndex].key.trim().toLowerCase())) {
            totalCorrect--;
            studentKeys[keyIndex].isCorrect = false;
            studentKeys[keyIndex].testKey = key
              .replace("[", "")
              .replace("]", "")
              .trim();
          } else {
            studentKeys[keyIndex].testKey = key
            .replace("[", "")
            .replace("]", "")
            .trim();
          }
        }
        else {
          studentKeys[keyIndex].testKey = key
          .replace("[", "")
          .replace("]", "")
          .trim();
        }
      });
      const newStudentKey = {
        ...result,
        listTopics: listTopics,
        studentId: req.user._id,
        totalCorrect: totalCorrect,
        totalQuestions: totalQuestions,
        createBy: req.user._id,
        studentKeys: studentKeys,
      };
      const oldStudentKey = await StudentKey.findOne(
        {
           _id: {
            $eq: req.params.id
           }  ,
        }).exec();
      if (!oldStudentKey) {
        return res.status(400).json({
          message: `student key id not exist`,
          success: false,
        });
      }
      const updateStudentKey = {
        ...newStudentKey,
        updateBy: req.user.id,
      };
      const updatedStudentKey = await Object.assign(
        oldStudentKey,
        updateStudentKey
      );
      if (!updatedStudentKey) return null;
      await updatedStudentKey.save();

      return res.status(201).json({
        message: "student key update successful ",
        success: true,
        data: updatedStudentKey,
        totalQuestions: totalQuestions,
        totalCorrect: totalCorrect,
      });
    }
  } catch (err) {
    const result = await studentKeyUpdateSchema.validateAsync(req.body);
    var studentKeys = _.cloneDeep(result.listKeys);
    const likeTest = await Test.findById(result.testId).select([
      "-listQuestions",
      "-listAnswers",
    ]);
    if (err.isJoi === true) {
      return res.status(444).json({
        message: err.message,
        success: false,
        studentKeys: studentKeys,
        listKeys : likeTest.listKeys,
        likeTest: likeTest
      });
    }
    return res.status(500).json({
      message: err.message,
      success: false,
      studentKeys: studentKeys,
      listKeys : likeTest.listKeys,
      likeTest : likeTest
    });
  }
};

const getListStudentKey = async (req, res) => {
  try {
    const listStudentKey = await StudentKey.find();
    const total = await StudentKey.countDocuments({});
    return res.status(201).json({
      message: "Get list student key successful",
      success: true,
      data: listStudentKey,
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

const getStudentKeyByClassAndTestId = async (req, res) => {
  try {
    const result = await studentKeyGetByClassAndTestSchema.validateAsync(
      req.body
    );
    const listStudentKey = await StudentKey.find({
      $and: [
        { classId: mongoose.Types.ObjectId(result.classId) },
        { testId: mongoose.Types.ObjectId(result.testId) },
      ],
    });
    const userIds = listStudentKey.flatMap((studentKey) =>
      mongoose.Types.ObjectId(studentKey.studentId)
    );
    let createdUsers = await User.find({ _id: { $in: userIds } }).select([
      "-classes",
      "-password",
      "-username",
    ]);
    listStudentKey.map((item, index) => {
      item.index = index + 1;
      item.createdUser = createdUsers.find(
        (u) => u._id.toString() === item.studentId
      );
      item.studentKeys.map((key, keyIndex) => {
        let index = keyIndex + 1;
        // if (key.questionType === "Multiple choice with more than one answer") {
        //   index = keyIndex + 2;
        // }
        key.index = index;
      });
      return item;
    });
    listStudentKey.sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });
    return res.status(201).json({
      message: "Get list studentKey successful",
      success: true,
      data: listStudentKey,
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
const getStudentKeyByClassId = async (req, res) => {
  try {
    const result = await studentKeyGetByClassSchema.validateAsync(
      req.body
    );
    const listStudentKey = await StudentKey.find({
      $and: [
        { classId: mongoose.Types.ObjectId(result.classId) },
      ],
    });
    return res.status(201).json({
      message: "Get list studentKey successful",
      success: true,
      data: listStudentKey,
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
const getStudentKeyByClassAndStudentId = async (req, res) => {
  try {
    const result =
      await studentKeyGetByClassAndStudentIdSchema.validateAsync(
        req.body
      );
    const listStudentKey = await StudentKey.find({
      $and: [
        { classId: mongoose.Types.ObjectId(result.classId) },
        { studentId: mongoose.Types.ObjectId(result.studentId) },
      ],
    });
    return res.status(201).json({
      message: "Get list studentKey successful",
      success: true,
      data: listStudentKey,
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
const getCurrentStudentKeyByClassAndTestId = async (req, res) => {
  try {
    const result = await studentKeyGetByClassAndTestSchema.validateAsync(
      req.body
    );
    const listStudentKey = await StudentKey.find({
      $and: [
        { classId: mongoose.Types.ObjectId(result.classId) },
        { testId: mongoose.Types.ObjectId(result.testId) },
        { createBy: mongoose.Types.ObjectId(req.user._id) },
      ],
    });
    const userIds = listStudentKey.flatMap((studentKey) =>
      mongoose.Types.ObjectId(studentKey.studentId)
    );
    const likeTest = await Test.findById(result.testId).select([
      "-listQuestions",
      "-listAnswers",
    ]);
    let createdUsers = await User.find({ _id: { $in: userIds } }).select([
      "-classes",
      "-password",
      "-username",
    ]);
    listStudentKey.map((item, index) => {
      item.index = index + 1;
      item.createdUser = createdUsers.find(
        (u) => u._id.toString() === item.studentId
      );
      item.studentKeys.map((key, keyIndex) => {
        let index = keyIndex + 1;
        // if (key.questionType === "Multiple choice with more than one answer") {
        //   index = keyIndex + 2;
        // }
        key.index = index;
      });
      return item;
    });
    listStudentKey.sort(function (a, b) {
      return a.createdAt - b.createdAt;
    });
    return res.status(201).json({
      message: "Get list studentKey successful",
      success: true,
      data: listStudentKey,
      test: likeTest
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
const getCurrentStudentKeyByClassAndTestIdAndStudentId = async (req, res) => {
  try {
    const result =
      await studentKeyGetByClassAndTestAndStudentIdSchema.validateAsync(
        req.body
      );
    const listStudentKey = await StudentKey.find({
      $and: [
        { classId: mongoose.Types.ObjectId(result.classId) },
        { testId: mongoose.Types.ObjectId(result.testId) },
        { studentId: mongoose.Types.ObjectId(result.studentId) },
      ],
    });
    return res.status(201).json({
      message: "Get list studentKey successful",
      success: true,
      data: listStudentKey,
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
const getStudentKeyById = async (req, res) => {
  try {
    const likeStudentKey = await StudentKey.findById(req.params.id);
    if (!likeStudentKey)
      return res.status(400).json({ msg: "Student key does not exist." });

    res.json({
      status: "success",
      data: likeStudentKey,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const deleteStudentKey = async (req, res) => {
  try {
    const studentKey = await StudentKey.findById(req.params.id);
    if (!studentKey) {
      return res.status(404).json({
        message: "studentKey not found. Invalid id of studentKey",
        success: false,
      });
    } 
    await StudentKey.remove(studentKey);
    return res.status(201).json({
      message: "studentKey successfully deleted",
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
  createStudentKey,
  updateStudentKey,
  deleteStudentKey,
  getListStudentKey,
  getStudentKeyByClassAndTestId,
  getStudentKeyByClassAndStudentId,
  getStudentKeyByClassId,
  getStudentKeyById,
  getCurrentStudentKeyByClassAndTestId,
  getCurrentStudentKeyByClassAndTestIdAndStudentId,
};
