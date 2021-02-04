const mongoose = require("mongoose");
const Book = require("../models/Book");
require("../helpers/connection");

const subjectSchema = mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

// subjectSchema.post("remove", async (doc) => {
//   const subject_id = doc._id;
//   const books = await Book.find({ subject: subject_id });
//   Promise.all(
//     books.map((book) => {
//       Book.findOneAndUpdate(
//         { _id: book._id },
//         { $set: { subject: null } },
//         { new: true }
//       );
//     })
//   );
// });

module.exports = mongoose.model("Subject", subjectSchema);
