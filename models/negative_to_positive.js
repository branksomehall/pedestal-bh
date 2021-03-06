const mongoose = require("mongoose");

const negativeToPositiveSchema = new mongoose.Schema({
  content: {
    item_1: { type: String, default: "" },
    item_2: { type: String, default: "" },
  },
  uid: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  created_on: { type: Date, required: true, default: Date.now },
  date: { type: Date, required: true },
});

module.exports = mongoose.model(
  "Negative_to_Positive",
  negativeToPositiveSchema
);
