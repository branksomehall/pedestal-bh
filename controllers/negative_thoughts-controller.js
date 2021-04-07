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

const getNegativeThoughtsforUserDate = async (req, res, next) => {
  const uid = req.params.uid;
  const date = req.params.date;
  let negative_thoughts;

  try {
    negative_thoughts = await NegativeThought.findOne({ uid, date });
  } catch (err) {
    const error = createError(
      500,
      "Fetching negative thoughts failed for this user and date"
    );
    return next(error);
  }

  if (!negative_thoughts) {
    const error = createError(
      500,
      "No negative thoughts for this user and date"
    );
    return next(error);
  }
  res.json(negative_thoughts);
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

  if (content.item_1 !== "" || content.item_1 !== null) {
    negative_thought.content.item_1 = content.item_1;
  }

  if (content.item_2 !== "" || content.item_2 !== null) {
    negative_thought.content.item_2 = content.item_2;
  }

  try {
    await negative_thought.save();
  } catch (err) {
    const error = createError(500, "Could not update negative_thought");
    return next(error);
  }

  res.status(200).json(negative_thought.toObject({ getters: true }));
};

const createNegativeThought = async (req, res, next) => {
  const { content, date, uid } = req.body;

  const negative_thought = await NegativeThought.find({ uid, date });

  if (negative_thought.length > 0) {
    const error = createError(
      500,
      "Negative thoughts for this user for this date has been previously set"
    );
    return next(error);
  }

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

  res.json(result[0]);
};

const updateOrCreateNegativeThoughtForUserAndDate = async (req, res, next) => {
  // find negative thought
  const uid = req.params.uid;
  const date = req.params.date;
  const { content } = req.body;
  let negative_thoughts;

  try {
    negative_thoughts = await NegativeThought.findOne({ uid, date });
  } catch (err) {
    const error = createError(
      500,
      "Fetching negative thoughts failed for this user and date"
    );
    return next(error);
  }

  // if there are no negative thoughts, create
  if (!negative_thoughts) {
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
      const error = createError(
        500,
        "Creating negative_thought failed in save"
      );
      return next(error);
    }

    res.json(result);
  } else {
    if (content.item_1) {
      negative_thoughts.content.item_1 = content.item_1;
    }

    if (content.item_2) {
      negative_thoughts.content.item_2 = content.item_2;
    }
    try {
      await negative_thoughts.save();
    } catch (err) {
      const error = createError(500, "Could not update negative_thought");
      return next(error);
    }

    res.status(200).json(negative_thoughts.toObject({ getters: true }));
  }
};

exports.getNegativeThoughts = getNegativeThoughts;
exports.getNegativeThoughtsforUser = getNegativeThoughtsforUser;
exports.getNegativeThoughtById = getNegativeThoughtById;
exports.updateNegativeThoughtById = updateNegativeThoughtById;
exports.createNegativeThought = createNegativeThought;
exports.getNegativeThoughtsforUserDate = getNegativeThoughtsforUserDate;
exports.updateOrCreateNegativeThoughtForUserAndDate = updateOrCreateNegativeThoughtForUserAndDate;
