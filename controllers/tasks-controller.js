const Task = require("../models/task");
const createError = require("http-errors");
const mongoose = require("mongoose");
const User = require("../models/user");

const createTask = async (req, res, next) => {
  console.log("Creating task...");
  const { task_name, date, uid } = req.body;
  const createdTask = new Task({
    task_name,
    date,
    uid,
  });

  // Check is the user id exists
  let user;
  try {
    user = await User.findById(uid);
  } catch (err) {
    const error = createError(500, "Creating task failed");
    return next(error);
  }

  if (!user) {
    const error = createError(404, "Could not find user for provided id");
    return next(error);
  }

  let result = [];
  try {
    // change document only if everything works using sessions and transactions
    const session = await mongoose.startSession();
    session.startTransaction();
    result = await createdTask.save({ session: session });
    user.tasks.push(createdTask); // mongoose push method - NOT array push; only adds the id
    await user.save({ session: session });
    await session.commitTransaction(); // only at this session do these tasks get executed
  } catch (err) {
    const error = createError(500, "Creating task failed");
    return next(error);
  }

  res.status(201).json(result);
};

const getTasks = async (req, res, next) => {
  let tasks = [];
  try {
    tasks = await Task.find().exec(); //exec turns it into a promise
  } catch (err) {
    const error = createError(500, "Unable to retrieve tasks");
    return next(error);
  }

  res.json({ tasks });
};

const getTasksforUser = async (req, res, next) => {
  const uid = req.params.uid;
  let tasks = [];
  try {
    tasks = await Task.find({ uid });
  } catch (err) {
    const error = createError(500, "Fetching tasks failed for this user");
    return next(error);
  }

  if (!tasks || tasks.length === 0) {
    return next(
      createError(404, "Could not find tasks for the provided user id.")
    );
  }
  res.json({ tasks: tasks.map((task) => task.toObject({ getters: true })) });
};

const getTaskById = async (req, res, next) => {
  const task_id = req.params.task_id;
  let task;
  try {
    task = await Task.find({ _id: task_id });
  } catch (err) {
    const error = createError(500, "Unable to fetch task with id");
    return next(error);
  }

  res.json({ task });
};

const getTasksforUserDate = async (req, res, next) => {
  const uid = req.params.uid;
  const date = req.params.date;
  let tasks;
  try {
    tasks = await Task.find({ uid, date });
  } catch (err) {
    const error = createError(
      500,
      "Fetching tasks failed for this user and date"
    );
    return next(error);
  }
  res.json({ tasks: tasks.map((task) => task.toObject({ getters: true })) });
};

const updateTaskCompletionById = async (req, res, next) => {
  const task_id = req.params.task_id;
  const { isCompleted } = req.body;
  let task;
  try {
    task = await Task.findById(task_id);
  } catch (err) {
    const error = createError(500, "Could not update task");
    return next(error);
  }

  // check if the user id from the access token provided is the same user trying to update the task
  if (task.uid.toString() !== req.userData.uid) {
    console.log(task.uid.toString());
    console.log(req.userData.uid);
    const error = createError(401, "You are not allowed to edit this task");
    return next(error);
  }

  task.isCompleted = isCompleted;
  task.completedOn = Date.now();

  try {
    await task.save();
  } catch (err) {
    const error = createError(500, "Could not update task.");
    return next(error);
  }

  res.status(200).json({ task: task.toObject({ getters: true }) });
};

const deleteTaskById = async (req, res, next) => {
  const task_id = req.params.task_id;

  let task;
  try {
    task = await Task.findById(task_id).populate("uid"); // populate only works if relationship exists in model
  } catch (err) {
    const error = createError(500, "Could not find task");
    return next(error);
  }

  console.log(task);

  if (!task) {
    const error = createError(404, "Could not find task with this id");
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await task.remove({ session: session });
    task.uid.tasks.pull(task);
    await task.uid.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = createError(500, "Could not delete task");
    return next(error);
  }

  res.status(200).json({ status: "success", message: "Deleted task" });
};

exports.createTask = createTask;
exports.getTasks = getTasks;
exports.getTasksforUser = getTasksforUser;
exports.getTasksforUserDate = getTasksforUserDate;
exports.updateTaskCompletionById = updateTaskCompletionById;
exports.deleteTaskById = deleteTaskById;
exports.getTaskById = getTaskById;
