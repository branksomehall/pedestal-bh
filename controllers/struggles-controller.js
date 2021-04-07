const Struggle = require("../models/struggle");
const createError = require("http-errors");
const mongoose = require("mongoose");
const User = require("../models/user");
const { create } = require("../models/user");

const getStruggles = async (req, res, next) => {
  let struggles = [];
  try {
    struggles = await Struggle.find().exec();
  } catch (err) {
    const error = createError(500, "Unable to retrieve struggles");
    return next(error);
  }
  res.json({ struggles });
};

const getStrugglesforUser = async (req, res, next) => {
  let uid = req.params.uid;
  let struggles = [];
  try {
    struggles = await Struggle.find({ uid });
  } catch (err) {
    const error = createError(500, "Failed to fetch struggles for this user");
    return next(error);
  }

  if (!struggles || struggles.length == 0) {
    return next(createError(500, "Could not find any struggles for this user"));
  }
  res.json({
    struggles: struggles.map((struggle) =>
      struggle.toObject({ getters: true })
    ),
  });
};

const getStruggleById = async (req, res, next) => {
  let struggle_id = req.params.struggle_id;
  let struggle;
  try {
    struggle = await Struggle.findById({ _id: struggle_id });
  } catch (err) {
    const error = createError(500, "Unable to fetch struggle with ID");
  }

  res.json({ struggle });
};

const getStruggleforUserDate = async (req, res, next) => {
  const uid = req.params.uid;
  const date = req.params.date;
  let struggles;
  try {
    struggles = await Struggle.findOne({ uid, date });
  } catch (err) {
    const error = createError(
      500,
      "Fetching negative thoughts failed for this user and date"
    );
    return next(error);
  }

  if (!struggles) {
    const error = createError(500, "No struggles for this user and date");
    return next(error);
  }

  res.json(struggles);
};

const updateStruggleById = async (req, res, next) => {
  const struggle_id = req.params.struggle_id;
  const { content } = req.body;

  let struggle;
  try {
    struggle = await Struggle.findById(struggle_id);
  } catch (err) {
    const error = createError(500, "Could not update struggle");
    return next(error);
  }

  struggle.content = content;

  try {
    await struggle.save();
  } catch (err) {
    const error = createError(500, "Could not update struggle");
    return next(error);
  }

  res.status(200).json({ struggle: struggle.toObject({ getters: true }) });
};

const updateOrCreateStruggleForUserAndDate = async (req, res, next) => {
  // find struggle
  const uid = req.params.uid;
  const date = req.params.date;
  const { content } = req.body;
  let struggles;

  try {
    struggles = await Struggle.findOne({ uid, date });
  } catch (err) {
    const error = createError(
      500,
      "Fetching struggles failed for this user and date"
    );
    return next(error);
  }

  // if there are no struggles, create
  if (!struggles) {
    const generatedStruggle = new Struggle({
      content,
      date,
      uid,
    });
    let user;

    try {
      user = await User.findById(uid);
    } catch (err) {
      const error = createError(500, "Creating struggle failed");
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
      result = await generatedStruggle.save({ session: session });
      user.struggles.push(generatedStruggle);
      await user.save({ session: session });
      await session.commitTransaction();
    } catch (err) {
      const error = createError(500, "Creating struggle failed in save");
      return next(error);
    }

    res.json(result);
  } else {
    struggles.content = content;

    try {
      await struggles.save();
    } catch (err) {
      const error = createError(500, "Could not update struggle");
      return next(error);
    }

    res.status(200).json(struggles.toObject({ getters: true }));
  }
};

const createStruggle = async (req, res, next) => {
  const { content, date, uid } = req.body;
  const generatedStruggle = new Struggle({
    content,
    date,
    uid,
  });

  let user;

  try {
    user = await User.findById(uid);
  } catch (err) {
    const error = createError(500, "Creating struggle failed");
    return next(error);
  }

  if (!user) {
    const error = createError("Cound not find user for provided uid");
    return next(error);
  }

  let result = [];
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    result = await generatedStruggle.save({ session: session });
    user.struggles.push(generatedStruggle);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = createError(500, "Creating struggle failed in save");
    return next(error);
  }

  res.json(result);
};

exports.getStruggles = getStruggles;
exports.getStrugglesforUser = getStrugglesforUser;
exports.getStruggleById = getStruggleById;
exports.updateStruggleById = updateStruggleById;
exports.createStruggle = createStruggle;
exports.getStruggleforUserDate = getStruggleforUserDate;
exports.updateOrCreateStruggleForUserAndDate = updateOrCreateStruggleForUserAndDate;
