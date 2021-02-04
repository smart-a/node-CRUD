const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  newSubject,
  getSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjects");

router.post("/", [verifyToken], newSubject);

router.get("/:id", [verifyToken], getSubject);

router.get("/", [verifyToken], getAllSubjects);

router.put("/:id", [verifyToken], updateSubject);

router.delete("/:id", [verifyToken], deleteSubject);

module.exports = router;
