const express =
  require("express");

const router =
  express.Router();

const {

  runAllocation,

  getAllocations,

  getAvailableExamDates,

  getRoomAllocations,
  getAnalytics

} = require(
  "./allocation.controller"
);

const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

/* ---------------- RUN ALLOCATION ---------------- */

router.post(
  "/run",
  authMiddleware,
  roleMiddleware("admin"),
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

router.get(
  "/exam-dates",
  getAvailableExamDates
);

/* ---------------- ROOMWISE ---------------- */

router.get(
  "/:roomNumber",
  getRoomAllocations
);

module.exports =
  router;
