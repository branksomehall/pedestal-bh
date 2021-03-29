const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const controller = require("../controllers/users-controller");

router.post(
  "/signup",
  [
    check("first_name").not().isEmpty(),
    check("last_name").not().isEmpty(),
    check("email").not().isEmpty(),
    check("password").isLength({ min: 6 }),
  ],
  controller.createUser
);

router.post(
  "/login",
  [check("email").not().isEmpty(), check("password").not().isEmpty()],
  controller.loginUser
);

router.get("/", controller.getUsers);

module.exports = router;
