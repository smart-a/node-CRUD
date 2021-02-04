const jwt = require("jsonwebtoken");
const secret = process.env.TOKEN_KEY;

module.exports.verifyToken = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (token == null)
      return res.status(401).json({ message: "Invalid token, access denied" });

    const decode = jwt.verify(token, secret);
    if (!decode)
      return res.status(401).json({ message: "Invalid token, access denied" });

    req.auth = decode.data;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token, access denied" });
  }
};
