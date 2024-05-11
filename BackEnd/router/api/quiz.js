const { Router } = require("express");
const { userAuth } = require("../../util/auth");
const {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getListQuiz,
  getQuizById,
  removeTestFromQuiz,
} = require("../../util/quiz");

const router = Router();

router.post("/quiz", userAuth, async (req, res) => {
  await createQuiz(req, res);
});
router.get("/quiz", userAuth, async (req, res) => {
  await getListQuiz(req, res);
});

router.get("/quizById/:id", userAuth, async (req, res) => {
  await getQuizById(req, res);
});

router.put("/quiz/:id", userAuth, async (req, res) => {
  await updateQuiz(req, res);
});
router.delete("/quiz/:id", userAuth, async (req, res) => {
  await deleteQuiz(req, res);
});
router.put("/quizByClassId", userAuth, async (req, res) => {
  await removeTestFromQuiz(req, res);
});

module.exports = router;
