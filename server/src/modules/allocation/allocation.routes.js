const express =
  require("express");

const router =
  express.Router();

const {

  runAllocation,

  getAllocations,

  getRoomAllocations,
  getAnalytics

} = require(
  "./allocation.controller"
);

/* ---------------- RUN ALLOCATION ---------------- */

router.post(
  "/run",
  runAllocation
);

/* ---------------- GET ALL ---------------- */

router.get(
  "/",
  getAllocations
);

router.get(
  "/analytics",
  getAnalytics
);

/* ---------------- ROOMWISE ---------------- */

router.get(
  "/:roomNumber",
  getRoomAllocations
);

module.exports =
  router;