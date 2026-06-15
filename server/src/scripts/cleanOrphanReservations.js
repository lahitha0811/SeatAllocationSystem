require("dotenv").config();
const mongoose = require("mongoose");
const Reservation = require("../modules/reservations/reservation.model");
const Classroom = require("../../models/Classroom");
const User = require("../modules/auth/auth.model");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const main = async () => {
  await connectDB();

  const reservations = await Reservation.find().lean();
  const roomIds = [
    ...new Set(
      reservations
        .filter((reservation) => reservation.roomId)
        .map((reservation) => reservation.roomId.toString())
    )
  ];
  const userIds = [
    ...new Set(
      reservations
        .filter((reservation) => reservation.reservedBy)
        .map((reservation) => reservation.reservedBy.toString())
    )
  ];

  const existingRooms = await Classroom.find(
    { _id: { $in: roomIds } },
    { _id: 1 }
  ).lean();
  const existingUsers = await User.find(
    { _id: { $in: userIds } },
    { _id: 1 }
  ).lean();

  const existingRoomIds = new Set(
    existingRooms.map((room) => room._id.toString())
  );
  const existingUserIds = new Set(
    existingUsers.map((user) => user._id.toString())
  );

  const orphanReservations = reservations.filter((reservation) => {
    const roomId = reservation.roomId?.toString();
    const userId = reservation.reservedBy?.toString();

    return (
      (roomId && !existingRoomIds.has(roomId)) ||
      (userId && !existingUserIds.has(userId))
    );
  });

  console.log(`Found ${orphanReservations.length} orphaned reservation(s)`);
  orphanReservations.forEach((reservation) => {
    console.log(
      `- ${reservation._id.toString()} roomId=${reservation.roomId} reservedBy=${reservation.reservedBy}`
    );
  });

  if (orphanReservations.length === 0) {
    console.log("No orphaned reservations to remove.");
    await mongoose.disconnect();
    return;
  }

  if (process.argv.includes("--delete")) {
    const orphanIds = orphanReservations.map((reservation) => reservation._id);
    const result = await Reservation.deleteMany({ _id: { $in: orphanIds } });
    console.log(`Deleted ${result.deletedCount} orphaned reservation(s).`);
  } else {
    console.log(
      "Dry run only. Re-run with --delete to remove orphaned reservations."
    );
  }

  await mongoose.disconnect();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
