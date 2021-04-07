const express = require("express");
const router = express.Router();

const controller = require("../controllers/prouds-controller");

router.get("/prouds", controller.getProuds);

router.get("/prouds/user/:uid", controller.getProudsforUser);

router.get("/prouds/:proud_id", controller.getProudById);

router.get("/prouds/user/:uid/date/:date", controller.getProudforUserDate);

router.patch("/prouds/:proud_id", controller.updateProudById);

router.post("/prouds", controller.createProud);

router.put(
  "/prouds/user/:uid/date/:date",
  controller.updateOrCreateProudForUserAndDate
);
module.exports = router;
