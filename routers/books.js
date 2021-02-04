const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  newBook,
  getBook,
  getAllBooks,
  updateBook,
  deleteBook,
} = require("../controllers/books");

router.post("/", [verifyToken], newBook);

router.get("/:id", [verifyToken], getBook);

router.get("/", [verifyToken], getAllBooks);

router.put("/:id", [verifyToken], updateBook);

router.delete("/:id", [verifyToken], deleteBook);

module.exports = router;
