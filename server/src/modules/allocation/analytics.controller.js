const Allocation =
  require("../../models/Allocation");

const getAnalytics =
  async (req, res) => {

    try {

      const allocations =
        await Allocation.find();

      const totalAllocated =
        allocations.length;

      /* ---------------- BRANCH COUNTS ---------------- */

      const branchStats = {};

      allocations.forEach(
        allocation => {

          branchStats[
            allocation.branch
          ] =

            (
              branchStats[
                allocation.branch
              ] || 0
            ) + 1;
        }
      );

      /* ---------------- ROOM COUNTS ---------------- */

      const roomStats = {};

      allocations.forEach(
        allocation => {

          roomStats[
            allocation.roomNumber
          ] =

            (
              roomStats[
                allocation.roomNumber
              ] || 0
            ) + 1;
        }
      );

      /* ---------------- SCORE ---------------- */

      /* ---------------- SCORE ---------------- */

let score = 0;

const roomWise = {};

allocations.forEach(allocation => {

  if (!roomWise[allocation.roomNumber]) {

    roomWise[allocation.roomNumber] = [];
  }

  roomWise[allocation.roomNumber]
    .push(allocation);
});

Object.values(roomWise)
  .forEach(room => {

    room.forEach(student => {

      const directions = [

        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1]
      ];

      directions.forEach(
        ([dx, dy]) => {

          const neighbor =
            room.find(

              s =>
                s.row ===
                  student.row + dx &&
                s.col ===
                  student.col + dy
            );

          if (
            neighbor &&
            neighbor.branch !==
              student.branch
          ) {

            score++;
          }
        }
      );
    });
  });

      return res.status(200).json({

        success: true,

        totalAllocated,

        allocationScore:
          score,

        branchStats,

        roomStats
      });

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          error.message
      });
    }
  };

module.exports = {
  getAnalytics
};