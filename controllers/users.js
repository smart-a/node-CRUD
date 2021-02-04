const { Validator } = require("node-input-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const secret = process.env.TOKEN_KEY;
const saltRound = 10;
const User = require("../models/User");
const {
  vErrorFormatter,
  mValidatorError,
} = require("../helpers/errorFormatter");

module.exports.newUser = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      firstname: "required|maxLength:15",
      lastname: "required|maxLength:15",
      sex: "required",
      email: "required|email",
      phone: "required",
      password: "required|minLength:8",
    });

    const match = await v.check();
    if (!match) return res.status(422).json(vErrorFormatter(v.errors));

    const hash = bcrypt.hashSync(req.body.password, saltRound);
    req.body.password = hash;

    const user = new User(req.body);
    user.save((err, result) => {
      if (err && err.name == "ValidationError")
        return res.status(422).json(mValidatorError(err.errors));

      result = JSON.parse(JSON.stringify(result));
      delete result.password;

      res.status(201).json({ user: result });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports.login = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      email: "required|email",
      password: "required|minLength:8",
    });

    const match = await v.check();
    if (!match) return res.status(422).json(vErrorFormatter(v.errors));

    let user = await User.findOne({ email: req.body.email });
    if (user == null) return res.status(403).json({ message: "Invalid user" });

    const check = await bcrypt.compare(req.body.password, user.password);
    if (!check) return res.status(403).json({ message: "Invalid user" });

    user = JSON.parse(JSON.stringify(user));
    delete user.password;

    await jwt.sign(
      { data: user },
      secret,
      { expiresIn: 60 * 60 * 40 },
      (err, token) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json({ user, token });
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.getUser = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.auth._id });
    if (user == null)
      return res.status(404).json({ message: "Record not found" });

    user = JSON.parse(JSON.stringify(user));
    delete user.password;

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    if (req.body.email != null)
      return res.status(402).json({ message: "Changing Email is not allowed" });

    if (req.body.password != null) {
      const hash = bcrypt.hashSync(req.body.password, saltRound);
      req.body.password = hash;
    }

    const user = await User.findOneAndUpdate(
      { _id: req.auth._id },
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({ user });
  } catch (error) {
    if (error.name == "ValidationError")
      res.status(422).json(mValidatorError(error.errors));

    res.status(500).json(error);
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const user = await User.deleteOne({ _id: req.auth._id });
    if (!user.deletedCount)
      return res.status(422).json({ message: "Cannot perform this action" });

    res.status(200).json({ message: "Account deleted succefully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
