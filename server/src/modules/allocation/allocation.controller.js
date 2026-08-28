const crypto = require("crypto");

const { buildAllocationData } = require("./allocation.service");
const createClassroomMatrices = require("./utils/createClassroomMatrices");
const { allocateGreedy } = require("./engine/greedyAllocator");
const persistAllocation = require("./utils/persistAllocation");
const calculateScore = require("./utils/calculateScore");
const countViolations = require("./utils/countViolations");
const Allocation = require("../../models/Allocation");

const allocationScope = (examDate, session) => ({
  examDate: {
    $gte: examDate,
    $lt: new Date(examDate.getTime() + 24 * 60 * 60 * 1000)
  },
  session
});

const parseExamDate = (value) => {
    if (typeof value !== "string") return null;

    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!match) {
        console.log("Date format validation failed:", value);
        return null;
    }

    const [, year, month, day] = match;

    const date = new Date(
        Date.UTC(
            Number(year),
            Number(month) - 1,
            Number(day)
        )
    );

    if (Number.isNaN(date.getTime())) {
        console.log("Invalid Date object:", value);
        return null;
    }

    // Ensure invalid dates like 2026-02-31 aren't silently accepted
    if (
        date.getUTCFullYear() !== Number(year) ||
        date.getUTCMonth() !== Number(month) - 1 ||
        date.getUTCDate() !== Number(day)
    ) {
        console.log("Invalid calendar date:", value);
        return null;
    }

    return date;
};

const runAllocation = async (req, res) => {
  try {
    const { session = "FN", examDate, limit } = req.body;
//     console.log("=== RUN ALLOCATION ===");
// console.log("req.body:", req.body);
// console.log("examDate:", examDate, typeof examDate);
// console.log("session:", session, typeof session);

const selectedDate = parseExamDate(examDate);

    // console.log("examDate:", examDate, typeof examDate);
    // console.log("selectedDate:", selectedDate);
    // console.log("session valid:", ["FN", "AN"].includes(session));

    if (!["FN", "AN"].includes(session) || !selectedDate) {
      return res.status(400).json({
        success: false,
        message: "A valid examDate (YYYY-MM-DD) and session (FN or AN) are required."
      });
    }

    const { allocationData, classrooms } = await buildAllocationData();
   // console.log("Total allocation data:", allocationData.length);

// console.log(
//     "Available sessions:",
//     [...new Set(allocationData.map(student => student.session))]
// );

// console.log(
//     "Available exam dates:",
//     [...new Set(
//         allocationData.map(student => student.examDate)
//     )]
// );

// console.log(
//     "First 5 students:",
//     allocationData.slice(0, 5)
// );
    const scope = allocationScope(selectedDate, session);

    let students = allocationData.filter((student) =>
      student.session === session &&
      new Date(student.examDate) >= scope.examDate.$gte &&
      new Date(student.examDate) < scope.examDate.$lt
    );

    // A student has one seat per selected exam event. Other dates/sessions
    // were already excluded by the filter above.
    const uniqueStudents = new Map();
    students.forEach((student) => {
      const key = student.hallTicket;
      if (!uniqueStudents.has(key)) uniqueStudents.set(key, student);
    });
    students = [...uniqueStudents.values()];

    if (Number.isInteger(limit) && limit > 0) {
      students = students.slice(0, limit);
    }

    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: "No registered students were found for the selected exam date and session."
      });
    }

    const classroomMatrices = createClassroomMatrices(classrooms);
    const totalSeats = classroomMatrices.reduce(
      (sum, room) => sum + room.matrix.length * room.matrix[0].length,
      0
    );

    const start = Date.now();
    const result = allocateGreedy(classroomMatrices, students);
    const executionTime = Date.now() - start;
    const allocatedStudents = students.length - result.unallocatedStudents.length;
    const runId = crypto.randomUUID();

    // Replace only the selected exam event, never allocations from other runs.
    await Allocation.deleteMany(scope);
    await persistAllocation(classroomMatrices, { allocationRunId: runId });

    const allocations = await Allocation.find({ allocationRunId: runId }).sort({ roomNumber: 1, row: 1, col: 1 });
    const violations = countViolations(classroomMatrices);

    return res.status(result.isComplete ? 200 : 409).json({
      success: result.isComplete,
      complete: result.isComplete,
      message: result.isComplete
        ? "Allocation generated successfully."
        : "Allocation generated, but room capacity was insufficient for every student.",
      algorithm: "greedy-min-conflicts-with-repair",
      allocationRunId: runId,
      examDate,
      session,
      allocatedStudents,
      unallocatedStudents: result.unallocatedStudents.map((student) => ({
        hallTicket: student.hallTicket,
        subjectCode: student.subjectCode
      })),
      totalEligibleStudents: students.length,
      availableSeats: totalSeats,
      occupancy: `${((allocatedStudents / totalSeats) * 100).toFixed(2)}%`,
      score: calculateScore(classroomMatrices),
      violations,
      executionTime: `${executionTime} ms`,
      count: allocations.length,
      allocations
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllocations = async (req, res) => {
  try {
    const filter = {};
    if (req.query.runId) filter.allocationRunId = req.query.runId;

    const allocations = await Allocation.find(filter).sort({ examDate: -1, roomNumber: 1, row: 1, col: 1 });
    return res.status(200).json({ success: true, count: allocations.length, allocations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAvailableExamDates = async (req, res) => {
  try {
    const { allocationData } = await buildAllocationData();
    const dates = new Map();

    allocationData.forEach((student) => {
      const date = new Date(student.examDate);
      if (Number.isNaN(date.getTime())) return;

      const isoDate = date.toISOString().slice(0, 10);
      if (!dates.has(isoDate)) dates.set(isoDate, new Set());
      dates.get(isoDate).add(student.session);
    });

    return res.status(200).json({
      success: true,
      examDates: [...dates.entries()]
        .map(([examDate, sessions]) => ({ examDate, sessions: [...sessions].sort() }))
        .sort((a, b) => a.examDate.localeCompare(b.examDate))
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getRoomAllocations = async (req, res) => {
  try {
    const filter = {
      roomNumber: { $regex: `^${req.params.roomNumber.trim()}$`, $options: "i" }
    };
    if (req.query.runId) filter.allocationRunId = req.query.runId;

    const allocations = await Allocation.find(filter).sort({ row: 1, col: 1 });
    return res.status(200).json({
      success: true,
      roomNumber: req.params.roomNumber,
      count: allocations.length,
      allocations
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const filter = req.query.runId ? { allocationRunId: req.query.runId } : {};
    const allocations = await Allocation.find(filter);
    const branchDistribution = {};

    allocations.forEach((allocation) => {
      branchDistribution[allocation.branch] = (branchDistribution[allocation.branch] || 0) + 1;
    });

    return res.status(200).json({
      success: true,
      totalAllocations: allocations.length,
      roomsUsed: new Set(allocations.map((allocation) => allocation.roomNumber)).size,
      branchDistribution
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { runAllocation, getAllocations, getAvailableExamDates, getRoomAllocations, getAnalytics };
