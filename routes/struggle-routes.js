const express = require("express");
const router = express.Router();

const controller = require("../controllers/struggles-controller");

router.get("/struggles", controller.getStruggles);

router.get("/struggles/user/:uid", controller.getStrugglesforUser);

router.get("/struggles/:struggle_id", controller.getStruggleById);

router.get(
  "/struggles/user/:uid/date/:date",
  controller.getStruggleforUserDate
);

router.patch("/struggles/:struggle_id", controller.updateStruggleById);

router.post("/struggles", controller.createStruggle);
router.put(
  "/struggles/user/:uid/date/:date",
  controller.updateOrCreateStruggleForUserAndDate
);
module.exports = router;
