const express = require("express");
const router = express.Router();

const controller = require("../controllers/tasks-controller");

// Block to protect subsequent routes
router.get("/tasks", controller.getTasks);

router.get("/tasks/user/:uid", controller.getTasksforUser);

router.get("/tasks/user/:uid/date/:date", controller.getTasksforUserDate);

router.get("/tasks/:task_id", controller.getTaskById);

router.post("/tasks", controller.createTask);

router.patch("/tasks/:task_id", controller.updateTaskCompletionById);

router.delete("/tasks/:task_id", controller.deleteTaskById);

module.exports = router;
