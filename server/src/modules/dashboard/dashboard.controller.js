const Classroom =
  require("../../models/Classroom");

const Allocation =
  require("../../models/Allocation");

const Reservation =
  require("../reservations/reservation.model");

const getDashboardStats =
  async (req, res) => {

    try {

      const totalRooms =
        await Classroom.countDocuments();

      const totalAllocations =
        await Allocation.countDocuments();

      const totalReservations =
        await Reservation.countDocuments();

      const allocations =
        await Allocation.find();

      let score = 0;

      allocations.forEach(a => {

        allocations.forEach(b => {

          if (
            a._id.toString() !==
            b._id.toString()
          ) {

            if (
              a.branch !==
              b.branch
            ) {

              score++;
            }
          }
        });

      });

      res.status(200).json({

        success: true,

        totalRooms,

        totalAllocations,

        totalReservations,

        allocationScore:
          Math.floor(score / 2)

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message

      });
    }
  };

module.exports = {
  getDashboardStats
};