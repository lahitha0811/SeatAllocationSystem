const express = require("express");

const {
  createRoom,
  getRooms
} = require("./room.controller");

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
  getRooms
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createRoom
);

module.exports = router;