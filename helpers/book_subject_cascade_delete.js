const mongoose = require("mongoose");
const Book = require("../models/Book");

module.exports.casecadeDeleteArray = async (id) => {
  try {
    let result = [];
    filter[childPath] = { $in: [childValue] };
    const books = await Book.find({ subject: { $in: [id] } });
    books.map((book) => {
      Books.findOneAndUpdate(
        book._id,
        { $pull: { subject: id } },
        { new: true },
        (err, rs) => {
          if (err) return { error: err };
          result.push({ result: rs });
        }
      );
    });
  } catch (error) {
    return { error };
  }
};

module.exports.casecadeDelete = async (id) => {
  try {
    let result = [];
    const books = await Book.find({ subject: id });
    books.map((book) => {
      Book.findOneAndUpdate(
        { _id: book._id },
        { $set: { subject: null } },
        { new: true },
        (err, rs) => {
          if (err) return { error: err };
          result.push({ result: rs });
        }
      );
    });
    return result;
  } catch (error) {
    return { error };
  }
};
