const NegativeToPositive = require("../models/negative_to_positive");
const createError = require("http-errors");
const mongoose = require("mongoose");
const User = require("../models/user");
const { create } = require("../models/user");

const getNegativeToPositives = async (req, res, next) => {
  let negative_to_positives = [];
  try {
    negative_to_positives = await NegativeToPositive.find().exec();
  } catch (err) {
    const error = createError(500, "Unable to retrieve negative_to_positives");
    return next(error);
  }
  res.json({ negative_to_positives });
};

const getNegativeToPositivesforUser = async (req, res, next) => {
  let uid = req.params.uid;
  let negative_to_positives = [];
  try {
    negative_to_positives = await NegativeToPositive.find({ uid });
  } catch (err) {
    const error = createError(
      500,
      "Failed to fetch negative_to_positives for this user"
    );
    return next(error);
  }

  if (!negative_to_positives || negative_to_positives.length == 0) {
    return next(
      createError(500, "Could not find any negative_to_positives for this user")
    );
  }
  res.json({
    negative_to_positives: negative_to_positives.map((negative_to_positive) =>
      negative_to_positive.toObject({ getters: true })
    ),
  });
};

const getNegativeToPositiveforUserDate = async (req, res, next) => {
  const uid = req.params.uid;
  const date = req.params.date;
  let negative_to_positives;
  try {
    negative_to_positives = await NegativeToPositive.findOne({ uid, date });
  } catch (err) {
    const error = createError(
      500,
      "Fetching negative to positives failed for this user and date"
    );
    return next(error);
  }
  if (!negative_to_positives) {
    const error = createError(
      500,
      "No negative to positive for this user and date"
    );
    return next(error);
  }
  res.json(negative_to_positives);
};

const getNegativeToPositiveById = async (req, res, next) => {
  let negative_to_positive_id = req.params.negative_to_positive_id;
  let negative_to_positive;
  try {
    negative_to_positive = await NegativeToPositive.findById({
      _id: negative_to_positive_id,
    });
  } catch (err) {
    const error = createError(
      500,
      "Unable to fetch negative_to_positive with ID"
    );
  }

  res.json({ negative_to_positive });
};

const updateNegativeToPositiveById = async (req, res, next) => {
  console.log("PUT");
  const negative_to_positive_id = req.params.negative_to_positive_id;

  const { content } = req.body;

  let negative_to_positive;
  try {
    negative_to_positive = await NegativeToPositive.findById(
      negative_to_positive_id
    );
  } catch (err) {
    const error = createError(500, "Could not update negative_to_positive");
    return next(error);
  }

  if (content.item_1 !== "" || content.item_1 !== null) {
    negative_to_positive.content.item_1 = content.item_1;
  }

  if (content.item_2 !== "" || content.item_2 !== null) {
    negative_to_positive.content.item_2 = content.item_2;
  }

  try {
    await negative_to_positive.save();
  } catch (err) {
    const error = createError(500, "Could not update negative_to_positive");
    return next(error);
  }

  res.status(200).json(negative_to_positive.toObject({ getters: true }));
};

const updateOrCreateNegativeToPositiveForUserAndDate = async (
  req,
  res,
  next
) => {
  // find negative to positive
  const uid = req.params.uid;
  const date = req.params.date;
  const { content } = req.body;
  let negative_to_positives;

  try {
    negative_to_positives = await NegativeToPositive.findOne({ uid, date });
  } catch (err) {
    const error = createError(
      500,
      "Fetching negative to positives failed for this user and date"
    );
    return next(error);
  }

  // if there are no negative to positives, create
  if (!negative_to_positives) {
    const generatedNegativeToPositive = new NegativeToPositive({
      content,
      date,
      uid,
    });
    let user;

    try {
      user = await User.findById(uid);
    } catch (err) {
      const error = createError(500, "Creating negative_to_positive failed");
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
      result = await generatedNegativeToPositive.save({ session: session });
      user.negative_to_positives.push(generatedNegativeToPositive);
      await user.save({ session: session });
      await session.commitTransaction();
    } catch (err) {
      const error = createError(
        500,
        "Creating negative_to_positive failed in save"
      );
      return next(error);
    }

    res.json(result);
  } else {
    if (content.item_1) {
      negative_to_positives.content.item_1 = content.item_1;
    }

    if (content.item_2) {
      negative_to_positives.content.item_2 = content.item_2;
    }
    try {
      await negative_to_positives.save();
    } catch (err) {
      const error = createError(500, "Could not update negative_to_positive");
      return next(error);
    }

    res.status(200).json(negative_to_positives.toObject({ getters: true }));
  }
};

const createNegativeToPositive = async (req, res, next) => {
  const { content, date, uid } = req.body;
  const generatedNegativeToPositive = new NegativeToPositive({
    content,
    date,
    uid,
  });

  let user;

  try {
    user = await User.findById(uid);
  } catch (err) {
    const error = createError(500, "Creating negative_to_positive failed");
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
    result = await generatedNegativeToPositive.save({ session: session });
    user.negative_to_positives.push(generatedNegativeToPositive);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = createError(
      500,
      "Creating negative_to_positive failed in save"
    );
    return next(error);
  }

  res.json(result);
};

exports.getNegativeToPositives = getNegativeToPositives;
exports.getNegativeToPositivesforUser = getNegativeToPositivesforUser;
exports.getNegativeToPositiveById = getNegativeToPositiveById;
exports.updateNegativeToPositiveById = updateNegativeToPositiveById;
exports.createNegativeToPositive = createNegativeToPositive;
exports.getNegativeToPositiveforUserDate = getNegativeToPositiveforUserDate;
exports.updateOrCreateNegativeToPositiveForUserAndDate = updateOrCreateNegativeToPositiveForUserAndDate;
