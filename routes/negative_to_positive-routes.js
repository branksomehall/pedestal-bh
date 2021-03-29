const express = require("express");
const router = express.Router();

const controller = require("../controllers/negative_to_positives-controller");

router.get("/negative_to_positives", controller.getNegativeToPositives);

router.get(
  "/negative_to_positives/user/:uid",
  controller.getNegativeToPositivesforUser
);

router.get(
  "/negative_to_positives/:negative_to_positive_id",
  controller.getNegativeToPositiveById
);

router.patch(
  "/negative_to_positives/:negative_to_positive_id",
  controller.updateNegativeToPositiveById
);

router.post("/negative_to_positives", controller.createNegativeToPositive);

module.exports = router;
