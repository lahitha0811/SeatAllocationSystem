const Reservation = require("./reservation.model");
const Classroom = require("../../models/Classroom");
const User = require("../auth/auth.model");

const createReservationService = async (
  data
) => {
  console.log("[ReservationService] createReservationService data:", data);
   console.log("NEW RESERVATION DATA:");
  console.log(data);

  if (!data.roomId) {
    throw new Error("roomId is required");
  }

  if (!data.reservedBy) {
    throw new Error("reservedBy is required");
  }

  const classroomExists = await Classroom.exists({
    _id: data.roomId
  });

  if (!classroomExists) {
    throw new Error("Invalid roomId: referenced classroom does not exist");
  }

  const userExists = await User.exists({
    _id: data.reservedBy
  });

  if (!userExists) {
    throw new Error("Invalid reservedBy: referenced user does not exist");
  }

  const existingReservation =
  await Reservation.findOne({
    roomId: data.roomId,
    startTime: {
      $lt: new Date(data.endTime)
    },

    endTime: {
      $gt: new Date(data.startTime)
    }
  });

  if (existingReservation) {
    throw new Error(
      "Room already booked for this time slot"
    );
  }

  console.log("[ReservationService] Reservation.create payload:", data);

  const reservation =
    await Reservation.create(data);

  return reservation;
};

const getReservationsService = async () => {
  console.log("[ReservationService] getReservationsService: retrieving reservations with room/user populate");
  return await Reservation.find()
    .populate("roomId")
    .populate("reservedBy");
};

const approveReservationService = async (
  reservationId
) => {
  const reservation =
    await Reservation.findByIdAndUpdate(
      reservationId,
      {
        status: "approved"
      },
      {
        new: true
      }
    );

  return reservation;
};

const rejectReservationService = async (
  reservationId
) => {
  const reservation =
    await Reservation.findByIdAndUpdate(
      reservationId,
      {
        status: "rejected"
      },
      {
        new: true
      }
    );

  return reservation;
};

module.exports = {
  createReservationService,
  getReservationsService,
  approveReservationService,
  rejectReservationService
};