const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
  content: { type: String, default: "" },
  uid: { type: mongoose.Types.ObjectId, require: true, ref: "User" },
  created_on: { type: Date, required: true, default: Date.now },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Quote", quoteSchema);
