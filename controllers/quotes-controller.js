const Quote = require("../models/quote");
const createError = require("http-errors");
const mongoose = require("mongoose");
const User = require("../models/user");
const { create } = require("../models/user");

const getQuotes = async (req, res, next) => {
  let quotes = [];
  try {
    quotes = await Quote.find().exec();
  } catch (err) {
    const error = createError(500, "Unable to retrieve quotes");
    return next(error);
  }
  res.json({ quotes });
};

const getQuotesforUser = async (req, res, next) => {
  let uid = req.params.uid;
  let quotes = [];
  try {
    quotes = await Quote.find({ uid });
  } catch (err) {
    const error = createError(500, "Failed to fetch quotes for this user");
    return next(error);
  }

  if (!quotes || quotes.length == 0) {
    return next(createError(500, "Could not find any quotes for this user"));
  }
  res.json({
    quotes: quotes.map((quote) => quote.toObject({ getters: true })),
  });
};

const getQuoteById = async (req, res, next) => {
  let quote_id = req.params.quote_id;
  let quote;
  try {
    quote = await Quote.findById({ _id: quote_id });
  } catch (err) {
    const error = createError(500, "Unable to fetch quote with ID");
  }

  res.json({ quote });
};

const updateQuoteById = async (req, res, next) => {
  const quote_id = req.params.quote_id;
  const { content } = req.body;

  let quote;
  try {
    quote = await Quote.findById(quote_id);
  } catch (err) {
    const error = createError(500, "Could not update quote");
    return next(error);
  }

  quote.content = content;

  try {
    await quote.save();
  } catch (err) {
    const error = createError(500, "Could not update quote");
    return next(error);
  }

  res.status(200).json({ quote: quote.toObject({ getters: true }) });
};

const createQuote = async (req, res, next) => {
  const { content, date, uid } = req.body;
  const generatedQuote = new Quote({
    content,
    date,
    uid,
  });

  let user;

  try {
    user = await User.findById(uid);
  } catch (err) {
    const error = createError(500, "Creating quote failed");
    return next(error);
  }

  if (!user) {
    const error = createError(500, "Cound not find user for provided uid");
    return next(error);
  }

  let result = [];
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    result = await generatedQuote.save({ session: session });
    user.quotes.push(generatedQuote);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = createError(500, "Creating quote failed in save");
    return next(error);
  }

  res.json(result);
};

exports.getQuotes = getQuotes;
exports.getQuotesforUser = getQuotesforUser;
exports.getQuoteById = getQuoteById;
exports.updateQuoteById = updateQuoteById;
exports.createQuote = createQuote;
