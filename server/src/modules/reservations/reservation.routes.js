const express = require("express");

const {
  createReservation,
  getReservations,
  approveReservation,
  rejectReservation
} = require("./reservation.controller");

const authMiddleware = require(
  "../../middleware/auth.middleware"
);

const roleMiddleware = require(
  "../../middleware/role.middleware"
);

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getReservations
);

router.post(
  "/",
  authMiddleware,
  createReservation
);

router.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("admin"),
  approveReservation
);

router.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("admin"),
  rejectReservation
);

module.exports = router;