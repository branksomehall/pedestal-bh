const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 6 },
  user_class: { type: String },
  tasks: [{ type: mongoose.Types.ObjectId, required: true, ref: "Task" }], //connect task model to user model
  goals: [{ type: mongoose.Types.ObjectId, required: true, ref: "Goal" }],
  negative_thoughts: [
    { type: mongoose.Types.ObjectId, required: true, ref: "Negative_Thought" },
  ],
  negative_to_positives: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Negative_to_Positive",
    },
  ],
  prouds: [{ type: mongoose.Types.ObjectId, required: true, ref: "Proud" }],
  quotes: [{ type: mongoose.Types.ObjectId, required: true, ref: "Quote" }],
  consequences: [
    { type: mongoose.Types.ObjectId, required: true, ref: "Consequence" },
  ],

  struggles: [
    { type: mongoose.Types.ObjectId, required: true, ref: "Struggle" },
  ],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
