const express = require("express");
const router = express.Router();

const controller = require("../controllers/prouds-controller");

router.get("/prouds", controller.getProuds);

router.get("/prouds/user/:uid", controller.getProudsforUser);

router.get("/prouds/:proud_id", controller.getProudById);

router.patch("/prouds/:proud_id", controller.updateProudById);

router.post("/prouds", controller.createProud);

module.exports = router;
