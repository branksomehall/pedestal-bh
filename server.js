const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;
const cors = require("cors");
const mongoose = require("mongoose");

const taskRoutes = require("./routes/task-routes");
const usersRoutes = require("./routes/users-routes");
const quoteRoutes = require("./routes/quote-routes");

const consequenceRoutes = require("./routes/consequence-routes");
const goalRoutes = require("./routes/goal-routes");
const negativeThoughtRoutes = require("./routes/negative_thought-routes");

const negativeToPositiveRoutes = require("./routes/negative_to_positive-routes");
const proudRoutes = require("./routes/proud-routes");
const struggleRoutes = require("./routes/struggle-routes");
require("dotenv").config();

app.use(bodyParser.json());

app.use(cors());

app.use("/api/users", usersRoutes);
app.use("/api/task_manager", taskRoutes);
app.use("/api/task_manager", quoteRoutes);
app.use("/api/task_manager", consequenceRoutes);
app.use("/api/task_manager", goalRoutes);
app.use("/api/task_manager", negativeThoughtRoutes);
app.use("/api/task_manager", negativeToPositiveRoutes);
app.use("/api/task_manager", proudRoutes);
app.use("/api/task_manager", struggleRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bhnfw.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to database!");
    app.listen(port); // if connection is successful, start the server
  })
  .catch((err) => {
    console.log(err);
  });