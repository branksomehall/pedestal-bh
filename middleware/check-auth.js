const createError = require("http-errors");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Ensures that options request is not blocked
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      const error = createError(401, "Authentication failed!");
      return next(error);
    }

    // pull the info from the verified token
    const decodedToken = jwt.verify(token, process.env.SERVER_KEY);
    req.userData = { uid: decodedToken.uid };
    next();
  } catch (err) {
    throw new Error("Authentication failed!");
  }
};
