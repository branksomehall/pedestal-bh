const mongoose = require("mongoose");

const negativeThoughtsSchema = new mongoose.Schema({
  content: {
    item_1: { type: String, required: true, default: "" },
    item_2: { type: String, required: true, default: "" },
  },
  uid: { type: mongoose.Types.ObjectId, require: true, ref: "User" },
  created_on: { type: Date, required: true, default: Date.now },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Negative_Thought", negativeThoughtsSchema);
