const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  newUser,
  getUser,
  login,
  updateUser,
  deleteUser,
} = require("../controllers/users");

router.post("/", newUser);

router.post("/login", login);

router.get("/", [verifyToken], getUser);

router.put("/", [verifyToken], updateUser);

router.delete("/", [verifyToken], deleteUser);

module.exports = router;
