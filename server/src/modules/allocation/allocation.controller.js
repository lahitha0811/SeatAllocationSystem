const {
  buildAllocationData
} = require(
  "./allocation.service"
);

const createClassroomMatrices =
  require(
    "./utils/createClassroomMatrices"
  );

const backtrackingAllocate =
  require(
    "./engine/backtrackingAllocator"
  );

const sortStudentsByConstraint =
  require(
    "./utils/sortStudentsByConstraint"
  );

const persistAllocation =
  require(
    "./utils/persistAllocation"
  );

const calculateScore =
  require(
    "./utils/calculateScore"
  );

const countViolations =
  require(
    "./utils/countViolations"
  );

const Allocation =
  require(
    "../../models/Allocation"
  );

const runAllocation =
  async (req, res) => {

    try {

      const {
        session = "FN",
        limit = 150
      } = req.body;

      /* ---------------- FETCH DATA ---------------- */

      const {
        allocationData,
        classrooms
      } =
        await buildAllocationData();

      // console.log(
      //   "AllocationData built:",
      //   allocationData.length
      // );

      /* ---------------- FILTER SESSION ---------------- */

      let students =
        allocationData.filter(
          (student) =>
            student.session ===
            session
        );

      const totalSessionStudents =
        students.length;

      // console.log(
      //   "Session requested:",
      //   session
      // );

      // console.log(
      //   "Students after filtering:",
      //   students.length
      // );

      /* ---------------- REMOVE DUPLICATES ---------------- */

      const uniqueStudentsMap =
        {};

      students.forEach(
        (student) => {

          if (
            !uniqueStudentsMap[
              student.hallTicket
            ]
          ) {

            uniqueStudentsMap[
              student.hallTicket
            ] = student;
          }
        }
      );

      students =
        Object.values(
          uniqueStudentsMap
        );

      /* ---------------- LIMIT ---------------- */

      students =
        students.slice(
          0,
          limit
        );

      /* ---------------- SORT ---------------- */

      students =
        sortStudentsByConstraint(
          students
        );

      /* ---------------- CREATE MATRICES ---------------- */

      const classroomMatrices =
        createClassroomMatrices(
          classrooms
        );

      /* ---------------- ALLOCATE ---------------- */

      const start =
        Date.now();

      const success =
        backtrackingAllocate(
          classroomMatrices,
          students
        );

      const end =
        Date.now();

      if (!success) {

        return res.status(400).json({

          success: false,

          message:
            "Allocation failed"
        });
      }

      /* ---------------- SAVE ---------------- */

      await Allocation.deleteMany({});

      await persistAllocation(
        classroomMatrices
      );

      /* ---------------- METRICS ---------------- */

      const score =
        calculateScore(
          classroomMatrices
        );

      const violations =
        countViolations(
          classroomMatrices
        );

      const totalSeats =
        classroomMatrices.reduce(

          (sum, room) =>

            sum +
            room.matrix.length *
            room.matrix[0].length,

          0
        );

      const occupancy =
        (
          students.length /
          totalSeats
        ) * 100;

      const coverage =
        (
          students.length /
          totalSessionStudents
        ) * 100;

      // console.log(
      //   "Occupancy:",
      //   occupancy.toFixed(2) + "%"
      // );

      // console.log(
      //   "Coverage:",
      //   coverage.toFixed(2) + "%"
      // );

      // console.log(
      //   "Allocation Score:",
      //   score
      // );

      // console.log(
      //   "Violations:",
      //   violations
      // );

      /* ---------------- FETCH SAVED ---------------- */

      const allocations =
        await Allocation.find();

      return res.status(200).json({

        success: true,

        allocatedStudents:
          students.length,

        totalSessionStudents,

        availableSeats:
          totalSeats,

        occupancy:
          occupancy.toFixed(2) + "%",

        coverage:
          coverage.toFixed(2) + "%",

        score,

        violations,

        executionTime:
          `${end - start} ms`,

        count:
          allocations.length,

        allocations
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({

        success: false,

        message:
          error.message
      });
    }
  };

const getAllocations =
  async (req, res) => {

    try {

      const allocations =
        await Allocation.find();

      return res.status(200).json({

        success: true,

        count:
          allocations.length,

        allocations
      });

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          error.message
      });
    }
  };

const getRoomAllocations =
  async (req, res) => {

    try {

      const {
        roomNumber
      } = req.params;

      const allocations =
        await Allocation.find({

          roomNumber: {

            $regex:
              `^${roomNumber.trim()}$`,

            $options: "i"
          }
        });

      return res.status(200).json({

        success: true,

        roomNumber,

        count:
          allocations.length,

        allocations
      });

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          error.message
      });
    }
  };

  const getAnalytics =
  async (req, res) => {

    try {

      const allocations =
        await Allocation.find();

      const roomsUsed =
        [
          ...new Set(
            allocations.map(
              a => a.roomNumber
            )
          )
        ].length;

      const branchDistribution =
        {};

      allocations.forEach(
        allocation => {

          branchDistribution[
            allocation.branch
          ] =

            (
              branchDistribution[
                allocation.branch
              ] || 0
            ) + 1;
        }
      );

      return res.status(200).json({

        success: true,

        totalAllocations:
          allocations.length,

        roomsUsed,

        branchDistribution
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

  runAllocation,
  

  getAllocations,

  getRoomAllocations,

  getAnalytics
};