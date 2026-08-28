const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],             [0, 1],
  [1, -1],  [1, 0],    [1, 1]
];

const conflictScore = (matrix, row, col, student) => {
  let score = 0;

  for (const [rowOffset, colOffset] of directions) {
    const neighbor = matrix[row + rowOffset]?.[col + colOffset];

    if (!neighbor) continue;
    if (neighbor.branch === student.branch) score += 10;
    if (neighbor.subjectCode === student.subjectCode) score += 15;
  }

  return score;
};

const orderStudents = (students) => {
  const branchCounts = new Map();
  const subjectCounts = new Map();

  students.forEach((student) => {
    branchCounts.set(student.branch, (branchCounts.get(student.branch) || 0) + 1);
    subjectCounts.set(student.subjectCode, (subjectCounts.get(student.subjectCode) || 0) + 1);
  });

  return [...students].sort((first, second) => {
    const firstDifficulty =
      (branchCounts.get(first.branch) || 0) +
      (subjectCounts.get(first.subjectCode) || 0);
    const secondDifficulty =
      (branchCounts.get(second.branch) || 0) +
      (subjectCounts.get(second.subjectCode) || 0);

    return secondDifficulty - firstDifficulty ||
      first.hallTicket.localeCompare(second.hallTicket);
  });
};

const findBestSeat = (classrooms, student) => {
  let best = null;

  classrooms.forEach((classroom) => {
    classroom.matrix.forEach((row, rowIndex) => {
      row.forEach((seat, colIndex) => {
        if (seat) return;

        const conflicts = conflictScore(
          classroom.matrix,
          rowIndex,
          colIndex,
          student
        );

        const candidate = {
          classroom,
          row: rowIndex,
          col: colIndex,
          conflicts,
          // Prefer filling an already-used room only when constraint scores tie.
          occupancy: classroom.occupiedCount
        };

        if (!best ||
          candidate.conflicts < best.conflicts ||
          (candidate.conflicts === best.conflicts &&
            candidate.occupancy > best.occupancy)) {
          best = candidate;
        }
      });
    });
  });

  return best;
};

const repairWithEmptySeats = (classrooms, iterations = 2) => {
  for (let pass = 0; pass < iterations; pass += 1) {
    let improved = false;

    classrooms.forEach((classroom) => {
      classroom.matrix.forEach((row, rowIndex) => {
        row.forEach((student, colIndex) => {
          if (!student) return;

          const currentScore = conflictScore(
            classroom.matrix,
            rowIndex,
            colIndex,
            student
          );

          if (currentScore === 0) return;

          classroom.matrix[rowIndex][colIndex] = null;
          classroom.occupiedCount -= 1;
          const betterSeat = findBestSeat(classrooms, student);

          if (betterSeat && betterSeat.conflicts < currentScore) {
            betterSeat.classroom.matrix[betterSeat.row][betterSeat.col] = student;
            betterSeat.classroom.occupiedCount += 1;
            improved = true;
          } else {
            classroom.matrix[rowIndex][colIndex] = student;
            classroom.occupiedCount += 1;
          }
        });
      });
    });

    if (!improved) break;
  }
};

const allocateGreedy = (classrooms, students) => {
  classrooms.forEach((classroom) => {
    classroom.occupiedCount = 0;
  });

  const unallocatedStudents = [];

  orderStudents(students).forEach((student) => {
    const seat = findBestSeat(classrooms, student);

    if (!seat) {
      unallocatedStudents.push(student);
      return;
    }

    seat.classroom.matrix[seat.row][seat.col] = student;
    seat.classroom.occupiedCount += 1;
  });

  repairWithEmptySeats(classrooms);

  return {
    unallocatedStudents,
    isComplete: unallocatedStudents.length === 0
  };
};

module.exports = {
  allocateGreedy,
  conflictScore
};
