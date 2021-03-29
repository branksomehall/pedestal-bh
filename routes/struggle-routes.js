const express = require("express");
const router = express.Router();

const controller = require("../controllers/struggles-controller");

router.get("/struggles", controller.getStruggles);

router.get("/struggles/user/:uid", controller.getStrugglesforUser);

router.get("/struggles/:struggle_id", controller.getStruggleById);

router.patch("/struggles/:struggle_id", controller.updateStruggleById);

router.post("/struggles", controller.createStruggle);

module.exports = router;
