const { Router } = require("express");
const { userAuth } = require("../../util/auth");
const {
  createStudentKey,
  updateStudentKey,
  deleteStudentKey,
  getListStudentKey,
  getStudentKeyByClassAndTestId,
  getStudentKeyByClassId,
  getStudentKeyById,
  getStudentKeyByClassAndStudentId,
  getCurrentStudentKeyByClassAndTestId,
  getCurrentStudentKeyByClassAndTestIdAndStudentId,
} = require("../../util/studentKey");

const router = Router();

router.post("/studentKey", userAuth, async (req, res) => {
  await createStudentKey(req, res);
});
router.get("/studentKey", userAuth, async (req, res) => {
  await getListStudentKey(req, res);
});
router.get("/studentKeyById/:id", userAuth, async (req, res) => {
  await getStudentKeyById(req, res);
});
router.post("/StudentKeyByClassAndTestId", userAuth, async (req, res) => {
  await getStudentKeyByClassAndTestId(req, res);
});
router.post("/StudentKeyByClassId", userAuth, async (req, res) => {
  await getStudentKeyByClassId(req, res);
});
router.post("/StudentKeyByClassIdAndStudentId", userAuth, async (req, res) => {
  await getStudentKeyByClassAndStudentId(req, res);
});
router.post(
  "/studentKeyByClassAndTestIdAndStudentId",
  userAuth,
  async (req, res) => {
    await getCurrentStudentKeyByClassAndTestIdAndStudentId(req, res);
  }
);
router.post(
  "/currentStudentKeyByClassAndTestId",
  userAuth,
  async (req, res) => {
    await getCurrentStudentKeyByClassAndTestId(req, res);
  }
);
router.put("/studentKey/:id", userAuth, async (req, res) => {
  await updateStudentKey(req, res);
});
router.delete("/studentKey/:id", userAuth, async (req, res) => {
  await deleteStudentKey(req, res);
});

module.exports = router;
