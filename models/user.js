const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 6 },
  tasks: [{ type: mongoose.Types.ObjectId, require: true, ref: "Task" }], //connect task model to user model
  goals: [{ type: mongoose.Types.ObjectId, require: true, ref: "Goal" }],
  negative_thoughts: [
    { type: mongoose.Types.ObjectId, require: true, ref: "Negative_Thought" },
  ],
  negative_to_positives: [
    {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "Negative_to_Positive",
    },
  ],
  prouds: [{ type: mongoose.Types.ObjectId, require: true, ref: "Proud" }],
  quotes: [{ type: mongoose.Types.ObjectId, require: true, ref: "Quote" }],
  struggles: [
    { type: mongoose.Types.ObjectId, require: true, ref: "Struggle" },
  ],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
