const assert = require("assert");
const { allocateGreedy, conflictScore } = require("./greedyAllocator");

const classrooms = [
  {
    roomNumber: "A101",
    matrix: [[null, null], [null, null]]
  }
];

const students = [
  { hallTicket: "1", branch: "CSE", subjectCode: "CS101" },
  { hallTicket: "2", branch: "ECE", subjectCode: "EC101" },
  { hallTicket: "3", branch: "EEE", subjectCode: "EE101" },
  { hallTicket: "4", branch: "MECH", subjectCode: "ME101" }
];

const result = allocateGreedy(classrooms, students);
assert.equal(result.isComplete, true);
assert.equal(result.unallocatedStudents.length, 0);

classrooms[0].matrix.forEach((row, rowIndex) => {
  row.forEach((student, colIndex) => {
    assert.equal(conflictScore(classrooms[0].matrix, rowIndex, colIndex, student), 0);
  });
});

console.log("greedyAllocator test passed");

const overflowClassroom = [{ roomNumber: "B101", matrix: [[null]] }];
const overflowResult = allocateGreedy(overflowClassroom, students.slice(0, 2));
assert.equal(overflowResult.isComplete, false);
assert.equal(overflowResult.unallocatedStudents.length, 1);

console.log("greedyAllocator capacity handling passed");
