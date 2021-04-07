const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  uid: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  created_on: { type: Date, required: true, default: Date.now },
  refresh_token: { type: String, required: true },
});

module.exports = mongoose.model("Refresh_Token", refreshTokenSchema);
