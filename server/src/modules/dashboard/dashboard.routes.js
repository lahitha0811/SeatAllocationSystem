const express =
  require("express");

const router =
  express.Router();

const {
  getDashboardStats
} = require(
  "./dashboard.controller"
);

router.get(
  "/",
  getDashboardStats
);

module.exports =
  router;