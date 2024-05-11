const Test = require("../models/test");
const Quiz = require("../models/quiz");

const User = require("../models/users");
const StudentKey = require("../models/studentKey");
const mongoose = require("mongoose");
var _ = require("lodash");
const {
  testCreateSchema,
  testUpdateSchema,
  testUpdateClassSchema,
  testRemoveClassSchema,
} = require("../helper/validation_test");
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
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
const createTest = async (req, res) => {
  try {
    const result = await testCreateSchema.validateAsync(req.body);
    const newTest = new Test({
      ...result,
      createBy: req.user._id,
    });
    await newTest.save();
    return res.status(201).json({
      message: "New test create successful ",
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
const updateTest = async (req, res) => {
  try {
    const result = await testUpdateSchema.validateAsync(req.body);
    const oldTest = await Test.findById(req.params.id);
    if (result.testName !== oldTest.testName) {
      let testnameNotTaken = await testValidation(result.testName);
      if (!testnameNotTaken) {
        return res.status(400).json({
          message: `Test name have already taken`,
          success: false,
        });
      }
    }
    const updateTest = {
      ...result,
      updateBy: req.user.id,
    };
    const updatedTest = await Object.assign(oldTest, updateTest);
    if (!updatedTest) return null;
    await updatedTest.save();
    return res.status(201).json({
      message: "Test update successful ",
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

const updateClassIdsForTest = async (req, res) => {
  try {
    const result = await testUpdateClassSchema.validateAsync(req.body);
    const oldTest = await Test.findById(req.params.id);
    const updateTest = {
      ...result,
      updateBy: req.user.id,
    };
    const updatedTest = await Object.assign(oldTest, updateTest);
    if (!updatedTest) return null;
    await updatedTest.save();
    return res.status(201).json({
      message: "Test update successful ",
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

const testValidation = async (testName) => {
  let oldName = await Test.findOne({ testName: testName });
  return oldName ? false : true;
};

const getListTest = async (req, res) => {
  try {
    const features = new APIfeatures(
      Test.find({ createBy: req.user._id }),
      req.query
    )
      .filtering()
      .sorting()
      .paginating();

    const listTest = await features.query;
    const userIds = listTest.flatMap((test) =>
      mongoose.Types.ObjectId(test.createBy)
    );
    const testIds = listTest.flatMap((test) =>
      mongoose.Types.ObjectId(test._id)
    );
    const listStudentKeys = await StudentKey.find({ testId: { $in: testIds } });
    // let createdUsers = await User.find({ _id: { $in: userIds } }).select([
    //   "-classes",
    //   "-password",
    //   "-username",
    // ]);
    listTest.map((item) => {
      // item.createdUser = createdUsers.find(
      //   (u) => u._id.toString() === item.createBy
      // );
      item.totalStudents = listStudentKeys.filter(
        (sk) => sk.testId.toString() === item._id.toString()
      ).length;
      return item;
    });
    let listSubjects = [];
    listTest.map((test) => {
      listSubjects.push(test.subject);
    });
    let listUniqueSubject = _.uniq(listSubjects);
    let listSubjectWithKey = [];
    listUniqueSubject.map((subject) => {
      let listSubjectTest = [];
      listTest.map((test) => {
        if (test.subject === subject) {
          listSubjectTest.push(test);
        }
      });
      listSubjectWithKey.push({
        subject: subject,
        listSubjectTest: listSubjectTest,
      });
    });
    return res.status(201).json({
      message: "Get list test successful",
      success: true,
      data: listTest,
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
const getAllTest = async (req, res) => {
  try {
    const features = new APIfeatures(Test.find(), req.query)
      .filtering()
      .sorting()
      .paginating();

    const listTest = await features.query;
    const userIds = listTest.flatMap((test) =>
      mongoose.Types.ObjectId(test.createBy)
    );
    const testIds = listTest.flatMap((test) =>
      mongoose.Types.ObjectId(test._id)
    );
    const listStudentKeys = await StudentKey.find({ testId: { $in: testIds } });
    // let createdUsers = await User.find({ _id: { $in: userIds } }).select([
    //   "-classes",
    //   "-password",
    //   "-username",
    // ]);
    listTest.map((item) => {
      // item.createdUser = createdUsers.find(
      //   (u) => u._id.toString() === item.createBy
      // );
      item.totalStudents = listStudentKeys.filter(
        (sk) => sk.testId.toString() === item._id.toString()
      ).length;
      return item;
    });
    let listSubjects = [];
    listTest.map((test) => {
      listSubjects.push(test.subject);
    });
    let listUniqueSubject = _.uniq(listSubjects);
    let listSubjectWithKey = [];
    listUniqueSubject.map((subject) => {
      let listSubjectTest = [];
      listTest.map((test) => {
        if (test.subject === subject) {
          listSubjectTest.push(test);
        }
      });
      listSubjectWithKey.push({
        subject: subject,
        listSubjectTest: listSubjectTest,
      });
    });
    return res.status(201).json({
      message: "Get list test successful",
      success: true,
      data: listTest,
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
const getTestById = async (req, res) => {
  try {
    // let likeTest = await Test.findById(req.params.id).select([
    //   "-listQuestions",
    //   "-listKeys",
    //   "-listAnswers",
    // ]);
    // if (!likeTest) return res.status(400).json({ msg: "Test does not exist." });
    // likeTest = {
    //   ...likeTest,
    //   listTopics :
    //   likeTest.listTopics.map((item) => {
    //     return {
    //       ...item,
    //       listKeys : [],
    //       listAnswers :[],
    //       listQuestionGroups : item.listQuestionGroups.map((questionGroup) => {
    //         return {
    //           ...questionGroup,
    //           listQuestions : questionGroup.listQuestions.map((question) => {
    //             return {
    //               ...question,
    //               isRomanNumber : question.questionType === 'Matching Information' &&
    //               ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X' ,'XI', 'XII', 'XIII', 'XIV', 'XV'].includes(question.listKeys[0]),
    //               listKeys : [],
    //               questionContent : "",
    //               listAnswersWithoutKey : question.listAnswersWithoutKey.map(
    //                 (answer) => {
    //                   return answer.answerContent
    //                     ? answer.answerContent.replace("[", "").replace("]", "")
    //                     : answer.replace("[", "").replace("]", "");
    //                 }
    //               )
    //             }
    //           }),
    //           listOldKeys : [],
    //         }

    //       })
    //     }
    //   })
    // }
    // likeTest.listTopics.map((item) => {
    //   item.listKeys = [];
    //   item.listAnswers = [];
    //   item.listQuestionGroups.map((questionGroup) => {
    //     questionGroup.listOldKeys = [];
    //     questionGroup.listQuestions.map((question) => {
    //       question.listKeys = [];
    //       question.questionContent = "";
    //       question.listAnswersWithoutKey = question.listAnswersWithoutKey.map(
    //         (answer) => {
    //           return answer.answerContent
    //             ? answer.answerContent.replace("[", "").replace("]", "")
    //             : answer.replace("[", "").replace("]", "");
    //         }
    //       );
    //     });
    //   });
    // });
    let likeTest = await Test.findById(req.params.id).select([
      "-listQuestions",
      "-listKeys",
      "-listAnswers",
    ]);

    if (!likeTest) {
      return res.status(400).json({ msg: "Test does not exist." });
    }

    function processAnswer(answer) {
      const content = answer.answerContent || answer;
      return content.replace(/\[|\]/g, "");
    }

    function processQuestion(question) {
      const romanNumbers = [
        "i",
        "ii",
        "iii",
        "iv",
        "v",
        "vi",
        "vii",
        "viii",
        "ix",
        "x",
        "xi",
        "xii",
        "xiii",
        "xiv",
        "Xv",
      ];

      return {
        ...question,
        isRomanNumber:
          question.questionType === "Matching Information" &&
          romanNumbers.includes(question.listKeys[0]),
        listKeys: [],
        questionContent: "",
        listAnswersWithoutKey:
          question.listAnswersWithoutKey.map(processAnswer),
      };
    }

    function processQuestionGroup(questionGroup) {
      return {
        ...questionGroup,
        listOldKeys: [],
        listQuestions: questionGroup.listQuestions.map(processQuestion),
      };
    }

    function processTopic(item) {
      return {
        ...item,
        listKeys: [],
        listAnswers: [],
        listQuestionGroups: item.listQuestionGroups.map(processQuestionGroup),
      };
    }

    const transformed = {
      ...likeTest._doc, // _doc to get plain JS object from Mongoose document
      listTopics: likeTest.listTopics.map(processTopic),
    };

    res.json({
      status: "success",
      data: transformed,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const getTestByIdTeacherRole = async (req, res) => {
  try {
    const likeTest = await Test.findById(req.params.id).select([
      "-listQuestions",
      "-listKeys",
      "-listAnswers",
    ]);
    if (!likeTest) return res.status(400).json({ msg: "Test does not exist." });
    res.json({
      status: "success",
      data: likeTest,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
const getTestByClassId = async (req, res) => {
  try {
    if (!req.params.classId) {
      return;
    }
    const features = new APIfeatures(
      Quiz.find({
        $and: [{ classIds: { $in: [req.params.classId] } }],
      }),
      req.query
    )
      .filtering()
      .sorting()
      .paginating();

    const listTest = await features.query;
    const userIds = listTest.flatMap((test) =>
      mongoose.Types.ObjectId(test.createBy)
    );
    const testIds = listTest.flatMap((test) =>
      mongoose.Types.ObjectId(test._id)
    );
    // const listStudentKeys = await StudentKey.find({ testId: { $in: testIds } });
    let createdUsers = await User.find({ _id: { $in: userIds } }).select([
      "-classes",
      "-password",
      "-username",
    ]);
    listTest.map((item) => {
      item.createdUser = createdUsers.find(
        (u) => u._id.toString() === item.createBy
      );
      item.totalStudents = 0;
      item.listTopics = [];
      item.listQuestions = [];
      item.listKeys = [];
      item.listAnswers = [];
      return item;
    });
    return res.status(201).json({
      message: "Get list test successful",
      success: true,
      data: listTest,
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

const deleteTest = async (req, res) => {
  try {
    const testNeedDelete = await Test.findById(req.params.id);
    if (!testNeedDelete) {
      return res.status(404).json({
        message: "Test not found. Invalid id of Test",
        success: false,
      });
    }
    await Test.remove(testNeedDelete);
    return res.status(201).json({
      message: "Test successfully deleted",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};
const removeTestFromClass = async (req, res) => {
  try {
    const result = await testRemoveClassSchema.validateAsync(req.body);
    const oldTest = await Test.findById(mongoose.Types.ObjectId(result.testId));
    let oldClassIds = oldTest.classIds;
    const idOfOldClass = oldClassIds.findIndex(
      (item) => item === result.classId
    );
    if (idOfOldClass > -1) {
      const newClassIds = oldClassIds.filter((item) => item !== result.classId);
      const updateTest = {
        ...result,
        classIds: newClassIds,
        updateBy: req.user.id,
      };
      const updatedTest = await Object.assign(oldTest, updateTest);
      if (!updatedTest) return null;
      await updatedTest.save();
    }

    return res.status(201).json({
      message: "Test update successful ",
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
  createTest,
  updateTest,
  deleteTest,
  getListTest,
  getAllTest,
  getTestById,
  updateClassIdsForTest,
  getTestByClassId,
  getTestByIdTeacherRole,
  removeTestFromClass,
};
