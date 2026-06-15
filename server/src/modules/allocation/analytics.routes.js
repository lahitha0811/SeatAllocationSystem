const express =
  require("express");

const router =
  express.Router();

const {
  getAnalytics
} = require(
  "./analytics.controller"
);

router.get(
  "/",
  getAnalytics
);

module.exports =
  router;