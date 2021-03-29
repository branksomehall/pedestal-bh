const Consequence = require("../models/consequence");
const createError = require("http-errors");
const mongoose = require("mongoose");
const User = require("../models/user");
const { create } = require("../models/user");

const getConsequences = async (req, res, next) => {
  let consequences = [];
  try {
    consequences = await Consequence.find().exec();
  } catch (err) {
    const error = createError(500, "Unable to retrieve consequences");
    return next(error);
  }
  res.json({ consequences });
};

const getConsequencesforUser = async (req, res, next) => {
  let uid = req.params.uid;
  let consequences = [];
  try {
    consequences = await Consequence.find({ uid });
  } catch (err) {
    const error = createError(
      500,
      "Failed to fetch consequences for this user"
    );
    return next(error);
  }

  if (!consequences || consequences.length == 0) {
    return next(
      createError(500, "Could not find any consequences for this user")
    );
  }
  res.json({
    consequences: consequences.map((consequence) =>
      consequence.toObject({ getters: true })
    ),
  });
};

const getConsequenceById = async (req, res, next) => {
  let consequence_id = req.params.consequence_id;
  let consequence;
  try {
    consequence = await Consequence.findById({ _id: consequence_id });
  } catch (err) {
    const error = createError(500, "Unable to fetch consequence with ID");
  }

  res.json({ consequence });
};

const updateConsequenceById = async (req, res, next) => {
  const consequence_id = req.params.consequence_id;
  const { content } = req.body;

  let consequence;
  try {
    consequence = await Consequence.findById(consequence_id);
  } catch (err) {
    const error = createError(500, "Could not update consequence");
    return next(error);
  }

  consequence.content = content;

  try {
    await consequence.save();
  } catch (err) {
    const error = createError(500, "Could not update consequence");
    return next(error);
  }

  res
    .status(200)
    .json({ consequence: consequence.toObject({ getters: true }) });
};

const createConsequence = async (req, res, next) => {
  const { content, date, uid } = req.body;
  const generatedConsequence = new Consequence({
    content,
    date,
    uid,
  });

  let user;

  try {
    user = await User.findById(uid);
  } catch (err) {
    const error = createError(500, "Creating consequence failed");
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
    result = await generatedConsequence.save({ session: session });
    user.consequences.push(generatedConsequence);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = createError(500, "Creating consequence failed in save");
    return next(error);
  }

  res.json(result);
};

exports.getConsequences = getConsequences;
exports.getConsequencesforUser = getConsequencesforUser;
exports.getConsequenceById = getConsequenceById;
exports.updateConsequenceById = updateConsequenceById;
exports.createConsequence = createConsequence;
