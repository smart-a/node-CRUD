const mongoose = require("mongoose");

const db_name = process.env.DB_NAME;
try {
  mongoose.connect(db_name, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log("Connect to DB...");
} catch (err) {
  console.log(err);
}
