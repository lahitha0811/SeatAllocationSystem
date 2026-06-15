require("dotenv").config();

const connectDB =
  require("../config/db");

const {
  buildAllocationData
} = require(
  "../modules/allocation/allocation.service"
);

const createClassroomMatrices =
  require(
    "../modules/allocation/utils/createClassroomMatrices"
  );

const backtrackingAllocate =
  require(
    "../modules/allocation/engine/backtrackingAllocator"
  );

const sortStudentsByConstraint =
  require(
    "../modules/allocation/utils/sortStudentsByConstraint"
  );

  const persistAllocation =
  require(
    "../modules/allocation/utils/persistAllocation"
  );

async function testAllocator() {

  try {

    /* ---------------- CONNECT DB ---------------- */

    await connectDB();

    console.log(
      "MongoDB connected"
    );

    /* ---------------- FETCH DATA ---------------- */

    const {
      allocationData,
      classrooms
    } =
      await buildAllocationData();

    // console.log(
    //   "Allocation data loaded"
    // );

    // console.log(
    //   `Students Loaded: ${allocationData.length}`
    // );

    // console.log(
    //   `Classrooms Loaded: ${classrooms.length}`
    // );

    /* ===================================================
       FILTER SESSION
    =================================================== */

    let students =
      allocationData.filter(
        (student) =>

          student.session === "FN"
      );

    /* ===================================================
       REMOVE DUPLICATES
       SAME STUDENT SHOULD NOT APPEAR TWICE
    =================================================== */

    const uniqueStudentsMap =
      {};

    students.forEach((student) => {

      if (
        !uniqueStudentsMap[
          student.hallTicket
        ]
      ) {

        uniqueStudentsMap[
          student.hallTicket
        ] = student;
      }
    });

    students =
      Object.values(
        uniqueStudentsMap
      );

    // console.log(
    //   `After Duplicate Removal: ${students.length}`
    // );

    /* ===================================================
       TEST SMALL DATA FIRST
    =================================================== */

    students =
      students.slice(0, 150);

    // console.log(
    //   `Testing with ${students.length} students`
    // );

    /* ===================================================
       HEURISTIC SORT
    =================================================== */

    students =
      sortStudentsByConstraint(
        students
      );

    /* ===================================================
       CREATE CLASSROOM MATRICES
    =================================================== */

    const classroomMatrices =
      createClassroomMatrices(
        classrooms
      );

    // console.log(
    //   "Classroom matrices created"
    // );

    /* ===================================================
       RUN ALLOCATOR
    =================================================== */

    // console.log(
    //   "Starting allocation..."
    // );

    const start =
      Date.now();

    const success =
      backtrackingAllocate(
        classroomMatrices,
        students
      );

    const end =
      Date.now();

    // console.log(
    //   `Execution Time: ${
    //     end - start
    //   } ms`
    // );

    /* ===================================================
       RESULT
    =================================================== */
let totalAllocated = 0;

    if (success) {

      // console.log(
      //   "Allocation successful"
      // );
   await persistAllocation(
  classroomMatrices
);

      classroomMatrices.forEach(
        (classroom) => {

          // console.log(
          //   `\n===== ROOM ${classroom.roomNumber} =====`
          // );

          const simplifiedMatrix =
            classroom.matrix.map(
              (row) =>

                row.map(
                  (seat) => {

                    if (!seat) {
                      return "EMPTY";
                    }

                    totalAllocated++;

                    return seat.hallTicket;
                  }
                )
            );

          // console.table(
          //   simplifiedMatrix
          // );

          const totalSeats =
            classroom.matrix.length *
            classroom.matrix[0].length;

          // console.log(
          //   `Capacity: ${totalSeats}`
          // );
        }
      );

      // console.log(
      //   `Allocated Students: ${totalAllocated}`
      // );

    } else {

      // console.log(
      //   "Allocation failed"
      // );
    }
let totalSeats = 0;
let usedRooms = 0;

classroomMatrices.forEach(
  (classroom) => {

    const roomCapacity =
      classroom.matrix.length *
      classroom.matrix[0].length;

    totalSeats += roomCapacity;

    const hasStudents =
      classroom.matrix.some(
        (row) =>

          row.some(
            (seat) => seat
          )
      );

    if (hasStudents) {
      usedRooms++;
    }
  }
);

// console.log(
//   `Total Seats Available: ${totalSeats}`
// );

// console.log(
//   `Rooms Used: ${usedRooms}`
// );

// console.log(
//   `Utilization: ${(
//     (totalAllocated / totalSeats) * 100
//   ).toFixed(2)}%`
// );
    process.exit();

  } catch (error) {

    console.error(
      "Allocator Error:",
      error
    );

    process.exit(1);
  }
}

testAllocator();