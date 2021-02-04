const { text } = require("express");
const { Timestamp } = require("mongodb");
const { ObjectId } = require("mongodb");
const { Double } = require("mongodb");
const mongoose = require("mongoose");
require("../helpers/connection");

const bookSchema = mongoose.Schema(
  {
    title: { type: String, maxLength: 32 },
    price: Number,
    subject: { type: ObjectId, ref: "Subject" },
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
