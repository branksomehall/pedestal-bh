const NegativeThought = require("../models/negative_thought");
const createError = require("http-errors");
const mongoose = require("mongoose");
const User = require("../models/user");
const { create } = require("../models/user");

const getNegativeThoughts = async (req, res, next) => {
  let negative_thoughts = [];
  try {
    negative_thoughts = await NegativeThought.find().exec();
  } catch (err) {
    const error = createError(500, "Unable to retrieve negative_thoughts");
    return next(error);
  }
  res.json({ negative_thoughts });
};

const getNegativeThoughtsforUser = async (req, res, next) => {
  let uid = req.params.uid;
  let negative_thoughts = [];
  try {
    negative_thoughts = await NegativeThought.find({ uid });
  } catch (err) {
    const error = createError(
      500,
      "Failed to fetch negative_thoughts for this user"
    );
    return next(error);
  }

  if (!negative_thoughts || negative_thoughts.length == 0) {
    return next(
      createError(500, "Could not find any negative_thoughts for this user")
    );
  }
  res.json({
    negative_thoughts: negative_thoughts.map((negative_thought) =>
      negative_thought.toObject({ getters: true })
    ),
  });
};

const getNegativeThoughtById = async (req, res, next) => {
  let negative_thought_id = req.params.negative_thought_id;
  let negative_thought;
  try {
    negative_thought = await NegativeThought.findById({
      _id: negative_thought_id,
    });
  } catch (err) {
    const error = createError(500, "Unable to fetch negative_thought with ID");
  }

  res.json({ negative_thought });
};

const updateNegativeThoughtById = async (req, res, next) => {
  const negative_thought_id = req.params.negative_thought_id;
  const { content } = req.body;

  let negative_thought;
  try {
    negative_thought = await NegativeThought.findById(negative_thought_id);
  } catch (err) {
    const error = createError(500, "Could not update negative_thought");
    return next(error);
  }

  negative_thought.content = content;

  try {
    await negative_thought.save();
  } catch (err) {
    const error = createError(500, "Could not update negative_thought");
    return next(error);
  }

  res
    .status(200)
    .json({ negative_thought: negative_thought.toObject({ getters: true }) });
};

const createNegativeThought = async (req, res, next) => {
  const { content, date, uid } = req.body;
  const generatedNegativeThought = new NegativeThought({
    content,
    date,
    uid,
  });

  let user;

  try {
    user = await User.findById(uid);
  } catch (err) {
    const error = createError(500, "Creating negative_thought failed");
    return next(error);
  }

  if (!user) {
    const error = createError(500, "Cound not find user for provided uid");
    return next(error);
  }

  let result = [];
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    result = await generatedNegativeThought.save({ session: session });
    user.negative_thoughts.push(generatedNegativeThought);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = createError(500, "Creating negative_thought failed in save");
    return next(error);
  }

  res.json(result);
};

exports.getNegativeThoughts = getNegativeThoughts;
exports.getNegativeThoughtsforUser = getNegativeThoughtsforUser;
exports.getNegativeThoughtById = getNegativeThoughtById;
exports.updateNegativeThoughtById = updateNegativeThoughtById;
exports.createNegativeThought = createNegativeThought;