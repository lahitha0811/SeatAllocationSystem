const {
  createReservationService,
  getReservationsService,
  approveReservationService,
  rejectReservationService
} = require("./reservation.service");

const createReservation = async (
  req,
  res
) => {
  try {
    console.log("[ReservationController] createReservation req.body:", req.body);

    const reservation =
      await createReservationService({
        ...req.body,
        reservedBy:
          req.user?.id || req.body.reservedBy
      });

    console.log("[ReservationController] created reservation:", reservation);

    res.status(201).json({
      success: true,
      reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getReservations = async (
  req,
  res
) => {
  try {
    const reservations =
      await getReservationsService();

    res.json({
      success: true,
      reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const approveReservation = async (
  req,
  res
) => {
  try {
    const reservation =
      await approveReservationService(
        req.params.id
      );

    res.json({
      success: true,
      reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const rejectReservation = async (
  req,
  res
) => {
  try {
    const reservation =
      await rejectReservationService(
        req.params.id
      );

    res.json({
      success: true,
      reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createReservation,
  getReservations,
  approveReservation,
  rejectReservation
};