const Allocation =
  require("../../../models/Allocation");

const persistAllocation =
  async (classroomMatrices) => {

    /* ---------------- CLEAR OLD ALLOCATIONS ---------------- */

    await Allocation.deleteMany({});

    const allocationDocs = [];

    classroomMatrices.forEach(
      (classroom) => {

        classroom.matrix.forEach(
          (row, rowIndex) => {

            row.forEach(
              (seat, colIndex) => {

                if (seat) {

                  allocationDocs.push({

                    roomNumber:
                      classroom.roomNumber,

                    row:
                      rowIndex,

                    col:
                      colIndex,

                    hallTicket:
                      seat.hallTicket,

                    branch:
                      seat.branch,

                    subjectCode:
                      seat.subjectCode,

                    session:
                      seat.session,

                    examDate:
                      seat.examDate
                  });
                }
              }
            );
          }
        );
      }
    );

    await Allocation.insertMany(
      allocationDocs
    );

    console.log(
      `${allocationDocs.length} allocations saved`
    );
  };

module.exports =
  persistAllocation;