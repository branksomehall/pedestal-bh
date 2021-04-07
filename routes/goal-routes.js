const express = require("express");
const router = express.Router();

const controller = require("../controllers/goals-controller");

router.get("/goals", controller.getGoals);

router.get("/goals/user/:uid", controller.getGoalsforUser);

router.get("/goals/:goal_id", controller.getGoalById);

router.get("/goals/user/:uid/date/:date", controller.getGoalforUserDate);

router.patch("/goals/:goal_id", controller.updateGoalById);

router.post("/goals", controller.createGoal);

router.put(
  "/goals/user/:uid/date/:date",
  controller.updateOrCreateGoalForUserAndDate
);

module.exports = router;
