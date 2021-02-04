const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
require("../helpers/connection");

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, max: 15 },
    lastname: { type: String, max: 15 },
    sex: { type: String, enum: ["Male", "Female"] },
    phone: String,
    email: { type: String, unique: true, uniqueCaseInsensitive: true },
    password: String,
  },
  { timestamps: true }
);
userSchema.plugin(uniqueValidator, { message: "Email already exist" });
module.exports = mongoose.model("User", userSchema);
