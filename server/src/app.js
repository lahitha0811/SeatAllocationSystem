const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/auth.routes");

const roomRoutes = require("./modules/rooms/room.routes");

const reservationRoutes = require(
  "./modules/reservations/reservation.routes"
);
const allocationRoutes =
  require(
    "./modules/allocation/allocation.routes"
  );

const app = express();
const sendMail = require("./modules/allocation/utils/sendMail");
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://seat-allocation-system-snowy.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/rooms", roomRoutes);

app.use(
  "/api/allocations",
  allocationRoutes
);

app.get("/send-test-mail", async (req, res) => {
  try {
    await sendMail(
      "lahithav@gmail.com",
      "Test Mail",
      "Mail working successfully"
    );

    res.send("Mail sent");
  } catch (error) {
    console.log(error);

    res.send("Mail failed");
  }
});

app.use(
  "/api/reservations",
  reservationRoutes
);

app.get("/", (req, res) => {
  res.send("API running...");
});

module.exports = app;