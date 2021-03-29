const Proud = require("../models/proud");
const createError = require("http-errors");
const mongoose = require("mongoose");
const User = require("../models/user");
const { create } = require("../models/user");

const getProuds = async (req, res, next) => {
  let prouds = [];
  try {
    prouds = await Proud.find().exec();
  } catch (err) {
    const error = createError(500, "Unable to retrieve prouds");
    return next(error);
  }
  res.json({ prouds });
};

const getProudsforUser = async (req, res, next) => {
  let uid = req.params.uid;
  let prouds = [];
  try {
    prouds = await Proud.find({ uid });
  } catch (err) {
    const error = createError(500, "Failed to fetch prouds for this user");
    return next(error);
  }

  if (!prouds || prouds.length == 0) {
    return next(createError(500, "Could not find any prouds for this user"));
  }
  res.json({
    prouds: prouds.map((proud) => proud.toObject({ getters: true })),
  });
};

const getProudById = async (req, res, next) => {
  let proud_id = req.params.proud_id;
  let proud;
  try {
    proud = await Proud.findById({ _id: proud_id });
  } catch (err) {
    const error = createError(500, "Unable to fetch proud with ID");
  }

  res.json({ proud });
};

const updateProudById = async (req, res, next) => {
  const proud_id = req.params.proud_id;
  const { content } = req.body;

  let proud;
  try {
    proud = await Proud.findById(proud_id);
  } catch (err) {
    const error = createError(500, "Could not update proud");
    return next(error);
  }

  proud.content = content;

  try {
    await proud.save();
  } catch (err) {
    const error = createError(500, "Could not update proud");
    return next(error);
  }

  res.status(200).json({ proud: proud.toObject({ getters: true }) });
};

const createProud = async (req, res, next) => {
  const { content, date, uid } = req.body;
  const generatedProud = new Proud({
    content,
    date,
    uid,
  });

  let user;

  try {
    user = await User.findById(uid);
  } catch (err) {
    const error = createError(500, "Creating proud failed");
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
    result = await generatedProud.save({ session: session });
    user.prouds.push(generatedProud);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = createError(500, "Creating proud failed in save");
    return next(error);
  }

  res.json(result);
};

exports.getProuds = getProuds;
exports.getProudsforUser = getProudsforUser;
exports.getProudById = getProudById;
exports.updateProudById = updateProudById;
exports.createProud = createProud;
