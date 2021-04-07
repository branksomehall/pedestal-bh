const createError = require("http-errors");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const RefreshToken = require("../models/refresh_token");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const expires_in = 900000; // 900k ms = 15 min.

const createUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = createError(
      400,
      "Invalid inputs passed, please check your data"
    );
    return next(error);
  }

  const { first_name, last_name, email, password, user_class } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = createError(
      500,
      "Signing up failed, please try again later."
    );
  }

  if (existingUser) {
    const error = createError(
      422,
      "User exists already, please login instead."
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = createError(500, "Could not create user, please try again");
    return next(error);
  }

  const createdUser = new User({
    first_name,
    last_name,
    email,
    password: hashedPassword,
    user_class,
    tasks: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = createError(500, "Signing up failed, please try again");
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { uid: createdUser.id, email: createdUser.email },
      process.env.SERVER_KEY,
      { expiresIn: "24h" }
    );
  } catch (err) {
    const error = createError(
      500,
      "Signing up failed, please try again - failed"
    );
    return next(error);
  }

  res.status(201).json({
    user: createdUser.id,
    email: createdUser.email,
    token: token,
  });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = createError(500, "Loggin in failed, please try again later.");
    return next(error);
  }

  if (!existingUser) {
    const error = createError(
      403,
      "Invalid credentials, could not log you in."
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = create(
      500,
      "Could not log you in, please check your credentials and try again"
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = createError(
      500,
      "Logging in failed, please try again later."
    );
    return next(error);
  }

  let token;
  let refresh_token;
  try {
    token = generateAccessToken({
      uid: existingUser.id,
      email: existingUser.email,
    });
    refresh_token = jwt.sign(
      { uid: existingUser.id, email: existingUser.email },
      process.env.REFRESH_TOKEN_SECRET
    );

    const generatedRefreshToken = new RefreshToken({
      uid: existingUser.id,
      refresh_token,
    });

    await generatedRefreshToken.save();
  } catch (err) {
    const error = createError(500, "Logging in failed, please try again");
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    user_class: existingUser.user_class,
    expires_in,
    token,
    refresh_token,
  });
};

const updateToken = async (req, res, next) => {
  const { refresh_token, uid } = req.body;

  if (refresh_token === null) {
    const error = createError(401, "Logging in failed, please try again");
    return next(error);
  }
  // find refresh token if it exists
  try {
    await RefreshToken.findOne({ refresh_token });
  } catch (err) {
    const error = createError(403, "Invalid token - coudn't find it on list");
    return next(error);
  }

  jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      const error = createError(403, "Invalid token");
      return next(error);
    }
    const accessToken = generateAccessToken({
      uid: user.uid,
      email: user.email,
    });
    res.json({ token: accessToken });
  });
};

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); //return everything except password
  } catch (err) {
    const error = creatError(500, "Unable to retrieve users");
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

// DELETE TOKEN ON LOGOUT

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.SERVER_KEY, { expiresIn: "15m" });
};

exports.createUser = createUser;
exports.loginUser = loginUser;
exports.getUsers = getUsers;
exports.updateToken = updateToken;
