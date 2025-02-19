const { Router } = require("express");
const { userAuth } = require("../../util/auth");
const {
  createQuestionType,
  updateQuestionType,
  deleteQuestionType,
  getListQuestionType,
  getQuestionTypeById,
} = require("../../util/questionType");
const { importQuestions } = require("../../util/question");

const router = Router();

router.post("/questionType", userAuth, async (req, res) => {
  await createQuestionType(req, res);
});
router.get("/questionType", userAuth, async (req, res) => {
  await getListQuestionType(req, res);
});
router.get("/questionTypeById/:id", userAuth, async (req, res) => {
  await getQuestionTypeById(req, res);
});
router.put("/questionType/:id", userAuth, async (req, res) => {
  await updateQuestionType(req, res);
});
router.delete("/questionType/:id", userAuth, async (req, res) => {
  await deleteQuestionType(req, res);
});
router.post("/questionType", userAuth, async (req, res) => {
  await createQuestionType(req, res);
});
router.post("/importQuestion", userAuth, async (req, res) => {
  await importQuestions(req, res);
});
module.exports = router;
