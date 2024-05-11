const { Router } = require("express");
const {
  createSubject,
  updateSubject,
  deleteSubject,
  getListSubject,
  getSubjectById,
} = require("../../../util/masterData/subject");
const { userAuth } = require("../../../util/auth");

const router = Router();

router.post("/subject", userAuth, async (req, res) => {
  await createSubject(req, res);
});
router.get("/subject", userAuth, async (req, res) => {
  await getListSubject(req, res);
});

router.get("/subjectById/:id", userAuth, async (req, res) => {
  await getSubjectById(req, res);
});

router.put("/subject/:id", userAuth, async (req, res) => {
  await updateSubject(req, res);
});
router.delete("/subject/:id", userAuth, async (req, res) => {
  await deleteSubject(req, res);
});

module.exports = router;
