const { Router } = require("express");
const { userAuth } = require("../../util/auth");
const {
  createQuizStudentKey,
  updateQuizStudentKey,
  deleteQuizStudentKey,
  getListQuizStudentKey,
  getQuizStudentKeyByClassAndQuizId,
  getQuizStudentKeyByClassId,
  getQuizStudentKeyById,
  getQuizStudentKeyByClassAndStudentId,
  getCurrentQuizStudentKeyByClassAndQuizId,
  getCurrentQuizStudentKeyByClassAndQuizIdAndStudentId,
} = require("../../util/quizStudentKey");

const router = Router();

router.post("/quizStudentKey", userAuth, async (req, res) => {
  await createQuizStudentKey(req, res);
});
router.get("/quizStudentKey", userAuth, async (req, res) => {
  await getListQuizStudentKey(req, res);
});
router.get("/quizStudentKeyById/:id", userAuth, async (req, res) => {
  await getQuizStudentKeyById(req, res);
});
router.post("/quizStudentKeyByClassAndQuizId", userAuth, async (req, res) => {
  await getQuizStudentKeyByClassAndQuizId(req, res);
});
router.post("/quizStudentKeyByClassId", userAuth, async (req, res) => {
  await getQuizStudentKeyByClassId(req, res);
});
router.post(
  "/quizStudentKeyByClassIdAndStudentId",
  userAuth,
  async (req, res) => {
    await getQuizStudentKeyByClassAndStudentId(req, res);
  }
);
router.post(
  "/quizStudentKeyByClassAndQuizIdAndStudentId",
  userAuth,
  async (req, res) => {
    await getCurrentQuizStudentKeyByClassAndQuizIdAndStudentId(req, res);
  }
);
router.post(
  "/currentQuizStudentKeyByClassAndQuizId",
  userAuth,
  async (req, res) => {
    await getCurrentQuizStudentKeyByClassAndQuizId(req, res);
  }
);
router.put("/studentKey/:id", userAuth, async (req, res) => {
  await updateQuizStudentKey(req, res);
});
router.delete("/studentKey/:id", userAuth, async (req, res) => {
  await deleteQuizStudentKey(req, res);
});

module.exports = router;
