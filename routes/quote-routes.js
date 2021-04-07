const express = require("express");
const router = express.Router();

const controller = require("../controllers/quotes-controller");

router.get("/quotes", controller.getQuotes);

router.get("/quotes/user/:uid", controller.getQuotesforUser);

router.get("/quotes/:quote_id", controller.getQuoteById);

router.get("/quotes/user/:uid/date/:date", controller.getQuoteforUserDate);

router.get("/quotes/user/:uid/date/:date", controller.getQuoteforUserDate);

router.patch("/quotes/:quote_id", controller.updateQuoteById);

router.post("/quotes", controller.createQuote);
router.put(
  "/quotes/user/:uid/date/:date",
  controller.updateOrCreateQuoteForUserAndDate
);
module.exports = router;
