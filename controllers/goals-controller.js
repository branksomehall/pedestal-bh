const Goal = require("../models/goal");
const createError = require("http-errors");
const mongoose = require("mongoose");
const User = require("../models/user");
const { create } = require("../models/user");

const getGoals = async (req, res, next) => {
  let goals = [];
  try {
    goals = await Goal.find().exec();
  } catch (err) {
    const error = createError(500, "Unable to retrieve goals");
    return next(error);
  }
  res.json({ goals });
};

const getGoalsforUser = async (req, res, next) => {
  let uid = req.params.uid;
  let goals = [];
  try {
    goals = await Goal.find({ uid });
  } catch (err) {
    const error = createError(500, "Failed to fetch goals for this user");
    return next(error);
  }

  if (!goals || goals.length == 0) {
    return next(createError(500, "Could not find any goals for this user"));
  }
  res.json({
    goals: goals.map((goal) => goal.toObject({ getters: true })),
  });
};

const getGoalById = async (req, res, next) => {
  let goal_id = req.params.goal_id;
  let goal;
  try {
    goal = await Goal.findById({ _id: goal_id });
  } catch (err) {
    const error = createError(500, "Unable to fetch goal with ID");
  }

  res.json({ goal });
};

const updateGoalById = async (req, res, next) => {
  const goal_id = req.params.goal_id;
  const { content } = req.body;

  let goal;
  try {
    goal = await Goal.findById(goal_id);
  } catch (err) {
    const error = createError(500, "Could not update goal");
    return next(error);
  }

  goal.content = content;

  try {
    await goal.save();
  } catch (err) {
    const error = createError(500, "Could not update goal");
    return next(error);
  }

  res.status(200).json({ goal: goal.toObject({ getters: true }) });
};

const updateOrCreateGoalForUserAndDate = async (req, res, next) => {
  // find goal
  const uid = req.params.uid;
  const date = req.params.date;
  const { content } = req.body;
  let goals;

  try {
    goals = await Goal.findOne({ uid, date });
  } catch (err) {
    const error = createError(
      500,
      "Fetching goals failed for this user and date"
    );
    return next(error);
  }

  // if there are no goals, create
  if (!goals) {
    const generatedGoal = new Goal({
      content,
      date,
      uid,
    });
    let user;

    try {
      user = await User.findById(uid);
    } catch (err) {
      const error = createError(500, "Creating goal failed");
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
      result = await generatedGoal.save({ session: session });
      user.goals.push(generatedGoal);
      await user.save({ session: session });
      await session.commitTransaction();
    } catch (err) {
      const error = createError(500, "Creating goal failed in save");
      return next(error);
    }

    res.json(result);
  } else {
    goals.content = content;

    try {
      await goals.save();
    } catch (err) {
      const error = createError(500, "Could not update goal");
      return next(error);
    }

    res.status(200).json(goals.toObject({ getters: true }));
  }
};

const getGoalforUserDate = async (req, res, next) => {
  const uid = req.params.uid;
  const date = req.params.date;
  let goals;
  try {
    goals = await Goal.findOne({ uid, date });
  } catch (err) {
    const error = createError(
      500,
      "Fetching negative thoughts failed for this user and date"
    );
    return next(error);
  }

  if (!goals) {
    const error = createError(500, "No goals for this user and date");
    return next(error);
  }

  res.json(goals);
};

const createGoal = async (req, res, next) => {
  const { content, date, uid } = req.body;
  const generatedGoal = new Goal({
    content,
    date,
    uid,
  });

  let user;

  try {
    user = await User.findById(uid);
  } catch (err) {
    const error = createError(500, "Creating goal failed");
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
    result = await generatedGoal.save({ session: session });
    user.goals.push(generatedGoal);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = createError(500, "Creating goal failed in save");
    return next(error);
  }

  res.json(result);
};

exports.getGoals = getGoals;
exports.getGoalsforUser = getGoalsforUser;
exports.getGoalById = getGoalById;
exports.updateGoalById = updateGoalById;
exports.createGoal = createGoal;
exports.updateOrCreateGoalForUserAndDate = updateOrCreateGoalForUserAndDate;
exports.getGoalforUserDate = getGoalforUserDate;
