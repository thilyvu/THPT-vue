const { Router } = require("express");
const { userAuth } = require("../../util/auth");
const {
  createQuestionBank,
  updateQuestionBank,
  deleteQuestionBank,
  getListQuestionBank,
  getQuestionBankById,
} = require("../../util/questionBank");

const router = Router();

router.post("/questionBank", userAuth, async (req, res) => {
  await createQuestionBank(req, res);
});
router.get("/questionBank", userAuth, async (req, res) => {
  await getListQuestionBank(req, res);
});
router.get("/questionBankById/:id", userAuth, async (req, res) => {
  await getQuestionBankById(req, res);
});
router.put("/questionBank/:id", userAuth, async (req, res) => {
  await updateQuestionBank(req, res);
});
router.delete("/questionBank/:id", userAuth, async (req, res) => {
  await deleteQuestionBank(req, res);
});
router.post("/questionBank", userAuth, async (req, res) => {
  await createQuestionBank(req, res);
});
module.exports = router;
