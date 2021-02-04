const mongoose = require("mongoose");
const Subject = require("../models/Subject");
const { Validator } = require("node-input-validator");
const { vErrorFormatter } = require("../helpers/errorFormatter");
const { casecadeDelete } = require("../helpers/book_subject_cascade_delete");

module.exports.newSubject = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      name: "required|maxLength:32",
    });

    const match = await v.check();
    if (!match) return res.status(400).json(vErrorFormatter(v.errors));

    const subject = new Subject(req.body);
    let result = await subject.save();

    res.status(201).json({ subject: result });
  } catch (error) {
    if (error.name == "ValidationError")
      res.status(422).json(mValidatorError(error.errors));

    res.status(500).json(error);
  }
};

module.exports.getSubject = async (req, res) => {
  try {
    if (req.params.id == null || !mongoose.isValidObjectId(req.params.id))
      return res.status(402).json({ message: "Invalid subject" });

    const subject = await Subject.findOne({ _id: req.params.id });

    if (subject == null)
      return res.status(404).json({ message: "Subject not exist" });

    res.status(200).json({ subject });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    if (subjects == null) return res.status(200).json({ subject: [] });

    return res.status(200).json({ subjects });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.updateSubject = async (req, res) => {
  try {
    if (req.params.id == null || !mongoose.isValidObjectId(req.params.id))
      return res.status(402).json({ message: "Invalid subject" });

    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );

    if (subject == null)
      return res.status(404).json({ message: "Invalid subject" });

    res.status(200).json({ subject });
  } catch (error) {
    if (error.name == "ValidationError")
      res.status(422).json(mValidatorError(error.errors));

    res.status(500).json(error);
  }
};

module.exports.deleteSubject = async (req, res) => {
  try {
    if (req.params.id == null || !mongoose.isValidObjectId(req.params.id))
      return res.status(402).json({ message: "Invalid book" });

    const subject = await Subject.deleteOne({ _id: req.params.id });

    if (!subject.deletedCount)
      return res.status(422).json({ message: "Cannot find subject to delete" });

    let result = casecadeDelete(req.params.id);
    if (result.error)
      return res.status(422).json({ message: "Unable to cascade ref" });

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};
