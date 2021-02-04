const mongoose = require("mongoose");
const Book = require("../models/Book");
const { Validator } = require("node-input-validator");
const {
  vErrorFormatter,
  mValidatorError,
} = require("../helpers/errorFormatter");

module.exports.newBook = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      title: "required|maxLength:32",
      price: "required",
      subject: "required",
      description: "required",
    });

    const match = await v.check();
    if (!match) return res.status(400).json(vErrorFormatter(v.errors));

    const book = new Book(req.body);
    let result = await book.save();

    res.status(201).json({ book: result });
  } catch (error) {
    if (error.name == "ValidationError")
      res.status(422).json(mValidatorError(error.errors));

    res.status(500).json(error);
  }
};

module.exports.getBook = async (req, res) => {
  try {
    if (req.params.id == null || !mongoose.isValidObjectId(req.params.id))
      return res.status(402).json({ message: "Invalid book" });

    const book = await Book.findOne({ _id: req.params.id }).populate({
      path: "subject",
    });
    if (book == null)
      return res.status(404).json({ message: "Book not exist" });

    res.status(200).json({ book });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate({ path: "subject" });
    if (books == null) return res.status(200).json({ books: [] });

    return res.status(200).json({ books });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.updateBook = async (req, res) => {
  try {
    if (req.params.id == null || !mongoose.isValidObjectId(req.params.id))
      return res.status(402).json({ message: "Invalid book" });

    const book = await Book.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );

    if (book == null) return res.status(404).json({ message: "Invalid book" });

    res.status(200).json({ book });
  } catch (error) {
    if (error.name == "ValidationError")
      res.status(422).json(mValidatorError(error.errors));

    res.status(500).json(error);
  }
};

module.exports.deleteBook = async (req, res) => {
  try {
    if (req.params.id == null || !mongoose.isValidObjectId(req.params.id))
      return res.status(402).json({ message: "Invalid book" });

    const book = await Book.deleteOne({ _id: req.params.id });

    if (!book.deletedCount)
      return res.status(422).json({ message: "Cannot find book to delete" });

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};
