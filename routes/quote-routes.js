const express = require("express");
const router = express.Router();

const controller = require("../controllers/quotes-controller");

router.get("/quotes", controller.getQuotes);

router.get("/quotes/user/:uid", controller.getQuotesforUser);

router.get("/quotes/:quote_id", controller.getQuoteById);

router.patch("/quotes/:quote_id", controller.updateQuoteById);

router.post("/quotes", controller.createQuote);

module.exports = router;
