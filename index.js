const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config(); //{ path: ".env" }
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const userRoute = require("./routers/users");
app.use("/users", userRoute);

const bookRoute = require("./routers/books");
app.use("/books", bookRoute);

const subjectRoute = require("./routers/subjects");
app.use("/subjects", subjectRoute);

app.listen(port, () => {
  console.log(`Listen on port ${port}.....`);
});
