const express = require("express");
const router = express.Router();

const controller = require("../controllers/consequences-controller");

router.get("/consequences", controller.getConsequences);

router.get("/consequences/user/:uid", controller.getConsequencesforUser);

router.get("/consequences/:consequence_id", controller.getConsequenceById);

router.patch("/consequences/:consequence_id", controller.updateConsequenceById);

router.post("/consequences", controller.createConsequence);

module.exports = router;
