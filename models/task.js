const { MongoServerSelectionError } = require("mongodb");
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  task_name: { type: String, required: true },
  uid: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  created_on: { type: Date, required: true, default: Date.now },
  isCompleted: { type: Boolean, required: true, default: false },
  date: { type: Date, required: true },
  completedOn: { type: Date, required: false, default: null },
});

module.exports = mongoose.model("Task", taskSchema);
