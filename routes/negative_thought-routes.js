const express = require("express");
const router = express.Router();

const controller = require("../controllers/negative_thoughts-controller");

router.get("/negative_thoughts", controller.getNegativeThoughts);

router.get(
  "/negative_thoughts/user/:uid",
  controller.getNegativeThoughtsforUser
);

router.get(
  "/negative_thoughts/:negative_thought_id",
  controller.getNegativeThoughtById
);

router.patch(
  "/negative_thoughts/:negative_thought_id",
  controller.updateNegativeThoughtById
);

router.post("/negative_thoughts", controller.createNegativeThought);

module.exports = router;
